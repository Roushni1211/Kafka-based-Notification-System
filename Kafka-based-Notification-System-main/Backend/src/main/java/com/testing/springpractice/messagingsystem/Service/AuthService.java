package com.testing.springpractice.messagingsystem.Service;


import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.LoginRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.RegisterRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ResetPasswordRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.VerifyEmailRequest;
import jakarta.validation.Valid;


public interface AuthService {

    String register(@Valid RegisterRequest request);

    String verify(@Valid VerifyEmailRequest request);

    String login(@Valid LoginRequest request);

    String sendOtp(String username);

    String verifyPassword(@Valid ResetPasswordRequest resetPasswordRequest);
}
