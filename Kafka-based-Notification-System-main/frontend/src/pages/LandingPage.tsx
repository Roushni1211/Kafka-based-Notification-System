import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Bell,
  Inbox,
  Layers,
  Send,
  Users,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigate404: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateRegister,
  onNavigate404,
}) => {
  const { toggleDemoMode } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      sessionStorage.setItem('companyconnect_signup_email', email.trim());
    }
    onNavigateRegister();
  };

  const faqs = [
    {
      q: 'How do company spaces work?',
      a: 'Spaces are isolated multi-tenant team hubs. Each space has its own dedicated broadcast channel, employee directory, and communication stream with role-based member permissions.',
    },
    {
      q: 'Can I access Relay on mobile while offline?',
      a: 'Yes. Relay is built as an installable Progressive Web App (PWA). It caches recent channels and broadcasts so you can review threads even in low-connectivity environments.',
    },
    {
      q: 'Can I format messages with markdown and code snippets?',
      a: 'Yes. The built-in rich editor supports full markdown syntax, bullet lists, quote blocks, and syntax-highlighted code blocks with 1-click code copying.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111213] text-[#191919] dark:text-[#e3e3e3] flex flex-col font-sans selection:bg-red-100">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 bg-white/95 dark:bg-[#111213]/95 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo (DoorDash-style curved emblem + bold brand text) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-full bg-[#eb1700] flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                <path d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5zm-13.8 2.2c-.7 0-1.2-.6-1.2-1.3 0-.7.5-1.3 1.2-1.3h8.6c.7 0 1.2.6 1.2 1.3 0 .7-.5 1.3-1.2 1.3H7.7z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#eb1700] uppercase">
              Relay
            </span>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Nav Links */}
            <a
              href="#about"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-[#191919] dark:text-gray-200 hover:text-[#eb1700] transition-colors"
            >
              Learn more
            </a>
            <a
              href="#faq"
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-[#191919] dark:text-gray-200 hover:text-[#eb1700] transition-colors"
            >
              FAQ
            </a>
            <button
              onClick={() => toggleDemoMode(true)}
              className="hidden lg:inline-block text-xs sm:text-sm font-semibold text-[#191919] dark:text-gray-200 hover:text-[#eb1700] transition-colors"
            >
              Live Demo
            </button>

            {/* Log In Button (DoorDash-style solid red pill) */}
            <button
              onClick={onNavigateLogin}
              className="bg-[#eb1700] hover:bg-[#d41500] text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all shadow-xs active:scale-95"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Split 2-Column (Phone Mockup on Left, Big Bold Typography on Right) */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Pastel Beige/Warm Card with Smartphone Mockup */}
          <div className="lg:col-span-5 bg-[#faf5ee] dark:bg-[#1a1918] rounded-3xl p-6 sm:p-10 flex items-center justify-center shadow-xs">
            {/* Phone Device Mockup */}
            <div className="w-[280px] sm:w-[305px] bg-white dark:bg-[#121212] rounded-[44px] border-[8px] border-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col select-none">
              
              {/* Dynamic Island / Top Notch */}
              <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span>9:41</span>
                <div className="w-20 h-4 bg-[#1e1e1e] rounded-full mx-auto" />
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-gray-400 rounded-xs relative">
                    <div className="w-2.5 h-full bg-gray-500" />
                  </div>
                </div>
              </div>

              {/* Phone Content Screen */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Header with Title and Notification Bell */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-5" />
                  <h3 className="font-bold text-sm text-[#191919] dark:text-white">
                    Workspace Feed
                  </h3>
                  <button className="text-[#eb1700] hover:opacity-80">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Metric Banner */}
                <div className="py-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Active team reach
                  </div>
                  <div className="text-2xl font-extrabold text-[#16a34a] tracking-tight mt-0.5">
                    94.8%
                  </div>
                </div>

                {/* Recent Spaces Section */}
                <div className="space-y-2 mt-1">
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Recent Spaces
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span># core-engineering</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        42 new <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span># product-roadmap</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        18 new <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span># leadership-sync</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Sub-15ms <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span># all-hands</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Delivered <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Channels Section */}
                <div className="space-y-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Direct Channels
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span>Demis Hassabis</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Active now <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span>Sundar Pichai</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Delivered <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span>Alex Mercer</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Read <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-gray-600 dark:text-gray-400">
                      <span>Elena Rostova</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        Online <ChevronRight className="w-3 h-3 text-gray-400 inline ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phone Bottom Tab Bar (5 Tabs) */}
                <div className="mt-4 pt-2.5 border-t border-gray-200 dark:border-gray-800 grid grid-cols-5 text-center text-[9px] text-gray-500">
                  <div className="flex flex-col items-center gap-0.5 text-[#eb1700] font-bold">
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Inbox</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Spaces</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Sent</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>People</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Typography & Action Form */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-6">
            {/* 3-Line Punchy Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#191919] dark:text-white tracking-tight leading-[1.08] mb-4">
              Your team.<br />
              Your spaces.<br />
              You're in sync.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#494949] dark:text-[#a0a0a0] font-normal mb-8">
              Communicate and collaborate when you want
            </p>

            {/* Email Input & Next Action (Pill Box) */}
            <form onSubmit={handleNext} className="w-full max-w-lg mb-4">
              <div className="flex flex-col sm:flex-row items-stretch border border-gray-300 dark:border-gray-600 focus-within:border-[#eb1700] rounded-full p-1 bg-white dark:bg-[#1e1f20] shadow-xs transition-all">
                <input
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-3 text-sm sm:text-base text-[#191919] dark:text-white bg-transparent outline-none rounded-full"
                />
                <button
                  type="submit"
                  className="bg-[#eb1700] hover:bg-[#d41500] active:scale-[0.98] text-white font-bold px-8 py-3 rounded-full text-sm sm:text-base transition-all shadow-xs shrink-0"
                >
                  Next
                </button>
              </div>
            </form>

            {/* Terms and Policies */}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed mb-4">
              By clicking "Next," I agree to the{' '}
              <span className="underline cursor-pointer hover:text-[#eb1700]">Workspace Terms of Service</span> and have read the{' '}
              <span className="underline cursor-pointer hover:text-[#eb1700]">Privacy Policy</span>.
            </p>

            {/* Red link to login */}
            <div>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-[#eb1700] font-bold text-sm sm:text-base hover:underline inline-block"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. "What is Relay" Section */}
      <section id="about" className="w-full bg-[#f7f7f7] dark:bg-[#151617] py-16 sm:py-24 px-6 sm:px-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191919] dark:text-white tracking-tight">
            What is Relay
          </h2>

          <p className="text-sm sm:text-base text-[#595959] dark:text-[#a5a5a5] leading-relaxed">
            Built for engineering teams, fast-moving startups, and enterprise organizations, Relay is about connecting people with high-clarity communication: focused team spaces, company-wide broadcasts, rich markdown formatting, and zero-distraction channels. We empower teams to coordinate seamlessly, share updates instantly, and keep work moving forward.
          </p>

          <p className="text-sm sm:text-base text-[#595959] dark:text-[#a5a5a5] leading-relaxed">
            As a workspace member, you can organize your own channels and enjoy the flexibility of choosing when, where, and how you communicate. All you need is a browser or mobile device to start staying in sync. It's that simple.
          </p>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section id="faq" className="w-full bg-white dark:bg-[#111213] py-16 px-6 sm:px-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#191919] dark:text-white text-center">
            Frequently Asked Questions
          </h3>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {faqs.map((item, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${selectedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {selectedFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Footer */}
      <footer className="py-6 px-6 sm:px-12 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111213]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#eb1700]" />
          <span>© 2026 Relay</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onNavigateLogin} className="hover:underline">Log In</button>
          <button onClick={onNavigateRegister} className="hover:underline">Sign Up</button>
          <button onClick={onNavigate404} className="hover:underline">Status</button>
          <a href="/swagger-ui/index.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
            <span>API Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};
