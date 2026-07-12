import { authFetch } from "./auth";

export default async function getTransactions() {
  const response = await authFetch("http://localhost:8000/api/statements/list/");

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return data;
}


export async function getStats() {
  const response = await authFetch("http://localhost:8000/api/statements/stats/");

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return data;
}


export const getAnalytics = async () => {
  const res = await authFetch("http://localhost:8000/api/statements/analytics/");

  const data = await res.json();

  if (!res.ok) throw new Error("Failed to fetch analytics");

  return data;
};

export const addTransaction = async (data) => {
  const res = await authFetch("http://localhost:8000/api/statements/add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to add transaction");
  }

  return result;
};

export const getAllTransactions = async () => {
  const res = await authFetch("http://localhost:8000/api/statements/all/");

  const data = await res.json();

  if (!res.ok) throw new Error("Failed to fetch transactions");

  return data;
};
