'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { ContactForm } from '@features/contact/components/ContactForm.client';

export default function ContactPage() {
  return (
    <>
      <NavigationBar />

      <main className="bg-white">

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
                    href="mailto:support@risewithdata.com"
                    className="text-brand-600 hover:underline"
                  >
                    support@risewithdata.com
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
