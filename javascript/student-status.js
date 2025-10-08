    // ==================== Import Firebase ====================
    import { db } from "./firebase-config.js";
    import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

    document.addEventListener("DOMContentLoaded", async () => {
    const statusText = document.getElementById("student-status");
    const box = document.getElementById("status-box");

    // ==================== Lấy UID hiện tại (giống bên Admin) ====================
    // UID này được lưu khi đăng nhập hoặc khi tạo hồ sơ
    const currentUID =
        sessionStorage.getItem("uid") ||
        localStorage.getItem("currentUID") ||
        sessionStorage.getItem("currentUID");
    if (!currentUID) {
        statusText.textContent = "❌ Không tìm thấy mã người dùng.";
        return;
    }

    try {
        // ==================== Lấy trạng thái hồ sơ ====================
        const docSnap = await getDoc(doc(db, "students", currentUID));

        if (docSnap.exists()) {
        const data = docSnap.data();
        const status = data.status || "pending"; // mặc định nếu chưa có

        // ==================== Hiển thị trạng thái ====================
        if (status === "approved") {
            statusText.textContent = "✅ Hồ sơ của bạn đã được duyệt.";
            statusText.style.color = "green";
            box.style.border = "2px solid green";
        } else if (status === "rejected") {
            statusText.textContent = "❌ Hồ sơ của bạn đã bị từ chối.";
            statusText.style.color = "red";
            box.style.border = "2px solid red";
        } else {
            statusText.textContent = "⌛ Hồ sơ của bạn đang được xem xét.";
            statusText.style.color = "orange";
            box.style.border = "2px solid orange";
        }
        } else {
        statusText.textContent = "⚠️ Không tìm thấy hồ sơ trong hệ thống.";
        }
    } catch (error) {
        console.error("Lỗi khi tải trạng thái hồ sơ:", error);
        statusText.textContent = "⚠️ Lỗi khi tải trạng thái hồ sơ.";
    }
    });
