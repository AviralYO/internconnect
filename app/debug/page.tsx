"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      try {
        // Check current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        
        setUser(user)
        console.log("Current user:", user)
        
        if (user) {
          // Check student profile
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (!studentError && studentData) {
            setStudent(studentData)
            console.log("Student profile:", studentData)
          }
          
          // Check company profile
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (!companyError && companyData) {
            setCompany(companyData)
            console.log("Company profile:", companyData)
          }
        }
      } catch (err: any) {
        setError(err.message)
        console.error("Debug error:", err)
      }
    }
    
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Current User:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">Student Profile:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(student, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">Company Profile:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(company, null, 2)}
          </pre>
        </div>
        
        {error && (
          <div>
            <h2 className="text-xl font-semibold text-red-600">Error:</h2>
            <p className="bg-red-100 p-4 rounded text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
