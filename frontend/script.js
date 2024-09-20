// Handle fetching all registered users
document.getElementById('fetchUsersBtn').addEventListener('click', async function() {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const users = await response.json();
    if (response.ok) {
      let userListHtml = `
        <table id="userTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date of Birth</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>`;

      users.forEach(user => {
        userListHtml += `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.dob}</td>
            <td>${user.address}</td>
          </tr>`;
      });

      userListHtml += `</tbody></table>`;
      document.getElementById('userList').innerHTML = userListHtml;
    } else {
      document.getElementById('userList').innerText = 'Error fetching users.';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('userList').innerText = 'Error fetching users.';
  }
});
