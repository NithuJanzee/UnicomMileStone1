const logedUser = localStorage.getItem("loggedInUserId");
const userIdToFilter = logedUser;
const htmlUpend = document.querySelector(".lended-books");

if (userIdToFilter) {
  window.addEventListener("DOMContentLoaded", async () => {
    const getData = await fetch(`http://localhost:3000/LendingBooks`);
    const LendingBooks = await getData.json();

    const lendingBooks = [];
    const filteredRequests = LendingBooks.filter(
      (request) => request.userId === userIdToFilter
    );
    filteredRequests.forEach((lendingObjects) => {
       console.log(lendingObjects)
      lendingBooks.push(lendingObjects);
    });

    let template = "";
    lendingBooks.forEach((books) => {
      template += `<div class="lended-book-item">
                    <div class="book-details">
                        <img src="../user-home/BookImages/${books.bookImage}" alt="Book Cover" class="book-cover">
                        <div class="details">
                            <h2>${books.bookName}</h2>
                            <p>Author: ${books.bookAuthor}</p>
                            <p>Lended Date: ${books.lendDate}</p>
                            <p>Due Date: ${books.returnDate}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btnReturn" data-userId="${books.userId}"
                        data-userName="${books.userName}"
                        data-bookName="${books.bookName}"
                        data-bookId="${books.bookId}"
                        data-bookAuthor="${books.bookAuthor}"
                        data-bookImage="${books.bookImage}"
                        data-bookLentDate="${books.lendDate}"
                        data-bookReturnDate="${books.returnDate}"
                        data-lendingId="${books.id}">Return</button>
                    </div>
                </div>`;
      // console.log(books)
    });
    htmlUpend.innerHTML = template;
    // console.log(lendingBooks);

    document.querySelectorAll(".btnReturn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const userId = event.target.getAttribute("data-userId");
        const userName = event.target.getAttribute("data-userName");
        const bookName = event.target.getAttribute("data-bookName");
        const bookId = event.target.getAttribute("data-bookId");
        const bookAuthor = event.target.getAttribute("data-bookAuthor");
        const bookImage = event.target.getAttribute("data-bookImage");
        const bookLentDate = event.target.getAttribute("data-bookLentDate");
        const bookReturnDate = event.target.getAttribute("data-bookReturnDate");
        const lendingId = event.target.getAttribute("data-lendingId");

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const returnDate = `${day}-${month}-${year}`;

        const returnedBookONtime = {
          userId: userId,
          lendingId: lendingId,
          userName: userName,
          bookName: bookName,
          bookId: bookId,
          bookAuthor: bookAuthor,
          bookImage: bookImage,
          bookLentDate: bookLentDate,
          bookDueDate: bookReturnDate,
          bookReturnDate: returnDate,
          status: "on time",
        };

        const returnedBookOverdue = {
          userId: userId,
          lendingId: lendingId,
          userName: userName,
          bookName: bookName,
          bookId: bookId,
          bookAuthor: bookAuthor,
          bookImage: bookImage,
          bookLentDate: bookLentDate,
          bookDueDate: bookReturnDate,
          bookReturnDate: returnDate,
          status: "OverDue",
        };

        if (returnDate <= bookReturnDate) {
          console.log("on time");

          //request is on time update in returned book
          const addDataIntoReturn = await fetch(
            "http://localhost:3000/ReturnedBook",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(returnedBookONtime),
            }
          );

          //update the book quantity +1
          const quantityControl = await fetch(
            `http://localhost:3000/products/${bookId}`
          );
          const quantityBook = await quantityControl.json();
          //console.log(quantityBook)

          //add one count for book.copy +1
          const updateCopies = parseInt(quantityBook.bookCopies) + 1;
          //after update the book details
          const updateResponse = await fetch(
            `http://localhost:3000/products/${bookId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ bookCopies: updateCopies.toString() }),
            }
          );

          // Delete lending book record
          const deleteResponse = await fetch(
            `http://localhost:3000/LendingBooks/${lendingId}`,
            {
              method: "DELETE",
            }
          );

          location.reload();
        } else {
          //update retunt
          const updateReturn = await fetch("http://localhost:3000/ReturnedBook",{
            method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(returnedBookOverdue),
          })

          const updateOverDueArea = await fetch ("http://localhost:3000/OverDue",{
            method:"POST",
            headers:{
              "Content-Type" : "application/json",
            },
            body: JSON.stringify(returnedBookOverdue)
          })

          //update quantity
          const updatQuantity = await fetch(`http://localhost:3000/products/${bookId}`)
          const TheQuantity = await updatQuantity.json()

          const updateTheCopy = parseInt(TheQuantity.bookCopies) + 1;
          //save the infprmation
          const updateOverdueInfprmation = await fetch(`http://localhost:3000/products/${bookId}`,{
            method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ bookCopies: updateTheCopy.toString() }),
          })

          // Delete lending book record
          const deleteResponse = await fetch(
            `http://localhost:3000/LendingBooks/${lendingId}`,
            {
              method: "DELETE",
            }
          );

          location.reload();

        }
      });
    });
  });
} else {
  alert("please login");
}
