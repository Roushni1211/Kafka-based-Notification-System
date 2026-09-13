package com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupEmailRequest {
    private Sender sender;
    private List<String> to;
    private String subject;
    private String htmlContent;
}
