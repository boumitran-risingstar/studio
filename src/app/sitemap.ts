import { MetadataRoute } from 'next';
import { QUALIFICATIONS } from '@/lib/qualifications';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mouth-metrics-d696a.web.app';

  // Static routes
  const staticRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Dynamic qualification routes
  const qualificationRoutes = QUALIFICATIONS.map((qual) => ({
    url: `${baseUrl}/qualification/${qual.value}`,
    lastModified: new Date(),
  }));

  // NOTE: We cannot generate user slugs dynamically as there is no API endpoint to fetch all users.
  // When such an endpoint is available, we can add user profile URLs to the sitemap.

  return [...staticRoutes, ...qualificationRoutes];
}
