export const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb3Rlbmdza3FxbGNlamZzdm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzk2NzQsImV4cCI6MjA3ODg1NTY3NH0.gaqkByamyYPvWXnE9kys0QKIr5Qi6-ebm3cEWewsgAw";
export const supabase = window.supabase.createClient(
  "https://ujotengskqqlcejfsvor.supabase.co",
  SUPABASE_KEY
);
