export default async function getTransactions (token) {
  const response = await fetch("http://localhost:8000/api/statements/list/", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return data;
};



export async function getStats(token){
  const response = await fetch("http://localhost:8000/api/statements/stats/", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return data;
};


export const getAnalytics = async (token) => {
  const res = await fetch("http://localhost:8000/api/statements/analytics/", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  if (!res.ok) throw new Error("Failed to fetch analytics");

  return data;
};

export const addTransaction = async (data, token) => {
  const res = await fetch("http://localhost:8000/api/statements/add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to add transaction");
  }

  return result;
};