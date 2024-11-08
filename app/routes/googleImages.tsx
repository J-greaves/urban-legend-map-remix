import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ error: "No search query provided" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const googleApiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&cx=${searchEngineId}&key=${apiKey}&searchType=image`;

  try {
    const response = await fetch(googleApiUrl);
    const data = await response.json();
    return json(data.items || []);
  } catch (error) {
    console.error("Error fetching Google Images");
    return json({ error: "Failed to fetch images" }, { status: 500 });
  }
};
