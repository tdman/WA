package aws.community.examples.bedrock.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
   
	@Id
	private String studentId;
    private String name;
    private String mbti;
    private String email;
    private String tutorId;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    
}