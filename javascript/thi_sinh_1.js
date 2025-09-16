   // Hàm hiển thị thông báo
function showNotification(message) {
    alert(message); // Thay thế bằng một thông báo tùy chỉnh nếu muốn
}
   // Hàm lưu thông tin cá nhân
   function saveReportCard_Ttin() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập trước khi lưu');
        return;
    }

    // Lấy dữ liệu từ các trường thông tin
    const reportCardData_Ttin = {
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        ethnicity: document.getElementById('ethnicity').value,
        religion: document.getElementById('religion').value,
        identity: document.getElementById('identity').value,
        issueDate: document.getElementById('issueDate').value,
        issuedBy: document.getElementById('issuedBy').value,
        address: document.getElementById('address').value,
        studentPhone: document.getElementById('studentPhone').value,
        parentPhone: document.getElementById('parentPhone').value,
        provinceCode: document.getElementById('provinceCode').value, // Lưu mã tỉnh
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        ward: document.getElementById('ward').value,
        village: document.getElementById('village').value,
        schoolProvince10: document.getElementById('schoolProvince10').value,
        schoolName10: document.getElementById('schoolName10').value,
        schoolProvinceCode10: document.getElementById('schoolProvinceCode10').value, // Lưu mã tỉnh trường lớp 10
        schoolCode10: document.getElementById('schoolCode10').value, // Lưu mã trường lớp 10
        schoolDistrict10: document.getElementById('schoolDistrict10').value,
        districtCode10: document.getElementById('districtCode10').value,
        schoolProvince11: document.getElementById('schoolProvince11').value,
        schoolName11: document.getElementById('schoolName11').value,
        schoolProvinceCode11: document.getElementById('schoolProvinceCode11').value, // Lưu mã tỉnh trường lớp 11
        schoolCode11: document.getElementById('schoolCode11').value, // Lưu mã trường lớp 11
        schoolDistrict11: document.getElementById('schoolDistrict11').value,
        districtCode11: document.getElementById('districtCode11').value,
        schoolProvince12: document.getElementById('schoolProvince12').value,
        schoolName12: document.getElementById('schoolName12').value,
        schoolProvinceCode12: document.getElementById('schoolProvinceCode12').value, // Lưu mã tỉnh trường lớp 12
        schoolCode12: document.getElementById('schoolCode12').value, // Lưu mã trường lớp 12
        schoolDistrict12: document.getElementById('schoolDistrict12').value,
        districtCode12: document.getElementById('districtCode12').value,
    };

    // Tạo khóa duy nhất cho thông tin dựa trên CCCD
    const storageKey_Ttin = `thong_tin_data_${loggedInCmnd}`;

    // Lưu dữ liệu vào localStorage
    localStorage.setItem(storageKey_Ttin, JSON.stringify(reportCardData_Ttin));
    showNotification('Thông tin cá nhân đã được lưu thành công!');

    // Đổi chữ nút lưu thành ĐÃ LƯU và vô hiệu hóa
    //const saveButton_Ttin = document.getElementById('save_thong_tin');
    //saveButton_Ttin.textContent = 'ĐÃ LƯU';
    //saveButton_Ttin.disabled = true;
}
// Hàm tải thông tin cá nhân
function loadReportCard_Ttin() {
    const loggedInCmnd = localStorage.getItem('loggedInCmnd'); // Lấy CCCD đã lưu sau khi đăng nhập
    if (!loggedInCmnd) {
        showNotification('Vui lòng đăng nhập để xem.');
        return;
    }
    // Tạo khóa duy nhất cho học bạ dựa trên CCCD
    const storageKey_Ttin = `thong_tin_data_${loggedInCmnd}`;
    const savedData_Ttin = localStorage.getItem(storageKey_Ttin);

    if (savedData_Ttin) {
        const reportCardData_Ttin = JSON.parse(savedData_Ttin);

        document.getElementById('name').value = reportCardData_Ttin.name || '';
        document.getElementById('dob').value = reportCardData_Ttin.dob || '';
        document.getElementById('email').value = reportCardData_Ttin.email || '';
        document.getElementById('ethnicity').value = reportCardData_Ttin.ethnicity || '';
        document.getElementById('identity').value = reportCardData_Ttin.identity || '';
        document.getElementById('issueDate').value = reportCardData_Ttin.issueDate || '';
        document.getElementById('issuedBy').value = reportCardData_Ttin.issuedBy || '';
        document.getElementById('address').value = reportCardData_Ttin.address || '';
        document.getElementById('studentPhone').value = reportCardData_Ttin.studentPhone || '';
        document.getElementById('parentPhone').value = reportCardData_Ttin.parentPhone || '';
        document.getElementById('village').value = reportCardData_Ttin.village || '';
        document.getElementById('ward').value = reportCardData_Ttin.ward || '';

        // Gán giá trị cho các trường select
        const genderSelect = document.getElementById('gender');
        if (genderSelect) genderSelect.value = reportCardData_Ttin.gender || '';

        const religionSelect = document.getElementById('religion');
        if (religionSelect) religionSelect.value = reportCardData_Ttin.religion || '';

        const provinceSelect = document.getElementById('province');
        if (provinceSelect) {
            provinceSelect.value = reportCardData_Ttin.province || '';

            // Gán mã tỉnh
            document.getElementById('provinceCode').value = reportCardData_Ttin.provinceCode || '';

            // Cập nhật huyện sau khi chọn tỉnh
            const districtSelect = document.getElementById('district');
            updateDistricts(provinceSelect.value, districtSelect, function() {
                // Gán giá trị của huyện sau khi danh sách huyện được cập nhật
                districtSelect.value = reportCardData_Ttin.district || '';
            });
        }

        // Lớp 10
        document.getElementById('schoolName10').value = reportCardData_Ttin.schoolName10 || '';
        document.getElementById('schoolProvinceCode10').value = reportCardData_Ttin.schoolProvinceCode10 || ''; // Gán mã tỉnh lớp 10
        document.getElementById('districtCode10').value = reportCardData_Ttin.districtCode10 || '';
        document.getElementById('schoolCode10').value = reportCardData_Ttin.schoolCode10 || ''; // Gán mã trường lớp 10

        const schoolProvince10Select = document.getElementById('schoolProvince10');
        if (schoolProvince10Select) {
            schoolProvince10Select.value = reportCardData_Ttin.schoolProvince10 || '';

            // Cập nhật huyện cho lớp 10
            const schoolDistrict10Select = document.getElementById('schoolDistrict10');
            updateDistricts(schoolProvince10Select.value, schoolDistrict10Select, function() {
                schoolDistrict10Select.value = reportCardData_Ttin.schoolDistrict10 || '';
            });
        }

        // Lớp 11
        document.getElementById('schoolName11').value = reportCardData_Ttin.schoolName11 || '';
        document.getElementById('schoolProvinceCode11').value = reportCardData_Ttin.schoolProvinceCode11 || ''; // Gán mã tỉnh lớp 11
        document.getElementById('districtCode11').value = reportCardData_Ttin.districtCode11 || '';
        document.getElementById('schoolCode11').value = reportCardData_Ttin.schoolCode11 || ''; // Gán mã trường lớp 11

        const schoolProvince11Select = document.getElementById('schoolProvince11');
        if (schoolProvince11Select) {
            schoolProvince11Select.value = reportCardData_Ttin.schoolProvince11 || '';

            // Cập nhật huyện cho lớp 11
            const schoolDistrict11Select = document.getElementById('schoolDistrict11');
            updateDistricts(schoolProvince11Select.value, schoolDistrict11Select, function() {
                schoolDistrict11Select.value = reportCardData_Ttin.schoolDistrict11 || '';
            });
        }

        // Lớp 12
        document.getElementById('schoolName12').value = reportCardData_Ttin.schoolName12 || '';
        document.getElementById('schoolProvinceCode12').value = reportCardData_Ttin.schoolProvinceCode12 || ''; // Gán mã tỉnh lớp 12
        document.getElementById('districtCode12').value = reportCardData_Ttin.districtCode12 || '';
        document.getElementById('schoolCode12').value = reportCardData_Ttin.schoolCode12 || ''; // Gán mã trường lớp 12

        const schoolProvince12Select = document.getElementById('schoolProvince12');
        if (schoolProvince12Select) {
            schoolProvince12Select.value = reportCardData_Ttin.schoolProvince12 || '';

            // Cập nhật huyện cho lớp 12
            const schoolDistrict12Select = document.getElementById('schoolDistrict12');
            updateDistricts(schoolProvince12Select.value, schoolDistrict12Select, function() {
                schoolDistrict12Select.value = reportCardData_Ttin.schoolDistrict12 || '';
            });
        }
}
}
 // Gán sự kiện cho nút lưu thông tin
 document.getElementById('save_thong_tin').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động gửi form mặc định
    saveReportCard_Ttin(); // Gọi hàm lưu thông tin
});

