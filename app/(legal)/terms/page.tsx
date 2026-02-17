/**
 * TERMS OF SERVICE PAGE
 * 
 * Professional, COPPA-compliant Terms of Service
 */

'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="bg-white border-b border-[#e8e5e0]">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/" className="text-xl font-semibold text-[#2d2d2d] hover:text-[#7a9b7e] transition-colors">
                        ← Back to Lexfix
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-[#2d2d2d] mb-2">
                    Terms of Service
                </h1>
                <p className="text-sm text-[#8a8a8a] mb-8">
                    Last Updated: February 17, 2026
                </p>

                <div className="bg-white rounded-xl border border-[#f0ede8] p-8 space-y-8" style={{ lineHeight: '1.8' }}>
                    {/* Introduction */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            1. Agreement to Terms
                        </h2>
                        <p className="text-[#4a4a4a]">
                            Welcome to Lexfix. By accessing or using our educational platform, you agree to be bound by these Terms of Service ("Terms").
                            If you do not agree to these Terms, please do not use our services.
                        </p>
                        <p className="text-[#4a4a4a] mt-3">
                            <strong>For Users Under 13:</strong> Lexfix complies with the Children's Online Privacy Protection Act (COPPA).
                            If you are under 13 years of age, you must have your parent or legal guardian read and agree to these Terms on your behalf.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            2. Service Description
                        </h2>
                        <p className="text-[#4a4a4a]">
                            Lexfix is an inclusive, accessible language learning platform designed to support learners with various learning needs,
                            including dyslexia, ADHD, autism, auditory processing disorder, dysgraphia, and visual impairments. We provide:
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1 text-[#4a4a4a]">
                            <li>Interactive language lessons in multiple languages</li>
                            <li>Customizable accessibility features and learning preferences</li>
                            <li>Progress tracking and achievement systems</li>
                            <li>Parent and educator dashboards for monitoring learner progress</li>
                            <li>Adaptive learning tools and assessments</li>
                        </ul>
                    </section>

                    {/* User Accounts */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            3. User Accounts and Responsibilities
                        </h2>
                        <div className="space-y-3 text-[#4a4a4a]">
                            <p><strong>3.1 Account Creation</strong></p>
                            <p>
                                You must provide accurate and complete information when creating an account. Parents or guardians must create and manage
                                accounts for children under 13.
                            </p>

                            <p className="mt-3"><strong>3.2 Account Security</strong></p>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use.
                            </p>

                            <p className="mt-3"><strong>3.3 Acceptable Use</strong></p>
                            <p>You agree NOT to:</p>
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>Use the service for any unlawful purpose</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Attempt to gain unauthorized access to our systems</li>

                                <li>Upload malicious code, viruses, or harmful content</li>
                                <li>Impersonate others or misrepresent your identity</li>
                                <li>Scrape, data mine, or extract content without permission</li>
                            </ul>
                        </div>
                    </section>

                    {/* Content Ownership */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            4. Intellectual Property
                        </h2>
                        <div className="space-y-3 text-[#4a4a4a]">
                            <p><strong>4.1 Our Content</strong></p>
                            <p>
                                All content on Lexfix, including lessons, graphics, text, software, and trademarks, is owned by Lexfix or our licensors
                                and protected by copyright and intellectual property laws.
                            </p>

                            <p className="mt-3"><strong>4.2 User-Generated Content</strong></p>
                            <p>
                                By submitting content (assignments, portfolio work, etc.), you grant Lexfix a non-exclusive, worldwide license to use,
                                display, and store your content for the purpose of providing our services. You retain ownership of your work.
                            </p>

                            <p className="mt-3"><strong>4.3 Educational Use Only</strong></p>
                            <p>
                                You may use our content solely for personal, non-commercial educational purposes. Redistribution, resale, or commercial
                                use is prohibited without written permission.
                            </p>
                        </div>
                    </section>

                    {/* Privacy */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            5. Privacy and Data Protection
                        </h2>
                        <p className="text-[#4a4a4a]">
                            Your privacy is important to us. Please review our{' '}
                            <Link href="/privacy" className="text-[#7a9b7e] hover:underline font-medium">
                                Privacy Policy
                            </Link>
                            {' '}to understand how we collect, use, and protect your personal information, especially for users under 13.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            6. Disclaimers and Limitations
                        </h2>
                        <div className="space-y-3 text-[#4a4a4a]">
                            <p><strong>6.1 Educational Tool</strong></p>
                            <p>
                                Lexfix is an educational tool to supplement learning. It is not a substitute for formal education, therapy,
                                or professional diagnosis of learning disabilities.
                            </p>

                            <p className="mt-3"><strong>6.2 No Warranty</strong></p>
                            <p>
                                The service is provided "AS IS" without warranties of any kind, express or implied. We do not guarantee uninterrupted,
                                error-free, or secure access.
                            </p>

                            <p className="mt-3"><strong>6.3 Limitation of Liability</strong></p>
                            <p>
                                To the maximum extent permitted by law, Lexfix shall not be liable for any indirect, incidental, consequential,
                                or punitive damages arising from your use of the service.
                            </p>
                        </div>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            7. Termination
                        </h2>
                        <p className="text-[#4a4a4a]">
                            We may suspend or terminate your account if you violate these Terms. You may terminate your account at any time by
                            contacting us. Upon termination, your right to use the service ceases immediately.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            8. Changes to Terms
                        </h2>
                        <p className="text-[#4a4a4a]">
                            We may update these Terms from time to time. We will notify you of material changes via email or in-app notification.
                            Continued use after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            9. Governing Law and Dispute Resolution
                        </h2>
                        <p className="text-[#4a4a4a]">
                            These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through binding arbitration
                            or in courts located in [Your Jurisdiction].
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            10. Contact Information
                        </h2>
                        <p className="text-[#4a4a4a]">
                            If you have questions about these Terms, please contact us at:
                        </p>
                        <div className="mt-3 text-[#4a4a4a]">
                            <p><strong>Email:</strong> legal@lexfix.com</p>
                            <p><strong>Address:</strong> [Your Physical Address]</p>
                        </div>
                    </section>

                    {/* Acknowledgment */}
                    <section className="bg-[#f0f4f0] rounded-lg p-5 border border-[#d4dcd5]">
                        <h3 className="font-semibold text-[#2d2d2d] mb-2">
                            Parental Consent for Users Under 13
                        </h3>
                        <p className="text-[#4a4a4a] text-sm">
                            If you are a parent or legal guardian creating an account for a child under 13, you acknowledge that you have read,
                            understood, and agree to these Terms on behalf of your child. You consent to the collection and use of your child's
                            information as described in our Privacy Policy.
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-8 flex justify-center gap-6 text-sm">
                    <Link href="/privacy" className="text-[#7a9b7e] hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="text-[#8a8a8a] hover:text-[#2d2d2d]">
                        Home
                    </Link>
                    <Link href="/contact" className="text-[#8a8a8a] hover:text-[#2d2d2d]">
                        Contact Us
                    </Link>
                </div>
            </main>
        </div>
    );
}
