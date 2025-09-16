document.querySelector('.signout-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const studentList = document.getElementById('student-list');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Function to display students in the table
    function displayStudents(filteredUsers) {
        studentList.innerHTML = ''; // Clear existing list

        if (filteredUsers.length === 0) {
            alert('Không tìm thấy sinh viên.');
            return;
        }

        // Loop through each user
        filteredUsers.forEach((cmnd, index) => {
            const userDetails = JSON.parse(localStorage.getItem(`thong_tin_data_${cmnd}`)) || {};
            const userWishes = JSON.parse(localStorage.getItem(`wishes_data_${cmnd}`)) || [];

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${userDetails.name || 'Chưa có tên'}</td>
                <td>${cmnd}</td>
                <td>${users[cmnd].phone || 'Chưa có số điện thoại'}</td>
                <td>
                    <table>
                        ${userWishes.length > 0 ? userWishes.map(wish => `<tr><td>${wish.major}</td></tr>`).join('') : '<tr><td>Không có nguyện vọng</td></tr>'}
                    </table>
                </td>
                <td>
                    <table>
                        ${userWishes.length > 0 ? userWishes.map((wish, index) => `<tr><td>${index + 1}</td></tr>`).join('') : '<tr><td>Không có</td></tr>'}
                    </table>
                </td>
                <td><button class="view-button" data-cmnd="${cmnd}">Xem</button></td>
            `;
            studentList.appendChild(row);
        });
    }

    // Initial display of all students
    displayStudents(Object.keys(users));

    // Handle the search form submission
    const filterForm = document.querySelector('.filter-form form');
    filterForm.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('ho-ten').value.toLowerCase();
        const cmnd = document.getElementById('cmnd').value.trim();
        const phone = document.getElementById('sdt').value.trim();
        const major = document.getElementById('nganh').value;

        const filteredUsers = Object.keys(users).filter(cmnd => {
            const userDetails = JSON.parse(localStorage.getItem(`thong_tin_data_${cmnd}`)) || {};
            const userWishes = JSON.parse(localStorage.getItem(`wishes_data_${cmnd}`)) || [];

            const matchesName = !name || (userDetails.name && userDetails.name.toLowerCase().includes(name));
            const matchesCMND = !cmnd || cmnd.includes(cmnd);
            const matchesPhone = !phone || (users[cmnd].phone && users[cmnd].phone.includes(phone));
            const matchesMajor = !major || userWishes.some(wish => wish.major === major);

            return matchesName && matchesCMND && matchesPhone && matchesMajor;
        });

        displayStudents(filteredUsers);
    };

    // Reset button functionality
    document.querySelector('.reset-btn').onclick = function() {
        document.getElementById('ho-ten').value = '';
        document.getElementById('cmnd').value = '';
        document.getElementById('sdt').value = '';
        document.getElementById('nganh').value = '';

        displayStudents(Object.keys(users)); // Show all students
    };
});