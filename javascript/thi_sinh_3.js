// Hàm hiển thị thông báo
function showNotification(message) {
    alert(message); // Thay thế bằng một thông báo tùy chỉnh nếu muốn
}
// Hàm lưu nguyện vọng
function saveWishes() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập trước khi lưu nguyện vọng');
        return;
    }

    const wishes = [];
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const majorSelect = section.querySelector('select[id^="major"]');
        const blockSelect = section.querySelector('select[id^="block"]');
        wishes.push({
            major: majorSelect.value,
            block: blockSelect.value
        });
    });

    // Tạo khóa duy nhất cho nguyện vọng dựa trên CCCD
    const storageKey_Nvong = `wishes_data_${loggedInCmnd}`;

    // Lưu dữ liệu vào localStorage
    localStorage.setItem(storageKey_Nvong, JSON.stringify(wishes));
    showNotification('Nguyện vọng đã được lưu thành công!');
    
    // Đổi chữ nút lưu thành ĐÃ LƯU và vô hiệu hóa
    //const saveButton_Wishes = document.getElementById('save_wishes');
    //saveButton_Wishes.textContent = 'ĐÃ LƯU';
    //saveButton_Wishes.disabled = true;
}
// Hàm tải nguyện vọng
function loadWishes() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập để xem nguyện vọng.');
        return;
    }

    // Tạo khóa duy nhất cho nguyện vọng dựa trên CCCD
    const storageKey_Nvong = `wishes_data_${loggedInCmnd}`;
    const savedData_Nvong = localStorage.getItem(storageKey_Nvong);

    if (savedData_Nvong) {
        savedData_Nvong.forEach((wish, index) => {
            if (index < 3) { // Chỉ tải tối đa 3 nguyện vọng
                const currentWish = document.getElementById(`wish-${index + 1}`);
                const majorSelect = currentWish.querySelector('select[id^="major"]');
                const blockSelect = currentWish.querySelector('select[id^="block"]');
                majorSelect.value = wish.major;
                
                // Cập nhật danh sách tổ hợp xét tuyển dựa trên ngành đã chọn
                updateBlocks(majorSelect, blockSelect);
                
                // Gán giá trị tổ hợp đã lưu
                blockSelect.value = wish.block;
            }
        });
}}

// Biến kiểm tra xem thông tin đã được lưu hay chưa
let isSavedwish = false;

// Hàm để kiểm tra xem thông tin đã được lưu chưa từ Local Storage
function checkIfSavedwish() {
    const savedata_ttin = localStorage.getItem(`wishes_data_${loggedInCmnd}`);
    if (savedata_ttin) {
        isSaved = true;
		//document.getElementById('deleteWishbutton').style.display = 'none';
		//document.getElementById('deleteWishbutton').disabled = true; // Vô hiệu hóa nút
		//document.getElementById('addWishBtn').style.display = 'none'; // Đổi văn bản nút
        //document.getElementById('save_nguyen_vong').textContent = 'ĐÃ LƯU'; // Đổi văn bản nút
        //document.getElementById('save_nguyen_vong').disabled = true; // Vô hiệu hóa nút
    }
}


// Gắn sự kiện lưu với nút lưu nguyện vọng
document.getElementById('save_nguyen_vong').addEventListener('click', function(event) {
	event.preventDefault(); // Ngăn chặn hành động gửi form mặc định
    saveWishes();
});

// Tải nguyện vọng khi trang được tải
window.onload = function() {
    if (localStorage.getItem('loggedInCmnd')) {
        loadReportCard(); 
    }
};
let wishCount = 3; // Đếm số nguyện vọng hiện tại
  // Gán sự kiện cho nút "Thêm nguyện vọng"
  document.getElementById('addWishBtn').addEventListener('click', function(event) {
	event.preventDefault(); // Ngăn chặn hành vi mặc định nếu nút nằm trong một form
	addWish(); // Gọi hàm thêm nguyện vọng
});

