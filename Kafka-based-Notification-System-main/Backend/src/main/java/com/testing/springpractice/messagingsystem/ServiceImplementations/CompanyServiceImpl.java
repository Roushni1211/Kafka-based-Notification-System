package com.testing.springpractice.messagingsystem.ServiceImplementations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.testing.springpractice.messagingsystem.Configurations.ProjectUtils;
import com.testing.springpractice.messagingsystem.CustomExceptions.CompanyNotExistException;
import com.testing.springpractice.messagingsystem.CustomExceptions.RequestError;
import com.testing.springpractice.messagingsystem.CustomExceptions.UnauthorizedException;
import com.testing.springpractice.messagingsystem.CustomExceptions.UserAlreadyExistsException;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyEmployeeDetails;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CreateCompany;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.UpdateCompanyRequest;
import com.testing.springpractice.messagingsystem.Models.Company;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.CompanyRepository;
import com.testing.springpractice.messagingsystem.Service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyServiceImpl implements CompanyService {
    private final Cloudinary cloudinary;
    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(Cloudinary cloudinary, CompanyRepository companyRepository) {
        this.cloudinary = cloudinary;
        this.companyRepository = companyRepository;
    }

    @Override
    public CompanyResponse createCompany(@Valid CreateCompany createCompany, MultipartFile file) throws IOException {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Company company = Company.builder()
                .name(createCompany.getName())
                .joinCode(ProjectUtils.generateJoinCode(createCompany.getName(), users.getUsername()))
                .owner(users)
                .build();
        company.getEmp().add(users);
        if (file!=null&&!file.isEmpty()){
            Map upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto"
            ));
            company.setCompanyDpUrl(upload.get("secure_url").toString());
            company.setDpResourceType(upload.get("resource_type").toString());
            company.setPublicUrl(upload.get("public_id").toString());
        }
        Company saved = companyRepository.save(company);
        return CompanyResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .joinCode(saved.getJoinCode())
                .companyDpUrl(saved.getCompanyDpUrl())
                .ownerId(saved.getOwner().getId())
                .build();
    }

    @Override
    public CompanyResponse joinCompany(String code) {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Optional<Company> optCompany = companyRepository.findByJoinCode(code);
        if (optCompany.isEmpty()){
            throw new RequestError("Company doesn't exist");
        }
        Company company = optCompany.get();
        if (company.getEmp().contains(users)){
            throw new UserAlreadyExistsException("User Member of the group");
        }
        company.getEmp().add(users);
        company.getInvitations().remove(users);
        Company saved = companyRepository.save(company);
        return CompanyResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .joinCode(saved.getJoinCode())
                .companyDpUrl(saved.getCompanyDpUrl())
                .ownerId(saved.getOwner().getId())
                .build();
    }

    @Override
    public Page<CompanyResponse> getMyCompany(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Page<CompanyResponse> companyResponses = companyRepository.findCompaniesByOwnerId(users.getId(), pageable);

        return companyResponses;
    }

    @Override
    public Page<CompanyResponse> getAllCompany(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Page<CompanyResponse> companyResponses = companyRepository.findAllCompaniesByOwnerId(users.getId(), pageable);

        return companyResponses;
    }

    @Override
    public CompanyInfo getInfo(UUID companyId) {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Optional<CompanyInfo> info = companyRepository.findCompanyUsingEmpIdAndCompanyId(users.getId(), companyId);
        if (info.isEmpty()){
            throw new CompanyNotExistException("Invalid Company Id or Not Access");
        }
        return info.get();
    }

    @Override
    public CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request, MultipartFile file) throws IOException {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new CompanyNotExistException("Company not found"));

        if (!company.getOwner().getId().equals(users.getId())) {
            throw new UnauthorizedException("Only company owner can update company details");
        }

        if (request != null && request.getName() != null && !request.getName().trim().isEmpty()) {
            company.setName(request.getName().trim());
        }

        if (file != null && !file.isEmpty()) {
            Map upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto"
            ));
            company.setCompanyDpUrl(upload.get("secure_url").toString());
            company.setDpResourceType(upload.get("resource_type").toString());
            company.setPublicUrl(upload.get("public_id").toString());
        }

        company.setUpdatedAt(LocalDateTime.now());
        Company saved = companyRepository.save(company);

        return CompanyResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .joinCode(saved.getJoinCode())
                .companyDpUrl(saved.getCompanyDpUrl())
                .ownerId(saved.getOwner().getId())
                .build();
    }

    @Override
    public Page<CompanyEmployeeDetails> getEmployeeDetails(UUID companyId, int page, int size) {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Optional<CompanyInfo> info = companyRepository.findCompanyUsingEmpIdAndCompanyId(users.getId(), companyId);
        if (info.isEmpty()) {
            throw new CompanyNotExistException("Invalid Company Id or No Access");
        }
        Pageable pageable = PageRequest.of(page, size);
        return companyRepository.ObtainDetailsOfEmployeesUsingCompanyId(companyId, pageable);
    }

    @Override
    public CompanyResponse acceptInvitation(UUID companyId) {
        Users users = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new CompanyNotExistException("Company not found"));

        boolean hasInvite = company.getInvitations().removeIf(u -> u.getId().equals(users.getId()));
        if (!hasInvite) {
            throw new RequestError("No pending invitation found for this company");
        }

        if (company.getEmp().contains(users)) {
            throw new UserAlreadyExistsException("User is already a member of this company");
        }

        company.getEmp().add(users);
        Company saved = companyRepository.save(company);

        return CompanyResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .joinCode(saved.getJoinCode())
                .companyDpUrl(saved.getCompanyDpUrl())
                .ownerId(saved.getOwner().getId())
                .build();
    }

    @Override
    public String removeEmployee(UUID companyId, UUID employeeId) {
        Users currentUser = (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new CompanyNotExistException("Company not found"));
        if (!company.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only company owner can remove employees");
        }
        if (company.getOwner().getId().equals(employeeId)) {
            throw new RequestError("Company owner cannot be removed from the company");
        }
        boolean removed = company.getEmp().removeIf(u -> u.getId().equals(employeeId));
        if (!removed) {
            throw new RequestError("Employee is not a member of this company");
        }
        companyRepository.save(company);
        return "Employee removed successfully";
    }

}
