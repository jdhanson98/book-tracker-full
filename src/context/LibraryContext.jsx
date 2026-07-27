import { createContext, useContext, useEffect, useState } from "react";

import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const { currentUser } = useAuth();

  const [libraryBooks, setLibraryBooks] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [libraryError, setLibraryError] = useState("");

  useEffect(() => {
    setLibraryError("");

    if (!currentUser) {
      setLibraryBooks([]);
      setLibraryLoading(false);
      return;
    }

    setLibraryLoading(true);

    const booksCollectionRef = collection(db, "users", currentUser.uid, "books");

    const unsubscribe = onSnapshot(
      booksCollectionRef,
      (snapshot) => {
        const books = snapshot.docs.map((bookDocument) => ({
          ...bookDocument.data(),
          libraryId: bookDocument.id,
        }));

        setLibraryBooks(books);
        setLibraryLoading(false);
      },
      (error) => {
        console.error("Unable to load library:", error);

        setLibraryError(error.message || "Unable to load your library.");

        setLibraryLoading(false);
      },
    );

    return unsubscribe;
  }, [currentUser]);

  async function addBook(book) {
    if (!currentUser) {
      throw new Error("You must be logged in to add a book.");
    }

    if (!book.source || !book.id) {
      throw new Error("The book must have a source and source ID.");
    }

    const documentId = encodeURIComponent(`${book.source}-${book.id}`);

    const bookDocumentRef = doc(db, "users", currentUser.uid, "books", documentId);

    const existingBook = await getDoc(bookDocumentRef);

    if (existingBook.exists()) {
      throw new Error("This book is already in your library.");
    }

    const bookToAdd = {
      ...book,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(bookDocumentRef, bookToAdd);

    return documentId;
  }

  async function updateBook(libraryId, updatedBook) {
    if (!currentUser) {
      throw new Error("You must be logged in to update a book.");
    }

    if (!libraryId) {
      throw new Error("A library ID is required to update a book.");
    }

    const bookDocumentRef = doc(db, "users", currentUser.uid, "books", libraryId);

    const { libraryId: ignoredLibraryId, createdAt, ...bookChanges } = updatedBook;

    await updateDoc(bookDocumentRef, {
      ...bookChanges,
      updatedAt: serverTimestamp(),
    });
  }

  async function removeBook(libraryId) {
    if (!currentUser) {
      throw new Error("You must be logged in to remove a book.");
    }

    if (!libraryId) {
      throw new Error("A library ID is required to remove a book.");
    }

    const bookDocumentRef = doc(db, "users", currentUser.uid, "books", libraryId);

    await deleteDoc(bookDocumentRef);
  }

  const contextValue = {
    libraryBooks,
    libraryLoading,
    libraryError,
    addBook,
    updateBook,
    removeBook,
  };

  return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error("useLibrary must be used inside LibraryProvider.");
  }

  return context;
}
