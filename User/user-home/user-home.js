const container = document.querySelector('.products-grid');
const cartQuantity = document.getElementById('cartQuantity');
const searchBar = document.querySelector('.search-bar');


const renderPost = async (searchQuery = "") => {
    let uri = "http://localhost:3000/products";
    const res = await fetch(uri);
    let products = await res.json();

    // search function / filter 
    if (searchQuery) {
        products = products.filter(product =>
            product.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    //dynamically add product into product grid
    let template = "";
    products.forEach((product) => {
        template += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="./BookImages/${product.bookImage}" />
                </div>
                <div class="product-name limit-text-to-2-lines">
                    ${product.bookName}
                </div>
                <div class="product-price">${product.bookAuthor}</div>
                <button class="add-to-cart-button button-primary" data-id="${product.id}">Add to Cart</button>
            </div>`;
    });

    container.innerHTML = template;
    addEventListeners();
};

//dynamic add cart button functions  addEventListeners to add cart button
const addEventListeners = () => {
    const buttons = document.querySelectorAll('.add-to-cart-button');
    buttons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
};

const handleAddToCart = async (event) => {
    const button = event.target;
    const productId = button.getAttribute('data-id');
    const userId = localStorage.getItem('loggedInUserId');

    if (!userId) {
        alert('User not logged in');
        return;
    }


        // Fetch user data
        const userResponse = await fetch(`http://localhost:3000/user/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');

        const user = await userResponse.json();

       // console.log(user)

        // Update user's cart
        if (!user.cart) {
            user.cart = [];
        }
        user.cart.push(productId);

        const updateUserResponse = await fetch(`http://localhost:3000/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!updateUserResponse.ok) throw new Error('Failed to update user data');

        // Update cart quantity in UI
        cartQuantity.textContent = user.cart.length;
    
};

// todo use async await thats simple this is kind a complicated


// window.addEventListener("DOMContentLoaded", () => {
//     renderPost();

//     //update cart quantity if already added on the cart   
//     const userId = localStorage.getItem('loggedInUserId');
//     if (userId) {
//         fetch(`http://localhost:3000/user/${userId}`)
//             .then(response => response.json())
//             .then(user => {

//                 //greet user
//                 const userName = document.querySelector('.category-list');
//                 const smileEmoji = String.fromCodePoint(0x1F600);
//                 userName.innerHTML = `Hello ${user.name} ${smileEmoji}`;
//                 if (user.cart) {
//                     //todo update by length if user add same book again it take as two book add some validation 
//                     cartQuantity.textContent = user.cart.length;
//                 }
//             })
//             .catch(error => console.error('Error fetching user cart:', error));
//     }
// });

window.addEventListener("DOMContentLoaded", async () => {
    renderPost();

    //update cart quantity if already added on the cart   
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
       
            const response = await fetch(`http://localhost:3000/user/${userId}`);
            const user = await response.json();
            //greet user 
            const userName = document.querySelector('.category-list');
            const smileEmoji = String.fromCodePoint(0x1F600);
            userName.innerHTML = `Hello ${user.name} ${smileEmoji}`;


            if(user.cart){
                cartQuantity.textContent = user.cart.length;
            }
        
        
    }else(alert('please login'))
});
searchBar.addEventListener('input', (e) => {
    renderPost(e.target.value);
});
