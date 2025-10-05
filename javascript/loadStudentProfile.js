// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { districts } from "./thi_sinh_1.js"; // Đảm bảo file này export { districts }

// ==================== Load dữ liệu thí sinh ====================
async function loadStudentProfile() {
    const uid = sessionStorage.getItem("uid");
    if (!uid) {
        alert("❌ Bạn chưa đăng nhập!");
        window.location.href = "index.html";
        return;
    }

    try {
        const ref = doc(db, "students", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            alert("⚠️ Chưa có dữ liệu thí sinh!");
            return;
        }

        const data = snap.data() || {};
        const p = data.personalInfo || {};
        const s = data.schoolRecords || {};

        // ========== Hàm an toàn để gán giá trị ==========
        const safeSet = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value || "";
        };

        // ==================== 1️⃣ Thông tin cá nhân ====================
        safeSet("name", p.fullname);
        safeSet("dob", p.dob);
        safeSet("gender", p.gender);
        safeSet("email", p.email);
        safeSet("ethnicity", p.ethnicity);
        safeSet("religion", p.religion);
        safeSet("identity", p.identity);
        safeSet("issueDate", p.issueDate);
        safeSet("issuedBy", p.issuedBy);
        safeSet("address", p.address);
        safeSet("studentPhone", p.studentPhone);
        safeSet("parentPhone", p.parentPhone);
        safeSet("provinceCode", p.provinceCode);
        safeSet("ward", p.ward);
        safeSet("village", p.village);

        // ✅ Cập nhật danh sách huyện
        const provinceSelect = document.getElementById("province");
        const districtSelect = document.getElementById("district");
        if (provinceSelect && districtSelect) {
            provinceSelect.value = p.province || "";
            updateDistrictOptions(provinceSelect, districtSelect, p.district);
        }

        // ==================== 2️⃣ Lớp 10 ====================
        if (s.grade10) fillSchoolData(s.grade10, "10");
        // ==================== 3️⃣ Lớp 11 ====================
        if (s.grade11) fillSchoolData(s.grade11, "11");
        // ==================== 4️⃣ Lớp 12 ====================
        if (s.grade12) fillSchoolData(s.grade12, "12");

        console.log("✅ Dữ liệu đã tải:", data);
    } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu. Kiểm tra console để xem lỗi chi tiết.");
    }
}

// ==================== Hàm cập nhật trường học ====================
function fillSchoolData(grade, num) {
    const safeSet = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value || "";
    };

    safeSet(`schoolProvinceCode${num}`, grade.provinceCode);
    safeSet(`schoolName${num}`, grade.schoolName);
    safeSet(`schoolCode${num}`, grade.schoolCode);
    safeSet(`districtCode${num}`, grade.districtCode);

    const pSel = document.getElementById(`schoolProvince${num}`);
    const dSel = document.getElementById(`schoolDistrict${num}`);
    if (pSel && dSel) {
        pSel.value = grade.province || "";
        updateDistrictOptions(pSel, dSel, grade.district);
    }
}

// ==================== Hàm cập nhật danh sách huyện ====================
function updateDistrictOptions(provinceSelect, districtSelect, selectedDistrict = "") {
    const province = provinceSelect.value;
    const list = districts[province] || [];

    districtSelect.innerHTML = "<option value=''>-- Chọn quận/huyện --</option>";
    list.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        if (d === selectedDistrict) opt.selected = true;
        districtSelect.appendChild(opt);
    });
}

// ==================== Khi tải trang ====================
window.addEventListener("DOMContentLoaded", loadStudentProfile);
