"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleThemeToggle() {
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Check initial theme
    const htmlElement = document.documentElement
    const savedTheme = localStorage.getItem('theme')
    const currentTheme = savedTheme === 'dark' || htmlElement.classList.contains('dark')
    setIsDark(currentTheme)
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      htmlElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    const newTheme = !isDark
    
    if (newTheme) {
      htmlElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    setIsDark(newTheme)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <Sun 
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} 
      />
      <Moon 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
