
"use client";

import { useEffect, useState, use } from "react";
import { getSlugDataFromExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, User } from "lucide-react";

type SlugData = {
    name: string;
    bio: string;
    photoURL?: string;
};

export default function UserSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [data, setData] = useState<SlugData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
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
    }, [slug]);

    const getInitials = (name: string | undefined | null) => {
        if (!name) return <User className="h-8 w-8" />;
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
            <main className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        {loading ? (
                            <div className="flex flex-col items-center gap-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-7 w-40" />
                                <Skeleton className="h-4 w-60" />
                            </div>
                        ) : data ? (
                            <div className="flex flex-col items-center gap-4">
                                 <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                    <AvatarImage src={data.photoURL} alt={data.name} />
                                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                                        {getInitials(data.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <CardTitle className="font-headline text-2xl">{data.name}</CardTitle>
                                </div>
                            </div>
                        ) : null}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : error ? (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : data ? (
                             <CardDescription className="text-center text-lg text-foreground/80 leading-relaxed">
                                {data.bio}
                            </CardDescription>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>User not found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
