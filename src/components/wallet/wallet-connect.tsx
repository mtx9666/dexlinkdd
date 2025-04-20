"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "@/contexts/wallet-context"
import { Wallet, ChevronDown } from "lucide-react"

export function WalletConnect() {
  const { connected, connecting, wallet, address, connect, disconnect } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (connected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span>{formatAddress(address)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={disconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={connecting}>
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => connect("phantom")}>
          Phantom Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => connect("metamask")}>
          MetaMask
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 