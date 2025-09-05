"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface CompanySetupFormProps {
  user: User
}

export function CompanySetupForm({ user }: CompanySetupFormProps) {
  const [formData, setFormData] = useState({
    companyName: user.user_metadata?.company_name || "",
    companyDescription: user.user_metadata?.company_description || "",
    companyWebsite: user.user_metadata?.company_website || "",
    contactEmail: user.email || "",
    contactPhone: user.user_metadata?.contact_phone || "",
    companyAddress: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("companies").insert({
        id: user.id,
        company_name: formData.companyName,
        company_description: formData.companyDescription,
        company_website: formData.companyWebsite,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        company_address: formData.companyAddress,
      })

      if (error) throw error
      router.push("/company/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Complete Your Company Profile</CardTitle>
            <CardDescription>Please provide additional information to complete your company profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
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
              </div>

              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  placeholder="123 Business St, City, State 12345"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  placeholder="Tell us about your company, mission, and culture..."
                  rows={4}
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting up profile..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
