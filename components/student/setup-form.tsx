"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface StudentSetupFormProps {
  user: User
}

export function StudentSetupForm({ user }: StudentSetupFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.user_metadata?.first_name || "",
    lastName: user.user_metadata?.last_name || "",
    email: user.email || "",
    phone: "",
    university: user.user_metadata?.university || "",
    major: user.user_metadata?.major || "",
    graduationYear: new Date().getFullYear() + 2,
    gpa: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  })
  const [error, setError] = useState<string | null>(null)
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

    try {
      const { error } = await supabase.from("students").insert({
        id: user.id,
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

      if (error) throw error
      router.push("/student/dashboard?tab=profile")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Complete Your Student Profile</CardTitle>
            <CardDescription>Please provide additional information to complete your student profile</CardDescription>
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
                  <Label htmlFor="gpa">GPA (Optional)</Label>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting up profile..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
