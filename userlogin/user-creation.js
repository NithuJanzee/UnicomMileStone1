document.getElementById('userCreationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    let user = {
        name: document.getElementById('Create-user-name').value,
        NIC: document.getElementById('Create-Id').value,
        password: document.getElementById('Create-password').value,
        email: document.getElementById('Create-email').value,
        number: document.getElementById('Create-phone-num').value
    };

    const fetchUsersFromServer = async () => {
        try {
            const response = await fetch('http://localhost:3000/user');
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users from server:');
            return [];
        }
    };

    //get data from form and adding user into server 
    const addUserToServer = async (user) => {
        try {
            const addUserResponse = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (!addUserResponse.ok) throw new Error('Failed to add user to server');

            const addedUser = await addUserResponse.json();
            console.log('Successfully added user:');
            return addedUser;
        } catch (error) {
            console.error('Error processing user');
            return null;
        }
    };

    const processUser = async (user) => {
        const existingUsers = await fetchUsersFromServer();
        // Check if the user already exists
        let userExists = false;
        for (const existingUser of existingUsers) {
            if (existingUser.NIC === user.NIC || existingUser.number === user.number) {
                userExists = true;
                break; // Exit loop early if a match is found
            }
        }
        if (!userExists) {
            const addedUser = await addUserToServer(user);
            if (addedUser) {
                document.getElementById('creationMessage').textContent = "User created successfully!";
            } 
        } else {
            document.getElementById('creationMessage').textContent = "NIC or Phone number already exists in server.";
        }
    };
    
    // Process single user
    await processUser(user);

    document.getElementById('userCreationForm').reset();
    window.location.href = '../userlogin/login-form.html';

});
