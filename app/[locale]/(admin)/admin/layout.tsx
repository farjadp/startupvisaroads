import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F0E9] flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 flex flex-col">
        <AdminHeader />
        <main className="flex-grow p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
