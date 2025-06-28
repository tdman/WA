package aws.community.examples.bedrock.util;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Component
public class S3Util {

    private static final Logger log = LoggerFactory.getLogger(S3Util.class);

    private final S3Client s3Client;

    public S3Util(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public JSONObject readS3File (String bucketName, String key) throws Exception {
        JSONObject ret = new JSONObject();
        try {
            // 예: s3Client.getObject(GetObjectRequest.builder().bucket(bucketName).key(key).build());
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseInputStream<GetObjectResponse> inputStream = s3Client.getObject(getObjectRequest);
            ret = TestUtil.mkResponse(TestUtil.readIs(inputStream));
            log.info("File content from S3: {}", ret);
        } catch (Exception e) {
            log.error("Error reading file from S3:", e);
            throw new Exception("S3Util ERROR: " + e.getMessage());
        }
        return ret;
    }

    public byte[] readS3Img (String bucketName, String key) throws Exception {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            // S3에서 이미지 바이트로 읽어오기
            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
            byte[] imgBytes = objectBytes.asByteArray();
            log.info("Image content from S3: {} bytes", imgBytes.length);
            return imgBytes;
        } catch (Exception e) {
            log.error("Error reading image from S3:", e);
            throw new Exception("S3Util ERROR: " + e.getMessage());
        }
    }
}
