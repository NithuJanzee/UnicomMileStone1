window.addEventListener("DOMContentLoaded", async () => {
  const user = localStorage.getItem("loggedInUserId");
  if (user) {
    //console.log(user)
    const fetchData = await fetch(`http://localhost:3000/user/${user}`);
    const userData = await fetchData.json();
    //add data dynamically
    const userProfile = document.querySelector(".user-data-section");
    userProfile.innerHTML = `<form class="user-data-table">
                    <label>ID:</label>
                    <input type="text" value="${userData.id}" disabled>

                    <label>Name:</label>
                    <input type="text" value="${userData.name}" disabled>

                    <label>NIC:</label>
                    <input type="text" value="${userData.NIC}" disabled>

                    <label>Password:</label>
                    <input type="text" value="${userData.password}" disabled>

                    <label>Email:</label>
                    <input type="text" value="${userData.email}" disabled>

                    <label>Phone Number:</label>
                    <input type="text" value="${userData.number}" disabled>
                </form>`;

    // const name = document.getElementById('name');
    // const NIC = document.getAnimations('NIC');
    // const email = document.getElementById('email')
    // const number = document.getElementById('number')

    //edit user information
    // Handle form submission
    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from submitting the default way

        const updatedUserData = {
          name: document.getElementById("name").value,
          NIC: document.getElementById("NIC").value,
          //todo if i allow to change nic and password i should check if it already exit or not
          //its time kill
          // password: document.getElementById('password').value,
          email: document.getElementById("email").value,
          number: document.getElementById("number").value,
        };
        const response = await fetch(`http://localhost:3000/user/${user}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        });
      });
  } else alert("please log in");
});
