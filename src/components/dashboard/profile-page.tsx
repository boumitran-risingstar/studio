

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getUserFromExternalApi, updateUserInExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Mail, AlertTriangle, LinkIcon, Briefcase, GraduationCap, Linkedin, Twitter, Globe } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { QUALIFICATIONS } from "@/lib/qualifications";
import { PROFESSIONS } from "@/lib/professions";

type ProfileData = {
    name: string;
    email: string;
    slugURL?: string;
    qualification?: string[];
    profession?: string[];
    linkedinURL?: string;
    twitterURL?: string;
    websiteURL?: string;
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
    const [professions, setProfessions] = useState<string[]>([]);
    const [linkedinURL, setLinkedinURL] = useState('');
    const [twitterURL, setTwitterURL] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');

    useEffect(() => {
        if (user?.uid && !hasFetched) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                const result = await getUserFromExternalApi(user.uid);
                if (result.success) {
                    const data = result.data;
                    setProfileData(data);
                    
                    // Initialize qualifications state
                    let currentQualifications: string[] = [];
                    if (Array.isArray(data.qualification)) {
                        currentQualifications = data.qualification;
                    } else if (typeof data.qualification === 'string' && data.qualification) {
                        currentQualifications = data.qualification.split(',').map((q: string) => q.trim());
                    }
                    setQualifications(currentQualifications);

                    // Initialize professions state
                    let currentProfessions: string[] = [];
                    if (Array.isArray(data.profession)) {
                        currentProfessions = data.profession;
                    } else if (typeof data.profession === 'string' && data.profession) {
                        currentProfessions = data.profession.split(',').map((p: string) => p.trim());
                    }
                    setProfessions(currentProfessions);

                    // Initialize social profiles state
                    setLinkedinURL(data.linkedinURL || '');
                    setTwitterURL(data.twitterURL || '');
                    setWebsiteURL(data.websiteURL || '');

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
            qualification: qualifications,
            profession: professions,
            linkedinURL: linkedinURL,
            twitterURL: twitterURL,
            websiteURL: websiteURL
        });

        if (result.success) {
            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
            // Optimistically update local state
            setProfileData(prev => prev ? { 
                ...prev, 
                qualification: qualifications, 
                profession: professions,
                linkedinURL,
                twitterURL,
                websiteURL
            } : null);
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
                                    <MultiSelect
                                        options={PROFESSIONS}
                                        selected={professions}
                                        onChange={setProfessions}
                                        placeholder="Select professions..."
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedinURL" className="flex items-center gap-2 text-muted-foreground"><Linkedin className="h-4 w-4" /> LinkedIn URL</Label>
                                    <Input id="linkedinURL" value={linkedinURL} onChange={(e) => setLinkedinURL(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="twitterURL" className="flex items-center gap-2 text-muted-foreground"><Twitter className="h-4 w-4" /> Twitter (X) URL</Label>
                                    <Input id="twitterURL" value={twitterURL} onChange={(e) => setTwitterURL(e.target.value)} placeholder="https://twitter.com/yourhandle" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="websiteURL" className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4" /> Website URL</Label>
                                    <Input id="websiteURL" value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} placeholder="https://yourwebsite.com" />
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
