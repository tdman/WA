package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.aimodels.Titan;
import io.weaviate.client.Config;
import io.weaviate.client.WeaviateClient;
import io.weaviate.client.base.Result;
import io.weaviate.client.v1.data.model.WeaviateObject;
import io.weaviate.client.v1.graphql.model.GraphQLResponse;
import io.weaviate.client.v1.graphql.query.argument.NearVectorArgument;
import io.weaviate.client.v1.graphql.query.fields.Field;
import io.weaviate.client.v1.schema.model.Property;
import io.weaviate.client.v1.schema.model.WeaviateClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class WeaviateService {
    private final WeaviateClient weaviateClient;
    private final BedrockRuntimeClient bedrockClient;

    @Autowired
    public WeaviateService(BedrockRuntimeClient client) {
        this.weaviateClient = new WeaviateClient(new Config("http", "localhost:8080"));
        this.bedrockClient = client;
    }

    public void createSchema(String className) {

        WeaviateClass weaviateClass = WeaviateClass.builder()
                .className(className)
                .vectorizer("none")
                .properties(List.of(
                        Property.builder().name("dtoText").dataType(List.of("text")).build()
                ))
                .build();

        weaviateClient.schema().classCreator()
                .withClass(weaviateClass)
                .run();
    }

    public <T> void insertDtoListToWeaviate(List<T> dtoList, String className, String textFieldName) {
        for (T dto : dtoList) {
            try {
                var field = dto.getClass().getDeclaredField(textFieldName);
                field.setAccessible(true);
                String text = (String) field.get(dto);

                // DTO의 모든 필드명과 값을 "name : Sam, age : 17" 형식으로 변환
                StringBuilder sb = new StringBuilder();
                var fields = dto.getClass().getDeclaredFields();
                for (int i = 0; i < fields.length; i++) {
                    fields[i].setAccessible(true);

                    if (fields[i].getName().contains("Img")) continue; // 이미지 필드는 제외
                    if (fields[i].get(dto) == null) continue; // null 값은 제외

                    sb.append(fields[i].getName())
                            .append(" : ")
                            .append(fields[i].get(dto));
                    if (i < fields.length - 1) sb.append(", ");
                }
                String dtoText = sb.toString();

                Titan titan = new Titan(bedrockClient);
                Float[] embedding = titan.embed(text);

                Result<WeaviateObject> result = weaviateClient.data().creator()
                        .withClassName(className)
                        .withProperties(Map.of("dtoText", dtoText))
                        .withVector(embedding)
                        .run();

                log.info("Failed to insert DTO to Weaviate: {}", result.toString());

            } catch (Exception e) {
                log.error("Error inserting DTO to Weaviate: {}", e.getMessage(), e);
            }
        }
    }

    public List<String> searchSimilarTexts(Float[] queryVector, int topK, String className) {
        NearVectorArgument nearVector = NearVectorArgument.builder()
                .vector(queryVector)
                .build();

        Result<GraphQLResponse> response = weaviateClient.graphQL().get()
                .withClassName(className) // 클래스 이름
                .withNearVector(nearVector)
                .withFields(Field.builder().name("dtoText").build())
                .withLimit(topK)
                .run();

        if (response == null
                || response.getResult() == null
                || response.getError() != null
                || response.getResult().getData() == null
        ) {
            return List.of();
        }

        Map<String, Object> data = (Map<String, Object>) response.getResult().getData();
        if (data == null || !data.containsKey("Get")) return List.of();
        Map<String, Object> get = (Map<String, Object>) data.get("Get");
        if (!get.containsKey(className)) return List.of();
        List<Map<String, Object>> items = (List<Map<String, Object>>) get.get(className);

        return items.stream()
                .map(item -> (String) item.get("dtoText"))
                .toList();
    }
}