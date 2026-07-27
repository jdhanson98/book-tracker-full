import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

const INITIAL_FORM_DATA = {
  readingStatus: "want-to-read",
  rating: "",
  startDate: "",
  finishDate: "",
  notes: "",
};

function AddBookForm({ book, onCancel, onAdded }) {
  const { addBook } = useLibrary();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const rating = formData.rating === "" ? null : Number(formData.rating);

    const libraryDetails = {
      ...formData,
      rating,
      notes: formData.notes.trim(),
    };

    const bookToAdd = {
      ...book,
      ...libraryDetails,
    };

    try {
      setIsSubmitting(true);

      const libraryId = await addBook(bookToAdd);

      onAdded({
        ...bookToAdd,
        libraryId,
      });
    } catch (error) {
      console.error("Unable to add book:", error);

      setErrorMessage(error.message || "Unable to save this book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor={`status-${book.source}-${book.id}`} className="form-label">
          Reading status
        </label>

        <select
          id={`status-${book.source}-${book.id}`}
          className="form-select"
          name="readingStatus"
          value={formData.readingStatus}
          onChange={handleInputChange}>
          <option value="want-to-read">Want to Read</option>
          <option value="currently-reading">Currently Reading</option>
          <option value="completed">Completed</option>
          <option value="did-not-finish">Did Not Finish</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor={`rating-${book.source}-${book.id}`} className="form-label">
          Rating
        </label>

        <select
          id={`rating-${book.source}-${book.id}`}
          className="form-select"
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}>
          <option value="">Not rated</option>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor={`start-${book.source}-${book.id}`} className="form-label">
            Start date
          </label>

          <input
            id={`start-${book.source}-${book.id}`}
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor={`finish-${book.source}-${book.id}`} className="form-label">
            Finish date
          </label>

          <input
            id={`finish-${book.source}-${book.id}`}
            type="date"
            className="form-control"
            name="finishDate"
            value={formData.finishDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`notes-${book.source}-${book.id}`} className="form-label">
          Notes
        </label>

        <textarea
          id={`notes-${book.source}-${book.id}`}
          className="form-control"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Optional notes about this book"></textarea>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save to Library"}
        </button>

        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddBookForm;
