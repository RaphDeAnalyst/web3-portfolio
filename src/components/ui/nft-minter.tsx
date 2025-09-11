'use client'

import { useState } from 'react'
import { useWeb3 } from '@/lib/web3-context'

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export function NFTMinter() {
  const { isConnected, address, ensName } = useWeb3()
  const [isMinting, setIsMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(0)

  const nftDesigns = [
    {
      name: 'Web3 Developer Badge',
      description: 'Digital business card showcasing Web3 expertise',
      rarity: 'Common',
      color: 'cyber-500'
    },
    {
      name: 'Analytics Expert Certificate',
      description: 'Proof of blockchain data analysis mastery',
      rarity: 'Rare',
      color: 'primary-500'
    },
    {
      name: 'AI Pioneer Token',
      description: 'Recognition for AI + Web3 innovation',
      rarity: 'Epic',
      color: 'purple-500'
    },
    {
      name: 'Early Supporter NFT',
      description: 'Exclusive badge for portfolio visitors',
      rarity: 'Legendary',
      color: 'yellow-500'
    }
  ]

  const generateNFTMetadata = (): NFTMetadata => {
    const design = nftDesigns[selectedDesign]
    return {
      name: `${design.name} #${Math.floor(Math.random() * 10000)}`,
      description: `${design.description}. Minted by ${ensName || address} as a digital collectible from Web3 Developer's portfolio.`,
      image: `https://portfolio.web3dev.eth/nft/${design.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      attributes: [
        { trait_type: 'Type', value: design.name },
        { trait_type: 'Rarity', value: design.rarity },
        { trait_type: 'Minted By', value: ensName || 'Anonymous' },
        { trait_type: 'Collection', value: 'Web3 Portfolio' },
        { trait_type: 'Mint Date', value: new Date().toISOString().split('T')[0] }
      ]
    }
  }

  const handleMint = async () => {
    if (!isConnected || !address) return

    setIsMinting(true)
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))

      const metadata = generateNFTMetadata()

      // Simulate successful mint
      setMintSuccess(true)
      setTimeout(() => setMintSuccess(false), 5000)
    } catch (error) {
      console.error('Minting failed:', error)
    } finally {
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/30 backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-bold">
          LINK
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Connect Wallet Required</h3>
        <p className="text-foreground/60 mb-4">
          Connect your wallet to mint a free digital business card NFT
        </p>
      </div>
    )
  }

  if (mintSuccess) {
    return (
      <div className="text-center p-8 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-cyber-500/10 backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white text-lg font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">NFT Minted Successfully!</h3>
        <p className="text-foreground/70 mb-4">
          Your {nftDesigns[selectedDesign].name} has been minted and sent to your wallet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => window.open('https://opensea.io', '_blank')}
            className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors duration-200"
          >
            View on OpenSea
          </button>
          <button 
            onClick={() => setMintSuccess(false)}
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 transition-colors duration-200"
          >
            Mint Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Mint Your <span className="text-gradient">Digital Business Card</span>
        </h3>
        <p className="text-foreground/70">
          Choose a design and mint a free NFT as proof of your visit to my portfolio
        </p>
      </div>

      {/* Design Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nftDesigns.map((design, index) => (
          <button
            key={index}
            onClick={() => setSelectedDesign(index)}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              selectedDesign === index
                ? `${
                  design.color === 'cyber-500' ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20' :
                  design.color === 'primary-500' ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20' :
                  design.color === 'purple-500' ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' :
                  'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
                }`
                : 'border-gray-200/50 dark:border-gray-800/50 bg-background/30 hover:border-gray-300 dark:hover:border-gray-700'
            } backdrop-blur-sm`}
          >
            <div className="text-center space-y-4">
              <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-r from-${design.color} to-${design.color}/70 flex items-center justify-center text-white text-xs font-bold`}>
                NFT
              </div>
              <div>
                <h4 className={`font-bold text-foreground mb-1 ${
                  selectedDesign === index ? (
                    design.color === 'cyber-500' ? 'text-cyber-500' :
                    design.color === 'primary-500' ? 'text-primary-500' :
                    design.color === 'purple-500' ? 'text-purple-500' :
                    'text-yellow-500'
                  ) : ''
                }`}>
                  {design.name}
                </h4>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  {design.description}
                </p>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                design.rarity === 'Common' ? 'bg-gray-500/20 text-gray-600 dark:text-gray-400' :
                design.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-600' :
                design.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-600' :
                'bg-yellow-500/20 text-yellow-600'
              }`}>
                {design.rarity}
              </div>
            </div>
            
            {selectedDesign === index && (
              <div className="mt-4 flex justify-center">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  design.color === 'cyber-500' ? 'bg-cyber-500' :
                  design.color === 'primary-500' ? 'bg-primary-500' :
                  design.color === 'purple-500' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`}></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected NFT Preview */}
      <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-primary-500/5 to-cyber-500/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-foreground">NFT Preview</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            nftDesigns[selectedDesign].color === 'cyber-500' ? 'bg-cyber-500/20 text-cyber-500' :
            nftDesigns[selectedDesign].color === 'primary-500' ? 'bg-primary-500/20 text-primary-500' :
            nftDesigns[selectedDesign].color === 'purple-500' ? 'bg-purple-500/20 text-purple-500' :
            'bg-yellow-500/20 text-yellow-500'
          }`}>
            Free Mint
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NFT Card Preview */}
          <div className="aspect-square rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-gradient-to-br from-background to-gray-50 dark:to-gray-900 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">{nftDesigns[selectedDesign].image}</div>
              <div className="space-y-2">
                <div className="text-lg font-bold text-foreground">
                  {nftDesigns[selectedDesign].name}
                </div>
                <div className="text-sm text-foreground/60">
                  #{Math.floor(Math.random() * 10000)}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Preview */}
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-foreground mb-2">Attributes</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Type</span>
                  <span className="text-sm font-medium text-foreground">{nftDesigns[selectedDesign].name}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Rarity</span>
                  <span className="text-sm font-medium text-foreground">{nftDesigns[selectedDesign].rarity}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Owner</span>
                  <span className="text-sm font-medium text-foreground">
                    {ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'You')}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Collection</span>
                  <span className="text-sm font-medium text-foreground">Web3 Portfolio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mint Button */}
      <div className="text-center">
        <button
          onClick={handleMint}
          disabled={isMinting}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isMinting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-primary-500 to-cyber-500 text-white hover:scale-105 shadow-lg shadow-primary-500/30'
          }`}
        >
          {isMinting && (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-3"></div>
          )}
          {isMinting ? 'Minting NFT...' : 'Mint Free NFT 🎁'}
        </button>
        
        <div className="mt-4 text-sm text-foreground/60">
          <p>✨ Completely free • No gas fees • Instant delivery</p>
          <p className="mt-1">🔒 Your NFT will be sent to: {ensName || `${address?.slice(0, 8)}...${address?.slice(-6)}`}</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="text-center p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
          <div className="text-2xl mb-2">🎯</div>
          <h5 className="font-semibold text-foreground mb-1">Proof of Visit</h5>
          <p className="text-xs text-foreground/60">Collectible proof you visited my Web3 portfolio</p>
        </div>
        
        <div className="text-center p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
          <div className="text-2xl mb-2">🌐</div>
          <h5 className="font-semibold text-foreground mb-1">Digital Business Card</h5>
          <p className="text-xs text-foreground/60">Contains my contact info and portfolio link</p>
        </div>
        
        <div className="text-center p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 bg-background/30">
          <div className="text-2xl mb-2">💎</div>
          <h5 className="font-semibold text-foreground mb-1">Future Utility</h5>
          <p className="text-xs text-foreground/60">May unlock exclusive content and updates</p>
        </div>
      </div>
    </div>
  )
}