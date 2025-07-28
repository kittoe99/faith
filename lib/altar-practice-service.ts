import { supabase } from './supabaseClient'
import { AltarPractice, CreateAltarPracticeInput, UpdateAltarPracticeInput } from '../types/altar.types'

/* -------------------------------------------------------------------------- */
/*                         Altar Practice Service                             */
/* -------------------------------------------------------------------------- */

/**
 * Service for managing altar practices in Supabase
 */
export const AltarPracticeService = {
  /**
   * Get all altar practices for the current user
   */
  async getAltarPractices(): Promise<AltarPractice[]> {
    const { data, error } = await supabase
      .from('altar_practices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching altar practices:', error)
      throw new Error(error.message)
    }

    return data || []
  },

  /**
   * Create a new altar practice
   */
  async createAltarPractice(input: CreateAltarPracticeInput): Promise<AltarPractice> {
    // Try to get signed-in user (may be null for anonymous submissions)
    const { data: { user } } = await supabase.auth.getUser()

    const purpose = input.purpose

    const { data, error } = await supabase
      .from('altar_practices')
      .insert([
        {
          user_id: user?.id,
          name: input.name,
          type: input.type,
          purpose: purpose,
          practices: input.practices,
          sacrifices: input.sacrifices,
          custom_items: input.custom_items
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating altar practice:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Update an existing altar practice
   */
  async updateAltarPractice(id: string, input: UpdateAltarPracticeInput): Promise<AltarPractice> {
    const { data, error } = await supabase
      .from('altar_practices')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating altar practice:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Delete an altar practice
   */
  async deleteAltarPractice(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('altar_practices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting altar practice:', error)
      throw new Error(error.message)
    }

    return true
  }
}
