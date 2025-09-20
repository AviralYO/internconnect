"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, DollarSign, Building2, Clock, Users } from "lucide-react"
import Link from "next/link"

interface Internship {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  duration: string
  stipend: number | null
  application_deadline: string
  is_active: boolean
  created_at: string
  company: {
    id: string
    company_name: string
    company_description: string | null
  }
}

export default function InternshipDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
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
          *,
          company:companies(id, company_name, company_description)
        `)
        .eq("id", params.id)
        .single()

      if (internshipError || !internshipData) {
        router.push("/student/internships")
        return
      }

      setInternship(internshipData as Internship)

      // Check if student has already applied
      const { data: applicationData } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", user.id)
        .eq("internship_id", params.id)
        .single()

      setHasApplied(!!applicationData)
      setIsLoading(false)
    }

    fetchData()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading internship details...</div>
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

  const isExpired = new Date(internship.application_deadline) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/internships">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Internships
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
              <div className="flex items-center gap-2 text-lg text-gray-600">
                <Building2 className="h-5 w-5" />
                {internship.company.company_name}
              </div>
            </div>
            <div className="flex gap-2">
              {hasApplied && <Badge variant="secondary">Applied</Badge>}
              {isExpired && <Badge variant="destructive">Expired</Badge>}
              {!internship.is_active && <Badge variant="outline">Inactive</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {internship.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {internship.requirements.split('\n').map((requirement, index) => (
                    <p key={index} className="mb-2">• {requirement}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {internship.company.company_description && (
              <Card>
                <CardHeader>
                  <CardTitle>About {internship.company.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{internship.company.company_description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Internship Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{internship.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">{internship.duration}</p>
                  </div>
                </div>

                {internship.stipend && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Stipend</p>
                      <p className="text-gray-600">${internship.stipend.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-gray-600">
                      {new Date(internship.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Card>
              <CardContent className="pt-6">
                {hasApplied ? (
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">Application Submitted</Badge>
                    <p className="text-sm text-gray-600">You have already applied for this internship</p>
                  </div>
                ) : isExpired ? (
                  <div className="text-center">
                    <Badge variant="destructive" className="mb-2">Application Closed</Badge>
                    <p className="text-sm text-gray-600">The application deadline has passed</p>
                  </div>
                ) : !internship.is_active ? (
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">Not Available</Badge>
                    <p className="text-sm text-gray-600">This internship is no longer active</p>
                  </div>
                ) : (
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/student/internships/${internship.id}/apply`}>
                      Apply for this Internship
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
