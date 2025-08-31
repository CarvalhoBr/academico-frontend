import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from './AppLayout';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Subjects from '@/pages/Subjects';
import Semesters from '@/pages/Semesters';
import NotFound from '@/pages/NotFound';

const AuthenticatedApp = () => {
  const { resources } = useAuth();

  return (
    <PermissionsProvider resources={resources}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:courseId/semesters/:semesterId/subjects" element={<Subjects />} />
          <Route path="/semesters" element={<Semesters />} />
          {/* Placeholder routes for future pages */}
          <Route path="/subjects" element={<Dashboard />} />
          <Route path="/enrollments" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </PermissionsProvider>
  );
};

export default AuthenticatedApp;
