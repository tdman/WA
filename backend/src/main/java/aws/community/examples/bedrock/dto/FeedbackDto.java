package aws.community.examples.bedrock.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDto {
	
	// question 테이블														
    private String questionId;					// 문제  ID (예: MATH-4-001)									
    private String subjectType;					// 문제 과목									
    private String difficulty;					// 난이도 (상, 중, 하)									
    private String questionContent;				// 문제 본문										
    private String answer;						// 정답								
    private String explanation;					// 해설 문장									
    private String questionType;				// 문제 유형										
    private String tags;						// 문제 키워드 또는 태그								
    private String avgSolveTimeSec;				// 평균 풀이 시간										
    private String imageUrl;					// 문제 이미지 링크	
	
    // question_results 테이블					// 식별값													
    private Integer resultId;					// 학생 ID													
    private String studentId;					// 문제묶음아이디													
    private String attemptId;					// 문제아이디													
    private String resultAnswer;				// 사용자제출정답값														
    private String resultTimeSec;				// 문제풀이소요시간														
    private String resultIsMarked;    			// 이해도여부		YN											
    private String resultIsCorrect;   			// 정답여부		YN
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
/*
// questions
    	subject_type = '수학',
    	difficulty = '상',
    	question_content = '45 * 66 = ?',
    	answer = '2970',
    	explanation = '문제 15에 대한 설명입니다.',
    	question_type = '사고력',
    	tags = '["연산", "고등", "초등", "중등"]',
    	avg_solve_time_sec = '16',
    	image_url = '',
    	created_at = '2025-05-17 00:00:00',
    	updated_at = '2025-05-17 00:00:00'
   
          
 // question_results
	 	student_id = 'STU1',
	 	attempt_id = '20250629-STU1-3',
	 	question_id = 'math_logic_4',
	 	result_answer = '2970',
	 	result_time_sec = '13',
	 	result_is_marked = 'N',
	 	result_is_correct = null,
	 	created_at = '2025-06-29 22:44:15',
	 	updated_at = '2025-06-29 22:44:15'

*/
}