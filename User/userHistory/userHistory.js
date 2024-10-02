const yourCartHtml = document.getElementById('yourCartDetails');
const pendingRequestHtml = document.getElementById('PendingRequst');
const lendingBooksHtml = document.getElementById('lendingBooks');
const returnBooksHtml = document.getElementById('returnBooks');
window.addEventListener('DOMContentLoaded', async ()=>{
    const user = localStorage.getItem('loggedInUserId')
    if(user){
        const getUser = await fetch (`http://localhost:3000/user/${user}`)
        const userDetails = await getUser.json();
        

        //1) user cart details table
        const productDetailArray = []
        for(const productId of userDetails.cart){
            const getProduct = await fetch (`http://localhost:3000/products/${productId}`)
            const productDetail = await getProduct.json();
            productDetailArray.push(productDetail)
        }
        
        let template = '';
        productDetailArray.forEach((product)=>{
            template+= `
            <tr>
            <td>${product.bookName}</td>
            <td>${product.bookAuthor}</td>
            <td>1</td>
        </tr>

            `
        }) 
        yourCartHtml.innerHTML = template;    



        // 2) pending request 

        const LendingRequestData = await fetch (`http://localhost:3000/LendingRequest`)
        const allLendingRequestData =await LendingRequestData.json() 
       // console.log(allLendingRequestData)
        const filteredRequests = allLendingRequestData.filter(request => request.userId === user);
       let pendingRequestTemplate = '';
       filteredRequests.forEach((details)=>{
        pendingRequestTemplate +=  `
        <tr>
                            <td>${details.id}</td>
                            <td>${details.bookName}</td>
                            <td>Pending</td>
                        </tr>
        `
       })
       pendingRequestHtml.innerHTML = pendingRequestTemplate;



       // 3) Lending books
       const getLendingBookData = await fetch (`http://localhost:3000/LendingBooks`)
       const allLendingBookData = await getLendingBookData.json()
      // console.log(allLendingBookData) 
       //filter the data for user
       const filterLendingBooks = allLendingBookData.filter(request => request.userId === user)
      // console.log(filterLendingBooks)
      let lendingBooksTemplate = '';
      filterLendingBooks.forEach((lending)=>{
        lendingBooksTemplate += `
        <tr>
                            <td>${lending.bookName}</td>
                            <td>${lending.lendDate}</td>
                            <td>${lending.returnDate}</td>
                        </tr>
                        `
      })

      lendingBooksHtml.innerHTML = lendingBooksTemplate


      // 4) returned Books
      const getReturnBookData = await fetch (`http://localhost:3000/ReturnedBook`)
      const allReturnBookData = await getReturnBookData.json()
      //console.log(allReturnBookData)
      const filterReturnBooks = allReturnBookData.filter(request => request.userId === user)
      //console.log(filterReturnBooks)
      let returnBooksTemplate = '';
      filterReturnBooks.forEach((data)=>{
        returnBooksTemplate += ` 
        <tr>
                            <td>${data.bookName}</td>
                            <td>${data.bookLentDate}</td>
                            <td>${data.bookDueDate}</td>
                            <td>${data.bookReturnDate}</td>
                            <td id="status">${data.status}</td>
                        </tr>
        `
      })
      returnBooksHtml.innerHTML = returnBooksTemplate

    }
    else(alert('please login'))
})