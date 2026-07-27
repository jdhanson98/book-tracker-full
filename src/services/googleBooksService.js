const GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

function getApiKey() {
  if (!GOOGLE_BOOKS_API_KEY) {
    throw new Error("The Google Books API key is missing. Add VITE_GOOGLE_BOOKS_API_KEY to .env.local.");
  }

  return GOOGLE_BOOKS_API_KEY;
}

function getPreferredIsbn(industryIdentifiers) {
  if (!Array.isArray(industryIdentifiers)) {
    return null;
  }

  const isbn13 = industryIdentifiers.find((identifier) => identifier.type === "ISBN_13");

  if (isbn13) {
    return isbn13.identifier;
  }

  const isbn10 = industryIdentifiers.find((identifier) => identifier.type === "ISBN_10");

  return isbn10?.identifier ?? null;
}

function getPublishedYear(publishedDate) {
  if (typeof publishedDate !== "string") {
    return null;
  }

  const yearText = publishedDate.slice(0, 4);
  const year = Number.parseInt(yearText, 10);

  return Number.isNaN(year) ? null : year;
}

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  return imageUrl.replace(/^http:/, "https:");
}

function normalizeGoogleBook(volume) {
  const volumeInfo = volume.volumeInfo ?? {};

  return {
    id: volume.id,
    title: volumeInfo.title ?? "Untitled",
    authors: volumeInfo.authors ?? [],
    publishedYear: getPublishedYear(volumeInfo.publishedDate),
    isbn: getPreferredIsbn(volumeInfo.industryIdentifiers),
    coverUrl: normalizeImageUrl(volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail),
    description: volumeInfo.description ?? null,
    source: "Google Books",
  };
}

export async function searchGoogleBooks(query) {
  const url = new URL(GOOGLE_BOOKS_SEARCH_URL);

  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("printType", "books");
  url.searchParams.set("key", getApiKey());

  console.log("Google Books request:", url.toString());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Books request failed with status ${response.status}`);
  }

  const data = await response.json();

  const volumes = Array.isArray(data.items) ? data.items : [];

  return volumes.map(normalizeGoogleBook);
}
