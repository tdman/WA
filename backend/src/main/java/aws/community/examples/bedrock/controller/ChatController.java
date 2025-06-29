package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.ChatRequest;
import aws.community.examples.bedrock.dto.ChatResponse;
import aws.community.examples.bedrock.service.ChatService;
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
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.getResponse(request));
    }
}