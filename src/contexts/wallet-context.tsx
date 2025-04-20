"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { toast } from "sonner"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  wallet: string | null
  address: string | null
  connect: (walletType: "phantom" | "metamask") => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [wallet, setWallet] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantomWallet = () => {
      const { solana } = window as any
      if (solana?.isPhantom) {
        return true
      }
      return false
    }

    // Check if MetaMask is installed
    const checkMetaMask = () => {
      const { ethereum } = window as any
      if (ethereum?.isMetaMask) {
        return true
      }
      return false
    }

    // Check for existing connections
    const checkExistingConnections = async () => {
      const { solana } = window as any
      const { ethereum } = window as any

      if (solana?.isPhantom) {
        try {
          const response = await solana.connect({ onlyIfTrusted: true })
          setConnected(true)
          setWallet("phantom")
          setAddress(response.publicKey.toString())
        } catch (err) {
          // Not auto-connected
        }
      }

      if (ethereum?.isMetaMask) {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setConnected(true)
            setWallet("metamask")
            setAddress(accounts[0])
          }
        } catch (err) {
          // Not connected
        }
      }
    }

    checkExistingConnections()
  }, [])

  const connect = async (walletType: "phantom" | "metamask") => {
    setConnecting(true)
    try {
      if (walletType === "phantom") {
        const { solana } = window as any
        if (!solana?.isPhantom) {
          throw new Error("Phantom wallet is not installed")
        }

        const response = await solana.connect()
        setConnected(true)
        setWallet("phantom")
        setAddress(response.publicKey.toString())
        toast.success("Connected to Phantom wallet")
      } else if (walletType === "metamask") {
        const { ethereum } = window as any
        if (!ethereum?.isMetaMask) {
          throw new Error("MetaMask is not installed")
        }

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        })
        setConnected(true)
        setWallet("metamask")
        setAddress(accounts[0])
        toast.success("Connected to MetaMask")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    if (wallet === "phantom") {
      const { solana } = window as any
      solana?.disconnect()
    }
    setConnected(false)
    setWallet(null)
    setAddress(null)
    toast.success("Wallet disconnected")
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        wallet,
        address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
} 