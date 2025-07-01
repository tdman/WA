package aws.community.examples.bedrock.mapper;

import aws.community.examples.bedrock.dto.ScreenRoutesDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScreenRoutesMapper {
  List<ScreenRoutesDto> getScreenRoutes(); // 화면 경로 목록 조회
}
