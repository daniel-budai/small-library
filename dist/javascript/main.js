var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { getBooks } from "./api.js"; //https://github.com/microsoft/TypeScript/issues/40878
import { searchBooks } from "./searchbooks.js";
//string type för html page
const fetchOverlayContent = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("./overlay.html");
    if (!response.ok) {
      throw new Error(`Fetch failed ${response.status}`);
    }
    return response.text();
  });
const updateElementText = (id, text) => {
  const element = document.getElementById(id);
  element.innerText = text.toString();
};
const closeButtonListener = () => {
  const closeButton = document.querySelector(".close");
  closeButton === null || closeButton === void 0
    ? void 0
    : closeButton.addEventListener("click", closeOverlay);
};
const closeOverlay = () => {
  removeElement(".overlay");
  removeElement('link[href="./css/overlaystyle.css"]');
};
const removeElement = (elementSelector) => {
  const element = document.querySelector(elementSelector);
  element.remove();
};
const displayBooksInOverlay = (book) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const overlayContent = yield fetchOverlayContent();
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
  });
const initialize = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const books = yield getBooks();
      const bookButtons = document.querySelectorAll("[data-tooltip]");
      const searchInput = document.getElementById("searchInput");
      bookButtons.forEach((bookButton) => {
        bookButton.addEventListener("click", () =>
          __awaiter(void 0, void 0, void 0, function* () {
            try {
              const tooltipTitle =
                bookButton.getAttribute("data-tooltip") || "";
              const selectedBook = books.find(
                (book) => book.title === tooltipTitle
              );
              if (selectedBook) {
                yield displayBooksInOverlay(selectedBook);
                const overlay = document.querySelector(".overlay");
                overlay === null || overlay === void 0
                  ? void 0
                  : overlay.setAttribute("data-book", tooltipTitle);
              }
            } catch (error) {
              console.error("Error displaying books", error);
            }
          })
        );
      });
      searchInput.addEventListener("keyup", (event) =>
        __awaiter(void 0, void 0, void 0, function* () {
          if (event.key === "Enter") {
            const searchQuery =
              (searchInput === null || searchInput === void 0
                ? void 0
                : searchInput.value) || "";
            const selectedBook = searchBooks(books, searchQuery);
            if (selectedBook) {
              yield displayBooksInOverlay(selectedBook);
              setTimeout(() => {
                const overlay = document.querySelector(".overlay");
                overlay === null || overlay === void 0
                  ? void 0
                  : overlay.setAttribute("data-book", selectedBook.title);
              }, 100); // You can adjust the delay (in milliseconds) based on your needs
            } else {
              alert("The book you searched for was not found");
            }
          }
        })
      );
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  });
document.addEventListener("DOMContentLoaded", initialize);
