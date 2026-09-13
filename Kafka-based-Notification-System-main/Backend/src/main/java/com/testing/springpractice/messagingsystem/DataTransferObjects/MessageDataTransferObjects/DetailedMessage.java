package com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects;


import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailedMessage {
    private UUID id;
    private String senderName;
    private String subject;
    private String content;
    private String attachmentUrl;
    private String attachmentType;
    private LocalDateTime sentAt;
}
