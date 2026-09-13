import { UserProfile, Company, CompanyEmployee, CompanyInvitation, MessageOverview, DetailedMessage } from '../types';

export const MOCK_USER: UserProfile = {
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  name: 'Alex Mercer',
  username: 'alex.mercer@workspace.corp'
};

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'c1111111-2222-3333-4444-555555555555',
    name: 'DeepMind Core Lab',
    joinCode: 'DEEPMIND-8942',
    companyDpUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    ownerId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  },
  {
    id: 'c2222222-3333-4444-5555-666666666666',
    name: 'Android Platform Systems',
    joinCode: 'DROID-7721',
    companyDpUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80',
    ownerId: 'b9999999-9999-9999-9999-999999999999'
  },
  {
    id: 'c3333333-4444-5555-6666-777777777777',
    name: 'Cloud Infrastructure Lab',
    joinCode: 'CLOUD-3409',
    companyDpUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80',
    ownerId: 'c8888888-8888-8888-8888-888888888888'
  }
];

export const MOCK_MEMBERS: Record<string, CompanyEmployee[]> = {
  'c1111111-2222-3333-4444-555555555555': [
    { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Alex Mercer (You)', username: 'alex.mercer@workspace.corp' },
    { id: 'm1000000-0000-0000-0000-000000000001', name: 'Sundar Pichai', username: 'sundar@workspace.corp' },
    { id: 'm1000000-0000-0000-0000-000000000002', name: 'Demis Hassabis', username: 'demis@deepmind.corp' },
    { id: 'm1000000-0000-0000-0000-000000000003', name: 'Jeff Dean', username: 'jeff.dean@workspace.corp' },
    { id: 'm1000000-0000-0000-0000-000000000004', name: 'Sara Hooker', username: 'sara.h@cohere.ai' },
  ],
  'c2222222-3333-4444-5555-666666666666': [
    { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Alex Mercer (You)', username: 'alex.mercer@workspace.corp' },
    { id: 'b9999999-9999-9999-9999-999999999999', name: 'Hiroshi Lockheimer', username: 'hiroshi@android.corp' },
    { id: 'm2000000-0000-0000-0000-000000000001', name: 'Dave Burke', username: 'dburke@android.corp' },
  ],
  'c3333333-4444-5555-6666-777777777777': [
    { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Alex Mercer (You)', username: 'alex.mercer@workspace.corp' },
    { id: 'c8888888-8888-8888-8888-888888888888', name: 'Thomas Kurian', username: 'tkurian@cloud.corp' },
    { id: 'm3000000-0000-0000-0000-000000000001', name: 'Urs Hölzle', username: 'urs@infra.corp' },
  ]
};

export const MOCK_INVITATIONS: CompanyInvitation[] = [
  {
    id: 'inv-1111-2222-3333-4444',
    name: 'Quantum AI Research Consortium',
    companyDpUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-5555-6666-7777-8888',
    name: 'Gemini Next Multimodal Team',
    companyDpUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80'
  }
];

export const MOCK_INBOX_MESSAGES: MessageOverview[] = [
  {
    id: 'msg-001',
    sendername: 'Demis Hassabis',
    senderId: 'm1000000-0000-0000-0000-000000000002',
    subject: 'Gemini Ultra Architecture Review & Model Benchmarks',
    sentAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'msg-002',
    sendername: 'Sundar Pichai',
    senderId: 'm1000000-0000-0000-0000-000000000001',
    subject: 'Quarterly Workspace All-Hands & Product Roadmap',
    sentAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'msg-003',
    sendername: 'Jeff Dean',
    senderId: 'm1000000-0000-0000-0000-000000000003',
    subject: 'TPU v5p Cluster Allocation for Deep Learning Workloads',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'msg-004',
    sendername: 'Sara Hooker',
    senderId: 'm1000000-0000-0000-0000-000000000004',
    subject: 'Research Sync: Efficient Fine-Tuning Strategies',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

export const MOCK_SENT_MESSAGES: DetailedMessage[] = [
  {
    id: 'msg-sent-01',
    senderName: 'Alex Mercer',
    subject: 'Enterprise Messaging Milestone Delivery',
    content: 'Hi Team,\n\nWe have successfully deployed the enterprise messaging service with multi-tenant company support, real-time broadcast channels, and secure media attachments. The Relay Workspace frontend is live with offline resilience and mobile optimization.\n\nPlease test the features and share your feedback!\n\nBest regards,\nAlex',
    attachmentUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    attachmentType: 'image/jpeg',
    sentAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 'msg-sent-02',
    senderName: 'Alex Mercer',
    subject: 'Workspace Security and Authentication Update',
    content: 'All authentication services have been verified. Multi-factor security and 6-digit OTP verification are functioning smoothly across all clusters.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  }
];

export const MOCK_DETAILED_MESSAGES: Record<string, DetailedMessage> = {
  'msg-001': {
    id: 'msg-001',
    senderName: 'Demis Hassabis',
    subject: 'Gemini Ultra Architecture Review & Model Benchmarks',
    content: 'Hi Alex and Team,\n\nHere are the updated inference metrics for our latest multithreaded transformer backbone. Latency has been reduced by 34% with zero loss in MMLU reasoning accuracy.\n\nPlease review the attached architecture report and coordinate with the infrastructure team on capacity planning for next Monday\'s staged rollout.\n\nDemis',
    attachmentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    attachmentType: 'image/png',
    sentAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  'msg-002': {
    id: 'msg-002',
    senderName: 'Sundar Pichai',
    subject: 'Quarterly Workspace All-Hands & Product Roadmap',
    content: 'Team,\n\nThank you for an incredible quarter. The advancements in AI integration, real-time collaboration, and mobile-first PWA responsiveness have received exceptional praise from partners globally.\n\nJoin us this Thursday at 10 AM PST for the live townhall and Q&A session.',
    sentAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  'msg-003': {
    id: 'msg-003',
    senderName: 'Jeff Dean',
    subject: 'TPU v5p Cluster Allocation for Deep Learning Workloads',
    content: 'Alex,\n\nWe have scheduled an additional 256 TPU v5p pods for your company channel experimentation starting this evening. Let us know if you need any custom kernel configurations.',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
};
