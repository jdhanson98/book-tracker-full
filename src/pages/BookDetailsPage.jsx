import { Link, useParams } from "react-router";
import { useLibrary } from "../context/LibraryContext";

function getReadingStatusLabel(status) {
  const statusLabels = {
    "want-to-read": "Want to Read",
    "currently-reading": "Currently Reading",
    completed: "Completed",
    "did-not-finish": "Did Not Finish",
  };

  return statusLabels[status] ?? "Unknown";
}

function BookDetailsPage() {
  const { libraryId } = useParams();
  const { libraryBooks } = useLibrary();

  const book = libraryBooks.find((libraryBook) => libraryBook.libraryId === libraryId);

  if (!book) {
    return (
      <main className="container py-5">
        <div className="text-center">
          <h1 className="mb-3">Book Not Found</h1>

          <p className="text-secondary">This book could not be found in your library.</p>

          <Link className="btn btn-primary" to="/">
            Return to Library
          </Link>
        </div>
      </main>
    );
  }

  const authorText = Array.isArray(book.authors) && book.authors.length > 0 ? book.authors.join(", ") : "Unknown author";

  return (
    <main className="container py-5">
      <Link className="btn btn-outline-secondary mb-4" to="/">
        Back to Library
      </Link>

      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-12 col-md-4">
            {book.coverUrl ? (
              <img
                className="img-fluid rounded-start w-100"
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                style={{
                  height: "100%",
                  minHeight: "400px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="bg-body-secondary d-flex align-items-center justify-content-center text-secondary h-100"
                style={{ minHeight: "400px" }}>
                No cover available
              </div>
            )}
          </div>

          <div className="col-12 col-md-8">
            <div className="card-body p-4">
              <h1 className="card-title">{book.title}</h1>

              <p className="fs-5 text-secondary">{authorText}</p>

              <hr />

              <p>
                <strong>Reading Status:</strong> {getReadingStatusLabel(book.readingStatus)}
              </p>

              <p>
                <strong>Rating:</strong> {typeof book.rating === "number" ? `${book.rating}/5` : "Not rated"}
              </p>

              <p>
                <strong>Published:</strong> {book.publishedYear ?? "Unknown"}
              </p>

              {book.isbn && (
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
              )}

              {book.startDate && (
                <p>
                  <strong>Started:</strong> {book.startDate}
                </p>
              )}

              {book.finishDate && (
                <p>
                  <strong>Finished:</strong> {book.finishDate}
                </p>
              )}

              {book.notes && (
                <>
                  <hr />

                  <h2 className="h5">Notes</h2>

                  <p className="mb-0">{book.notes}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BookDetailsPage;
