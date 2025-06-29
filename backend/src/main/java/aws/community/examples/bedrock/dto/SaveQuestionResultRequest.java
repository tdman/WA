package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class SaveQuestionResultRequest {
    private String studentId;       // 학습자아이디
    private String attemptId;       // 문제묶음아이디
    private String questionId;      // 문제아이디
    private String resultAnswer;    // 학습자입력값
    private String resultTimeSec;   // 문제풀이소요시간
    private String resultIsMarked;  // 다시풀고싶은문제체크

    private Integer resultId;
}
