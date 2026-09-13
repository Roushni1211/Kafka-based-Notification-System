import { apiClient } from './client';
import { CompanyInfo, CompanyInvitation, PageResponse } from '../types';

export const employeeApi = {
  // Invite employee to company by username (email)
  inviteEmployee: async (companyId: string, username: string): Promise<string> => {
    const res = await apiClient.post<string>(`/employee/${companyId}/invite`, { username });
    return res.data;
  },

  // Get all invitations for current user
  getAllInvitations: async (page = 0, size = 20): Promise<PageResponse<CompanyInvitation>> => {
    const res = await apiClient.get<PageResponse<CompanyInvitation>>('/employee/getAllInvites', {
      params: { page, size },
    });
    return res.data;
  },

  // Get invitation company info
  getInvitationCompanyInfo: async (companyId: string): Promise<CompanyInfo> => {
    const res = await apiClient.get<CompanyInfo>(`/employee/invitations/${companyId}`);
    return res.data;
  },
};
