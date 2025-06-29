package aws.community.examples.bedrock.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorsDto {

    @Id
    private String tutorId;
    private String name;
    private String mbti;
    private String email;
    private String phone;
}
