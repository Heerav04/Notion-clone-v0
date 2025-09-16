"use client"

import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Type,
  List,
  CheckSquare,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  GripVertical,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Divide as Divider,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Block {
  id: string
  type:
    | "heading1"
    | "heading2"
    | "heading3"
    | "paragraph"
    | "list"
    | "checklist"
    | "quote"
    | "code"
    | "divider"
    | "image"
  content: string
  checked?: boolean
  imageUrl?: string
}

interface EditorProps {
  pageId: string
}

export function Editor({ pageId }: EditorProps) {
  const [title, setTitle] = useState("Untitled")
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "paragraph",
      content: "Start writing...",
    },
  ])
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null)
  const [showSlashMenu, setShowSlashMenu] = useState<string | null>(null)
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement }>({})

  // Mock page content based on pageId
  useEffect(() => {
    switch (pageId) {
      case "welcome":
        setTitle("Welcome to Your Workspace")
        setBlocks([
          { id: "1", type: "heading1", content: "Welcome to Your Workspace" },
          {
            id: "2",
            type: "paragraph",
            content:
              "This is your personal workspace where you can create pages, manage databases, and organize your thoughts.",
          },
          { id: "3", type: "heading2", content: "Getting Started" },
          { id: "4", type: "list", content: "Create your first page" },
          { id: "5", type: "list", content: "Set up a database" },
          { id: "6", type: "list", content: "Invite team members" },
        ])
        break
      case "getting-started":
        setTitle("Getting Started Guide")
        setBlocks([
          { id: "1", type: "heading1", content: "Getting Started Guide" },
          { id: "2", type: "paragraph", content: "Learn how to use this workspace effectively." },
        ])
        break
      default:
        setTitle("Untitled")
        setBlocks([{ id: "1", type: "paragraph", content: "Start writing..." }])
    }
  }, [pageId])

  const addBlock = (afterId: string, type: Block["type"] = "paragraph") => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      ...(type === "checklist" && { checked: false }),
      ...(type === "image" && { imageUrl: "/placeholder-image.png" }),
    }

    const index = blocks.findIndex((b) => b.id === afterId)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    setBlocks(newBlocks)
    setShowBlockMenu(null)
    setShowSlashMenu(null)

    // Focus the new block
    setTimeout(() => {
      const input = inputRefs.current[newBlock.id]
      if (input) input.focus()
    }, 0)
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))

    // Handle slash commands
    if (content === "/") {
      setShowSlashMenu(id)
    } else if (showSlashMenu === id && !content.startsWith("/")) {
      setShowSlashMenu(null)
    }
  }

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return // Don't delete the last block

    const blockIndex = blocks.findIndex((b) => b.id === id)
    const newBlocks = blocks.filter((block) => block.id !== id)
    setBlocks(newBlocks)

    // Focus previous block or next block
    const targetIndex = blockIndex > 0 ? blockIndex - 1 : 0
    if (newBlocks[targetIndex]) {
      setTimeout(() => {
        const input = inputRefs.current[newBlocks[targetIndex].id]
        if (input) input.focus()
      }, 0)
    }
  }

  const duplicateBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id)
    if (!block) return

    const newBlock: Block = {
      ...block,
      id: Date.now().toString(),
    }

    const index = blocks.findIndex((b) => b.id === id)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    setBlocks(newBlocks)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id)
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return
    }

    const newBlocks = ([...blocks][
      // Swap blocks
      (newBlocks[targetIndex], newBlocks[index])
    ] = [newBlocks[index], newBlocks[targetIndex]])
    setBlocks(newBlocks)
  }

  const toggleCheck = (id: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, checked: !block.checked } : block)))
  }

  const handleKeyDown = (e: KeyboardEvent, blockId: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId)

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addBlock(blockId)
    } else if (e.key === "Backspace" && blocks[blockIndex].content === "") {
      e.preventDefault()
      deleteBlock(blockId)
    } else if (e.key === "ArrowUp" && e.metaKey) {
      e.preventDefault()
      moveBlock(blockId, "up")
    } else if (e.key === "ArrowDown" && e.metaKey) {
      e.preventDefault()
      moveBlock(blockId, "down")
    } else if (e.key === "ArrowUp" && blockIndex > 0) {
      const prevBlock = blocks[blockIndex - 1]
      const input = inputRefs.current[prevBlock.id]
      if (input) {
        input.focus()
        if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
          input.setSelectionRange(input.value.length, input.value.length)
        }
      }
    } else if (e.key === "ArrowDown" && blockIndex < blocks.length - 1) {
      const nextBlock = blocks[blockIndex + 1]
      const input = inputRefs.current[nextBlock.id]
      if (input) {
        input.focus()
        if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
          input.setSelectionRange(0, 0)
        }
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()

    if (!draggedBlockId || draggedBlockId === targetBlockId) return

    const draggedIndex = blocks.findIndex((b) => b.id === draggedBlockId)
    const targetIndex = blocks.findIndex((b) => b.id === targetBlockId)

    const newBlocks = [...blocks]
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)

    setBlocks(newBlocks)
    setDraggedBlockId(null)
  }

  const renderBlock = (block: Block, index: number) => {
    const commonClasses = "w-full border-none bg-transparent resize-none focus:outline-none focus:ring-0 p-0"
    const isActive = focusedBlockId === block.id

    return (
      <div
        key={block.id}
        className={cn(
          "group relative transition-all duration-200",
          isActive && "bg-muted/30 rounded-lg",
          draggedBlockId === block.id && "opacity-50",
        )}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, block.id)}
      >
        <div className="flex items-start gap-2 p-2">
          {/* Enhanced Block Handle */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-muted cursor-grab active:cursor-grabbing"
              onMouseDown={() => setDraggedBlockId(block.id)}
            >
              <GripVertical className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-muted"
              onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Block Content */}
          <div className="flex-1">
            {block.type === "heading1" && (
              <Input
                ref={(el) => el && (inputRefs.current[block.id] = el)}
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                className={cn(commonClasses, "text-3xl font-bold")}
                placeholder="Heading 1"
              />
            )}

            {block.type === "heading2" && (
              <Input
                ref={(el) => el && (inputRefs.current[block.id] = el)}
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                className={cn(commonClasses, "text-2xl font-semibold")}
                placeholder="Heading 2"
              />
            )}

            {block.type === "heading3" && (
              <Input
                ref={(el) => el && (inputRefs.current[block.id] = el)}
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                className={cn(commonClasses, "text-xl font-medium")}
                placeholder="Heading 3"
              />
            )}

            {block.type === "paragraph" && (
              <Textarea
                ref={(el) => el && (inputRefs.current[block.id] = el)}
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                className={cn(commonClasses, "min-h-[1.5rem] text-base leading-relaxed")}
                placeholder="Type '/' for commands"
                rows={1}
              />
            )}

            {block.type === "list" && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <Input
                  ref={(el) => el && (inputRefs.current[block.id] = el)}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  className={cn(commonClasses, "text-base")}
                  placeholder="List item"
                />
              </div>
            )}

            {block.type === "checklist" && (
              <div className="flex items-start gap-2">
                <button
                  onClick={() => toggleCheck(block.id)}
                  className="mt-1 w-4 h-4 border border-border rounded flex items-center justify-center hover:bg-muted"
                >
                  {block.checked && <CheckSquare className="w-3 h-3 text-primary" />}
                </button>
                <Input
                  ref={(el) => el && (inputRefs.current[block.id] = el)}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  className={cn(commonClasses, "text-base", block.checked && "line-through text-muted-foreground")}
                  placeholder="To-do"
                />
              </div>
            )}

            {block.type === "quote" && (
              <div className="border-l-4 border-muted pl-4">
                <Textarea
                  ref={(el) => el && (inputRefs.current[block.id] = el)}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  className={cn(commonClasses, "text-base italic text-muted-foreground")}
                  placeholder="Quote"
                  rows={1}
                />
              </div>
            )}

            {block.type === "code" && (
              <div className="bg-muted rounded p-3">
                <Textarea
                  ref={(el) => el && (inputRefs.current[block.id] = el)}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  className={cn(commonClasses, "font-mono text-sm bg-transparent")}
                  placeholder="Code"
                  rows={3}
                />
              </div>
            )}

            {block.type === "divider" && (
              <div className="py-4">
                <hr className="border-border" />
              </div>
            )}

            {block.type === "image" && (
              <div className="py-2">
                <img
                  src={block.imageUrl || "/placeholder.svg"}
                  alt="Block image"
                  className="max-w-full h-auto rounded-lg border border-border"
                />
                <Input
                  ref={(el) => el && (inputRefs.current[block.id] = el)}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  className={cn(commonClasses, "text-sm text-muted-foreground mt-2")}
                  placeholder="Add a caption..."
                />
              </div>
            )}
          </div>

          {/* Block Actions Menu */}
          {isActive && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-muted"
                onClick={() => moveBlock(block.id, "up")}
                disabled={index === 0}
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-muted"
                onClick={() => moveBlock(block.id, "down")}
                disabled={index === blocks.length - 1}
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-muted"
                onClick={() => duplicateBlock(block.id)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => deleteBlock(block.id)}
                disabled={blocks.length === 1}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Block Menu */}
        {showBlockMenu === block.id && (
          <div className="absolute left-14 top-8 bg-popover border border-border rounded-lg shadow-lg p-2 z-10 min-w-56">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">BASIC BLOCKS</div>
            <div className="grid grid-cols-1 gap-1 mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "paragraph")}
              >
                <Type className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Text</div>
                  <div className="text-xs text-muted-foreground">Just start writing with plain text.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "heading1")}
              >
                <Heading1 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Heading 1</div>
                  <div className="text-xs text-muted-foreground">Big section heading.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "heading2")}
              >
                <Heading2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Heading 2</div>
                  <div className="text-xs text-muted-foreground">Medium section heading.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "heading3")}
              >
                <Heading3 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Heading 3</div>
                  <div className="text-xs text-muted-foreground">Small section heading.</div>
                </div>
              </Button>
            </div>

            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">LISTS</div>
            <div className="grid grid-cols-1 gap-1 mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "list")}
              >
                <List className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Bulleted list</div>
                  <div className="text-xs text-muted-foreground">Create a simple bulleted list.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "checklist")}
              >
                <CheckSquare className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">To-do list</div>
                  <div className="text-xs text-muted-foreground">Track tasks with a to-do list.</div>
                </div>
              </Button>
            </div>

            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">MEDIA</div>
            <div className="grid grid-cols-1 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "image")}
              >
                <ImageIcon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Image</div>
                  <div className="text-xs text-muted-foreground">Upload or embed with a link.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "quote")}
              >
                <Quote className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Quote</div>
                  <div className="text-xs text-muted-foreground">Capture a quote.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "code")}
              >
                <Code className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Code</div>
                  <div className="text-xs text-muted-foreground">Capture a code snippet.</div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 h-8"
                onClick={() => addBlock(block.id, "divider")}
              >
                <Divider className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Divider</div>
                  <div className="text-xs text-muted-foreground">Visually divide blocks.</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Slash Command Menu */}
        {showSlashMenu === block.id && (
          <div className="absolute left-14 top-8 bg-popover border border-border rounded-lg shadow-lg p-2 z-10 min-w-48">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, type: "heading1", content: "" } : b)))
                  setShowSlashMenu(null)
                }}
              >
                <Heading1 className="w-4 h-4" />
                Heading 1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, type: "heading2", content: "" } : b)))
                  setShowSlashMenu(null)
                }}
              >
                <Heading2 className="w-4 h-4" />
                Heading 2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setBlocks(blocks.map((b) => (b.id === block.id ? { ...b, type: "list", content: "" } : b)))
                  setShowSlashMenu(null)
                }}
              >
                <List className="w-4 h-4" />
                Bullet List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setBlocks(
                    blocks.map((b) =>
                      b.id === block.id ? { ...b, type: "checklist", content: "", checked: false } : b,
                    ),
                  )
                  setShowSlashMenu(null)
                }}
              >
                <CheckSquare className="w-4 h-4" />
                To-do
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Page Title */}
        <div className="mb-8">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
            placeholder="Untitled"
          />
        </div>

        {/* Blocks */}
        <div className="space-y-1">{blocks.map((block, index) => renderBlock(block, index))}</div>

        {/* Add Block Button */}
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => addBlock(blocks[blocks.length - 1]?.id || "1")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a block
          </Button>
        </div>
      </div>
    </div>
  )
}
