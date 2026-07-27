import { searchGoogleBooks } from "./googleBooksService";
import { searchOpenLibrary } from "./openLibraryService";

function getSuccessfulBooks(settledResult) {
  if (settledResult.status === "fulfilled") {
    return settledResult.value;
  }

  return [];
}

function createBookDuplicateKey(book) {
  if (book.isbn) {
    return `isbn:${book.isbn}`;
  }

  const normalizedTitle = book.title.trim().toLowerCase();

  const normalizedAuthor = book.authors[0]?.trim().toLowerCase() ?? "unknown";

  return `title:${normalizedTitle}|author:${normalizedAuthor}`;
}

function removeDuplicateBooks(books) {
  const seenKeys = new Set();

  return books.filter((book) => {
    const duplicateKey = createBookDuplicateKey(book);

    if (seenKeys.has(duplicateKey)) {
      return false;
    }

    seenKeys.add(duplicateKey);
    return true;
  });
}

export async function searchAllBookSources(query) {
  const results = await Promise.allSettled([searchOpenLibrary(query), searchGoogleBooks(query)]);

  const [openLibraryResult, googleBooksResult] = results;

  const openLibraryBooks = getSuccessfulBooks(openLibraryResult);

  const googleBooks = getSuccessfulBooks(googleBooksResult);

  return {
    books: removeDuplicateBooks([...openLibraryBooks, ...googleBooks]),
    openLibraryFailed: openLibraryResult.status === "rejected",
    googleBooksFailed: googleBooksResult.status === "rejected",
    errors: [
      openLibraryResult.status === "rejected" ? openLibraryResult.reason : null,
      googleBooksResult.status === "rejected" ? googleBooksResult.reason : null,
    ].filter(Boolean),
  };
}
