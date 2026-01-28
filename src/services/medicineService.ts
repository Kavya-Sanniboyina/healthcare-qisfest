import { supabase } from '@/integrations/supabase/client';

export interface MedicineData {
  id: string;
  english_name: string;
  generic_name: string;
  category: string;
  composition: string;
  uses: string[];
  causes: string[];
  warnings: string[];
  ayurvedic_alternatives: {
    internal: string[];
    external: string[];
    lifestyle: string[];
    herbs: string[];
  };
  home_remedies: string[];
  has_ayurvedic_remedy: boolean;
  created_at?: string;
}

/**
 * Search for medicine by name in the database
 * Returns medicine data with Ayurvedic alternatives if available
 */
export async function searchMedicine(medicineName: string): Promise<MedicineData | null> {
  try {
    const searchTerm = medicineName.toLowerCase().trim();
    
    // Query Supabase for matching medicine
    const { data, error } = await (supabase as any)
      .from('medicines')
      .select('*')
      .ilike('english_name', `%${searchTerm}%`)
      .limit(1)
      .single();
    
    if (error) {
      // PGRST116 = no rows returned, which is fine
      if (error.code !== 'PGRST116') {
        console.error('Database error:', error);
      }
      return null;
    }
    
    return (data as MedicineData) || null;
  } catch (error) {
    console.error('Error searching medicine:', error);
    return null;
  }
}

/**
 * Get all medicines from database (for reference)
 */
export async function getAllMedicines(limit = 100): Promise<MedicineData[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('medicines')
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching medicines:', error);
      return [];
    }
    
    return (data as MedicineData[]) || [];
  } catch (error) {
    console.error('Error in getAllMedicines:', error);
    return [];
  }
}

/**
 * Get medicines by category
 */
export async function getMedicinesByCategory(category: string): Promise<MedicineData[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('medicines')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error('Error fetching medicines by category:', error);
      return [];
    }
    
    return (data as MedicineData[]) || [];
  } catch (error) {
    console.error('Error in getMedicinesByCategory:', error);
    return [];
  }
}

/**
 * Get Ayurvedic alternatives for a medicine
 * Returns null if no Ayurvedic remedy is available
 */
export async function getAyurvedicAlternatives(medicineName: string): Promise<{
  medicine: MedicineData | null;
  hasAlternatives: boolean;
  message?: string;
} | null> {
  try {
    const medicine = await searchMedicine(medicineName);
    
    if (!medicine) {
      return {
        medicine: null,
        hasAlternatives: false,
        message: `❌ Medicine "${medicineName}" not found in our database. Please try another medicine or search by generic name.`
      };
    }
    
    if (!medicine.has_ayurvedic_remedy) {
      return {
        medicine,
        hasAlternatives: false,
        message: `⚠️ Unfortunately, we don't have Ayurvedic alternatives for "${medicine.english_name}" in our database yet. Please consult with a qualified Vaidya (Ayurvedic practitioner). This medicine may not have suitable Ayurvedic substitutes.`
      };
    }
    
    return {
      medicine,
      hasAlternatives: true,
      message: `✅ Found Ayurvedic alternatives for "${medicine.english_name}"`
    };
  } catch (error) {
    console.error('Error getting Ayurvedic alternatives:', error);
    return null;
  }
}

/**
 * Subscribe to real-time updates for a specific medicine
 */
export function subscribeToMedicineUpdates(
  callback: (medicine: MedicineData) => void
): (() => void) {
  const subscription = (supabase as any)
    .channel('medicines')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'medicines',
      },
      (payload: any) => {
        console.log('Medicine update:', payload);
        if (payload.new) {
          callback(payload.new as MedicineData);
        }
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    (supabase as any).removeChannel(subscription);
  };
}
