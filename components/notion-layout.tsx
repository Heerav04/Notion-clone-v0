"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Editor } from "./editor"
import { DatabaseView } from "./database-view"
import { PageManager } from "./page-manager"
import { CommandPalette } from "./command-palette"

export type ViewType = "editor" | "database" | "pages"

export function NotionLayout() {
  const [currentView, setCurrentView] = useState<ViewType>("editor")
  const [currentPageId, setCurrentPageId] = useState<string>("welcome")
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette shortcut
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Quick navigation shortcuts
      else if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault()
        setCurrentView("editor")
      } else if ((e.metaKey || e.ctrlKey) && e.key === "2") {
        e.preventDefault()
        setCurrentView("database")
      } else if ((e.metaKey || e.ctrlKey) && e.key === "3") {
        e.preventDefault()
        setCurrentView("pages")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleNavigate = (view: string, pageId?: string) => {
    setCurrentView(view as ViewType)
    if (pageId) {
      setCurrentPageId(pageId)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        currentPageId={currentPageId}
        onPageChange={setCurrentPageId}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === "editor" && <Editor pageId={currentPageId} />}
        {currentView === "database" && <DatabaseView />}
        {currentView === "pages" && <PageManager onPageSelect={setCurrentPageId} />}
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
