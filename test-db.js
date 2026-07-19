const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cahpowshooetpyiygsol.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaHBvd3Nob29ldHB5aXlnc29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQxNDksImV4cCI6MjA5OTA5MDE0OX0.n01yAK_nZo7LdIhSX259cT29chAXCPrDSpHNURrqaFE');
async function test() {
  const { data, error } = await supabase.from('items').select('*').eq('slug', 'coffee-scale-cafebo-1').single();
  console.log(data);
}
test();
