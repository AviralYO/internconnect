import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InternshipPostForm } from "@/components/company/internship-post-form"

export default async function NewInternshipPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/company/login")
  }

  // Check if company profile exists
  const { data: company } = await supabase.from("companies").select("*").eq("id", data.user.id).single()

  if (!company) {
    redirect("/company/setup")
  }

  return <InternshipPostForm companyId={company.id} companyName={company.company_name} />
}
