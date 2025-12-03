'use client'

import { useState } from 'react'
import { Button } from '@/components'

interface UpgradeButtonsProps {
  customerId: string
  currentTier: string
  showUnlock?: boolean
}

export function UpgradeButtons({ customerId, currentTier, showUnlock }: UpgradeButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          targetTier: 'MAGIC',
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setIsLoading(false)
    }
  }

  // FREE tier - show upgrade to MAGIC
  if (currentTier === 'FREE') {
    if (showUnlock) {
      return (
        <Button 
          variant="gold" 
          size="sm"
          onClick={handleUpgrade}
          isLoading={isLoading}
        >
          🔓 Unlock Tracker - $7.99
        </Button>
      )
    }

    return (
      <Button 
        variant="gold" 
        size="sm"
        onClick={handleUpgrade}
        isLoading={isLoading}
      >
        Upgrade to Santa&apos;s Magic - $7.99 ✨
      </Button>
    )
  }

  // MAGIC tier - no upgrade available
  return null
}
