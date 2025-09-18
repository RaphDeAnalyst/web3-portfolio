'use client'

import { useState } from 'react'
import { useWeb3 } from '@/lib/web3-context'
import { useNotification } from '@/lib/notification-context'
import { logger } from '@/lib/logger'

interface WalletOption {
  name: string
  icon: string
  description: string
  installed: boolean
}

export function WalletConnect() {
  const { isConnected, address, ensName, chainId, isConnecting, connect, disconnect, switchNetwork } = useWeb3()
  const { error, success } = useNotification()
  const [showWallets, setShowWallets] = useState(false)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)

  const walletOptions: WalletOption[] = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using browser wallet',
      installed: true
    },
    {
      name: 'WalletConnect',
      icon: '📱',
      description: 'Connect using mobile wallet',
      installed: true
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase',
      installed: false
    },
    {
      name: 'Rainbow',
      icon: '🌈',
      description: 'Connect using Rainbow wallet',
      installed: false
    }
  ]

  const networks = [
    { id: 1, name: 'Ethereum', icon: '⟐', color: 'gray-500' },
    { id: 137, name: 'Polygon', icon: '🔷', color: 'gray-600' },
    { id: 56, name: 'BSC', icon: '🟡', color: 'gray-400' },
    { id: 42161, name: 'Arbitrum', icon: '🔹', color: 'gray-700' },
    { id: 10, name: 'Optimism', icon: '🔴', color: 'gray-800' }
  ]

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getCurrentNetwork = () => {
    return networks.find(network => network.id === chainId)
  }

  const handleConnect = async (walletName: string) => {
    try {
      await connect()
      setShowWallets(false)
      success('Wallet connected successfully!')
    } catch (err) {
      logger.error('Connection failed:', err)
      error('Failed to connect wallet. Please try again.')
    }
  }

  const handleNetworkSwitch = async (networkId: number) => {
    const targetNetwork = networks.find(n => n.id === networkId)
    setIsSwitchingNetwork(true)
    try {
      await switchNetwork(networkId)
      success(`Switched to ${targetNetwork?.name || 'network'} successfully!`)
    } catch (err) {
      logger.error('Network switch failed:', err)
      error('Failed to switch network. Please try again.')
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm">
          {/* Network Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              !getCurrentNetwork() ? 'bg-gray-500' :
              getCurrentNetwork()?.color === 'gray-500' ? 'bg-gray-500' :
              getCurrentNetwork()?.color === 'gray-600' ? 'bg-gray-600' :
              getCurrentNetwork()?.color === 'gray-400' ? 'bg-gray-400' :
              getCurrentNetwork()?.color === 'gray-700' ? 'bg-gray-700' :
              getCurrentNetwork()?.color === 'gray-800' ? 'bg-gray-800' :
              'bg-gray-500'
            }`}></div>
            <span className="text-xs text-foreground/60">{getCurrentNetwork()?.name || 'Unknown'}</span>
          </div>
          
          {/* Address/ENS */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs font-bold">
              W
            </div>
            <span className="text-sm font-medium text-foreground">
              {ensName || formatAddress(address)}
            </span>
          </div>
          
          {/* Disconnect Button */}
          <button
            onClick={disconnect}
            className="text-xs text-foreground/60 hover:text-foreground transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Disconnect
          </button>
        </div>
        
        {/* Network Switcher */}
        <div className="absolute top-full mt-2 right-0 w-64 p-3 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-background/95 backdrop-blur-sm shadow-lg z-50">
          <h4 className="text-sm font-medium text-foreground mb-3">Switch Network</h4>
          <div className="space-y-2">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                disabled={isSwitchingNetwork || chainId === network.id}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors duration-200 ${
                  chainId === network.id
                    ? `${
                      network.color === 'gray-500' ? 'bg-gray-500/20 text-gray-700 dark:text-gray-300' :
                      network.color === 'gray-600' ? 'bg-gray-600/20 text-gray-700 dark:text-gray-300' :
                      network.color === 'gray-400' ? 'bg-gray-400/20 text-gray-700 dark:text-gray-300' :
                      network.color === 'gray-700' ? 'bg-gray-700/20 text-gray-700 dark:text-gray-300' :
                      network.color === 'gray-800' ? 'bg-gray-800/20 text-gray-700 dark:text-gray-300' :
                      'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                    }`
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${isSwitchingNetwork ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-lg">{network.icon}</span>
                <span className="text-sm font-medium">{network.name}</span>
                {chainId === network.id && (
                  <span className="text-xs bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 px-2 py-0.5 rounded-full ml-auto">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        disabled={isConnecting}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isConnecting
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500'
        }`}
      >
        {isConnecting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
        )}
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showWallets && (
        <div className="absolute top-full mt-2 right-0 w-80 p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 bg-background/95 backdrop-blur-sm shadow-xl z-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Connect Wallet</h3>
            <button
              onClick={() => setShowWallets(false)}
              className="text-foreground/60 hover:text-foreground transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                disabled={!wallet.installed}
                className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                  wallet.installed
                    ? 'border-gray-200 dark:border-gray-800 hover:border-cyber-500 hover:bg-cyber-500/5'
                    : 'border-gray-100 dark:border-gray-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-foreground">{wallet.name}</div>
                  <div className="text-sm text-foreground/60">{wallet.description}</div>
                </div>
                {!wallet.installed && (
                  <span className="text-xs text-foreground/40">Not installed</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-cyber-500/10 border border-cyber-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-cyber-500">🔐</span>
              <span className="text-sm font-medium text-cyber-500">Secure Connection</span>
            </div>
            <p className="text-xs text-foreground/70">
              Your wallet connection is encrypted and secure. We never store your private keys or access your funds.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}