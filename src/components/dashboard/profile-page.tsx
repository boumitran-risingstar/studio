
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getUserFromExternalApi, updateUserInExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Mail, AlertTriangle, LinkIcon, Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { QUALIFICATIONS } from "@/lib/qualifications";

type ProfileData = {
    name: string;
    email: string;
    slugURL?: string;
    qualification?: string;
    profession?: string;
};

export function ProfilePage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    // Local state for form fields
    const [qualifications, setQualifications] = useState<string[]>([]);
    const [profession, setProfession] = useState('');

    useEffect(() => {
        if (user?.uid && !hasFetched) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                const result = await getUserFromExternalApi(user.uid);
                if (result.success) {
                    setProfileData(result.data);
                    // Initialize form state with fetched data
                    setQualifications(result.data.qualification ? result.data.qualification.split(',').map((q: string) => q.trim()) : []);
                    setProfession(result.data.profession || '');
                } else {
                    setError(result.error);
                }
                setLoading(false);
                setHasFetched(true);
            };
            fetchProfile();
        }
    }, [user?.uid, hasFetched]);

    const handleSaveChanges = async () => {
        if (!user?.uid) return;
        setIsSaving(true);
        
        const result = await updateUserInExternalApi({
            uid: user.uid,
            qualification: qualifications.join(', '),
            profession
        });

        if (result.success) {
            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
            // Optimistically update local state
            setProfileData(prev => prev ? { ...prev, qualification: qualifications.join(', '), profession } : null);
        } else {
            toast({
                title: "Error",
                description: result.error || "Could not save your changes.",
                variant: "destructive",
            });
        }
        setIsSaving(false);
    };

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
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
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
                                                {profileData.name} <LinkIcon className="inline h-4 w-4 text-muted-foreground"/>
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

                                <div className="space-y-2">
                                    <Label htmlFor="qualification" className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-4 w-4" /> Qualification</Label>
                                    <MultiSelect
                                        options={QUALIFICATIONS}
                                        selected={qualifications}
                                        onChange={setQualifications}
                                        placeholder="Select qualifications..."
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profession" className="flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" /> Profession</Label>
                                    <Input 
                                        id="profession" 
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        placeholder="e.g., Dentist, Researcher"
                                    />
                                </div>
                            </div>
                         </>
                    )}
                </CardContent>
                {!loading && !error && profileData && (
                     <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
