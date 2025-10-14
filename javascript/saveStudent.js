// ==================== Import Firebase ====================
import { auth, db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Hàm lấy UID an toàn ====================
function getCurrentUID() {
    const user = auth.currentUser;
    if (user && user.uid) return user.uid;

    const uid = sessionStorage.getItem("uid");
    return uid || null;
}

// ==================== Hàm lưu thông tin cá nhân ====================
async function savePersonalInfoOnly(uid) {
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

    await setDoc(doc(db, "students", uid), { personalInfo, schoolRecords }, { merge: true });
}

// ==================== Học bạ chi tiết ====================
function collectSchoolRecords() {
    const subjects = ["toan", "ly", "hoa", "sinh", "van", "su", "dia", "anh", "gdcd", "nhat", "trung", "han"];
    const record = {};

    for (const subject of subjects) {
        const ky1_11 = document.getElementById(`${subject}_ky1_lop11`);
        const ky2_11 = document.getElementById(`${subject}_ky2_lop11`);
        const ky1_12 = document.getElementById(`${subject}_ky1_lop12`);

        if (!ky1_11.value || !ky2_11.value || !ky1_12.value) {
            alert(`⚠️ Vui lòng nhập đầy đủ điểm cho môn "${subject.toUpperCase()}"!`);
            throw new Error("Thiếu dữ liệu");
        }

        const v1 = parseFloat(ky1_11.value);
        const v2 = parseFloat(ky2_11.value);
        const v3 = parseFloat(ky1_12.value);

        if ([v1, v2, v3].some(v => isNaN(v) || v < 0 || v > 10)) {
            alert(`⚠️ Điểm môn "${subject.toUpperCase()}" phải từ 0 đến 10!`);
            throw new Error("Dữ liệu không hợp lệ");
        }

        record[subject] = { lop11_ky1: v1, lop11_ky2: v2, lop12_ky1: v3 };
    }

    return record;
}

async function saveSchoolRecordsOnly(uid) {
    const recordData = collectSchoolRecords();
    await setDoc(doc(db, "schoolRecords", uid), recordData, { merge: true });
}

// ==================== Nguyện vọng ====================
async function saveAspirationsOnly(uid) {
    const wishes = [];
    const sections = document.querySelectorAll("#wish-container .section");

    sections.forEach((section, index) => {
        const major = section.querySelector(`select[id^='major']`)?.value || "";
        const block = section.querySelector(`select[id^='block']`)?.value || "";

        if (major.trim() !== "") {
            wishes.push({ order: index + 1, major, block });
        }
    });

    if (wishes.length === 0) {
        alert("⚠️ Bạn chưa chọn ngành nào để lưu!");
        throw new Error("Không có nguyện vọng");
    }

    await setDoc(doc(db, "aspirations", uid), { wishes }, { merge: true });
}

// ==================== Nút lưu tất cả ====================
document.getElementById("saveAllData")?.addEventListener("click", async (e) => {
    e.preventDefault();
    const uid = getCurrentUID();

    if (!uid) {
        alert("❌ Bạn chưa đăng nhập!");
        return (window.location.href = "index.html");
    }

    try {
        await savePersonalInfoOnly(uid);
        await saveSchoolRecordsOnly(uid);
        await saveAspirationsOnly(uid);
        alert("✅ Đã lưu toàn bộ dữ liệu thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi lưu dữ liệu:", error);
        alert("Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại!");
    }
});