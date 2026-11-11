'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';

const sections = [
  { id: 'acceptance',   label: '1. Acceptance & Eligibility' },
  { id: 'services',     label: '2. Services & Enrollment' },
  { id: 'fees',         label: '3. Fees, Refunds & IP' },
  { id: 'conduct',      label: '4. Conduct, Liability & Legal' },
];

export default function TermsPage() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-[#F8F7F3]">

        {/* Page header */}
        <div className="border-b border-[#E2E0DA] bg-white">
          <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0D2B6E]">Legal</p>
            <h1 className="font-serif text-3xl font-bold text-[#1C1C1E] sm:text-4xl" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Terms and Conditions
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
                  These Terms and Conditions ("Terms") govern your use of{' '}
                  <a href="https://www.risewithdata.com" className="text-[#0D2B6E] hover:underline">www.risewithdata.com</a>{' '}
                  (the "Site") and the live data analytics training programs, including the Data Analyst Fellowship (the "Services"),
                  offered by "RiseWithData", "we", "us". Effective date: <strong className="text-[#1C1C1E]">October 20, 2026</strong>.
                </p>

                {/* Section 1 */}
                <section id="acceptance">
                  <SectionHeading number="1" title="Acceptance of Terms and Eligibility" />
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      By accessing the Site, applying to a program, or paying a fee, you agree to these Terms and to our Privacy Policy
                      and Cookie Policy. If you do not agree, do not use the Site or Services.
                    </p>
                    <p>
                      You must be at least 18 years old, or the age of majority where you live, and able to form a binding contract.
                      If you enroll on behalf of an employer or organization, you confirm you have authority to bind it.
                    </p>
                    <p>
                      We may update these Terms at any time. The updated version takes effect when posted on the Site, and continued
                      use after that means you accept the changes. For material changes that may impact students who paid for a course,
                      we will make reasonable efforts to notify by email.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="services">
                  <SectionHeading number="2" title="Services, Enrollment, and Your Responsibilities" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">
                    <p>
                      The Services, like the Data Analyst Fellowship, is a live, cohort-based, project-based Power BI and data analytics
                      program of about 10 weeks, with two live sessions per week (Saturday and Sunday, 10:00 to 11:15 AM Eastern Time),
                      weekly instructor feedback, and career coaching. Cohorts are limited to 20 seats. Sessions are recorded and made
                      available to enrolled students.
                    </p>

                    <Clause title="Enrollment">
                      A seat is reserved only after we confirm your enrollment and receive payment. We may decline, cancel, or reschedule
                      a cohort, change start dates, instructors, schedules, or curriculum, and merge cohorts. If we cancel a cohort, you
                      may transfer to a later cohort or receive a full refund of fees paid for it.
                    </Clause>

                    <Clause title="Accounts">
                      You may need an account to access course materials, recordings, and the student community. Provide accurate
                      information, keep your login credentials confidential, and notify us promptly at{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>{' '}
                      of any unauthorized use. You are responsible for activity under your account; accounts may not be shared.
                    </Clause>

                    <Clause title="Your equipment and tools">
                      You are responsible for a reliable internet connection and a compatible computer. Power BI Desktop and a
                      Microsoft 365 account are third-party products governed by Microsoft's terms, and we do not control their
                      availability or pricing.
                    </Clause>

                    <Clause title="Equipment, access, and accommodations not provided">
                      RiseWithData does not provide computers, software licenses, internet access, or other equipment or technology
                      needed to take part. We also do not provide sign language interpreters, captioning services, translators, or
                      other individual accommodation or support services. You are responsible for arranging and paying for these
                      yourself. If you need any such support, you must inform us at{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>{' '}
                      before applying. We will review your request and let you know whether reasonable support can be provided. We
                      are not obligated to provide support that you did not request in advance.
                    </Clause>

                    <Clause title="Recordings and participation">
                      Live sessions may be recorded, and your voice, image, name, and chat messages may appear in recordings shared
                      with the cohort. If you do not want to appear, you may keep your camera and microphone off. You may not record,
                      download, or redistribute sessions or materials yourself.
                    </Clause>

                    <Clause title="Attendance and make-up sessions">
                      You are expected to attend live sessions and submit homework/survey during the live session. Watching a recording
                      does not count as live attendance, but you may use recordings to catch up on missed content. Make-up sessions or
                      one-on-one help are not guaranteed. If you fall significantly behind or stop participating, we are not required to
                      extend your access or repeat content.
                    </Clause>

                    <Clause title="Transfers and deferrals">
                      You may request one transfer to a later cohort by emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>{' '}
                      at least 7 days before your cohort starts, subject to seat availability and fees of next cohort. Transfers are
                      not available after the cohort has begun. If the next cohort fee is higher than the amount paid, the student
                      needs to pay the difference.
                    </Clause>

                    <Clause title="Privacy of other students">
                      You agree to keep confidential anything other students share during sessions, in chats, or in the community,
                      and not to record, screenshot, or share it outside the program without their permission.
                    </Clause>

                    <Clause title="One-on-one (1:1) sessions">
                      <p className="mb-3">
                        Enrolled students may book 1:1 sessions with a trainer on Saturdays and Sundays between 11:00 AM and
                        6:00 PM Eastern Time, or on other days and times that a trainer offers during the program. Please observe
                        the following:
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Booking window.</strong> 1:1 sessions must be both booked and attended within three (3) months of your enrollment date. Sessions not used within this period expire, and no refund, credit, or extension will be given for unused sessions.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Missed sessions.</strong> If you book a 1:1 session and do not attend it, the session is counted as used, regardless of the reason.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Cancellation by us.</strong> A trainer may cancel, reschedule, or miss a 1:1 session for any reason. We will make reasonable efforts to notify you in advance, but we are not liable for any inconvenience or loss caused by a cancellation or change. If we cancel or miss a session, we will offer you a replacement session within your booking window where possible.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span><strong>Availability.</strong> Booking is subject to trainer availability and is not guaranteed for any specific date or time.</span></li>
                        <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0 text-[#0D2B6E]">—</span><span>Only bookings accepted by the trainer will be counted for the sessions.</span></li>
                      </ul>
                    </Clause>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="fees">
                  <SectionHeading number="3" title="Fees, Refunds, and Intellectual Property" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">

                    <Clause title="Fees and payment">
                      Program fees are shown on our pricing page or provided at enrollment, in US dollars. Payment is due at
                      enrollment unless a payment plan is agreed in writing. You authorize us and our payment processors to charge
                      your chosen payment method. Fees do not include taxes or processing charges, which you are responsible for
                      where applicable. Missed installments may result in suspended access.
                    </Clause>

                    <Clause title="Payment does not guarantee enrollment">
                      Making a payment does not by itself confirm your enrollment, seat, or access. Your enrollment is confirmed
                      only when you receive written confirmation from us by email. If you have not received confirmation from us,
                      RiseWithData is not liable or responsible for any seat, access, services, or obligations in connection with
                      that payment, and we may refund it in full at our discretion.
                    </Clause>

                    <Clause title="Refund policy">
                      You may request a full refund within 7 days of paying, provided you have not attended or missed more than
                      two live sessions. After that, fees are non-refundable, including for missed sessions, because seats are
                      limited and reserved for you. Refunds are issued to the original payment method within 30 business days of
                      approval. Request a refund by emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>.
                    </Clause>

                    <Clause title="Reporting issues — 7-day notice">
                      Any issue, complaint, billing error, or dispute relating to the Services or anything related to the program
                      or firm must be reported in writing to{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>{' '}
                      within 7 days of the date it occurred. Reports made after 7 days are not eligible for any refund, credit,
                      compensation, or other recompense, and we may decline to act on them.
                    </Clause>

                    <Clause title="No guarantee of outcomes">
                      Career coaching and our alumni network are provided to support you, but we do not guarantee employment, a
                      job interview, a salary, a promotion, or any specific result. Outcomes depend on your effort, background,
                      and the job market. Statements about employers using the technologies we teach are general and do not mean
                      any company endorses or hires from RiseWithData.
                    </Clause>

                    <Clause title="Testimonials and student results">
                      Testimonials, success stories, and outcomes on our Site or in our marketing reflect individual experiences
                      and are not typical or guaranteed. Results vary based on each student's effort, background, and market
                      conditions.
                    </Clause>

                    <Clause title="Trainers are independent">
                      Trainers, instructors, and guest speakers are independent contractors or volunteers and not employees,
                      agents, or partners of RiseWithData. To the fullest extent permitted by law, RiseWithData is not responsible
                      or liable for any act, omission, statement, advice, or conduct of a trainer, and is not eligible for or
                      liable to pay any compensation or recompense for any wrong or loss caused by a trainer. Any such claim must
                      be directed to the trainer concerned.
                    </Clause>

                    <Clause title="Certificate">
                      The RiseWithData Fellowship Certificate shows completion of our program only. It is not an accredited degree
                      or a Microsoft certification. We may withhold or revoke a certificate if you breach these Terms or engage in
                      academic dishonesty.
                    </Clause>

                    <Clause title="Certificate requirements">
                      To receive the certificate, you must attend at least 70% of live sessions, complete and submit the required
                      projects by their deadlines, and have paid all fees in full. Meeting these requirements is your
                      responsibility, and we decide in good faith whether they have been met.
                    </Clause>

                    <Clause title="Our content">
                      All course materials, curricula, slides, recordings, datasets, templates, text, graphics, logos, and the
                      RiseWithData name are owned by RiseWithData or its licensors and protected by intellectual property laws.
                      We grant you a limited, personal, non-exclusive, non-transferable, revocable license to use them for your
                      own learning. You may not copy, resell, share, publish, or create derivative works from them.
                    </Clause>

                    <Clause title="Your work">
                      You keep ownership of the projects and reports you create. You grant us a non-exclusive, royalty-free
                      license to display your work and, if you give consent, your name and testimonials for educational and
                      promotional purposes. You may revoke consent for future use by emailing us.
                    </Clause>

                    <Clause title="Feedback">
                      If you give us suggestions or feedback, we may use them without obligation to you.
                    </Clause>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="conduct">
                  <SectionHeading number="4" title="Conduct, Disclaimers, Liability, and Legal Terms" />
                  <div className="mt-5 space-y-6 text-sm leading-relaxed text-[#3A3935]">

                    <Clause title="Acceptable use">
                      You agree not to: harass, discriminate against, or disrupt other students or instructors; share your account
                      or login; copy or redistribute course materials or recordings; upload unlawful, infringing, or malicious
                      content; attempt to hack, scrape, or interfere with the Site; use the Services to violate any law; or
                      misrepresent your identity or your RiseWithData credentials. We may suspend or terminate access without
                      refund if you breach these Terms.
                    </Clause>

                    <Clause title="Code of conduct and removal">
                      Be respectful, professional, and honest. Harassment, discrimination, offensive language, disruption of
                      sessions, cheating, plagiarism, or submitting work that is not your own are not allowed. We may warn,
                      suspend, or remove you from a cohort or the community at our discretion, and if we do so for a violation,
                      you are not entitled to a refund.
                    </Clause>

                    <Clause title="Third-party services">
                      The Site may link to or rely on third-party services, such as Microsoft, payment processors, and social
                      platforms. We are not responsible for their content, terms, or practices.
                    </Clause>

                    <Clause title="Privacy">
                      Our collection and use of personal information is described in our Privacy Policy and Cookie Policy.
                    </Clause>

                    <Clause title="Electronic communications and consent">
                      By enrolling, you agree that we may contact you by email, text message, or phone about your application,
                      enrollment, sessions, and program updates, and you agree to receive notices from us electronically. You
                      may opt out of marketing messages at any time by following the unsubscribe instructions or emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>,
                      but we may still send you essential messages about your enrollment. Message and data rates may apply.
                    </Clause>

                    <Clause title="Disclaimer">
                      The Site and Services are provided "as is" and "as available" without warranties of any kind, express or
                      implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not
                      warrant that the Site will be uninterrupted or error-free, or that the Services will meet your expectations.
                    </Clause>

                    <Clause title="Instructor advice">
                      Career, salary, technical, and other advice from trainers, coaches, guest speakers, or alumni is general
                      information for educational purposes only. It is not professional, legal, financial, or employment advice,
                      and you should decide for yourself how to use it.
                    </Clause>

                    <Clause title="Limitation of liability">
                      To the fullest extent permitted by law, RiseWithData and its owners, instructors, and affiliates are not
                      liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, income,
                      or opportunities, arising from your use of the Site or Services. Our total liability for any reason, for
                      any claim is limited to the fees you paid us for the program or $500 (whichever is lower).
                    </Clause>

                    <Clause title="Indemnification">
                      You agree to indemnify and hold harmless RiseWithData from claims, damages, and expenses (including
                      reasonable legal fees) arising from your breach of these Terms or misuse of the Services.
                    </Clause>

                    <Clause title="Termination">
                      You may stop using the Services at any time, subject to the refund policy above. We may suspend or end
                      your access for breach of these Terms or for any reason with notice. Sections on intellectual property,
                      disclaimers, liability, and governing law survive termination.
                    </Clause>

                    <Clause title="Force majeure">
                      We are not liable for any delay, cancellation, or failure to provide the Services caused by events beyond
                      our reasonable control, including internet or platform outages, illness, natural disasters, weather, power
                      failures, government actions, or instructor unavailability. We may reschedule sessions, provide recordings,
                      or move delivery online to address these events, and this will not entitle you to a refund.
                    </Clause>

                    <Clause title="Governing law and disputes">
                      These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-law rules.
                      Before filing a claim, you agree to try to resolve the dispute informally by emailing{' '}
                      <a href="mailto:support@risewithdata.com" className="text-[#0D2B6E] hover:underline">support@risewithdata.com</a>{' '}
                      for at least 30 days. Remaining disputes will be resolved by binding individual arbitration in Indianapolis,
                      Indiana; you waive class actions.
                    </Clause>

                    <Clause title="General">
                      These Terms are the entire agreement between you and us on this subject. If a provision is unenforceable,
                      the rest stays in effect. Our failure to enforce a right is not a waiver. You may not assign these Terms
                      without our consent; we may assign them to a successor.
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
