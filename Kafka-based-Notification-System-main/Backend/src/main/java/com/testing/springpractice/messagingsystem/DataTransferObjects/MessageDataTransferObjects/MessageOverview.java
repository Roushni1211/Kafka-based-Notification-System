package com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageOverview {
    private UUID id;
    private String sendername;
    private UUID senderId;
    private String subject;
    private LocalDateTime sentAt;
}
