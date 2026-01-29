import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Lock,
    Eye,
    Moon,
    Smartphone,
    Languages,
    HelpCircle,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    User,
    Shield,
    Globe
} from 'lucide-react';

const Settings = () => {
    // Mock settings state
    const [settings, setSettings] = useState({
        notifications: true,
        emailUpdates: false,
        darkMode: false,
        publicProfile: true,
        dataSharing: false,
        language: 'English'
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingSection = ({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card rounded-2xl overflow-hidden flex flex-col ${className}`}
        >
            <div className="px-6 py-4 border-b border-border/50 bg-secondary/5 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="p-2 flex-1 flex flex-col justify-center">
                {children}
            </div>
        </motion.div>
    );

    const SettingItem = ({
        icon: Icon,
        label,
        desc,
        action
    }: {
        icon: any,
        label: string,
        desc?: string,
        action: React.ReactNode
    }) => (
        <div className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-foreground/70">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-medium text-sm md:text-base">{label}</h4>
                    {desc && <p className="text-xs text-muted-foreground line-clamp-1">{desc}</p>}
                </div>
            </div>
            <div className="shrink-0 ml-4">
                {action}
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your preferences and application controls</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-glass text-sm">Reset Defaults</button>
                    <button className="btn-sacred text-sm">Save Changes</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SettingSection title="Appearance" icon={Eye}>
                    <SettingItem
                        icon={Moon}
                        label="Dark Mode"
                        desc="Adjust appearance for low light"
                        action={
                            <button onClick={() => toggle('darkMode')} className={`text-2xl transition-colors ${settings.darkMode ? 'text-primary' : 'text-muted-foreground'}`}>
                                {settings.darkMode ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Languages}
                        label="Language"
                        desc="Select your preferred language"
                        action={
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/30 px-3 py-1.5 rounded-lg transition-colors">
                                {settings.language} <ChevronRight className="w-3 h-3" />
                            </button>
                        }
                    />
                </SettingSection>

                <SettingSection title="Notifications" icon={Bell}>
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        desc="Daily health tips & reminders"
                        action={
                            <button onClick={() => toggle('notifications')} className={`text-2xl transition-colors ${settings.notifications ? 'text-primary' : 'text-muted-foreground'}`}>
                                {settings.notifications ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Smartphone}
                        label="Email Updates"
                        desc="Weekly digest of progress"
                        action={
                            <button onClick={() => toggle('emailUpdates')} className={`text-2xl transition-colors ${settings.emailUpdates ? 'text-primary' : 'text-muted-foreground'}`}>
                                {settings.emailUpdates ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        }
                    />
                </SettingSection>

                <SettingSection title="Privacy" icon={Shield}>
                    <SettingItem
                        icon={Lock}
                        label="Change Password"
                        desc="Update security credentials"
                        action={
                            <button className="p-2 hover:bg-secondary/50 rounded-full text-muted-foreground">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Globe}
                        label="Public Profile"
                        desc="Allow others to see progress"
                        action={
                            <button onClick={() => toggle('publicProfile')} className={`text-2xl transition-colors ${settings.publicProfile ? 'text-primary' : 'text-muted-foreground'}`}>
                                {settings.publicProfile ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        }
                    />
                </SettingSection>

                <SettingSection title="Account" icon={User} className="md:col-span-2 xl:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingItem
                            icon={User}
                            label="Profile Information"
                            desc="Update your name and bio"
                            action={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
                        />
                        <SettingItem
                            icon={Lock}
                            label="Two-Factor Auth"
                            desc="Add an extra layer of security"
                            action={<div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Enabled</div>}
                        />
                    </div>
                </SettingSection>

                <SettingSection title="Support" icon={HelpCircle}>
                    <SettingItem
                        icon={HelpCircle}
                        label="Help Center"
                        desc="FAQs and support articles"
                        action={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
                    />
                    <div className="mt-auto pt-4 text-center border-t border-border/30">
                        <p className="text-xs text-muted-foreground">Version 1.2.0 • Build 2024.01.29</p>
                    </div>
                </SettingSection>
            </div>
        </div>
    );
};

export default Settings;
