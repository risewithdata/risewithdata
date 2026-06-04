import { CreateCourseForm } from '@features/courses/components/CreateCourseForm.client';

export const metadata = {
  title: 'Create Course | Admin'
};

export default function AdminCreateCoursePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      <CreateCourseForm />
    </div>
  );
}
