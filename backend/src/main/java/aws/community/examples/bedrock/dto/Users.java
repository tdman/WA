package aws.community.examples.bedrock.dto;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"users\"", schema = "public")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mbti;
    private int age;
}
