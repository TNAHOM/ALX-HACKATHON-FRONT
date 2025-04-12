"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bed, ChevronDown, Home, LayoutDashboard, Menu, Settings, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AdminSidebarProps {
  children: React.ReactNode
}

export function AdminSidebar({ children }: AdminSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [roomsOpen, setRoomsOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
              <div className="space-y-1">
                <NavItem
                  href="/admin"
                  icon={LayoutDashboard}
                  active={pathname === "/admin"}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavItem>
                <Collapsible open={roomsOpen} onOpenChange={setRoomsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={pathname.includes("/admin/rooms") ? "secondary" : "ghost"}
                      className="w-full justify-between"
                    >
                      <div className="flex items-center">
                        <Bed className="mr-2 h-4 w-4" />
                        <span>Rooms</span>
                      </div>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", roomsOpen ? "rotate-180" : "")} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1">
                    <NavItem
                      href="/admin/rooms"
                      icon={Home}
                      active={pathname === "/admin/rooms"}
                      onClick={() => setOpen(false)}
                    >
                      Rooms
                    </NavItem>
                    <NavItem
                      href="/admin/room-types"
                      icon={Tag}
                      active={pathname === "/admin/room-types"}
                      onClick={() => setOpen(false)}
                    >
                      Room Types
                    </NavItem>
                  </CollapsibleContent>
                </Collapsible>
                <NavItem
                  href="/admin/settings"
                  icon={Settings}
                  active={pathname === "/admin/settings"}
                  onClick={() => setOpen(false)}
                >
                  Settings
                </NavItem>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-white md:block md:w-64">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              <NavItem href="/admin" icon={LayoutDashboard} active={pathname === "/admin"}>
                Dashboard
              </NavItem>
              <Collapsible open={roomsOpen} onOpenChange={setRoomsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={pathname.includes("/admin/rooms") ? "secondary" : "ghost"}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center">
                      <Bed className="mr-2 h-4 w-4" />
                      <span>Rooms</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", roomsOpen ? "rotate-180" : "")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <NavItem href="/admin/rooms" icon={Home} active={pathname === "/admin/rooms"}>
                    Rooms
                  </NavItem>
                  <NavItem href="/admin/room-types" icon={Tag} active={pathname === "/admin/room-types"}>
                    Room Types
                  </NavItem>
                </CollapsibleContent>
              </Collapsible>
              <NavItem href="/admin/settings" icon={Settings} active={pathname === "/admin/settings"}>
                Settings
              </NavItem>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
          <div className="flex h-16 items-center px-4 md:px-6">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}

function NavItem({ href, icon: Icon, active, children, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
        active ? "bg-gray-100" : "transparent",
      )}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </Link>
  )
}
