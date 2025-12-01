import { Button } from '@/components/ui/shadcn/button';
import React from 'react';

export default function PrivacyPolicy() {
  const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'who-we-are', title: 'Who we are' },
    { id: 'data-we-collect', title: 'What data we collect' },
    { id: 'legal-bases', title: 'Why we use your data & legal bases' },
    { id: 'global-use', title: 'Global Use of Acado AI' },
    { id: 'who-we-share', title: 'Who we share data with' },
    { id: 'transfers', title: 'International transfers' },
    { id: 'retention', title: 'Data retention' },
    { id: 'your-rights', title: 'Your rights under GDPR' },
    { id: 'cookies', title: 'Cookies & tracking' },
    { id: 'children', title: "Children's privacy" },
    { id: 'security', title: 'Security' },
    { id: 'supervisory', title: 'Supervisory authority' },
    { id: 'changes', title: 'Changes to this policy' },
    { id: 'contact', title: 'Contact us' },
  ];

  return (
    <div className="min-h-screen text-slate-800 py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Privacy Policy — Acado AI</h1>
            <p className="mt-2 text-sm dark:text-white">Last updated: <time dateTime={new Date().toISOString()} className="font-medium">{`23 August 2025`}</time></p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild>
              <a
                href="#contact"
                className="text-sm font-medium dark:text-black text-white shadow-sm"
              >
                Contact Privacy Team
              </a>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / TOC */}
          <nav className="hidden lg:block col-span-1 sticky top-6 self-start">
            <div className="rounded-lg border p-4 shadow-sm dark:text-white">
              <h2 className="text-sm font-semibold text-slate-700">On this page</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-md px-2 py-1"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(s.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-xs text-slate-500">Smart Edu Bridge Oy — Privacy & data protection</div>
          </nav>

          {/* Content */}
          <article className="col-span-1 lg:col-span-3 prose prose-slate max-w-none rounded-lg p-6 shadow-sm print:shadow-none print:bg-transparent dark:text-white">
            {/* Introduction */}
            <section id="intro">
              <p>
                At <strong className='dark:text-white font-bold'>Acado AI</strong>, we respect your privacy and are committed to protecting your personal information. This
                Privacy Policy explains how we collect, use, and safeguard your data when you use our platform to connect with
                universities in Europe.
              </p>
            </section>

            {/* 1. Who we are */}
            <section id="who-we-are">
              <h2>1. Who we are</h2>
              <p>
                Company: <strong className='dark:text-white font-bold'>Smart Edu Bridge Oy</strong>
                <br />
                P.O Box 700 65101 Vaasa
                <br />
                Finland
                <br />
                Contact: <a href="mailto:connect@acado.ai" className='text-blue-500'>connect@acado.ai</a>
              </p>
            </section>

            {/* 2. What data we collect */}
            <section id="data-we-collect">
              <h2>2. What data we collect</h2>
              <p>We collect and process:</p>
              <ul>
                <li>
                  <strong className='dark:text-white font-bold'>Identification & contact data:</strong> name, email, phone, country/region of residence, nationality.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Education & application data:</strong> academic background, study interests, language skills, documents you
                  upload (e.g., CV, transcripts), application status and notes.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Account & usage data:</strong> login details, settings, in-platform messages, saved programmes,
                  clickstream and search actions (to improve the service).
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Technical data:</strong> device, browser, IP address, logs, and cookie/SDK identifiers (see Cookie section).
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Marketing preferences:</strong> your subscription and consent choices for communications.
                </li>
              </ul>
              <p>
                We do not intentionally collect special category data (e.g., health, religion). Please do not submit such information.
                If it is included in uploads (e.g., transcripts), we will restrict access and delete where not necessary.
              </p>
            </section>

            {/* 3. Why we use your data */}
            <section id="legal-bases">
              <h2>3. Why we use your data and our legal bases (GDPR Art. 6)</h2>
              <p>We process your data only where one or more legal bases apply (GDPR Art. 6):</p>

              <h3 className="mt-2">Provide the service & connect you with universities</h3>
              <p>
                To create/manage your account, let you discover programmes and University details, provide internship, scholarship
                and volunteering details and facilitate introductions/applications to universities and provide them with sufficient
                data from your profile.
                <br />
                <strong className='dark:text-white font-bold'>Legal basis:</strong> Contract (Art. 6(1)(b)).
              </p>

              <h3 className="mt-2">Operate, secure, and improve the platform</h3>
              <p>
                Troubleshooting, analytics, fraud/abuse prevention, and service quality.
                <br />
                <strong className='dark:text-white font-bold'>Legal basis:</strong> Legitimate interests (Art. 6(1)(f)) — balanced against your rights with appropriate
                safeguards.
              </p>

              <h3 className="mt-2">Compliance</h3>
              <p>
                To meet legal and regulatory obligations (e.g., record-keeping, responding to authorities).
                <br />
                <strong className='dark:text-white font-bold'>Legal basis:</strong> Legal obligation (Art. 6(1)(c)).
              </p>

              <h3 className="mt-2">Marketing & cookies</h3>
              <p>
                To send newsletters or show non-essential cookies/trackers only with your consent.
                <br />
                <strong className='dark:text-white font-bold'>Legal basis:</strong> Consent (Art. 6(1)(a)). You can withdraw at any time.
              </p>
            </section>

            {/* 4. Global Use */}
            <section id="global-use">
              <h2>4. Global Use of Acado AI</h2>
              <p>
                Acado AI is used by students worldwide. Regardless of where you are located, your data is processed under GDPR
                standards, ensuring the same level of protection. Our lead supervisory authority is the Office of the Data Protection
                Ombudsman in Finland, but EU users may also contact their local supervisory authority.
              </p>
            </section>

            {/* 5. Who we share data with */}
            <section id="who-we-share">
              <h2>5. Who we share data with</h2>
              <p>We may share your personal data with:</p>
              <ul>
                <li>
                  <strong className='dark:text-white font-bold'>Universities in Finland and abroad:</strong> When you request program information or submit an application, we
                  share relevant data. At that point, the university acts as an independent controller of the copy it receives.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Service providers (processors):</strong> Trusted vendors who provide hosting, analytics, email services, or
                  support — bound by GDPR-compliant contracts.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Authorities:</strong> Where required by law. <em>We never sell your data.</em>
                </li>
              </ul>
            </section>

            {/* 6. International transfers */}
            <section id="transfers">
              <h2>6. International transfers</h2>
              <p>
                Some providers may be located outside the EEA. Where we transfer personal data internationally, we use appropriate
                safeguards such as the EU Standard Contractual Clauses (SCCs).
              </p>
            </section>

            {/* 7. Data retention */}
            <section id="retention">
              <h2>7. Data retention</h2>
              <p>We retain your data only as long as necessary:</p>
              <ul>
                <li>
                  <strong className='dark:text-white font-bold'>Account data:</strong> while your account is active + 24 months of inactivity, then deletion/anonymisation.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Application records:</strong> up to 36 months after the application cycle.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Marketing data:</strong> until you unsubscribe or withdraw consent.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Cookies:</strong> per lifespan stated in our Cookie Notice. Where legal obligations require longer retention,
                  we comply.
                </li>
              </ul>
            </section>

            {/* 8. Your rights */}
            <section id="your-rights">
              <h2>8. Your Rights Under GDPR</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data.</li>
                <li>Request rectification of inaccurate data.</li>
                <li>Request erasure (“right to be forgotten”).</li>
                <li>Restrict processing in certain circumstances.</li>
                <li>Object to processing based on legitimate interest or direct marketing.</li>
                <li>Data portability (where applicable).</li>
                <li>Withdraw consent at any time.</li>
                <li>Lodge a complaint with a supervisory authority.</li>
              </ul>
              <p>We respond to rights requests within one month (extendable to three months if complex).</p>
            </section>

            {/* 9. Cookies */}
            <section id="cookies">
              <h2>9. Cookies & Tracking</h2>
              <p>We use cookies to operate the platform.</p>
              <ul>
                <li>
                  <strong className='dark:text-white font-bold'>Essential cookies:</strong> required for functionality.
                </li>
                <li>
                  <strong className='dark:text-white font-bold'>Analytics & marketing cookies:</strong> used only with your explicit consent via our cookie banner.
                </li>
              </ul>
              <p>You can update your preferences or withdraw consent anytime.</p>
            </section>

            {/* 10. Children */}
            <section id="children">
              <h2>10. Children’s Privacy</h2>
              <p>
                Our services are not directed at children under 13 (the digital age of consent in Finland). We do not knowingly process
                children’s data without parental consent where required.
              </p>
            </section>

            {/* 11. Security */}
            <section id="security">
              <h2>11. Security</h2>
              <p>
                We implement appropriate organisational and technical safeguards including encryption, access controls, and monitoring.
                While no system is entirely secure, we regularly review and strengthen our security measures.
              </p>
            </section>

            {/* 12. Supervisory authority */}
            <section id="supervisory">
              <h2>12. Supervisory Authority</h2>
              <p>If you have concerns, you may contact:</p>
              <address>
                <strong className='dark:text-white font-bold'>Office of the Data Protection Ombudsman (Finland)</strong>
                <br />
                Lintulahdenkuja 4, 00530 Helsinki, Finland
                <br />
                P.O. Box 800, 00531 Helsinki
                <br />
                Email: <a href="mailto:tietosuoja@om.fi" className='text-blue-600'>tietosuoja@om.fi</a> | Tel: +358 (0)29 566 6700
              </address>
            </section>

            {/* 13. Changes */}
            <section id="changes">
              <h2>13. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Any changes will be posted here with an updated “Last Updated” date.</p>
            </section>

            {/* 14. Contact */}
            <section id="contact">
              <h2>14. Contact Us</h2>
              <p>
                If you have any questions, please contact:
                <br />
                <strong className='dark:text-white font-bold'>Smart Edu Bridge Oy — Privacy Team</strong>
                <br />
                Email: <a href="mailto:connect@acado.ai" className='text-blue-600'>connect@acado.ai</a>
                <br />
                Address: Smart Edu Bridge Oy, P.O Box 700 65101 Vaasa, Finland
              </p>
            </section>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500">© Smart Edu Bridge Oy</p>
            </div>
          </article>
        </div>
      </div>

      {/* Floating back-to-top for mobile */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-4 bottom-6 z-50 inline-flex items-center justify-center rounded-full bg-sky-600 p-3 dark:text-white shadow-lg hover:bg-sky-700 lg:hidden"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}