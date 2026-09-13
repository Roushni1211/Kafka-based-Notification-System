import { apiClient, buildMultipartPayload } from './client';
import { Company, CompanyInfo, CompanyEmployee, PageResponse } from '../types';

export const companyApi = {
  // Create company with optional logo image
  createCompany: async (name: string, file?: File | null): Promise<Company> => {
    const formData = buildMultipartPayload('createCompany', { name }, file);
    // Let browser set Content-Type with multipart boundary automatically
    const res = await apiClient.post<Company>('/company/create', formData);
    return res.data;
  },

  // Join company via joinCode
  joinCompany: async (code: string): Promise<Company> => {
    const res = await apiClient.post<Company>(`/company/join/${encodeURIComponent(code)}`);
    return res.data;
  },

  // Get current user's owned companies
  getMyCompanies: async (page = 0, size = 20): Promise<PageResponse<Company>> => {
    const res = await apiClient.get<PageResponse<Company>>('/company/my-companies', {
      params: { page, size },
    });
    return res.data;
  },

  // Get all companies user belongs to or can view
  getAllCompanies: async (page = 0, size = 20): Promise<PageResponse<Company>> => {
    const res = await apiClient.get<PageResponse<Company>>('/company/all-companies', {
      params: { page, size },
    });
    return res.data;
  },

  // Get specific company info
  getCompanyInfo: async (companyId: string): Promise<CompanyInfo> => {
    const res = await apiClient.get<CompanyInfo>(`/company/${companyId}`);
    return res.data;
  },

  // Update company details
  updateCompany: async (companyId: string, name: string, file?: File | null): Promise<Company> => {
    const formData = buildMultipartPayload('updateCompanyRequest', { name }, file);
    // Let browser set Content-Type with multipart boundary automatically
    const res = await apiClient.put<Company>(`/company/${companyId}`, formData);
    return res.data;
  },

  // Get members of a company
  getCompanyMembers: async (companyId: string, page = 0, size = 50): Promise<PageResponse<CompanyEmployee>> => {
    const res = await apiClient.get<PageResponse<CompanyEmployee>>(`/company/${companyId}/members`, {
      params: { page, size },
    });
    return res.data;
  },

  // Accept company invitation
  acceptInvitation: async (companyId: string): Promise<Company> => {
    const res = await apiClient.post<Company>(`/company/${companyId}/accept`);
    return res.data;
  },

  // Remove member from company
  removeEmployee: async (companyId: string, employeeId: string): Promise<string> => {
    const res = await apiClient.delete<string>(`/company/${companyId}/remove/${employeeId}`);
    return res.data;
  },
};
