"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Settings, Search, Plus, ChevronDown, ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "./global-search"
import type { ViewType } from "./notion-layout"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  currentPageId: string
  onPageChange: (pageId: string) => void
}

export function Sidebar({ currentView, onViewChange, currentPageId, onPageChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)

  // Mock data for pages
  const pages = [
    { id: "welcome", title: "Welcome", icon: "👋" },
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "project-notes", title: "Project Notes", icon: "📝" },
    { id: "meeting-notes", title: "Meeting Notes", icon: "📅" },
  ]

  const databases = [
    { id: "tasks", title: "Tasks", icon: "✅" },
    { id: "projects", title: "Projects", icon: "📊" },
    { id: "contacts", title: "Contacts", icon: "👥" },
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setShowGlobalSearch(true)
    }
  }

  return (
    <>
      <div
        className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-sidebar-accent rounded flex items-center justify-center">
              <span className="text-xs font-semibold text-sidebar-accent-foreground">N</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">My Workspace</span>
          </div>

          {/* Enhanced Search with Global Search Trigger */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/60" />
            <Button
              variant="ghost"
              className="w-full justify-start pl-9 pr-3 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground/60 hover:bg-sidebar-accent/70 h-9"
              onClick={() => setShowGlobalSearch(true)}
            >
              <span className="flex-1 text-left">Search...</span>
              <div className="flex items-center gap-1 text-xs">
                <kbd className="px-1 py-0.5 bg-sidebar-accent/70 rounded text-xs">⌘</kbd>
                <kbd className="px-1 py-0.5 bg-sidebar-accent/70 rounded text-xs">K</kbd>
              </div>
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Quick Actions */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={() => onViewChange("editor")}
              >
                <Plus className="w-4 h-4" />
                New Page
              </Button>
            </div>

            {/* Navigation */}
            <div className="space-y-1 mb-4">
              <Button
                variant={currentView === "editor" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-2",
                  currentView === "editor"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
                onClick={() => onViewChange("editor")}
              >
                <Home className="w-4 h-4" />
                Home
              </Button>

              <Button
                variant={currentView === "database" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-2",
                  currentView === "database"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
                onClick={() => onViewChange("database")}
              >
                <Database className="w-4 h-4" />
                Databases
              </Button>
            </div>

            {/* Workspace Section */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-1 text-sidebar-foreground/80 hover:bg-sidebar-accent/50 mb-2"
                onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
              >
                {isWorkspaceExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-xs font-medium">WORKSPACE</span>
              </Button>

              {isWorkspaceExpanded && (
                <div className="space-y-1 ml-2">
                  {pages.map((page) => (
                    <Button
                      key={page.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-2 text-sm",
                        currentPageId === page.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      )}
                      onClick={() => {
                        onPageChange(page.id)
                        onViewChange("editor")
                      }}
                    >
                      <span>{page.icon}</span>
                      {page.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Databases Section */}
            <div className="mb-4">
              <div className="text-xs font-medium text-sidebar-foreground/80 mb-2 px-2">DATABASES</div>
              <div className="space-y-1">
                {databases.map((db) => (
                  <Button
                    key={db.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
                    onClick={() => onViewChange("database")}
                  >
                    <span>{db.icon}</span>
                    {db.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onNavigate={(pageId) => {
          onPageChange(pageId)
          onViewChange("editor")
        }}
      />
    </>
  )
}
