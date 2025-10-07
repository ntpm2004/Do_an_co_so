// ==================== Import Firebase ====================
import { db } from "./firebase-config.js";
import {
    getDocs,
    getDoc,
    doc,
    collection
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Sự kiện đăng xuất ====================
document.querySelector(".signout-btn")?.addEventListener("click", () => {
    window.location.href = "dang_nhap_dang_ky.html";
});

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
						${wishes?.length
                    ? wishes.map(w => `<tr><td>${w.major}</td></tr>`).join("")
                    : "<tr><td>Không có nguyện vọng</td></tr>"
                }
					</table>
				</td>
				<td>
					<table>
						${wishes?.length
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
