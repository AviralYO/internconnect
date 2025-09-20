import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log("Auth test:", { user: user?.id, error: authError })

    // Test applications table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from("applications")
      .select("*")
      .limit(1)

    console.log("Table test:", { data: tableInfo, error: tableError })

    // Test if resume_id column exists
    const testInsert = {
      internship_id: "test",
      student_id: "test", 
      resume_id: "test",
      cover_letter: "test",
      status: "pending"
    }

    console.log("Testing insert structure...")
    
    return NextResponse.json({
      auth: { user: user?.id, error: authError },
      table: { error: tableError, hasData: !!tableInfo },
      message: "Test endpoint working"
    })

  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      { error: "Test failed", details: error },
      { status: 500 }
    )
  }
}
