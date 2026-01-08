import type { Job } from "@/types/job"
import { getCookie } from "./get_cookie";

interface JobsResponse {
  jobs: Job[]
}

export const fetchJobs = async (chatdata: any) => {
  const token = await getCookie("token");
  
  try {    
    const response = await fetch( `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat?mock=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include", // Include credentials for cross-origin requests
      body: JSON.stringify({
        question: chatdata,
      }),
    })
    
    console.log("API response status:", response);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const data = await response.json()
    console.log("API response data received:", data);
    return data
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error; // Re-throw to handle in the component
  }
}

export const deleteById = async (path: string) => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
}

export const renameChatById = async (chatId: string, newName: string) => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/rename?id=${chatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat renamed successfully:", data);
    return data;
  } catch (error) {
    console.error("Error renaming chat:", error);
    throw error;
  }
}

export const fetchChats = async () => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Chats fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export const updateJob = async (jobId: string, updateData: Partial<Job>) => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/update?id=${jobId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Job updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

export const updateJobById = async (jobId: string, updateData: Partial<Job>) => {
  // Alias for updateJob for consistency
  return updateJob(jobId, updateData);
}

export const updateChat = async (chatId: string, updateData: { name?: string; description?: string }) => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/update?id=${chatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
}

export const deleteChatById = async (chatId: string) => {
  const token = await getCookie("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/delete?id=${chatId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}

export const getChatById = async (chatId: string) => {
  const token = await getCookie("token");
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/get?id=${chatId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log("Chat fetched successfully:", data);
  return data;
}
