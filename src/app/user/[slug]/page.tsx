
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
    linkedinURL?: string;
    twitterURL?: string;
    websiteURL?: string;
    facebookURL?: string;
    pinterestURL?: string;
};

type Props = {
  params: { slug: string };
};

const getLabelForValue = (value: string, options: {value: string, label: string}[]) => {
    return options.find(opt => opt.value === value)?.label || value;
}

const getFullWebsiteUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
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

  const professions = Array.isArray(user.profession) ? user.profession : (typeof user.profession === 'string' ? user.profession.split(',').map(p => p.trim()) : []);
  const qualifications = Array.isArray(user.qualification) ? user.qualification : (typeof user.qualification === 'string' ? user.qualification.split(',').map(q => q.trim()) : []);
  
  const professionString = professions.map(p => getLabelForValue(p, PROFESSIONS)).join(', ');
  const qualificationString = qualifications.map(q => getLabelForValue(q, QUALIFICATIONS)).join(', ');

  const titleParts = [user.name];
  if (professionString) titleParts.push(professionString);
  if (qualificationString) titleParts.push(qualificationString);
  const title = titleParts.join(' | ');

  let description = user.bio;
  if (professionString) {
      description += ` Professional roles include ${professionString}.`;
  }
  if (qualificationString) {
      description += ` Holds qualifications such as ${qualificationString}.`;
  }

  const socialLinks = [
    user.linkedinURL,
    user.twitterURL,
    user.facebookURL,
    user.pinterestURL,
    user.websiteURL ? getFullWebsiteUrl(user.websiteURL) : undefined
  ].filter((url): url is string => !!url);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": user.name,
    "url": pageUrl,
    "image": user.photoURL,
    "description": user.bio,
    "jobTitle": professionString,
    "honorificSuffix": qualificationString,
    "sameAs": socialLinks,
  };

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
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
      profile: {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [user.photoURL || 'https://picsum.photos/seed/default-user/1200/630'],
    },
    alternates: {
        canonical: pageUrl,
    },
    other: {
      'application/ld+json': JSON.stringify(personSchema)
    }
  };
}

export default async function UserSlugPage({ params }: Props) {
    const { slug } = params;
    const result = await getSlugDataFromExternalApi(slug);

    return <UserProfileClientPage initialData={result.success ? result.data : null} error={result.error} slug={slug} />;
}
