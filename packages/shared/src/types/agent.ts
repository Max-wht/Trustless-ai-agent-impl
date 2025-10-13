/**
 * Agent type definitions
 */

export interface Agent {
  id: string;
  walletAddress: `0x${string}`;
  name: string;
  description?: string;
  endpoint: string;
  stakeAmount: bigint | string;
  reputationScore: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AgentJudgment {
  id: string;
  agentId: string;
  contentId: string;
  judgment: 'approve' | 'reject';
  confidence: number;
  reason?: string;
  createdAt: Date | string;
}

export interface RegisterAgentRequest {
  walletAddress: string;
  name: string;
  description?: string;
  endpoint: string;
  stakeAmount: string;
}

export interface AgentResponse {
  success: boolean;
  agent: Agent;
  txHash?: string;
}

export interface AgentListResponse {
  success: boolean;
  agents: Agent[];
  total: number;
}
