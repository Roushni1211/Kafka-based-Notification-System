package com.testing.springpractice.messagingsystem.Controllers;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.CompanyInvitations;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.InviteEmployeeRequest;
import com.testing.springpractice.messagingsystem.Service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/{companyId}/invite")
    public String inviteEmployee(@PathVariable UUID companyId, @Valid @RequestBody InviteEmployeeRequest request){
        return employeeService.inviteEmployee(companyId, request);
    }

    @GetMapping("/getAllInvites")
    public Page<CompanyInvitations> getAllInvitations(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        return employeeService.getAllInvitations(page, size);
    }

    @GetMapping("/invitations/{companyId}")
    public CompanyInfo getInvitationCompanyInfo(@PathVariable UUID companyId) {
        return employeeService.getInvitationCompanyInfo(companyId);
    }
}
