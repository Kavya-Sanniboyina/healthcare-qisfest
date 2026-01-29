import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    MessageCircle,
    Camera,
    Eye,
    User,
    Heart,
    Leaf,
    LogOut,
    Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Overview', path: '/app' },
        { icon: MessageCircle, label: 'Dhanvantari AI', path: '/chat' },
        { icon: Camera, label: 'Medicine Scanner', path: '/converter' },
        { icon: Eye, label: 'Visual Diagnosis', path: '/diagnosis' },
        { icon: User, label: 'Wellness Portal', path: '/wellness' },
        { icon: Heart, label: 'Devi Arogya', path: '/women' },
        { icon: Leaf, label: 'Herb Garden', path: '/herbs' },
    ];

    return (
        <motion.aside
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-50 bg-background/95 backdrop-blur-xl border-r border-border/50"
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50">
                <span className="text-2xl animate-pulse-glow">🪷</span>
                <span className="font-display text-lg font-bold tracking-wide text-foreground">
                    DHANVANTARI
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
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
                <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-all text-sm mb-1">
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
