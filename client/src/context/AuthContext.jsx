import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../lib/storage.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());

  useEffect(() => {
    if (!token) {
      storage.clearToken();
      storage.clearUser();
      return;
    }

    storage.setToken(token);

    if (user) {
      storage.setUser(user);
    }
  }, [token, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      login: (authResponse) => {
        setToken(authResponse.token);
        setUser(authResponse.user);
      },
      logout: () => {
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
