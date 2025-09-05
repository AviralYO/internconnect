"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Calendar, MapPin, DollarSign, Briefcase } from "lucide-react"
import Link from "next/link"

interface Internship {
  id: string
  title: string
  description: string
  location: string
  duration: string
  stipend: number | null
  application_deadline: string
  is_active: boolean
  created_at: string
}

interface InternshipsTabProps {
  companyId: string
}

export function InternshipsTab({ companyId }: InternshipsTabProps) {
  const [internships, setInternships] = useState<Internship[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInternships = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setInternships(data)
      }
      setIsLoading(false)
    }

    fetchInternships()
  }, [companyId])

  if (isLoading) {
    return <div>Loading internships...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Internships</h2>
          <p className="text-gray-600">Manage your internship postings</p>
        </div>
        <Button asChild>
          <Link href="/company/internships/new">
            <Plus className="h-4 w-4 mr-2" />
            Post New Internship
          </Link>
        </Button>
      </div>

      {internships.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No internships posted yet</h3>
            <p className="text-gray-600 mb-4">Start by posting your first internship opportunity</p>
            <Button asChild>
              <Link href="/company/internships/new">Post Your First Internship</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {internships.map((internship) => (
            <Card key={internship.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{internship.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{internship.description}</CardDescription>
                  </div>
                  <Badge variant={internship.is_active ? "default" : "secondary"}>
                    {internship.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
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
                      <Link href={`/company/internships/${internship.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/company/internships/${internship.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
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
