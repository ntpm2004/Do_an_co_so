// ==================== Firebase Khởi tạo ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config Firebase (thay giá trị thật của bạn vào đây)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MSG_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

        await setDoc(doc(db, "users", userCredential.user.uid), {
            cmnd,
            fullname,
            email,
            phone,
            role: "student"
        });

        showNotification("Đăng ký thành công!", false);
        setTimeout(() => { window.location.reload(); }, 1000);
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

        // ---- Admin login ----
        if (userType === "admin") {
            let emailToUse = "";

            if (loginId.includes("@")) {
                emailToUse = loginId;
            } else {
                const q = query(collection(db, "users"), where("username", "==", loginId), where("role", "==", "admin"));
                const snap = await getDocs(q);
                if (snap.empty) return showNotification("Không tìm thấy username admin.");
                emailToUse = snap.docs[0].data().email;
            }

            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
            const adminDoc = await getDoc(doc(db, "users", userCredential.user.uid));

            if (!adminDoc.exists() || adminDoc.data().role !== "admin") {
                await signOut(auth);
                return showNotification("Tài khoản không có quyền admin.");
            }

            sessionStorage.setItem("uid", userCredential.user.uid);
            sessionStorage.setItem("role", "admin");

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