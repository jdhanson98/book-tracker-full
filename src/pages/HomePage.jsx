import { useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import LibraryCharts from "../components/LibraryCharts";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";

function normalizeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function HomePage() {
  const { libraryBooks } = useLibrary();

  const { logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("recently-added");

  const visibleBooks = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchText(searchTerm);

    const filteredBooks = libraryBooks.filter((book) => {
      const normalizedTitle = normalizeSearchText(book.title);

      const normalizedAuthors = Array.isArray(book.authors) ? book.authors.map((author) => normalizeSearchText(author)).join(" ") : "";

      const matchesSearch =
        normalizedSearchTerm === "" || normalizedTitle.includes(normalizedSearchTerm) || normalizedAuthors.includes(normalizedSearchTerm);

      const matchesStatus = statusFilter === "all" || book.readingStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    const sortedBooks = [...filteredBooks];

    sortedBooks.sort((firstBook, secondBook) => {
      switch (sortOption) {
        case "oldest-added":
          return new Date(firstBook.addedAt) - new Date(secondBook.addedAt);

        case "title-ascending":
          return firstBook.title.localeCompare(secondBook.title);

        case "title-descending":
          return secondBook.title.localeCompare(firstBook.title);

        case "rating-highest":
          return (secondBook.rating ?? -1) - (firstBook.rating ?? -1);

        case "year-newest":
          return (secondBook.publishedYear ?? 0) - (firstBook.publishedYear ?? 0);

        case "year-oldest":
          return (firstBook.publishedYear ?? Number.MAX_SAFE_INTEGER) - (secondBook.publishedYear ?? Number.MAX_SAFE_INTEGER);

        case "recently-added":
        default:
          return new Date(secondBook.addedAt) - new Date(firstBook.addedAt);
      }
    });

    return sortedBooks;
  }, [libraryBooks, searchTerm, statusFilter, sortOption]);

  const libraryStats = useMemo(() => {
    const completedBooks = libraryBooks.filter((book) => book.readingStatus === "completed");

    const currentlyReadingBooks = libraryBooks.filter((book) => book.readingStatus === "currently-reading");

    const ratedBooks = libraryBooks.filter((book) => typeof book.rating === "number" && book.rating >= 1 && book.rating <= 5);

    const totalRating = ratedBooks.reduce((total, book) => total + book.rating, 0);

    const averageRating = ratedBooks.length > 0 ? totalRating / ratedBooks.length : null;

    const uniqueAuthors = new Set(
      libraryBooks.flatMap((book) => (Array.isArray(book.authors) ? book.authors.map((author) => normalizeSearchText(author)) : [])),
    );

    const statusCounts = libraryBooks.reduce(
      (counts, book) => {
        const status = book.readingStatus;

        if (status in counts) {
          counts[status] += 1;
        }

        return counts;
      },
      {
        "want-to-read": 0,
        "currently-reading": 0,
        completed: 0,
        "did-not-finish": 0,
      },
    );

    const readingStatusChartData = [
      {
        status: "Want to Read",
        count: statusCounts["want-to-read"],
        fill: "#6c757d",
      },
      {
        status: "Currently Reading",
        count: statusCounts["currently-reading"],
        fill: "#0d6efd",
      },
      {
        status: "Completed",
        count: statusCounts.completed,
        fill: "#198754",
      },
      {
        status: "Did Not Finish",
        count: statusCounts["did-not-finish"],
        fill: "#dc3545",
      },
    ];

    const ratingCounts = libraryBooks.reduce(
      (counts, book) => {
        const rating = book.rating;

        if (typeof rating === "number" && rating >= 1 && rating <= 5) {
          counts[rating] += 1;
        }

        return counts;
      },
      {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    );

    const ratingChartData = [
      {
        rating: 1,
        ratingLabel: "1 Star",
        count: ratingCounts[1],
      },
      {
        rating: 2,
        ratingLabel: "2 Stars",
        count: ratingCounts[2],
      },
      {
        rating: 3,
        ratingLabel: "3 Stars",
        count: ratingCounts[3],
      },
      {
        rating: 4,
        ratingLabel: "4 Stars",
        count: ratingCounts[4],
      },
      {
        rating: 5,
        ratingLabel: "5 Stars",
        count: ratingCounts[5],
      },
    ];

    return {
      totalBooks: libraryBooks.length,
      completedBooks: completedBooks.length,
      currentlyReadingBooks: currentlyReadingBooks.length,
      averageRating,
      uniqueAuthors: uniqueAuthors.size,
      readingStatusChartData,
      ratingChartData,
    };
  }, [libraryBooks]);

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("recently-added");
  }

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1 className="display-5">My Library</h1>

        <button type="button" className="btn btn-danger" onClick={logout}>
          Temporary Logout
        </button>

        <p className="text-secondary mb-0">Search, filter, and review your saved books.</p>
      </header>

      <section className="mb-4">
        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-1">Total Books</p>

                <p className="display-6 mb-0">{libraryStats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-1">Completed</p>

                <p className="display-6 mb-0">{libraryStats.completedBooks}</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-1">Currently Reading</p>

                <p className="display-6 mb-0">{libraryStats.currentlyReadingBooks}</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p className="text-secondary mb-1">Average Rating</p>

                <p className="display-6 mb-0">{libraryStats.averageRating === null ? "—" : libraryStats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LibraryCharts readingStatusData={libraryStats.readingStatusChartData} ratingData={libraryStats.ratingChartData} />

      <section className="mb-4">
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <label htmlFor="library-search" className="form-label">
              Search your library
            </label>

            <input
              id="library-search"
              type="search"
              className="form-control"
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <label htmlFor="status-filter" className="form-label">
              Reading status
            </label>

            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All Statuses</option>
              <option value="want-to-read">Want to Read</option>
              <option value="currently-reading">Currently Reading</option>
              <option value="completed">Completed</option>
              <option value="did-not-finish">Did Not Finish</option>
            </select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <label htmlFor="sort-option" className="form-label">
              Sort by
            </label>

            <select id="sort-option" className="form-select" value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
              <option value="recently-added">Recently Added</option>
              <option value="oldest-added">Oldest Added</option>
              <option value="title-ascending">Title: A–Z</option>
              <option value="title-descending">Title: Z–A</option>
              <option value="rating-highest">Rating: Highest First</option>
              <option value="year-newest">Publication Year: Newest</option>
              <option value="year-oldest">Publication Year: Oldest</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Your Books</h2>

          <span className="text-secondary">
            {visibleBooks.length} {visibleBooks.length === 1 ? "book" : "books"}
          </span>
        </div>

        {libraryBooks.length === 0 ? (
          <div className="border rounded bg-white p-5 text-center">
            <h2 className="h4">Your library is empty</h2>

            <p className="text-secondary mb-0">Search for a book and add it to your library.</p>
          </div>
        ) : visibleBooks.length === 0 ? (
          <div className="border rounded bg-white p-5 text-center">
            <h2 className="h4">No books found</h2>

            <p className="text-secondary mb-3">No books match your current search or filters.</p>

            <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {visibleBooks.map((book) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={book.libraryId}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
