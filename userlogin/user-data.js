document.getElementById('LoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let enteredNIC = document.getElementById('inputID').value;
    let enteredPassword = document.getElementById('inputPassword').value;
    let loginMessage = document.getElementById('loginMessage');

    try {
        const response = await fetch("http://localhost:3000/user");
        if (!response.ok) throw new Error('Network response was not ok');

        //check the exit data and input data are same or not
        const users = await response.json();
        const user = users.find(user => user.NIC === enteredNIC && user.password === enteredPassword);

        if (user) {
            loginMessage.textContent = "Login successful!";
            loginMessage.style.color = "green";

            // Store user info in local storage
            localStorage.setItem('loggedInUserId', user.id);

            setTimeout(() => {
                window.location.href = "../User/user-home/userHome.html";
            }, 500);
        } else {
            loginMessage.textContent = "Invalid NIC or password.";
            loginMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        loginMessage.textContent = "Please try again.";
        loginMessage.style.color = "red";
    }
});
