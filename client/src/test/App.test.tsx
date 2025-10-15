import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { AppStateProvider } from '../context/ipIntelContext'

// Mock the ResultCard component
vi.mock('../components/ResultCard', () => ({
  default: ({ result }: { result: any }) => (
    <div data-testid="result-card">
      {result ? `Result for ${result.ip}` : 'No result'}
    </div>
  )
}))

function renderApp() {
  return render(
    <AppStateProvider>
      <App />
    </AppStateProvider>
  )
}

describe('App Component', () => {
  it('should render the dashboard title', () => {
    renderApp()
    expect(screen.getByText('Threat Intelligence Dashboard')).toBeInTheDocument()
  })

  it('should render IP input field', () => {
    renderApp()
    const input = screen.getByPlaceholderText(/Enter IPv4 or IPv6/)
    expect(input).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderApp()
    const button = screen.getByRole('button', { name: /Check/i })
    expect(button).toBeInTheDocument()
  })

  it('should update input value', () => {
    renderApp()
    const input = screen.getByPlaceholderText(/Enter IPv4 or IPv6/)
    
    fireEvent.change(input, { target: { value: '192.168.1.1' } })
    
    expect(input).toHaveValue('192.168.1.1')
  })

  it('should show loading state', () => {
    renderApp()
    const input = screen.getByPlaceholderText(/Enter IPv4 or IPv6/)
    const button = screen.getByRole('button', { name: /Check/i })
    
    fireEvent.change(input, { target: { value: '8.8.8.8' } })
    fireEvent.click(button)
    
    // Check for loading spinner
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })
})