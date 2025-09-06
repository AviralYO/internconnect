"use client"

import { Button } from "@/components/ui/button"
import { Building2, GraduationCap, Users, Briefcase } from "lucide-react"
import HyperspeedBackground from "@/components/ui/hyperspeed-background"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: '#000000',
      color: 'var(--foreground)',
    }}>
      {/* Hyperspeed Background */}
      <HyperspeedBackground />
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-white" style={{ 
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.3)'
          }}>
            Intern
            <span 
              className="inline-block px-4 py-2 ml-2 rounded-xl text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
              }}
            >
              Connect
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl mx-auto text-slate-200" style={{ 
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Where talented students meet innovative companies.
            <br />
            <span className="font-medium text-blue-400 drop-shadow-md">Your career starts here.</span>
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Student Card */}
            <div className="group cursor-pointer hover:-translate-y-3 transition-all duration-500 rounded-2xl overflow-hidden" style={{
              background: 'transparent',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(59, 130, 246, 0.6)',
              boxShadow: '0 20px 40px 0 rgba(59, 130, 246, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px solid rgba(59, 130, 246, 1)';
              e.currentTarget.style.boxShadow = '0 30px 60px 0 rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid rgba(59, 130, 246, 0.6)';
              e.currentTarget.style.boxShadow = '0 20px 40px 0 rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}>
              <div className="text-center p-8">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white" style={{ 
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
                }}>
                  For Students
                </h3>
                <p className="text-lg mb-8 leading-relaxed text-slate-100" style={{ 
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  Launch your career with meaningful internships at top companies
                </p>
              </div>
              <div className="p-8 pt-0 space-y-6">
                <ul className="space-y-3 text-left text-slate-100" style={{ 
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                }}>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Browse curated internship opportunities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Smart resume builder & portfolio
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Real-time application tracking
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Direct company connections
                  </li>
                </ul>
                <div className="flex flex-col gap-3 pt-4">
                  <Button asChild className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 border border-blue-500">
                    <Link href="/auth/student/signup">Start Your Journey</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full h-12 text-lg rounded-xl border-2 border-blue-400 hover:border-blue-300 bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                    <Link href="/auth/student/login">Student Login</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="group cursor-pointer hover:-translate-y-3 transition-all duration-500 rounded-2xl overflow-hidden" style={{
              background: 'transparent',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(99, 102, 241, 0.6)',
              boxShadow: '0 20px 40px 0 rgba(99, 102, 241, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px solid rgba(99, 102, 241, 1)';
              e.currentTarget.style.boxShadow = '0 30px 60px 0 rgba(99, 102, 241, 0.5)';
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid rgba(99, 102, 241, 0.6)';
              e.currentTarget.style.boxShadow = '0 20px 40px 0 rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}>
              <div className="text-center p-8">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white" style={{ 
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
                }}>
                  For Companies
                </h3>
                <p className="text-lg mb-8 leading-relaxed text-slate-100" style={{ 
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  Discover exceptional talent and build your future workforce
                </p>
              </div>
              <div className="p-8 pt-0 space-y-6">
                <ul className="space-y-3 text-left text-slate-100" style={{ 
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                }}>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    Post targeted internship roles
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    AI-powered candidate matching
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    Streamlined hiring pipeline
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    Access to top university talent
                  </li>
                </ul>
                <div className="flex flex-col gap-3 pt-4">
                  <Button asChild className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border border-indigo-500">
                    <Link href="/auth/company/signup">Find Great Talent</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full h-12 text-lg rounded-xl border-2 border-indigo-400 hover:border-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-100 hover:text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/30">
                    <Link href="/auth/company/login">Company Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
