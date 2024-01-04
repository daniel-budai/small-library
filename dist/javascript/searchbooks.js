export const searchBooks = (books, searchQuery) => {
    const normalizedQuery = searchQuery.toLowerCase();
    return books.find((book) => book.title.toLowerCase().includes(normalizedQuery));
};
