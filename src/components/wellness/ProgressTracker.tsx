import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Flame,
  Droplets,
  Moon,
  Apple,
  Dumbbell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyLog {
  date: string;
  weight?: number;
  water: number;
  sleep: number;
  exercise: boolean;
  meditation: boolean;
  dietFollowed: boolean;
  mood: 1 | 2 | 3 | 4 | 5;
}

interface ProgressTrackerProps {
  programDays: 30 | 90;
  startDate?: Date;
}

// Mock data for demonstration
const generateMockData = (days: number): DailyLog[] => {
  const data: DailyLog[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      weight: 70 - Math.random() * 2 + i * 0.05,
      water: Math.floor(Math.random() * 4) + 4,
      sleep: Math.floor(Math.random() * 3) + 5,
      exercise: Math.random() > 0.3,
      meditation: Math.random() > 0.4,
      dietFollowed: Math.random() > 0.2,
      mood: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
    });
  }
  
  return data;
};

const ProgressTracker = ({ programDays, startDate }: ProgressTrackerProps) => {
  const [logs] = useState<DailyLog[]>(() => generateMockData(Math.min(programDays, 14)));
  
  const currentDay = logs.length;
  const completionPercentage = Math.round((currentDay / programDays) * 100);
  
  // Calculate streaks
  const calculateStreak = (key: keyof DailyLog) => {
    let streak = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i][key]) streak++;
      else break;
    }
    return streak;
  };

  const streaks = {
    exercise: calculateStreak('exercise'),
    meditation: calculateStreak('meditation'),
    diet: calculateStreak('dietFollowed'),
  };

  // Prepare chart data
  const chartData = logs.slice(-7).map(log => ({
    date: new Date(log.date).toLocaleDateString('en', { weekday: 'short' }),
    weight: log.weight?.toFixed(1),
    water: log.water,
    sleep: log.sleep,
    mood: log.mood,
  }));

  const todayLog = logs[logs.length - 1];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-xl text-foreground">Day {currentDay} of {programDays}</h3>
            <p className="text-sm text-muted-foreground">Keep going, you're doing great!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display text-primary">{completionPercentage}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className="h-full bg-gradient-to-r from-saffron to-sacred-gold"
          />
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Exercise', value: streaks.exercise, icon: Dumbbell, color: 'text-saffron' },
          { label: 'Meditation', value: streaks.meditation, icon: Moon, color: 'text-lotus' },
          { label: 'Diet', value: streaks.diet, icon: Apple, color: 'text-herbal' },
        ].map((streak, i) => (
          <motion.div
            key={streak.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-xl text-center"
          >
            <streak.icon className={`w-6 h-6 ${streak.color} mx-auto mb-2`} />
            <p className="text-2xl font-display text-foreground">{streak.value}</p>
            <p className="text-xs text-muted-foreground">{streak.label} Streak</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Checklist */}
      <div className="glass-card p-6 rounded-2xl">
        <h4 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Today's Progress
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Morning Routine', done: true },
            { label: 'Pranayama (15 min)', done: true },
            { label: 'Diet Followed', done: todayLog?.dietFollowed },
            { label: 'Exercise (30 min)', done: todayLog?.exercise },
            { label: 'Meditation', done: todayLog?.meditation },
            { label: 'Early Dinner', done: false },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                item.done ? 'bg-herbal/10' : 'bg-muted/50'
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-herbal" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Progress Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <h4 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weekly Progress
        </h4>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Water Today</span>
          </div>
          <p className="text-2xl font-display text-foreground">
            {todayLog?.water || 0} <span className="text-sm text-muted-foreground">glasses</span>
          </p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-lotus" />
            <span className="text-sm text-muted-foreground">Sleep</span>
          </div>
          <p className="text-2xl font-display text-foreground">
            {todayLog?.sleep || 0} <span className="text-sm text-muted-foreground">hours</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
