// TypeScript type definitions matching Spring Boot Backend DTOs

export interface UserProfile {
  id: string;
  name: string;
  username: string; // Email in backend
}

export interface Company {
  id: string;
  name: string;
  joinCode: string;
  companyDpUrl?: string;
  ownerId: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  joinCode: string;
  companyDpUrl?: string;
  ownerId: string;
  ownerName?: string;
  createdAt?: string;
}

export interface CompanyEmployee {
  id: string;
  name: string;
  username: string;
}

export interface CompanyInvitation {
  id: string;
  name: string;
  companyDpUrl?: string;
}

export interface MessageOverview {
  id: string;
  sendername: string;
  senderId?: string;
  subject: string;
  sentAt: string;
}

export interface DetailedMessage {
  id: string;
  senderName: string;
  subject: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  sentAt: string;
}

export interface SendMessageRequest {
  receiverIds: string[];
  subject: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty?: boolean;
}

export type ActiveTab = 'inbox' | 'sent' | 'channel' | 'companies' | 'members' | 'invitations' | 'profile';
