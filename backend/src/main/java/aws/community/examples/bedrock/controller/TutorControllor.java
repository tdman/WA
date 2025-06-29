package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.TutorsDto;
import aws.community.examples.bedrock.mapper.TutorsMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/tutors")
@Tag(name = "튜터 API", description = "튜터 관련 API입니다.")
public class TutorControllor {

    @Autowired
    TutorsMapper tutorsMapper;


    @Description("모든 튜터 조회")
    @GetMapping("/all")
    public CmResponse<List<TutorsDto>> getStudentInfo() {
        try {
            return CmResponseFactory.success(tutorsMapper.getTutorsList());
        } catch (Exception e) {
            log.error("Error fetching tutors list: ", e);
            return CmResponseFactory.fail("튜터 정보 조회 실패");
        }
    }

    @Description("1튜터 스케줄 정보 조회")
    @GetMapping("/schedule/{tutorId}")
    public CmResponse<List<TutorsDto>> getTutorScheduleList(@PathVariable String tutorId) {
        log.info("Fetching tutor info for ID: {}", tutorId);
        try {
            List<TutorsDto> tutorScheduleList = tutorsMapper.getTutorScheduleList(tutorId);
            return CmResponseFactory.success(tutorScheduleList);
        } catch (Exception e) {
            log.error("getTutorInfo err: ", e);
            return CmResponseFactory.fail("튜터 정보 조회 실패");
        }
    }
}
