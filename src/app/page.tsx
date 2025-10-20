
"use client";

import { useUser } from "@/firebase";
import DashboardLayout from "./dashboard/layout";

export default function Home() {
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
