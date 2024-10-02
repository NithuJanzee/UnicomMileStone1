const uppendHtml = document.querySelector(".product-grid");
window.addEventListener("DOMContentLoaded", async () => {
    const allLendingBooks = await fetch(`http://localhost:3000/LendingBooks`);
    const lendingBooks = await allLendingBooks.json();
    let template = ``;
    lendingBooks.forEach((data) => {
      template += `
                <div class="product-item">
                    <img src="../BookImages/${data.bookImage}" alt="Book Cover 1">
                    <p class="product-name">${data.bookName}</p>
                    <p class="product-name">${data.userName}</p>
                    <p class="request-date">Lent Date: ${data.lendDate}</p>
                    <p class="request-date">Due Date: ${data.returnDate}</p>
                    <p class="request-date">Status: pending</p>
                </div>
            `;
    });
    uppendHtml.innerHTML = template;
  
});
