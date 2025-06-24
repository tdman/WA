package aws.community.examples.bedrock;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrock.BedrockClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

@SpringBootApplication
public class SpringFmPlaygroundApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringFmPlaygroundApplication.class, args);
	}

	@Value("${aws.region}")
	private String region;

	private final AwsBasicCredentials AWS_CREDS = AwsBasicCredentials.create(System.getProperty("AWS_ACCESS_KEY_ID"), System.getProperty("AWS_SECRET_ACCESS_KEY"));

	@Bean
	public BedrockClient bedrockClient() {
		return BedrockClient.builder()
				.region(Region.of(region ))
				.credentialsProvider(StaticCredentialsProvider.create(AWS_CREDS))
				.build();
	}

	@Bean
	public BedrockRuntimeClient client() {
		return BedrockRuntimeClient.builder()
				.region(Region.of(region))
				.credentialsProvider(StaticCredentialsProvider.create(AWS_CREDS))
				.build();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				// Enable CORS for all domains, remember to change this for production purposes
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

}
