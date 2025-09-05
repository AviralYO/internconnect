"use client"

import { StudentDashboardContent } from "@/components/student/dashboard-content"

// Mock data for testing
const mockStudent = {
  id: "test-student-id",
  first_name: "John",
  last_name: "Doe",
  email: "john@student.com",
  phone: "123-456-7890",
  university: "Test University",
  major: "Computer Science",
  graduation_year: 2025,
  gpa: 3.8,
  bio: "Passionate computer science student",
  linkedin_url: "https://linkedin.com/in/johndoe",
  github_url: "https://github.com/johndoe",
  portfolio_url: "https://johndoe.dev"
}

const mockStats = {
  totalApplications: 12,
  pendingApplications: 3,
  acceptedApplications: 2,
  totalResumes: 1
}

const mockApplications = [
  {
    id: "app1",
    status: "pending",
    applied_at: "2024-12-01T10:00:00Z",
    internship: {
      title: "Software Engineering Intern",
      company: {
        company_name: "TechCorp"
      }
    }
  },
  {
    id: "app2", 
    status: "accepted",
    applied_at: "2024-11-28T15:30:00Z",
    internship: {
      title: "Frontend Developer Intern",
      company: {
        company_name: "WebSolutions"
      }
    }
  }
]

export default function TestStudentDashboard() {
  return (
    <div>
      <div className="bg-yellow-100 p-4 mb-4 text-center">
        <p className="text-yellow-800 font-semibold">TEST MODE - This is a test version of the student dashboard with mock data</p>
      </div>
      <StudentDashboardContent student={mockStudent} stats={mockStats} applications={mockApplications} />
    </div>
  )
}
