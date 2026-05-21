export const getAIInsights = async (token) => {
  const res = await fetch("http://localhost:8000/api/statements/insights/", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch insights");
    return data;    
};