import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { internship_id, student_id, resume_id, cover_letter } = await request.json()
    
    console.log("Received application data:", {
      internship_id,
      student_id,
      resume_id,
      cover_letter: cover_letter ? "present" : "missing"
    })

    if (!internship_id || !student_id || !resume_id || !cover_letter) {
      console.log("Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== student_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if internship exists and is active
    const { data: internship, error: internshipError } = await supabase
      .from("internships")
      .select("id, is_active, application_deadline")
      .eq("id", internship_id)
      .single()

    if (internshipError || !internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      )
    }

    if (!internship.is_active) {
      return NextResponse.json(
        { error: "Internship is no longer active" },
        { status: 400 }
      )
    }

    // Check if application deadline has passed
    if (new Date(internship.application_deadline) < new Date()) {
      return NextResponse.json(
        { error: "Application deadline has passed" },
        { status: 400 }
      )
    }

    // Check if user has already applied
    const { data: existingApplication, error: existingError } = await supabase
      .from("applications")
      .select("id")
      .eq("student_id", student_id)
      .eq("internship_id", internship_id)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: "Application already submitted" },
        { status: 400 }
      )
    }

    // Verify resume belongs to the student
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("id")
      .eq("id", resume_id)
      .eq("student_id", student_id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json(
        { error: "Invalid resume selection" },
        { status: 400 }
      )
    }

    // Create the application
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        internship_id,
        student_id,
        resume_id,
        cover_letter,
        status: "pending",
        applied_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Application creation error:", applicationError)
      return NextResponse.json(
        { error: "Failed to submit application", details: applicationError.message },
        { status: 500 }
      )
    }

    console.log("Application created successfully:", application)
    return NextResponse.json({ 
      message: "Application submitted successfully",
      application 
    })

  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("student_id")

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch student's applications with internship and company details
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select(`
        *,
        internship:internships(
          id,
          title,
          location,
          stipend,
          company:companies(company_name)
        ),
        resume:resumes(file_name)
      `)
      .eq("student_id", studentId)
      .order("applied_at", { ascending: false })

    if (applicationsError) {
      console.error("Applications fetch error:", applicationsError)
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      )
    }

    return NextResponse.json({ applications })

  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
