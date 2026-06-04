export function generateMetadataForCourse(course: { title: string; description?: string; slug?: string }) {
  const title = course.title;
  const description = course.description ?? 'Course on RiseWithData';
  const url = `${process.env.APP_URL ?? ''}/courses/${course.slug ?? ''}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url
    }
  };
}
