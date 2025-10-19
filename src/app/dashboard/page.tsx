"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, BarChart2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser } from "@/firebase";

export default function DashboardPage() {
    const { user } = useUser();

    const featureCards = [
        {
            title: "Log a Symptom",
            description: "Record any new dental symptoms or concerns.",
            icon: <PlusCircle className="h-6 w-6 text-primary" />,
            action: "New Log",
            image: PlaceHolderImages.find(p => p.id === '1'),
        },
        {
            title: "View History",
            description: "Review your past symptom logs and notes.",
            icon: <FileText className="h-6 w-6 text-primary" />,
            action: "View Logs",
            image: PlaceHolderImages.find(p => p.id === '2'),
        },
        {
            title: "Analyze Trends",
            description: "Get insights into your dental health patterns.",
            icon: <BarChart2 className="h-6 w-6 text-primary" />,
            action: "See Insights",
            image: PlaceHolderImages.find(p => p.id === '3'),
        },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {user?.email?.split('@')[0] || 'User'}!</h1>
                <p className="text-muted-foreground mt-2">Here's a snapshot of your dental health journey.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featureCards.map((card, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden transition-all hover:shadow-xl group">
                        <div className="relative h-48 w-full">
                           {card.image && <Image src={card.image.imageUrl} alt={card.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={card.image.imageHint} />}
                        </div>
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            {card.icon}
                            <CardTitle className="font-headline">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <CardDescription className="flex-grow">{card.description}</CardDescription>
                            <Button className="mt-4 w-full">{card.action}</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Recent Activity</CardTitle>
                    <CardDescription>No recent activity to show. Start by logging a symptom.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-foreground">No activity</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Get started by logging a new symptom.</p>
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
