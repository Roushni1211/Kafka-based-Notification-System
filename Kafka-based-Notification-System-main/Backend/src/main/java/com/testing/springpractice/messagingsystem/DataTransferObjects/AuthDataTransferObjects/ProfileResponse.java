package com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private UUID id;
    private String name;
    private String username;
}