// Tải thông tin cá nhân khi trang được tải
window.onload = function() {
    if (localStorage.getItem('loggedInCmnd')) {
        loadReportCard_Ttin(); // Tải thông tin cá nhân
    }
};

const districts = {
            'An Giang': ['Thành phố Long Xuyên', 'Thành phố Châu Đốc', 'Huyện An Phú', 'Thị xã Tân Châu', 'Huyện Phú Tân', 'Huyện Châu Phú', 'Huyện Tịnh Biên', 'Huyện Tri Tôn', 'Huyện Thoại Sơn'],
    	    'Bà Rịa - Vũng Tàu': ['Thành phố Vũng Tàu', 'Thành phố Bà Rịa', 'Huyện Châu Đức', 'Huyện Xuyên Mộc', 'Huyện Long Điền',  'Huyện Đất Đỏ', 'Thị xã Phú Mỹ', 'Huyện Côn Đảo'],
            'Bạc Liêu': ['Bạc Liêu', 'Giá Rai', 'Hòa Bình', 'Hồng Dân', 'Phước Long'],
    	    'Bắc Giang': ['Bắc Giang', 'Hiệp Hòa', 'Lạng Giang', 'Lục Nam', 'Lục Ngạn', 'Sơn Động', 'Tân Yên', 'Yên Dũng', 'Yên Thế', 'Việt Yên'],
            'Bắc Kạn': ['Bắc Kạn', 'Ba Bể', 'Bạch Thông', 'Chợ Đồn', 'Chợ Mới'],
    	    'Bến Tre': ['Bến Tre', 'Châu Thành', 'Bình Đại', 'Giồng Trôm', 'Mỏ Cày Bắc'],
   	    	'Bình Định': ['Quy Nhơn', 'An Nhơn', 'Bình Định', 'Hoài Nhơn', 'Phù Cát'],
    	    'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Bến Cát', 'Tân Uyên'],
            'Bình Phước': ['Đồng Xoài', 'Phước Long', 'Bù Gia Mập', 'Bù Đốp', 'Chơn Thành'],
  	    	'Bình Thuận': ['Phan Thiết', 'La Gi', 'Tuy Phong', 'Bắc Bình', 'Hàm Thuận Bắc'],
 	   		'Cao Bằng': ['Cao Bằng', 'Bảo Lạc', 'Bảo Lâm', 'Thạch An', 'Quảng Hòa'],
  	   		'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Sơn Trà'],
 	   		'Đắk Lắk': ['Buôn Ma Thuột', 'Buôn Hồ', 'Ea H’leo', 'Krông Ana', 'Lắk'],
 	   		'Đắk Nông': ['Gia Nghĩa', 'Đắk Mil', 'Đắk Song', 'Krông Nô', 'Tuy Đức'],
 	   		'Điện Biên': ['Điện Biên Phủ', 'Mường Lay', 'Điện Biên Đông', 'Mường Nhé', 'Tủa Chùa'],
  	 	 	'Đồng Nai': ['Biên Hòa', 'Long Thành', 'Nhơn Trạch', 'Vĩnh Cửu', 'Xuân Lộc'],
   	   		'Đồng Tháp': ['Cao Lãnh', 'Sa Đéc', 'Hồng Ngự', 'Thanh Bình', 'Lai Vung'],
          	'Gia Lai': ['Pleiku', 'An Khê', 'Ayun Pa', 'Chư Păh', 'Đức Cơ'],
 	   		'Hà Giang': ['Hà Giang', 'Đồng Văn', 'Mèo Vạc', 'Yên Minh', 'Quản Bạ'],
 	   		'Hà Nam': ['Phủ Lý', 'Duy Tiên', 'Bình Lục', 'Lý Nhân', 'Kim Bảng'],
 	   		'Hà Tĩnh': ['Hà Tĩnh', 'Hương Khê', 'Kỳ Anh', 'Cẩm Xuyên', 'Thạch Hà'],
	   		'Hải Dương': ['Hải Dương', 'Chí Linh', 'Kinh Môn', 'Nam Sách', 'Ninh Giang'],
           	'Hải Phòng': ['Hải An', 'Lê Chân', 'Ngô Quyền', 'Đồ Sơn', 'Kiến An'],
  	   		'Hòa Bình': ['Hòa Bình', 'Cao Phong', 'Đà Bắc', 'Kỳ Sơn', 'Lương Sơn'],
           	'Hưng Yên': ['Hưng Yên', 'Mỹ Hào', 'Văn Lâm', 'Văn Giang', 'Khoái Châu'],
 	   		'Khánh Hòa': ['Nha Trang', 'Cam Ranh', 'Vạn Ninh', 'Ninh Hòa', 'Khánh Vĩnh'],
 	   		'Kiên Giang': ['Rạch Giá', 'Hà Tiên', 'Phú Quốc', 'An Biên', 'Châu Thành'],
 	   		'Kon Tum': ['Kon Tum', 'Đăk Glei', 'Ngọc Hồi', 'Đăk Tô', 'Sa Thầy'],
 	   		'Lai Châu': ['Lai Châu', 'Mường Tè', 'Nậm Nhùn', 'Tam Đường', 'Phong Thổ'],
 	   		'Lạng Sơn': ['Lạng Sơn', 'Thành Phố Lạng Sơn', 'Cao Lộc', 'Văn Lãng', 'Tràng Định'],
 	   		'Lào Cai': ['Lào Cai', 'Thành phố Lào Cai', 'Sa Pa', 'Bát Xát', 'Mường Khương'],
 	   		'Long An': ['Tân An', 'Bến Lức', 'Châu Thành', 'Đức Hòa', 'Đức Huệ'],
  	   		'Nam Định': ['Nam Định', 'Thành phố Nam Định', 'Mỹ Lộc', 'Vụ Bản', 'Trực Ninh'],
 	   		'Nghệ An': ['Vinh', 'Cửa Lò', 'Nghĩa Đàn', 'Đô Lương', 'Thanh Chương'],
 	   		'Ninh Bình': ['Ninh Bình', 'Tam Điệp', 'Gia Viễn', 'Hoa Lư', 'Yên Khánh'],
 	   		'Ninh Thuận': ['Phan Rang - Tháp Chàm', 'Ninh Hải', 'Ninh Sơn', 'Bác Ái', 'Thuận Bắc'],
 	   		'Phú Thọ': ['Việt Trì', 'Phú Thọ', 'Đoan Hùng', 'Hạ Hòa', 'Thanh Ba'],
 	   		'Quảng Bình': ['Đồng Hới', 'Ba Đồn', 'Quảng Trạch', 'Tuyên Hóa', 'Minh Hóa'],
 	   		'Quảng Nam': ['Tam Kỳ', 'Hội An', 'Núi Thành', 'Phú Ninh', 'Thăng Bình'],
 	   		'Quảng Ngãi': ['Quảng Ngãi', 'Sơn Tịnh', 'Tư Nghĩa', 'Bình Sơn', 'Trà Bồng'],
 	   		'Quảng Ninh': ['Hạ Long', 'Uông Bí', 'Móng Cái', 'Cẩm Phả', 'Đông Triều'],
 	   		'Quảng Trị': ['Đông Hà', 'Quảng Trị', 'Hải Lăng', 'Triệu Phong', 'Cam Lộ'],
 	   		'Sóc Trăng': ['Sóc Trăng', 'Ngã Năm', 'Kế Sách', 'Mỹ Tú', 'Long Phú'],
 	   		'Sơn La': ['Sơn La', 'Thành phố Sơn La', 'Mai Sơn', 'Sông Mã', 'Yên Châu'],
 	   		'Tây Ninh': ['Tây Ninh', 'Thành phố Tây Ninh', 'Hòa Thành', 'Trảng Bàng', 'Dương Minh Châu'],
 	   		'Thái Bình': ['Thái Bình', 'Thành phố Thái Bình', 'Đông Hưng', 'Hưng Hà', 'Quỳnh Phụ'],
 	   		'Thái Nguyên': ['Thái Nguyên', 'Thành phố Thái Nguyên', 'Phổ Yên', 'Đồng Hỷ', 'Đại Từ'],
 	   		'Thanh Hóa': ['Thanh Hóa', 'Thành phố Thanh Hóa', 'Sầm Sơn', 'Bỉm Sơn', 'Tĩnh Gia'],
 	   		'Thừa Thiên Huế': ['Huế', 'Thành phố Huế', 'Hương Thủy', 'Hương Trà', 'Phú Vang'],
 	   		'Tiền Giang': ['Mỹ Tho', 'Gò Công', 'Cai Lậy', 'Châu Thành', 'Tân Phước'],
	   	 	'Trà Vinh': ['Trà Vinh', 'Duyên Hải', 'Cầu Kè', 'Càng Long', 'Tiểu Cần'],
  	  		'Tuyên Quang': ['Tuyên Quang', 'Thành phố Tuyên Quang', 'Yên Sơn', 'Hàm Yên', 'Chiêm Hóa'],
 	   		'Vĩnh Long': ['Vĩnh Long', 'Bình Minh', 'Long Hồ', 'Mang Thít', 'Tam Bình'],
 	   		'Vĩnh Phúc': ['Vĩnh Yên', 'Phúc Yên', 'Bình Xuyên', 'Vĩnh Tường', 'Yên Lạc'],
	    	'Yên Bái': ['Yên Bái', 'Thành phố Yên Bái', 'Lục Yên', 'Văn Yên', 'Trấn Yên'],
	    	'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Thanh Xuân', 'Sóc Sơn', 'Đông Anh', 'Gia Lâm', 'Nam Từ Liêm', 'Thanh Trì', 'Bắc Từ Liêm', 'Mê Linh', 'Hà Đông', 'Thị xã Sơn Tây', 'Ba Vì', 'Phúc Thọ', 'Đan Phượng', 'Hoài Đức', 'Quốc Oai', 'Thạch Thất', 'Chương Mỹ', 'Thanh Oai', 'Thường Tín', 'Phú Xuyên', 'Ứng Hòa', 'Mỹ Đức'],
	    	'Hồ Chí Minh': ['Quận 1', 'Quận 12', 'Quận Gò Vấp', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Phú Nhuận', 'Thành phố Thủ Đức', 'Quận 3', 'Quận 10', 'Quận 11', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 8', 'Quận Bình Tân', 'Quận 7', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Bình Chánh', 'Huyện Nhà Bè', 'Huyện Cần Giờ'],
        };
    const provinceCodes = {
    		'An Giang': '51',
    		'Bà Rịa - Vũng Tàu': '52',
    		'Bắc Kạn': '11',
    		'Bắc Ninh': '19',
    		'Bến Tre': '55',
    		'Bình Định': '37',
    		'Bình Dương': '74',
    		'Bình Phước': '27',
    		'Cà Mau': '61',
    		'Cao Bằng': '06',
    		'Cần Thơ': '92',
    		'Đà Nẵng': '04',
    		'Đắk Lắk': '40',
    		'Đắk Nông': '63',
    		'Điện Biên': '62',
    		'Đồng Nai': '48',
    		'Đồng Tháp': '50',
    		'Gia Lai': '38',
    		'Hà Giang': '05',
   	 		'Hà Nội': '01',
    		'Hà Tĩnh': '30',
    		'Hậu Giang': '64',
    		'Hòa Bình': '23',
    		'Hưng Yên': '22',
    		'Khánh Hòa': '41',
    		'Kiên Giang': '54',
    		'Kon Tum': '36',
    		'Lai Châu': '07',
    		'Lâm Đồng': '42',
    		'Lào Cai': '08',
    		'Lạng Sơn': '10',
    		'Long An': '49',
    		'Nam Định': '25',
    		'Nghệ An': '29',
    		'Ninh Bình': '27',
    		'Ninh Thuận': '45',
    		'Phú Thọ': '15',
    		'Phú Yên': '39',
    		'Quảng Bình': '31',
    		'Quảng Nam': '34',
    		'Quảng Ngãi': '35',
    		'Quảng Ninh': '17',
    		'Sóc Trăng': '59',
    		'Sơn La': '14',
    		'Tây Ninh': '46',
    		'Thái Bình': '26',
    		'Thái Nguyên': '12',
    		'Trà Vinh': '58',
    		'Vĩnh Long': '57',
    		'Vĩnh Phúc': '16',
    		'Yên Bái': '13',
    		'Hồ Chí Minh': '02',
    		'Hải Phòng': '03',
    		'Thanh Hóa' : '28',
			'Bắc Giang' : '24',
			'Bạc Liêu' : '95',
			'Điện Biên' : '11',
			'Hưng Yên' : '33',
			'Khánh Hòa' : '56',
			'Lai Châu' : '12',
			'Lào Cai' : '10',
			'Long An' : '80',
			'Nam Định' : '36',
			'Nghệ An' : '40',
			'Ninh Bình' : '37',
			'Ninh Thuận' : '58',
			'Phú Thọ' : '25',
			'Phú Yên' : '54',
			'Quảng Bình' : '44',
			'Quảng Nam' : '49',
			'Quảng Ngãi' : '51',
			'Quảng Ninh' : '22',
			'Sóc Trăng' : '94',
			'Sơn La' : '14',
			'Tây Ninh' : '72',
			'Thái Bình' : '34',
			'Thái Nguyên' : '19',
			'Trà Vinh' : '84',
			'Vĩnh Long' : '86',
			'Vĩnh Phúc' : '26',
			'Yên Bái' : '15'
    };

 



