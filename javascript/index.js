document.getElementById('cmnd').addEventListener('input', validateCMND);
document.getElementById('phone').addEventListener('input', validatePhone);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('confirm-password').addEventListener('input', validatePassword);

const notification = document.getElementById('notification');

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000); // Ẩn thông báo sau 5 giây
}

document.getElementById('loginBtn').addEventListener('click', function() {
    // Ẩn phần đăng ký và hiển thị phần đăng nhập
    document.getElementById('registrationContainer').style.display = 'none'; // Ẩn phần đăng ký
    document.getElementById('loginModal').style.display = 'block'; // Hiện phần đăng nhập
});

document.getElementById('signupBtn').addEventListener('click', function() {
    // Ẩn phần đăng nhập và hiển thị phần đăng ký
    document.getElementById('loginModal').style.display = 'none'; // Ẩn phần đăng nhập
    document.getElementById('registrationContainer').style.display = 'block'; // Hiện phần đăng ký
});

// Xử lý đăng ký
document.querySelector('#registrationContainer form').onsubmit = function(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định

    const cmnd = document.getElementById('cmnd').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullname = document.getElementById('fullname').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Kiểm tra các trường nhập
    if (!validateFields(cmnd, phone, email, password, confirmPassword)) {
        return; // Nếu có lỗi, không tiếp tục
    }

    // Kiểm tra xem thông tin đã tồn tại trong localStorage chưa
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const isCMNDExists = users[cmnd] !== undefined;
    const isPhoneExists = Object.values(users).some(user => user.phone === phone);
    const isEmailExists = Object.values(users).some(user => user.email === email);

    if (!isCMNDExists && !isPhoneExists && !isEmailExists) {
        // Lưu thông tin người dùng với CCCD là khóa
        users[cmnd] = { phone, email, password };
        localStorage.setItem('users', JSON.stringify(users));

        // Xóa thông tin đã nhập
        clearForm();

        // Chuyển sang phần đăng nhập
        document.getElementById('registrationContainer').style.display = 'none'; // Ẩn phần đăng ký
        document.getElementById('loginModal').style.display = 'block'; // Hiện phần đăng nhập
    } else {
        showNotification('Thông tin đã tồn tại.');
    }
};

// Kiểm tra CMND/CCCD khi người dùng nhập
document.getElementById('login_id').addEventListener('input', function() {
    const loginId = document.getElementById('login_id').value;
    const cmndError = document.querySelector('#login_id + .error'); // Vị trí để hiển thị lỗi bên dưới

    // Xóa thông báo lỗi trước đó (nếu có)
    if (cmndError) cmndError.remove();

    // Nếu số CMND/CCCD chưa đủ 12 số
    if (loginId.length !== 12) {
        const error = document.createElement('span');
        error.className = 'error';
        error.style.color = 'red';
        error.textContent = 'CMND/CCCD phải có đúng 12 số.';
        document.getElementById('login_id').insertAdjacentElement('afterend', error);
    }
});

// Kiểm tra CMND/CCCD khi người dùng nhập (chỉ kiểm tra khi loại tài khoản là thí sinh)
document.getElementById('login_id').addEventListener('input', function() {
    const loginId = document.getElementById('login_id').value;
    const cmndError = document.querySelector('#login_id + .error');
    const userType = document.querySelector('input[name="userType"]:checked').value;

    // Xóa thông báo lỗi trước đó (nếu có)
    if (cmndError) cmndError.remove();

    // Chỉ kiểm tra định dạng CMND/CCCD nếu loại tài khoản là thí sinh
    if (userType === 'student') {
        if (loginId.length !== 12) {
            const error = document.createElement('span');
            error.className = 'error';
            error.style.color = 'red';
            error.textContent = 'CMND/CCCD phải có đúng 12 số.';
            document.getElementById('login_id').insertAdjacentElement('afterend', error);
        }
    }
});

// Xử lý đăng nhập
document.querySelector('#loginForm').onsubmit = function(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định

    const loginId = document.getElementById('login_id').value;
    const loginPassword = document.getElementById('login_password').value;
    //const cmndError = document.querySelector('#login_id + .error');
    const userType = document.querySelector('input[name="userType"]:checked').value;

    if(userType === 'student'){
        // Kiểm tra thông tin trong localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const user = users[loginId]; // Lấy thông tin người dùng bằng CCCD

        if (!user) {
            showNotification('Tài khoản không tồn tại.');
            return;
        }

        if (user.password !== loginPassword) {
            showNotification('Mật khẩu không chính xác.');
            return;
        }

        // Nếu thông tin chính xác, lưu CCCD vào localStorage và chuyển hướng
        localStorage.setItem('loggedInCmnd', loginId); // Lưu CCCD vào localStorage
        window.location.href = 'thi_sinh.html'; // Chuyển đến trang mới
        return;
    }  

    // Kiểm tra tài khoản Cán bộ Tuyển sinh (không kiểm tra định dạng CCCD)
    if (userType === 'admin') {
        if (loginId === 'admin1' && loginPassword === 'admin1') {
            window.location.href = 'admin.html';
        } else {
            showNotification('Tài khoản không tồn tại.');
        }
    }
};
// Thêm sự kiện cho các liên kết
document.getElementById('backToRegister').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none'; // Ẩn phần đăng nhập
    document.getElementById('registrationContainer').style.display = 'block'; // Hiện phần đăng ký
});

