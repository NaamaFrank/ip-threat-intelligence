import { isIP } from 'node:net';

describe('IP Validation', () => {
  test('should validate IPv4 addresses', () => {
    expect(isIP('192.168.1.1')).toBe(4);
    expect(isIP('8.8.8.8')).toBe(4);
    expect(isIP('127.0.0.1')).toBe(4);
    expect(isIP('255.255.255.255')).toBe(4);
  });

  test('should validate IPv6 addresses', () => {
    expect(isIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(6);
    expect(isIP('2001:db8:85a3::8a2e:370:7334')).toBe(6);
    expect(isIP('::1')).toBe(6);
    expect(isIP('fe80::1')).toBe(6);
  });

  test('should reject invalid IP addresses', () => {
    expect(isIP('invalid')).toBe(0);
    expect(isIP('192.168.1.256')).toBe(0);
    expect(isIP('192.168.1')).toBe(0);
    expect(isIP('')).toBe(0);
    expect(isIP('not.an.ip')).toBe(0);
    expect(isIP('999.999.999.999')).toBe(0);
  });

  test('should handle edge cases', () => {
    expect(isIP('0.0.0.0')).toBe(4);
    expect(isIP('192.168.001.001')).toBe(0); // Leading zeros are invalid
    expect(isIP('192.168.1.1.1')).toBe(0); // Too many octets
  });
});