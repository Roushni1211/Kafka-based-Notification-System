import { apiClient, buildMultipartPayload } from './client';
import { DetailedMessage, MessageOverview, PageResponse, SendMessageRequest } from '../types';

export const messageApi = {
  // Get inbox messages (optionally filtered by companyId)
  getInboxMessages: async (companyId?: string, page = 0, size = 20): Promise<PageResponse<MessageOverview>> => {
    const res = await apiClient.get<PageResponse<MessageOverview>>('/messages/inbox', {
      params: { companyId, page, size },
    });
    return res.data;
  },

  // Get sent messages
  getSentMessages: async (companyId?: string, page = 0, size = 20): Promise<PageResponse<DetailedMessage>> => {
    const res = await apiClient.get<PageResponse<DetailedMessage>>('/messages/sent', {
      params: { companyId, page, size },
    });
    return res.data;
  },

  // Get company channel messages
  getCompanyMessages: async (companyId: string, page = 0, size = 20): Promise<PageResponse<MessageOverview>> => {
    const res = await apiClient.get<PageResponse<MessageOverview>>(`/messages/${companyId}`, {
      params: { page, size },
    });
    return res.data;
  },

  // Get single detailed message (and marks as read on backend)
  getMessage: async (companyId: string, messageId: string): Promise<DetailedMessage> => {
    const res = await apiClient.get<DetailedMessage>(`/messages/inbox/${companyId}/${messageId}`);
    return res.data;
  },

  // Send message to company members with optional attachment file
  sendMessage: async (companyId: string, payload: SendMessageRequest, file?: File | null): Promise<string> => {
    const formData = buildMultipartPayload('request', payload, file);
    // Let browser set Content-Type with multipart boundary automatically
    const res = await apiClient.post<string>(`/messages/sendMessage/${companyId}`, formData);
    return res.data;
  },
};
