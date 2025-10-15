import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchIntel } from '../services/api'
import type { IpIntelResponse } from '../types'

interface CachedResult {
  ip: string
  data: IpIntelResponse
  timestamp: number
}

type IpContext = {
  ip: string
  setIp: (v: string) => void
  loading: boolean
  error: string | null
  result: IpIntelResponse | null
  history: CachedResult[]
  submit: (e?: React.FormEvent) => Promise<void>
  clearError: () => void
  loadFromHistory: (cachedItem: CachedResult) => void
}

const HISTORY_KEY = 'ip-cache-history'
const MAX_HISTORY = 5
const IpContextCtx = createContext<IpContext | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IpIntelResponse | null>(null)
  const [history, setHistory] = useState<CachedResult[]>([])

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Load history from localStorage
    try {
      const historyRaw = localStorage.getItem(HISTORY_KEY)
      if (historyRaw) {
        const cached = JSON.parse(historyRaw) as CachedResult[]
        if (Array.isArray(cached)) {
          setHistory(cached)
          // Load the most recent result if available
          if (cached.length > 0) {
            const latest = cached[0]
            setResult(latest.data)
            setIp(latest.ip)
          }
        }
      }
    } catch {}
  }, [])

  function persistCache(item: IpIntelResponse) {
    try {
      const newCacheItem: CachedResult = {
        ip: item.ip,
        data: item,
        timestamp: Date.now()
      }

      // Add to beginning of array and keep only MAX_HISTORY items
      const newHistory = [newCacheItem, ...history.filter(h => h.ip !== item.ip)].slice(0, MAX_HISTORY)
      setHistory(newHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch {}
  }

  function loadFromHistory(cachedItem: CachedResult) {
    setIp(cachedItem.ip)
    setResult(cachedItem.data)
    setError(null)
  }

  function isValidIpFormat(v: string) {
    const v4 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
    const v6 = /^[0-9a-fA-F:]+$/
    return v4.test(v) || v6.test(v)
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!isValidIpFormat(ip)) {
      setError('Please enter a valid IP address.')
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true) // set loading to true
    setError(null)

    try {
      const data = await fetchIntel(ip.trim(), abortRef.current.signal) as IpIntelResponse
      setResult(data)
      persistCache(data)
    } catch (err: any) {
      setError(err?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo<IpContext>(() => ({
    ip, setIp, loading, error, result, history, submit, clearError: () => setError(null), loadFromHistory
  }), [ip, loading, error, result, history])

  return <IpContextCtx.Provider value={value}>{children}</IpContextCtx.Provider>
}

export function useAppState() {
  const ctx = useContext(IpContextCtx)
  if (!ctx) throw new Error('useAppState must be used within <AppStateProvider>')
  return ctx
}
