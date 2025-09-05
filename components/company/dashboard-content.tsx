"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, Briefcase, FileText, Settings, TrendingUp, LogOut } from "lucide-react"
import { SimpleThemeToggle } from "@/components/ui/simple-theme-toggle"
import Link from "next/link"
import { CompanyProfileTab } from "./profile-tab"
import { InternshipsTab } from "./internships-tab"
import { ApplicationsTab } from "./applications-tab"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  company_name: string
  company_description: string | null
  company_website: string | null
  contact_email: string
  contact_phone: string | null
  company_address: string | null
}

interface Stats {
  totalInternships: number
  activeInternships: number
  totalApplications: number
  pendingApplications: number
}

interface CompanyDashboardContentProps {
  company: Company
  stats: Stats
}

export function CompanyDashboardContent({ company, stats }: CompanyDashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const supabase = createClient()

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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {company.company_name}
                </h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Company Dashboard</p>
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
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                <Link href="/company/dashboard/internships">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Internship
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
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Total Internships</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.totalInternships}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {stats.activeInternships} currently active
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Active Positions</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.activeInternships}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Currently accepting applications</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px 0 rgba(31, 38, 135, 0.2)'
              }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Total Applications</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                    <Users className="h-4 w-4 text-white" />
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
                  <CardTitle className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Pending Reviews</CardTitle>
                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {stats.pendingApplications}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Awaiting your review</p>
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
                  Common tasks to manage your internship program
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 p-4 flex-col bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Link href="/company/internships/new">
                    <Plus className="h-8 w-8 mb-2" />
                    Post New Internship
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-20 p-4 flex-col bg-transparent hover:bg-blue-50/10 border-2 transition-all duration-300 hover:-translate-y-1" style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <Link href="#" onClick={() => setActiveTab("applications")}>
                    <Users className="h-8 w-8 mb-2" />
                    Review Applications
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
          </TabsContent>

          <TabsContent value="internships">
            <InternshipsTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab companyId={company.id} />
          </TabsContent>

          <TabsContent value="profile">
            <CompanyProfileTab company={company} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
