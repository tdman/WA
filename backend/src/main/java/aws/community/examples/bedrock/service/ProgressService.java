package aws.community.examples.bedrock.service;

import org.springframework.stereotype.Service;

@Service
public interface ProgressService {
    String generateProgress(String studentId);
}
