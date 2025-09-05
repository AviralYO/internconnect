"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, User, Calendar, FileText } from "lucide-react"
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
  }
  student: {
    id: string
    first_name: string
    last_name: string
    email: string
    university: string | null
    major: string | null
  }
}

interface ApplicationsTabProps {
  companyId: string
}

export function ApplicationsTab({ companyId }: ApplicationsTabProps) {
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
          internship:internships(id, title),
          student:students(id, first_name, last_name, email, university, major)
        `)
        .in(
          "internship_id",
          await supabase
            .from("internships")
            .select("id")
            .eq("company_id", companyId)
            .then((res) => res.data?.map((i) => i.id) || []),
        )
        .order("applied_at", { ascending: false })

      if (!error && data) {
        setApplications(data as Application[])
      }
      setIsLoading(false)
    }

    fetchApplications()
  }, [companyId])

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("applications")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (!error) {
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))
    }
  }

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
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-gray-600">Review and manage student applications</p>
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
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "No students have applied to your internships yet"
                : `No ${statusFilter} applications found`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {application.student.first_name} {application.student.last_name}
                    </CardTitle>
                    <CardDescription>Applied for: {application.internship.title}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    {application.student.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Applied: {new Date(application.applied_at).toLocaleDateString()}
                  </div>
                  {application.student.university && (
                    <div className="text-sm text-gray-600">University: {application.student.university}</div>
                  )}
                  {application.student.major && (
                    <div className="text-sm text-gray-600">Major: {application.student.major}</div>
                  )}
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/company/applications/${application.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                  </div>

                  {application.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateApplicationStatus(application.id, "accepted")}>
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
