// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { districts } from "./thi_sinh_1.js"; // Đảm bảo file này export { districts }

// ==================== Load dữ liệu thí sinh ====================
async function loadStudentProfile() {
    const uid = sessionStorage.getItem("uid");
    const statusText = document.getElementById("student-status");
    const box = document.getElementById("status-box");

    if (!uid) {
        statusText.textContent = "❌ Bạn chưa đăng nhập!";
        box.style.border = "2px solid red";
        return;
    }

    try {
        const ref = doc(db, "students", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            statusText.textContent = "⚠️ Bạn chưa tạo hồ sơ. Vui lòng điền thông tin và lưu!";
            box.style.border = "2px solid gray";
            statusText.style.color = "gray";
            return;
        }

        const data = snap.data() || {};
        const status = data.status || "pending"; // pending nếu chưa được duyệt

        // ==================== Hiển thị trạng thái ====================
        if (status === "approved") {
            statusText.textContent = "✅ Hồ sơ của bạn đã được duyệt.";
            statusText.style.color = "green";
            box.style.border = "2px solid green";
        } else if (status === "rejected") {
            statusText.textContent = "❌ Hồ sơ của bạn đã bị từ chối.";
            statusText.style.color = "red";
            box.style.border = "2px solid red";
        } else if (status === "pending") {
            statusText.textContent = "⌛ Hồ sơ của bạn đang được xem xét.";
            statusText.style.color = "orange";
            box.style.border = "2px solid orange";
        } else {
            statusText.textContent = "⚠️ Trạng thái không xác định.";
            statusText.style.color = "gray";
            box.style.border = "2px solid gray";
        }

        // ==================== Load thêm thông tin nếu cần ====================
        const p = data.personalInfo || {};
        const s = data.schoolRecords || {};
        const safeSet = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value || "";
        };

        safeSet("name", p.fullname);
        safeSet("dob", p.dob);
        safeSet("gender", p.gender);
        safeSet("email", p.email);
        // ... (giữ nguyên phần fill dữ liệu khác của bạn)
    } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
        statusText.textContent = "⚠️ Lỗi khi tải dữ liệu hồ sơ.";
        statusText.style.color = "red";
        box.style.border = "2px solid red";
    }
}

// ==================== Khi tải trang ====================
window.addEventListener("DOMContentLoaded", loadStudentProfile);