"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Send } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Internship {
  id: string
  title: string
  company: {
    company_name: string
  }
}

interface Resume {
  id: string
  file_name: string
  is_primary: boolean
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentId, setStudentId] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/student")
        return
      }
      setStudentId(user.id)

      // Fetch internship details
      const { data: internshipData, error: internshipError } = await supabase
        .from("internships")
        .select(`
          id,
          title,
          application_deadline,
          is_active,
          company:companies(company_name)
        `)
        .eq("id", params.id)
        .single()

      if (internshipError || !internshipData) {
        router.push("/student/internships")
        return
      }

      // Check if application deadline has passed
      if (new Date(internshipData.application_deadline) < new Date()) {
        toast({
          title: "Application Closed",
          description: "The application deadline for this internship has passed.",
          variant: "destructive",
        })
        router.push(`/student/internships/${params.id}`)
        return
      }

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", user.id)
        .eq("internship_id", params.id)
        .single()

      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already submitted an application for this internship.",
          variant: "destructive",
        })
        router.push(`/student/internships/${params.id}`)
        return
      }

      setInternship(internshipData as any)

      // Fetch student's resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from("resumes")
        .select("id, file_name, is_primary")
        .eq("student_id", user.id)
        .order("is_primary", { ascending: false })

      if (!resumesError && resumesData) {
        setResumes(resumesData)
        // Auto-select primary resume if available
        const primaryResume = resumesData.find(resume => resume.is_primary)
        if (primaryResume) {
          setSelectedResumeId(primaryResume.id)
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedResumeId) {
      toast({
        title: "Resume Required",
        description: "Please select a resume to submit with your application.",
        variant: "destructive",
      })
      return
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover Letter Required",
        description: "Please write a cover letter for your application.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    console.log("Submitting application with data:", {
      internship_id: params.id,
      student_id: studentId,
      resume_id: selectedResumeId,
      cover_letter: coverLetter,
    })

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internship_id: params.id,
          student_id: studentId,
          resume_id: selectedResumeId,
          cover_letter: coverLetter,
        }),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      toast({
        title: "Application Submitted!",
        description: "Your application has been successfully submitted.",
      })

      // Redirect to main internships page instead of details page
      router.push("/student/internships")
    } catch (error) {
      console.error("Application submission error:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading application form...</div>
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Internship not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/student/internships/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Link>
            </Button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
            <p className="text-lg text-gray-600">
              {internship.title} at {internship.company.company_name}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Select Resume
                </CardTitle>
                <CardDescription>
                  Choose which resume to submit with your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resumes found</h3>
                    <p className="text-gray-600 mb-4">You need to upload a resume before applying</p>
                    <Button asChild>
                      <Link href="/student/resumes">Upload Resume</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume *</Label>
                    <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.file_name} {resume.is_primary && "(Primary)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>
                  Tell the company why you're interested in this internship and what makes you a great fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="cover-letter">Cover Letter *</Label>
                  <Textarea
                    id="cover-letter"
                    placeholder="Dear Hiring Manager,

I am writing to express my strong interest in the [Internship Title] position at [Company Name]. I believe my background in [relevant skills/experience] makes me an ideal candidate for this role.

[Explain why you're interested in the company and position]

[Highlight relevant experience, skills, or projects]

[Conclude with enthusiasm and next steps]

Thank you for your consideration. I look forward to hearing from you.

Best regards,
[Your Name]"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={12}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    {coverLetter.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || resumes.length === 0}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Make sure all information is correct before submitting
                </p>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
