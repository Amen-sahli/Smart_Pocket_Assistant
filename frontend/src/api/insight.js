import { authFetch } from "./auth";

export const getAIInsights = async () => {
  const res = await authFetch("http://localhost:8000/api/statements/insights/");

  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch insights");
  return data;
};
