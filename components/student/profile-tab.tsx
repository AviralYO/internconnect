"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  university: string
  major: string
  graduation_year: number
  gpa: number | null
  bio: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
}

interface StudentProfileTabProps {
  student: Student
}

export function StudentProfileTab({ student }: StudentProfileTabProps) {
  const [formData, setFormData] = useState({
    firstName: student.first_name,
    lastName: student.last_name,
    email: student.email,
    phone: student.phone || "",
    university: student.university,
    major: student.major,
    graduationYear: student.graduation_year,
    gpa: student.gpa?.toString() || "",
    bio: student.bio || "",
    linkedinUrl: student.linkedin_url || "",
    githubUrl: student.github_url || "",
    portfolioUrl: student.portfolio_url || "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "number" ? Number.parseInt(e.target.value) : e.target.value
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from("students")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          university: formData.university,
          major: formData.major,
          graduation_year: formData.graduationYear,
          gpa: formData.gpa ? Number.parseFloat(formData.gpa) : null,
          bio: formData.bio || null,
          linkedin_url: formData.linkedinUrl || null,
          github_url: formData.githubUrl || null,
          portfolio_url: formData.portfolioUrl || null,
        })
        .eq("id", student.id)

      if (error) throw error
      setSuccess(true)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
        <CardDescription>Update your personal information and academic details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="university">University *</Label>
              <Input
                id="university"
                name="university"
                type="text"
                required
                value={formData.university}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="major">Major *</Label>
              <Input id="major" name="major" type="text" required value={formData.major} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="graduationYear">Graduation Year *</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                required
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                name="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.75"
                value={formData.gpa}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself, your interests, and career goals..."
              rows={4}
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">Profile updated successfully!</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
