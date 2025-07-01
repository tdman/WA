package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class TutorsDto {

    private String tutorId;
    private String name;
    private String tutorMbti;
    private String email;
    private String phone;
    private String studentId;
    private String studentMbti;
    private String scheduleDate;
    private String scheduleHour;
    private String profileImg;
    private String profileImgBytes;
}
