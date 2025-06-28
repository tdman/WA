package aws.community.examples.bedrock.common;

public class CmResponseFactory {
    public static <T> CmResponse<T> success(T data) {
        return CmResponse.of(true, "성공", data);
    }

    public static <T> CmResponse<T> fail(String message) {
        return CmResponse.of(true, message, null);
    }
}

