package com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyEmailRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    public String username;

    @NotBlank
    public String otp;
}

