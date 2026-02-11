"use client";

import { useState } from "react";

export default function WalletConnect() {
    const [connected, setConnected] = useState(false);

    return (
        <button
            onClick={() => setConnected(!connected)}
            className={`px-4 py-2 rounded-md font-medium ${connected ? "bg-green-100 text-green-700" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
        >
            {connected ? "0x1234...5678" : "Connect Wallet"}
        </button>
    );
}
