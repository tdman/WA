package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.service.ChatService;
import aws.community.examples.bedrock.service.StudentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat/support/")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/bot")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) throws JsonProcessingException {
        String studentId = request.getStudentId();

        // TODO: delete
        studentId = "STU9";
        return ResponseEntity.ok(chatService.getResponse(request, studentId));
    }
}