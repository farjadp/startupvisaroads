import { describe, expect, it } from 'vitest';
import { importKey, parseImportRow } from '@/lib/rcip-finder/service';
import { normaliseEmail, readLoginToken, signLoginToken, signSession } from '@/lib/rcip-finder/session';
import { parseCsv, toImportRow } from '../../../scripts/import-rcip-employers.mjs';
import { signJWT, verifyJWT } from '@/lib/auth';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-at-least-sixteen-chars';

describe('import', () => {
  it('parses quoted CSV and maps the data project columns', () => {
    const csv = '﻿community,province,employer_name,found_name,address,found_address,business_type,naics,listed_rcip_sector,list_as_of,source_url,excluded_note,website,phone,emails,match_confidence\n' +
      'Sudbury,ON,"Acme, Inc.",,"1 Main St",,welding shop,332,,2026-08-14,https://x.example/list,"excluded from 2026 (fast food/gas/convenience)",https://acme.example,705,"a@acme.example; hr@acme.example",gemini - verify\n';
    const [row] = parseCsv(csv).map(toImportRow);
    expect(row).toMatchObject({ name: 'Acme, Inc.', sector: '31-33', closedNote: 'excluded', contactSource: 'ai_verify', emails: ['a@acme.example', 'hr@acme.example'] });
  });

  it('rejects rows without the required fields or with a non-http source', () => {
    expect(parseImportRow({ community: 'Sudbury' }).ok).toBe(false);
    expect(parseImportRow({ community: 'Sudbury', province: 'ON', name: 'A', sourceUrl: 'javascript:alert(1)' }).ok).toBe(false);
    const ok = parseImportRow({ community: 'Sudbury', province: 'ON', name: 'A', sourceUrl: 'https://x', website: 'ftp://bad', emails: ['bad', 'Good@X.ca'], contactSource: 'weird' });
    expect(ok.ok && ok.row).toMatchObject({ website: null, emails: ['good@x.ca'], contactSource: 'none' });
  });

  it('keys a listing on community, name and address, ignoring case and spacing', () => {
    expect(importKey({ community: 'Sudbury', name: 'Acme  Inc', address: '1 Main' })).toBe(importKey({ community: 'sudbury', name: 'acme inc', address: '1 MAIN' }));
    expect(importKey({ community: 'Sudbury', name: 'Acme', address: '1 Main' })).not.toBe(importKey({ community: 'Sudbury', name: 'Acme', address: '2 Main' }));
  });
});

describe('finder session', () => {
  it('normalises email addresses and rejects junk', () => {
    expect(normaliseEmail('  Jane@Example.CA ')).toBe('jane@example.ca');
    expect(normaliseEmail('no-at-sign')).toBeNull();
    expect(normaliseEmail(42)).toBeNull();
  });

  it('round-trips a login token and refuses a session token in its place', async () => {
    const t = await signLoginToken('jane@example.ca', 'fa');
    expect(await readLoginToken(t)).toEqual({ email: 'jane@example.ca', locale: 'fa' });
    expect(await readLoginToken(await signSession('user1'))).toBeNull();
  });

  it('uses a key the admin session cannot share', async () => {
    const adminToken = await signJWT({ username: 'admin', kind: 'finder-login', email: 'a@b.co' }, process.env.JWT_SECRET!);
    expect(await readLoginToken(adminToken)).toBeNull();
    const finder = await signSession('user1');
    expect(await verifyJWT(finder, process.env.JWT_SECRET!)).toBeNull();
  });
});
