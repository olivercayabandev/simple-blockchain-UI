import { apiClient } from "./client";

export interface Voter {
  resident_id_hash: string;
  full_name: string;
  gas_balance: number;
  has_voted: boolean;
  election_started: boolean;
}

export interface Candidate {
  id: number;
  name: string;
  description: string;
}

export interface Transaction {
  voter_id_hash: string;
  candidate: string;
  gas_used: number;
  timestamp: number;
  tx_hash: string;
}

export interface VoteResult {
  success: boolean;
  transaction: Transaction;
  gas_used: number;
  gas_remaining: number;
  pending_count: number;
  auto_mined: boolean;
  votes_until_next_block: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previous_hash: string;
  nonce: number;
  hash: string;
}

export interface BlockchainStatus {
  chain_length: number;
  pending_transactions: number;
  total_votes: number;
  is_valid: boolean;
  votes_per_block: number;
}

export interface ElectionStatus {
  election_started: boolean;
  started_at: string | null;
  ended_at: string | null;
}

export interface AdminStats {
  total_voters: number;
  total_voted: number;
  total_candidates: number;
  voter_turnout: number;
  total_blocks: number;
  pending_transactions: number;
  total_votes: number;
  is_valid: boolean;
}

function extractData<T>(response: { data?: T } | T): T {
  return (response as { data: T }).data || (response as T);
}

export const votingApi = {
  register: async (residentId: string, pin: string, fullName: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      voter: Voter;
    }>("/register", {
      resident_id: residentId,
      pin,
      full_name: fullName,
    });
    return extractData(response);
  },

  login: async (residentId: string, pin: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      voter: Voter & { has_voted: boolean };
    }>("/login", {
      resident_id: residentId,
      pin,
    });
    return extractData(response);
  },

  adminLogin: async (username: string, password: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      admin: { username: string };
    }>("/admin/login", {
      username,
      password,
    });
    return extractData(response);
  },

  getVoterInfo: async () => {
    const response = await apiClient.get<Voter>("/voter/me");
    return extractData(response);
  },

  getCandidates: async () => {
    const response = await apiClient.get<{
      candidates: Candidate[];
      election_started: boolean;
    }>("/candidates");
    return extractData(response);
  },

  castVote: async (candidate: string) => {
    const response = await apiClient.post<VoteResult>("/vote", {
      candidate,
    });
    return extractData(response);
  },

  getChain: async () => {
    const response = await apiClient.get<{
      chain: Block[];
      pending_transactions: number;
      total_votes: number;
      is_valid: boolean;
      votes_per_block: number;
    }>("/chain");
    return extractData(response);
  },

  getBlockchainStatus: async () => {
    const response = await apiClient.get<BlockchainStatus>("/blockchain/status");
    return extractData(response);
  },

  getElectionStatus: async () => {
    const response = await apiClient.get<ElectionStatus>("/election/status");
    return extractData(response);
  },

  adminStartElection: async () => {
    const response = await apiClient.post<{ success: boolean }>("/admin/election/start");
    return extractData(response);
  },

  adminStopElection: async () => {
    const response = await apiClient.post<{ success: boolean }>("/admin/election/stop");
    return extractData(response);
  },

  adminMineBlock: async () => {
    const response = await apiClient.post<{
      success: boolean;
      block: Block;
    }>("/admin/mine");
    return extractData(response);
  },

  adminGetStats: async () => {
    const response = await apiClient.get<AdminStats>("/admin/stats");
    return extractData(response);
  },

  adminAddCandidate: async (name: string, description: string = "") => {
    const response = await apiClient.post<{ success: boolean }>("/admin/candidates", {
      name,
      description,
    });
    return extractData(response);
  },

  adminRemoveCandidate: async (candidateId: number) => {
    const response = await apiClient.delete<{ success: boolean }>(
      `/admin/candidates/${candidateId}`
    );
    return extractData(response);
  },

  verifyVote: async (txHash: string) => {
    const response = await apiClient.get<{
      valid: boolean;
      message: string;
      recorded_at?: number;
      tx_hash?: string;
    }>(`/verify/${txHash}`);
    return extractData(response);
  },
};
