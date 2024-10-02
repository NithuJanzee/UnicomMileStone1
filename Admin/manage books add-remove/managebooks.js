document
  .getElementById("formAddbook")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let book = {
      bookName: document.getElementById("bookName").value,
      bookCategory: document.getElementById("category").value,
      bookImage: document.getElementById("imagelocation").files[0]?.name || "",
      bookAuthor: document.getElementById("author").value,
      bookCopies: document.getElementById("copies").value,
    };

    // make fetching oop
    const fetchBooksFromServer = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (error) {
        console.error("Error fetching books from server:", error);
        return [];
      }
    };

    //post book into the json after the processing
    const addBookToServer = async (book) => {
      const addBookResponse = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      if (!addBookResponse.ok) throw new Error("Failed to add book to server");
      return true;
    };

    // process book if the book name and authors name is same or not
    const processBook = async (book) => {
      const existingBooks = await fetchBooksFromServer();

      const bookExists = existingBooks.some(
        (existingBook) =>
          existingBook.bookName === book.bookName &&
          existingBook.bookAuthor === book.bookAuthor
      );

      if (!bookExists) {
        const success = await addBookToServer(book);
        if (success) {
          document.getElementById("creationMessage").textContent =
            "Book added successfully!";
          document.getElementById("creationMessage").style.color = "green";
          renderPost();
        } else {
          document.getElementById("creationMessage").textContent =
            "Error adding book.";
          document.getElementById("creationMessage").style.color = "red";
        }
      } else {
        document.getElementById("creationMessage").textContent =
          "Book already exists.";
        document.getElementById("creationMessage").style.color = "red";
      }
    };

    //first check book before adding
    await processBook(book);
    document.getElementById("formAddbook").reset();
  });

const container = document.querySelector(".update-table");

//search function for the remove book table
const renderPost = async (searchQuery = "") => {
  let uri = "http://localhost:3000/products";
  const res = await fetch(uri);
  let books = await res.json();

  if (searchQuery) {
    books = books.filter(
      (book) =>
        book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  //dynamic book add in the table
  let template = "";
  books.forEach((book) => {
    template += `
          <tr>
              <td>${book.bookName}</td>
              <td>${book.bookAuthor}</td>
              <td>${book.bookCategory}</td>
              <td>${book.bookCopies}</td>
              <td>
                  <button class="btn remove" data-id="${book.id}">Remove</button>
              </td>
          </tr>
      `;
  });

  container.innerHTML = template;
  addEventListeners();
};

//dynamic remove button
const addEventListeners = () => {
  const buttons = document.querySelectorAll(".remove");
  buttons.forEach((button) => {
    button.addEventListener("click", handleRemoveBook);
  });
};

const handleRemoveBook = async (event) => {
  const button = event.target;
  const bookId = button.getAttribute("data-id");

  const deleteBookResponse = await fetch(
    `http://localhost:3000/products/${bookId}`,
    {
      method: "DELETE",
    }
  );
  if (!deleteBookResponse.ok)
    throw new Error("Failed to delete book from server");

  renderPost();
};

document.getElementById("searchBooks").addEventListener("input", (e) => {
  renderPost(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => renderPost());
