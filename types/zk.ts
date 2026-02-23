export interface PayrollProof {
  publicSignals: string[];
  proof: Record<string, unknown>;
}

export interface ProofVerificationResult {
  isValid: boolean;
  verifiedAt: string;
  error?: string;
}

export interface SalaryCommitment {
  commitment: string;
  nullifier: string;
  employeeId: string;
}
