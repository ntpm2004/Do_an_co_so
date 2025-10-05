// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Hàm hiển thị thông báo ====================
async function savePersonalInfo(e) {
    e.preventDefault();

    const uid = sessionStorage.getItem("uid");
    if (!uid) {
        alert("❌ Bạn chưa đăng nhập!");
        return (window.location.href = "index.html");
    }

    // ==================== 1️⃣ Gom thông tin cá nhân ====================
    const personalInfo = {
        fullname: document.getElementById("name").value.trim(),
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value.trim(),
        ethnicity: document.getElementById("ethnicity").value,
        religion: document.getElementById("religion").value,
        identity: document.getElementById("identity").value.trim(),
        issueDate: document.getElementById("issueDate").value,
        issuedBy: document.getElementById("issuedBy").value.trim(),
        address: document.getElementById("address").value.trim(),
        studentPhone: document.getElementById("studentPhone").value.trim(),
        parentPhone: document.getElementById("parentPhone").value.trim(),
        provinceCode: document.getElementById("provinceCode").value.trim(),
        province: document.getElementById("province").value,
        district: document.getElementById("district").value,
        ward: document.getElementById("ward").value.trim(),
        village: document.getElementById("village").value.trim()
    };

    // ==================== 2️⃣ Gom thông tin học bạ ====================
    const schoolRecords = {
        grade10: {
            province: document.getElementById("schoolProvince10").value,
            schoolName: document.getElementById("schoolName10").value.trim(),
            provinceCode: document.getElementById("schoolProvinceCode10").value.trim(),
            schoolCode: document.getElementById("schoolCode10").value.trim(),
            district: document.getElementById("schoolDistrict10").value,
            districtCode: document.getElementById("districtCode10").value.trim()
        },
        grade11: {
            province: document.getElementById("schoolProvince11").value,
            schoolName: document.getElementById("schoolName11").value.trim(),
            provinceCode: document.getElementById("schoolProvinceCode11").value.trim(),
            schoolCode: document.getElementById("schoolCode11").value.trim(),
            district: document.getElementById("schoolDistrict11").value,
            districtCode: document.getElementById("districtCode11").value.trim()
        },
        grade12: {
            province: document.getElementById("schoolProvince12").value,
            schoolName: document.getElementById("schoolName12").value.trim(),
            provinceCode: document.getElementById("schoolProvinceCode12").value.trim(),
            schoolCode: document.getElementById("schoolCode12").value.trim(),
            district: document.getElementById("schoolDistrict12").value,
            districtCode: document.getElementById("districtCode12").value.trim()
        }
    };

    try {
        const ref = doc(db, "students", uid);
        await setDoc(ref, {
            personalInfo,
            schoolRecords
        }, { merge: true });

        alert("✅ Đã lưu thông tin thí sinh và học bạ thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi lưu thông tin:", error);
        alert("Không thể lưu thông tin. Vui lòng thử lại!");
    }
}

// ==================== Gán sự kiện cho nút lưu ====================
document.getElementById("savePersonalInfo")?.addEventListener("click", savePersonalInfo);

// ==================== Lưu nguyện vọng ====================
async function saveAspirations() {
    const uid = sessionStorage.getItem("uid");
    if (!uid) return showNotification("❌ Chưa đăng nhập!");

    const aspirations = [];

    // Giả sử có 3 nguyện vọng
    for (let i = 1; i <= 3; i++) {
        const major = document.getElementById(`major${i}`)?.value.trim() || "";
        const block = document.getElementById(`block${i}`)?.value.trim() || "";
        if (major && block) {
            aspirations.push({ major, block, priority: i });
        }
    }
    if (aspirations.length === 0) {
        return showNotification("❌ Chưa có nguyện vọng hợp lệ!");
    }

    try {
        await setDoc(doc(db, "students", uid), { aspirations }, { merge: true });
        showNotification("✅ Lưu nguyện vọng thành công!");
    } catch (err) {
        console.error(err);
        showNotification("❌ Lỗi khi lưu nguyện vọng!");
    }
}

// ==================== Gán sự kiện cho 3 nút ====================
document.getElementById("savePersonalInfo")?.addEventListener("click", (e) => {
    e.preventDefault();
    savePersonalInfo();
});

document.getElementById("saveSchoolRecords")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveSchoolRecords();
});

document.getElementById("saveAspirations")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveAspirations();
});