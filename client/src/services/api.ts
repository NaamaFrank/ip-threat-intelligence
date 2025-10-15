import axios from 'axios'
import type { IpIntelResponse } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:3001'
})

export async function fetchIntel(ip: string, signal?: AbortSignal): Promise<IpIntelResponse> {
  try {
    const response = await api.get<IpIntelResponse>('/api/intel', {
      params: { ip },
      signal
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || `Request failed: ${error.response?.status || 'Unknown error'}`
      throw new Error(message)
    }
    throw error
  }
}
