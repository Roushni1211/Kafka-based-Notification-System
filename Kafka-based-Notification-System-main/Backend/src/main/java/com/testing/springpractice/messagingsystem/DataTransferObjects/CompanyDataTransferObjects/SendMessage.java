package com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessage {
    @NotEmpty(message = "At least one recipient must be specified")
    private List<UUID> receiverIds;
    @NotBlank(message = "Subject is required")
    private String subject;
    @NotBlank(message = "Content is required")
    private String content;
    private String attachmentUrl;
    private String attachmentType;
}
