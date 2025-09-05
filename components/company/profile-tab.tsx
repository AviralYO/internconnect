"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface CompanyProfileTabProps {
  company: Company
}

export function CompanyProfileTab({ company }: CompanyProfileTabProps) {
  const [formData, setFormData] = useState({
    companyName: company.company_name,
    companyDescription: company.company_description || "",
    companyWebsite: company.company_website || "",
    contactEmail: company.contact_email,
    contactPhone: company.contact_phone || "",
    companyAddress: company.company_address || "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)

    try {
      const { error } = await supabase
        .from("companies")
        .update({
          company_name: formData.companyName,
          company_description: formData.companyDescription,
          company_website: formData.companyWebsite,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          company_address: formData.companyAddress,
        })
        .eq("id", company.id)

      if (error) throw error
      setSuccess(true)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>Update your company information and contact details</CardDescription>
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
          {success && <p className="text-sm text-green-600">Profile updated successfully!</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
