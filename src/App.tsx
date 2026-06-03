import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animated counter for stats
const Counter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Section wrapper with scroll animation
const AnimatedSection = ({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
};

// Interactive CLI Terminal Widget
const TerminalWidget = () => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    { cmd: 'welcome', output: 'Sachin Thakor Secure Terminal [Version 2.4.0]\nType "help" to see available commands.\n\nsachin@portfolio:~$ ' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim().toLowerCase();
    if (!command) return;

    let output: string | React.ReactNode = '';

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1">
            <p className="text-teal-400">Available Commands:</p>
            <p><span className="text-emerald-400">about</span>      - Print Sachin's professional summary</p>
            <p><span className="text-emerald-400">skills</span>     - List technical skills categorized</p>
            <p><span className="text-emerald-400">projects</span>   - Detail key cybersecurity & web projects</p>
            <p><span className="text-emerald-400">certs</span>      - Display professional credentials & certifications</p>
            <p><span className="text-emerald-400">nmap</span>       - Perform a simulated security scan on this portfolio host</p>
            <p><span className="text-emerald-400">clear</span>      - Clear terminal history</p>
          </div>
        );
        break;
      case 'about':
        output = 'Aspiring Penetration Tester and Cybersecurity Learner. Certified Ethical Hacker (CEH v13) pursuing BCA (Hons) at Parul University. Gaining hands-on experience in vulnerability assessment, traffic analysis, and basic network intelligence using Kali Linux, Nmap, and Burp Suite.';
        break;
      case 'skills':
        output = (
          <div className="space-y-2">
            <p><span className="text-teal-400">Security:</span> Penetration Testing, Ethical Hacking, Vulnerability Assessment, Information Gathering</p>
            <p><span className="text-teal-400">Tools:</span> Nmap, Wireshark, Burp Suite, TryHackMe (Top 20% Global Ranking)</p>
            <p><span className="text-teal-400">OS:</span> Kali Linux, Windows</p>
            <p><span className="text-teal-400">Programming:</span> Python, Bash Scripting, Java (Basic)</p>
          </div>
        );
        break;
      case 'projects':
        output = (
          <div className="space-y-2">
            <p><span className="text-emerald-400 font-bold">1. Cyber Plus (MEAN Stack)</span> - Cybersecurity Utility Platform with metadata analysis, metadata removal, IP/domain intelligence, and AES-256 encryption.</p>
            <p><span className="text-emerald-400 font-bold">2. Agro Farm (Django)</span> - Agricultural E-Commerce Platform with relational database-driven workflow, orders management, and responsive frontend.</p>
          </div>
        );
        break;
      case 'certs':
        output = (
          <div className="space-y-1">
            <p>• Certified Ethical Hacker (CEH v13) – EC-Council</p>
            <p>• Cyber Security & Ethical Hacking – Parul University</p>
            <p>• Computer Network & Internet Protocol – NPTEL</p>
            <p>• ICS/SCADA Cybersecurity – Red Team Leaders</p>
            <p>• Certified Social Engineering Defence Practitioner (CSEDP) – SecOps Group</p>
            <p>• Certified Online Fraud Prevention Specialist (COFPS)</p>
          </div>
        );
        break;
      case 'nmap':
        output = (
          <div className="space-y-2 font-mono text-xs text-slate-300">
            <p className="text-yellow-500">Starting Nmap 7.94 ( https://nmap.org ) at 2026-06-02 09:00 IST</p>
            <p>Nmap scan report for sachinthakor.portfolio (127.0.0.1)</p>
            <p>Host is up (0.00032s latency).</p>
            <p>Not shown: 994 closed ports (conn-refused)</p>
            <p className="text-teal-400 font-bold">PORT     STATE SERVICE      VERSION</p>
            <p>22/tcp   open  ssh          OpenSSH 8.9p1 (Secure Shell)</p>
            <p>80/tcp   open  http         React 19 / Vite 7.2</p>
            <p>443/tcp  open  https        SSL/TLS (Cloudflare protection)</p>
            <p>3306/tcp open  mysql        MySQL 8.0.35 (Agro Farm Database)</p>
            <p>5000/tcp open  flask        Python 3.10 Flask Backend</p>
            <p>8080/tcp open  http-alt     Node/Express API (Cyber Plus Backend)</p>
            <p className="text-emerald-400 font-bold mt-2">Nmap done: 1 IP address (1 host up) scanned in 0.85 seconds</p>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      default:
        output = `Command not found: ${command}. Type "help" for a list of commands.`;
    }

    setHistory((prev) => [...prev, { cmd: inputValue, output }]);
    setInputValue('');
  };

  return (
    <div 
      onClick={focusInput}
      className="terminal h-[360px] flex flex-col font-mono text-sm cursor-text border border-slate-800 rounded-xl overflow-hidden"
    >
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="terminal-button bg-[#ef4444]" />
          <span className="terminal-button bg-[#f59e0b]" />
          <span className="terminal-button bg-[#10b981]" />
          <span className="ml-2 text-xs text-slate-500">guest@sachinthakor: ~</span>
        </div>
        <span className="text-xs text-slate-600">bash</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin select-text">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1 whitespace-pre-wrap leading-relaxed text-slate-300">
            {item.cmd !== 'welcome' && (
              <p className="text-slate-400">
                <span className="text-emerald-400">sachin@portfolio</span>:<span className="text-teal-400">~</span>$ {item.cmd}
              </p>
            )}
            <div className="text-slate-200">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-slate-800/60 bg-[#07090e] px-4 py-2">
        <span className="text-emerald-400 shrink-0 select-none">sachin@portfolio:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="terminal-input flex-1 outline-none text-teal-400 select-text"
          placeholder='Type a command...'
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};

// Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['about', 'skills', 'certifications', 'projects', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      const sections = navItems.map(item => document.getElementById(item));
      const scrollPos = window.scrollY + 180;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#080b10]/90 backdrop-blur-md border-b border-slate-800/80 shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-base font-display">
            ST
          </div>
          <span className="text-lg font-semibold tracking-tight font-display text-white">Sachin Thakor</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {navItems.filter(item => item !== 'contact').map((item) => (
            <motion.a
              key={item}
              href={`#${item}`}
              whileHover={{ scale: 1.05 }}
              className={`transition-colors capitalize relative ${
                activeSection === item ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item}
              {activeSection === item && (
                <motion.div
                  layoutId="activeSectionIndicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                />
              )}
            </motion.a>
          ))}
          <a
            href="#contact"
            className="px-4 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-teal-500/30 text-xs tracking-wider transition-all font-mono"
          >
            CONTACT
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-xl text-slate-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080b10] border-t border-slate-800/80"
          >
            <div className="px-6 py-4 flex flex-col gap-3 text-sm">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`capitalize py-1.5 transition-colors ${
                    activeSection === item ? 'text-teal-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden">
      {/* Subtle background glow grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(20,184,166,0.06),transparent)] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full py-12">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                CEH v13 Certified Pentester
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold leading-tight font-display tracking-tight text-white"
            >
              Hi, I'm <span className="gradient-text">Sachin Thakor</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 leading-relaxed font-light"
            >
              An aspiring <strong className="text-white font-medium">Penetration Tester</strong> and cybersecurity learner pursuing my BCA (Hons) at Parul University. Gaining hands-on practice in network reconnaissance, vulnerability assessments, and foundational security concepts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#contact"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-xl font-medium tracking-wide shadow-md transition-all hover:-translate-y-0.5 text-sm"
              >
                Inquire & Connect
              </a>
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:text-white transition-all hover:-translate-y-0.5 text-sm"
              >
                View Hand-on Projects
              </a>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80"
            >
              <div>
                <div className="text-2xl font-bold text-white font-mono">
                  <Counter end={20} suffix="%" />
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">TryHackMe Top Global</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">
                  <Counter end={6} suffix="" />
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">Certifications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">
                  <Counter end={2} suffix="" />
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">Practical Projects</div>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <div className="text-left mb-2 text-xs text-slate-500 font-mono flex items-center justify-between">
                <span>SYSTEM DIAGNOSTICS</span>
                <span className="text-teal-500/80 animate-pulse">● SECURE LIVE</span>
              </div>
              <TerminalWidget />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none opacity-40">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-slate-700 flex justify-center pt-1"
        >
          <div className="w-1 h-1.5 rounded-full bg-teal-400" />
        </motion.div>
      </div>
    </section>
  );
};

// About / Summary Section
const About = () => {
  return (
    <AnimatedSection id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <h2 className="text-3xl font-bold text-white font-display">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="text-slate-400 space-y-4 leading-relaxed text-base">
              <p>
                I am currently pursuing a <strong className="text-white font-medium">Bachelor of Computer Applications (Hons)</strong> with a focus on security paradigms at <strong className="text-white font-medium">Parul University</strong>. 
                With an active <strong className="text-white font-medium">Certified Ethical Hacker (CEH v13)</strong> qualification from EC-Council, I study offensive security techniques and systematic vulnerability discovery.
              </p>
              <p>
                My lab-based training focuses on reconnaissance, vulnerability assessment, traffic analysis, and exploit identification across Kali Linux and secure target nodes. I am building a solid foundational understanding of TCP/IP networking, firewalls, and cryptographic protocols.
              </p>
              <p>
                I am actively seeking professional cybersecurity internships where I can contribute to penetration testing cycles, vulnerability assessment, or security operations center (SOC) objectives.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-300 font-mono bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <i className="fas fa-map-marker-alt text-teal-400" />
                Gujarat, India
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 font-mono bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <i className="fas fa-university text-teal-400" />
                BCA (Hons) Undergrad
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="hex-card p-6 md:p-8 space-y-6 bg-slate-900/40">
              <h3 className="text-lg font-semibold text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
                <i className="fas fa-terminal text-teal-400 text-sm" />
                Security Domain Profile
              </h3>
              
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 uppercase">
                    <span>Reconnaissance & OSINT</span>
                    <span className="text-teal-400">85%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 uppercase">
                    <span>Vulnerability Assessment</span>
                    <span className="text-teal-400">80%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 uppercase">
                    <span>Network Analysis & Auditing</span>
                    <span className="text-teal-400">75%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 uppercase">
                    <span>Security Testing (Burp / OWASP)</span>
                    <span className="text-teal-400">70%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-800/30 text-xs text-teal-300 font-mono leading-relaxed">
                <i className="fas fa-info-circle mr-2 text-teal-400" />
                Lab Metrics reflect relative proficiency and experience in simulated penetration environments (e.g. TryHackMe, PortSwigger labs).
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Skills Section
const Skills = () => {
  const skillCategories = [
    {
      title: 'Security & Pentesting',
      icon: 'fas fa-shield-halved',
      skills: ['Penetration Testing', 'Ethical Hacking', 'Vulnerability Assessment', 'Information Gathering', 'Network Security', 'Security Testing']
    },
    {
      title: 'Security Tools',
      icon: 'fas fa-toolbox',
      skills: ['Nmap (Port Scanning)', 'Wireshark (Packet Analysis)', 'Burp Suite (Web Proxy)', 'Metasploit Framework', 'OWASP Top 10 Frameworks']
    },
    {
      title: 'Systems & Platforms',
      icon: 'fas fa-laptop-code',
      skills: ['Kali Linux OS', 'Windows Environment', 'Git & GitHub Version Control', 'VS Code Studio']
    },
    {
      title: 'Networking & Infrastructure',
      icon: 'fas fa-network-wired',
      skills: ['TCP/IP Stack', 'Firewall Policies', 'VPN Configuration', 'Subnetting & Network Protocols']
    },
    {
      title: 'Languages & Tech',
      icon: 'fas fa-code',
      skills: ['Python Scripting', 'Bash Shell Scripting', 'Java (Core Concepts)', 'Flask Framework', 'MySQL Relational Database']
    }
  ];

  return (
    <AnimatedSection id="skills" className="py-20 relative bg-slate-950/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white font-display">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-slate-400 mt-3">
            A comprehensive overview of tools, environments, protocols, and security practices in my toolkit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              whileHover={{ y: -3 }}
              className="hex-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400">
                    <i className={category.icon} />
                  </div>
                  <h3 className="font-semibold text-white font-display text-base">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800/80 text-slate-300 text-xs font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Certifications & Trainings
const Certifications = () => {
  const certifications = [
    {
      name: 'Certified Ethical Hacker (CEH v13)',
      issuer: 'EC-Council',
      desc: 'Industry standard certification mapping offensive security methodologies and reconnaissance workflows.',
      icon: 'fas fa-user-ninja',
      highlight: true
    },
    {
      name: 'Cyber Security & Ethical Hacking',
      issuer: 'Parul University',
      desc: 'Academic and hands-on core foundation training mapping penetration testing paradigms.',
      icon: 'fas fa-certificate',
      highlight: false
    },
    {
      name: 'Certified Social Engineering Defence Practitioner (CSEDP)',
      issuer: 'The SecOps Group',
      desc: 'Focus on social engineering vectors, defense countermeasures, and training defense paradigms.',
      icon: 'fas fa-people-arrows',
      highlight: false
    },
    {
      name: 'Computer Network & Internet Protocol',
      issuer: 'NPTEL',
      desc: 'In-depth academic module mapping network stacks, IP routing, subnetting, and communications protocols.',
      icon: 'fas fa-globe',
      highlight: false
    },
    {
      name: 'ICS/SCADA Cybersecurity',
      issuer: 'Red Team Leaders',
      desc: 'Fundamental security controls mapping industrial operations networks and infrastructure controls.',
      icon: 'fas fa-industry',
      highlight: false
    },
    {
      name: 'Certified Online Fraud Prevention Specialist (COFPS)',
      issuer: 'Security Operations Group',
      desc: 'Mapping digital fraud models, indicators of compromise, and systematic prevention countermeasures.',
      icon: 'fas fa-fingerprint',
      highlight: false
    }
  ];

  return (
    <AnimatedSection id="certifications" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white font-display">
            Credentials & <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-slate-400 mt-3">
            Professional validations detailing cybersecurity fundamentals, network topologies, and ethical hacking methodologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <motion.div
              key={cert.name}
              whileHover={{ y: -2 }}
              className={`hex-card p-6 flex items-start gap-4 ${
                cert.highlight ? 'border-teal-500/30 bg-teal-950/5' : 'bg-slate-900/20'
              }`}
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-lg ${
                cert.highlight ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}>
                <i className={cert.icon} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {cert.name}
                  </h3>
                  {cert.highlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-teal-500/15 text-teal-400 uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-teal-400 font-mono">{cert.issuer}</p>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  {cert.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TryHackMe Spotlight */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-950/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-teal-400 uppercase">
                Active Cybersecurity Labs Profile
              </span>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
                <i className="fas fa-bug text-teal-400" />
                TryHackMe Practical Training
              </h3>
              <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
                Ranked in the <strong className="text-white font-semibold">Top 20% globally</strong>. Practical challenges and cyber range scenarios completed across network enumeration, system exploitation, web security vulnerability audits, and privileges escalation techniques.
              </p>
            </div>
            <a 
              href="https://tryhackme.com/" 
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-mono font-semibold tracking-wider text-center shrink-0"
            >
              TRYHACKME PROFILE
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Projects Section
const Projects = () => {
  const projects = [
    {
      title: 'Cyber Plus',
      subtitle: 'Practice Security Dashboard',
      tech: ['MEAN Stack', 'Node.js', 'Express', 'Angular', 'MongoDB', 'AES-256'],
      desc: 'Developed a practice dashboard utility to learn EXIF metadata analysis, basic network intelligence, and secure cryptography. Created modules to analyze metadata, query DNS records, and perform AES-256 encryption.',
      features: [
        'Built raw metadata inspector & cleaner for learning digital privacy concepts.',
        'Implemented basic network modules to query DNS and IP details.',
        'Created an interactive user interface to practice frontend concepts.'
      ],
      icon: 'fas fa-user-shield',
      color: 'border-teal-500/20 hover:border-teal-500/50'
    },
    {
      title: 'Agro Farm',
      subtitle: 'Practice E-Commerce Web App',
      tech: ['Django', 'Python', 'HTML/CSS/JS', 'SQLite', 'Database Design'],
      desc: 'Built a practice e-commerce application to learn web framework integration, relational database design, and user authentication. Features include product cataloging, basic shopping cart logic, and SQLite database storage.',
      features: [
        'Designed relational database schemas to learn data modeling.',
        'Built basic templates to practice responsive layouts.',
        'Learned how session handling and credentials authentication work.'
      ],
      icon: 'fas fa-store',
      color: 'border-blue-500/20 hover:border-blue-500/50'
    }
  ];

  return (
    <AnimatedSection id="projects" className="py-20 relative bg-slate-950/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white font-display">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 mt-3">
            Academic and practice projects demonstrating system basics and security modules.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.title}
              whileHover={{ y: -4 }}
              className={`hex-card p-6 md:p-8 flex flex-col justify-between border ${proj.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-teal-400 text-lg">
                      <i className={proj.icon} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-display text-lg leading-tight">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500">{proj.subtitle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {proj.desc}
                </p>

                <div className="space-y-2.5 mb-6">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    Key Implementations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {proj.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-teal-400 font-mono mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-850">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Education & Contact Information
const Contact = () => {
  return (
    <AnimatedSection id="contact" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Left Column: Education */}
          <div className="md:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display">
              Academic <span className="gradient-text">Background</span>
            </h2>

            <div className="relative border-l border-slate-800/80 pl-6 ml-2 space-y-8 py-2">
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-teal-400 glow" />
                <h3 className="font-semibold text-white text-base leading-snug">
                  Bachelor of Computer Applications (BCA Hons)
                </h3>
                <p className="text-xs text-teal-400 font-mono mt-1">Parul University | Vadodara, India</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  Currently Pursuing
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Details */}
          <div className="md:col-span-6 space-y-6">
            <h2 className="text-2xl font-bold text-white font-display">
              Connect & <span className="gradient-text">Inquiries</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              If you are looking for an entry-level penetration tester, cybersecurity intern, or enthusiastic security learner with solid system security knowledge, let's connect.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
                  <i className="fas fa-envelope" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Email Address</div>
                  <a href="mailto:sachinbabujithakor@gmail.com" className="text-sm font-semibold text-white hover:text-teal-400 transition-colors">
                    sachinbabujithakor@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone contact section removed as requested */}

              <div className="flex justify-start gap-4 pt-2">
                <a
                  href="https://linkedin.com/in/sachin-thakor-a76069340"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in" />
                </a>
                <a
                  href="https://github.com/sachinthakor"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <i className="fab fa-github" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-8 border-t border-slate-800/80 bg-slate-950/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Sachin Thakor</span>
          <span>•</span>
          <span>Aspiring Pentester Portfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Built with React 19 & Tailwind</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <i className="fas fa-shield-halved text-teal-500" /> Secure Connection
          </span>
        </div>
      </div>
    </footer>
  );
};

// Main Application Component
export function App() {
  return (
    <div className="bg-[#080b10] text-slate-300 min-h-screen main-bg overflow-x-hidden select-none">
      {/* Grid pattern overlay */}
      <div className="cyber-grid" />
      
      {/* Dynamic blurred mesh glow */}
      <div className="mesh-gradient" />
      
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      {/* Main sections */}
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Certifications />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Contact />
      <Footer />
    </div>
  );
}
