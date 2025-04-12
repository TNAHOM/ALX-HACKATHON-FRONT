import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./providers"
import { AdminSidebar } from "./components/admin-sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing hotel inventory",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar>{children}</AdminSidebar>
      </div>
    </Providers>
  )
}
