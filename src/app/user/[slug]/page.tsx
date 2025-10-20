
import type { Metadata } from 'next';
import { getSlugDataFromExternalApi } from "@/app/actions";
import { UserProfileClientPage } from '@/components/user/user-profile-client-page';

type SlugData = {
    name: string;
    bio: string;
    photoURL?: string;
    slugURL: string;
    qualification?: string[];
    profession?: string[];
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const result = await getSlugDataFromExternalApi(slug);

  if (!result.success || !result.data) {
    return {
      title: 'User Not Found',
      description: 'The requested user profile could not be found.',
    };
  }

  const user = result.data as SlugData;
  const pageUrl = (process.env.NEXT_PUBLIC_BASE_URL || '') + `/user/${user.slugURL}`;

  return {
    title: `${user.name}'s Profile`,
    description: user.bio,
    openGraph: {
      title: `${user.name}'s Profile`,
      description: user.bio,
      url: pageUrl,
      type: 'profile',
      images: [
        {
          url: user.photoURL || 'https://picsum.photos/seed/default-user/1200/630',
          width: 1200,
          height: 630,
          alt: user.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.name}'s Profile`,
      description: user.bio,
      images: [user.photoURL || 'https://picsum.photos/seed/default-user/1200/630'],
    },
  };
}

export default async function UserSlugPage({ params }: Props) {
    const { slug } = params;
    const result = await getSlugDataFromExternalApi(slug);

    return <UserProfileClientPage initialData={result.success ? result.data : null} error={result.error} slug={slug} />;
}
