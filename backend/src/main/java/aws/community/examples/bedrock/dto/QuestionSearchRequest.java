package aws.community.examples.bedrock.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class QuestionSearchRequest {
    private String mode;              // "standard", "wrong", "type"
    private String subject;           // 예: "math"
    private List<String> types;       // 예: ["사고력", "추론"] (mode=type일 때 필수)
    private Integer count;

//    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate since;          // mode=wrong일 때 선택

    private String difficulty;  // type 모드에서 사용
}
