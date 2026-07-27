import { useState } from "react";
import { useNavigate } from "react-router";

import { useLibrary } from "../context/LibraryContext";

function getReadingStatusDisplay(status) {
  const statusOptions = {
    "want-to-read": {
      label: "Want to Read",
      className: "text-bg-secondary",
    },
    "currently-reading": {
      label: "Currently Reading",
      className: "text-bg-primary",
    },
    completed: {
      label: "Completed",
      className: "text-bg-success",
    },
    "did-not-finish": {
      label: "Did Not Finish",
      className: "text-bg-danger",
    },
  };

  return (
    statusOptions[status] ?? {
      label: "Unknown",
      className: "text-bg-secondary",
    }
  );
}

function BookCard({ book }) {
  const { updateBook, removeBook } = useLibrary();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(book.readingStatus);
  const [editedRating, setEditedRating] = useState(book.rating ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const statusDisplay = getReadingStatusDisplay(book.readingStatus);

  const authorText = Array.isArray(book.authors) && book.authors.length > 0 ? book.authors.join(", ") : "Unknown author";

  function openDetailsPage() {
    navigate(`/library/${encodeURIComponent(book.libraryId)}`);
  }

  async function handleSave() {
    try {
      setErrorMessage("");
      setIsSaving(true);

      await updateBook(book.libraryId, {
        readingStatus: editedStatus,
        rating: editedRating === "" ? null : Number(editedRating),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Unable to update book:", error);

      setErrorMessage(error.message || "Unable to update this book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setEditedStatus(book.readingStatus);
    setEditedRating(book.rating ?? "");
    setErrorMessage("");
    setIsEditing(false);
  }

  async function handleRemove() {
    const confirmed = window.confirm(`Remove "${book.title}" from your library?`);

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setIsRemoving(true);

      await removeBook(book.libraryId);
    } catch (error) {
      console.error("Unable to remove book:", error);

      setErrorMessage(error.message || "Unable to remove this book. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <article
      className="card h-100 shadow-sm"
      role="link"
      tabIndex="0"
      onClick={openDetailsPage}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          openDetailsPage();
        }
      }}
      style={{ cursor: "pointer" }}>
      {book.coverUrl ? (
        <img
          className="card-img-top"
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          style={{
            height: "320px",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="bg-body-secondary d-flex align-items-center justify-content-center text-secondary" style={{ height: "320px" }}>
          No cover available
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <span className={`badge ${statusDisplay.className}`}>{statusDisplay.label}</span>
        </div>

        <h2 className="h5 card-title">{book.title}</h2>

        <p className="card-text text-secondary">{authorText}</p>

        {book.publishedYear && (
          <p className="card-text">
            <strong>Published:</strong> {book.publishedYear}
          </p>
        )}

        {!isEditing && (
          <p className="card-text">
            <strong>Rating:</strong> {typeof book.rating === "number" ? `${book.rating}/5` : "Not rated"}
          </p>
        )}

        {errorMessage && (
          <div className="alert alert-danger" role="alert" onClick={(event) => event.stopPropagation()}>
            {errorMessage}
          </div>
        )}

        {isEditing ? (
          <div className="mt-auto" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
            <div className="mb-3">
              <label className="form-label" htmlFor={`status-${book.libraryId}`}>
                Reading status
              </label>

              <select
                id={`status-${book.libraryId}`}
                className="form-select"
                value={editedStatus}
                disabled={isSaving}
                onChange={(event) => setEditedStatus(event.target.value)}>
                <option value="want-to-read">Want to Read</option>

                <option value="currently-reading">Currently Reading</option>

                <option value="completed">Completed</option>

                <option value="did-not-finish">Did Not Finish</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor={`rating-${book.libraryId}`}>
                Rating
              </label>

              <select
                id={`rating-${book.libraryId}`}
                className="form-select"
                value={editedRating}
                disabled={isSaving}
                onChange={(event) => setEditedRating(event.target.value)}>
                <option value="">Not rated</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary flex-grow-1" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button type="button" className="btn btn-outline-secondary flex-grow-1" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex gap-2 mt-auto" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="btn btn-outline-primary flex-grow-1"
              disabled={isRemoving}
              onClick={() => {
                setErrorMessage("");
                setIsEditing(true);
              }}>
              Edit
            </button>

            <button type="button" className="btn btn-outline-danger flex-grow-1" disabled={isRemoving} onClick={handleRemove}>
              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default BookCard;
