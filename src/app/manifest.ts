import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mouth Metrics',
    short_name: 'Mouth Metrics',
    description: 'Elevate Your Professional Profile',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5F5',
    theme_color: '#7373B3',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