document.getElementById('openLoginModal').addEventListener('click', function() {
    document.getElementById('registrationContainer').style.display = 'none'; // Ẩn phần đăng ký
    document.getElementById('loginModal').style.display = 'block'; // Hiện phần đăng nhập
});

function clearForm() {
    document.getElementById('cmnd').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
}

function validateCMND() {
    const cmnd = document.getElementById('cmnd').value;
    const errorMessage = document.querySelector('#cmnd + .error');
    if (errorMessage) errorMessage.remove();

    if (cmnd.length !== 12) {
        const error = document.createElement('span');
        error.className = 'error';
        error.style.color = 'red';
        error.textContent = 'CMND/CCCD phải có 12 số.';
        document.getElementById('cmnd').insertAdjacentElement('afterend', error);
    }
}

function validatePhone() {
    const phone = document.getElementById('phone').value;
    const errorMessage = document.querySelector('#phone + .error');
    if (errorMessage) errorMessage.remove();

    if (phone.length !== 10) {
        const error = document.createElement('span');
        error.className = 'error';
        error.style.color = 'red';
        error.textContent = 'Số điện thoại phải có 10 số.';
        document.getElementById('phone').insertAdjacentElement('afterend', error);
    }
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const errorMessage = document.querySelector('#email + .error');
    if (errorMessage) errorMessage.remove();

    // Kiểm tra email hợp lệ (đơn giản)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        const error = document.createElement('span');
        error.className = 'error';
        error.style.color = 'red';
        error.textContent = 'Email không hợp lệ.';
        document.getElementById('email').insertAdjacentElement('afterend', error);
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.querySelector('#confirm-password + .error');
    
    if (errorMessage) errorMessage.remove();

    if (password !== confirmPassword) {
        const error = document.createElement('span');
        error.className = 'error';
        error.style.color = 'red';
        error.textContent = 'Mật khẩu không khớp.';
        document.getElementById('confirm-password').insertAdjacentElement('afterend', error);
    }
}

function validateFields(cmnd, phone, email, password, confirmPassword) {
    // Kiểm tra các trường nhập
    if (cmnd.length !== 12) {
        alert('CMND/CCCD phải có 12 số.');
        return false;
    }
    if (phone.length !== 10) {
        alert('Số điện thoại phải có 10 số.');
        return false;
    }
    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp.');
        return false;
    }
    return true;
}

function toggleFields() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const loginLabel = document.getElementById('loginLabel');
    const loginIdInput = document.getElementById('login_id');
    const loginPasswordInput = document.getElementById('login_password');

    if (userType === 'admin') {
        // Thay đổi nhãn cho Cán bộ Tuyển sinh với dấu * màu đỏ
        loginLabel.innerHTML = 'Tên đăng nhập <span style="color: red;">*</span>'; 
        loginIdInput.value = ''; // Xóa thông tin đã nhập
        loginPasswordInput.value = ''; // Xóa mật khẩu đã nhập
    } else {
        // Trở về nhãn cũ cho Thí sinh (không dấu * màu đỏ)
        loginLabel.innerHTML = 'Số CMND/CCCD <span style="color: red;">*</span>'; 
        loginIdInput.value = ''; // Xóa thông tin đã nhập
        loginPasswordInput.value = ''; // Xóa mật khẩu đã nhập
    }
}

// Hàm kiểm tra các trường nhập
function validateFields(cmnd, phone, email, password, confirmPassword) {
    // Kiểm tra định dạng CMND/CCCD
    if (!/^\d{12}$/.test(cmnd)) {
        showNotification('CMND/CCCD phải có đúng 12 số.');
        return false;
    }
    // Kiểm tra các trường khác (số điện thoại, email, mật khẩu)
    if (!/^\d{10}$/.test(phone)) {
        showNotification('Số điện thoại không hợp lệ.');
        return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showNotification('Email không hợp lệ.');
        return false;
    }
    if (password !== confirmPassword) {
        showNotification('Mật khẩu không khớp.');
        return false;
    }
    return true; // Nếu tất cả điều kiện đều đúng
}



// Gán sự kiện cho nút đăng ký
document.getElementById('registerButton').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định
    document.querySelector('#registrationContainer form').dispatchEvent(new Event('submit'));
});



// Hàm hiển thị thông báo
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // Ẩn thông báo sau 3 giây
}

// Hàm xóa thông tin đã nhập
function clearForm() {
    document.getElementById('cmnd').value = '';
    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
}

;


