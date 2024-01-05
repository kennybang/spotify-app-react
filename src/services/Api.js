const BASE_URL = "https://api.spotify.com/v1";
const ENDPOINT = "me/top/tracks";

const fetchData = async (token, timeRange) => {
  try {
    const url = new URL(`${BASE_URL}/${ENDPOINT}`);
    url.searchParams.append("time_range", timeRange);
    url.searchParams.append("limit", "5");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.items;
    } else {
      console.error("Error fetching data:", response.statusText);
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default fetchData;
