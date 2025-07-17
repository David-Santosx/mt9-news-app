import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sitemap.xml`,
  }
}
