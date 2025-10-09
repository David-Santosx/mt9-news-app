'use client';

import Script from 'next/script';

type BreadcrumbItem = {
  position: number;
  name: string;
  item: string;
};

type BreadcrumbSchemaProps = {
  itemListElement: BreadcrumbItem[];
};

export default function BreadcrumbSchema({ itemListElement }: BreadcrumbSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemListElement.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}