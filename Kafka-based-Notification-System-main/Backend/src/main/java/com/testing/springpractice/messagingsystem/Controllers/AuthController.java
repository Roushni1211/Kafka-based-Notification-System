package com.testing.springpractice.messagingsystem.Controllers;

import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.LoginRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.RegisterRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ResetPasswordRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.VerifyEmailRequest;
import com.testing.springpractice.messagingsystem.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request){
        return authService.register(request);

    }
    @PostMapping("/verify-otp")
    public String verify(@Valid @RequestBody VerifyEmailRequest request){
        return authService.verify(request);
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginRequest request){
        return authService.login(request);
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String username){
        return authService.sendOtp(username);
    }
    @PutMapping("/updatePass")
    public String verifyOtp(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest){
        return authService.verifyPassword(resetPasswordRequest);
    }
}
