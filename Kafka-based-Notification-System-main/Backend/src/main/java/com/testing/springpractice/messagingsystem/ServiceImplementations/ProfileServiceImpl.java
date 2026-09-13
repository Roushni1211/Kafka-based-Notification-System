package com.testing.springpractice.messagingsystem.ServiceImplementations;

import com.testing.springpractice.messagingsystem.Configurations.ProjectUtils;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.ProfileResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects.UpdateProfileRequest;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.UsersRepository;
import com.testing.springpractice.messagingsystem.Service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UsersRepository usersRepository;

    public ProfileServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public ProfileResponse getProfile(String username) {
        String normalizedUsername = ProjectUtils.normaliseString(username);
        Optional<Users> userOpt = usersRepository.findByUsername(normalizedUsername);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        Users user = userOpt.get();
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .build();
    }

    @Override
    public ProfileResponse updateProfile(String username, @Valid UpdateProfileRequest request) {
        String normalizedUsername = ProjectUtils.normaliseString(username);
        Optional<Users> userOpt = usersRepository.findByUsername(normalizedUsername);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        Users user = userOpt.get();
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(ProjectUtils.normaliseString(request.getName()));
        }
        Users updatedUser = usersRepository.save(user);
        return ProfileResponse.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getName())
                .username(updatedUser.getUsername())
                .build();
    }
}
