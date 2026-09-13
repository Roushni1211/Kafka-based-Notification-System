package com.testing.springpractice.messagingsystem.ServiceImplementations;

import com.testing.springpractice.messagingsystem.Configurations.ProjectUtils;
import com.testing.springpractice.messagingsystem.CustomExceptions.FailedUpdateException;
import com.testing.springpractice.messagingsystem.CustomExceptions.InvalidOtp;
import com.testing.springpractice.messagingsystem.CustomExceptions.RequestError;
import com.testing.springpractice.messagingsystem.CustomExceptions.UserAlreadyExistsException;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.LoginRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.RegisterRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ResetPasswordRequest;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.VerifyEmailRequest;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.UsersRepository;
import com.testing.springpractice.messagingsystem.Service.AuthService;
import com.testing.springpractice.messagingsystem.Utils.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class AuthServiceImpl implements AuthService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, VerifyEmailRequest> kafkaTemplate;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(RedisTemplate<String, Object> redisTemplate, KafkaTemplate<String, VerifyEmailRequest> kafkaTemplate, UsersRepository usersRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.redisTemplate = redisTemplate;
        this.kafkaTemplate = kafkaTemplate;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public String register(@Valid RegisterRequest request) {
        request.setUsername(ProjectUtils.normaliseString(request.getUsername()));
        request.setName(ProjectUtils.normaliseString(request.getName()));
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        SecureRandom random = new SecureRandom();
        int otpNumber = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpNumber);
        redisTemplate.opsForValue().set("username:" + request.getUsername(), request, Duration.ofMinutes(5));
        redisTemplate.opsForValue().set("otp:register:" + request.getUsername(), otp, Duration.ofMinutes(5));
        VerifyEmailRequest verifyEmailRequest = VerifyEmailRequest.builder()
                .username(request.getUsername())
                .otp(otp)
                .build();
        CompletableFuture<SendResult<String, VerifyEmailRequest>> completableFuture = kafkaTemplate.send("Message.emailService.sendOtp", verifyEmailRequest);
        return "Email Sent Successfully";
    }

    @Override
    public String verify(VerifyEmailRequest request) {
        request.setUsername(ProjectUtils.normaliseString(request.getUsername()));
        RegisterRequest registerRequest = (RegisterRequest) redisTemplate.opsForValue().get("username:" + request.getUsername());
        String otp = (String) redisTemplate.opsForValue().get("otp:register:" + request.getUsername());
        if (registerRequest == null) {
            throw new RequestError("User not found");
        }
        if (otp == null) {
            throw new RequestError("Otp not found");
        }
        if (!request.otp.equals(otp)) {
            throw new InvalidOtp("otp entered is invalid");
        }
        if (usersRepository.existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Try other email");
        }
        Users users = Users.builder()
                .name(registerRequest.getName())
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .verified(true)
                .build();
        Users saved = usersRepository.save(users);
        redisTemplate.delete("username:" + request.getUsername());
        redisTemplate.delete("otp:register:" + request.getUsername());
        return saved.toString();
    }

    @Override
    public String login(LoginRequest request) {
        request.setUsername(ProjectUtils.normaliseString(request.getUsername()));
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        Optional<Users> users = usersRepository.findByUsername(request.getUsername());
        if (users.isEmpty()) {
            throw new UsernameNotFoundException("Invalid Username");
        }
        return jwtUtils.getToken(users.get());
    }

    @Override
    public String sendOtp(String username) {
        if (!usersRepository.existsByUsername(ProjectUtils.normaliseString(username))) {
            throw new UsernameNotFoundException("Email doesn't exists");
        }
        SecureRandom random = new SecureRandom();
        int otpNumber = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpNumber);
        redisTemplate.opsForValue().set("otp:reset:" + ProjectUtils.normaliseString(username), otp, Duration.ofMinutes(5));
        VerifyEmailRequest verifyEmailRequest = VerifyEmailRequest.builder().username(ProjectUtils.normaliseString(username)).otp(otp).build();
        kafkaTemplate.send("Message.emailService.sendOtp", verifyEmailRequest);
        return "email sent successfully";
    }

    @Override
    public String verifyPassword(ResetPasswordRequest resetPasswordRequest) {
        resetPasswordRequest.setUsername(ProjectUtils.normaliseString(resetPasswordRequest.getUsername()));
        if (!usersRepository.existsByUsername(resetPasswordRequest.getUsername())) {
            throw new UsernameNotFoundException("Invalid username");
        }
        String otp = (String) redisTemplate.opsForValue().get("otp:reset:" + resetPasswordRequest.getUsername());
        if (otp == null) {
            throw new RequestError("otp not fount");
        }
        if (!otp.equals(resetPasswordRequest.getOtp())) {
            throw new InvalidOtp("Invalid otp;");
        }
        int rows = usersRepository.updatePasswordForUsername(passwordEncoder.encode(resetPasswordRequest.getNewPassword()), resetPasswordRequest.getUsername());
        if (rows == 0) {
            throw new FailedUpdateException("Failed to update");
        }
        redisTemplate.delete("otp:reset:" + resetPasswordRequest.getUsername());
        return "Updated number of user are " + rows;
    }
}
