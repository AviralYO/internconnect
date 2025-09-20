"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Search, FileText, Briefcase, CheckCircle, Clock, Settings, TrendingUp, Award, Calendar, LogOut } from "lucide-react"
import { SimpleThemeToggle } from "@/components/ui/simple-theme-toggle"
import Link from "next/link"
import { StudentProfileTab } from "./profile-tab"
import { InternshipBrowseTab } from "./internship-browse-tab"
import { ApplicationsTab } from "./applications-tab"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

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

interface Application {
  id: string
  status: string
  applied_at: string
  internship: {
    title: string
    company: {
      company_name: string
    }
  }
}

interface Stats {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  confirmedApplications: number
  rejectedApplications: number
  totalResumes: number
}

interface StudentDashboardContentProps {
  student: Student
  stats: Stats
  applications: Application[]
}

export function StudentDashboardContent({ student, stats, applications }: StudentDashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()

  // Calculate sophisticated progress:
  // 0% = no applications 
  // 25% = applications submitted (pending/reviewed)
  // 50% = applications accepted by company 
  // 100% = applications confirmed by student
  const calculateProgress = () => {
    if (stats.totalApplications === 0) return 0
    
    // Weight different statuses
    const pendingWeight = 25
    const acceptedWeight = 50
    const confirmedWeight = 100
    
    const totalProgress = 
      (stats.pendingApplications * pendingWeight) +
      (stats.acceptedApplications * acceptedWeight) +
      (stats.confirmedApplications * confirmedWeight)
    
    return Math.round(totalProgress / stats.totalApplications)
  }

  const progressValue = calculateProgress()

  // Check for tab parameter in URL and set initial tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'internships', 'applications', 'profile'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
        return
      }
      router.push('/')
    } catch (error) {
      console.error('Unexpected error signing out:', error)
    }
  }

  const recentApplications = applications.slice(0, 3)

  return (
    <div className="min-h-screen" style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      {/* Header */}
      <div className="border-b" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border)'
      }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Welcome back, {student.first_name}!
                </h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {student.major} • {student.university}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SimpleThemeToggle />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="border-red-200/20 hover:bg-red-50/10 hover:border-red-300/30 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Link href="/student/dashboard/internships">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Internships
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="internships">Browse</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Application Status Progress */}
            <Card className="relative overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Application Journey
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                      Track your progress from application to acceptance
                    </CardDescription>
                  </div>
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Application Steps */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                      stats.totalApplications > 0 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Applied</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {stats.totalApplications} applications
                      </p>
                    </div>
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300 transform -translate-x-6" />
                  </div>

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                      stats.pendingApplications > 0 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Under Review</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {stats.pendingApplications} pending
                      </p>
                    </div>
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300 transform -translate-x-6" />
                  </div>

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                      stats.acceptedApplications > 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Accepted</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {stats.acceptedApplications} offers
                      </p>
                    </div>
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-300 transform -translate-x-6" />
                  </div>

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                      stats.acceptedApplications > 0 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Internship</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Start career</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Application Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress 
                    value={progressValue}
                    className="h-3 bg-gray-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Total Applications</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {stats.totalApplications}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>All time applications</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Under Review</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {stats.pendingApplications}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Accepted</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.acceptedApplications}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Successful applications</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Resume Portfolio</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.totalResumes}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Uploaded resumes</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="relative overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--foreground)' }}>Quick Actions</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                  Common tasks to help you find internships
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 p-4 flex-col bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Link href="/student/dashboard/internships">
                    <Search className="h-8 w-8 mb-2" />
                    Browse Internships
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 p-4 flex-col bg-transparent hover:bg-blue-50/10 border-2 transition-all duration-300 hover:-translate-y-1" style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <Link href="/student/dashboard/resumes">
                    <FileText className="h-8 w-8 mb-2" />
                    Manage Resumes
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 p-4 flex-col bg-transparent hover:bg-blue-50/10 border-2 transition-all duration-300 hover:-translate-y-1" style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <Link href="#" onClick={() => setActiveTab("profile")}>
                    <Settings className="h-8 w-8 mb-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="relative overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.2)'
            }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recent Applications
                </CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                  Your latest internship applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      No applications yet
                    </h3>
                    <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                      Start your journey by browsing available internships
                    </p>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                      <Link href="/student/dashboard/internships">
                        <Search className="h-4 w-4 mr-2" />
                        Browse Internships
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                              {application.internship.title}
                            </h4>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              {application.internship.company.company_name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Applied: {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`px-3 py-1 font-semibold ${
                            application.status === "accepted"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : application.status === "rejected"
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" asChild className="w-full bg-transparent hover:bg-blue-50/10 border-2 transition-all duration-300" style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }}>
                      <Link href="#" onClick={() => setActiveTab("applications")}>
                        View All Applications
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships">
            <InternshipBrowseTab studentId={student.id} />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab studentId={student.id} />
          </TabsContent>

          <TabsContent value="profile">
            <StudentProfileTab student={student} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
