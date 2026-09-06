/**
 * Cookie Parser Helper
 */

export const getCookie = (req: any, name: string): string | undefined => {
  const header = req.raw.headers.cookie;
  if (!header) return undefined;
  
  const match = header.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return undefined;
};

export const setCookie = (res: any, name: string, value: string, options: any = {}) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.secure) cookie += `; Secure`;
  if (options.httpOnly) cookie += `; HttpOnly`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  res.header('Set-Cookie', cookie);
};
