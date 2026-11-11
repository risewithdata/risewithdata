'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';

const sections = [
  { id: 'information',  label: '1. Information We Collect' },
  { id: 'use',          label: '2. How We Use Your Information' },
  { id: 'sharing',      label: '3. Sharing Your Information' },
  { id: 'retention',    label: '4. Data Retention' },
  { id: 'rights',       label: '5. Your Privacy Rights' },
  { id: 'security',     label: '6. Security' },
  { id: 'other',        label: '7. Other Important Terms' },
];

export default function PrivacyPage() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-[#F8F7F3]">

        {/* Page header */}
        <div className="border-b border-[#E2E0DA] bg-white">
          <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0D2B6E]">Legal</p>
            <h1 className="font-serif text-3xl font-bold text-[#1C1C1E] sm:text-4xl" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Privacy Policy
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
                  RiseWithData ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use,
                  share, and protect information about you when you visit{' '}
                  <a href="https://www.risewithdata.com" className="text-[#0D2B6E] hover:underline">www.risewithdata.com</a>{' '}
                  (the "Site") or enroll in our programs (the "Services"). By using the Site or Services, you agree to this
                  policy. Effective date: <strong className="text-[#1C1C1E]">October 20, 2026</strong>.
                </p>

                {/* Section 1 */}
                <section id="information">
                  <SectionHeading number="1" title="Information We Collect" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      We collect information you give us directly, information collected automatically when you use the Site,
                      and information from third parties.
                    </p>

                    <Clause title="Information you provide">
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Account and enrollment.</strong> Name, email address, phone number, billing address, payment information (processed by our payment provider; we do not store full card numbers), and any details you submit on our application or contact forms.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Communications.</strong> Messages you send us by email, via forms on the Site, or in our community Slack workspace.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Course activity.</strong> Projects, assignments, survey responses, and session attendance you submit as part of the program.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Testimonials and feedback.</strong> Reviews, success stories, or feedback you voluntarily share with us.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Information collected automatically">
                      When you visit the Site, we and our service providers may automatically collect:
                      <ul className="mt-2 space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Device and browser type, operating system, and screen resolution.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>IP address and general geographic location (country or city).</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Pages visited, time spent, links clicked, and referring URLs.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Cookies and similar tracking technologies (see our <a href="/cookies" className="text-[#0D2B6E] hover:underline">Cookie Policy</a>).</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Information from third parties">
                      We may receive information from third-party services you connect to or authorize, such as payment
                      processors (Stripe), video conferencing tools (Zoom or Microsoft Teams), and our community platform.
                      We may also receive information from social media platforms if you interact with our pages or ads.
                    </Clause>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="use">
                  <SectionHeading number="2" title="How We Use Your Information" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>We use your information to provide and improve our Services, communicate with you, and comply with legal obligations.</p>

                    <Clause title="To deliver the Services">
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Process your enrollment, application, and payment.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Give you access to course materials, recordings, and the student community.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Coordinate live sessions, issue certificates, and support career coaching.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Respond to your questions and requests.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="To communicate with you">
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Send confirmations, receipts, and program updates related to your enrollment.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Send newsletters, course announcements, and promotional materials about our programs (you can opt out at any time).</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Respond to requests, complaints, or disputes.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="To improve and operate the Site">
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Analyze how visitors use the Site and our programs to improve the experience.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Monitor and maintain the security of the Site.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Enforce our Terms and Conditions and other policies.</span></li>
                      </ul>
                    </Clause>

                    <Clause title="Legal basis (where applicable)">
                      Where required by law, we process your data on one of the following bases: performance of a contract
                      (to deliver the Services you signed up for), our legitimate interests (to improve the Site, prevent
                      fraud, and send relevant marketing), your consent (for optional marketing communications), or
                      compliance with a legal obligation.
                    </Clause>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="sharing">
                  <SectionHeading number="3" title="Sharing Your Information" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      We do not sell your personal information. We share it only in the limited circumstances below.
                    </p>

                    <Clause title="Service providers">
                      We share information with third-party vendors who help us operate the Site and Services, including
                      payment processors (Stripe), email delivery providers, video conferencing tools, cloud hosting
                      providers, and analytics services. These providers are contractually required to protect your data
                      and may not use it for their own marketing.
                    </Clause>

                    <Clause title="Instructors and program staff">
                      Instructors, coaches, and support staff involved in delivering the program may access your name,
                      contact information, session attendance, project submissions, and other details necessary to provide
                      the Services.
                    </Clause>

                    <Clause title="Legal requirements">
                      We may disclose your information if required to do so by law, a court order, or a government or
                      regulatory authority, or if we believe disclosure is necessary to protect the rights, property, or
                      safety of RiseWithData, our students, or the public.
                    </Clause>

                    <Clause title="Business transfers">
                      If RiseWithData is involved in a merger, acquisition, or sale of assets, your information may be
                      transferred as part of that transaction. We will notify you if your data becomes subject to a
                      different privacy policy.
                    </Clause>

                    <Clause title="With your consent">
                      We may share your information with third parties when you have given us your explicit consent to
                      do so — for example, if we feature your testimonial or case study in our marketing materials.
                    </Clause>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="retention">
                  <SectionHeading number="4" title="Data Retention" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      We retain your personal information for as long as necessary to provide the Services, comply with
                      our legal obligations, resolve disputes, and enforce our agreements.
                    </p>

                    <Clause title="Account and enrollment data">
                      We retain your account and enrollment records for up to 7 years after your last interaction with
                      us, or longer if required by applicable law (for example, for tax and financial record-keeping).
                    </Clause>

                    <Clause title="Communications">
                      Support communications and emails are retained for up to 3 years. Marketing opt-out preferences
                      are retained indefinitely to ensure we honor your choice.
                    </Clause>

                    <Clause title="Analytics data">
                      Anonymized or aggregated usage data that cannot identify you may be retained indefinitely for
                      research and product improvement.
                    </Clause>

                    <Clause title="Deletion requests">
                      You may request deletion of your personal data by emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                      We will fulfill requests within 30 days, subject to any legal obligations that require us to retain
                      certain records.
                    </Clause>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="rights">
                  <SectionHeading number="5" title="Your Privacy Rights" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      Depending on where you live, you may have certain rights over your personal information. To exercise
                      any of these rights, email us at{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                    </p>

                    <Clause title="Access and portability">
                      You may request a copy of the personal information we hold about you, and in some cases, a
                      machine-readable export.
                    </Clause>

                    <Clause title="Correction">
                      You may ask us to correct inaccurate or incomplete personal information we hold about you.
                    </Clause>

                    <Clause title="Deletion">
                      You may ask us to delete your personal information, subject to our legal obligations and legitimate
                      operational needs.
                    </Clause>

                    <Clause title="Objection and restriction">
                      You may object to or ask us to restrict certain types of processing, such as direct marketing or
                      processing based on legitimate interests.
                    </Clause>

                    <Clause title="Opt out of marketing">
                      You can unsubscribe from marketing emails at any time using the unsubscribe link in any email, or
                      by emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                      We may still send transactional or enrollment-related messages.
                    </Clause>

                    <Clause title="California residents (CCPA)">
                      California residents have the right to know what personal information we collect, request deletion,
                      opt out of the sale of personal information (we do not sell personal information), and not be
                      discriminated against for exercising these rights.
                    </Clause>

                    <Clause title="European residents (GDPR)">
                      If you are located in the European Economic Area or the United Kingdom, you also have the right to
                      lodge a complaint with your local data protection authority.
                    </Clause>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="security">
                  <SectionHeading number="6" title="Security" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      We use commercially reasonable administrative, technical, and physical safeguards to protect your
                      personal information against unauthorized access, disclosure, alteration, and destruction. All
                      payment transactions are processed by Stripe using industry-standard encryption; we do not store
                      full payment card numbers on our servers.
                    </p>
                    <p>
                      No method of transmission over the internet or electronic storage is 100% secure. While we strive
                      to protect your personal information, we cannot guarantee its absolute security. If you believe your
                      account has been compromised, please contact us immediately at{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="other">
                  <SectionHeading number="7" title="Other Important Terms" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">

                    <Clause title="Children">
                      Our Site and Services are not directed to individuals under the age of 18. We do not knowingly
                      collect personal information from children. If you believe a child has provided us with personal
                      information, please contact us and we will delete it promptly.
                    </Clause>

                    <Clause title="Third-party links">
                      The Site may contain links to third-party websites, such as Microsoft, LinkedIn, or Stripe. We are
                      not responsible for the privacy practices of those sites. Please review their privacy policies
                      before providing them with your information.
                    </Clause>

                    <Clause title="International transfers">
                      RiseWithData is based in the United States. If you are located outside the US, your information
                      may be transferred to and processed in the US, where data protection laws may differ from those
                      in your country. By using our Site or Services, you consent to this transfer.
                    </Clause>

                    <Clause title="Cookies">
                      We use cookies and similar technologies on the Site. For details, please see our{' '}
                      <a href="/cookies" className="text-[#0D2B6E] hover:underline">Cookie Policy</a>.
                    </Clause>

                    <Clause title="Changes to this policy">
                      We may update this Privacy Policy from time to time. We will post the updated policy on the Site
                      with a revised effective date. For material changes, we will make reasonable efforts to notify
                      enrolled students by email. Continued use of the Site or Services after a policy update means you
                      accept the revised policy.
                    </Clause>
                  </div>
                </section>

                {/* Contact footer */}
                <div className="rounded-xl border border-[#E2E0DA] bg-white px-6 py-5">
                  <p className="text-sm font-semibold text-[#1C1C1E]">Contact</p>
                  <p className="mt-1 text-sm text-[#64635F]">
                    For privacy-related questions or requests, contact RiseWithData at{' '}
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
