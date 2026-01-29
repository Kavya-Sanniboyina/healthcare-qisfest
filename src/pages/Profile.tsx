import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Camera,
    Activity,
    Calendar,
    FileText
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || 'Aditi Sharma',
        email: user?.email || 'aditi@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        bio: 'Yoga practitioner and Ayurveda enthusiast seeking holistic wellness.'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically update the user profile in Supabase
        console.log('Saving profile:', formData);
    };

    return (
        <div className="w-full space-y-8 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and health records</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`btn-sacred flex items-center gap-2 ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                    {isEditing ? <Save className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ID Card / Left Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 xl:col-span-3 space-y-6"
                >
                    <div className="glass-card p-6 rounded-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-saffron/20 to-primary/20 -z-10" />

                        <div className="relative inline-block mb-4 mt-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-primary to-saffron flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    formData.name[0]?.toUpperCase()
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-foreground text-background rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold mb-1">{formData.name}</h2>
                        <div className="text-sm text-primary font-medium mb-4">Ayurveda Seeker</div>

                        <div className="flex gap-2 justify-center">
                            <div className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium">Waitlist: #1204</div>
                            <div className="px-3 py-1 bg-saffron/10 text-saffron rounded-full text-xs font-medium">Premium</div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            Vital Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Dosha</span>
                                <span className="font-medium text-saffron">Pitta-Kapha</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">BMI</span>
                                <span className="font-medium">22.4</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Streak</span>
                                <span className="font-medium text-green-500">12 Days</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Form / Right Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-8 xl:col-span-9 space-y-6"
                >
                    <div className="glass-card p-8 rounded-2xl">
                        <h3 className="text-lg font-bold mb-6">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/20 border border-transparent focus:bg-background focus:border-primary/50 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={true} // Email usually not editable directly
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/20 border border-transparent outline-none disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/20 border border-transparent focus:bg-background focus:border-primary/50 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/20 border border-transparent focus:bg-background focus:border-primary/50 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Bio</label>
                                <textarea
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full p-4 rounded-lg bg-secondary/20 border border-transparent focus:bg-background focus:border-primary/50 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Appointments</h4>
                                    <p className="text-xs text-muted-foreground">2 upcoming</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Medical Records</h4>
                                    <p className="text-xs text-muted-foreground">5 documents</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
