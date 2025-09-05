"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Building2, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  status: string
  applied_at: string
  cover_letter: string | null
  resume_url: string | null
  internship: {
    id: string
    title: string
    location: string
    company: {
      company_name: string
    }
  }
}

interface ApplicationsTabProps {
  studentId: string
}

export function ApplicationsTab({ studentId }: ApplicationsTabProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          internship:internships(
            id, 
            title, 
            location,
            company:companies(company_name)
          )
        `)
        .eq("student_id", studentId)
        .order("applied_at", { ascending: false })

      if (!error && data) {
        setApplications(data as Application[])
      }
      setIsLoading(false)
    }

    fetchApplications()
  }, [studentId])

  const filteredApplications = applications.filter((app) => statusFilter === "all" || app.status === statusFilter)

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
    return <div>Loading applications...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Applications</h2>
          <p className="text-gray-600">Track your internship applications</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === "all"
                ? "You haven't applied to any internships yet"
                : `No ${statusFilter} applications found`}
            </p>
            <Button asChild>
              <Link href="/student/internships">Browse Internships</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{application.internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {application.internship.company.company_name}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Applied: {new Date(application.applied_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Location: {application.internship.location}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {application.resume_url && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={application.resume_url} target="_blank">
                          <FileText className="h-4 w-4 mr-1" />
                          View Resume
                        </Link>
                      </Button>
                    )}
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/student/internships/${application.internship.id}`}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Internship
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
