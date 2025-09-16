"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, Database, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: "page" | "database" | "block"
  icon: string
  description?: string
  content?: string
  lastModified: string
  folder?: string
  parentPage?: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (pageId: string) => void
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock data for search results
  const allContent: SearchResult[] = [
    {
      id: "welcome",
      title: "Welcome to Your Workspace",
      type: "page",
      icon: "👋",
      description: "Introduction and getting started guide",
      content:
        "This is your personal workspace where you can create pages, manage databases, and organize your thoughts.",
      lastModified: "2 hours ago",
      folder: "work",
    },
    {
      id: "getting-started",
      title: "Getting Started Guide",
      type: "page",
      icon: "🚀",
      description: "Step-by-step guide for new users",
      content:
        "Learn how to use this workspace effectively. Create your first page, set up databases, invite team members.",
      lastModified: "1 day ago",
      folder: "work",
    },
    {
      id: "project-notes",
      title: "Project Notes",
      type: "page",
      icon: "📝",
      description: "Detailed project documentation",
      content: "Project timeline, requirements, team members, milestones, and progress tracking.",
      lastModified: "3 days ago",
      folder: "projects",
    },
    {
      id: "tasks",
      title: "Tasks Database",
      type: "database",
      icon: "✅",
      description: "Task management and project tracking",
      content: "Manage tasks, assign team members, track progress, set due dates and priorities.",
      lastModified: "2 days ago",
      folder: "projects",
    },
    {
      id: "meeting-notes",
      title: "Meeting Notes",
      type: "page",
      icon: "📅",
      description: "Weekly team meeting notes",
      content: "Team standup, action items, decisions made, next steps, attendees.",
      lastModified: "1 week ago",
      folder: "work",
    },
    {
      id: "block-1",
      title: "Authentication Implementation",
      type: "block",
      icon: "🔐",
      content:
        "Set up secure user authentication with JWT tokens and password hashing. Include email verification and password reset functionality.",
      lastModified: "2 days ago",
      parentPage: "project-notes",
    },
    {
      id: "block-2",
      title: "Database Schema Design",
      type: "block",
      icon: "🗄️",
      content: "Design the database schema for user management, content storage, and relationships between entities.",
      lastModified: "3 days ago",
      parentPage: "project-notes",
    },
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const filtered = allContent.filter((item) => {
        const searchText = `${item.title} ${item.description || ""} ${item.content || ""}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
      setResults(filtered)
      setSelectedIndex(0)
    } else {
      setResults([])
      setSelectedIndex(0)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    const newRecentSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(newRecentSearches)

    // Navigate to the result
    if (result.type === "block" && result.parentPage) {
      onNavigate(result.parentPage)
    } else {
      onNavigate(result.id)
    }

    // Close search
    onClose()
    setQuery("")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "page":
        return <FileText className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "block":
        return <div className="w-4 h-4 bg-muted rounded-sm flex items-center justify-center text-xs">B</div>
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, databases, and content..."
            className="border-none bg-transparent text-lg focus:ring-0 focus:outline-none"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
            <span>to select</span>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {query.trim() ? (
            <div className="p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        index === selectedIndex ? "bg-accent" : "hover:bg-muted/50",
                      )}
                      onClick={() => handleSelect(result)}
                    >
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg">{result.icon}</span>
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{highlightMatch(result.title, query)}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.folder && (
                            <Badge variant="outline" className="text-xs">
                              {result.folder}
                            </Badge>
                          )}
                        </div>
                        {result.description && (
                          <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                            {highlightMatch(result.description, query)}
                          </p>
                        )}
                        {result.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {highlightMatch(result.content, query)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{result.lastModified}</span>
                          {result.parentPage && (
                            <>
                              <span>•</span>
                              <span>in {result.parentPage}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setQuery(search)}
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Create new page</span>
                    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs">N</kbd>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Create new database</span>
                    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs">D</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
