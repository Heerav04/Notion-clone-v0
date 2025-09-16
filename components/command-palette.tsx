"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Database, Settings, Plus, Search, Home, Trash2, Copy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Command {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  action: () => void
  category: "navigation" | "create" | "edit" | "search"
  keywords: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (view: string, pageId?: string) => void
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    // Navigation
    {
      id: "nav-home",
      title: "Go to Home",
      description: "Navigate to the home page",
      icon: <Home className="w-4 h-4" />,
      action: () => onNavigate("editor", "welcome"),
      category: "navigation",
      keywords: ["home", "main", "start"],
    },
    {
      id: "nav-database",
      title: "Go to Databases",
      description: "View all databases",
      icon: <Database className="w-4 h-4" />,
      action: () => onNavigate("database"),
      category: "navigation",
      keywords: ["database", "table", "data"],
    },
    {
      id: "nav-pages",
      title: "Go to All Pages",
      description: "View all pages and documents",
      icon: <FileText className="w-4 h-4" />,
      action: () => onNavigate("pages"),
      category: "navigation",
      keywords: ["pages", "documents", "all"],
    },
    {
      id: "nav-settings",
      title: "Open Settings",
      description: "Configure workspace settings",
      icon: <Settings className="w-4 h-4" />,
      action: () => console.log("Open settings"),
      category: "navigation",
      keywords: ["settings", "preferences", "config"],
    },

    // Create
    {
      id: "create-page",
      title: "Create New Page",
      description: "Create a new blank page",
      icon: <FileText className="w-4 h-4" />,
      action: () => console.log("Create page"),
      category: "create",
      keywords: ["new", "page", "document", "create"],
    },
    {
      id: "create-database",
      title: "Create New Database",
      description: "Create a new database",
      icon: <Database className="w-4 h-4" />,
      action: () => console.log("Create database"),
      category: "create",
      keywords: ["new", "database", "table", "create"],
    },
    {
      id: "create-task",
      title: "Create New Task",
      description: "Add a new task to the task database",
      icon: <Plus className="w-4 h-4" />,
      action: () => console.log("Create task"),
      category: "create",
      keywords: ["new", "task", "todo", "create"],
    },

    // Search
    {
      id: "search-global",
      title: "Search Everything",
      description: "Search across all pages and databases",
      icon: <Search className="w-4 h-4" />,
      action: () => console.log("Global search"),
      category: "search",
      keywords: ["search", "find", "lookup"],
    },

    // Edit
    {
      id: "edit-duplicate",
      title: "Duplicate Current Page",
      description: "Create a copy of the current page",
      icon: <Copy className="w-4 h-4" />,
      action: () => console.log("Duplicate page"),
      category: "edit",
      keywords: ["duplicate", "copy", "clone"],
    },
    {
      id: "edit-favorite",
      title: "Add to Favorites",
      description: "Add current page to favorites",
      icon: <Star className="w-4 h-4" />,
      action: () => console.log("Add to favorites"),
      category: "edit",
      keywords: ["favorite", "star", "bookmark"],
    },
    {
      id: "edit-delete",
      title: "Delete Current Page",
      description: "Move current page to trash",
      icon: <Trash2 className="w-4 h-4" />,
      action: () => console.log("Delete page"),
      category: "edit",
      keywords: ["delete", "remove", "trash"],
    },
  ]

  const filteredCommands = commands.filter((command) => {
    if (!query.trim()) return true
    const searchText = `${command.title} ${command.description || ""} ${command.keywords.join(" ")}`.toLowerCase()
    return searchText.includes(query.toLowerCase())
  })

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) acc[command.category] = []
      acc[command.category].push(command)
      return acc
    },
    {} as Record<string, Command[]>,
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action()
      onClose()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "navigation":
        return "Navigation"
      case "create":
        return "Create"
      case "edit":
        return "Edit"
      case "search":
        return "Search"
      default:
        return category
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "navigation":
        return <Home className="w-4 h-4" />
      case "create":
        return <Plus className="w-4 h-4" />
      case "edit":
        return <FileText className="w-4 h-4" />
      case "search":
        return <Search className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="border-none bg-transparent text-lg focus:ring-0 focus:outline-none"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {getCategoryIcon(category)}
                  {getCategoryTitle(category)}
                </div>
                <div className="space-y-1 mt-1">
                  {commands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command)
                    return (
                      <div
                        key={command.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          globalIndex === selectedIndex ? "bg-accent" : "hover:bg-muted/50",
                        )}
                        onClick={() => {
                          command.action()
                          onClose()
                        }}
                      >
                        <div className="text-muted-foreground">{command.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{command.title}</div>
                          {command.description && (
                            <div className="text-sm text-muted-foreground">{command.description}</div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryTitle(command.category)}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No commands found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
