package aws.community.examples.bedrock.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import aws.community.examples.bedrock.domain.Student;
import aws.community.examples.bedrock.dto.StudentRequest;
import aws.community.examples.bedrock.dto.StudentResponse;
import aws.community.examples.bedrock.repository.StudentRepository;

import java.time.ZonedDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentResponse createStudent(StudentRequest request) {
        Student student = new Student(
                request.getStudentId(),
                request.getName(),
                request.getMbti(),
                request.getEmail(),
                request.getTutorId(),
                ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString(),
                ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString()
        );
      

        studentRepository.save(student);

        return new StudentResponse(
                student.getStudentId(),
                student.getName(),
                student.getMbti(),
                student.getEmail(),
                student.getTutorId(),
                student.getCreatedAt(),
                student.getUpdateAt()
        );
    }
}
