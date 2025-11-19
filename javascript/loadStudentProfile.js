// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { districts } from "./thi_sinh_1.js"; // export { districts }

// ====== Cờ trạng thái & whitelist toàn cục ======
window.__profileLockState = "none";
window.__lockWhitelist = new Set();

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

    const safeSet = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value ?? "";
    };

    // 1) Thông tin cá nhân
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

    // 2) Danh sách huyện theo tỉnh
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    if (provinceSelect && districtSelect) {
      provinceSelect.value = p.province || "";
      updateDistrictOptions(provinceSelect, districtSelect, p.district);
    }

    // 3) Trường học
    if (s.grade10) fillSchoolData(s.grade10, "10");
    if (s.grade11) fillSchoolData(s.grade11, "11");
    if (s.grade12) fillSchoolData(s.grade12, "12");

    // 4) Cho phép nhập mã quận/huyện (sẽ bị override nếu rejected)
    if (window.__profileLockState !== "rejected") {
      const districtCodeInputs = document.querySelectorAll("input[id^='districtCode']");
      districtCodeInputs.forEach(el => {
        el.disabled = false;
        el.style.backgroundColor = "#fff";
        el.setAttribute("placeholder", "Nhập mã quận/huyện (vd: S01)");
      });
    }

    // 5) Áp trạng thái duyệt
    applyReviewState(uid, data);

    // 6) (tuỳ chọn) hiển thị trạng thái
    const statusContainer = document.getElementById("profile-status");
    if (statusContainer) {
      statusContainer.innerHTML = "";
      const div = document.createElement("div");
      const reviewStatus = (data.reviewStatus || data.status || "pending").toLowerCase();
      if (reviewStatus === "approved") {
        div.innerHTML = "<span style='color: green; font-weight: 600;'>✅ Hồ sơ của bạn đã được duyệt.</span>";
      } else if (reviewStatus === "rejected") {
        const reasonText = data.rejectReasonText || data.reason || "Không xác định";
        div.innerHTML = `<span style="color: red; font-weight: 600;">❌ Hồ sơ của bạn chưa đạt yêu cầu.<br>Lý do: ${reasonText}</span>`;
      } else {
        div.innerHTML = "<span style='color: orange;'>⏳ Hồ sơ của bạn đang chờ xét duyệt...</span>";
      }
      statusContainer.appendChild(div);
    }

    console.log("✅ Dữ liệu đã tải:", data);
  } catch (error) {
    console.error("❌ Lỗi khi tải dữ liệu:", error);
    alert("Không thể tải dữ liệu. Kiểm tra console để xem lỗi chi tiết.");
  }
}

// ==================== Áp trạng thái duyệt ====================
function applyReviewState(uid, data) {
  const reviewStatus = (data.reviewStatus || data.status || "pending").toLowerCase();

  if (reviewStatus === "approved") {
    window.__profileLockState = "approved";
    window.__lockWhitelist = new Set();
    lockAllControls();
    detachLockObserver();
    sessionStorage.removeItem(`rejectedNotified:${uid}`);
    return;
  }

  if (reviewStatus === "rejected") {
    window.__profileLockState = "rejected";

    const reasonText = data.rejectReasonText || data.reason || "Không xác định";
    const notifiedKey = `rejectedNotified:${uid}`;
    if (!sessionStorage.getItem(notifiedKey)) {
      alert(`⚠️ Hồ sơ của bạn chưa đạt yêu cầu!\nLý do: ${reasonText}`);
      sessionStorage.setItem(notifiedKey, "1");
    }

    const rejectReasons = data.rejectReasons || {}; // { fieldId: "incorrect" | "correct" }

    // 👉 Nếu có rejectReasons thì KHÔNG dùng invalidFields (cơ chế cũ)
    const useInvalidFields = Object.keys(rejectReasons).length === 0;
    const invalidFields = useInvalidFields && Array.isArray(data.invalidFields) ? data.invalidFields : [];

    // Tạo whitelist
    const whitelist = new Set(
      Object.entries(rejectReasons)
        .filter(([, v]) => (v || "").toLowerCase() === "incorrect")
        .map(([k]) => String(k).trim())
    );
    invalidFields.forEach(id => { if (id) whitelist.add(String(id).trim()); });

    window.__lockWhitelist = whitelist;
    enforceWhitelist(whitelist);
    console.log("[reject whitelist]", Array.from(whitelist));

    attachLockObserver(); // giữ khoá chắc chắn
    return;
  }

  // pending
  window.__profileLockState = "pending";
  window.__lockWhitelist = new Set();
  unlockAllControls();
  detachLockObserver();
  sessionStorage.removeItem(`rejectedNotified:${uid}`);
}

