import crypto from 'crypto';
import dns from 'dns/promises';

function serializePayload(obj) {
  // Payfast requires keys sorted by name, excluding signature
  const pairs = Object.keys(obj)
    .filter((k) => k !== 'signature' && obj[k] !== undefined && obj[k] !== null)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(obj[k]).replace(/%20/g, '+')}`);
  return pairs.join('&');
}

export function signPayload(obj, passphrase) {
  const base = serializePayload(obj);
  const withPass = passphrase ? `${base}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}` : base;
  return crypto.createHash('md5').update(withPass).digest('hex');
}

export async function isFromPayfast(ip) {
  // In production, resolve Payfast A records for allowlist (see docs). For dev, return true.
  try {
    const hosts = ['www.payfast.co.za', 'w1w.payfast.co.za', 'w2w.payfast.co.za', 'sandbox.payfast.co.za'];
    const ips = new Set();
    for (const h of hosts) {
      const records = await dns.lookup(h, { all: true });
      records.forEach((r) => ips.add(r.address));
    }
    return ips.has(ip);
  } catch (e) {
    return false;
  }
}
