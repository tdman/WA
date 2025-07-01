package aws.community.examples.bedrock.dto;

import lombok.Data;

@Data
public class ScreenRoutesDto {
    private String screenName; // 화면 이름
    private String screenPath; // 화면 경로
}
