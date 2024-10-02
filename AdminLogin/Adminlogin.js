document.getElementById('LoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const UserInputID = document.getElementById('inputID').value
    const UserInputPassword = document.getElementById('inputPassword').value
    let loginMessage = document.getElementById('loginMessage');

    const AllAdminDetails = await fetch("http://localhost:3000/Admins");
    const AdminDetails = await AllAdminDetails.json();
    
    const Admins = AdminDetails.find(Admins => Admins.NIC === UserInputID && Admins.password === UserInputPassword)
    if(Admins){
        loginMessage.textContent = "Login successfully";
        loginMessage.style.color = "green";
        
        console.log(Admins)

        setTimeout(() => {
            window.location.href = "../Admin/AdminDashBoard/dashboard.html"
        }, 500);
    }
    else{
        loginMessage.textContent = "Invalid Id or Password"
        loginMessage.style.color = "red";   
    }


})