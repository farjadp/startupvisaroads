import { describe, it, expect } from 'vitest';
import { withPoolLimits } from '../prisma-pool';

const socketUrl = 'postgresql://svr:p%40ss%2Fword@localhost/app?host=/cloudsql/proj:us-central1:db';

describe('withPoolLimits', () => {
  it('bounds a Cloud SQL socket URL and leaves the password and host alone', () => {
    expect(withPoolLimits(socketUrl, {})).toBe(`${socketUrl}&connection_limit=2&pool_timeout=20`);
  });

  it('adds a query string when the URL has none', () => {
    expect(withPoolLimits('postgres://u:p@db/app', {})).toBe(
      'postgres://u:p@db/app?connection_limit=2&pool_timeout=20',
    );
  });

  it('takes the limits from the environment', () => {
    const url = withPoolLimits('postgresql://u:p@db/app', {
      DB_CONNECTION_LIMIT: '4',
      DB_POOL_TIMEOUT_SECONDS: '30',
    });
    expect(url).toBe('postgresql://u:p@db/app?connection_limit=4&pool_timeout=30');
  });

  it.each(['0', '-1', '1.5', 'many', ''])('ignores an invalid limit of %j', (value) => {
    expect(withPoolLimits('postgresql://u:p@db/app', { DB_CONNECTION_LIMIT: value })).toContain(
      'connection_limit=2',
    );
  });

  it('keeps limits already in the URL', () => {
    const url = 'postgresql://u:p@db/app?connection_limit=5&pool_timeout=9';
    expect(withPoolLimits(url, { DB_CONNECTION_LIMIT: '2' })).toBe(url);
  });

  it('fills in only the limit that is missing', () => {
    expect(withPoolLimits('postgresql://u:p@db/app?connection_limit=5', {})).toBe(
      'postgresql://u:p@db/app?connection_limit=5&pool_timeout=20',
    );
  });

  it('does not touch SQLite URLs', () => {
    expect(withPoolLimits('file:./dev.db', { DB_CONNECTION_LIMIT: '4' })).toBe('file:./dev.db');
  });
});
