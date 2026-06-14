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
  } = useForm<ContactInput>({ resolver: zodResolver(ContactSchema) });

  const messageLength = watch('message')?.length ?? 0;

  const onSubmit = async (data: ContactInput) => {
    setStatus('idle');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
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

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Name row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('firstName')}
            placeholder="Jane"
            className={inputClass(!!errors.firstName)}
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
            className={inputClass(!!errors.lastName)}
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
          className={inputClass(!!errors.email)}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Message <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-slate-400">{messageLength} / 2000</span>
        </div>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="How can we help you?"
          className={`${inputClass(!!errors.message)} resize-none`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'success' && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
          Thank you! We've received your message and will be in touch soon.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {errorMsg || 'Something went wrong. Please try again.'}
        </div>
      )}
    </form>
  );
}
