package com.testing.springpractice.messagingsystem.ServiceImplementations;


import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.VerifyEmailRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects.EmailRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects.GroupEmailRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects.Receiver;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects.Sender;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageNotificationEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmailService {
    private final RestTemplate restTemplate;
    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @KafkaListener(topics = "Message.emailService.sendOtp", groupId = "EmailService")
    public void sendOtp(VerifyEmailRequest verifyEmailRequest) {
        String subject = "Verify Your Email";

        String html = """
                <h2>Email Verification</h2>
                <p>Hello user,</p>
                <p>Your OTP is:</p>
                <h1>%s</h1>
                <p>This OTP is valid for 5 minutes.</p>
                """.formatted(verifyEmailRequest.otp);


        Sender sender = Sender.builder()
                .name(senderName)
                .email(senderEmail)
                .build();
        System.out.println("abc");
        Receiver receiver = Receiver.builder()
                .email(verifyEmailRequest.getUsername())
                .build();
        EmailRequest request = EmailRequest.builder()
                .sender(sender)
                .to(List.of(receiver))
                .subject(subject)
                .htmlContent(html)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @DltHandler
    public void failedEmail(VerifyEmailRequest verifyEmailRequest){
        System.out.println("Failed to send email to " + verifyEmailRequest.username);
    }

    @KafkaListener(
            topics = "Message.InviteToApp.User",
            groupId = "Email_service"
    )
    public void sendAppInvite(String query) {
        String[] arr = query.split(" ", 2);
        String newUser = arr[0];
        String name = arr.length > 1 ? arr[1] : "Someone";
        String subject = "You've been invited to join CompanyConnect";

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #111827; margin-bottom: 16px;">You're Invited!</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Hello,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        <strong>%s</strong> has invited you to join their workspace on <strong>CompanyConnect</strong>.
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Create your account to start collaborating with your team, join companies, and send messages.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                    </div>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="color: #6b7280; font-size: 13px;">
                        If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                </div>
                """.formatted(name);


        Sender sender = Sender.builder()
                .name(senderName)
                .email(senderEmail)
                .build();
        Receiver receiver = Receiver.builder()
                .email(newUser)
                .build();
        EmailRequest request = EmailRequest.builder()
                .sender(sender)
                .to(List.of(receiver))
                .subject(subject)
                .htmlContent(html)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @DltHandler
    public void failedInvite(String query){
        System.out.println("Failed to send Email" + query);
    }

    @KafkaListener(topics = "Message.PendingRequest.User",
                    groupId = "Email_service")
    public void sendPendingRequestReminder(String recipientEmail) {
        String subject = "Pending Invitation Reminder";

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #111827; margin-bottom: 16px;">Invitation Reminder</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Hello,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        You have a pending invitation to join a company workspace on <strong>CompanyConnect</strong>.
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Log in to your account to review and accept the invitation.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="color: #6b7280; font-size: 13px;">
                        If you believe you received this in error, you can ignore this email.
                    </p>
                </div>
                """;

        Sender sender = Sender.builder()
                .name(senderName)
                .email(senderEmail)
                .build();
        Receiver receiver = Receiver.builder()
                .email(recipientEmail)
                .build();
        EmailRequest request = EmailRequest.builder()
                .sender(sender)
                .to(List.of(receiver))
                .subject(subject)
                .htmlContent(html)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("Pending reminder email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send pending reminder email: " + e.getMessage());
        }
    }
    @KafkaListener(topics = "Message.SendInvite.User",
            groupId = "Email_service")
    public void sendCompanyInvite(String recipientEmail) {
        String subject = "You've been invited to join a company!";

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #111827; margin-bottom: 16px;">New Company Invitation</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Hello,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        You have received a new invitation to join a workspace on <strong>CompanyConnect</strong>.
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                        Log in to your workspace dashboard to accept the invitation and start collaborating with your team.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="color: #6b7280; font-size: 13px;">
                        If you did not expect this invitation, please contact your administrator.
                    </p>
                </div>
                """;

        Sender sender = Sender.builder()
                .name(senderName)
                .email(senderEmail)
                .build();
        Receiver receiver = Receiver.builder()
                .email(recipientEmail)
                .build();
        EmailRequest request = EmailRequest.builder()
                .sender(sender)
                .to(List.of(receiver))
                .subject(subject)
                .htmlContent(html)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("Company invite email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send company invite email: " + e.getMessage());
        }
    }

    @KafkaListener(topics = "Message.emailService.newBroadcast", groupId = "EmailService")
    public void sendEmail(MessageNotificationEvent event) {
        String subject = event.getSubject();

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #111827; margin-bottom: 16px;">New Message in %s</h2>
                    <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
                        <strong>From:</strong> %s
                    </p>
                    <p style="color: #374151; font-size: 15px; margin-bottom: 16px;">
                        <strong>Subject:</strong> %s
                    </p>
                    <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; color: #1f2937; font-size: 15px; line-height: 1.5; margin-bottom: 24px;">
                        LOGIN IN APP TO VIEW MESSAGE
                    </div>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="color: #6b7280; font-size: 13px;">
                        You received this broadcast because you are a member of %s.
                    </p>
                </div>
                """.formatted(event.getCompanyName(), event.getSenderName(), event.getSubject(), event.getCompanyName());

        Sender sender = Sender.builder()
                .name(senderName)
                .email(senderEmail)
                .build();
        List<Receiver> receivers = new ArrayList<>();
        for (String email : event.getRecipientEmails()) {
            receivers.add(Receiver.builder().email(email).build());
        }
        EmailRequest request = EmailRequest.builder()
                .sender(sender)
                .to(receivers)
                .subject(subject)
                .htmlContent(html)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> entity = new HttpEntity<>(request, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.brevo.com/v3/smtp/email",
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

}
