package aws.community.examples.bedrock.service;

import org.springframework.stereotype.Service;

@Service
public interface FeedbackService {
    String generateFeedback(String studentId);
}
