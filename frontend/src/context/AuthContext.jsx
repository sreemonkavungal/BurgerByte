import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("burgerbyte_user") || "null")
  );

  const login = (data) => {
    localStorage.setItem("burgerbyte_token", data.token);
    localStorage.setItem("burgerbyte_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("burgerbyte_token");
    localStorage.removeItem("burgerbyte_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
