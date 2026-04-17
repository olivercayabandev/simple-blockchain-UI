import { apiClient } from "./client";

export interface Voter {
  wallet_address: string;
  full_name: string;
  has_voted: boolean;
  gas_balance: number;
  election_started: boolean;
}

export interface Candidate {
  id: number;
  name: string;
  description: string;
  vote_count: number;
}

export interface VoteResult {
  success: boolean;
  transaction_hash: string;
  gas_used: number;
  voter: Voter;
}

export interface BlockchainStatus {
  connected: boolean;
  chain_id: number;
  block_number: number;
  admin_address: string;
}

export interface ElectionStatus {
  election_started: boolean;
}

export interface VotingResults {
  candidates: Candidate[];
}

function extractData<T>(response: { data?: T } | T): T {
  return (response as { data: T }).data || (response as T);
}

export const votingEthApi = {
  healthCheck: async () => {
    const response = await apiClient.get<{ status: string; blockchain: BlockchainStatus }>("/api/health");
    return extractData(response);
  },

  register: async (walletAddress: string, fullName: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      voter: Voter;
    }>("/api/register", {
      wallet_address: walletAddress,
      full_name: fullName,
    });
    return extractData(response);
  },

  login: async (walletAddress: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      voter: Voter;
    }>("/api/login", {
      wallet_address: walletAddress,
    });
    return extractData(response);
  },

  adminLogin: async (username: string, password: string) => {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      admin: { username: string };
    }>("/api/admin/login", {
      username,
      password,
    });
    return extractData(response);
  },

  getVoterInfo: async () => {
    const response = await apiClient.get<Voter>("/api/voter/me");
    return extractData(response);
  },

  getCandidates: async () => {
    const response = await apiClient.get<{
      candidates: Candidate[];
      election_started: boolean;
    }>("/api/candidates");
    return extractData(response);
  },

  castVote: async (candidateId: number, walletAddress: string, privateKey: string) => {
    const response = await apiClient.post<VoteResult>("/api/vote", {
      candidate_id: candidateId,
      wallet_address: walletAddress,
      private_key: privateKey,
    });
    return extractData(response);
  },

  getChain: async () => {
    const response = await apiClient.get<{
      chain_info: BlockchainStatus;
      election_status: ElectionStatus;
      voting_results: VotingResults;
    }>("/api/chain");
    return extractData(response);
  },

  getBlockchainStatus: async () => {
    const response = await apiClient.get<BlockchainStatus>("/api/blockchain/status");
    return extractData(response);
  },

  getElectionStatus: async () => {
    const response = await apiClient.get<ElectionStatus>("/api/election/status");
    return extractData(response);
  },

  adminStartElection: async () => {
    const response = await apiClient.post<{ success: boolean }>("/api/admin/election/start");
    return extractData(response);
  },

  adminStopElection: async () => {
    const response = await apiClient.post<{ success: boolean }>("/api/admin/election/stop");
    return extractData(response);
  },

  adminAddCandidate: async (name: string, description: string = "") => {
    const response = await apiClient.post<{ success: boolean }>("/api/admin/candidates", {
      name,
      description,
    });
    return extractData(response);
  },

  adminGetStats: async () => {
    const response = await apiClient.get<{
      total_votes: number;
      total_candidates: number;
      election_started: boolean;
      blockchain: BlockchainStatus;
    }>("/api/admin/stats");
    return extractData(response);
  },

  verifyVote: async (walletAddress: string) => {
    const response = await apiClient.get<{
      valid: boolean;
      wallet_address: string;
      message: string;
    }>(`/api/verify/${walletAddress}`);
    return extractData(response);
  },
};
