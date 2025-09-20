import { type NextRequest, NextResponse } from "next/server"
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

    // Extract file path from URL for Supabase Storage deletion
    // Assuming URL format: https://{project}.supabase.co/storage/v1/object/public/resumes/{filename}
    const urlParts = resume.file_url.split('/storage/v1/object/public/resumes/')
    if (urlParts.length === 2) {
      const filePath = urlParts[1]
      
      // Delete file from Supabase Storage
      try {
        const { error: storageError } = await supabase.storage
          .from("resumes")
          .remove([filePath])
        
        if (storageError) {
          console.error("Failed to delete from storage:", storageError)
        }
      } catch (storageError) {
        console.error("Failed to delete storage file:", storageError)
        // Continue with database deletion even if storage deletion fails
      }
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
