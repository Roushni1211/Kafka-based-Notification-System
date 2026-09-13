package com.testing.springpractice.messagingsystem.ServiceImplementations;

import com.testing.springpractice.messagingsystem.Configurations.ProjectUtils;
import com.testing.springpractice.messagingsystem.CustomExceptions.CompanyNotExistException;
import com.testing.springpractice.messagingsystem.CustomExceptions.UnauthorizedException;
import com.testing.springpractice.messagingsystem.CustomExceptions.UserAlreadyExistsException;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.CompanyInvitations;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.InviteEmployeeRequest;
import com.testing.springpractice.messagingsystem.Models.Company;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.CompanyRepository;
import com.testing.springpractice.messagingsystem.Repository.UsersRepository;
import com.testing.springpractice.messagingsystem.Service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final UsersRepository usersRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final CompanyRepository companyRepository;

    public EmployeeServiceImpl(UsersRepository usersRepository, KafkaTemplate<String, Object> kafkaTemplate, CompanyRepository companyRepository) {
        this.usersRepository = usersRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.companyRepository = companyRepository;
    }

    @Override
    public String inviteEmployee(UUID companyId, @Valid InviteEmployeeRequest request) {
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        request.setUsername(ProjectUtils.normaliseString(request.getUsername()));
        Company company = companyRepository.findById(companyId).orElseThrow(()-> new CompanyNotExistException("Invalid Company"));
        String username = request.getUsername();
        if(!company.getOwner().getId().equals(users.getId())){
            throw new UnauthorizedException("Only leaders can send invites");
        }
        Optional<Users> optInvitedUser = usersRepository.findByUsername(username);
        if(optInvitedUser.isEmpty()){
            kafkaTemplate.send("Message.InviteToApp.User", request.getUsername() + " " + users.getName());
            return "Invite to App Sent Successfully";
        }
        Users invitedUser = optInvitedUser.get();
        if (company.getEmp().contains(invitedUser)){
            throw new UserAlreadyExistsException("User Already Exists");
        }
        if (company.getInvitations().contains(invitedUser)){
            kafkaTemplate.send("Message.PendingRequest.User", request.getUsername());
            return "Informed about Pending Requests";
        }

        company.getInvitations().add(invitedUser);
        companyRepository.save(company);

        kafkaTemplate.send("Message.SendInvite.User", request.getUsername());
        return "Invite Sent Successfully";
    }

    @Override
    public Page<CompanyInvitations> getAllInvitations(int page, int size) {
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = PageRequest.of(page, size);

        return companyRepository.obtainInvitationsForUserId(users.getId(), pageable);
    }

    @Override
    public CompanyInfo getInvitationCompanyInfo(UUID companyId) {
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return companyRepository.findCompanyUsingInvitedUserIdAndCompanyId(users.getId(), companyId)
                .orElseThrow(() -> new CompanyNotExistException("Invalid Company Id or No Pending Invitation"));
    }
}
