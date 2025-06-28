package aws.community.examples.bedrock.common;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CmResponse<T> {
    private boolean success;
    private String message;
    private T payload;

    public CmResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.payload = data;
    }

    public static <T> CmResponse<T> of(boolean success, String message, T data) {
        return new CmResponse<T>(success, message, data);
    }
}