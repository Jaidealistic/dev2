/**
 * PRIVACY POLICY PAGE
 * 
 * COPPA-compliant privacy policy explaining data collection and usage
 */

'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
                </h1>
                <p className="text-sm text-[#8a8a8a] mb-8">
                    Last Updated: February 17, 2026
                </p>

                <div className="bg-white rounded-xl border border-[#f0ede8] p-8 space-y-8" style={{ lineHeight: '1.8' }}>
                    {/* Introduction */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            1. Introduction
                        </h2>
                        <p className="text-[#4a4a4a]">
                            At Lexfix, we are committed to protecting your privacy and the privacy of children who use our platform.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                        </p>
                        <div className="mt-4 bg-[#fff9e6] border border-[#f0e4b8] rounded-lg p-4">
                            <p className="text-[#4a4a4a] text-sm">
                                <strong className="text-[#856404]">COPPA Compliance:</strong> Lexfix complies with the Children's Online Privacy Protection Act (COPPA).
                                We obtain verifiable parental consent before collecting personal information from children under 13.
                            </p>
                        </div>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            2. Information We Collect
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-[#2d2d2d] mb-2">2.1 Personal Information (With Consent)</h3>
                                <p className="text-[#4a4a4a] mb-2">For learners (including those under 13 with parental consent):</p>
                                <ul className="list-disc ml-6 space-y-1 text-[#4a4a4a]">
                                    <li>Name, email address, date of birth</li>
                                    <li>Student ID (automatically generated)</li>
                                    <li>Learning preferences and accessibility settings</li>
                                    <li>Language proficiency level</li>
                                    <li>Disability accommodations (optional, to provide better support)</li>
                                    <li>Progress data (lessons completed, scores, time spent)</li>
                                    <li>User-generated content (assignments, portfolio work)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[#2d2d2d] mb-2">2.2 Automatically Collected Information</h3>
                                <ul className="list-disc ml-6 space-y-1 text-[#4a4a4a]">
                                    <li>Device type, browser information, IP address</li>
                                    <li>Usage data (pages visited, features used, time spent)</li>
                                    <li>Technical information for troubleshooting and security</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[#2d2d2d] mb-2">2.3 Parent/Guardian Information</h3>
                                <ul className="list-disc ml-6 space-y-1 text-[#4a4a4a]">
                                    <li>Name and email address (for account management)</li>
                                    <li>Communication preferences</li>
                                    <li>Relationship to child</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-[#4a4a4a] mb-3">We use collected information to:</p>
                        <ul className="list-disc ml-6 space-y-2 text-[#4a4a4a]">
                            <li><strong>Provide Educational Services:</strong> Deliver lessons, track progress, personalize learning experiences</li>
                            <li><strong>Accessibility:</strong> Apply customizations for dyslexia, ADHD, autism, and other learning needs</li>
                            <li><strong>Communication:</strong> Send progress reports, achievement notifications, and service updates</li>
                            <li><strong>Improvement:</strong> Analyze usage patterns to enhance features and fix issues</li>
                            <li><strong>Security:</strong> Protect against fraud, abuse, and unauthorized access</li>
                            <li><strong>Compliance:</strong> Fulfill legal obligations and enforce our Terms of Service</li>
                        </ul>
                        <div className="mt-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg p-4">
                            <p className="text-[#2d5f31] text-sm">
                                <strong>We DO NOT:</strong> Sell children's personal information, use it for behavioral advertising,
                                or share it with third parties for marketing purposes.
                            </p>
                        </div>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            4. Information Sharing and Disclosure
                        </h2>
                        <div className="space-y-3 text-[#4a4a4a]">
                            <p><strong>4.1 With Parents/Guardians</strong></p>
                            <p>
                                Parents have full access to their child's account, progress data, and learning activity through the parent dashboard.
                            </p>

                            <p className="mt-3"><strong>4.2 With Educators (If Applicable)</strong></p>
                            <p>
                                With parental consent, we may share learner progress with assigned teachers or homeschool educators.
                            </p>

                            <p className="mt-3"><strong>4.3 Service Providers</strong></p>
                            <p>
                                We may share data with trusted third-party service providers who help us operate our platform
                                (e.g., hosting, analytics, customer support). These providers are contractually obligated to protect your data.
                            </p>

                            <p className="mt-3"><strong>4.4 Legal Requirements</strong></p>
                            <p>
                                We may disclose information if required by law, court order, or to protect our rights and safety.
                            </p>

                            <p className="mt-3"><strong>4.5 Business Transfers</strong></p>
                            <p>
                                In the event of a merger, acquisition, or sale, user data may be transferred. We will notify you and seek
                                renewed consent if required.
                            </p>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            5. Data Security
                        </h2>
                        <p className="text-[#4a4a4a] mb-3">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc ml-6 space-y-1 text-[#4a4a4a]">
                            <li>Encrypted data transmission (HTTPS/SSL)</li>
                            <li>Secure password hashing (bcrypt)</li>
                            <li>Regular security audits and vulnerability testing</li>
                            <li>Access controls and authentication systems</li>
                            <li>Secure cloud infrastructure (PostgreSQL, MongoDB)</li>
                        </ul>
                        <p className="text-[#4a4a4a] mt-3">
                            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Parental Rights */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            6. Parental Rights (COPPA)
                        </h2>
                        <p className="text-[#4a4a4a] mb-3">
                            If your child is under 13, you have the right to:
                        </p>
                        <ul className="list-disc ml-6 space-y-2 text-[#4a4a4a]">
                            <li><strong>Review:</strong> Access your child's personal information</li>
                            <li><strong>Request Deletion:</strong> Ask us to delete your child's account and data</li>
                            <li><strong>Refuse Further Collection:</strong> Opt out of further data collection (may limit service functionality)</li>
                            <li><strong>Manage Consent:</strong> Update your consent preferences at any time</li>
                        </ul>
                        <p className="text-[#4a4a4a] mt-3">
                            To exercise these rights, contact us at <strong>privacy@lexfix.com</strong> with your verification information.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            7. Data Retention
                        </h2>
                        <p className="text-[#4a4a4a]">
                            We retain personal information for as long as necessary to provide our services and comply with legal obligations.
                            When you delete an account:
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1 text-[#4a4a4a]">
                            <li>Personal identifiers are removed or anonymized within 30 days</li>
                            <li>Progress data may be retained in anonymized form for research and improvement</li>
                            <li>Some records may be kept longer if required by law</li>
                        </ul>
                    </section>

                    {/* Cookies and Tracking */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            8. Cookies and Tracking Technologies
                        </h2>
                        <p className="text-[#4a4a4a]">
                            We use essential cookies for authentication and session management. We do NOT use third-party advertising
                            cookies or behavioral tracking for children's accounts.
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1 text-[#4a4a4a]">
                            <li><strong>Essential Cookies:</strong> Required for login, security, and core functionality</li>
                            <li><strong>Analytics:</strong> Anonymized usage statistics to improve our service (optional, can be disabled)</li>
                        </ul>
                    </section>

                    {/* International Users */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            9. International Users
                        </h2>
                        <p className="text-[#4a4a4a]">
                            If you access Lexfix from outside [Your Country], your information may be transferred to and stored on servers
                            in [Your Country]. By using our service, you consent to this transfer.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            10. Changes to This Privacy Policy
                        </h2>
                        <p className="text-[#4a4a4a]">
                            We may update this policy from time to time. We will notify you of material changes via email or in-app
                            notification. For changes affecting children's data, we will seek renewed parental consent.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">
                            11. Contact Us
                        </h2>
                        <p className="text-[#4a4a4a] mb-3">
                            If you have questions, concerns, or requests regarding this Privacy Policy or your data:
                        </p>
                        <div className="bg-[#f5f3ef] rounded-lg p-4 text-[#4a4a4a]">
                            <p><strong>Email:</strong> privacy@lexfix.com</p>
                            <p><strong>Postal Address:</strong> [Your Physical Address]</p>
                            <p className="mt-2 text-sm">
                                We will respond to verified parental requests within 30 days.
                            </p>
                        </div>
                    </section>

                    {/* Consent Confirmation */}
                    <section className="bg-[#f0f4f0] rounded-lg p-5 border border-[#d4dcd5]">
                        <h3 className="font-semibold text-[#2d2d2d] mb-2">
                            Parental Consent Acknowledgment
                        </h3>
                        <p className="text-[#4a4a4a] text-sm">
                            By creating an account for your child under 13, you certify that you are the parent or legal guardian and
                            you consent to the collection, use, and disclosure of your child's information as described in this Privacy Policy
                            and our Terms of Service.
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-8 flex justify-center gap-6 text-sm">
                    <Link href="/terms" className="text-[#7a9b7e] hover:underline">
                        Terms of Service
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
