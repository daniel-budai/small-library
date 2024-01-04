import { Book } from "./interface";

export const searchBooks = (
  books: Book[],
  searchQuery: string
): Book | undefined => {
  const normalizedQuery = searchQuery.toLowerCase();
  return books.find((book) =>
    book.title.toLowerCase().includes(normalizedQuery)
  );
};
