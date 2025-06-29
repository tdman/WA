package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.QuestionSearchRequest;
import aws.community.examples.bedrock.util.S3Util;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/questions")
@Tag(name = "문제 API", description = "문제 관련 API입니다.")
public class QuestionsController {

    private static final Logger log = LoggerFactory.getLogger(QuestionsController.class);

    @Autowired
    S3Util s3Util;

    @PostMapping("/search")
    public Map<String, Object> searchQuestions(@RequestBody QuestionSearchRequest request) {
        try {
//            JSONObject jo = JsonUtil.readLocalQuestions();
            JSONObject jo = s3Util.readS3File("testfilewa", "questions.json");
            JSONArray ja = jo.getJSONArray("data");

            JSONArray filtered = new JSONArray();

            for (int i = 0; i < ja.length(); i++) {
                JSONObject item = ja.getJSONObject(i);

                // 공통: 과목 필터
                if (request.getSubject() != null && !request.getSubject().isBlank()) {
                    if (!item.optString("subject", "").equalsIgnoreCase(request.getSubject())) continue;
                }

                // 모드별 필터
                if ("wrong".equals(request.getMode())) {
                    if (request.getSince() != null) {
                        String lastWrong = item.optString("lastWrong", "");
                        if (lastWrong.compareTo(String.valueOf(request.getSince())) < 0) continue;
                    }
                }

                if ("type".equals(request.getMode())) {
                    if (request.getTypes() != null && !request.getTypes().contains(item.optString("type", ""))) continue;
                    if (request.getDifficulty() != null && !request.getDifficulty().equals(item.optString("difficulty", ""))) continue;
                }

                filtered.put(item);
                if (request.getCount() != null && filtered.length() >= request.getCount()) break;
            }

            jo.put("data", filtered);
            return jo.toMap();
        } catch (Exception e) {
            log.error("질문 검색 중 오류 발생", e);
            return Map.of("error", "internal server error");
        }
    }




    @GetMapping("/get/{cnt}")
    public Map<String, Object> getAllProbs(@PathVariable String cnt) {
        try {
            int probCnt = Integer.parseInt(cnt);

            JSONObject jo = s3Util.readS3File("testfilewa", "problems.json");

            JSONArray ja = jo.getJSONArray("data");

            if (ja.length() > probCnt) {
                JSONArray ja2 = new JSONArray();
                for (int i = 0; i < probCnt; i++) {
                    ja2.put(ja.get(i));
                    JSONObject tmp = (JSONObject)ja.get(i);

                    byte[] img = s3Util.readS3Img("woongae", tmp.getString("img"));
                    String base64 = Base64.getEncoder().encodeToString(img);
                    tmp.put("img", img); // Assuming you want to replace the image path with the byte array
                    ja2.put(tmp);
                }
                jo.put("data", ja2);
            }
            return jo.toMap();
        } catch (Exception e) {
            return Map.of();
        }
    }
}