// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Load dữ liệu thí sinh ====================
async function loadStudentProfile() {
    const uid = sessionStorage.getItem("uid");
    if (!uid) {
        alert("❌ Bạn chưa đăng nhập!");
        return (window.location.href = "index.html");
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

        // ==================== 1️⃣ Thông tin cá nhân ====================
        document.getElementById("name").value = p.fullname || "";
        document.getElementById("dob").value = p.dob || "";
        document.getElementById("gender").value = p.gender || "";
        document.getElementById("email").value = p.email || "";
        document.getElementById("ethnicity").value = p.ethnicity || "";
        document.getElementById("religion").value = p.religion || "";
        document.getElementById("identity").value = p.identity || "";
        document.getElementById("issueDate").value = p.issueDate || "";
        document.getElementById("issuedBy").value = p.issuedBy || "";
        document.getElementById("address").value = p.address || "";
        document.getElementById("studentPhone").value = p.studentPhone || "";
        document.getElementById("parentPhone").value = p.parentPhone || "";
        document.getElementById("provinceCode").value = p.provinceCode || "";
        document.getElementById("province").value = p.province || "";
        document.getElementById("district").value = p.district || "";
        document.getElementById("ward").value = p.ward || "";
        document.getElementById("village").value = p.village || "";

        // ==================== 2️⃣ Trường học lớp 10 ====================
        if (s.grade10) {
            document.getElementById("schoolProvince10").value = s.grade10.province || "";
            document.getElementById("schoolName10").value = s.grade10.schoolName || "";
            document.getElementById("schoolProvinceCode10").value = s.grade10.provinceCode || "";
            document.getElementById("schoolCode10").value = s.grade10.schoolCode || "";
            document.getElementById("schoolDistrict10").value = s.grade10.district || "";
            document.getElementById("districtCode10").value = s.grade10.districtCode || "";
        }

        // ==================== 3️⃣ Trường học lớp 11 ====================
        if (s.grade11) {
            document.getElementById("schoolProvince11").value = s.grade11.province || "";
            document.getElementById("schoolName11").value = s.grade11.schoolName || "";
            document.getElementById("schoolProvinceCode11").value = s.grade11.provinceCode || "";
            document.getElementById("schoolCode11").value = s.grade11.schoolCode || "";
            document.getElementById("schoolDistrict11").value = s.grade11.district || "";
            document.getElementById("districtCode11").value = s.grade11.districtCode || "";
        }

        // ==================== 4️⃣ Trường học lớp 12 ====================
        if (s.grade12) {
            document.getElementById("schoolProvince12").value = s.grade12.province || "";
            document.getElementById("schoolName12").value = s.grade12.schoolName || "";
            document.getElementById("schoolProvinceCode12").value = s.grade12.provinceCode || "";
            document.getElementById("schoolCode12").value = s.grade12.schoolCode || "";
            document.getElementById("schoolDistrict12").value = s.grade12.district || "";
            document.getElementById("districtCode12").value = s.grade12.districtCode || "";
        }

        console.log("✅ Dữ liệu đã tải:", data);
    } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu. Vui lòng thử lại!");
    }
}

// ==================== Gọi khi tải trang ====================
window.addEventListener("DOMContentLoaded", loadStudentProfile);