"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FileText, MoreHorizontal, Star, FolderIcon, Trash2, Copy, Clock } from "lucide-react"

interface Page {
  id: string
  title: string
  icon: string
  lastModified: string
  isFavorite: boolean
  type: "page" | "database"
  folder?: string
  description?: string
  template?: string
  createdBy: string
  size: string
}

interface Folder {
  id: string
  name: string
  icon: string
  pageCount: number
}

interface Template {
  id: string
  name: string
  description: string
  icon: string
  type: "page" | "database"
  preview: string
}

interface PageManagerProps {
  onPageSelect: (pageId: string) => void
}

export function PageManager({ onPageSelect }: PageManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"title" | "lastModified" | "created">("lastModified")
  const [filterType, setFilterType] = useState<"all" | "page" | "database">("all")
  const [showNewPageDialog, setShowNewPageDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const [folders, setFolders] = useState([
    { id: "work", name: "Work", icon: "💼", pageCount: 3 },
    { id: "personal", name: "Personal", icon: "🏠", pageCount: 2 },
    { id: "projects", name: "Projects", icon: "🚀", pageCount: 4 },
  ])

  const [pages, setPages] = useState([
    {
      id: "welcome",
      title: "Welcome to Your Workspace",
      icon: "👋",
      lastModified: "2 hours ago",
      isFavorite: true,
      type: "page",
      folder: "work",
      description: "Introduction and getting started guide",
      createdBy: "You",
      size: "2.1 KB",
    },
    {
      id: "getting-started",
      title: "Getting Started Guide",
      icon: "🚀",
      lastModified: "1 day ago",
      isFavorite: false,
      type: "page",
      folder: "work",
      description: "Step-by-step guide for new users",
      createdBy: "You",
      size: "1.8 KB",
    },
    {
      id: "project-notes",
      title: "Project Notes",
      icon: "📝",
      lastModified: "3 days ago",
      isFavorite: true,
      type: "page",
      folder: "projects",
      description: "Detailed project documentation and notes",
      createdBy: "You",
      size: "4.2 KB",
    },
    {
      id: "meeting-notes",
      title: "Meeting Notes",
      icon: "📅",
      lastModified: "1 week ago",
      isFavorite: false,
      type: "page",
      folder: "work",
      description: "Weekly team meeting notes and action items",
      createdBy: "You",
      size: "3.1 KB",
    },
    {
      id: "tasks",
      title: "Tasks Database",
      icon: "✅",
      lastModified: "2 days ago",
      isFavorite: true,
      type: "database",
      folder: "projects",
      description: "Task management and project tracking",
      createdBy: "You",
      size: "5.7 KB",
    },
    {
      id: "personal-journal",
      title: "Personal Journal",
      icon: "📖",
      lastModified: "5 days ago",
      isFavorite: false,
      type: "page",
      folder: "personal",
      description: "Daily thoughts and reflections",
      createdBy: "You",
      size: "2.9 KB",
    },
  ])

  const templates = [
    {
      id: "blank",
      name: "Blank Page",
      description: "Start with an empty page",
      icon: "📄",
      type: "page",
      preview: "Empty page ready for your content",
    },
    {
      id: "meeting-notes",
      name: "Meeting Notes",
      description: "Template for meeting documentation",
      icon: "📅",
      type: "page",
      preview: "Date, attendees, agenda, notes, action items",
    },
    {
      id: "project-plan",
      name: "Project Plan",
      description: "Comprehensive project planning template",
      icon: "🎯",
      type: "page",
      preview: "Goals, timeline, resources, milestones",
    },
    {
      id: "task-database",
      name: "Task Database",
      description: "Task management database",
      icon: "✅",
      type: "database",
      preview: "Title, status, assignee, due date, priority",
    },
    {
      id: "contact-database",
      name: "Contact Database",
      description: "Contact management system",
      icon: "👥",
      type: "database",
      preview: "Name, email, phone, company, notes",
    },
    {
      id: "knowledge-base",
      name: "Knowledge Base",
      description: "Documentation and knowledge sharing",
      icon: "📚",
      type: "page",
      preview: "Categories, articles, search, FAQ",
    },
  ]

  const filteredPages = pages
    .filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder === "all" || page.folder === selectedFolder
      const matchesType = filterType === "all" || page.type === filterType
      return matchesSearch && matchesFolder && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "lastModified":
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        case "created":
          return b.id.localeCompare(a.id)
        default:
          return 0
      }
    })

  const toggleFavorite = (pageId: string) => {
    setPages(pages.map((page) => (page.id === pageId ? { ...page, isFavorite: !page.isFavorite } : page)))
  }

  const createPage = (title: string, template: string, folder: string, description: string) => {
    const newPage = {
      id: Date.now().toString(),
      title,
      icon: templates.find((t) => t.id === template)?.icon || "📄",
      lastModified: "Just now",
      isFavorite: false,
      type: templates.find((t) => t.id === template)?.type || "page",
      folder: folder === "none" ? undefined : folder,
      description,
      template,
      createdBy: "You",
      size: "0 KB",
    }
    setPages([newPage, ...pages])
    setShowNewPageDialog(false)
    onPageSelect(newPage.id)
  }

  const createFolder = (name: string, icon: string) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      icon,
      pageCount: 0,
    }
    setFolders([...folders, newFolder])
    setShowNewFolderDialog(false)
  }

  const deletePage = (pageId: string) => {
    setPages(pages.filter((page) => page.id !== pageId))
  }

  const duplicatePage = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId)
    if (page) {
      const duplicatedPage = {
        ...page,
        id: Date.now().toString(),
        title: `${page.title} (Copy)`,
        lastModified: "Just now",
      }
      setPages([duplicatedPage, ...pages])
    }
  }

  const NewPageDialog = () => {
    const [formData, setFormData] = useState({
      title: "",
      template: "blank",
      folder: "none",
      description: "",
    })

    const handleCreate = () => {
      if (formData.title.trim()) {
        createPage(formData.title, formData.template, formData.folder, formData.description)
        setFormData({ title: "", template: "blank", folder: "none", description: "" })
      }
    }

    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter page title"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Choose Template</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    formData.template === template.id ? "ring-2 ring-primary" : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, template: template.id })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{template.icon}</span>
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {template.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="folder">Folder</Label>
              <Select value={formData.folder} onValueChange={(value) => setFormData({ ...formData, folder: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.icon} {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this page"
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewPageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title.trim()}>
              Create Page
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  const NewFolderDialog = () => {
    const [formData, setFormData] = useState({ name: "", icon: "📁" })

    const handleCreate = () => {
      if (formData.name.trim()) {
        createFolder(formData.name, formData.icon)
        setFormData({ name: "", icon: "📁" })
      }
    }

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter folder name"
            />
          </div>
          <div>
            <Label htmlFor="folderIcon">Icon</Label>
            <Input
              id="folderIcon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📁"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim()}>
              Create Folder
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">All Pages</h1>
            <p className="text-muted-foreground">Manage your workspace pages and databases</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FolderIcon className="w-4 h-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <NewFolderDialog />
            </Dialog>
            <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Page
                </Button>
              </DialogTrigger>
              <NewPageDialog />
            </Dialog>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Folder Filter */}
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.icon} {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="page">Pages</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastModified">Last Modified</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground">
              {filteredPages.length} of {pages.length} pages
            </p>
          </div>

          <TabsContent value="grid" className="space-y-6">
            {/* Favorites Section */}
            {filteredPages.some((page) => page.isFavorite) && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Favorites
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPages
                    .filter((page) => page.isFavorite)
                    .map((page) => (
                      <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-lg flex-shrink-0">{page.icon}</span>
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-base truncate">{page.title}</CardTitle>
                                {page.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{page.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(page.id)
                                }}
                              >
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicatePage(page.id)
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deletePage(page.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0" onClick={() => onPageSelect(page.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {page.type}
                              </Badge>
                              {page.folder && (
                                <Badge variant="outline" className="text-xs">
                                  {folders.find((f) => f.id === page.folder)?.icon}{" "}
                                  {folders.find((f) => f.id === page.folder)?.name}
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {page.lastModified}
                              </div>
                              <div className="text-xs text-muted-foreground">{page.size}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* All Pages Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                All Pages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPages.map((page) => (
                  <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{page.icon}</span>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate">{page.title}</CardTitle>
                            {page.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{page.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(page.id)
                            }}
                          >
                            <Star
                              className={`w-4 h-4 ${page.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicatePage(page.id)
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deletePage(page.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0" onClick={() => onPageSelect(page.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {page.type}
                          </Badge>
                          {page.folder && (
                            <Badge variant="outline" className="text-xs">
                              {folders.find((f) => f.id === page.folder)?.icon}{" "}
                              {folders.find((f) => f.id === page.folder)?.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {page.lastModified}
                          </div>
                          <div className="text-xs text-muted-foreground">{page.size}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <Card key={page.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                  <CardContent className="p-4" onClick={() => onPageSelect(page.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg">{page.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{page.title}</h3>
                          {page.description && (
                            <p className="text-sm text-muted-foreground truncate">{page.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {page.type}
                          </Badge>
                          {page.folder && (
                            <Badge variant="outline" className="text-xs">
                              {folders.find((f) => f.id === page.folder)?.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{page.size}</span>
                        <span>{page.lastModified}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(page.id)
                            }}
                          >
                            <Star
                              className={`w-4 h-4 ${page.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
