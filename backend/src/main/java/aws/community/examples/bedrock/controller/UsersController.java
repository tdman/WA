package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.dto.Users;
import aws.community.examples.bedrock.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/info")
public class UsersController {

    @Autowired
    UsersRepository userRepository;

    @GetMapping("/all")
    public List<Users> getUsers() {

        return userRepository.findAll();
    }
}
