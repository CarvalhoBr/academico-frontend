import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from './AppLayout';
import Users from '@/pages/Users';
import EditUser from '@/pages/EditUser';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Semesters from '@/pages/Semesters';
import NotFound from '@/pages/NotFound';

const AuthenticatedApp = () => {
  const { resources } = useAuth();

  return (
    <PermissionsProvider resources={resources}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId/edit" element={<EditUser />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/semesters" element={<Semesters />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </PermissionsProvider>
  );
};

export default AuthenticatedApp;
