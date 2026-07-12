const API_URL = "http://localhost:8000/api/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};


export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.email) {
      throw new Error(data.email[0]);
    }
    if (data.username) {
      throw new Error(data.username[0]);
    }
    throw new Error("Registration failed");
  }

  return data;
};

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh })
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
  window.location.href = "/";
};

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      logout();
      throw new Error("Session expired");
    }

    headers["Authorization"] = "Bearer " + newToken;
    res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      logout();
      throw new Error("Session expired");
    }
  }

  return res;
};
