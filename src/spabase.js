// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// 環境変数の読み込み (Viteの記法)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// クライアントを作成してエクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey)