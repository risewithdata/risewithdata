'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { ContactForm } from '@features/contact/components/ContactForm.client';

export default function ContactPage() {
  return (
    <>
      <NavigationBar />

      <main className="bg-white">

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
              Get in Touch
            </span>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">Contact Us</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
              Have a question, want to collaborate, or ready to take the next step?
              We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ===== FORM + INFO ===== */}
        <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-5">

          {/* Left — contact info */}
          <aside className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Let&apos;s talk</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Fill out the form and our team will get back to you within 1–2 business days.
              </p>
            </div>

            <ul className="space-y-6 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  ✉
                </span>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:risewithdatausa@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    risewithdatausa@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  📍
                </span>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-slate-600">United States</p>
                </div>
              </li>
            </ul>
          </aside>

          {/* Right — form card */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
