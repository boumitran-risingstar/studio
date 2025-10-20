
"use client";

import { useUser } from "@/firebase";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import Image from 'next/image';

function LoggedInView() {
    const { user } = useUser();

    const WelcomeMessage = () => {
        return `Welcome, ${user?.displayName || user?.email?.split('@')[0] || 'User'}!`;
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        <WelcomeMessage />
                    </h1>
                    <p className="text-muted-foreground mt-2">Here's a snapshot of your dental health journey.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LoggedOutView() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl font-headline">Mouth Metrics</span>
        </Link>
        <div className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
              Elevate Your Professional Profile
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Join a community of verified professionals. Showcase your qualifications, share your expertise, and connect with peers in your field.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-headline">Build Your Verified Presence</h2>
                <p className="mt-4 text-muted-foreground">
                  Mouth Metrics provides a unique platform to create a public profile that highlights your professional journey. Add your qualifications, and link your social profiles to build a comprehensive and trustworthy online identity.
                </p>
                <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                        <span>Display your degrees, certifications, and professional titles.</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                        <span>Consolidate your online presence by linking to your social media and personal website.</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                        <span>Share your unique profile URL with colleagues and on other platforms.</span>
                    </li>
                </ul>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                 <Image
                    src="https://picsum.photos/seed/profile-share/600/400"
                    alt="Sample professional profile"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    data-ai-hint="professional profile"
                  />
              </div>
            </div>
          </div>
        </section>
      </main>

       <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mouth Metrics. All rights reserved.</p>
        </footer>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}


export default function Home() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
    
    return user ? <LoggedInView /> : <LoggedOutView />;
}
