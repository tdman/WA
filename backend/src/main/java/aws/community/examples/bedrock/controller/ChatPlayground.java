package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.aimodels.Claude;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.AccessDeniedException;


import static aws.community.examples.bedrock.aimodels.LLM.Request;
import static aws.community.examples.bedrock.aimodels.LLM.Response;

@RestController
@RequestMapping("/chat/support/")
public class ChatPlayground {

    private static final Logger logger = LoggerFactory.getLogger(ChatPlayground.class);

    private final BedrockRuntimeClient client;

    @Autowired
    public ChatPlayground(final BedrockRuntimeClient client) {
        this.client = client;
    }

    @PostMapping("/conversation")
    public Response invoke(@RequestBody Request body) {
        try {

            String sysPrompt = "You are a friendly chatbot for an elementary school study app." +
                    "Please explain things clearly and kindly when users ask questions." +
                    "If you don’t know the answer, politely say," +
                    "\"For more detailed inquiries, please call 1234-1234.\"" +
                    "Always maintain a warm and gentle tone.";

            String prompt = sysPrompt + "\n\n" + body.prompt();

            return new Response(Claude.invoke(client, prompt, 0.8, 4096));

        } catch (AccessDeniedException e) {
            logger.error("Access Denied: %s".formatted(e.getMessage()));
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            logger.error("Exception: %s".formatted(e.getMessage()));
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
