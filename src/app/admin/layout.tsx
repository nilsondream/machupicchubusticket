import SidebarAdmin from "./components/sidebar-admin";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid grid-cols-6 items-start">
      <SidebarAdmin />
      <div className="col-span-5">
        {children}
      </div>
    </main>
  );
}
