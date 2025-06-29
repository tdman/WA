package aws.community.examples.bedrock.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class QuestionSearchRequest {
    private String mode;              // "standard", "wrong", "type"
    private Integer count;

    private String subjectType;
    private String questionType;
    private String difficulty;  // type 모드에서 사용
    //    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate since;    // updated_at 조건 검색



}
