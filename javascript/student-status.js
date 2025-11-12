// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Load trạng thái hồ sơ (CHỈ HIỂN THỊ) ====================
async function loadStudentStatus() {
  const uid = sessionStorage.getItem("uid");
  const statusText = document.getElementById("student-status");
  const box = document.getElementById("status-box");

  if (!statusText || !box) return; // nếu trang này không có khung trạng thái

  if (!uid) {
    statusText.textContent = "❌ Bạn chưa đăng nhập!";
    box.style.border = "2px solid red";
    statusText.style.color = "red";
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
    const status = (data.reviewStatus || data.status || "pending").toLowerCase();
    const reason = data.rejectReasonText || data.reason || "";

    if (status === "approved") {
      statusText.textContent = "✅ Hồ sơ của bạn đã được duyệt.";
      statusText.style.color = "green";
      box.style.border = "2px solid green";
    } else if (status === "rejected") {
      statusText.textContent = reason
        ? `❌ Hồ sơ của bạn đã bị từ chối.\nLý do: ${reason}`
        : "❌ Hồ sơ của bạn đã bị từ chối.";
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
  } catch (e) {
    console.error("❌ Lỗi load trạng thái:", e);
    statusText.textContent = "⚠️ Lỗi khi tải trạng thái hồ sơ.";
    statusText.style.color = "red";
    box.style.border = "2px solid red";
  }
}

// ==================== Khi tải trang ====================
window.addEventListener("DOMContentLoaded", loadStudentStatus);
