
"use client";

import { useEffect, useState } from "react";
import { getSlugDataFromExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, User, Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { PROFESSIONS } from "@/lib/professions";
import { QUALIFICATIONS } from "@/lib/qualifications";

type SlugData = {
    name: string;
    bio: string;
    photoURL?: string;
    slugURL: string;
    qualification?: string[];
    profession?: string[];
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
        // This effect will only run on the client if initialData is not present
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
    
    const personSchema = data ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.name,
        "url": (process.env.NEXT_PUBLIC_BASE_URL || '') + `/user/${data.slugURL}`,
        "image": data.photoURL,
        "description": data.bio,
        "jobTitle": data.profession?.map(p => getLabelForValue(p, PROFESSIONS)).join(', '),
        "honorificSuffix": data.qualification?.map(q => getLabelForValue(q, QUALIFICATIONS)).join(', ')
    } : null;

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
                                    {(data.profession && data.profession.length > 0) && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <Briefcase className="h-4 w-4" />
                                                Profession
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.profession.map(prof => (
                                                    <Badge key={prof} variant="secondary" className="text-sm">
                                                        {getLabelForValue(prof, PROFESSIONS)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(data.qualification && data.qualification.length > 0) && (
                                        <div>
                                             <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <GraduationCap className="h-4 w-4" />
                                                Qualifications
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.qualification.map(qual => (
                                                    <Badge key={qual} variant="outline" className="text-sm">
                                                        {getLabelForValue(qual, QUALIFICATIONS)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(!data.profession || data.profession.length === 0) && (!data.qualification || data.qualification.length === 0) && (
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
                    </Card>
                </main>
            </div>
        </>
    );
}
