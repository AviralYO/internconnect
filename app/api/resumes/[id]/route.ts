import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get resume record
    const { data: resume, error: fetchError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("student_id", user.id) // Ensure user owns this resume
      .single()

    if (fetchError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Delete file from Vercel Blob
    try {
      await del(resume.file_url)
    } catch (blobError) {
      console.error("Failed to delete blob:", blobError)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete resume record from database
    const { error: deleteError } = await supabase.from("resumes").delete().eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete resume record" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resume deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
