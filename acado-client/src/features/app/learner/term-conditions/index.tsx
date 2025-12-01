import React from "react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center bg-white dark:bg-gray-700 rounded-lg p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-4 text-primary dark:text-primary">Terms & Conditions</h1>
            <p className="text-gray-500">Last updated: March 25, 2025</p>
          </div>

          {/* Terms Content */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow space-y-6">
            <p className="text-lg leading-relaxed">
              Welcome to <span className="font-semibold">Acado.ai</span> ("Company," "we," "us," or "our"). 
              These Terms and Conditions govern your use of our website, products, and services. By accessing or using our 
              Services, you agree to these Terms. If you do not agree, you may not use our Services.
            </p>

            {/* Sections */}
            {[
              {
                title: "1. Eligibility",
                content: [
                  "You must be at least 16 years old to use our Services. By accessing our platform, you represent and warrant that you meet this requirement.",
                  "If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind the organization to these Terms."
                ]
              },
              {
                title: "2. User Accounts",
                content: [
                  "You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials.",
                  "You agree to provide accurate, complete, and updated information during registration and to update such information promptly if it changes.",
                  "You are solely responsible for any activity under your account. Notify us immediately of unauthorized use."
                ]
              },
              {
                title: "3. Use of Services",
                content: [
                  "You agree to use our Services only for lawful purposes and in compliance with all applicable laws and regulations.",
                  "You agree not to:",
                  "• Post, upload, or share any content that is unlawful, defamatory, or harmful.",
                  "• Interfere with or disrupt the Services or servers.",
                  "• Use the Services to transmit spam, viruses, or malicious code.",
                  "We reserve the right to suspend or terminate your access to the Services if you violate these Terms."
                ]
              },
              {
                title: "4. Intellectual Property",
                content: [
                  "All content, materials, and features available on our Services, including but not limited to text, graphics, logos, and software, are the property of Acado or our licensors and are protected by applicable intellectual property laws.",
                  "You may not copy, modify, distribute, or create derivative works based on our content without prior written consent."
                ]
              },
              {
                title: "5. Payments and Subscriptions",
                content: [
                  "Certain features may require payment. All fees are non-refundable unless otherwise specified.",
                  "If your payment method fails, we may suspend or terminate your access to the Services.",
                  "Subscription-based services will renew automatically unless canceled before the renewal date."
                ]
              },
              {
                title: "6. Disclaimers",
                content: [
                  'The Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied.',
                  "We do not guarantee uninterrupted or error-free Services and are not responsible for technical issues beyond our control."
                ]
              },
              {
                title: "7. Limitation of Liability",
                content: [
                  "To the maximum extent permitted by law, Acado shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Services.",
                  "Our liability, if any, is limited to the amount you paid us for the Services."
                ]
              },
              {
                title: "8. Privacy",
                content: [
                  "Your use of the Services is also governed by our Privacy Policy, which explains how we collect, use, and protect your information."
                ]
              },
              {
                title: "9. Third-Party Links",
                content: [
                  "Our Services may contain links to third-party websites or services. We are not responsible for the content, terms, or practices of third-party platforms."
                ]
              },
              {
                title: "10. Modifications to Terms",
                content: [
                  "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting.",
                  "Continued use of the Services after changes constitute your acceptance of the updated Terms."
                ]
              },
              {
                title: "11. Termination",
                content: [
                  "We may suspend or terminate your access to the Services at our discretion, without notice, for conduct that violates these Terms or is harmful to others.",
                  "Upon termination, your right to use the Services will immediately cease."
                ]
              },
              {
                title: "12. Governing Law and Disputes",
                content: [
                  "These Terms are governed by the laws of [Insert Jurisdiction], without regard to conflict of laws principles.",
                  "Any disputes will be resolved exclusively in the courts located in [Insert Jurisdiction]."
                ]
              },
            ].map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-2xl font-semibold text-primary">{section.title}</h2>
                {section.content.map((text, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-300">{text}</p>
                ))}
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <h2 className="text-2xl font-semibold mb-3 text-primary">Contact Us</h2>
              <p>For any questions or concerns about these Terms, contact us at:</p>
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Acado.ai</p>
                <p>F 272 FIRST FLOOR KRISHAN VIHAR DELHI,</p>
                <p>Delhi, India – 110086</p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a href="mailto:connect@acado.ai" className="text-primary hover:underline">
                  connect@acado.ai
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Alternative Email:</span>{" "}
                  <a href="mailto:connect@edulystventures.com" className="text-primary hover:underline">
                  connect@edulystventures.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 pt-8 dark:text-gray-500">
            <p>For questions about these Terms and Conditions, please contact us.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
