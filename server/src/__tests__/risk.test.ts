import { computeOverallRisk } from '../utils/risk';

describe('Risk Calculation', () => {
  test('should return Low risk for low scores', () => {
    expect(computeOverallRisk({ 
      abuseScore: 10, 
      threatScore: 20, 
      vpnOrProxy: false 
    })).toBe('Low');
  });

  test('should return Medium risk for moderate scores', () => {
    expect(computeOverallRisk({ 
      abuseScore: 50, 
      threatScore: 40, 
      vpnOrProxy: false 
    })).toBe('Medium');
  });

  test('should return High risk for high scores', () => {
    expect(computeOverallRisk({ 
      abuseScore: 80, 
      threatScore: 70, 
      vpnOrProxy: false 
    })).toBe('High');
  });

  test('should add VPN/Proxy penalty', () => {
    // Without VPN: 20 * 0.6 + 25 * 0.4 = 22 (Low)
    expect(computeOverallRisk({ 
      abuseScore: 20, 
      threatScore: 25, 
      vpnOrProxy: false 
    })).toBe('Low');

    // With VPN: 22 + 15 = 37 (Medium)
    expect(computeOverallRisk({ 
      abuseScore: 20, 
      threatScore: 25, 
      vpnOrProxy: true 
    })).toBe('Medium');
  });

  test('should handle edge cases at boundaries', () => {
    // Exactly 35 should be Medium
    expect(computeOverallRisk({ 
      abuseScore: 60, 
      threatScore: 0, 
      vpnOrProxy: false 
    })).toBe('Medium'); // 60 * 0.6 = 36

    // Just under 35 should be Low
    expect(computeOverallRisk({ 
      abuseScore: 58, 
      threatScore: 0, 
      vpnOrProxy: false 
    })).toBe('Low'); // 58 * 0.6 = 34.8

    // Exactly 70 should be High
    expect(computeOverallRisk({ 
      abuseScore: 100, 
      threatScore: 50, 
      vpnOrProxy: false 
    })).toBe('High'); // 100 * 0.6 + 50 * 0.4 = 80
  });
});