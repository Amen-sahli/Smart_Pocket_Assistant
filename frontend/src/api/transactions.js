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