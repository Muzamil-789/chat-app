import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wlnjorpnlwdwxoqxqlws.supabase.co",
  
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmpvcnBubHdkd3hvcXhxbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMzYyNzAsImV4cCI6MjA1NDkxMjI3MH0.M0m7szQkE6WOGivFK3kjQ5dk5_xCJsGZAq8pFqQSJfw"
);


// export const uploadImage = async (file) => {
//   const { data, error } = await supabase.storage
//     .from("images")
//     .upload(`public/${file.name}`, file);

//   if (error) {
//     console.error("Error uploading image:", error);
//     return null;
//   }

//   return data;
// };