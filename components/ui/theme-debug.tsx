"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeDebug() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white dark:bg-gray-800 border rounded-lg text-sm">
      <div>Theme: {theme}</div>
      <div>Resolved: {resolvedTheme}</div>
      <div>HTML class: {document.documentElement.className}</div>
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        Toggle
      </button>
    </div>
  )
}
