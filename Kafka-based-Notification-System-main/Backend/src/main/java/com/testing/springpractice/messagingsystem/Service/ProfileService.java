package com.testing.springpractice.messagingsystem.Service;

import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ProfileResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.UpdateProfileRequest;
import jakarta.validation.Valid;

public interface ProfileService {

    ProfileResponse getProfile(String username);

    ProfileResponse updateProfile(String username, @Valid UpdateProfileRequest request);
}
