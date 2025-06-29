package aws.community.examples.bedrock.dto;


import lombok.Data;

@Data
public class StudentRequest {
    private String studentId;
    private String name;
    private String mbti;
    private String email;
    private String tutorId;
}

