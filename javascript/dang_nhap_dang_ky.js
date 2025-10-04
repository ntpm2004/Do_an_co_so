// ==================== Import Firebase ====================
import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged
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
        alert(message);
        return;
    }
    noti.textContent = message;
    noti.style.display = "block";
    noti.style.backgroundColor = isError ? "#e74c3c" : "#27ae60";
    setTimeout(() => { noti.style.display = "none"; }, 3500);
}

// ==================== Toggle Role ====================
window.toggleFields = function () {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const loginLabel = document.getElementById("loginLabel");
    loginLabel.textContent = (userType === "student") ? "Số CMND/CCCD *" : "Username hoặc Email *";
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

    if (!cmnd || !fullname || !email || !phone || !password || !confirmPassword)
        return showNotification("⚠️ Vui lòng điền đầy đủ thông tin!");

    if (password !== confirmPassword)
        return showNotification("⚠️ Mật khẩu không khớp!");

    try {
        // Tạo tài khoản
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        // Gửi email xác minh
        await sendEmailVerification(user);

        // 🔹 Lưu thông tin cơ bản vào Firestore
        await setDoc(doc(db, "users", uid), {
            cmnd,
            fullname,
            email,
            phone,
            role: "student",
            status: "pending",
            verified: false,
            createdAt: new Date().toISOString()
        });

        // 🔹 Tạo document trống trong students
        await setDoc(doc(db, "students", uid), {
            personalInfo: {},
            schoolRecords: {},
            aspirations: [],
            cccdImageUrl: "",
            transcriptImageUrl: "",
            createdAt: new Date().toISOString()
        });

        // Hiển thị thông báo và chờ xác minh email
        showNotification("Đăng ký thành công! Vui lòng mở email và nhấn vào link xác minh trước khi đăng nhập.", false);

        // Không tự động chuyển — chỉ signOut để người dùng xác minh
        await signOut(auth);
    } catch (err) {
        showNotification("❌ Lỗi: " + err.message);
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
            const user = userCredential.user;

            // 🔹 Kiểm tra đã xác minh email chưa
            if (!user.emailVerified) {
                showNotification("⚠️ Email của bạn chưa được xác minh. Vui lòng kiểm tra hộp thư!", true);
                await signOut(auth);
                return;
            }

            sessionStorage.setItem("uid", user.uid);
            sessionStorage.setItem("role", "student");

            showNotification("Đăng nhập thí sinh thành công!", false);
            setTimeout(() => { window.location.assign("thi_sinh.html"); }, 800);
            return;
        }

        // ---- Admin login ----
        if (userType === "admin") {
            const adminAccounts = [
                { username: "admin1", password: "123456" },
                { username: "superadmin", password: "admin123" }
            ];
            const found = adminAccounts.find(
                (a) => a.username === loginId && a.password === loginPassword
            );
            if (!found) return showNotification("Sai thông tin admin!");
            sessionStorage.setItem("role", "admin");
            sessionStorage.setItem("username", found.username);
            showNotification("Đăng nhập admin thành công!", false);
            setTimeout(() => { window.location.assign("admin.html"); }, 800);
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

// Mở modal đăng nhập
loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    registrationContainer.style.display = "none";
    loginModal.style.display = "block";
});

// Mở form đăng ký
signupBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registrationContainer.style.display = "block";
});

// Từ form đăng ký → đăng nhập
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

// ==================== Theo dõi xác minh email ====================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await user.reload();
        if (user.emailVerified) {
            showNotification("Email đã xác minh! Bạn có thể đăng nhập ngay.", false);
            registrationContainer.style.display = "none";
            loginModal.style.display = "block";
            await signOut(auth);
        }
    }
});