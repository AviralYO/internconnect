"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Calendar, FileText, Mail, GraduationCap, MapPin, Phone, ExternalLink, Globe, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface ApplicationDetails {
  id: string
  status: string
  applied_at: string
  cover_letter: string | null
  resume_url: string | null
  reviewed_at: string | null
  internship: {
    id: string
    title: string
    location: string
    duration: string
    stipend: number | null
  }
  student: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    university: string | null
    major: string | null
    graduation_year: number | null
    gpa: number | null
    bio: string | null
    linkedin_url: string | null
    github_url: string | null
    portfolio_url: string | null
  }
  resume?: {
    file_name: string
    file_url: string
  }
}

export default function ApplicationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      const supabase = createClient()

      // Get current user (company)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/company")
        return
      }

      // Fetch application details with related data
      const { data: applicationData, error } = await supabase
        .from("applications")
        .select(`
          *,
          internship:internships(
            id,
            title,
            location,
            duration,
            stipend,
            company_id
          ),
          student:students(
            id,
            first_name,
            last_name,
            email,
            phone,
            university,
            major,
            graduation_year,
            gpa,
            bio,
            linkedin_url,
            github_url,
            portfolio_url
          )
        `)
        .eq("id", params.id)
        .single()

      if (error || !applicationData) {
        toast({
          title: "Application Not Found",
          description: "The requested application could not be found.",
          variant: "destructive",
        })
        router.push("/company/dashboard")
        return
      }

      // Verify the company owns this internship
      if (applicationData.internship.company_id !== user.id) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this application.",
          variant: "destructive",
        })
        router.push("/company/dashboard")
        return
      }

      // If we have resume_id, fetch the resume details
      if (applicationData.resume_id) {
        const { data: resumeData } = await supabase
          .from("resumes")
          .select("file_name, file_url")
          .eq("id", applicationData.resume_id)
          .single()

        if (resumeData) {
          applicationData.resume = resumeData
        }
      }

      setApplication(applicationData as ApplicationDetails)
      setIsLoading(false)
    }

    fetchApplicationDetails()
  }, [params.id, router, toast])

  const updateApplicationStatus = async (newStatus: string) => {
    if (!application) return

    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("applications")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", application.id)

    if (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    } else {
      setApplication(prev => prev ? { ...prev, status: newStatus } : null)
      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus}.`,
      })
    }

    setIsUpdating(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "reviewed":
        return "secondary"
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading application details...</div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Application not found</div>
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
              <Link href="/company/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {application.student.first_name} {application.student.last_name}
              </h1>
              <p className="text-lg text-gray-600">
                Application for {application.internship.title}
              </p>
            </div>
            <Badge variant={getStatusColor(application.status) as any} className="capitalize">
              {application.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.cover_letter ? (
                  <div className="prose max-w-none">
                    {application.cover_letter.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No cover letter provided</p>
                )}
              </CardContent>
            </Card>

            {/* Student Bio */}
            {application.student.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Candidate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{application.student.bio}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{application.student.email}</p>
                  </div>
                </div>

                {application.student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{application.student.phone}</p>
                    </div>
                  </div>
                )}

                {application.student.university && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">University</p>
                      <p className="text-gray-600">{application.student.university}</p>
                    </div>
                  </div>
                )}

                {application.student.major && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Major</p>
                      <p className="text-gray-600">{application.student.major}</p>
                    </div>
                  </div>
                )}

                {application.student.graduation_year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">Graduation Year</p>
                      <p className="text-gray-600">{application.student.graduation_year}</p>
                    </div>
                  </div>
                )}

                {application.student.gpa && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">GPA</p>
                      <p className="text-gray-600">{application.student.gpa.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="space-y-2">
                  {application.student.linkedin_url && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start">
                      <Link href={application.student.linkedin_url} target="_blank">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn Profile
                      </Link>
                    </Button>
                  )}

                  {application.student.github_url && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start">
                      <Link href={application.student.github_url} target="_blank">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub Profile
                      </Link>
                    </Button>
                  )}

                  {application.student.portfolio_url && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start">
                      <Link href={application.student.portfolio_url} target="_blank">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {application.resume ? (
                  <Button asChild className="w-full">
                    <Link href={application.resume.file_url} target="_blank">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume ({application.resume.file_name})
                    </Link>
                  </Button>
                ) : application.resume_url ? (
                  <Button asChild className="w-full">
                    <Link href={application.resume_url} target="_blank">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Link>
                  </Button>
                ) : (
                  <p className="text-gray-500 text-center">No resume attached</p>
                )}
              </CardContent>
            </Card>

            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Applied On</p>
                  <p className="text-gray-600">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>

                {application.reviewed_at && (
                  <div>
                    <p className="font-medium">Reviewed On</p>
                    <p className="text-gray-600">
                      {new Date(application.reviewed_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {application.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => updateApplicationStatus("accepted")}
                    disabled={isUpdating}
                  >
                    Accept Application
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateApplicationStatus("rejected")}
                    disabled={isUpdating}
                  >
                    Reject Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
