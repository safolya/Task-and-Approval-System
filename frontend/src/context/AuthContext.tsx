import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
  globalRole: "ADMIN" | "USER";
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get("/me").then(res => setUser(res.data.user)).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
