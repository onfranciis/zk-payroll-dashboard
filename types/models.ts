export interface Employee {
  id: string;
  address: string;
  name: string;
  email?: string;
  department?: string;
  salary: number;
  salaryCommitment: string;
  isActive: boolean;
  startDate: string;
  lastPayment?: string;
}

export interface Company {
  id: string;
  name: string;
  admin: string;
  treasury: string;
  employeeCount: number;
  isActive: boolean;
}

export interface PayrollTransaction {
  id: string;
  companyId: string;
  timestamp: string;
  totalAmount: number;
  employeeCount: number;
  proof: string;
  status: "pending" | "verified" | "failed";
  txHash?: string;
}
