// ==================== Import Firebase ====================
import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== Notification ====================
function showNotification(message, isError = true) {
    const noti = document.getElementById("notification");
    if (!noti) {
        alert(message); // fallback nếu không có div notification
        return;
    }
    noti.textContent = message;
    noti.style.display = "block";
    noti.style.backgroundColor = isError ? "red" : "green";
    setTimeout(() => { noti.style.display = "none"; }, 3000);
}

// ==================== Toggle Role ====================
window.toggleFields = function () {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const loginLabel = document.getElementById("loginLabel");

    if (userType === "student") {
        loginLabel.textContent = "Số CMND/CCCD *";
    } else {
        loginLabel.textContent = "Username hoặc Email *";
    }
};

// ==================== Đăng ký (Student) ====================
document.getElementById("registerButton")?.addEventListener("click", async (e) => {
    e.preventDefault();

    const cmnd = document.getElementById("cmnd").value.trim();
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!cmnd || !fullname || !email || !phone || !password || !confirmPassword) {
        return showNotification("Vui lòng điền đầy đủ thông tin!");
    }
    if (password !== confirmPassword) {
        return showNotification("Mật khẩu không khớp!");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 🔹 Lưu thông tin cơ bản vào "users"
        await setDoc(doc(db, "users", uid), {
            cmnd,
            fullname,
            email,
            phone,
            role: "student",
            status: "pending",
            createdAt: new Date().toISOString()
        });

        // 🔹 Tạo document rỗng trong "students"
        await setDoc(doc(db, "students", uid), {
            personalInfo: {},
            schoolRecords: {},
            aspirations: [],
            cccdImageUrl: "",
            transcriptImageUrl: "",
            createdAt: new Date().toISOString()
        });

        showNotification("Đăng ký thành công! Vui lòng đăng nhập.", false);
        setTimeout(() => {
            document.getElementById("registrationContainer").style.display = "none";
            document.getElementById("loginModal").style.display = "block";
        }, 1000);

    } catch (err) {
        showNotification("Lỗi: " + err.message);
    }
});

// ==================== Đăng nhập ====================
window.handleLogin = async function (e) {
    e.preventDefault();

    const userType = document.querySelector('input[name="userType"]:checked').value;
    const loginId = document.getElementById("login_id").value.trim();
    const loginPassword = document.getElementById("login_password").value;

    try {
        // ---- Student login ----
        if (userType === "student") {
            const q = query(collection(db, "users"), where("cmnd", "==", loginId), where("role", "==", "student"));
            const snap = await getDocs(q);
            if (snap.empty) return showNotification("Không tìm thấy thí sinh.");

            const email = snap.docs[0].data().email;
            const userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);

            sessionStorage.setItem("uid", userCredential.user.uid);
            sessionStorage.setItem("role", "student");

            showNotification("Đăng nhập thí sinh thành công!", false);
            setTimeout(() => { window.location.assign("thi_sinh.html"); }, 800);
            return;
        }

        // ---- Admin login (Không xác thực Firebase) ----
        if (userType === "admin") {
            // Danh sách tài khoản admin (cố định)
            const adminAccounts = [
                { username: "admin1", password: "123456" },
                { username: "superadmin", password: "admin123" }
            ];

            // Tìm admin có username + password khớp
            const found = adminAccounts.find(
                (a) => a.username === loginId && a.password === loginPassword
            );

            if (!found) {
                return showNotification("Sai thông tin admin!");
            }

            // Nếu đúng -> lưu session và vào trang admin
            sessionStorage.setItem("role", "admin");
            sessionStorage.setItem("username", found.username);

            showNotification("Đăng nhập admin thành công!", false);
            setTimeout(() => { window.location.assign("admin.html"); }, 800);
            return;
        }
    } catch (err) {
        console.error("Login error:", err);
        showNotification("Lỗi đăng nhập: " + err.message);
    }
};

// ==================== Chuyển form ====================
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginModal = document.getElementById("loginModal");
const registrationContainer = document.getElementById("registrationContainer");
const openLoginModal = document.getElementById("openLoginModal");
const backToRegister = document.getElementById("backToRegister");

// Mở modal đăng nhập khi ấn "Đăng nhập" trên header
loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    registrationContainer.style.display = "none";
    loginModal.style.display = "block";
});

// Mở form đăng ký khi ấn "Đăng ký" trên header
signupBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registrationContainer.style.display = "block";
});

// Từ form đăng ký → mở đăng nhập
openLoginModal?.addEventListener("click", (e) => {
    e.preventDefault();
    registrationContainer.style.display = "none";
    loginModal.style.display = "block";
});

// Từ modal đăng nhập → quay về đăng ký
backToRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registrationContainer.style.display = "block";
});