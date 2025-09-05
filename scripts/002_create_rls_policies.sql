-- Companies RLS Policies
CREATE POLICY "Companies can view their own profile" ON public.companies
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Companies can insert their own profile" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Companies can update their own profile" ON public.companies
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Companies can delete their own profile" ON public.companies
  FOR DELETE USING (auth.uid() = id);

-- Students RLS Policies
CREATE POLICY "Students can view their own profile" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can insert their own profile" ON public.students
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update their own profile" ON public.students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can delete their own profile" ON public.students
  FOR DELETE USING (auth.uid() = id);

-- Allow companies to view student profiles when reviewing applications
CREATE POLICY "Companies can view students who applied" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.internships i ON a.internship_id = i.id
      WHERE a.student_id = students.id AND i.company_id = auth.uid()
    )
  );

-- Internships RLS Policies
CREATE POLICY "Anyone can view active internships" ON public.internships
  FOR SELECT USING (is_active = true);

CREATE POLICY "Companies can view their own internships" ON public.internships
  FOR SELECT USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their own internships" ON public.internships
  FOR INSERT WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update their own internships" ON public.internships
  FOR UPDATE USING (company_id = auth.uid());

CREATE POLICY "Companies can delete their own internships" ON public.internships
  FOR DELETE USING (company_id = auth.uid());

-- Applications RLS Policies
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own applications" ON public.applications
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own applications" ON public.applications
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Companies can view applications to their internships" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      WHERE i.id = applications.internship_id AND i.company_id = auth.uid()
    )
  );

CREATE POLICY "Companies can update application status" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      WHERE i.id = applications.internship_id AND i.company_id = auth.uid()
    )
  );

-- Resumes RLS Policies
CREATE POLICY "Students can manage their own resumes" ON public.resumes
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Companies can view resumes of applicants" ON public.resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.internships i ON a.internship_id = i.id
      WHERE a.student_id = resumes.student_id AND i.company_id = auth.uid()
    )
  );
