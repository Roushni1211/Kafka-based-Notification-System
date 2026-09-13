package com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    @NotBlank
    @Email
    private String username;
    @NotBlank
    private String otp;
    @NotBlank
    @Size(min = 8, max = 15)
    private String newPassword;
}

