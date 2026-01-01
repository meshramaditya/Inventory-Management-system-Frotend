"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function Header() {
  const { user, sidebarOpen, setSidebarOpen } = useStore()

  return (
    <header className="flex h-14 md:h-16 items-center justify-between border-b bg-background px-3 md:px-6">
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex-1 max-w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 h-9 text-sm md:text-base" 
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="text-xs md:text-sm hidden lg:block">
            <div className="font-medium">{user?.name}</div>
            <div className="text-muted-foreground">{user?.role}</div>
          </div>
        </div>
        <div className="sm:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
