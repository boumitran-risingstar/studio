
"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { getSlugDataFromExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, User, Briefcase, GraduationCap, Linkedin, Twitter, Globe, Facebook } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PROFESSIONS } from "@/lib/professions";
import { QUALIFICATIONS } from "@/lib/qualifications";
import { PinterestIcon } from "../icons/pinterest";

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

interface UserProfileClientPageProps {
    initialData: SlugData | null;
    error: string | null;
    slug: string;
}

export function UserProfileClientPage({ initialData, error: initialError, slug }: UserProfileClientPageProps) {
    const [data, setData] = useState<SlugData | null>(initialData);
    const [loading, setLoading] = useState(!initialData && !initialError);
    const [error, setError] = useState<string | null>(initialError);

    useEffect(() => {
        if (!initialData && !initialError) {
            const fetchSlugData = async () => {
                setLoading(true);
                setError(null);
                const result = await getSlugDataFromExternalApi(slug);
                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error);
                }
                setLoading(false);
            };
            fetchSlugData();
        }
    }, [slug, initialData, initialError]);

    const getInitials = (name: string | undefined | null) => {
        if (!name) return <User className="h-8 w-8" />;
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };

    const getLabelForValue = (value: string, options: {value: string, label: string}[]) => {
        return options.find(opt => opt.value === value)?.label || value;
    }
    
    const professions = React.useMemo(() => {
        if (!data?.profession) return [];
        if (Array.isArray(data.profession)) return data.profession;
        if (typeof data.profession === 'string') return data.profession.split(',').map(p => p.trim());
        return [];
    }, [data?.profession]);

    const qualifications = React.useMemo(() => {
        if (!data?.qualification) return [];
        if (Array.isArray(data.qualification)) return data.qualification;
        if (typeof data.qualification === 'string') return data.qualification.split(',').map(q => q.trim());
        return [];
    }, [data?.qualification]);

    const socialLinks = [
        data?.linkedinURL,
        data?.twitterURL,
        data?.facebookURL,
        data?.pinterestURL,
        data?.websiteURL
    ].filter(Boolean);

    const personSchema = data ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.name,
        "url": (process.env.NEXT_PUBLIC_BASE_URL || '') + `/user/${data.slugURL}`,
        "image": data.photoURL,
        "description": data.bio,
        "jobTitle": professions.map(p => getLabelForValue(p, PROFESSIONS)).join(', '),
        "honorificSuffix": qualifications.map(q => getLabelForValue(q, QUALIFICATIONS)).join(', '),
        "sameAs": socialLinks,
    } : null;

    const getFullWebsiteUrl = (url: string) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    return (
        <>
            {personSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            )}
            <div className="flex min-h-screen items-start justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
                <main className="flex-1 flex justify-center items-start mt-10 sm:mt-16">
                    <Card className="w-full max-w-lg shadow-2xl overflow-hidden">
                        <CardHeader className="text-center bg-card p-8">
                            {loading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Skeleton className="h-28 w-28 rounded-full" />
                                    <Skeleton className="h-8 w-48 mt-2" />
                                    <Skeleton className="h-5 w-64" />
                                </div>
                            ) : data ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                                        <AvatarImage src={data.photoURL} alt={data.name} />
                                        <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                            {getInitials(data.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center mt-2">
                                        <CardTitle className="font-headline text-3xl">{data.name}</CardTitle>
                                        <CardDescription className="text-lg text-foreground/80 leading-relaxed mt-2">
                                            {data.bio}
                                        </CardDescription>
                                    </div>
                                </div>
                            ) : null}
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {loading ? (
                                <div className="space-y-6">
                                    <div>
                                        <Skeleton className="h-6 w-32 mb-3" />
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                            <Skeleton className="h-6 w-32 rounded-full" />
                                            <Skeleton className="h-6 w-28 rounded-full" />
                                        </div>
                                    </div>
                                     <div>
                                        <Skeleton className="h-6 w-32 mb-3" />
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-6 w-28 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ) : error ? (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : data ? (
                                <>
                                    {(professions.length > 0) && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <Briefcase className="h-4 w-4" />
                                                Profession
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {professions.map(prof => (
                                                    <Badge key={prof} variant="secondary" className="text-sm">
                                                        {getLabelForValue(prof, PROFESSIONS)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(qualifications.length > 0) && (
                                        <div>
                                             <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <GraduationCap className="h-4 w-4" />
                                                Qualifications
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {qualifications.map(qual => (
                                                    <Badge key={qual} variant="outline" className="text-sm">
                                                        {getLabelForValue(qual, QUALIFICATIONS)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {professions.length === 0 && qualifications.length === 0 && !data.linkedinURL && !data.twitterURL && !data.websiteURL && (
                                        <div className="text-center text-muted-foreground py-4">
                                            <p>No additional details available.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    <p>User not found.</p>
                                </div>
                            )}
                        </CardContent>
                         {data && (data.linkedinURL || data.twitterURL || data.websiteURL || data.facebookURL || data.pinterestURL) && (
                            <CardFooter className="bg-muted/50 p-4 flex justify-center gap-4">
                                {data.linkedinURL && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={data.linkedinURL} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {data.twitterURL && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={data.twitterURL} target="_blank" rel="noopener noreferrer">
                                            <Twitter className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {data.facebookURL && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={data.facebookURL} target="_blank" rel="noopener noreferrer">
                                            <Facebook className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {data.pinterestURL && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={data.pinterestURL} target="_blank" rel="noopener noreferrer">
                                            <PinterestIcon className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                                {data.websiteURL && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={getFullWebsiteUrl(data.websiteURL)} target="_blank" rel="noopener noreferrer">
                                            <Globe className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                </main>
            </div>
        </>
    );
}
