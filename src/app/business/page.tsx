
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Google Business Profile</CardTitle>
          <CardDescription>
            Connect and manage your Google Business Profile to keep your information up-to-date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground mb-4">You have not connected your Google Business Profile yet.</p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
