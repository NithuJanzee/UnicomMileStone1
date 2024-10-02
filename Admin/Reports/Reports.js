const addBooksHtml = document.getElementById("totalBooks");
const lendingRequestHtml = document.getElementById('lendingRequest');
const lendingBooksHtml = document.getElementById('lendingBooks');
const returnBooksHtml = document.getElementById('returnTable')
window.addEventListener("DOMContentLoaded", async () => {
  //nah
  // 1) Total books
  const allBooksData = await fetch("http://localhost:3000/products");
  const allBooks = await allBooksData.json();
  let totalBooksTemplate = "";
  allBooks.forEach((totalBooks) => {
    totalBooksTemplate += `<tr>
                                    <td>${totalBooks.bookName}</td>
                                    <td>${totalBooks.bookAuthor}</td>
                                    <td>${totalBooks.bookCategory}</td>
                                    <td>${totalBooks.bookCopies}</td>
                                </tr>`;
  });
  addBooksHtml.innerHTML = totalBooksTemplate;

  // 2) lending request 
  const allLendingRequest = await fetch ('http://localhost:3000/LendingRequest')
  const lendingRequest = await allLendingRequest.json()
  let lendingRequestTemplate = '';
  lendingRequest.forEach((lendingRequest)=>{
    lendingRequestTemplate += `
                                 <tr>
                                   <td>REQ${lendingRequest.id}</td>
                                   <td>${lendingRequest.bookName}</td>
                                    <td>${lendingRequest.userName}</td>
                                    <td>${lendingRequest.requestDate}</td>
                                </tr>
    `
  })
  lendingRequestHtml.innerHTML = lendingRequestTemplate 

  // 3) borrowed books / lending
  const allLendBooks = await fetch('http://localhost:3000/LendingBooks')
  const lendBooks =await allLendBooks.json()
 // console.log(lendBooks)
 let lendBookTemplate ='';
 lendBooks.forEach((lendBook)=>{
    lendBookTemplate += `
                                <tr>
                                    <td>${lendBook.bookName}</td>
                                    <td>${lendBook.userName}</td>
                                    <td>${lendBook.lendDate}</td>
                                    <td>${lendBook.returnDate}</td>
                                </tr>`                               
 }) 
 lendingBooksHtml.innerHTML = lendBookTemplate

 //4)Return Books last
 const allReturnedBooks = await fetch ('http://localhost:3000/ReturnedBook');
 const returnBooks = await allReturnedBooks.json()
 let returnBookTemplate = ''
 returnBooks.forEach((returnBook)=>{
    returnBookTemplate += `<tr>
                                    <td>${returnBook.bookName}</td>
                                    <td>${returnBook.userName}</td>
                                    <td>${returnBook.bookLentDate}</td>
                                    <td>${returnBook.bookDueDate}</td>
                                    <td>${returnBook.bookReturnDate}</td>
                                    <td id="ontime">${returnBook.status}</td>
                                </tr>`
 })
 returnBooksHtml.innerHTML = returnBookTemplate

});