// Hàm để cập nhật danh sách huyện dựa trên tỉnh đã chọn
function updateDistricts(province, districtSelect, callback) {
    districtSelect.innerHTML = ''; // Xóa danh sách huyện cũ
    const districts = getDistrictsByProvince(province);

    // Thêm các tùy chọn huyện mới
    districts.forEach(function(district) {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });

    if (callback) {
        callback();
    }
}

// Hàm giả lập lấy danh sách huyện dựa trên tỉnh
function getDistrictsByProvince(province) {
    return districts[province] || [];
}
const setupDynamicDistricts = (provinceSelect, districtSelect, provinceCodeInput) => {
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;

        // Cập nhật mã tỉnh
        const code = provinceCodes[selectedProvince] || '';
        provinceCodeInput.value = code;

        // Cập nhật danh sách quận/huyện
        districtSelect.innerHTML = '<option value="">Chọn huyện</option>';
        if (districts[selectedProvince]) {
            districts[selectedProvince].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
};

// Thông tin cá nhân
const provinceSelect = document.getElementById('province');
const districtSelect = document.getElementById('district');
const provinceCodeInput = document.getElementById('provinceCode');
setupDynamicDistricts(provinceSelect, districtSelect, provinceCodeInput);

// Lớp 10
const schoolProvinceSelect10 = document.getElementById('schoolProvince10');
const schoolDistrictSelect10 = document.getElementById('schoolDistrict10');
const schoolProvinceCodeInput10 = document.getElementById('schoolProvinceCode10');
setupDynamicDistricts(schoolProvinceSelect10, schoolDistrictSelect10, schoolProvinceCodeInput10);

// Lớp 11
const schoolProvinceSelect11 = document.getElementById('schoolProvince11');
const schoolDistrictSelect11 = document.getElementById('schoolDistrict11');
const schoolProvinceCodeInput11 = document.getElementById('schoolProvinceCode11');
setupDynamicDistricts(schoolProvinceSelect11, schoolDistrictSelect11, schoolProvinceCodeInput11);

// Lớp 12
const schoolProvinceSelect12 = document.getElementById('schoolProvince12');
const schoolDistrictSelect12 = document.getElementById('schoolDistrict12');
const schoolProvinceCodeInput12 = document.getElementById('schoolProvinceCode12');
setupDynamicDistricts(schoolProvinceSelect12, schoolDistrictSelect12, schoolProvinceCodeInput12);

 // Kiểm tra định dạng số ĐT 
 const phoneInput_Std = document.getElementById('studentPhone');

 phoneInput_Std.addEventListener('input', function() {
     if (this.validity.valueMissing) {
         this.setCustomValidity('Phải điền ô này');
     } else if (this.validity.patternMismatch) {
         this.setCustomValidity('Số điện thoại phải gồm 10 chữ số.');
     } else {
         this.setCustomValidity('');
     }
 });

 const phoneInput_Pr = document.getElementById('parentPhone');

 phoneInput_Pr.addEventListener('input', function() {
     if (this.validity.valueMissing) {
         this.setCustomValidity('Phải điền ô này');
     } else if (this.validity.patternMismatch) {
         this.setCustomValidity('Số điện thoại phải gồm 10 chữ số.');
     } else {
         this.setCustomValidity('');
     }
 });

 const identityInput = document.getElementById('identity');
 // Kiểm tra định dạng số CCCD
 identityInput.addEventListener('input', function() {
     if (this.validity.valueMissing) {
         this.setCustomValidity('Phải điền ô này');
     } else if (this.validity.patternMismatch) {
         this.setCustomValidity('Số CCCD phải gồm 12 chữ số.');
     } else {
         this.setCustomValidity('');
     }
 });	
