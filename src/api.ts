// api.ts
import { Book } from "./interface";

export async function getBooks(): Promise<Book[]> {
  const apiUrl: string =
    "https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. Status: ${response.status} - ${response.statusText}`
      );
    }
    const books: Book[] = await response.json();

    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}
