import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Company, CompanyEmployee, CompanyInvitation } from '../types';
import { companyApi } from '../api/companyApi';
import { employeeApi } from '../api/employeeApi';
import { MOCK_COMPANIES, MOCK_MEMBERS, MOCK_INVITATIONS } from '../api/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface CompanyContextType {
  companies: Company[];
  activeCompany: Company | null;
  members: CompanyEmployee[];
  invitations: CompanyInvitation[];
  isLoading: boolean;
  setActiveCompany: (company: Company | null) => void;
  refreshCompanies: () => Promise<void>;
  refreshMembers: (companyId: string) => Promise<void>;
  refreshInvitations: () => Promise<void>;
  createCompany: (name: string, file?: File | null) => Promise<boolean>;
  joinCompany: (code: string) => Promise<boolean>;
  acceptInvitation: (companyId: string) => Promise<boolean>;
  inviteEmployee: (companyId: string, email: string) => Promise<boolean>;
  removeEmployee: (companyId: string, employeeId: string) => Promise<boolean>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoMode, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);
  const [members, setMembers] = useState<CompanyEmployee[]>([]);
  const [invitations, setInvitations] = useState<CompanyInvitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setActiveCompany = (company: Company | null) => {
    setActiveCompanyState(company);
    if (company) {
      localStorage.setItem('companyconnect_active_company_id', company.id);
    }
  };

  const refreshCompanies = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);

    if (isDemoMode) {
      setCompanies(MOCK_COMPANIES);
      const savedId = localStorage.getItem('companyconnect_active_company_id');
      const found = MOCK_COMPANIES.find((c) => c.id === savedId) || MOCK_COMPANIES[0];
      setActiveCompanyState(found);
      setIsLoading(false);
      return;
    }

    try {
      const page = await companyApi.getAllCompanies(0, 50);
      const list = page.content || [];
      setCompanies(list);

      setActiveCompanyState((prev) => {
        if (prev && list.some((c) => c.id === prev.id)) {
          return prev;
        }
        const savedId = localStorage.getItem('companyconnect_active_company_id');
        return list.find((c) => c.id === savedId) || list[0] || null;
      });
    } catch (err) {
      console.warn('Could not fetch companies from API, falling back to mock dataset if needed');
      setCompanies(MOCK_COMPANIES);
      setActiveCompanyState((prev) => prev || MOCK_COMPANIES[0]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDemoMode]);

  const refreshMembers = useCallback(async (companyId: string) => {
    if (!companyId) return;

    if (isDemoMode) {
      setMembers(MOCK_MEMBERS[companyId] || [
        { id: 'm-default-1', name: 'Alex Mercer (You)', username: 'alex.mercer@workspace.corp' },
        { id: 'm-default-2', name: 'Sundar Pichai', username: 'sundar@workspace.corp' }
      ]);
      return;
    }

    try {
      const page = await companyApi.getCompanyMembers(companyId, 0, 100);
      setMembers(page.content || []);
    } catch (err) {
      console.warn('Failed to load members from backend, using sample list', err);
      setMembers(MOCK_MEMBERS[companyId] || []);
    }
  }, [isDemoMode]);

  const refreshInvitations = useCallback(async () => {
    if (!isAuthenticated) return;

    if (isDemoMode) {
      setInvitations(MOCK_INVITATIONS);
      return;
    }

    try {
      const page = await employeeApi.getAllInvitations(0, 50);
      setInvitations(page.content || []);
    } catch (err) {
      setInvitations(MOCK_INVITATIONS);
    }
  }, [isAuthenticated, isDemoMode]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCompanies();
      refreshInvitations();
    }
  }, [isAuthenticated, isDemoMode]);

  useEffect(() => {
    if (activeCompany?.id) {
      refreshMembers(activeCompany.id);
    }
  }, [activeCompany?.id, isDemoMode]);

  const createCompany = async (name: string, file?: File | null): Promise<boolean> => {
    if (isDemoMode) {
      const newComp: Company = {
        id: `c-${Date.now()}`,
        name,
        joinCode: `${name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        companyDpUrl: file ? URL.createObjectURL(file) : undefined,
        ownerId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
      };
      setCompanies((prev) => [newComp, ...prev]);
      setActiveCompany(newComp);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      showToast(`Company Space "${name}" created successfully!`, 'success');
      return true;
    }

    try {
      const created = await companyApi.createCompany(name, file);
      setCompanies((prev) => [created, ...prev]);
      setActiveCompany(created);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      showToast(`Company Space "${created.name}" created!`, 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to create company', 'error');
      return false;
    }
  };

  const joinCompany = async (code: string): Promise<boolean> => {
    if (isDemoMode) {
      const dummyJoined: Company = {
        id: `c-joined-${Date.now()}`,
        name: `Joined Space (${code.toUpperCase()})`,
        joinCode: code.toUpperCase(),
        companyDpUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80',
        ownerId: 'external-owner-id'
      };
      setCompanies((prev) => [dummyJoined, ...prev]);
      setActiveCompany(dummyJoined);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      showToast(`Successfully joined "${dummyJoined.name}"!`, 'success');
      return true;
    }

    try {
      const joined = await companyApi.joinCompany(code);
      setCompanies((prev) => [joined, ...prev]);
      setActiveCompany(joined);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      showToast(`Successfully joined "${joined.name}"!`, 'success');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Invalid join code or already a member';
      showToast(typeof msg === 'string' ? msg : 'Failed to join company', 'error');
      return false;
    }
  };

  const acceptInvitation = async (companyId: string): Promise<boolean> => {
    if (isDemoMode) {
      setInvitations((prev) => prev.filter((inv) => inv.id !== companyId));
      showToast('Invitation accepted!', 'success');
      refreshCompanies();
      return true;
    }

    try {
      await companyApi.acceptInvitation(companyId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== companyId));
      showToast('Invitation accepted! Space added to your workspace.', 'success');
      refreshCompanies();
      return true;
    } catch (err: any) {
      showToast('Failed to accept invitation', 'error');
      return false;
    }
  };

  const inviteEmployee = async (companyId: string, email: string): Promise<boolean> => {
    if (isDemoMode) {
      showToast(`Invitation dispatched to ${email}`, 'success');
      return true;
    }

    try {
      const res = await employeeApi.inviteEmployee(companyId, email);
      showToast(res || `Invite sent to ${email}!`, 'success');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to send invite';
      showToast(typeof msg === 'string' ? msg : 'Failed to send invite', 'error');
      return false;
    }
  };

  const removeEmployee = async (companyId: string, employeeId: string): Promise<boolean> => {
    if (isDemoMode) {
      setMembers((prev) => prev.filter((m) => m.id !== employeeId));
      showToast('Member removed from Space', 'info');
      return true;
    }

    try {
      await companyApi.removeEmployee(companyId, employeeId);
      setMembers((prev) => prev.filter((m) => m.id !== employeeId));
      showToast('Member successfully removed', 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to remove member. Only space leaders can remove members.', 'error');
      return false;
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany,
        members,
        invitations,
        isLoading,
        setActiveCompany,
        refreshCompanies,
        refreshMembers,
        refreshInvitations,
        createCompany,
        joinCompany,
        acceptInvitation,
        inviteEmployee,
        removeEmployee,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
