package aws.community.examples.bedrock.repository;

import aws.community.examples.bedrock.dto.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
