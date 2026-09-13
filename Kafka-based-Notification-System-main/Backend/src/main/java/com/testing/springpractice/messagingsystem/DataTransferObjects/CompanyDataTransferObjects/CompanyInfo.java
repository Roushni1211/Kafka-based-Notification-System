package com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects;

import lombok.*;

import java.time.LocalDateTime;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyInfo {
    private UUID id;
    private String name;
    private String joinCode;
    private String companyDpUrl;
    private UUID ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
