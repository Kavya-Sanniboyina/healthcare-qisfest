import { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    MessageCircle,
    Camera,
    Eye,
    User,
    Heart,
    Leaf,
    LogOut,
    Settings,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: Home, label: 'Overview', path: '/app' },
        { icon: MessageCircle, label: 'Dhanvantari AI', path: '/chat' },
        { icon: Camera, label: 'Medicine Scanner', path: '/converter' },
        { icon: Eye, label: 'Visual Diagnosis', path: '/diagnosis' },
        { icon: User, label: 'Wellness Portal', path: '/wellness' },
        { icon: Heart, label: 'Devi Arogya', path: '/women' },
        { icon: Leaf, label: 'Herb Garden', path: '/herbs' },
    ];

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarVariants = {
        desktop: { x: 0, opacity: 1, display: 'flex' },
        mobileClosed: { x: '-100%', opacity: 0, display: 'none' },
        mobileOpen: { x: 0, opacity: 1, display: 'flex' }
    };

    return (
        <motion.aside
            initial={false}
            animate={isDesktop ? "desktop" : (isOpen ? "mobileOpen" : "mobileClosed")}
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
                flex-col w-64 h-screen fixed left-0 top-0 z-50 
                bg-background/95 backdrop-blur-xl border-r border-border/50
                lg:flex lg:translate-x-0 lg:opacity-100
                ${isOpen ? 'flex' : 'hidden lg:flex'}
            `}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse-glow">🪷</span>
                    <span className="font-display text-lg font-bold tracking-wide text-foreground">
                        DHANVANTARI
                    </span>
                </div>
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => onClose && onClose()} // Close on mobile when clicked
                        end={item.path === '/app'} // Only match exact /app route for Home
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive
                                ? 'bg-primary/15 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-secondary/30 hover:text-foreground'
                            }
            `}
                    >
                        <item.icon className={`w-5 h-5 transition-colors`} />
                        <span className="text-sm">{item.label}</span>

                        {/* Active Indicator */}
                        <div className="ml-auto w-1 h-1 rounded-full bg-primary opacity-0 group-[.active]:opacity-100" />
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Controls */}
            <div className="p-4 border-t border-border/50 bg-secondary/10">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-all text-sm mb-1"
                >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </button>
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
