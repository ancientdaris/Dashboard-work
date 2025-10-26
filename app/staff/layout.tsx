import { Sidebar } from "@/components/layout/sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
