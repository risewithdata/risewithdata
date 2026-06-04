'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseCreateSchema, CourseCreateInput } from '@features/courses/schemas/course.schema';
import { FormInput } from '@shared/forms/FormInput';
import { FormTextarea } from '@shared/forms/FormTextarea';
import { FormSubmitButton } from '@shared/forms/FormSubmitButton';
import { createCourseAction } from '@features/courses/actions/createCourse.server';

export function CreateCourseForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CourseCreateInput>({
    resolver: zodResolver(CourseCreateSchema)
  });

  const onSubmit = async (data: CourseCreateInput) => {
    setLoading(true);
    setMessage(null);
    const result = await createCourseAction(data);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Course created successfully!' });
      reset();
    } else {
      setMessage({ type: 'error', text: result.error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
      <FormInput
        label="Title"
        placeholder="Course Title"
        {...register('title')}
        error={errors.title?.message}
      />
      <FormInput
        label="Slug"
        placeholder="course-slug"
        {...register('slug')}
        error={errors.slug?.message}
      />
      <FormTextarea
        label="Excerpt"
        placeholder="Brief course description"
        {...register('excerpt')}
        error={errors.excerpt?.message}
      />
      <FormSubmitButton loading={loading}>Create Course</FormSubmitButton>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
