const htmlPage = document.querySelector(".requests");
const logedUser = localStorage.getItem("loggedInUserId");
const userIdToFilter = logedUser;
//console.log(PendingRequestDashboard)

if (userIdToFilter) {
  window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(`http://localhost:3000/LendingRequest`);
    // if (!response.ok) {
    //     throw new Error('Failed to fetch data');
    // }
    const allRequests = await response.json();

    //  const requestDetails= []

    // Filter array find objects with the specified id
    const filteredRequests = allRequests.filter(
      (request) => request.userId === userIdToFilter
    );
    // Loop through each object in the filtered results
    // filteredRequests.forEach(requestObject => {
    //     //adding request details into requestObject array
    //     requestDetails.push(requestObject)
    // });

    const bookDetailsArray = [];
    for (const request of filteredRequests) {
      const bookId = request.bookId;
      //console.log(bookId)
      const books = await fetch(`http://localhost:3000/products/${bookId}`);
      const bookDetails = await books.json();
      bookDetailsArray.push(bookDetails);
      //exportForCount.push(bookDetails)
      //console.log(bookDetails)
    }
    // console.log(requestDetails)
    //lets update the html page dynamically
    let template = "";
    bookDetailsArray.forEach((books) => {
      template += `
                <div class="request-item"> 
                <div class="book-details">
                        <img src=../user-home/BookImages/${books.bookImage} alt="Book Cover" class="book-cover">
                        <div class="details">
                            <h2>${books.bookName}</h2>
                            <p>Author: ${books.bookAuthor}</p>
                            <p>Quantity Requested: 1</p>
                        </div>
                        
                       
                    </div>
                    <div class="actions">
                        <button class="btn pending">Pending......</button>
                    </div>
                    </div>`;
    });
    htmlPage.innerHTML = template;
  });
} else alert("please log in");
