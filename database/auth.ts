import { supabase } from "@/database/supabase";

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Error logging in with Supabase:", error);
    throw error;
  }
  return data;
};

const register = async (
  email: string,
  password: string,
) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Error registering with Supabase:", error);
    throw error;
  }
  return data;
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
    throw error;
  }
  return true;
};

const getCurrentUser = () => {
  const user = supabase.auth.getUser();
  return user;
};

const auth = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default auth;