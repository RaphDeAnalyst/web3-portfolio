'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Web3State {
  isConnected: boolean
  address: string | null
  ensName: string | null
  chainId: number | null
  isConnecting: boolean
}

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

// Mock Web3 implementation for demo purposes
// In a real app, this would use wagmi, ethers, or web3.js
export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    address: null,
    ensName: null,
    chainId: null,
    isConnecting: false
  })

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if wallet is already connected (in localStorage for demo)
        if (typeof window !== 'undefined') {
          const savedConnection = localStorage.getItem('web3-connection')
          if (savedConnection) {
            const connectionData = JSON.parse(savedConnection)
            setState(prev => ({
              ...prev,
              isConnected: true,
              address: connectionData.address,
              ensName: connectionData.ensName,
              chainId: connectionData.chainId
            }))
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  const connect = async (): Promise<void> => {
    setState(prev => ({ ...prev, isConnecting: true }))

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock connection data
      const mockAddress = '0x742d35Cc6C6C6C6C6C6C6C6C6C6C6C6C6C6C6C6C'
      const mockEnsName = 'web3dev.eth'
      const mockChainId = 1 // Ethereum mainnet

      const connectionData = {
        address: mockAddress,
        ensName: mockEnsName,
        chainId: mockChainId
      }

      // Save to localStorage for demo
      if (typeof window !== 'undefined') {
        localStorage.setItem('web3-connection', JSON.stringify(connectionData))
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        address: mockAddress,
        ensName: mockEnsName,
        chainId: mockChainId,
        isConnecting: false
      }))
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setState(prev => ({ ...prev, isConnecting: false }))
      throw error
    }
  }

  const disconnect = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('web3-connection')
    }
    setState({
      isConnected: false,
      address: null,
      ensName: null,
      chainId: null,
      isConnecting: false
    })
  }

  const switchNetwork = async (chainId: number): Promise<void> => {
    try {
      // Simulate network switching
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({ ...prev, chainId }))
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const savedConnection = localStorage.getItem('web3-connection')
        if (savedConnection) {
          const connectionData = JSON.parse(savedConnection)
          connectionData.chainId = chainId
          localStorage.setItem('web3-connection', JSON.stringify(connectionData))
        }
      }
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw error
    }
  }

  const value: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    switchNetwork
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}