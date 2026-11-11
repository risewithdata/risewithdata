'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';

const sections = [
  { id: 'what',      label: '1. What Are Cookies' },
  { id: 'types',     label: '2. Types of Cookies We Use' },
  { id: 'third',     label: '3. Third-Party Services' },
  { id: 'managing',  label: '4. Managing Your Cookies' },
  { id: 'changes',   label: '5. Changes & Contact' },
];

export default function CookiesPage() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-[#F8F7F3]">

        {/* Page header */}
        <div className="border-b border-[#E2E0DA] bg-white">
          <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0D2B6E]">Legal</p>
            <h1 className="font-serif text-3xl font-bold text-[#1C1C1E] sm:text-4xl" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-[#64635F]">Rise With Data &nbsp;·&nbsp; Effective October 20, 2026</p>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-12">
          <div className="flex gap-12">

            {/* Sticky TOC sidebar */}
            <aside className="hidden w-56 flex-shrink-0 lg:block">
              <div className="sticky top-24">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#64635F]">Contents</p>
                <nav className="space-y-0.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-[#64635F] transition hover:bg-white hover:text-[#0D2B6E]"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 rounded-xl border border-[#E2E0DA] bg-white p-4">
                  <p className="text-xs font-semibold text-[#1C1C1E]">Questions?</p>
                  <p className="mt-1 text-xs text-[#64635F]">Email us at</p>
                  <a href="mailto:support@risewithdata.com" className="mt-1 block text-xs font-medium text-[#0D2B6E] hover:underline break-all">
                    support@risewithdata.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1">
              <div className="mx-auto max-w-[720px] space-y-10">

                {/* Intro */}
                <p className="rounded-xl border border-[#E2E0DA] bg-white px-6 py-5 text-sm leading-relaxed text-[#64635F]">
                  RiseWithData ("we", "us", "our") uses cookies and similar technologies on{' '}
                  <a href="https://www.risewithdata.com" className="text-[#0D2B6E] hover:underline">www.risewithdata.com</a>{' '}
                  (the "Site"). This Cookie Policy explains what cookies are, which ones we use, and how you can control
                  them. It should be read alongside our{' '}
                  <a href="/privacy" className="text-[#0D2B6E] hover:underline">Privacy Policy</a>.
                  Effective date: <strong className="text-[#1C1C1E]">October 20, 2026</strong>.
                </p>

                {/* Section 1 */}
                <section id="what">
                  <SectionHeading number="1" title="What Are Cookies" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      Cookies are small text files that a website places on your device (computer, tablet, or phone) when
                      you visit it. They are widely used to make websites work, remember your preferences, and provide
                      information to the site's owners.
                    </p>
                    <p>
                      In addition to cookies, we may use similar tracking technologies such as web beacons (tiny
                      transparent images embedded in pages or emails), pixel tags, and local storage. Throughout this
                      policy, we refer to all of these collectively as "cookies".
                    </p>
                    <p>
                      Cookies can be "session" cookies, which are deleted when you close your browser, or "persistent"
                      cookies, which remain on your device for a set period or until you delete them. They can be set by
                      us ("first-party cookies") or by third-party services we use ("third-party cookies").
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="types">
                  <SectionHeading number="2" title="Types of Cookies We Use" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">

                    <Clause title="Strictly necessary cookies">
                      <p className="mb-3">
                        These cookies are essential for the Site to function and cannot be switched off. They are typically
                        set only in response to actions you take, such as logging in, filling in forms, or making a payment.
                        You can set your browser to block these cookies, but parts of the Site will not work.
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Session and authentication cookies.</strong> Keep you logged in to your student account during your visit.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Security cookies.</strong> Help detect and prevent fraud and protect your account.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Load-balancing cookies.</strong> Distribute traffic across our servers so the Site stays responsive.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Functional cookies">
                      <p className="mb-3">
                        These cookies allow the Site to remember choices you make (such as your preferred language or
                        region) and provide enhanced, more personal features. They may be set by us or by third parties
                        whose services we have added to our pages.
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Preference cookies.</strong> Remember settings such as your timezone or display preferences for the student portal.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Form cookies.</strong> Save form progress so you do not lose information if you navigate away and return.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Analytics and performance cookies">
                      <p className="mb-3">
                        These cookies collect information about how visitors use the Site — which pages are visited most
                        often, where visitors come from, and whether they encounter errors. All information collected is
                        aggregated and anonymous; it is used to improve how the Site works.
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Google Analytics.</strong> We may use Google Analytics to understand traffic patterns, page performance, and user behavior. Data collected is anonymized where possible. Google's privacy policy applies: <a href="https://policies.google.com/privacy" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Performance monitoring.</strong> Tools that help us detect slow pages, errors, and other technical issues.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Marketing and targeting cookies">
                      <p className="mb-3">
                        These cookies may be set through our Site by our advertising partners. They may be used to build
                        a profile of your interests and show you relevant ads on other websites. They do not store
                        personal information directly, but uniquely identify your browser and device.
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>LinkedIn Insight Tag.</strong> If we run LinkedIn ads, the LinkedIn Insight Tag may be active on the Site. It enables conversion tracking and retargeting. LinkedIn's privacy policy applies: <a href="https://www.linkedin.com/legal/privacy-policy" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">linkedin.com/legal/privacy-policy</a>.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Conversion pixels.</strong> Small images that help us measure whether an action (such as completing an application) occurred after clicking an ad.</span></li>
                      </ul>
                    </Clause>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="third">
                  <SectionHeading number="3" title="Third-Party Services" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      Some cookies on our Site are placed by third-party services we use. We do not control how these
                      third parties use cookies; their own privacy and cookie policies govern their practices.
                    </p>

                    <Clause title="Payment processing — Stripe">
                      When you make a payment, Stripe may set cookies to prevent fraud, remember your cart, and enable
                      a secure checkout experience. See{' '}
                      <a href="https://stripe.com/privacy" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.
                    </Clause>

                    <Clause title="Video conferencing — Microsoft Teams / Zoom">
                      Live sessions are delivered via Microsoft Teams or Zoom. If you access session links through the
                      Site, these platforms may set their own cookies. See Microsoft's and Zoom's privacy policies for
                      details.
                    </Clause>

                    <Clause title="Community platform — Slack">
                      Our student community uses Slack. Slack's own cookies and privacy practices govern your use of
                      that platform. See{' '}
                      <a href="https://slack.com/privacy-policy" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">slack.com/privacy-policy</a>.
                    </Clause>

                    <Clause title="Fonts — Google Fonts">
                      We load fonts from Google Fonts. Google may collect your IP address and browser information when
                      font files are fetched. See{' '}
                      <a href="https://policies.google.com/privacy" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
                    </Clause>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="managing">
                  <SectionHeading number="4" title="Managing Your Cookies" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      You have several options for managing cookies. Please note that disabling or deleting certain
                      cookies may affect the functionality of the Site or your student account.
                    </p>

                    <Clause title="Browser settings">
                      Most browsers allow you to view, block, or delete cookies through their settings. The steps vary
                      by browser:
                      <ul className="mt-2 space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Safari:</strong> Preferences → Privacy → Manage Website Data.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Edge:</strong> Settings → Cookies and site permissions.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Opt out of analytics">
                      You can opt out of Google Analytics tracking by installing the{' '}
                      <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
                    </Clause>

                    <Clause title="Do Not Track">
                      Some browsers offer a "Do Not Track" (DNT) signal. Because there is no consistent industry
                      standard for responding to DNT signals, we currently do not alter our data collection practices
                      in response to them.
                    </Clause>

                    <Clause title="Mobile devices">
                      On mobile devices, you can manage interest-based advertising through your device settings. On
                      iOS, go to Settings → Privacy → Tracking. On Android, go to Settings → Google → Ads.
                    </Clause>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="changes">
                  <SectionHeading number="5" title="Changes & Contact" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">

                    <Clause title="Changes to this policy">
                      We may update this Cookie Policy from time to time to reflect changes in the cookies we use or
                      for other operational, legal, or regulatory reasons. We will post the updated policy on the Site
                      with a revised effective date. Please review this policy periodically.
                    </Clause>

                    <Clause title="More information">
                      For general information about cookies and how they work, visit{' '}
                      <a href="https://www.allaboutcookies.org" className="text-[#0D2B6E] hover:underline" target="_blank" rel="noopener noreferrer">allaboutcookies.org</a>.
                      For questions about our use of cookies or this policy, contact us at{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                    </Clause>
                  </div>
                </section>

                {/* Contact footer */}
                <div className="rounded-xl border border-[#E2E0DA] bg-white px-6 py-5">
                  <p className="text-sm font-semibold text-[#1C1C1E]">Contact</p>
                  <p className="mt-1 text-sm text-[#64635F]">
                    RiseWithData &nbsp;·&nbsp;{' '}
                    <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">
                      support@risewithdata.com
                    </a>
                  </p>
                </div>

              </div>
            </main>
          </div>
        </div>

        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap"
        />
      </div>
    </>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-[#E2E0DA] pb-4">
      <span
        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0D2B6E] text-xs font-bold text-white"
      >
        {number}
      </span>
      <h2
        className="text-xl font-bold text-[#1C1C1E] sm:text-2xl"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E2E0DA] bg-white px-5 py-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#0D2B6E]">{title}</p>
      <div className="text-sm leading-relaxed text-[#3A3935]">{children}</div>
    </div>
  );
}
