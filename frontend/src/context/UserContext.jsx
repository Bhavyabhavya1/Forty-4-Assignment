import { createContext, useContext, useState, useEffect } from "react";
import { fetchUsers, addUser as apiAddUser, deleteUser as apiDeleteUser, updateUser as apiUpdateUser, fetchUserById } from "../api/userService";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addUser = async (userData) => {
    try {
      const response = await apiAddUser(userData);
      const newUser = await fetchUserById(response.id);
      setUsers((prev) => [...prev, newUser.data]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter(user => user.id !== parseInt(id)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await apiUpdateUser(id, userData);
      const userId = parseInt(id);
      setUsers((prev) => prev.map(user => user.id === userId ? { id: userId, ...userData } : user));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  

  const value = {
    users,
    loading,
    error,
    addUser,
    deleteUser,
    updateUser,
    theme,
    setTheme,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => useContext(UserContext);
