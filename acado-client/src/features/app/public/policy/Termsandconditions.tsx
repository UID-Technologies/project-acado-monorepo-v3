import React from "react"

export default function PrivacyPolicyPreview() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center bg-white dark:bg-gray-700 rounded-lg p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-4 dark:text-primary text-primary">Terms & Conditions</h1>
            <p className="text-gray-500">Last updated: January 27, 2025</p>
          </div>

          {/* Introduction Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-lg leading-relaxed">
              Acado is committed to protecting the privacy of our users. This Terms & Conditions explains how we collect,
              use, disclose, and safeguard your information when you visit our website. Please read this policy
              carefully. If you do not agree with the terms of this Terms & Conditions, please do not access the site.
            </p>
          </div>

          {/* Information Collection Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">Information We Collect</h2>
            <div className="space-y-4">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-gray-400">
                  <span className="font-semibold">Personal Information:</span> Your name, email address, phone number,
                  and any other information you voluntarily provide when interacting with our site.
                </li>
                <li className="text-gray-400">
                  <span className="font-semibold">Usage Data:</span> Details about your interaction with the site, such
                  as IP address, browser type, and pages visited.
                </li>
                <li className="text-gray-400">
                  <span className="font-semibold">Cookies and Tracking Technologies:</span> Used to enhance your
                  experience and track visits to our website.
                </li>
              </ul>
            </div>
          </div>

          {/* Information Usage Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">How We Use Your Information</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {[
                "Operating and maintaining our website",
                "Improving your user experience",
                "Processing transactions",
                "Sending communications",
                "Providing customer support",
                "Complying with legal obligations",
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Sharing Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">How We Share Your Information</h2>
            <div className="space-y-4">
              {[
                { title: "Service Providers", desc: "Third-party providers performing services on our behalf." },
                { title: "Legal Requirements", desc: "Disclosure as required by law or legal processes." },
                { title: "Business Transfers", desc: "Transfer of data in case of mergers or acquisitions." },
              ].map((item, index) => (
                <div key={index}>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <h3 className="font-semibold text-lg dark:text-primary">{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  {index < 2 && <hr className="my-4 border-gray-200" />}
                </div>
              ))}
            </div>
          </div>

          {/* Data Security Section */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-red-600 mb-4 dark:text-primary">Data Security</h2>
              <p>
                We implement measures to safeguard your personal information, but no method of transmission or storage
                is 100% secure.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-red-600 mb-4 dark:text-primary">Your Choices</h2>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span>
                    <span className="font-semibold">Access:</span> Request your data
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span>
                    <span className="font-semibold">Opt-Out:</span> Unsubscribe
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span>
                    <span className="font-semibold">Cookies:</span> Adjust settings
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Children's Privacy and Policy Updates */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-red-600 mb-4 dark:text-primary">Children's Privacy</h2>
              <p>
                We do not knowingly collect personal information from children under 13. If discovered, such information
                will be deleted.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-red-600 mb-4 dark:text-primary">Policy Updates</h2>
              <p>
                We may update this policy from time to time. Updates will be posted here with a revised effective date.
              </p>
            </div>
          </div>

          {/* Your Rights Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {[
                "Access your personal data",
                "Request correction or deletion of your data",
                "Object to the processing of your data",
                "Request data portability",
                "Withdraw consent at any time",
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Retention Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">Data Retention</h2>
            <p>
              We retain your information only as long as necessary to fulfill the purposes outlined in this policy or as
              required by law.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">Contact Us</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Acado.ai</p>
                <p>c/o: Edulyst Ventures Private Limited</p>
                <p>F 272 FIRST FLOOR KRISHAN VIHAR DELHI,</p>
                <p>Delhi, India – 110086</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center space-x-2">
                  <span className="font-semibold">Email:</span>
                  <a
                    href="mailto:connect@acado.ai"
                    className="text-red-600 hover:underline"
                    aria-label="Send email to connect@acado.ai"
                  >
                    connect@acado.ai
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="font-semibold">Alternative Email:</span>
                  <a
                    href="mailto:connect@edulystventures.com"
                    className="text-red-600 hover:underline"
                    aria-label="Send email to connect@edulystventures.com"
                  >
                    connect@edulystventures.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 pt-8 dark:text-gray-500">
            <p>For questions about this Terms & Conditions, please contact us.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}