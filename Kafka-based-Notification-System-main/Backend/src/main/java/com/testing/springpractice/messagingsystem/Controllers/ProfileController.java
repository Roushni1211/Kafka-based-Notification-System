package com.testing.springpractice.messagingsystem.Controllers;

import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ProfileResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.UpdateProfileRequest;
import com.testing.springpractice.messagingsystem.Service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        ProfileResponse profile = profileService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(Authentication authentication,
                                                         @Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse updatedProfile = profileService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(updatedProfile);
    }
}
