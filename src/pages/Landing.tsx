import { motion } from 'framer-motion';
import {
    Leaf,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Activity,
    Zap,
    Flower
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthModal from '../components/AuthModal';


const Landing = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && (location.state as any).openAuth) {
            setIsAuthModalOpen(true);
            setAuthMode('login');
        }
    }, [location]);

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-nature leaf-pattern overflow-hidden">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-md">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-3xl"
                        >
                            🪷
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="font-display text-xl font-bold text-foreground tracking-wide">DHANVANTARI</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Digital Ayurveda</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <button onClick={() => openAuth('login')} className="hover:text-primary transition-colors">Sign In</button>
                    </div>

                    <button
                        onClick={() => openAuth('signup')}
                        className="btn-sacred flex items-center gap-2 text-sm font-semibold px-6 py-3"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-saffron/10 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 border-primary/20">
                                    <Sparkles className="w-4 h-4 text-sacred-gold" />
                                    <span className="text-sm font-medium text-primary">
                                        AI-Powered Ancient Wisdom
                                    </span>
                                </div>

                                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                                    Reclaim Your
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-saffron to-sacred-gold pb-2">
                                        Vitality Naturally
                                    </span>
                                </h1>

                                <p className="font-sacred text-xl text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
                                    Experience the perfect synergy of traditional Ayurveda and modern AI.
                                    Personalized wellness plans, instant diagnosis, and herbal wisdom at your fingertips.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                    <button
                                        onClick={() => openAuth('signup')}
                                        className="btn-sacred text-lg px-8 py-4 w-full sm:w-auto"
                                    >
                                        Start Your Journey
                                    </button>
                                    <button className="btn-glass text-lg px-8 py-4 w-full sm:w-auto text-foreground/80 hover:text-foreground">
                                        Watch Demo
                                    </button>
                                </div>

                                <div className="mt-12 flex items-center justify-center md:justify-start gap-8 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-herbal" />
                                        <span>Verified Experts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-saffron" />
                                        <span>Instant Results</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-5 h-5 text-herbal-dark" />
                                        <span>100% Natural</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex-1 w-full max-w-lg md:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-saffron rounded-full blur-3xl opacity-20 animate-pulse-glow" />
                                <div className="glass-card p-2 rounded-3xl md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                    {/* Placeholder for a Dashboard Preview or Illustration */}
                                    <div className="aspect-[4/3] rounded-2xl bg-gradient-nature overflow-hidden relative group">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl">🌿</span>
                                        </div>

                                        {/* Floating Cards simulating UI */}
                                        <motion.div
                                            animate={{ y: [-10, 10, -10] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-4 right-4 glass-card p-4 flex items-center gap-3 w-48"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-saffron" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Dosha Balance</div>
                                                <div className="text-sm font-bold">Vata-Pitta</div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            animate={{ y: [10, -10, 10] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                            className="absolute bottom-6 left-4 glass-card p-4 flex items-center gap-3 w-56"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-herbal/20 flex items-center justify-center">
                                                <Flower className="w-5 h-5 text-herbal" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Recommended Herb</div>
                                                <div className="text-sm font-bold">Ashwagandha</div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Holistic Features</h2>
                        <div className="h-1 w-20 bg-saffron mx-auto rounded-full mb-6" />
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sacred">
                            Comprehensive tools designed to align your body, mind, and spirit using ancient Ayurvedic principles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🧘‍♀️"
                            title="Personalized Wellness"
                            desc="Get tailored yoga and diet plans based on your unique Dosha profile (Vata, Pitta, Kapha)."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon="👁️"
                            title="Visual Diagnosis"
                            desc="Cutting-edge AI analyzes your skin, tongue, and eyes to detect potential health imbalances."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon="🍶"
                            title="Herbal Wisdom"
                            desc="Explore our vast library of medicinal herbs with 3D models and detailed usage guides."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Dhanvantari Section */}
            <section className="py-24 bg-gradient-to-b from-transparent to-saffron/10 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="font-display text-4xl font-bold leading-tight">
                                Where Ancient Wisdom Meets <span className="text-primary">Modern Science</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-sacred leading-relaxed">
                                Dhanvantari bridges the gap between the 5,000-year-old tradition of Ayurveda and cutting-edge artificial intelligence. We don't just digitize texts; we bring the holistic healing experience to your pocket.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Precision Diagnosis", desc: "AI trained on over 50,000 Ayurvedic clinical datasets for accurate constitution analysis." },
                                    { title: "Visual Recognition", desc: "Identify 300+ medicinal herbs instantly using your camera." },
                                    { title: "Personalized Plans", desc: "Diet and yoga routines dynamically adjusted to your current Dosha imbalance." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
                                            <span className="text-2xl">✨</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-herbal rounded-full blur-3xl opacity-20" />
                            <div className="glass-card p-8 rounded-3xl relative z-10 border-t border-white/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 bg-white/50 rounded-2xl p-6 text-center">
                                        <div className="text-4xl font-bold text-herbal-dark mb-2">98%</div>
                                        <div className="text-sm text-muted-foreground">User Satisfaction Rate</div>
                                    </div>
                                    <div className="bg-white/50 rounded-2xl p-6 text-center">
                                        <div className="text-3xl font-bold text-saffron mb-2">12+</div>
                                        <div className="text-xs text-muted-foreground">Languages Supported</div>
                                    </div>
                                    <div className="bg-white/50 rounded-2xl p-6 text-center">
                                        <div className="text-3xl font-bold text-lotus mb-2">24/7</div>
                                        <div className="text-xs text-muted-foreground">AI Health Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="works" className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Your Path to Wellness</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Three simple steps to unlock your body's natural healing potential.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                        {[
                            { step: "01", title: "Discover Your Dosha", desc: "Take our AI-guided assessment to understand your unique body constitution (Vata, Pitta, Kapha)." },
                            { step: "02", title: "Get Your Plan", desc: "Receive a personalized daily routine including specific yoga asanas, diet charts, and herbal recommendations." },
                            { step: "03", title: "Track & Heal", desc: "Monitor your progress, log your daily habits, and watch your vitality return naturally." }
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="text-center bg-background/50 backdrop-blur-sm p-6 rounded-2xl"
                            >
                                <div className="w-24 h-24 rounded-full bg-glass-bg border border-white/50 shadow-lg flex items-center justify-center mx-auto mb-6 text-2xl font-display font-bold text-primary relative z-10">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Experts Section */}
            <section className="py-24 bg-gradient-to-br from-background to-sage-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 border-herbal/20">
                            <ShieldCheck className="w-4 h-4 text-herbal" />
                            <span className="text-sm font-medium text-herbal-dark">
                                Medical Advisory Board
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Guided by Masters</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our AI is trained and validated by leading Ayurvedic practitioners and integrative medicine doctors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Aruna Rao", title: "B.A.M.S, MD (Ayurveda)", exp: "20+ Years Experience", img: "👩‍⚕️" },
                            { name: "Dr. Rajesh Kumar", title: "Nadi Pariksha Expert", exp: "15,000+ Consultations", img: "👨‍⚕️" },
                            { name: "Dr. Sarah Jenkins", title: "Integrative Medicine", exp: "Bridging East & West", img: "👩‍🔬" }
                        ].map((expert, i) => (
                            <motion.div
                                key={expert.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="glass-card p-6 rounded-2xl text-center border-t-4 border-t-herbal group hover:shadow-xl transition-all"
                            >
                                <div className="w-24 h-24 mx-auto bg-sage-100 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {expert.img}
                                </div>
                                <h3 className="font-bold text-xl mb-1">{expert.name}</h3>
                                <div className="text-sm text-primary font-medium mb-3">{expert.title}</div>
                                <div className="text-xs text-muted-foreground bg-secondary/50 py-1 px-3 rounded-full inline-block">
                                    {expert.exp}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifestyle Benefits Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-saffron/5 skew-x-12 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="font-display text-4xl font-bold mb-6">Not Just an App, <br />A Way of Life</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Ayurveda is not about quick fixes; it's about sustainable balance. Dhanvantari helps you integrate these timeless habits into your modern schedule.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Dinacharya", desc: "Daily routines synced with your circadian rhythm." },
                                    { title: "Ritucharya", desc: "Seasonal guidance to prevent imbalances." },
                                    { title: "Sattvic Diet", desc: "Pure, energy-boosting nutrition plans." },
                                    { title: "Mindfulness", desc: "Meditation tracks for mental clarity." }
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-saffron flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="glass-card p-2 rounded-3xl rotate-1 hover:rotate-0 transition-all duration-500">
                                <div className="bg-gradient-to-br from-herbal/20 to-sage-100/50 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                        <Leaf className="w-64 h-64 text-herbal animate-pulse-glow" />
                                    </div>
                                    <div className="text-center relative z-10 p-8">
                                        <h3 className="text-2xl font-bold mb-4">Start Small, <br /> heal Big</h3>
                                        <button
                                            onClick={() => openAuth('signup')}
                                            className="btn-sacred text-sm px-6 py-2"
                                        >
                                            Get Your Daily Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-sage-50/50">
                <div className="container mx-auto px-6">
                    <h2 className="font-display text-3xl font-bold text-center mb-16">Community Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Priya Sharma", role: "Yoga Instructor", quote: "The accuracy of the visual diagnosis blew me away. It correctly identified my Pitta imbalance just from a tongue scan!" },
                            { name: "David Miller", role: "Wellness Enthusiast", quote: "Finally, an app that explains Ayurveda in simple terms. The interactive herb garden is my favorite feature." },
                            { name: "Anjali Gupta", role: "Student", quote: "Dhanvantari's daily routine guide helped me fix my sleep cycle naturally without any medication. Highly recommended!" }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-2xl relative"
                            >
                                <div className="text-4xl text-primary/20 font-serif absolute top-4 left-4">"</div>
                                <p className="text-foreground/80 italic mb-6 relative z-10 pt-4">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-herbal flex items-center justify-center text-white font-bold text-sm">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is the AI diagnosis a replacement for a doctor?", a: "No, Dhanvantari is a wellness assistant. While highly accurate for constitutional analysis, it should not replace professional medical advice for serious conditions." },
                            { q: "Is my health data private?", a: "Absolutely. We follow a strict offline-first and encrypted approach. Your personal health data stays on your device or your private cloud." },
                            { q: "Do I need to know Sanskrit?", a: "Not at all! The app is available in English and 12+ Indian languages, translating all ancient terms into simple, understandable language." },
                            { q: "Is the app free to use?", a: "The core features like Dosha Quiz and Herb Garden are free. Advanced AI diagnosis requires a premium subscription to support server costs, but you can try it for free!" }
                        ].map((faq, i) => (
                            <motion.div
                                key={faq.q}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 rounded-xl hover:bg-white/50 transition-colors"
                            >
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="text-primary">Q.</span> {faq.q}
                                </h4>
                                <p className="text-muted-foreground pl-6">
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-sage-50">
                <div className="container mx-auto px-6">
                    <div className="bg-herbal-dark rounded-3xl p-8 md:p-16 relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="font-display text-3xl font-bold text-white mb-4">Join the Conscious Living Community</h2>
                            <p className="text-white/80 mb-8">
                                Get weekly Ayurvedic tips, seasonal guides, and exclusive wellness resources delivered to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-saffron"
                                />
                                <button className="px-8 py-4 rounded-full bg-saffron text-white font-bold hover:bg-saffron-dark transition-colors">
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-xs text-white/40 mt-4">
                                No spam, just good vibes. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-herbal relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-black/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Begin Your Healing Journey</h2>
                    <p className="text-xl md:text-2xl font-sacred mb-12 opacity-90 max-w-2xl mx-auto">
                        "The natural healing force within each one of us is the greatest force in getting well."
                    </p>
                    <button
                        onClick={() => openAuth('signup')}
                        className="bg-white text-herbal-dark font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-nature pt-16 pb-8 border-t border-border/40">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl">🪷</span>
                                <span className="font-display text-xl font-bold">DHANVANTARI</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm">
                                Empowering your health journey through the timeless wisdom of Ayurveda and the precision of modern technology.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li><Link to="/app" className="hover:text-primary">Dashboard</Link></li>
                                <li><Link to="/diagnosis" className="hover:text-primary">Diagnosis</Link></li>
                                <li><Link to="/herbs" className="hover:text-primary">Herbal Garden</Link></li>
                                <li><Link to="/chat" className="hover:text-primary">Consultation</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li><a href="#" className="hover:text-primary">About Us</a></li>
                                <li><a href="#" className="hover:text-primary">Our Experts</a></li>
                                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Dhanvantari. All rights reserved. 🌿 Om Shanti.</p>
                    </div>
                </div>
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultMode={authMode}
            />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: string, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="glass-card p-8 rounded-2xl hover:translate-y-[-5px] transition-all duration-300 border-t-4 border-t-saffron"
    >
        <div className="text-4xl mb-6 bg-saffron/10 w-16 h-16 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
            {desc}
        </p>
    </motion.div>
);

export default Landing;
