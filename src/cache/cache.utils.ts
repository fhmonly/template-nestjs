// utils.ts
import crypto from 'crypto';

export function stableHash(obj: any): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(sortObject(obj)))
    .digest('hex');
}

function sortObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        res[key] = sortObject(obj[key]);
        return res;
      }, {} as any);
  }
  return obj;
}
