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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Dinacharya State
  const [routineItems, setRoutineItems] = useState([
    { id: 1, time: '06:00 AM', task: 'Wake up (Brahma Muhurta)', icon: Sun, status: 'done' },
    { id: 2, time: '06:30 AM', task: 'Oil Pulling & Tongue Scraping', icon: Droplet, status: 'done' },
    { id: 3, time: '07:00 AM', task: 'Yoga - Surya Namaskar', icon: Calendar, status: 'current' },
    { id: 4, time: '08:00 AM', task: 'Light Herbal Breakfast', icon: Coffee, status: 'pending' },
    { id: 5, time: '12:30 PM', task: 'Main Meal (Pitta Time)', icon: Sun, status: 'pending' },
    { id: 6, time: '10:00 PM', task: 'Sleep (Kapha Time)', icon: Moon, status: 'pending' },
  ]);

  const toggleRoutineItem = (id: number) => {
    setRoutineItems(items => items.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
        : item
    ));
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Mock Data
  const scheduleItems = [
    { time: '09:00 AM', title: 'Consultation with Dr. Sharma', type: 'Video Call' },
    { time: '05:00 PM', title: 'Yoga Session', type: 'Live Class' },
  ];

  const reports = [
    { date: '28 Jan 2024', title: 'Prakriti Analysis', type: 'Dosha Report' },
    { date: '15 Jan 2024', title: 'Skin Diagnosis', type: 'AI Scan' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-primary font-medium mb-1 flex items-center gap-2">
            <Sun className="w-4 h-4" /> {greeting()}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            {user?.user_metadata?.name || 'Seeker'}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Your vitality score is increasing. Focus on staying hydrated and maintaining your Pitta balance today.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <div className="glass-card p-4 rounded-xl min-w-[120px]">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Health Score</div>
            <div className="text-3xl font-bold text-primary">84%</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              ▲ 2% this week
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl min-w-[120px]">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Dosha</div>
            <div className="text-3xl font-bold text-saffron">Pitta</div>
            <div className="text-xs text-muted-foreground">Dominant</div>
          </div>
        </motion.div>
      </section>

      {/* In-Page Navigation for Overview/Stats */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-1">
        {['Overview', 'Schedule', 'Reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeTab === tab.toLowerCase()
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
            {/* Daily Routine / Dinacharya */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sacred-gold" />
                    Your Dinacharya
                  </h3>
                  <span className="text-xs text-muted-foreground">Updated based on Pitta Dosha</span>
                </div>

                <div className="space-y-4">
                  {routineItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutineItem(item.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${item.status === 'current'
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-secondary/30 bg-card/30'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${item.status === 'done'
                          ? 'bg-primary text-black'
                          : 'bg-secondary text-primary'
                        }`}>
                        {item.status === 'done' ? <Check className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{item.time}</span>
                          {item.status === 'current' && <span className="text-[10px] bg-primary/20 text-primary px-2 rounded-sm animate-pulse">NOW</span>}
                        </div>
                        <div className={`font-medium ${item.status === 'done' ? 'text-muted-foreground line-through decoration-primary' : 'text-foreground'}`}>
                          {item.task}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Tips or Mini Widgets */}
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-background border border-border/50">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-herbal" />
                    Herb of the Day
                  </h3>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-herbal/20 rounded-full flex items-center justify-center text-4xl mb-4">
                      🌿
                    </div>
                    <h4 className="text-lg font-bold text-primary">Ashwagandha</h4>
                    <p className="text-xs text-muted-foreground mt-2">
                      "Indian Ginseng" - Reduces stress, improves energy levels, and enhances concentration.
                    </p>
                    <button
                      onClick={() => navigate('/herbs')}
                      className="mt-4 w-full py-2 bg-herbal/10 text-herbal hover:bg-herbal/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : activeTab === 'schedule' ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-8 rounded-2xl min-h-[500px]"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-display">Your Schedule</h2>
              <button className="btn-sacred text-sm px-4 py-2">Add Appointment</button>
            </div>

            <div className="space-y-4">
              {scheduleItems.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col items-center justify-center bg-secondary/30 w-24 rounded-lg">
                    <span className="text-xs text-muted-foreground font-bold">{item.time.split(' ')[1]}</span>
                    <span className="text-lg font-bold">{item.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-primary text-sm">{item.type}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 p-4 border border-dashed border-border rounded-xl justify-center items-center h-32 text-muted-foreground">
                No more events for today. Time for rest.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-8 rounded-2xl min-h-[500px]"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-display">Medical Reports</h2>
              <button className="btn-glass text-sm px-4 py-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Upload New</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, i) => (
                <div key={i} className="p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">{report.title}</h3>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.type}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
