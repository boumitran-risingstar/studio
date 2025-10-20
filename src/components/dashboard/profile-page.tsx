
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getUserFromExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Mail, AlertTriangle, LinkIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

type ProfileData = {
    name: string;
    email: string;
    slugURL?: string;
};

export function ProfilePage() {
    const { user } = useUser();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.uid && !profileData && loading) {
            const fetchProfile = async () => {
                setError(null);
                const result = await getUserFromExternalApi(user.uid);
                if (result.success) {
                    setProfileData(result.data);
                } else {
                    setError(result.error);
                }
                setLoading(false);
            };
            fetchProfile();
        }
    }, [user?.uid, profileData, loading]);

    const getInitials = (name: string | undefined | null) => {
        if (!name) return '..';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">My Profile</CardTitle>
                    <CardDescription>View and manage your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!loading && !error && profileData && (
                         <>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user?.photoURL || undefined} alt={profileData.name} />
                                    <AvatarFallback className="text-3xl">{getInitials(profileData.name)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">
                                    {profileData.slugURL ? (
                                        <Link href={`/user/${profileData.slugURL}`} className="hover:underline" target="_blank">
                                            {profileData.name}
                                        </Link>
                                    ) : (
                                        profileData.name
                                    )}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-muted-foreground">{profileData.email}</p>
                                        <Badge variant={user?.emailVerified ? "default" : "destructive"} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                                            {user?.emailVerified ? 'Verified' : 'Not Verified'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Name</span>
                                    </div>
                                    <span>{profileData.name}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Email</span>
                                    </div>
                                    <span>{profileData.email}</span>
                                </div>
                            </div>
                         </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
