// Hàm hiển thị thông báo
function showNotification(message) {
    alert(message); // Thay thế bằng một thông báo tùy chỉnh nếu muốn
}

// Hàm lưu thông tin học bạ
function saveReportCard() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập trước khi lưu');
        return;
    }

    // Lấy dữ liệu từ các trường học bạ
    const reportCardData = {
        toan_ky1_lop11: document.getElementById('toan_ky1_lop11').value,
        toan_ky2_lop11: document.getElementById('toan_ky2_lop11').value,
        toan_ky1_lop12: document.getElementById('toan_ky1_lop12').value,
        ly_ky1_lop11: document.getElementById('ly_ky1_lop11').value,
        ly_ky2_lop11: document.getElementById('ly_ky2_lop11').value,
        ly_ky1_lop12: document.getElementById('ly_ky1_lop12').value,
        hoa_ky1_lop11: document.getElementById('hoa_ky1_lop11').value,
        hoa_ky2_lop11: document.getElementById('hoa_ky2_lop11').value,
        hoa_ky1_lop12: document.getElementById('hoa_ky1_lop12').value,
        sinh_ky1_lop11: document.getElementById('sinh_ky1_lop11').value,
        sinh_ky2_lop11: document.getElementById('sinh_ky2_lop11').value,
        sinh_ky1_lop12: document.getElementById('sinh_ky1_lop12').value,
        van_ky1_lop11: document.getElementById('van_ky1_lop11').value,
        van_ky2_lop11: document.getElementById('van_ky2_lop11').value,
        van_ky1_lop12: document.getElementById('van_ky1_lop12').value,
        su_ky1_lop11: document.getElementById('su_ky1_lop11').value,
        su_ky2_lop11: document.getElementById('su_ky2_lop11').value,
        su_ky1_lop12: document.getElementById('su_ky1_lop12').value,
        dia_ky1_lop11: document.getElementById('dia_ky1_lop11').value,
        dia_ky2_lop11: document.getElementById('dia_ky2_lop11').value,
        dia_ky1_lop12: document.getElementById('dia_ky1_lop12').value,
        anh_ky1_lop11: document.getElementById('anh_ky1_lop11').value,
        anh_ky2_lop11: document.getElementById('anh_ky2_lop11').value,
        anh_ky1_lop12: document.getElementById('anh_ky1_lop12').value,
        gdcd_ky1_lop11: document.getElementById('gdcd_ky1_lop11').value,
        gdcd_ky2_lop11: document.getElementById('gdcd_ky2_lop11').value,
        gdcd_ky1_lop12: document.getElementById('gdcd_ky1_lop12').value,
        nhat_ky1_lop11: document.getElementById('nhat_ky1_lop11').value,
        nhat_ky2_lop11: document.getElementById('nhat_ky2_lop11').value,
        nhat_ky1_lop12: document.getElementById('nhat_ky1_lop12').value,
        trung_ky1_lop11: document.getElementById('trung_ky1_lop11').value,
        trung_ky2_lop11: document.getElementById('trung_ky2_lop11').value,
        trung_ky1_lop12: document.getElementById('trung_ky1_lop12').value,
        han_ky1_lop11: document.getElementById('han_ky1_lop11').value,
        han_ky2_lop11: document.getElementById('han_ky2_lop11').value,
        han_ky1_lop12: document.getElementById('han_ky1_lop12').value,
    };

    // Tạo khóa duy nhất cho học bạ dựa trên CCCD
    const storageKey = `hoc_ba_data_${loggedInCmnd}`;

    // Lưu dữ liệu vào localStorage
    localStorage.setItem(storageKey, JSON.stringify(reportCardData));
    showNotification('Thông tin học bạ đã được lưu thành công!');
    // Đổi chữ nút lưu thành ĐÃ LƯU và vô hiệu hóa
    //const saveButton_Ttin = document.getElementById('save_hoc_ba');
   // saveButton_Ttin.textContent = 'ĐÃ LƯU';
   // saveButton_Ttin.disabled = true;
}

