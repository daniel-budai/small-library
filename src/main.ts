import { Book } from "./interface";
import { getBooks } from "./api.js"; //https://github.com/microsoft/TypeScript/issues/40878
import { searchBooks } from "./searchbooks.js";

//string type för html page
const fetchOverlayContent = async (): Promise<string> => {
  const response = await fetch("./overlay.html");
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}`);
  }
  return response.text();
};

const updateElementText = (id: string, text: string | number): void => {
  const element = document.getElementById(id) as HTMLElement;
  element.innerText = text.toString();
};

const closeButtonListener = (): void => {
  const closeButton: HTMLElement | null = document.querySelector(".close");
  closeButton?.addEventListener("click", closeOverlay);
};

const closeOverlay = (): void => {
  removeElement(".overlay");
  removeElement('link[href="./css/overlaystyle.css"]');
};

const removeElement = (elementSelector: string): void => {
  const element: HTMLElement = document.querySelector(elementSelector)!;
  element.remove();
};

const displayBooksInOverlay = async (book: Book): Promise<void> => {
  try {
    const overlayContent = await fetchOverlayContent();

    document.body.insertAdjacentHTML("beforeend", overlayContent); //append för html files

    updateElementText("coverBookTitle", book.title);
    updateElementText("coverBookAuthor", book.author);
    updateElementText("bookTitle", book.title);
    updateElementText("bookAuthor", book.author);
    updateElementText("bookPlot", book.plot);
    updateElementText("bookAudience", book.audience);
    updateElementText("bookYear", book.year);
    updateElementText("bookPages", book.pages || ""); //åtgärd för "book-four", den är null
    updateElementText("bookPublisher", book.publisher);

    closeButtonListener();
  } catch (error) {
    console.error("Error", error);
  }
};

const initialize = async (): Promise<void> => {
  try {
    const books: Book[] = await getBooks();
    const bookButtons: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll<HTMLButtonElement>("[data-tooltip]");

    const searchInput: HTMLInputElement | null = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;

    bookButtons.forEach((bookButton: HTMLButtonElement) => {
      bookButton.addEventListener("click", async () => {
        try {
          const tooltipTitle: string =
            bookButton.getAttribute("data-tooltip") || "";
          const selectedBook: Book | undefined = books.find(
            (book) => book.title === tooltipTitle
          );

          if (selectedBook) {
            await displayBooksInOverlay(selectedBook);

            const overlay: HTMLElement | null =
              document.querySelector(".overlay");
            overlay?.setAttribute("data-book", tooltipTitle);
          }
        } catch (error) {
          console.error("Error displaying books", error);
        }
      });
    });

    searchInput.addEventListener("keyup", async (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const searchQuery: string = searchInput?.value || "";
        const selectedBook: Book | undefined = searchBooks(books, searchQuery);

        if (selectedBook) {
          await displayBooksInOverlay(selectedBook);

          setTimeout(() => {
            const overlay: HTMLElement | null =
              document.querySelector(".overlay");
            overlay?.setAttribute("data-book", selectedBook.title);
          }, 100); // You can adjust the delay (in milliseconds) based on your needs
        } else {
          alert("The book you searched for was not found");
        }
      }
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

document.addEventListener("DOMContentLoaded", initialize);
