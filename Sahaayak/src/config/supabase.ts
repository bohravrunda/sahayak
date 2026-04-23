import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zabkynjgekshpemhvysn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphYmt5bmpnZWtzaHBlbWh2eXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTE2MDgsImV4cCI6MjA5MjA2NzYwOH0.hrhN5sA93rQIM3fP4Bt89ZkM1k42ZKfWgtEWqs6Jorw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);