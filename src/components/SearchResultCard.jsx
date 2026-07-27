import { useState } from "react";
import AddBookForm from "./AddBookForm";

function getSourceBadgeClass(source) {
  const sourceClasses = {
    "Open Library": "text-bg-warning",
    "Google Books": "text-bg-info",
  };

  return sourceClasses[source] ?? "text-bg-secondary";
}

function SearchResultCard({ book }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sourceBadgeClass = getSourceBadgeClass(book.source);

  const [successMessage, setSuccessMessage] = useState("");

  const authorText = Array.isArray(book.authors) && book.authors.length > 0 ? book.authors.join(", ") : "Unknown author";

  function handleBookAdded() {
    setIsFormOpen(false);
    setSuccessMessage("Book added to your library.");
  }

  return (
    <article className="card shadow-sm mb-3">
      <div className="row g-0">
        <div className="col-4 col-sm-3 col-md-2">
          {book.coverUrl && !imageFailed ? (
            <img
              src={book.coverUrl}
              className="img-fluid rounded-start search-result-cover"
              alt={`Cover of ${book.title}`}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="search-result-cover-placeholder rounded-start">No cover</div>
          )}
        </div>

        <div className="col-8 col-sm-9 col-md-10">
          <div className="card-body h-100 d-flex flex-column">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
              <div>
                <h3 className="card-title h5 mb-1">{book.title}</h3>

                <p className="text-secondary mb-2">{authorText}</p>
              </div>

              <div>
                <span className={`badge ${sourceBadgeClass}`}>{book.source}</span>
              </div>
            </div>

            <dl className="row small mb-3">
              <dt className="col-sm-3 col-lg-2">Published</dt>
              <dd className="col-sm-9 col-lg-10">{book.publishedYear ?? "Unknown"}</dd>

              <dt className="col-sm-3 col-lg-2">ISBN</dt>
              <dd className="col-sm-9 col-lg-10">{book.isbn ?? "Unavailable"}</dd>
            </dl>

            {book.description && <p className="card-text">{book.description}</p>}

            <div className="mt-auto">
              {successMessage && (
                <div className="alert alert-success py-2" role="status">
                  {successMessage}
                </div>
              )}

              {isFormOpen ? (
                <AddBookForm book={book} onCancel={() => setIsFormOpen(false)} onAdded={handleBookAdded} />
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSuccessMessage("");
                    setIsFormOpen(true);
                  }}>
                  Add to Library
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default SearchResultCard;
