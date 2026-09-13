package com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageNotificationEvent {
    private String companyName;
    private String senderName;
    private String subject;
    private List<String> recipientEmails;
}
