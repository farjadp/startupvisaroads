// Renders one or more JSON-LD structured-data blocks for crawlers and AI engines.
import React from 'react';

export default function JsonLd({ data }: { data: object | (object | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
