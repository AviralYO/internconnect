"use client"

import { CompanyDashboardContent } from "@/components/company/dashboard-content"

// Mock data for testing
const mockCompany = {
  id: "test-id",
  company_name: "Test Company",
  company_description: "A test company for development",
  company_website: "https://testcompany.com",
  contact_email: "test@company.com",
  contact_phone: "123-456-7890",
  company_address: "123 Test St, Test City, TC 12345"
}

const mockStats = {
  totalInternships: 5,
  activeInternships: 3,
  totalApplications: 25,
  pendingApplications: 8
}

export default function TestCompanyDashboard() {
  return (
    <div>
      <div className="bg-yellow-100 p-4 mb-4 text-center">
        <p className="text-yellow-800 font-semibold">TEST MODE - This is a test version of the company dashboard with mock data</p>
      </div>
      <CompanyDashboardContent company={mockCompany} stats={mockStats} />
    </div>
  )
}
