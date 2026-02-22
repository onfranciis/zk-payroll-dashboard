import React from "react";
import WalletConnect from "../components/WalletConnect";
import PayrollSummary from "../components/PayrollSummary";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">ZK Payroll Dashboard</h1>
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        <WalletConnect />
        <PayrollSummary />
      </div>
    </main>
  );
}
