package aws.community.examples.bedrock.repository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import aws.community.examples.bedrock.domain.Student;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

@Repository
public class StudentRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String TABLE_NAME = "students";

    public StudentRepository(DynamoDbClient client) {
        this.dynamoDbClient = client;
    }

    public void save(Student student) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("student_id", AttributeValue.fromS(student.getStudentId()));
        item.put("name", AttributeValue.fromS(student.getName()));
        item.put("tutor_id", AttributeValue.fromS(student.getTutorId()));
        item.put("mbti", AttributeValue.fromS(student.getMbti()));
        item.put("email", AttributeValue.fromS(student.getEmail()));
        item.put("created_at", AttributeValue.fromS(student.getCreatedAt()));

        dynamoDbClient.putItem(PutItemRequest.builder()
                .tableName(TABLE_NAME)
                .item(item)
                .build());
    }
}

