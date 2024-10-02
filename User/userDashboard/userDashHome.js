const myCart = document.getElementById("mycartInDashboard");
// Todo dash board is too much messy (codes are fine) make it organized
export const PendingRequestDashboard = document.getElementById(
  "PendingRequestDashboard"
);
//console.log(PendingRequestDashboard)

// just a little try fetch data and save into a variable. mainly reuse this as a function todo optimize code with this
export const renderPost = async (userId) => {
  let uri = await fetch(`http://localhost:3000/user/${userId}`);
  return uri;
};

window.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("loggedInUserId");
  if (userId) {
    // const response = await fetch(`http://localhost:3000/user/${userId}`);
    const response = await renderPost(userId); //LOL i did it just pass the argument
    const user = await response.json();
    const userName = document.querySelector(".profile-section");

    if (userName) {
      userName.textContent = `Welcome ${user.name} 😀`;
    }
    if (user.cart) {
      myCart.textContent = `book: ${user.cart.length}`;
    }
  }

  //dynamically add lending request table inside dashboard

  if (userId) {
    // Fetch the user data
    const getUser = await fetch(`http://localhost:3000/user/${userId}`);
    const user = await getUser.json();

    // An array to save product details
    const cartDetails = [];

    // Loop through each product ID in the user's cart
    for (const productId of user.cart) {
      // Fetch product details by product ID
      const getProduct = await fetch(
        `http://localhost:3000/products/${productId}`
      );
      const product = await getProduct.json();

      // Add products into cartDetails array
      cartDetails.push(product);
    }

    // Log cart details for debugging
    //console.log(cartDetails);

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const updateTable = document.getElementById("updateRequsetTable");
    let template = "";

    cartDetails.forEach((product) => {
      template += `
                    <tr>
                        <td>${product.bookName}</td>
                        <td>${product.bookAuthor}</td>
                        <td>${product.bookCategory}</td>
                        <td>1</td>
                        <td>${year}-${month}-${day}</td>
                        <td>
                            <button class="request-btn" data-userid="${userId}"
                             data-bookId="${product.id}" 
                             data-bookName="${product.bookName}" 
                             data-bookImage="${product.bookImage}"
                             data-quantity="${product.bookCopies}"
                             data-author="${product.bookAuthor}">Request</button> 
                            <button class="remove-btn" data-bookId="${product.id}">Remove</button>
                        </td>
                    </tr>
                `;
    });

    updateTable.innerHTML = template;

    // Add event listeners to "Request" buttons
    const requestButtons = document.querySelectorAll(".request-btn");
    requestButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const userId = event.target.getAttribute("data-userId");
        const bookId = event.target.getAttribute("data-bookId");
        const bookName = event.target.getAttribute("data-bookName");
        const bookImage = event.target.getAttribute("data-bookImage");
        const bookQuantity = event.target.getAttribute("data-quantity");
        const bookAuthor = event.target.getAttribute("data-author");
        // Handle the lending request

        // Send POST request to add lending request
        const lendingRequest = {
          userId: userId,
          userName: user.name,
          bookName: bookName,
          bookAuthor: bookAuthor,
          bookImage: bookImage,
          bookId: bookId,
          bookQuantity: bookQuantity,
          requestDate: `${day}-${month}-${year}`,
          status: "Pending",
        };

        const response = await fetch("http://localhost:3000/LendingRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lendingRequest),
        });

        if (!response.ok) throw new Error("cannot make a lending request");

        // Remove the book from user's cart
        //91
        const updatedCart = user.cart.filter((id) => id !== bookId);
        user.cart = updatedCart;

        // Update new user.cart data on the server
        const updateUserResponse = await fetch(
          `http://localhost:3000/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (!updateUserResponse.ok)
          throw new Error("Failed to update user cart");

        // Update the UI by removing the row or refreshing the cart details
        event.target.closest("tr").remove();
      });
    });

    // Add event listeners to "Remove" buttons
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const bookId = event.target.getAttribute("data-bookid");

        // Handle the remove button

        // Remove the book from user's cart
        const updatedCart = user.cart.filter((id) => id !== bookId);
        user.cart = updatedCart;

        // Update user data on the server
        const updateUserResponse = await fetch(
          `http://localhost:3000/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (!updateUserResponse.ok)
          throw new Error("Failed to update user cart");

        // Update the UI by removing the row
        event.target.closest("tr").remove();
      });
    });
  }
});
