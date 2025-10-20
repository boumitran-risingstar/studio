

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getUserFromExternalApi, updateUserInExternalApi } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Mail, AlertTriangle, Briefcase, GraduationCap, Linkedin, Twitter, Globe, Facebook } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { QUALIFICATIONS } from "@/lib/qualifications";
import { PROFESSIONS } from "@/lib/professions";
import { PinterestIcon } from "../icons/pinterest";
import { Checkbox } from "../ui/checkbox";

type ProfileData = {
    name: string;
    email: string;
    slugURL?: string;
    qualification?: string[];
    profession?: string[];
    linkedinURL?: string;
    twitterURL?: string;
    websiteURL?: string;
    facebookURL?: string;
    pinterestURL?: string;
};

const extractSlug = (url: string | undefined, prefix: string) => {
    if (!url) return '';
    // Ensure prefix ends with a slash for consistent splitting
    const consistentPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    
    // Check for both http and https, and www variants
    const urlPattern = new RegExp(`^(https?://)?(www\\.)?${consistentPrefix.replace(/^(https?:\/\/)?(www\.)?/, '')}`);
    
    if (url.match(urlPattern)) {
        return url.replace(urlPattern, '');
    }

    return url;
};

const SocialInput = ({ id, label, icon: Icon, prefix, value, onChange, placeholder }: { id: string, label: string, icon: React.ElementType, prefix: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4" /> {label}
        </Label>
        <div className="flex items-center">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm h-10">
                {prefix}
            </span>
            <Input id={id} value={value} onChange={onChange} className="rounded-l-none" placeholder={placeholder} />
        </div>
    </div>
);


export function ProfilePage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const [qualifications, setQualifications] = useState<string[]>([]);
    const [professions, setProfessions] = useState<string[]>([]);
    const [linkedinSlug, setLinkedinSlug] = useState('');
    const [twitterSlug, setTwitterSlug] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');
    const [facebookSlug, setFacebookSlug] = useState('');
    const [pinterestSlug, setPinterestSlug] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (user?.uid && !hasFetched) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                const result = await getUserFromExternalApi(user.uid);
                if (result.success) {
                    const data = result.data;
                    setProfileData(data);
                    
                    let currentQualifications: string[] = [];
                    if (Array.isArray(data.qualification)) {
                        currentQualifications = data.qualification;
                    } else if (typeof data.qualification === 'string' && data.qualification) {
                        currentQualifications = data.qualification.split(',').map((q: string) => q.trim());
                    }
                    setQualifications(currentQualifications);

                    let currentProfessions: string[] = [];
                    if (Array.isArray(data.profession)) {
                        currentProfessions = data.profession;
                    } else if (typeof data.profession === 'string' && data.profession) {
                        currentProfessions = data.profession.split(',').map((p: string) => p.trim());
                    }
                    setProfessions(currentProfessions);

                    setLinkedinSlug(extractSlug(data.linkedinURL, 'linkedin.com'));
                    setTwitterSlug(extractSlug(data.twitterURL, 'twitter.com'));
                    setFacebookSlug(extractSlug(data.facebookURL, 'facebook.com'));
                    setPinterestSlug(extractSlug(data.pinterestURL, 'pinterest.com'));
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
        if (!user?.uid || !isConfirmed) return;
        setIsSaving(true);
        
        const fullLinkedinURL = linkedinSlug ? `https://linkedin.com/${linkedinSlug}` : '';
        const fullTwitterURL = twitterSlug ? `https://twitter.com/${twitterSlug}` : '';
        const fullFacebookURL = facebookSlug ? `https://facebook.com/${facebookSlug}` : '';
        const fullPinterestURL = pinterestSlug ? `https://pinterest.com/${pinterestSlug}` : '';

        const result = await updateUserInExternalApi({
            uid: user.uid,
            qualification: qualifications,
            profession: professions,
            linkedinURL: fullLinkedinURL,
            twitterURL: fullTwitterURL,
            websiteURL: websiteURL,
            facebookURL: fullFacebookURL,
            pinterestURL: fullPinterestURL
        });

        if (result.success) {
            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
            setProfileData(prev => prev ? { 
                ...prev, 
                qualification: qualifications, 
                profession: professions,
                linkedinURL: fullLinkedinURL,
                twitterURL: fullTwitterURL,
                websiteURL,
                facebookURL: fullFacebookURL,
                pinterestURL: fullPinterestURL,
            } : null);
        } else {
            toast({
                title: "Error",
                description: result.error || "Could not save your changes.",
                variant: "destructive",
            });
        }
        setIsSaving(false);
        setIsConfirmed(false); // Reset confirmation after saving
    };

    const getInitials = (name: string | undefined | null) => {
        if (!name) return '..';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };

    const ProfileSkeletons = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">My Profile</CardTitle>
                    <CardDescription>View and manage your account details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                     <CardDescription>Manage your qualifications and professions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Social Profiles</CardTitle>
                    <CardDescription>Add links to your social media profiles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return <div className="max-w-2xl mx-auto"><ProfileSkeletons /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!error && profileData && (
                 <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">My Profile</CardTitle>
                            <CardDescription>View and manage your account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Information</CardTitle>
                            <CardDescription>Let others know about your expertise and background.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Social Profiles</CardTitle>
                            <CardDescription>Add links to your social media and website.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SocialInput id="linkedinSlug" label="LinkedIn" icon={Linkedin} prefix="linkedin.com/" value={linkedinSlug} onChange={(e) => setLinkedinSlug(e.target.value)} placeholder="your-profile" />
                            <SocialInput id="twitterSlug" label="Twitter (X)" icon={Twitter} prefix="twitter.com/" value={twitterSlug} onChange={(e) => setTwitterSlug(e.target.value)} placeholder="yourusername" />
                            <SocialInput id="facebookSlug" label="Facebook" icon={Facebook} prefix="facebook.com/" value={facebookSlug} onChange={(e) => setFacebookSlug(e.target.value)} placeholder="yourusername" />
                            <SocialInput id="pinterestSlug" label="Pinterest" icon={PinterestIcon} prefix="pinterest.com/" value={pinterestSlug} onChange={(e) => setPinterestSlug(e.target.value)} placeholder="yourusername" />
                            <div className="space-y-2">
                                <Label htmlFor="websiteURL" className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4" /> Website URL</Label>
                                <Input id="websiteURL" value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} placeholder="https://yourwebsite.com" />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <AlertDialog onOpenChange={(open) => !open && setIsConfirmed(false)}>
                            <AlertDialogTrigger asChild>
                                <Button disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save All Changes'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Your Changes</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please confirm that all the information you are providing is personal data and not related to a business profile.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex items-center space-x-2 my-4">
                                    <Checkbox id="terms" checked={isConfirmed} onCheckedChange={(checked) => setIsConfirmed(checked as boolean)} />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree that this is personal data.
                                    </label>
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSaveChanges} disabled={!isConfirmed || isSaving}>
                                    Confirm & Save
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                 </>
            )}
        </div>
    );
}
