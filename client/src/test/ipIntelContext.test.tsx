import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppStateProvider, useAppState } from '../context/ipIntelContext'
import * as api from '../services/api'

// Mock the API
vi.mock('../services/api')
const mockedFetchIntel = vi.mocked(api.fetchIntel)

// Test component to access context
function TestComponent() {
  const { ip, setIp, loading, error, result, submit, clearError } = useAppState()
  
  return (
    <div>
      <input 
        data-testid="ip-input" 
        value={ip} 
        onChange={(e) => setIp(e.target.value)} 
      />
      <button data-testid="submit-btn" onClick={() => submit()}>
        Submit
      </button>
      <div data-testid="loading">{loading ? 'Loading...' : 'Not loading'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <div data-testid="result">{result ? 'Has result' : 'No result'}</div>
      <button data-testid="clear-error" onClick={clearError}>Clear Error</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AppStateProvider>
      <TestComponent />
    </AppStateProvider>
  )
}

describe('IP Intel Context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should set IP address', () => {
    renderWithProvider()
    const input = screen.getByTestId('ip-input')
    
    fireEvent.change(input, { target: { value: '192.168.1.1' } })
    
    expect(input).toHaveValue('192.168.1.1')
  })

  it('should show error for invalid IP', async () => {
    renderWithProvider()
    const input = screen.getByTestId('ip-input')
    const submitBtn = screen.getByTestId('submit-btn')
    
    fireEvent.change(input, { target: { value: 'invalid-ip' } })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Please enter a valid IP address.')
    })
  })

  it('should handle successful API call', async () => {
    const mockResponse = {
      ip: '8.8.8.8',
      isp: 'Google',
      country: 'US',
      abuseScore: 0,
      recentReports: 0,
      vpnOrProxy: false,
      overallRisk: 'Low' as const
    }
    
    mockedFetchIntel.mockResolvedValueOnce(mockResponse)
    
    renderWithProvider()
    const input = screen.getByTestId('ip-input')
    const submitBtn = screen.getByTestId('submit-btn')
    
    fireEvent.change(input, { target: { value: '8.8.8.8' } })
    fireEvent.click(submitBtn)
    
    // Should show loading
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
    
    // Wait for result
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('Has result')
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })
  })

  it('should handle API error', async () => {
    mockedFetchIntel.mockRejectedValueOnce(new Error('API Error'))
    
    renderWithProvider()
    const input = screen.getByTestId('ip-input')
    const submitBtn = screen.getByTestId('submit-btn')
    
    fireEvent.change(input, { target: { value: '8.8.8.8' } })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('API Error')
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })
  })

  it('should clear error', async () => {
    renderWithProvider()
    const input = screen.getByTestId('ip-input')
    const submitBtn = screen.getByTestId('submit-btn')
    const clearBtn = screen.getByTestId('clear-error')
    
    // Trigger an error
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).not.toHaveTextContent('No error')
    })
    
    // Clear the error
    fireEvent.click(clearBtn)
    
    expect(screen.getByTestId('error')).toHaveTextContent('No error')
  })
})