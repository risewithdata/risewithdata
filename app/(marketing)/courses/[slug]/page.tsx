import { courseService } from '@features/courses/services/course.service';
import { notFound } from 'next/navigation';
import { generateMetadataForCourse } from '@lib/seo/generateMetadata';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const course = await courseService.getCourseBySlug(params.slug);
  if (!course) return {};
  return generateMetadataForCourse(course);
}

export default async function CoursePage({ params }: Props) {
  const course = await courseService.getCourseBySlug(params.slug);
  if (!course) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      {course.excerpt && <p className="text-lg text-gray-600 mb-8">{course.excerpt}</p>}
      <div className="prose">{/* course content goes here */}</div>
    </article>
  );
}
