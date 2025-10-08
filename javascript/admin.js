// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import {
    getDocs,
    getDoc,
    doc,
    collection,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Sự kiện đăng xuất ====================
document.querySelector(".signout-btn")?.addEventListener("click", () => {
    window.location.href = "dang_nhap_dang_ky.html";
});

// ==================== Biến toàn cục ====================
let currentUID = null;

// ==================== Khi tải trang ====================
document.addEventListener("DOMContentLoaded", async function () {
    const studentList = document.getElementById("student-list");

    // ==================== Hàm hiển thị danh sách ====================
    function displayStudents(students) {
        studentList.innerHTML = "";

        if (students.length === 0) {
            alert("Không tìm thấy sinh viên.");
            return;
        }

        students.forEach((student, index) => {
            const { uid, name, cmnd, phone, wishes } = student;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${name || "Chưa có tên"}</td>
                <td>${cmnd || "Không có"}</td>
                <td>${phone || "Không có"}</td>
                <td>
                    <table>
                        ${
                            wishes?.length
                                ? wishes.map(w => `<tr><td>${w.major}</td></tr>`).join("")
                                : "<tr><td>Không có nguyện vọng</td></tr>"
                        }
                    </table>
                </td>
                <td>
                    <table>
                        ${
                            wishes?.length
                                ? wishes.map((_, i) => `<tr><td>${i + 1}</td></tr>`).join("")
                                : "<tr><td>Không có</td></tr>"
                        }
                    </table>
                </td>
                <td><button class="view-button" data-uid="${uid}">Xem</button></td>
            `;
            studentList.appendChild(row);
        });
    }

    // ==================== Hàm tải dữ liệu từ Firebase ====================
    async function loadAllStudents() {
        const students = [];

        try {
            const querySnapshot = await getDocs(collection(db, "students"));

            for (const docSnap of querySnapshot.docs) {
                const data = docSnap.data();
                const personal = data.personalInfo || {};
                const uid = docSnap.id;

                // Lấy thêm nguyện vọng nếu có
                let wishes = [];
                const aspSnap = await getDoc(doc(db, "aspirations", uid));
                if (aspSnap.exists()) {
                    wishes = aspSnap.data().wishes || [];
                }

                students.push({
                    uid,
                    name: personal.fullname || "",
                    cmnd: personal.identity || "",
                    phone: personal.studentPhone || "",
                    wishes
                });
            }

            displayStudents(students);
            window.allStudents = students; // lưu tạm để tìm kiếm
        } catch (err) {
            console.error("❌ Lỗi tải danh sách:", err);
            alert("Không thể tải danh sách sinh viên từ Firestore.");
        }
    }

    await loadAllStudents();

    // ==================== Tìm kiếm ====================
    const filterForm = document.querySelector(".filter-form form");
    filterForm.onsubmit = function (event) {
        event.preventDefault();

        const name = document.getElementById("ho-ten").value.toLowerCase();
        const cmnd = document.getElementById("cmnd").value.trim();
        const phone = document.getElementById("sdt").value.trim();
        const major = document.getElementById("nganh").value;

        const filtered = window.allStudents.filter((s) => {
            const matchesName = !name || s.name.toLowerCase().includes(name);
            const matchesCMND = !cmnd || s.cmnd.includes(cmnd);
            const matchesPhone = !phone || s.phone.includes(phone);
            const matchesMajor = !major || s.wishes.some(w => w.major === major);
            return matchesName && matchesCMND && matchesPhone && matchesMajor;
        });

        displayStudents(filtered);
    };

    // ==================== Reset ====================
    document.querySelector(".reset-btn").onclick = function () {
        document.getElementById("ho-ten").value = "";
        document.getElementById("cmnd").value = "";
        document.getElementById("sdt").value = "";
        document.getElementById("nganh").value = "";
        displayStudents(window.allStudents || []);
    };
});

// ==================== Xem chi tiết thí sinh ====================
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("view-button")) return;

    currentUID = e.target.dataset.uid; // ✅ lưu UID hiện tại

    const modal = document.getElementById("student-modal");
    const closeBtn = modal.querySelector(".close-btn");

    modal.style.display = "block";

    closeBtn.onclick = () => (modal.style.display = "none");
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = "none";
    };

    try {
        const studentSnap = await getDoc(doc(db, "students", currentUID));
        const recordSnap = await getDoc(doc(db, "schoolRecords", currentUID));
        const aspirationSnap = await getDoc(doc(db, "aspirations", currentUID));

        if (!studentSnap.exists()) return;
        const data = studentSnap.data() || {};
        const p = data.personalInfo || {};
        const s = data.schoolRecords || {};

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "";
        };

        // === 1️⃣ Thông tin cá nhân ===
        set("m-fullname", p.fullname);
        set("m-gender", p.gender);
        set("m-dob", p.dob);
        set("m-email", p.email);
        set("m-ethnicity", p.ethnicity);
        set("m-religion", p.religion);

        // === 2️⃣ CCCD ===
        set("m-identity", p.identity);
        set("m-issueDate", p.issueDate);
        set("m-issuedBy", p.issuedBy);

        // === 3️⃣ Địa chỉ liên hệ ===
        set("m-province", p.province);
        set("m-district", p.district);
        set("m-ward", p.ward);
        set("m-village", p.village);
        set("m-studentPhone", p.studentPhone);
        set("m-parentPhone", p.parentPhone);

        // === 4️⃣ Trường học ===
        const schoolName = (grade) =>
            grade ? `${grade.schoolName || ""} (${grade.district || ""}, ${grade.province || ""})` : "—";
        set("m-school10", schoolName(s.grade10));
        set("m-school11", schoolName(s.grade11));
        set("m-school12", schoolName(s.grade12));

        // === 5️⃣ Học bạ ===
        if (recordSnap.exists()) {
            const rec = recordSnap.data();
            const tbody = document.getElementById("m-transcript");
            tbody.innerHTML = "";
            const subjects = ["toan", "ly", "hoa", "sinh", "van", "su", "dia", "anh", "gdcd", "nhat", "trung", "han"];
            subjects.forEach(sub => {
                if (rec[sub]) {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${sub.toUpperCase()}</td>
                        <td>${rec[sub].lop11_ky1 || ""}</td>
                        <td>${rec[sub].lop11_ky2 || ""}</td>
                        <td>${rec[sub].lop12_ky1 || ""}</td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        }

        // === 6️⃣ Nguyện vọng ===
        if (aspirationSnap.exists()) {
            const data = aspirationSnap.data();
            const wishes = data.wishes || [];
            const ul = document.getElementById("m-wishes");
            ul.innerHTML = "";
            wishes.forEach((w, i) => {
                const li = document.createElement("li");
                li.textContent = `Nguyện vọng ${i + 1}: ${w.major || ""} - Tổ hợp: ${w.block || ""}`;
                ul.appendChild(li);
            });
        }

        console.log(`✅ Đã hiển thị chi tiết thí sinh ${currentUID}`);
    } catch (error) {
        console.error("❌ Lỗi khi xem chi tiết:", error);
        alert("Không thể tải chi tiết thí sinh!");
    }
});

// ==================== Duyệt / Từ chối hồ sơ ====================
const approveBtn = document.getElementById("approve-btn");
const rejectBtn = document.getElementById("reject-btn");

if (approveBtn && rejectBtn) {
    approveBtn.addEventListener("click", async () => {
        if (!currentUID) return alert("Chưa chọn thí sinh.");
        await updateDoc(doc(db, "students", currentUID), { status: "approved" });
        alert("✅ Hồ sơ đã được duyệt");
    });

    rejectBtn.addEventListener("click", async () => {
        if (!currentUID) return alert("Chưa chọn thí sinh.");
        await updateDoc(doc(db, "students", currentUID), { status: "rejected" });
        alert("❌ Hồ sơ đã bị từ chối");
    });
}
