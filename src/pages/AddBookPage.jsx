import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import { searchAllBookSources } from "../services/bookSearchService";

function AddBookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  async function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery === "") {
      setErrorMessage("Enter a title, author, or ISBN before searching.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    setHasSearched(true);
    setSearchResults([]);
    setWarningMessage("");

    try {
      const searchResponse = await searchAllBookSources(trimmedQuery);

      searchResponse.errors.forEach((error) => {
        console.error("Book source failed:", error);
      });

      if (searchResponse.openLibraryFailed && searchResponse.googleBooksFailed) {
        throw new Error("All book search sources failed.");
      }

      if (searchResponse.openLibraryFailed) {
        setWarningMessage("Open Library could not be reached. Results are from Google Books only.");
      } else if (searchResponse.googleBooksFailed) {
        setWarningMessage("Google Books could not be reached. Results are from Open Library only.");
      } else {
        setWarningMessage("");
      }

      setSearchResults(searchResponse.books);
    } catch (error) {
      console.error("Book search failed:", error);

      setErrorMessage("The book search could not be completed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);

    if (errorMessage) {
      setErrorMessage("");
    }

    if (warningMessage) {
      setWarningMessage("");
    }
  }

  return (
    <main className="container py-5">
      <header className="mb-4">
        <h1 className="display-5 fw-bold">Add a Book</h1>

        <p className="lead text-secondary">Search Open Library and Google Books to find a book for your library.</p>
      </header>

      <section aria-labelledby="book-search-heading">
        <h2 id="book-search-heading" className="h4">
          Search for a book
        </h2>

        <form className="row g-3" onSubmit={handleSearchSubmit}>
          <div className="col-12 col-md-9">
            <label htmlFor="book-search" className="form-label">
              Title, author, or ISBN
            </label>

            <input
              type="search"
              className="form-control"
              id="book-search"
              name="bookSearch"
              placeholder="For example: The Hobbit"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>

          <div className="col-12 col-md-3 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
        {warningMessage && (
          <div className="alert alert-warning mt-3" role="alert">
            {warningMessage}
          </div>
        )}
      </section>

      <section className="mt-5" aria-labelledby="search-results-heading">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 id="search-results-heading" className="h4 mb-0">
            Search Results
          </h2>

          {searchResults.length > 0 && <span className="text-secondary">{searchResults.length} results</span>}
        </div>

        {!hasSearched && !isLoading && (
          <div className="border rounded bg-white p-5 text-center text-secondary">Search results will appear here.</div>
        )}

        {isLoading && (
          <div className="border rounded bg-white p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading results</span>
            </div>

            <p className="text-secondary mt-3 mb-0">Searching Open Library and Google Books...</p>
          </div>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && <div className="alert alert-info">No matching books were found.</div>}

        {!isLoading && searchResults.map((book) => <SearchResultCard key={`${book.source}-${book.id}`} book={book} />)}
      </section>
    </main>
  );
}

export default AddBookPage;
