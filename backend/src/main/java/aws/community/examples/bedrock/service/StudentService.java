package aws.community.examples.bedrock.service;

import aws.community.examples.bedrock.dto.StudentDto;
import aws.community.examples.bedrock.mapper.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentMapper studentMapper;

    public boolean updateUserField(String studentId, String field, String value) {
        StudentDto studentInfo = studentMapper.getStudentInfo(studentId);
        if (studentInfo == null) return false;

        switch (field) {
            case "email":
                studentInfo.setEmail(value);
                break;
            default:
                return false;
        }

        studentMapper.updateStudent(studentInfo);
        return true;
    }

    public StudentDto getStudentInfo(String studentId) {
        return studentMapper.getStudentInfo(studentId);
    }

}
