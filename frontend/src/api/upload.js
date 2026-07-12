import { authFetch } from "./auth";

export default async function upload(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await authFetch("http://localhost:8000/api/statements/upload/", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}
