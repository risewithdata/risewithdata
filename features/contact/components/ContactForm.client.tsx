'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema, ContactInput } from '@features/contact/schemas/contact.schema';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
  });

  const resumeFiles = watch('resume') as FileList | undefined;
  const selectedFile = resumeFiles?.[0];

  const onSubmit = async (data: ContactInput) => {
    setStatus('idle');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName',  data.lastName);
    formData.append('email',     data.email);
    formData.append('terms',     String(data.terms));
    formData.append('resume',    (data.resume as FileList)[0]);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: formData });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'Submission failed');
      }
      setStatus('success');
      reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Name row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('firstName')}
            placeholder="Jane"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1.5 text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('lastName')}
            placeholder="Doe"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="jane@example.com"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
          }`}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Resume upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Resume <span className="text-red-500">*</span>
        </label>
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition hover:bg-slate-50 ${
            errors.resume ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
          }`}
        >
          <svg
            className="h-8 w-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          {selectedFile ? (
            <span className="text-sm font-medium text-blue-600">{selectedFile.name}</span>
          ) : (
            <>
              <span className="text-sm text-slate-500">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </span>
              <span className="text-xs text-slate-400">PDF, DOC, DOCX — max 5 MB</span>
            </>
          )}

          <input
            {...register('resume')}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
          />
        </label>
        {errors.resume && (
          <p className="mt-1.5 text-xs text-red-600">{errors.resume.message as string}</p>
        )}
      </div>

      {/* Terms */}
      <div>
        <div className="flex items-start gap-3">
          <input
            {...register('terms')}
            id="terms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-slate-600">
            I agree to the{' '}
            <a href="/terms" className="font-medium text-blue-600 hover:underline">
              Terms &amp; Conditions
            </a>{' '}
            <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1.5 text-xs text-red-600">{errors.terms.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Send Message'}
      </button>

      {/* Feedback banners */}
      {status === 'success' && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
          Thank you! We&apos;ve received your message and will be in touch soon.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {errorMsg || 'Something went wrong. Please try again or email us directly.'}
        </div>
      )}
    </form>
  );
}
