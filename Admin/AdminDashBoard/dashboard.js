const totalUser = document.getElementById('totalUserCount');
const totalBook = document.getElementById('totalBookCount');
const totalPending = document.getElementById('totalPending');
const totalLended = document.getElementById('borowed');
const tableUsers = document.getElementById('adminDashboardUserDetails');
window.addEventListener('DOMContentLoaded', async () => {
    //UPDATE OVERVIEW   
    const allUserData = await fetch(`http://localhost:3000/user`);
    const userData = await allUserData.json()
    const Userdatalength = userData.length;
    totalUser.innerHTML = Userdatalength

    const allBookData = await fetch(`http://localhost:3000/products`);
    const bookData = await allBookData.json()
    const bookDatalength = bookData.length;
    totalBook.innerHTML = bookDatalength;

    const allPendingRequest = await fetch(`http://localhost:3000/LendingRequest`)
    const pendingData = await allPendingRequest.json()
    const pendingDataLength = pendingData.length;
    totalPending.innerHTML = pendingDataLength

    const alllendedBooks = await fetch(`http://localhost:3000/LendingBooks`)
    const lendedData = await alllendedBooks.json()
    const lendedBookLength = lendedData.length;
    totalLended.innerHTML = lendedBookLength;
    // am going to add user details in admin dashboard
    let userDataTable = '';
    userData.forEach(user => {
        userDataTable += `
                        <tr>
                        <td>LY-${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.NIC}</td>
                        <td>${user.number}</td>
                    </tr>
        `
    });
    tableUsers.innerHTML = userDataTable
})