"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, DollarSign, Building2, ExternalLink } from "lucide-react"
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

interface InternshipBrowseTabProps {
  studentId: string
}

export function InternshipBrowseTab({ studentId }: InternshipBrowseTabProps) {
  const [internships, setInternships] = useState<Internship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch active internships
      const { data: internshipsData, error: internshipsError } = await supabase
        .from("internships")
        .select(`
          *,
          company:companies(id, company_name, company_description)
        `)
        .eq("is_active", true)
        .gte("application_deadline", new Date().toISOString().split("T")[0])
        .order("created_at", { ascending: false })

      // Fetch student's applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("internship_id")
        .eq("student_id", studentId)

      if (!internshipsError && internshipsData) {
        setInternships(internshipsData as Internship[])
      }

      if (!applicationsError && applicationsData) {
        setAppliedInternships(new Set(applicationsData.map((app) => app.internship_id)))
      }

      setIsLoading(false)
    }

    fetchData()
  }, [studentId])

  const filteredInternships = internships.filter(
    (internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div>Loading internships...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Browse Internships</h2>
          <p className="text-gray-600">Discover exciting internship opportunities</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by title, company, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results */}
      {filteredInternships.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No internships found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "No active internships available at the moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {internship.company.company_name}
                    </CardDescription>
                  </div>
                  {appliedInternships.has(internship.id) && <Badge variant="secondary">Applied</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-2">{internship.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {internship.duration}
                  </div>
                  {internship.stipend && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />${internship.stipend.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Deadline: {new Date(internship.application_deadline).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/internships/${internship.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    {!appliedInternships.has(internship.id) && (
                      <Button size="sm" asChild>
                        <Link href={`/student/internships/${internship.id}/apply`}>Apply Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
