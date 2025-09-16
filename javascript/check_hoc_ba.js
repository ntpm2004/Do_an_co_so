// Hàm lấy dữ liệu từ Local Storage
function getSavedData() {
    const savedData = localStorage.getItem('hoc_ba_data');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
}

// Hàm hiển thị dữ liệu ra bảng
function displayData() {
    const savedData = getSavedData();
    const tableBody = document.querySelector('#dataTable tbody');
    
    if (savedData) {
        // Duyệt qua từng môn học và hiển thị dữ liệu
        for (const subject of savedData) {
            const row = tableBody.insertRow();
            const subjectCell = row.insertCell(0);
            const classCell = row.insertCell(1);
            const scoreCell = row.insertCell(2);
            
            subjectCell.textContent = subject.monHoc;
            classCell.textContent = subject.lop;
            scoreCell.textContent = subject.diem;
        }
    } else {
        tableBody.innerHTML = '<tr><td colspan="3">Không có dữ liệu trong Local Storage</td></tr>';
    }
}

// Gọi hàm hiển thị khi trang tải xong
window.onload = displayData;