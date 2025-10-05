// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { districts, provinceCodes } from "./thi_sinh_1.js";

// ==================== Hàm lưu thông tin ====================
async function savePersonalInfo(e) {
    e.preventDefault();

    const uid = sessionStorage.getItem("uid");
    if (!uid) {
        alert("❌ Bạn chưa đăng nhập!");
        return (window.location.href = "index.html");
    }

    // ==================== 1️⃣ Gom thông tin cá nhân ====================
    const personalInfo = {
        fullname: document.getElementById("name")?.value.trim() || "",
        dob: document.getElementById("dob")?.value || "",
        gender: document.getElementById("gender")?.value || "",
        email: document.getElementById("email")?.value.trim() || "",
        ethnicity: document.getElementById("ethnicity")?.value || "",
        religion: document.getElementById("religion")?.value || "",
        identity: document.getElementById("identity")?.value.trim() || "",
        issueDate: document.getElementById("issueDate")?.value || "",
        issuedBy: document.getElementById("issuedBy")?.value.trim() || "",
        address: document.getElementById("address")?.value.trim() || "",
        studentPhone: document.getElementById("studentPhone")?.value.trim() || "",
        parentPhone: document.getElementById("parentPhone")?.value.trim() || "",
        province: document.getElementById("province")?.value || "",
        district: document.getElementById("district")?.value || "",
        ward: document.getElementById("ward")?.value.trim() || "",
        village: document.getElementById("village")?.value.trim() || "",
        provinceCode:
            document.getElementById("provinceCode")?.value.trim() ||
            provinceCodes[document.getElementById("province")?.value] ||
            ""
    };

    // ==================== 2️⃣ Gom thông tin học bạ ====================
    const schoolRecords = {
        grade10: {
            province: document.getElementById("schoolProvince10")?.value || "",
            schoolName: document.getElementById("schoolName10")?.value.trim() || "",
            provinceCode:
                document.getElementById("schoolProvinceCode10")?.value.trim() ||
                provinceCodes[document.getElementById("schoolProvince10")?.value] ||
                "",
            schoolCode: document.getElementById("schoolCode10")?.value.trim() || "",
            district: document.getElementById("schoolDistrict10")?.value || "",
            districtCode: document.getElementById("districtCode10")?.value.trim() || ""
        },
        grade11: {
            province: document.getElementById("schoolProvince11")?.value || "",
            schoolName: document.getElementById("schoolName11")?.value.trim() || "",
            provinceCode:
                document.getElementById("schoolProvinceCode11")?.value.trim() ||
                provinceCodes[document.getElementById("schoolProvince11")?.value] ||
                "",
            schoolCode: document.getElementById("schoolCode11")?.value.trim() || "",
            district: document.getElementById("schoolDistrict11")?.value || "",
            districtCode: document.getElementById("districtCode11")?.value.trim() || ""
        },
        grade12: {
            province: document.getElementById("schoolProvince12")?.value || "",
            schoolName: document.getElementById("schoolName12")?.value.trim() || "",
            provinceCode:
                document.getElementById("schoolProvinceCode12")?.value.trim() ||
                provinceCodes[document.getElementById("schoolProvince12")?.value] ||
                "",
            schoolCode: document.getElementById("schoolCode12")?.value.trim() || "",
            district: document.getElementById("schoolDistrict12")?.value || "",
            districtCode: document.getElementById("districtCode12")?.value.trim() || ""
        }
    };

    try {
        const ref = doc(db, "students", uid);
        await setDoc(ref, { personalInfo, schoolRecords }, { merge: true });
        alert("✅ Đã lưu thông tin thí sinh và học bạ thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi lưu thông tin:", error);
        alert("Không thể lưu thông tin. Vui lòng thử lại!");
    }
}

// ==================== Gán sự kiện cho nút lưu ====================
document.getElementById("savePersonalInfo")?.addEventListener("click", savePersonalInfo);

// ==================== Cập nhật huyện và mã tỉnh tự động ====================
function setupProvinceChange(provinceId, districtId, codeFieldId) {
    const provinceSelect = document.getElementById(provinceId);
    const districtSelect = document.getElementById(districtId);
    const codeField = document.getElementById(codeFieldId);

    if (!provinceSelect || !districtSelect || !codeField) return;

    provinceSelect.addEventListener("change", (e) => {
        const province = e.target.value;
        const districtList = districts[province] || [];
        districtSelect.innerHTML = "<option value=''>-- Chọn quận/huyện --</option>";

        districtList.forEach((d) => {
            const opt = document.createElement("option");
            opt.value = d;
            opt.textContent = d;
            districtSelect.appendChild(opt);
        });

        codeField.value = provinceCodes[province] || "";
    });
}

// ==================== Gọi setup cho các trường ====================
setupProvinceChange("province", "district", "provinceCode");
setupProvinceChange("schoolProvince10", "schoolDistrict10", "schoolProvinceCode10");
setupProvinceChange("schoolProvince11", "schoolDistrict11", "schoolProvinceCode11");
setupProvinceChange("schoolProvince12", "schoolDistrict12", "schoolProvinceCode12");

// ==================== Lưu nguyện vọng ====================
async function saveAspirations() {
    const uid = sessionStorage.getItem("uid");
    if (!uid) return showNotification("❌ Chưa đăng nhập!");

    const aspirations = [];

    // Giả sử có 3 nguyện vọng
    for (let i = 1; i <= 3; i++) {
        const university = document.getElementById(`university${i}`)?.value.trim() || "";
        const major = document.getElementById(`major${i}`)?.value.trim() || "";
        if (university && major) {
            aspirations.push({ university, major, priority: i });
        }
    }

    await setDoc(doc(db, "students", uid), { aspirations }, { merge: true });
    showNotification("✅ Lưu nguyện vọng thành công!", false);
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