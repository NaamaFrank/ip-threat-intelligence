import { getIntel } from '../services/intel.service';

// Mock the provider functions
jest.mock('../providers/abuseipdb', () => ({
  fetchAbuseIPDB: jest.fn()
}));

jest.mock('../providers/ipqs', () => ({
  fetchIPQS: jest.fn()
}));

// Import the mocked functions
import { fetchAbuseIPDB } from '../providers/abuseipdb';
import { fetchIPQS } from '../providers/ipqs';

const mockAbuseIPDB = fetchAbuseIPDB as jest.MockedFunction<typeof fetchAbuseIPDB>;
const mockIPQS = fetchIPQS as jest.MockedFunction<typeof fetchIPQS>;

describe('Intel Service API Aggregation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should aggregate data from both providers successfully', async () => {
    // Mock successful responses
    mockAbuseIPDB.mockResolvedValue({
      ok: true,
      data: {
        abuseScore: 25,
        recentReports: 3,
        country: 'US',
        isp: 'Example ISP'
      }
    });

    mockIPQS.mockResolvedValue({
      ok: true,
      data: {
        threatScore: 45,
        vpnOrProxy: true,
        country: 'United States',
        isp: 'IPQS ISP',
        hostname: 'example.com'
      }
    });

    const result = await getIntel('192.168.1.1');

    expect(result).toEqual({
      ip: '192.168.1.1',
      abuseScore: 25,
      recentReports: 3,
      threatScore: 45,
      vpnOrProxy: true,
      country: 'United States', // IPQS preferred
      isp: 'IPQS ISP', // IPQS preferred
      hostname: 'example.com',
      overallRisk: 'Medium' // 25*0.6 + 45*0.4 + 15 = 48
    });
  });

  test('should handle provider failures gracefully', async () => {
    // Mock one failure, one success
    mockAbuseIPDB.mockRejectedValue(new Error('Network error'));
    mockIPQS.mockResolvedValue({
      ok: true,
      data: {
        threatScore: 30,
        vpnOrProxy: false,
        country: 'US',
        hostname: 'test.com',
        isp: null
      }
    });

    const result = await getIntel('8.8.8.8');

    expect(result).toEqual({
      ip: '8.8.8.8',
      threatScore: 30,
      vpnOrProxy: false,
      country: 'US',
      hostname: 'test.com',
      overallRisk: 'Low', // 0*0.6 + 30*0.4 + 0 = 12
      warnings: ['abuseipdb_error']
    });
  });

  test('should handle provider errors (not failures)', async () => {
    // Mock error responses from providers
    mockAbuseIPDB.mockResolvedValue({
      ok: false,
      warning: 'rate_limit_exceeded'
    });

    mockIPQS.mockResolvedValue({
      ok: false,
      warning: 'invalid_api_key'
    });

    const result = await getIntel('1.1.1.1');

    expect(result).toEqual({
      ip: '1.1.1.1',
      overallRisk: 'Low', // No data means all scores are 0
      warnings: ['rate_limit_exceeded', 'invalid_api_key']
    });
  });

  test('should prefer IPQS data for overlapping fields', async () => {
    // Both providers return overlapping data
    mockAbuseIPDB.mockResolvedValue({
      ok: true,
      data: {
        abuseScore: 20,
        recentReports: 1,
        country: 'Abuse Country',
        isp: 'Abuse ISP',
        hostname: 'abuse.example.com'
      }
    });

    mockIPQS.mockResolvedValue({
      ok: true,
      data: {
        threatScore: 35,
        vpnOrProxy: false,
        country: 'IPQS Country',
        isp: 'IPQS ISP',
        hostname: 'ipqs.example.com'
      }
    });

    const result = await getIntel('10.0.0.1');

    // Should prefer IPQS for overlapping fields
    expect(result.country).toBe('IPQS Country');
    expect(result.isp).toBe('IPQS ISP');
    expect(result.hostname).toBe('ipqs.example.com');
    
    // Should keep unique fields from each provider
    expect(result.abuseScore).toBe(20);
    expect(result.recentReports).toBe(1);
    expect(result.threatScore).toBe(35);
    expect(result.vpnOrProxy).toBe(false);
  });

  test('should fallback to AbuseIPDB for missing IPQS fields', async () => {
    mockAbuseIPDB.mockResolvedValue({
      ok: true,
      data: {
        abuseScore: 15,
        recentReports: 2,
        country: 'Fallback Country',
        isp: 'Fallback ISP'
      }
    });

    // IPQS returns data but missing some fields
    mockIPQS.mockResolvedValue({
      ok: true,
      data: {
        threatScore: 25,
        vpnOrProxy: true,
        country: null,
        isp: null,
        hostname: null
      }
    });

    const result = await getIntel('203.0.113.1');

    expect(result.country).toBe('Fallback Country');
    expect(result.isp).toBe('Fallback ISP');
    expect(result.threatScore).toBe(25);
    expect(result.vpnOrProxy).toBe(true);
  });
});