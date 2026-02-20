
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [showBanner, setShowBanner] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true)
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowBanner(true)
      const timer = setTimeout(() => {
        setShowBanner(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!showBanner) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
        isOnline
          ? 'bg-spiritual-teal text-white'
          : 'bg-spiritual-ember text-white'
      }`}
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>You're back online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>You're offline - Some features may be limited</span>
          </>
        )}
      </div>
    </div>
  )
}
