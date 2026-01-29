import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Reset state when modal opens
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name,
                        },
                    },
                });
                if (error) throw error;
                // Check if email confirmation is required - user might not be logged in immediately
                // Typically Supabase returns a session if email confirmation is disabled found in settings
                // If enabled, we might need to tell user to check email.
                // For this app, let's assume we can proceed or show a message.
                // However, usually we just want to execute post-signup logic.
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
            }

            onClose();
            navigate('/app');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const socialLogin = async (provider: 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden glass-card border border-white/20"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="text-4xl mb-4">🪷</div>
                                <h2 className="font-display text-2xl font-bold text-foreground">
                                    {mode === 'login' ? 'Welcome Back' : 'Join Dhanvantari'}
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    {mode === 'login'
                                        ? 'Sign in to continue your wellness journey'
                                        : 'Start your personalized Ayurvedic path today'}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 flex items-start gap-3 text-sm text-destructive"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="input-sacred pl-10"
                                                placeholder="John Doe"
                                                required={mode === 'signup'}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="input-sacred pl-10"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="input-sacred pl-10"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-sacred flex items-center justify-center gap-2 mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {mode === 'login' ? 'Signing in...' : 'Creating Account...'}
                                        </>
                                    ) : (
                                        mode === 'login' ? 'Sign In' : 'Create Account'
                                    )}
                                </button>

                                {/* Optional Social Login Divider */}
                                {/* <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div> */}
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <p className="text-muted-foreground">
                                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-primary font-medium hover:underline focus:outline-none"
                                    >
                                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
