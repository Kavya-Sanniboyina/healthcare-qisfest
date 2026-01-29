import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Coffee,
  Check,
  Droplet,
  Sparkles,
  Calendar,
  Leaf,
  FileText,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Empty states for now
  const [routineItems, setRoutineItems] = useState<any[]>([]);
  const scheduleItems: any[] = [];
  const reports: any[] = [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="w-full space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-primary font-medium mb-1 flex items-center gap-2">
            <Sun className="w-4 h-4" /> {greeting()}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {user?.user_metadata?.name || 'Seeker'}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-lg">
            Your personal Ayurvedic journey awaits.
          </p>
        </motion.div>
      </section>

      {/* In-Page Navigation for Overview/Stats */}
      <div className="flex items-center gap-6 border-b border-border/50 pb-1">
        {['Overview', 'Schedule', 'Reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-2 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.toLowerCase()
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Empty State for Dinacharya */}
              <div className="lg:col-span-2 glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center min-h-[400px] border border-dashed border-border/50 bg-secondary/5">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Routine Set</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  Your daily rhythm (Dinacharya) is key to balance. Start by adding your first daily habit.
                </p>
                <button className="btn-sacred px-8 py-3 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create My Routine
                </button>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-secondary/50 to-background border border-border/50 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="font-display text-xl font-bold mb-4">Discover Herbs</h3>
                  <div className="w-24 h-24 mx-auto bg-herbal/10 rounded-full flex items-center justify-center text-5xl mb-6">
                    🌿
                  </div>
                  <p className="text-muted-foreground mb-6">Explore our extensive library of medicinal plants.</p>
                  <button
                    onClick={() => navigate('/herbs')}
                    className="btn-glass w-full"
                  >
                    Visit Garden
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'schedule' ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-12 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Appointments</h3>
            <p className="text-muted-foreground">You have no upcoming consultations scheduled.</p>
            <button className="btn-sacred mt-6">Book Consultation</button>
          </motion.div>
        ) : (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-12 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Medical Reports</h3>
            <p className="text-muted-foreground">Upload your reports to get AI insights.</p>
            <button className="btn-glass mt-6 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Upload Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
