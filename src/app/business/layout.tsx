
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
