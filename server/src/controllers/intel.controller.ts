import type { Request, Response } from 'express';
import { isIP } from 'node:net';
import { getIntel } from '../services/intel.service.js';

export async function intelController(req: Request, res: Response) {
  const ip = String(req.query.ip || '');
  if (!ip || isIP(ip) === 0) {
    return res.status(400).json({ error: 'invalid_ip', message: 'Provide a valid IPv4/IPv6' });
  }

  try {
    const data = await getIntel(ip);
    return res.json(data);
  } catch (e: any) {
    return res.status(502).json({ error: 'upstream_error', message: e?.message || 'Provider error' });
  }
}
