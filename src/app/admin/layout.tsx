import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
    </div>
  );
}
