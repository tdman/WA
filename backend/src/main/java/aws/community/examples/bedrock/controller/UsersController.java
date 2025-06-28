package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.Users;
import aws.community.examples.bedrock.repository.UsersRepository;
import aws.community.examples.bedrock.util.S3Util;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//@Slf4j
@RestController
@RequestMapping("/users/info")
public class UsersController {

    private static final Logger log = LoggerFactory.getLogger(UsersController.class);

    @Autowired
    UsersRepository userRepository;

    @Value("${app.file.users}")
    private String usersFilePath;

    @Value("${app.file.problems}")
    private String probsFilePath;

    @Autowired
    S3Util s3Util;

    @GetMapping("/alltmp")
    public CmResponse<List<Users>> getUsers() {

        return CmResponseFactory.success(userRepository.findAll());
    }

    @GetMapping(value="/all")
    public Map<String, Object> getAllUsers() {
        try {
            log.info("TEST [{}]", usersFilePath);
            JSONObject jo = s3Util.readS3File("testfilewa", "users.json");
            //Map<String, Object> jm = jo.toMap();
            //CmResponseFactory.success(jo.toMap());
            return jo.toMap();
        } catch (Exception e) {
            log.error("Error reading user info: ", e);
            return Map.of();
        }
    }
}
