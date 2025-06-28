package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.util.S3Util;
import aws.community.examples.bedrock.util.TestUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/problems")
public class ProblemsController {

    private static final Logger log = LoggerFactory.getLogger(ProblemsController.class);

    @Autowired
    S3Util s3Util;

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
//return CmResponseFactory.success(jo.toMap());
            return jo.toMap();
        } catch (Exception e) {
            return Map.of();
//            return CmResponseFactory.fail("Error reading probs info: " + e.getMessage());
        }
    }
}