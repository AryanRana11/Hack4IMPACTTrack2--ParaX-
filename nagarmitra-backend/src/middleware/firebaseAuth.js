import { firebaseAdmin } from '../config/firebaseAdmin.js';

export function requireFirebaseAuth({ requireVerified = true } = {}) {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : null;
      if (!token) return res.status(401).json({ error: 'Missing Authorization header' });
      if (!firebaseAdmin?.apps?.length) return res.status(500).json({ error: 'Auth not configured on server' });

      const decoded = await firebaseAdmin.auth().verifyIdToken(token);
      if (requireVerified && !decoded.email_verified) {
        return res.status(403).json({ error: 'Email not verified' });
      }
      req.user = decoded; // contains uid, email, etc.
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token', detail: err.message });
    }
  };
}
