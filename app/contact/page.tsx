import Link from 'next/link';
import { Github, Mail, ArrowLeft, User, MessageCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function ContactPage() {
    const developers = [
        {
            name: 'Jaidealistic',
            role: 'Developer',
            github: 'https://github.com/Jaidealistic',
            username: 'Jaidealistic',
        },
        {
            name: 'Swasthika-P-S',
            role: 'Developer',
            github: 'https://github.com/Swasthika-P-S',
            username: 'Swasthika-P-S',
        },
        {
            name: 'iraianbu_2410',
            role: 'Developer',
            github: 'https://github.com/iraianbu-2410',
            username: 'iraianbu_2410',
        },
        {
            name: 'ShivaniShreya2006',
            role: 'Developer',
            github: 'https://github.com/ShivaniShreya2006',
            username: 'ShivaniShreya2006',
        },
        {
            name: 'kanishka1259',
            role: 'Developer',
            github: 'https://github.com/kanishka1259',
            username: 'kanishka1259',
        },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col">
            {/* Header */}
            <header role="banner" className="border-b border-[#e8e5e0] bg-white">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" aria-label="LexFix home">
                        <Logo />
                    </Link>
                    <nav aria-label="Main navigation" className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#2d2d2d] transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-5xl mx-auto px-6 py-16 w-full">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-3xl font-semibold text-[#2d2d2d] mb-4">Get in Touch</h1>
                    <p className="text-[#6b6b6b] text-base leading-relaxed">
                        LexFix is an open-source project dedicated to making language learning accessible for everyone.
                        Connect with our development team or contribute to our mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {developers.map((dev, index) => (
                        <div
                            key={dev.username}
                            className={`bg-white rounded-2xl p-8 border border-[#f0ede8] transition-all hover:shadow-lg hover:border-[#7a9b7e]/30 group ${index === developers.length - 1 && developers.length % 2 !== 0
                                ? 'md:col-span-2 md:max-w-md md:mx-auto w-full'
                                : ''
                                }`}
                            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#f0f4f0] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <User className="w-8 h-8 text-[#7a9b7e]" />
                                </div>
                                <h2 className="text-xl font-semibold text-[#2d2d2d] mb-1">{dev.name}</h2>
                                <p className="text-sm text-[#8a8a8a] mb-6">{dev.role}</p>

                                <div className="flex flex-col w-full gap-3">
                                    <a
                                        href={dev.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#2d2d2d] text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>Follow @{dev.username}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-[#f0f4f0] rounded-3xl p-10 border border-[#d4dcd5] max-w-4xl mx-auto">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <MessageCircle className="w-6 h-6 text-[#5d7e61]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3">Project Support</h2>
                    <p className="text-[#6b6b6b] text-sm mb-8 leading-relaxed max-w-md mx-auto">
                        Have questions, feedback, or want to report an issue?
                        Reach out to our core team directly via GitHub or email.
                    </p>
                    <a
                        href="mailto:admin@linguaaccess.com"
                        className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#7a9b7e] text-white font-medium rounded-xl hover:bg-[#6b8c6f] transition-all hover:scale-105 shadow-md shadow-[#7a9b7e]/20"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Email Support</span>
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer role="contentinfo" className="border-t border-[#e8e5e0] mt-auto">
                <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Logo />
                    <p className="text-xs text-[#8a8a8a]">&copy; 2026 LexFix. Inclusive language learning for everyone.</p>
                </div>
            </footer>
        </div>
    );
}
