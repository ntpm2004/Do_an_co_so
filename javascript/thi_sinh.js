// Hàm để lấy thông tin người dùng từ Local Storage
function getUserData() {
    const userData = localStorage.getItem('users'); // Thay 'user_data' bằng 'users'
    if (userData) {
        const users = JSON.parse(userData);
        return users[0]; // Lấy đối tượng người dùng đầu tiên
    }
    return null;
}

// Hàm hiển thị thông tin người dùng và điều chỉnh header
function displayUserInfo() {
    const userData = getUserData();
    const userNameDiv = document.getElementById('userName'); 
    const logoutBtn = document.getElementById('logoutBtn');

    if (userData) {
        // Hiển thị tên thí sinh
        userNameDiv.textContent = `Xin chào, ${userData.fullname}`; 
        userNameDiv.style.display = 'block'; 
        logoutBtn.style.display = 'inline'; 
    } else {
        userNameDiv.style.display = 'none'; 
        logoutBtn.style.display = 'none'; 
        window.location.href = 'index.html'; 
    }
}