// ==================== MutationObserver: giữ khoá khi bị rejected ====================
let __lockObserver = null;

function attachLockObserver() {
  if (__lockObserver) return;
  __lockObserver = new MutationObserver((mutations) => {
    if (window.__profileLockState !== "rejected") return;
    mutations.forEach(m => {
      if (!(m.target instanceof HTMLElement)) return;
      const el = m.target;
      const id = (el.id || "").trim();
      if (!window.__lockWhitelist.has(id)) {
        forceLock(el);
      }
    });
  });
  __lockObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["disabled", "style", "class", "readonly"],
    subtree: true
  });
}

function detachLockObserver() {
  if (__lockObserver) {
    __lockObserver.disconnect();
    __lockObserver = null;
  }
}

// ==================== Helpers khóa/mở ====================
function forceLock(el) {
  el.disabled = true;
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.readOnly = true;
  el.style.backgroundColor = "#e0e0e0";
  el.style.outline = "";
  try { el.blur(); } catch(_) {}
}
function lockAllControls() {
  const controls = document.querySelectorAll("input, select, textarea");
  controls.forEach(forceLock);
}
function unlockAllControls() {
  const controls = document.querySelectorAll("input, select, textarea");
  controls.forEach(el => {
    el.disabled = false;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.readOnly = false;
    el.style.backgroundColor = "#ffffff";
    el.style.outline = "";
  });
}
function enforceWhitelist(whitelist) {
  const controls = document.querySelectorAll("input, select, textarea");
  controls.forEach(el => {
    const id = (el.id || "").trim();
    if (whitelist.has(id)) {
      el.disabled = false;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.readOnly = false;
      el.style.backgroundColor = "#ffffff";
      el.style.outline = "2px solid #dc3545";
    } else {
      forceLock(el);
    }
  });
}

// ==================== Hàm cập nhật trường học ====================
function fillSchoolData(grade, num) {
  const safeSet = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
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

  // Chỉ mở districtCode khi KHÔNG ở trạng thái rejected
  const districtCodeInput = document.getElementById(`districtCode${num}`);
  if (districtCodeInput && window.__profileLockState !== "rejected") {
    districtCodeInput.disabled = false;
    districtCodeInput.style.backgroundColor = "#fff";
    districtCodeInput.setAttribute("placeholder", "Nhập mã quận/huyện (vd: S01)");
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

// ==================== Load học bạ ====================
async function loadSchoolRecords() {
  const uid = sessionStorage.getItem("uid");
  if (!uid) return;

  try {
    const ref = doc(db, "schoolRecords", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const subjects = ["toan","ly","hoa","sinh","van","su","dia","anh","gdcd","nhat","trung","han"];

    subjects.forEach((subject) => {
      if (data[subject]) {
        const s11k1 = document.getElementById(`${subject}_ky1_lop11`);
        const s11k2 = document.getElementById(`${subject}_ky2_lop11`);
        const s12k1 = document.getElementById(`${subject}_ky1_lop12`);
        if (s11k1) s11k1.value = data[subject].lop11_ky1 || "";
        if (s11k2) s11k2.value = data[subject].lop11_ky2 || "";
        if (s12k1) s12k1.value = data[subject].lop12_ky1 || "";
      }
    });

    console.log("✅ Học bạ đã được tải lên form!");
  } catch (error) {
    console.error("❌ Lỗi khi tải học bạ:", error);
  }
}

// ==================== Load nguyện vọng ====================
async function loadAspirations() {
  const uid = sessionStorage.getItem("uid");
  if (!uid) return;

  try {
    const snap = await getDoc(doc(db, "aspirations", uid));
    if (!snap.exists()) return;

    const data = snap.data();
    const wishes = data.wishes || [];

    wishes.forEach((wish, index) => {
      const majorEl = document.getElementById(`major${index + 1}`);
      const blockEl = document.getElementById(`block${index + 1}`);

      if (majorEl && blockEl) {
        majorEl.value = wish.major || "";
        if (typeof updateBlocks === "function") updateBlocks(majorEl, blockEl);
        if (wish.block) {
          const exists = Array.from(blockEl.options).some(o => o.value === wish.block);
          if (!exists) {
            const opt = document.createElement("option");
            opt.value = wish.block;
            opt.textContent = wish.block;
            blockEl.appendChild(opt);
          }
          blockEl.value = wish.block || "";
        }
      }
    });

    console.log("✅ Nguyện vọng đã tải:", wishes);
  } catch (error) {
    console.error("❌ Lỗi khi load nguyện vọng:", error);
  }
}

// ==================== Khi tải trang ====================
window.addEventListener("DOMContentLoaded", loadSchoolRecords);
window.addEventListener("DOMContentLoaded", loadAspirations);
