import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mouth-metrics-d696a.web.app';

  // Static routes that are part of the core user flow
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

  // NOTE: We cannot dynamically generate user profile slugs (/user/[slug]) 
  // as there is no API endpoint available to fetch a list of all users.
  // Once that is available, this sitemap can be updated to include them.

  return [...staticRoutes];
}
