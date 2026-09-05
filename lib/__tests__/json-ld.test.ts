import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import JsonLd from '@/components/JsonLd';

describe('JsonLd', () => {
  it('escapes less-than characters so data cannot close the script element', () => {
    const markup = renderToStaticMarkup(
      React.createElement(JsonLd, {
        data: { headline: '</script><script>alert("xss")</script>' },
      }),
    );

    expect(markup).not.toContain('</script><script>');
    expect(markup).toContain('\\u003c/script>\\u003cscript>alert');
  });
});
