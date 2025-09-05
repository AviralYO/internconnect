"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CompanySignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    contactPhone: "",
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/company/dashboard`,
          data: {
            user_type: "company",
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            company_website: formData.companyWebsite,
            contact_phone: formData.contactPhone,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Company Sign Up</CardTitle>
            <CardDescription>Create your company account to post internships</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Your Company Name"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hr@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  placeholder="Brief description of your company..."
                  rows={3}
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Company Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/company/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
