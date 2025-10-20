
import type { Metadata } from 'next';
import { getSlugDataFromExternalApi } from "@/app/actions";
import { UserProfileClientPage } from '@/components/user/user-profile-client-page';
import { PROFESSIONS } from '@/lib/professions';
import { QUALIFICATIONS } from '@/lib/qualifications';

type SlugData = {
    name: string;
    bio: string;
    photoURL?: string;
    slugURL: string;
    qualification?: string[] | string;
    profession?: string[] | string;
};

type Props = {
  params: { slug: string };
};

const getLabelForValue = (value: string, options: {value: string, label: string}[]) => {
    return options.find(opt => opt.value === value)?.label || value;
}

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

  const professions = Array.isArray(user.profession) ? user.profession : (typeof user.profession === 'string' ? user.profession.split(',').map(p => p.trim()) : []);
  const qualifications = Array.isArray(user.qualification) ? user.qualification : (typeof user.qualification === 'string' ? user.qualification.split(',').map(q => q.trim()) : []);
  
  const professionString = professions.map(p => getLabelForValue(p, PROFESSIONS)).join(', ');
  const qualificationString = qualifications.map(q => getLabelForValue(q, QUALIFICATIONS)).join(', ');

  let description = user.bio;
  if (professionString) {
      description += ` | Profession: ${professionString}`;
  }
  if (qualificationString) {
      description += ` | Qualifications: ${qualificationString}`;
  }


  return {
    title: `${user.name}'s Profile`,
    description: description,
    openGraph: {
      title: `${user.name}'s Profile`,
      description: description,
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
      description: description,
      images: [user.photoURL || 'https://picsum.photos/seed/default-user/1200/630'],
    },
  };
}

export default async function UserSlugPage({ params }: Props) {
    const { slug } = params;
    const result = await getSlugDataFromExternalApi(slug);

    return <UserProfileClientPage initialData={result.success ? result.data : null} error={result.error} slug={slug} />;
}
