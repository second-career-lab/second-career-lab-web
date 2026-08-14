import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'admin_session';

function hmac(value) {
  return crypto.createHmac('sha256', process.env.ADMIN_PASSWORD).update(value).digest('hex');
}

export function createSessionCookieValue() {
  return `ok.${hmac('ok')}`;
}

export function isValidSession(cookieValue) {
  if (!cookieValue) return false;
  const [value, sig] = cookieValue.split('.');
  if (value !== 'ok' || !sig) return false;
  const expected = hmac(value);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
