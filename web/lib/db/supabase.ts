import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          user_id: string | null
          topic: string
          question_type: '정의형' | '설명형' | '비교형' | '절차형' | '분석형'
          level: 'basic' | 'advanced'
          content: string
          metadata: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          topic: string
          question_type: '정의형' | '설명형' | '비교형' | '절차형' | '분석형'
          level: 'basic' | 'advanced'
          content: string
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          topic?: string
          question_type?: '정의형' | '설명형' | '비교형' | '절차형' | '분석형'
          level?: 'basic' | 'advanced'
          content?: string
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          answer_id: string
          criteria: '첫인상' | '출제반영성' | '논리성' | '응용능력' | '특화' | '견해'
          score: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          criteria: '첫인상' | '출제반영성' | '논리성' | '응용능력' | '특화' | '견해'
          score: number
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          criteria?: '첫인상' | '출제반영성' | '논리성' | '응용능력' | '특화' | '견해'
          score?: number
          feedback?: string | null
          created_at?: string
        }
      }
      keywords: {
        Row: {
          id: string
          domain: string
          keyword: string
          definition: string | null
          related_concepts: any[]
          difficulty: 'basic' | 'intermediate' | 'advanced' | null
          frequency: number
          created_at: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          domain: string
          completed_topics: string[]
          total_answers: number
          average_score: number
          last_activity: string
        }
      }
    }
  }
}
