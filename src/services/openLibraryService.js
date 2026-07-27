const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";

function createCoverUrl(coverId) {
  if (!coverId) {
    return null;
  }

  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

function getPreferredIsbn(isbnList) {
  if (!Array.isArray(isbnList)) {
    return null;
  }

  const isbn13 = isbnList.find((isbn) => isbn.length === 13);

  return isbn13 ?? isbnList[0] ?? null;
}

function normalizeOpenLibraryBook(document) {
  return {
    id: document.key,
    title: document.title ?? "Untitled",
    authors: document.author_name ?? [],
    publishedYear: document.first_publish_year ?? null,
    isbn: getPreferredIsbn(document.isbn),
    coverUrl: createCoverUrl(document.cover_i),
    description: null,
    source: "Open Library",
  };
}

export async function searchOpenLibrary(query) {
  const url = new URL(OPEN_LIBRARY_SEARCH_URL);

  url.searchParams.set("q", query);
  url.searchParams.set("fields", "key,title,author_name,first_publish_year,isbn,cover_i");
  url.searchParams.set("limit", "20");

  console.log("Open Library request:", url.toString());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Library request failed with status ${response.status}`);
  }

  const data = await response.json();

  const documents = Array.isArray(data.docs) ? data.docs : [];

  return documents.map(normalizeOpenLibraryBook);
}