function deleteWish(wishId) {
	const wishElement = document.getElementById(wishId);
	if (wishElement) {
		wishElement.remove();
		updateWishes();
	}
	}
	
	function updateWishes() {
	const sections = document.querySelectorAll('.section');
	sections.forEach((section, index) => {
		const header = section.querySelector('.section-header span:first-child');
		header.textContent = `Nguyện vọng ${index + 1}`;
		section.id = `wish-${index + 1}`;
		const selectMajor = section.querySelector('select[id^="major"]');
		selectMajor.id = `major${index + 1}`;
		const selectBlock = section.querySelector('select[id^="block"]');
		selectBlock.id = `block${index + 1}`;
	});
	wishCount = sections.length; // Cập nhật số lượng nguyện vọng
	document.getElementById('message').textContent = ""; // Xóa thông báo
	}
	
	function addWish() {
	if (wishCount >= 3) {
		document.getElementById('message').textContent = "Chỉ được tối đa 3 nguyện vọng!";
		return;
	}
wishCount++;
const newWish = document.createElement('div');
newWish.classList.add('section');
newWish.id = `wish-${wishCount}`;
newWish.innerHTML = `
	<div class="section-header">
		<span>Nguyện vọng ${wishCount}</span>
		<span class="delete-button" id="deleteWishbutton" onclick="deleteWish('wish-${wishCount}')">🗑️</span>
	</div>
	<div class="input-group">
		<label for="major${wishCount}">Ngành/Chương trình đăng ký xét tuyển</label>
		<div class="select-group">
			<select id="major${wishCount}">
				<option value="Công Nghệ Sinh Học">Công Nghệ Sinh Học</option>
				<option value="Kỹ Thuật Hóa Học">Kỹ Thuật Hóa Học</option>
				<option value="Kỹ Thuật Điều Khiển và Tự Động Hóa">Kỹ Thuật Điều Khiển và Tự Động Hóa</option>
				<option value="Kỹ Thuật Y Sinh (Hệ Tư Sinh)">Kỹ Thuật Y Sinh (Hệ Tư Sinh)</option>
				<option value="Kỹ Thuật Điện Tử - Viễn Thông (Hệ Thống Thông Minh Và IoT)">Kỹ Thuật Điện Tử - Viễn Thông (Hệ Thống Thông Minh Và IoT)</option>
				<option value="Kỹ Thuật Điện Tử - Viễn Thông (Thiết Kế Vi Mạch Bản Dẫn)">Kỹ Thuật Điện Tử - Viễn Thông (Thiết Kế Vi Mạch Bản Dẫn)</option>
				<option value="Kỹ Thuật Robot Và Trí Tuệ Nhân Tạo (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)">Kỹ Thuật Robot Và Trí Tuệ Nhân Tạo (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)</option>
				<option value="Công Nghệ Thông Tin">Công Nghệ Thông Tin</option>
				<option value="Kỹ Thuật Phần Mềm (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)">Kỹ Thuật Phần Mềm (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)</option>
				<option value="Công Nghệ Thông Tin Việt Nhật">Công Nghệ Thông Tin Việt Nhật</option>
				<option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
				<option value="Tài Năng Khoa Học Máy Tính">Tài Năng Khoa Học Máy Tính</option>
				<option value="An Toàn Thông Tin (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)">An Toàn Thông Tin (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)</option>
				<option value="Trí Tuệ Nhân Tạo">Trí Tuệ Nhân Tạo</option>
				<option value="Kỹ Thuật Cơ Điện Tử">Kỹ Thuật Cơ Điện Tử</option>
				<option value="Kỹ Thuật Cơ Khí">Kỹ Thuật Cơ Khí</option>
				<option value="Vật Liệu Tiên Tiến Và Công Nghệ Nano">Vật Liệu Tiên Tiến Và Công Nghệ Nano</option>
				<option value="Vật Liệu Thông Minh Và Trí Tuệ Nhân Tạo">Vật Liệu Thông Minh Và Trí Tuệ Nhân Tạo</option>
				<option value="Chip Bán Dẫn Và Công Nghệ Đóng Gói">Chip Bán Dẫn Và Công Nghệ Đóng Gói</option>
				<option value="Kỹ Thuật Ô Tô">Kỹ Thuật Ô Tô</option>
				<option value="Cơ Điện Tử Ô Tô">Cơ Điện Tử Ô Tô</option>
				<option value="Kỹ Thuật Phần Mềm Ô Tô">Kỹ Thuật Phần Mềm Ô Tô</option>
				<option value="Quản Trị Kinh Doanh">Quản Trị Kinh Doanh</option>
				<option value="Kế Toán">Kế Toán</option>
				<option value="Tài Chính - Ngân Hàng">Tài Chính - Ngân Hàng</option>
				<option value="Quản Trị Nhân Lực">Quản Trị Nhân Lực</option>
				<option value="Luật Kinh Tế">Luật Kinh Tế</option>
				<option value="Kinh Doanh Quốc Tế (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)">Kinh Doanh Quốc Tế (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)</option>
				<option value="Logistics và Quản Lý Chuỗi Cung Ứng (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)">Logistics và Quản Lý Chuỗi Cung Ứng (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)</option>
				<option value="Marketing">Marketing</option>
				<option value="Công Nghệ Tài Chính">Công Nghệ Tài Chính</option>
				<option value="Kinh Tế Số">Kinh Tế Số</option>
				<option value="Kinh Doanh Số">Kinh Doanh Số</option>
				<option value="Thương Mại Điện Tử">Thương Mại Điện Tử</option>
				<option value="Logistics Số">Logistics Số</option>
				<option value="Công Nghệ Marketing">Công Nghệ Marketing</option>
				<option value="Ngôn Ngữ Anh">Ngôn Ngữ Anh</option>
				<option value="Ngôn Ngữ Trung Quốc">Ngôn Ngữ Trung Quốc</option>
				<option value="Ngôn Ngữ Hàn Quốc">Ngôn Ngữ Hàn Quốc</option>
				<option value="Ngôn Ngữ Nhật">Ngôn Ngữ Nhật</option>
				<option value="Ngôn Ngữ Pháp">Ngôn Ngữ Pháp</option>
				<option value="Đông Phương Học">Đông Phương Học</option>
				<option value="Du Lịch (Định Hướng Quản Trị Du Lịch)">Du Lịch (Định Hướng Quản Trị Du Lịch)</option>
				<option value="Kinh Doanh Du Lịch Số">Kinh Doanh Du Lịch Số</option>
				<option value="Hướng Dẫn Du Lịch Quốc Tế">Hướng Dẫn Du Lịch Quốc Tế</option>
				<option value="Quản Trị Khách Sạn">Quản Trị Khách Sạn</option>
				<option value="Điều Dưỡng">Điều Dưỡng</option>
				<option value="Dược Học">Dược Học</option>
				<option value="Kỹ Thuật Phục Hồi Chức Năng">Kỹ Thuật Phục Hồi Chức Năng</option>
				<option value="Kỹ Thuật Xét Nghiệm Y Học">Kỹ Thuật Xét Nghiệm Y Học</option>
				<option value="Kỹ Thuật Hình Ảnh Y Học">Kỹ Thuật Hình Ảnh Y Học</option>
				<option value="Y Khoa">Y Khoa</option>
				<option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
				<option value="Quản Lý Bệnh Viện">Quản Lý Bệnh Viện</option>
				<option value="Y Học Cổ Truyền">Y Học Cổ Truyền</option>
			</select>
			<select id="block${wishCount}">
				<option value="">Chọn tổ hợp xét tuyển</option>
			</select>
		</div>
	</div>
`;
	document.body.appendChild(newWish); // Thêm nguyện vọng vào body
	document.getElementById('message').textContent = ""; // Xóa thông báo
    // Cập nhật khối ngành cho nguyện vọng mới
    const selectMajor = newWish.querySelector(`select[id="major${wishCount}"]`);
    const selectBlock = newWish.querySelector(`select[id="block${wishCount}"]`);
    updateBlocks(selectMajor, selectBlock);
}
const blocks = {
	'Công Nghệ Sinh Học': ['A00 (Toán, Vật lý, Hóa học)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Hóa Học': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Điều Khiển và Tự Động Hóa': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'C01 (Ngữ văn, Toán, Vật lý)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Y Sinh (Hệ Tư Sinh)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Điện Tử - Viễn Thông (Hệ Thống Thông Minh Và IoT)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'C01 (Ngữ văn, Toán, Vật lý)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Điện Tử - Viễn Thông (Thiết Kế Vi Mạch Bản Dẫn)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'C01 (Ngữ văn, Toán, Vật lý)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Robot Và Trí Tuệ Nhân Tạo (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'C01 (Ngữ văn, Toán, Vật lý)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Công Nghệ Thông Tin': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Phần Mềm (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Công Nghệ Thông Tin Việt Nhật': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)', 'D28 (Toán, Vật lý, Tiếng Nhật)'],
	'Khoa Học Máy Tính': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Tài Năng Khoa Học Máy Tính': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'An Toàn Thông Tin (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Trí Tuệ Nhân Tạo': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Cơ Điện Tử': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'A02 (Toán, Vật lý, Sinh học)', 'C01 (Ngữ văn, Toán, Vật lý)'],
	'Kỹ Thuật Cơ Khí': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'A02 (Toán, Vật lý, Sinh học)', 'C01 (Ngữ văn, Toán, Vật lý)'],
	'Vật Liệu Tiên Tiến Và Công Nghệ Nano': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Vật Liệu Thông Minh Và Trí Tuệ Nhân Tạo': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'C01 (Ngữ văn, Toán, Vật lý)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Chip Bán Dẫn Và Công Nghệ Đóng Gói': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Ô Tô': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'A10 (Toán, Vật lý, Giáo dục công dân)', 'D01 (Ngữ văn, Toán, Tiếng Anh)'],
	'Cơ Điện Tử Ô Tô': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'A10 (Toán, Vật lý, Giáo dục công dân)', 'D01 (Ngữ văn, Toán, Tiếng Anh)'],
	'Kỹ Thuật Phần Mềm Ô Tô': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'A10 (Toán, Vật lý, Giáo dục công dân)', 'D01 (Ngữ văn, Toán, Tiếng Anh)'],

	'Quản Trị Kinh Doanh': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kế Toán': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Tài Chính - Ngân Hàng': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Quản Trị Nhân Lực': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Luật Kinh Tế': ['C00 (Ngữ văn, Lịch sử, Địa lý)', 'C04 (Ngữ văn, Toán, Địa lý)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D14 (Ngữ văn, Lịch sử, Tiếng Anh)'],
	'Kinh Doanh Quốc Tế (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)', 'D10 (Toán, Địa lý, Tiếng Anh)'],
	'Logistics và Quản Lý Chuỗi Cung Ứng (Một Số Học Phần Chuyên Ngành Học Bằng Tiếng Anh)': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)', 'D10 (Toán, Địa lý, Tiếng Anh)'],
	'Marketing': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D10 (Toán, Địa lý, Tiếng Anh)'],
	'Công Nghệ Tài Chính': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kinh Tế Số': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kinh Doanh Số': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Thương Mại Điện Tử': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Logistics Số': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Công Nghệ Marketing': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],

	'Ngôn Ngữ Anh': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D09 (Toán, Lịch sử, Tiếng Anh)', 'D15 (Ngữ văn, Địa lý, Tiếng Anh)'],
	'Ngôn Ngữ Trung Quốc': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D04 (Ngữ văn, Toán, Tiếng Trung)', 'D09 (Toán, Lịch sử, Tiếng Anh)'],
	'Ngôn Ngữ Hàn Quốc': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D09 (Toán, Lịch sử, Tiếng Anh)', 'D02 (Ngữ văn, Toán, Tiếng Hàn)'],
	'Ngôn Ngữ Nhật': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D06 (Ngữ văn, Toán, Tiếng Nhật)', 'D28 (Toán, Vật lý, Tiếng Nhật)'],
	'Ngôn Ngữ Pháp': ['A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D44 (Ngữ văn, Địa lý, Tiếng Pháp)', 'D64 (Ngữ văn, Lịch sử, Tiếng Anh)'],
	'Đông Phương Học': ['A01 (Toán, Vật lý, Tiếng Anh)', 'C00 (Ngữ văn, Lịch sử, Địa lý)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D09 (Toán, Lịch sử, Tiếng Anh)'],
	'Du Lịch (Định Hướng Quản Trị Du Lịch)': ['A01 (Toán, Vật lý, Tiếng Anh)', 'C00 (Ngữ văn, Lịch sử, Địa lý)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D15 (Ngữ văn, Địa lý, Tiếng Anh)'],
	'Kinh Doanh Du Lịch Số': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D10 (Toán, Địa lý, Tiếng Anh)'],
	'Hướng Dẫn Du Lịch Quốc Tế': ['A01 (Toán, Vật lý, Tiếng Anh)', 'C00 (Ngữ văn, Lịch sử, Địa lý)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D15 (Ngữ văn, Địa lý, Tiếng Anh)'],
	'Quản Trị Khách Sạn': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'D01 (Ngữ văn, Toán, Tiếng Anh)', 'D10 (Toán, Địa lý, Tiếng Anh)'],

	'Điều Dưỡng': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)'],
	'Dược Học': ['A00 (Toán, Vật lý, Hóa học)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Phục Hồi Chức Năng': ['A02 (Toán, Vật lý, Sinh học)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Xét Nghiệm Y Học': ['A02 (Toán, Vật lý, Sinh học)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Kỹ Thuật Hình Ảnh Y Học': ['A02 (Toán, Vật lý, Sinh học)', 'B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Y Khoa': ['A00 (Toán, Vật lý, Hóa học)','B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Răng Hàm Mặt': ['A00 (Toán, Vật lý, Hóa học)','B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
	'Quản Lý Bệnh Viện': ['A00 (Toán, Vật lý, Hóa học)', 'A01 (Toán, Vật lý, Tiếng Anh)', 'B00 (Toán, Hóa học, Sinh học)', 'D01 (Ngữ văn, Toán, Tiếng Anh)'],
	'Y Học Cổ Truyền': ['A00 (Toán, Vật lý, Hóa học)','B00 (Toán, Hóa học, Sinh học)', 'B08 (Toán, Sinh học, Tiếng Anh)', 'D07 (Toán, Hóa học, Tiếng Anh)'],
}
function updateBlocks(selectMajor, selectBlock) {
    const selectedMajor = selectMajor.value;
    const blockOptions = blocks[selectedMajor] || []; // Lấy tổ hợp tương ứng với ngành đã chọn
    selectBlock.innerHTML = ''; // Xóa các tùy chọn trước đó

    blockOptions.forEach((block) => {
        const option = document.createElement('option');
        option.value = block;
        option.textContent = block;
        selectBlock.appendChild(option);
    });
}

// Thiết lập cho các nguyện vọng hiện tại
document.querySelectorAll('.section').forEach((section) => {
    const selectMajor = section.querySelector('select[id^="major"]');
    const selectBlock = section.querySelector('select[id^="block"]');
    updateBlocks(selectMajor, selectBlock);
});

// Lắng nghe sự thay đổi của lựa chọn ngành
document.addEventListener('change', function(event) {
    if (event.target.matches('select[id^="major"]')) {
        const selectMajor = event.target;
       const selectBlock = document.querySelector(`#block${selectMajor.id.replace('major', '')}`);
       updateBlocks(selectMajor, selectBlock);
    }
});

// Lắng nghe sự kiện thay đổi ngành để cập nhật tổ hợp xét tuyển
document.querySelectorAll('.section').forEach((section) => {
    const majorSelect = section.querySelector('select[id^="major"]');
    const blockSelect = section.querySelector('select[id^="block"]');

    // Gọi hàm cập nhật khi ngành được thay đổi
    majorSelect.addEventListener('change', function(event) {
		event.preventDefault(); // Ngăn chặn hành động gửi form mặc định
        updateBlocks(majorSelect, blockSelect);
    });

    // Khởi tạo danh sách tổ hợp xét tuyển dựa trên ngành hiện tại (nếu có)
    updateBlocks(majorSelect, blockSelect);
});


