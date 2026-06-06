'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DonateSchema, DonateInput, PRESET_AMOUNTS } from '@features/donate/schemas/donate.schema';

export function DonateForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DonateInput>({
    resolver: zodResolver(DonateSchema),
    defaultValues: { frequency: 'one-time', presetAmount: '50' },
  });

  const selectedPreset  = watch('presetAmount');
  const selectedFreq    = watch('frequency');
  const isCustom        = selectedPreset === 'custom';
  const isAnonymous     = watch('anonymous');

  const onSubmit = async (_data: DonateInput) => {
    try {
      await new Promise((r) => setTimeout(r, 900)); // replace with real payment API
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const field =
    'w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500';
  const fieldOk  = 'border-slate-200 bg-white';
  const fieldErr = 'border-red-400 bg-red-50';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">

      {/* ── Frequency ── */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Donation frequency
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['one-time', 'monthly'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setValue('frequency', f)}
              className={`rounded-xl border py-3 text-sm font-semibold capitalize transition ${
                selectedFreq === f
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              {f === 'one-time' ? 'One-Time' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Amount ── */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Donation amount <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((amt) => {
            const val = String(amt);
            return (
              <button
                key={val}
                type="button"
                onClick={() => setValue('presetAmount', val as any)}
                className={`rounded-xl border py-3 text-sm font-bold transition ${
                  selectedPreset === val
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                }`}
              >
                ${amt}
              </button>
            );
          })}
        </div>

        {/* Custom toggle */}
        <button
          type="button"
          onClick={() => setValue('presetAmount', 'custom')}
          className={`mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition ${
            isCustom
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-dashed border-slate-300 text-slate-500 hover:border-blue-300'
          }`}
        >
          Enter custom amount
        </button>

        {/* Hidden register for presetAmount */}
        <input type="hidden" {...register('presetAmount')} />

        {/* Custom amount input */}
        {isCustom && (
          <div className="relative mt-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
            <input
              {...register('customAmount')}
              type="number"
              min="1"
              placeholder="Enter amount"
              className={`${field} pl-8 ${errors.customAmount ? fieldErr : fieldOk}`}
            />
          </div>
        )}
        {errors.customAmount && (
          <p className="mt-1.5 text-xs text-red-600">{errors.customAmount.message}</p>
        )}
      </div>

      {/* ── Donor details ── */}
      {!isAnonymous && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('firstName')}
              placeholder="Jane"
              className={`${field} ${errors.firstName ? fieldErr : fieldOk}`}
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
              className={`${field} ${errors.lastName ? fieldErr : fieldOk}`}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
      )}

      {!isAnonymous && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="jane@example.com"
            className={`${field} ${errors.email ? fieldErr : fieldOk}`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      )}

      {/* Anonymous toggle */}
      <div className="flex items-center gap-3">
        <input
          {...register('anonymous')}
          id="anonymous"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="anonymous" className="text-sm text-slate-600">
          Make my donation anonymous
        </label>
      </div>

      {/* ── Message ── */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Leave a message{' '}
          <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          {...register('message')}
          rows={3}
          placeholder="Share why you're donating or a message of encouragement…"
          className={`${field} resize-none ${errors.message ? fieldErr : fieldOk}`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* ── Terms ── */}
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
            and confirm this is a voluntary donation.{' '}
            <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1.5 text-xs text-red-600">{errors.terms.message}</p>
        )}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? 'Processing…'
          : `Donate ${selectedFreq === 'monthly' ? 'Monthly' : 'Now'}`}
      </button>

      <p className="text-center text-xs text-slate-400">
        🔒 Secure donation · 100% goes to fellowship scholarships
      </p>

      {/* Feedback */}
      {status === 'success' && (
        <div className="rounded-2xl bg-green-50 p-5 text-center">
          <p className="text-2xl">🎉</p>
          <p className="mt-2 font-semibold text-green-800">Thank you for your donation!</p>
          <p className="mt-1 text-sm text-green-600">
            A receipt will be emailed to you shortly. Your generosity helps someone start their data career.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          Something went wrong. Please try again or email us at{' '}
          <a href="mailto:risewithdatausa@gmail.com" className="underline">
            risewithdatausa@gmail.com
          </a>
          .
        </div>
      )}
    </form>
  );
}
