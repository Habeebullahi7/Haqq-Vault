import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HAQQ - Islamic Debt Vault',
    short_name: 'HAQQ',
    description: "Never Forget A Haqq - Quran 2:282",
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
