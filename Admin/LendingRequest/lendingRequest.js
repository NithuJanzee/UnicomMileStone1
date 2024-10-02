const htmlPage = document.getElementById("tableBody");

window.addEventListener("DOMContentLoaded", async () => {
  // Fetch lending requests
  const response = await fetch("http://localhost:3000/LendingRequest");
  const LendingRequest = await response.json();
  // console.log(LendingRequest);

  //This shit is not working
  // for(const bookQuantity of LendingRequest.bookQuantity){
  //     const getQuantity = await fetch(`http://localhost:3000/products/${bookQuantity}`)
  //     const theQuantity =await getQuantity.json()
  //     console.log(theQuantity)
  // }

  let template = "";
  LendingRequest.forEach((request) => {
    template += `
            <tr>
                <td>${request.userName}</td>
                <td>${request.bookName}</td>
                <td>${request.requestDate}</td>
                <td>${request.bookQuantity}</td>
                <td>
                    <button class="btnConfirm" data-userId="${request.userId}"
                            data-bookId="${request.bookId}"
                            data-requestId="${request.id}"
                            data-bookName="${request.bookName}"
                            data-bookImage="${request.bookImage}"
                            data-requestDate="${request.requestDate}"
                            data-userName="${request.userName}"
                            data-bookAuthor="${request.bookAuthor}">Confirm</button>
                    <button class="btnReject" data-requestId="${request.id}">Reject</button>
                </td>
            </tr>
        `;
  });

  htmlPage.innerHTML = template;
  // Assign template to innerHTML

  // Add event listeners (if needed, for example)
  document.querySelectorAll(".btnConfirm").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.getAttribute("data-userId");
      const bookId = event.target.getAttribute("data-bookId");
      const requestId = event.target.getAttribute("data-requestId");
      const bookName = event.target.getAttribute("data-bookName");
      const bookImage = event.target.getAttribute("data-bookImage");
      const requestDate = event.target.getAttribute("data-requestDate");
      const userName = event.target.getAttribute("data-userName");
      const bookAuthor = event.target.getAttribute("data-bookAuthor");

      const lendDate = new Date();
      lendDate.setDate(lendDate.getDate() + 7);
      const returnDay = lendDate.getDate();
      const returnMonth = lendDate.getMonth() + 1;
      const returnYear = lendDate.getFullYear();

      const LendingBooks = {
        userId: userId,
        userName: userName,
        bookId: bookId,
        bookName: bookName,
        bookAuthor: bookAuthor,
        bookImage: bookImage,
        requestId: requestId,
        lendDate: requestDate,
        returnDate: `${returnDay}-${returnMonth}-${returnYear}`,
      };

      const addDataIntoLending = await fetch(
        `http://localhost:3000/LendingBooks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(LendingBooks),
        }
      );

      //todo....write code for minus one count from quantity
      const quantityControl = await fetch(
        `http://localhost:3000/products/${bookId}`
      );
      const quantityBook = await quantityControl.json();
      // console.log(quantityBook)

      //minus one book from bookCopies / count
      const updateCopies = parseInt(quantityBook.bookCopies) - 1;
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

      const updatedBook = await updateResponse.json();
      //console.log(updatedBook)
      // auto delete after the added data
      if (addDataIntoLending.ok) {
        //ashes on fire.....! Check the poist request is ok
        await fetch(`http://localhost:3000/LendingRequest/${requestId}`, {
          method: "DELETE",
        });

        // Refresh the table
        location.reload();
      }
    });
  });

  //remove button event listener
  document.querySelectorAll(".btnReject").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const requestId = event.target.getAttribute("data-requestId");

      // Delete the request
      await fetch(`http://localhost:3000/LendingRequest/${requestId}`, {
        method: "DELETE",
      });

      // Refresh the table
      location.reload(); 
    });
  });
});
