"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, SortAsc, Calendar, User, Grid3X3, List, CalendarDays, Edit, Trash2, X } from "lucide-react"

interface DatabaseItem {
  id: string
  title: string
  status: "Not Started" | "In Progress" | "Done"
  priority: "Low" | "Medium" | "High"
  assignee: string
  dueDate: string
  tags: string[]
  description?: string
  createdAt: string
}

type ViewType = "table" | "kanban" | "calendar"
type SortField = "title" | "status" | "priority" | "dueDate" | "createdAt"
type SortOrder = "asc" | "desc"

export function DatabaseView() {
  const [viewType, setViewType] = useState<ViewType>("table")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewItemDialog, setShowNewItemDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<DatabaseItem | null>(null)

  const [items, setItems] = useState<DatabaseItem[]>([
    {
      id: "1",
      title: "Design new landing page",
      status: "In Progress",
      priority: "High",
      assignee: "John Doe",
      dueDate: "2024-01-15",
      tags: ["Design", "Frontend"],
      description: "Create a modern, responsive landing page that showcases our product features.",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      title: "Implement user authentication",
      status: "Not Started",
      priority: "High",
      assignee: "Jane Smith",
      dueDate: "2024-01-20",
      tags: ["Development", "Backend"],
      description: "Set up secure user authentication with JWT tokens and password hashing.",
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      title: "Write documentation",
      status: "Done",
      priority: "Medium",
      assignee: "Bob Johnson",
      dueDate: "2024-01-10",
      tags: ["Documentation"],
      description: "Complete API documentation and user guides.",
      createdAt: "2024-01-03",
    },
    {
      id: "4",
      title: "Set up CI/CD pipeline",
      status: "In Progress",
      priority: "Medium",
      assignee: "Alice Brown",
      dueDate: "2024-01-25",
      tags: ["DevOps", "Automation"],
      description: "Configure automated testing and deployment pipeline.",
      createdAt: "2024-01-04",
    },
    {
      id: "5",
      title: "Mobile app testing",
      status: "Not Started",
      priority: "Low",
      assignee: "Charlie Wilson",
      dueDate: "2024-02-01",
      tags: ["Testing", "Mobile"],
      description: "Comprehensive testing of mobile application across different devices.",
      createdAt: "2024-01-05",
    },
  ])

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || item.status === filterStatus
      const matchesPriority = filterPriority === "all" || item.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortOrder === "asc" ? comparison : -comparison
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addItem = (newItem: Omit<DatabaseItem, "id" | "createdAt">) => {
    const item: DatabaseItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setItems([...items, item])
    setShowNewItemDialog(false)
  }

  const updateItem = (updatedItem: DatabaseItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const renderTableView = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="rounded" />
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSortField("title")
                  setSortOrder(sortField === "title" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Title <SortAsc className="w-3 h-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSortField("status")
                  setSortOrder(sortField === "status" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Status <SortAsc className="w-3 h-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSortField("dueDate")
                  setSortOrder(sortField === "dueDate" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Due Date <SortAsc className="w-3 h-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>
                <input type="checkbox" className="rounded" />
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div>{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {item.assignee}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {item.dueDate}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderKanbanView = () => {
    const columns = ["Not Started", "In Progress", "Done"]

    return (
      <div className="grid grid-cols-3 gap-6">
        {columns.map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{status}</h3>
              <Badge variant="secondary" className="text-xs">
                {filteredAndSortedItems.filter((item) => item.status === status).length}
              </Badge>
            </div>
            <div className="space-y-3">
              {filteredAndSortedItems
                .filter((item) => item.status === status)
                .map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {item.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderCalendarView = () => (
    <div className="text-center py-12">
      <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
      <p className="text-muted-foreground">Calendar view coming soon...</p>
    </div>
  )

  const ItemDialog = ({
    item,
    onSave,
    onClose,
  }: {
    item?: DatabaseItem | null
    onSave: (item: DatabaseItem | Omit<DatabaseItem, "id" | "createdAt">) => void
    onClose: () => void
  }) => {
    const [formData, setFormData] = useState({
      title: item?.title || "",
      description: item?.description || "",
      status: item?.status || ("Not Started" as const),
      priority: item?.priority || ("Medium" as const),
      assignee: item?.assignee || "",
      dueDate: item?.dueDate || "",
      tags: item?.tags?.join(", ") || "",
    })

    const handleSave = () => {
      const itemData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      if (item) {
        onSave({ ...item, ...itemData })
      } else {
        onSave(itemData)
      }
    }

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="Assigned to"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Tag1, Tag2, Tag3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{item ? "Update" : "Create"}</Button>
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
            <h1 className="text-2xl font-bold">Tasks Database</h1>
            <p className="text-muted-foreground">Manage your tasks and projects</p>
          </div>
          <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </DialogTrigger>
            <ItemDialog onSave={addItem} onClose={() => setShowNewItemDialog(false)} />
          </Dialog>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* View Type Selector */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewType === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewType("table")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Table
              </Button>
              <Button
                variant={viewType === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewType("kanban")}
                className="gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                Board
              </Button>
              <Button
                variant={viewType === "calendar" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewType("calendar")}
                className="gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </Button>
            </div>

            {/* Filters */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            {(filterStatus !== "all" || filterPriority !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus("all")
                  setFilterPriority("all")
                }}
                className="gap-2"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>

          {/* Search */}
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedItems.length} of {items.length} tasks
          </p>
        </div>

        {/* Database Views */}
        {viewType === "table" && renderTableView()}
        {viewType === "kanban" && renderKanbanView()}
        {viewType === "calendar" && renderCalendarView()}

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <ItemDialog item={editingItem} onSave={updateItem} onClose={() => setEditingItem(null)} />
        </Dialog>
      </div>
    </div>
  )
}
