package aws.community.examples.bedrock.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentResponse {
    private String studentId;
    private String name;
    private String mbti;
    private String email;
    private String tutorId;
    private String createdAt;
    private String updateAt;
}

