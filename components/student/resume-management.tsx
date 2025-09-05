"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Trash2, Eye, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Resume {
  id: string
  student_id: string
  file_name: string
  file_url: string
  file_size: number | null
  is_primary: boolean
  uploaded_at: string
}

interface ResumeManagementProps {
  studentId: string
  initialResumes: Resume[]
}

export function ResumeManagement({ studentId, initialResumes }: ResumeManagementProps) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("studentId", studentId)

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      setResumes((prev) => [result.resume, ...prev])

      // Reset file input
      event.target.value = ""
    } catch (error) {
      setUploadError("Failed to upload resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const setPrimaryResume = async (resumeId: string) => {
    const supabase = createClient()

    try {
      // First, unset all primary resumes
      await supabase.from("resumes").update({ is_primary: false }).eq("student_id", studentId)

      // Then set the selected resume as primary
      const { error } = await supabase.from("resumes").update({ is_primary: true }).eq("id", resumeId)

      if (error) throw error

      setResumes((prev) =>
        prev.map((resume) => ({
          ...resume,
          is_primary: resume.id === resumeId,
        })),
      )
    } catch (error) {
      console.error("Failed to set primary resume:", error)
    }
  }

  const deleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId))
    } catch (error) {
      console.error("Failed to delete resume:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
              <p className="text-gray-600">Upload and manage your resumes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Resume</CardTitle>
              <CardDescription>Upload a PDF file of your resume (max 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resume-upload">Choose Resume File</Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="mt-1"
                  />
                </div>
                {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Upload className="h-4 w-4 animate-pulse" />
                    Uploading resume...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumes List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Resumes ({resumes.length})</CardTitle>
              <CardDescription>Manage your uploaded resumes and set your primary resume</CardDescription>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No resumes uploaded</h3>
                  <p className="text-gray-600">Upload your first resume to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-red-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{resume.file_name}</h4>
                            {resume.is_primary && (
                              <Badge variant="default" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                            {resume.file_size && ` • ${Math.round(resume.file_size / 1024)} KB`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={resume.file_url} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {!resume.is_primary && (
                          <Button variant="outline" size="sm" onClick={() => setPrimaryResume(resume.id)}>
                            <Star className="h-4 w-4 mr-1" />
                            Set Primary
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteResume(resume.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Upload your resume as a PDF file for best compatibility</li>
                <li>• Keep file size under 5MB for faster uploads</li>
                <li>• Set one resume as primary - this will be used by default when applying</li>
                <li>• Update your resume regularly to reflect new skills and experiences</li>
                <li>• Use clear, professional formatting and include relevant keywords</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
