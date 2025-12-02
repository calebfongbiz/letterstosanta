'use client'

import { useState } from 'react'
import { Button } from '@/components'

interface UpgradeButtonsProps {
  customerId: string
  currentTier: string
  showUnlock?: boolean
}

export function UpgradeButtons({ customerId, currentTier, showUnlock }: UpgradeButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (targetTier: string) => {
    setIsLoading(targetTier)
    
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          targetTier,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setIsLoading(null)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setIsLoading(null)
    }
  }

  // FREE tier - show both upgrade options
  if (currentTier === 'FREE') {
    if (showUnlock) {
      return (
        <Button 
          variant="gold" 
          size="sm"
          onClick={() => handleUpgrade('TRACKER')}
          isLoading={isLoading === 'TRACKER'}
        >
          🔓 Unlock Tracker - $14.99
        </Button>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleUpgrade('TRACKER')}
          isLoading={isLoading === 'TRACKER'}
        >
          Upgrade to Tracker - $14.99
        </Button>
        <Button 
          variant="gold" 
          size="sm"
          onClick={() => handleUpgrade('EXPERIENCE')}
          isLoading={isLoading === 'EXPERIENCE'}
        >
          Upgrade to Full Experience - $19.99
        </Button>
      </div>
    )
  }

  // TRACKER tier - show upgrade to experience
  if (currentTier === 'TRACKER') {
    return (
      <Button 
        variant="gold" 
        size="sm"
        onClick={() => handleUpgrade('EXPERIENCE')}
        isLoading={isLoading === 'EXPERIENCE'}
      >
        Upgrade to Full Experience - $5.00
      </Button>
    )
  }

  // EXPERIENCE tier - no upgrade available
  return null
}
