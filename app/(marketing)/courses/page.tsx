import { courseService } from '@features/courses/services/course.service';
import CourseCard from '@features/courses/components/CourseCard.server';

export const metadata = {
  title: 'Courses | RiseWithData',
  description: 'Explore our course catalog'
};

export default async function CoursesPage() {
  const courses = await courseService.getPublishedCourses();

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Our Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} title={course.title} excerpt={course.excerpt} />
        ))}
      </div>
    </div>
  );
}
