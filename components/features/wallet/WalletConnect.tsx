"use client";

import { useState } from "react";

function WalletConnect() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="inline-flex items-center gap-3">
      <button
        onClick={() => setConnected(!connected)}
        className={`px-4 py-2 rounded-md font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
          connected
            ? "bg-green-100 text-green-800"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        aria-label={
          connected ? "Disconnect wallet 0x1234...5678" : "Connect wallet"
        }
      >
        {connected ? "0x1234...5678" : "Connect Wallet"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {connected ? "Wallet connected" : "Wallet disconnected"}
      </span>
    </div>
  );
}

export default WalletConnect;
