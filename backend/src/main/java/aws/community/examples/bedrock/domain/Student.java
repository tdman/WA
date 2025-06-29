package aws.community.examples.bedrock.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    private String studentId;
    private String name;
    private String mbti;
    private String email;
    private String tutorId;
    private String createdAt;
    private String updateAt;
}
