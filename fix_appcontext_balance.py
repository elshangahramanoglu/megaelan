import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

# Add balance to User
old_user = """export interface User {
  id: string;
  phone: string;
  name: string;
}"""

new_user = """export interface User {
  id: string;
  phone: string;
  name: string;
  balance?: number;
}"""
text = text.replace(old_user, new_user)

# When fetching user from DB, fallback balance to 0 if not exist
login_user_func = """  const loginUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };"""

new_login_user = """  const loginUser = (userData: User) => {
    // If balance isn't present in DB yet, initialize to 0 or 1 for test account
    let balance = userData.balance || 0;
    if (userData.phone === '+994000000000' && typeof userData.balance === 'undefined') {
      balance = 1;
    }
    const finalUser = { ...userData, balance };
    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  };"""

text = text.replace(login_user_func, new_login_user)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
