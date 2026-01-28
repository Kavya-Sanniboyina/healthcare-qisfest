import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Coffee, Utensils, Cookie } from 'lucide-react';

interface DietChartProps {
  dosha: 'vata' | 'pitta' | 'kapha';
}

const DIET_PLANS = {
  vata: {
    title: 'Vata-Balancing Diet',
    description: 'Warm, moist, grounding foods to calm the airy Vata constitution',
    meals: {
      morning: {
        time: '6:00 - 7:00 AM',
        items: ['Warm water with lemon', 'Soaked almonds (5-7)'],
        ritual: 'Oil pulling with sesame oil',
      },
      breakfast: {
        time: '7:30 - 8:30 AM',
        items: ['Warm oatmeal with ghee & cinnamon', 'Stewed apples or pears', 'Warm milk with turmeric'],
        ritual: 'Eat slowly in a calm environment',
      },
      lunch: {
        time: '12:00 - 1:00 PM',
        items: ['Basmati rice with ghee', 'Moong dal with cumin', 'Steamed vegetables (carrots, beets)', 'Buttermilk'],
        ritual: 'Main meal of the day - eat until satisfied',
      },
      snack: {
        time: '4:00 - 5:00 PM',
        items: ['Warm spiced milk', 'Dates with ghee', 'Roasted nuts'],
        ritual: 'Light, nourishing snack',
      },
      dinner: {
        time: '6:30 - 7:30 PM',
        items: ['Khichdi with vegetables', 'Warm soup', 'Chapati with ghee'],
        ritual: 'Light dinner, 2-3 hours before sleep',
      },
    },
    avoid: ['Raw salads', 'Cold drinks', 'Dry crackers', 'Caffeine', 'Frozen foods'],
    favor: ['Ghee', 'Warm soups', 'Root vegetables', 'Sweet fruits', 'Warm spices'],
  },
  pitta: {
    title: 'Pitta-Cooling Diet',
    description: 'Cool, refreshing foods to balance the fiery Pitta constitution',
    meals: {
      morning: {
        time: '5:30 - 6:30 AM',
        items: ['Room temperature water with rose water', 'Soaked raisins'],
        ritual: 'Avoid coffee, opt for cooling drinks',
      },
      breakfast: {
        time: '7:00 - 8:00 AM',
        items: ['Sweet fruits (melons, grapes)', 'Coconut water', 'Light porridge with cardamom'],
        ritual: 'Eat in a peaceful setting',
      },
      lunch: {
        time: '12:00 - 1:00 PM',
        items: ['Basmati rice', 'Mung beans with coriander', 'Cucumber raita', 'Leafy greens'],
        ritual: 'Largest meal when digestive fire is strong',
      },
      snack: {
        time: '3:00 - 4:00 PM',
        items: ['Fresh sweet fruits', 'Coconut pieces', 'Mint tea'],
        ritual: 'Cooling, not too heavy',
      },
      dinner: {
        time: '6:00 - 7:00 PM',
        items: ['Steamed vegetables', 'Light dal', 'Chapati', 'Salad with cooling herbs'],
        ritual: 'Moderate portion, easy to digest',
      },
    },
    avoid: ['Spicy food', 'Fermented items', 'Sour fruits', 'Red meat', 'Alcohol'],
    favor: ['Cucumber', 'Coconut', 'Coriander', 'Mint', 'Sweet fruits', 'Ghee'],
  },
  kapha: {
    title: 'Kapha-Stimulating Diet',
    description: 'Light, warm, spicy foods to energize the earthy Kapha constitution',
    meals: {
      morning: {
        time: '6:00 AM',
        items: ['Warm water with honey & ginger', 'Light exercise before eating'],
        ritual: 'Can skip breakfast if not hungry',
      },
      breakfast: {
        time: '8:00 - 9:00 AM',
        items: ['Light poha with vegetables', 'Herbal tea with ginger', 'Apple or pear'],
        ritual: 'Light and warming, only if hungry',
      },
      lunch: {
        time: '11:30 AM - 12:30 PM',
        items: ['Millet or barley', 'Spiced vegetables', 'Light lentils with turmeric', 'Bitter greens'],
        ritual: 'Main meal of the day',
      },
      snack: {
        time: '4:00 PM',
        items: ['Raw vegetables', 'Green tea', 'Light seeds'],
        ritual: 'Optional, only if truly hungry',
      },
      dinner: {
        time: '6:00 - 6:30 PM',
        items: ['Vegetable soup', 'Steamed vegetables with spices', 'Very light grains'],
        ritual: 'Smallest meal, early evening',
      },
    },
    avoid: ['Dairy', 'Sweets', 'Oily/fried foods', 'Heavy grains', 'Cold drinks'],
    favor: ['Ginger', 'Black pepper', 'Honey', 'Light grains', 'Spicy foods', 'Bitter vegetables'],
  },
};

const DietChart = ({ dosha }: DietChartProps) => {
  const plan = DIET_PLANS[dosha];

  const mealIcons = {
    morning: Sun,
    breakfast: Coffee,
    lunch: Utensils,
    snack: Cookie,
    dinner: Moon,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl text-foreground">{plan.title}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      {/* Daily Meals */}
      <div className="space-y-4">
        {Object.entries(plan.meals).map(([key, meal], index) => {
          const Icon = mealIcons[key as keyof typeof mealIcons];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/20 to-sacred-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-saffron" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground capitalize">{key}</h4>
                    <span className="text-xs text-muted-foreground">{meal.time}</span>
                  </div>
                  <ul className="text-sm text-foreground space-y-1 mb-2">
                    {meal.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-herbal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground italic">✨ {meal.ritual}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Favor & Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-herbal/10 border border-herbal/20">
          <h4 className="font-medium text-herbal mb-2">✓ Foods to Favor</h4>
          <div className="flex flex-wrap gap-2">
            {plan.favor.map((item, i) => (
              <span key={i} className="text-xs bg-herbal/20 text-herbal px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <h4 className="font-medium text-destructive mb-2">✗ Foods to Avoid</h4>
          <div className="flex flex-wrap gap-2">
            {plan.avoid.map((item, i) => (
              <span key={i} className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietChart;
