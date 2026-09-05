import { describe, it, expect } from 'vitest';
import { faRedirectTarget } from '../redirects';

describe('faRedirectTarget', () => {
  it('redirects a retired Persian mirror path to English', () => {
    expect(faRedirectTarget('/fa/pnp/ontario')).toBe('/en/pnp/ontario');
    expect(faRedirectTarget('/fa/country/denmark')).toBe('/en/country/denmark');
    expect(faRedirectTarget('/fa/europe/netherlands')).toBe('/en/europe/netherlands');
  });

  it('leaves a real Persian page alone', () => {
    expect(faRedirectTarget('/fa/canada-startup-visa')).toBeNull();
    expect(faRedirectTarget('/fa/pnp/nova-scotia')).toBeNull();
    expect(faRedirectTarget('/fa/europe/estonia')).toBeNull();
    expect(faRedirectTarget('/fa')).toBeNull();
    expect(faRedirectTarget('/fa/')).toBeNull();
  });

  it('leaves Persian blog articles alone', () => {
    expect(faRedirectTarget('/fa/blog/some-article')).toBeNull();
  });

  it('never touches English or admin paths', () => {
    expect(faRedirectTarget('/en/pnp/ontario')).toBeNull();
    expect(faRedirectTarget('/fa/admin')).toBeNull();
    expect(faRedirectTarget('/fa/admin/login')).toBeNull();
  });
});
