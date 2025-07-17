import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MT9 Notícias & Comércios',
    short_name: 'MT9 Notícias',
    description: 'Portal de notícias MT9 - Seu portal de informação confiável e atualizada',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#228be6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/mt9-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['news', 'information', 'media'],
    lang: 'pt-BR',
    orientation: 'portrait-primary',
  }
}
