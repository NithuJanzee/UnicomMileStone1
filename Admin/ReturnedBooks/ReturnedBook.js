const uppendHtml = document.querySelector('.product-grid');

window.addEventListener('DOMContentLoaded', async () => {
    const getAllReurnData = await fetch(`http://localhost:3000/ReturnedBook`);
    const ReturnBooks = await getAllReurnData.json()
    let template = '';
    ReturnBooks.forEach(data => {
        template += `
        <div class="product-item">
            <img src="../BookImages/${data.bookImage}" alt="Book Cover 1">
            <p class="product-name">${data.userName}</p>
            <p class="product-name">${data.bookName}</p>
            <p class="request-date">Request Date: ${data.bookLentDate}</p>
            <p class="request-date">due Date: ${data.bookDueDate}</p>
            <p class="request-date">Return Date: ${data.bookReturnDate}</p>
            <p class="request-date">status: ${data.status}</p>
            <p class="quantity">Quantity: 1</p>
        </div>
    `
    });

    uppendHtml.innerHTML = template

})
