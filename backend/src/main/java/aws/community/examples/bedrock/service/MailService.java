package aws.community.examples.bedrock.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.activation.DataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;


@Service
public class MailService {
    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     *
     * @param to 수신자 메일
     * @param subject 메일 제목
     * @param htmlText 메일 본문
     * @param imageBytes 이미지 바이트 배열
     * @param contentType 이미지 컨텐츠 타입 (예: "image/png", "image/jpeg")
     * @throws MessagingException
     */
    public void sendMailWithInlineImageBytes(String to, String subject, String htmlText, byte[] imageBytes, String contentType) throws MessagingException {
        String html = "<html><body>"+ htmlText +"<br><img src='cid:image1'></body></html>";// Set the recipient, subject, and HTML content

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);

        DataSource dataSource = new ByteArrayDataSource(imageBytes, contentType);
        helper.addInline("image1", dataSource);

        mailSender.send(message);
    }
}