import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            {/* Sidebar - Desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">

                {/* Top Header - Sticky */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 h-16 flex items-center justify-between px-4 lg:px-8">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Title / Breadcrumb Placeholder (Hidden on mobile if needed) */}
                    <div className="hidden md:block font-display text-sm text-muted-foreground">
                        Recall the nature of your spirit.
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Profile Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-saffron flex items-center justify-center text-xs font-bold text-white border-2 border-background cursor-pointer">
                            {user?.user_metadata?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Mobile Sidebar Overlay would go here if we implemented full mobile drawer */}

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
