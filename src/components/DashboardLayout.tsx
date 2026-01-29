import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, LogOut, Settings, CreditCard, ExternalLink, Calendar, MessageCircle, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Toggle Search on Ctrl+K / Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Mock Notifications
    const notifications = [
        { id: 1, title: 'Drink Water', desc: 'Time to hydrate for Pitta balance', time: '10m ago', unread: true },
        { id: 2, title: 'Yoga Class', desc: 'Morning session starts in 1 hour', time: '1h ago', unread: true },
        { id: 3, title: 'New Article', desc: 'Understanding Vata Season', time: '1d ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const runCommand = (command: () => void) => {
        setIsSearchOpen(false);
        command();
    }

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            {/* Sidebar - Desktop & Mobile */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

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

                    {/* Search Trigger (Desktop) */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-3 px-4 py-2 bg-secondary/50 hover:bg-secondary/80 rounded-full text-sm text-muted-foreground transition-all w-64 border border-transparent hover:border-primary/20"
                    >
                        <Search className="w-4 h-4" />
                        <span>Search...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4 ml-auto">
                        {/* Search Trigger (Mobile) */}
                        <button
                            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 mr-4" align="end">
                                <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center bg-muted/30">
                                    <h4 className="font-semibold text-sm">Notifications</h4>
                                    <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 ${n.unread ? 'bg-primary/5' : ''}`}>
                                                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" style={{ opacity: n.unread ? 1 : 0 }} />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-2 opacity-70">{n.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-border/50 text-center">
                                    <button className="text-xs text-primary hover:underline">Mark all as read</button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-saffron flex items-center justify-center text-xs font-bold text-white border-2 border-background cursor-pointer hover:shadow-lg transition-shadow">
                                    {user?.user_metadata?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.user_metadata?.name || 'User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Command Search Dialog */}
                <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem onSelect={() => runCommand(() => navigate('/app'))}>
                                <Home className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => navigate('/chat'))}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                <span>Chat with Dhanvantari</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => navigate('/diagnosis'))}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Visual Diagnosis</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandGroup heading="Settings">
                            <CommandItem onSelect={() => runCommand(() => navigate('/profile'))}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden flex flex-col items-stretch w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
