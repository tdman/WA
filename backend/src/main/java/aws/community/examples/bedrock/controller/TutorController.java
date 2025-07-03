package aws.community.examples.bedrock.controller;

import aws.community.examples.bedrock.common.CmResponse;
import aws.community.examples.bedrock.common.CmResponseFactory;
import aws.community.examples.bedrock.dto.TutorsDto;
import aws.community.examples.bedrock.mapper.TutorsMapper;
import aws.community.examples.bedrock.service.WeaviateService;
import aws.community.examples.bedrock.util.S3Util;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/tutors")
@Tag(name = "튜터 API", description = "튜터 관련 API입니다.")
public class TutorController {

    @Autowired
    TutorsMapper tutorsMapper;

    @Autowired
    S3Util s3Util;

    @Autowired
    WeaviateService weaviateService;

    @Description("모든 튜터 조회")
    @GetMapping("/all")
    public CmResponse<List<TutorsDto>> getStudentInfo() {
        try {
            List<TutorsDto> tutorsListNew = tutorsMapper.getTutorsList().stream()
                    .peek(tutor -> log.info("튜터 정보: {}", tutor))
                    .peek(tutor -> {
                        byte[] img = null;
                        try {
                            img = s3Util.readS3Img("testfilewa", tutor.getProfileImg());
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                        String base64 = Base64.getEncoder().encodeToString(img);
                        tutor.setProfileImgBytes(base64);
                    })
                    .collect(Collectors.toList());

            //weaviateService.createSchema("Tutors");
            //weaviateService.insertDtoListToWeaviate(tutorsListNew, "Tutors", "name");

            return CmResponseFactory.success(tutorsListNew);
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
            List<TutorsDto> tutorsListNew = tutorsMapper.getTutorScheduleList(tutorId);
            if (tutorsListNew != null && !tutorsListNew.isEmpty()) {
                TutorsDto firstTutor = tutorsListNew.get(0);
                byte[] img = s3Util.readS3Img("testfilewa", firstTutor.getProfileImg());
                String base64 = Base64.getEncoder().encodeToString(img);
                firstTutor.setProfileImgBytes(base64);
            }
            return CmResponseFactory.success(tutorsListNew);
        } catch (Exception e) {
            log.error("getTutorInfo err: ", e);
            return CmResponseFactory.fail("튜터 정보 조회 실패");
        }
    }
}
