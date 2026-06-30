export const getToken = () => {
  console.log(sessionStorage.getItem("accessToken"),"this is token logged")
  return sessionStorage.getItem("accessToken");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  sessionStorage.removeItem("accessToken");
};
