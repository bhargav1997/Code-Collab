import { CONFIG } from "../config";

const API_URL = CONFIG.API_URL;

export const fetchUserConnections = async () => {
   const token = localStorage.getItem("token");
   if (!token) {
      throw new Error("No token found");
   }

   const response = await fetch(`${API_URL}/users/connections`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch connections: ${response.status} ${response.statusText}`);
   }

   return await response.json();
};

export const updateUserAchievement = async (achievement) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_URL}/users/achievements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(achievement),
  });

  if (!response.ok) {
    throw new Error(`Failed to update achievement: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
