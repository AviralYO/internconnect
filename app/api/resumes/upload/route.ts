import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const studentId = formData.get("studentId") as string

    if (!file || !studentId) {
      return NextResponse.json({ error: "Missing file or student ID" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Convert file to buffer for Supabase storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file to Supabase Storage
    const filename = `${studentId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filename)

    // Save resume record to database
    const { data: resume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        student_id: studentId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        is_primary: false, // Will be set manually by user
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save resume record" }, { status: 500 })
    }

    return NextResponse.json({ resume })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