// Hàm tải thông tin học bạ
function loadReportCard() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập để xem học bạ.');
        return;
    }

    // Tạo khóa duy nhất cho học bạ dựa trên CCCD
    const storageKey = `hoc_ba_data_${loggedInCmnd}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
        const reportCardData = JSON.parse(savedData);

        // Gán giá trị vào các trường tương ứng
        document.getElementById('toan_ky1_lop11').value = reportCardData.toan_ky1_lop11;
        document.getElementById('toan_ky2_lop11').value = reportCardData.toan_ky2_lop11;
        document.getElementById('toan_ky1_lop12').value = reportCardData.toan_ky1_lop12;
        document.getElementById('ly_ky1_lop11').value = reportCardData.ly_ky1_lop11;
        document.getElementById('ly_ky2_lop11').value = reportCardData.ly_ky2_lop11;
        document.getElementById('ly_ky1_lop12').value = reportCardData.ly_ky1_lop12;
        document.getElementById('hoa_ky1_lop11').value = reportCardData.hoa_ky1_lop11;
        document.getElementById('hoa_ky2_lop11').value = reportCardData.hoa_ky2_lop11;
        document.getElementById('hoa_ky1_lop12').value = reportCardData.hoa_ky1_lop12;
        document.getElementById('sinh_ky1_lop11').value = reportCardData.sinh_ky1_lop11;
        document.getElementById('sinh_ky2_lop11').value = reportCardData.sinh_ky2_lop11;
        document.getElementById('sinh_ky1_lop12').value = reportCardData.sinh_ky1_lop12;
        document.getElementById('van_ky1_lop11').value = reportCardData.van_ky1_lop11;
        document.getElementById('van_ky2_lop11').value = reportCardData.van_ky2_lop11;
        document.getElementById('van_ky1_lop12').value = reportCardData.van_ky1_lop12;
        document.getElementById('su_ky1_lop11').value = reportCardData.su_ky1_lop11;
        document.getElementById('su_ky2_lop11').value = reportCardData.su_ky2_lop11;
        document.getElementById('su_ky1_lop12').value = reportCardData.su_ky1_lop12;
        document.getElementById('dia_ky1_lop11').value = reportCardData.dia_ky1_lop11;
        document.getElementById('dia_ky2_lop11').value = reportCardData.dia_ky2_lop11;
        document.getElementById('dia_ky1_lop12').value = reportCardData.dia_ky1_lop12;
        document.getElementById('anh_ky1_lop11').value = reportCardData.anh_ky1_lop11;
        document.getElementById('anh_ky2_lop11').value = reportCardData.anh_ky2_lop11;
        document.getElementById('anh_ky1_lop12').value = reportCardData.anh_ky1_lop12;
        document.getElementById('gdcd_ky1_lop11').value = reportCardData.gdcd_ky1_lop11;
        document.getElementById('gdcd_ky2_lop11').value = reportCardData.gdcd_ky2_lop11;
        document.getElementById('gdcd_ky1_lop12').value = reportCardData.gdcd_ky1_lop12;
        document.getElementById('nhat_ky1_lop11').value = reportCardData.nhat_ky1_lop11;
        document.getElementById('nhat_ky2_lop11').value = reportCardData.nhat_ky2_lop11;
        document.getElementById('nhat_ky1_lop12').value = reportCardData.nhat_ky1_lop12;
        document.getElementById('trung_ky1_lop11').value = reportCardData.trung_ky1_lop11;
        document.getElementById('trung_ky2_lop11').value = reportCardData.trung_ky2_lop11;
        document.getElementById('trung_ky1_lop12').value = reportCardData.trung_ky1_lop12;
        document.getElementById('han_ky1_lop11').value = reportCardData.han_ky1_lop11;
        document.getElementById('han_ky2_lop11').value = reportCardData.han_ky2_lop11;
        document.getElementById('han_ky1_lop12').value = reportCardData.han_ky1_lop12;
    } else {
       showNotification('Chưa có dữ liệu học bạ được lưu.');
    }
}
// Gán sự kiện cho nút lưu học bạ
document.getElementById('save_hoc_ba').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định
    saveReportCard(); // Gọi hàm lưu học bạ
});

// Tải thông tin học bạ khi trang được tải
window.onload = function() {
    if (localStorage.getItem('loggedInCmnd')) {
        loadReportCard(); // Tải thông tin học bạ
    }
};