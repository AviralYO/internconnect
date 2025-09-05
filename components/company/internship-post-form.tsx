"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Calendar, MapPin, DollarSign } from "lucide-react"

interface InternshipPostFormProps {
  companyId: string
  companyName: string
}

export function InternshipPostForm({ companyId, companyName }: InternshipPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    duration: "",
    stipend: "",
    applicationDeadline: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("internships").insert({
        company_id: companyId,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        duration: formData.duration,
        stipend: formData.stipend ? parseFloat(formData.stipend) : null,
        application_deadline: formData.applicationDeadline,
        is_active: true,
      })

      if (error) throw error
      
      // Redirect back to company dashboard with success message
      router.push("/company/dashboard?tab=internships")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Post New Internship
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Create an opportunity for students at {companyName}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="bg-transparent hover:bg-white/10 border-white/20"
            >
              ← Back
            </Button>
          </div>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
          }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>Fill in the information about your internship opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title">Internship Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., Software Engineering Intern"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the internship role, responsibilities, and what the student will learn..."
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List the required skills, qualifications, and experience..."
                    required
                    value={formData.requirements}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="e.g., Remote, NYC, San Francisco"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="duration"
                        name="duration"
                        type="text"
                        placeholder="e.g., 3 months, Summer 2025"
                        required
                        value={formData.duration}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend (per month)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="stipend"
                        name="stipend"
                        type="number"
                        placeholder="e.g., 1000"
                        value={formData.stipend}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                    <Input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="date"
                      required
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {isLoading ? "Posting..." : "Post Internship"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
