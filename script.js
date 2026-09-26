/* ============================================================
   JEEVANSETU - CLEAN JAVASCRIPT
   ============================================================ */

const API_BASE_URL = "https://jeevansetu-new.onrender.com";

let hospitals = [];
let currentUser = null;

let userIdOTP = null;
let passwordOTP = null;
let passwordRecoveryUser = null;


/* ============================================================
   BASIC HELPERS
   ============================================================ */

function getElement(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getLocalStorageJSON(key) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value);

    } catch (error) {
        console.error("LocalStorage error:", error);
        return null;
    }
}


function setLocalStorageJSON(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error("LocalStorage save error:", error);
        return false;
    }
}


function getLocalDateString() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function generateOTP() {

    return String(
        Math.floor(
            100000 + Math.random() * 900000
        )
    );

}


/* ============================================================
   LOADING
   ============================================================ */

function showLoading(container, message = "Loading...") {

    if (!container) return;

    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}


function setButtonLoading(button, text) {

    if (!button) return;

    if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerText;
    }

    button.disabled = true;
    button.innerText = text;
}


function restoreButton(button) {

    if (!button) return;

    button.disabled = false;

    if (button.dataset.originalText) {
        button.innerText =
            button.dataset.originalText;
    }
}


/* ============================================================
   AUTH MODAL
   ============================================================ */

function openAuthModal() {

    const modal = getElement("auth-modal");

    if (modal) {
        modal.style.display = "flex";
    }

}


function closeAuthModal() {

    const modal = getElement("auth-modal");

    if (modal) {
        modal.style.display = "none";
    }

}


function hideAllAuthForms() {

    const forms = [
        "login-form",
        "register-form",
        "forgot-user-id-form",
        "forgot-password-form",
        "new-password-form",
        "user-profile"
    ];

    forms.forEach(id => {

        const element = getElement(id);

        if (element) {
            element.style.display = "none";
        }

    });

}


/* ============================================================
   LOGIN / REGISTER SCREEN
   ============================================================ */

function showLoginForm() {

    openAuthModal();

    hideAllAuthForms();

    getElement("login-form").style.display = "block";
}


function showRegisterForm() {

    openAuthModal();

    hideAllAuthForms();

    getElement("register-form").style.display = "block";
}


/* ============================================================
   USER ID
   ============================================================ */

function generateUserId() {

    let id;

    do {

        const number = Math.floor(
            100000 + Math.random() * 900000
        );

        id = `JSU-${number}`;

    } while (
        getLocalStorageJSON("jeevansetu_user")?.id === id
    );

    return id;
}


/* ============================================================
   REGISTER
   ============================================================ */

function registerUser() {

    const name =
        getElement("register-name").value.trim();

    const mobile =
        getElement("register-mobile").value.trim();

    const email =
        getElement("register-email").value.trim();

    const password =
        getElement("register-password").value;


    if (!name || !mobile || !email || !password) {

        alert("Please fill all registration details.");
        return;
    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        alert("Please enter a valid email address.");
        return;
    }


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    const existingUser =
        getLocalStorageJSON("jeevansetu_user");


    if (existingUser) {

        alert(
            "An account is already registered on this browser."
        );

        showLoginForm();
        return;
    }


    const user = {

        id: generateUserId(),

        name,

        mobile,

        email,

        password

    };


    setLocalStorageJSON(
        "jeevansetu_user",
        user
    );

    setLocalStorageJSON(
        "jeevansetu_current_user",
        user
    );


    currentUser = user;


    alert(
        "✅ Registration Successful!\n\n" +
        "Your User ID:\n" +
        user.id +
        "\n\nPlease save your User ID."
    );


    closeAuthModal();

    updateLoginState();

    loadAppointments();

}


/* ============================================================
   LOGIN
   ============================================================ */

function loginUser() {

    const userId =
        getElement("login-user-id")
            .value
            .trim()
            .toUpperCase();

    const password =
        getElement("login-password")
            .value;


    if (!userId || !password) {

        alert(
            "Please enter User ID and password."
        );

        return;
    }


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!user) {

        alert(
            "No registered account found."
        );

        showRegisterForm();
        return;
    }


    if (
        user.id.toUpperCase() !== userId ||
        user.password !== password
    ) {

        alert(
            "❌ Invalid User ID or password."
        );

        return;
    }


    currentUser = user;

    setLocalStorageJSON(
        "jeevansetu_current_user",
        user
    );


    alert("✅ Login Successful!");

    closeAuthModal();

    updateLoginState();

    loadAppointments();

}


/* ============================================================
   LOGOUT
   ============================================================ */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "jeevansetu_current_user"
    );


    updateLoginState();

    const list =
        getElement("appointments-list");


    if (list) {

        list.innerHTML = `
            <div class="appointment-empty">
                <p>
                    🔐 Please login to view your appointments.
                </p>
            </div>
        `;

    }


    alert("✅ You have been logged out.");

}


/* ============================================================
   LOGIN STATE
   ============================================================ */

function updateLoginState() {

    const authArea =
        getElement("auth-area");

    if (!authArea) return;


    if (currentUser) {

        authArea.innerHTML = `

            <button
                type="button"
                class="auth-profile-btn"
                onclick="showUserProfile()">

                👤 ${escapeHTML(currentUser.name)}

            </button>

            <button
                type="button"
                class="auth-logout-btn"
                onclick="logoutUser()">

                Logout

            </button>

        `;

    } else {

        authArea.innerHTML = `

            <button
                type="button"
                class="auth-login-btn"
                onclick="showLoginForm()">

                Login

            </button>

            <button
                type="button"
                class="auth-register-btn"
                onclick="showRegisterForm()">

                Register

            </button>

        `;

    }

}


/* ============================================================
   FORGOT USER ID
   ============================================================ */

function showForgotUserId() {

    openAuthModal();

    hideAllAuthForms();

    getElement(
        "forgot-user-id-form"
    ).style.display = "block";


    getElement(
        "forgot-id-otp-section"
    ).style.display = "none";


    getElement(
        "forgot-id-result"
    ).innerHTML = "";

}


function sendUserIdOTP() {

    const mobile =
        getElement("forgot-id-mobile")
            .value.trim();


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (!user) {

        alert(
            "No JeevanSetu account found."
        );

        return;
    }


    if (user.mobile !== mobile) {

        alert(
            "This mobile number is not registered."
        );

        return;
    }


    userIdOTP = generateOTP();


    getElement(
        "forgot-id-otp-section"
    ).style.display = "block";


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        userIdOTP
    );

}


function verifyUserIdOTP() {

    const otp =
        getElement("forgot-id-otp")
            .value.trim();


    if (!otp) {

        alert("Please enter OTP.");
        return;
    }


    if (otp !== userIdOTP) {

        alert("❌ Invalid OTP.");
        return;
    }


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!user) {

        alert("User account not found.");
        return;
    }


    getElement(
        "forgot-id-result"
    ).innerHTML = `
        ✅ OTP verified.<br><br>
        <strong>Your User ID: ${escapeHTML(user.id)}</strong>
    `;


    userIdOTP = null;

}


/* ============================================================
   FORGOT PASSWORD
   ============================================================ */

function showForgotPassword() {

    openAuthModal();

    hideAllAuthForms();

    getElement(
        "forgot-password-form"
    ).style.display = "block";


    getElement(
        "forgot-password-otp-section"
    ).style.display = "none";


    getElement(
        "forgot-password-message"
    ).innerText = "";


    passwordRecoveryUser = null;

}


function sendPasswordOTP() {

    const userId =
        getElement("forgot-password-user-id")
            .value
            .trim()
            .toUpperCase();

    const mobile =
        getElement("forgot-password-mobile")
            .value.trim();


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!userId || !mobile) {

        alert(
            "Please enter User ID and mobile number."
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (!user) {

        alert(
            "No JeevanSetu account found."
        );

        return;
    }


    if (
        user.id.toUpperCase() !== userId ||
        user.mobile !== mobile
    ) {

        alert(
            "User ID and mobile number do not match."
        );

        return;
    }


    passwordRecoveryUser = user;

    passwordOTP = generateOTP();


    getElement(
        "forgot-password-otp-section"
    ).style.display = "block";


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        passwordOTP
    );

}


function verifyPasswordOTP() {

    const otp =
        getElement("forgot-password-otp")
            .value.trim();


    if (otp !== passwordOTP) {

        alert("❌ Invalid OTP.");
        return;
    }


    if (!passwordRecoveryUser) {

        alert(
            "Recovery session expired."
        );

        showForgotPassword();

        return;
    }


    passwordOTP = null;

    hideAllAuthForms();


    getElement(
        "new-password-form"
    ).style.display = "block";


    getElement("new-password").value = "";

    getElement(
        "confirm-new-password"
    ).value = "";

}


/* ============================================================
   RESET PASSWORD
   ============================================================ */

function resetPassword() {

    if (!passwordRecoveryUser) {

        alert(
            "Password recovery session expired."
        );

        showForgotPassword();

        return;
    }


    const newPassword =
        getElement("new-password").value;

    const confirmPassword =
        getElement(
            "confirm-new-password"
        ).value;


    if (!newPassword || !confirmPassword) {

        alert(
            "Please enter and confirm your new password."
        );

        return;
    }


    if (newPassword.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        alert(
            "❌ New passwords do not match."
        );

        return;
    }


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!user) {

        alert("User account not found.");
        return;
    }


    user.password = newPassword;


    setLocalStorageJSON(
        "jeevansetu_user",
        user
    );


    passwordRecoveryUser = null;


    alert(
        "✅ Password reset successfully!"
    );


    showLoginForm();


    getElement(
        "login-user-id"
    ).value = user.id;

}


/* ============================================================
   PROFILE
   ============================================================ */

function showUserProfile() {

    if (!currentUser) {

        showLoginForm();
        return;
    }


    openAuthModal();

    hideAllAuthForms();


    getElement(
        "user-profile"
    ).style.display = "block";


    loadProfile();

}


function enableProfileEditing() {

    const profile =
        getElement("user-profile");


    if (!profile) return;


    const fields =
        profile.querySelectorAll(
            "input:not(#profilePhotoInput), select, textarea"
        );


    fields.forEach(field => {

        field.disabled = false;

    });


    alert(
        "✏️ Profile editing enabled."
    );

}


function saveProfile() {

    if (!currentUser) {

        alert("Please login first.");
        return;
    }


    const value = id => {

        const element =
            getElement(id);

        return element
            ? element.value.trim()
            : "";

    };


    const profile = {

        firstName:
            value("profileFirstName"),

        lastName:
            value("profileLastName"),

        mobile:
            value("profileMobile"),

        email:
            value("profileEmail"),

        dob:
            value("profileDOB"),

        gender:
            value("profileGender"),

        address:
            value("profileAddress"),

        city:
            value("profileCity"),

        state:
            value("profileState"),

        pin:
            value("profilePin"),

        bloodGroup:
            value("profileBloodGroup"),

        height:
            value("profileHeight"),

        weight:
            value("profileWeight"),

        emergencyName:
            value("emergencyContactName"),

        emergencyNumber:
            value("emergencyContactNumber")

    };


    setLocalStorageJSON(
        `jeevansetu_profile_${currentUser.id}`,
        profile
    );


    /* Update main account details */

    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (user) {

        if (profile.firstName ||
            profile.lastName) {

            user.name =
                `${profile.firstName} ${profile.lastName}`
                    .trim();

        }

        if (profile.mobile) {
            user.mobile =
                profile.mobile;
        }

        if (profile.email) {
            user.email =
                profile.email;
        }


        setLocalStorageJSON(
            "jeevansetu_user",
            user
        );


        currentUser = user;


        setLocalStorageJSON(
            "jeevansetu_current_user",
            user
        );

    }


    const fields =
        getElement("user-profile")
            .querySelectorAll(
                "input, select, textarea"
            );


    fields.forEach(field => {

        if (
            field.id !==
            "profilePhotoInput"
        ) {

            field.disabled = true;

        }

    });


    updateLoginState();


    getElement(
        "profile-name"
    ).innerText =
        currentUser.name;


    alert(
        "✅ Profile changes saved successfully!"
    );

}


function loadProfile() {

    if (!currentUser) return;


    const saved =
        getLocalStorageJSON(
            `jeevansetu_profile_${currentUser.id}`
        );


    const profile =
        saved || {

            firstName:
                currentUser.name
                    ?.split(" ")[0] || "",

            lastName:
                currentUser.name
                    ?.split(" ")
                    .slice(1)
                    .join(" ") || "",

            mobile:
                currentUser.mobile || "",

            email:
                currentUser.email || ""

        };


    const fields = {

        profileFirstName:
            profile.firstName,

        profileLastName:
            profile.lastName,

        profileMobile:
            profile.mobile,

        profileEmail:
            profile.email,

        profileDOB:
            profile.dob,

        profileGender:
            profile.gender,

        profileAddress:
            profile.address,

        profileCity:
            profile.city,

        profileState:
            profile.state,

        profilePin:
            profile.pin,

        profileBloodGroup:
            profile.bloodGroup,

        profileHeight:
            profile.height,

        profileWeight:
            profile.weight,

        emergencyContactName:
            profile.emergencyName,

        emergencyContactNumber:
            profile.emergencyNumber

    };


    Object.entries(fields).forEach(
        ([id, value]) => {

            const element =
                getElement(id);

            if (element) {

                element.value =
                    value || "";

                element.disabled = true;

            }

        }
    );


    getElement(
        "profile-name"
    ).innerText =
        currentUser.name || "User";


    getElement(
        "profile-user-id"
    ).innerText =
        currentUser.id || "";

}


/* ============================================================
   PROFILE PHOTO
   ============================================================ */

function initializeProfilePhoto() {

    const input =
        getElement("profilePhotoInput");

    const preview =
        getElement("profilePreview");


    if (!input || !preview) return;


    input.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            if (!file) return;


            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select an image file."
                );

                this.value = "";
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    preview.src =
                        event.target.result;


                    if (currentUser) {

                        localStorage.setItem(
                            `jeevansetu_photo_${currentUser.id}`,
                            event.target.result
                        );

                    }

                };


            reader.readAsDataURL(file);

        }
    );

}


function loadProfilePhoto() {

    if (!currentUser) return;


    const photo =
        localStorage.getItem(
            `jeevansetu_photo_${currentUser.id}`
        );


    if (photo) {

        getElement(
            "profilePreview"
        ).src = photo;

    }

}


/* ============================================================
   COPY USER ID
   ============================================================ */

async function copyUserId() {

    if (!currentUser) return;


    try {

        await navigator.clipboard.writeText(
            currentUser.id
        );

        alert(
            "✅ User ID copied!\n\n" +
            currentUser.id
        );

    } catch {

        alert(
            "Your User ID:\n" +
            currentUser.id
        );

    }

}


/* ============================================================
   CHANGE PASSWORD
   ============================================================ */

function changePassword() {

    if (!currentUser) {

        alert("Please login first.");
        return;
    }


    const oldPassword =
        prompt("Enter your current password:");


    if (oldPassword === null) return;


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (
        !user ||
        user.password !== oldPassword
    ) {

        alert(
            "❌ Current password is incorrect."
        );

        return;
    }


    const newPassword =
        prompt("Enter your new password:");


    if (!newPassword) return;


    if (newPassword.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    user.password = newPassword;


    setLocalStorageJSON(
        "jeevansetu_user",
        user
    );


    currentUser = user;


    setLocalStorageJSON(
        "jeevansetu_current_user",
        user
    );


    alert(
        "✅ Password changed successfully."
    );

}


/* ============================================================
   AUTH LOGIN CHECK
   ============================================================ */

function isUserLoggedIn() {

    return Boolean(
        currentUser &&
        currentUser.id
    );

}


function requireLoginForAppointment() {

    if (!isUserLoggedIn()) {

        alert(
            "🔐 Please login first to book an appointment."
        );

        showLoginForm();

        return false;
    }

    return true;
}


/* ============================================================
   HOSPITALS
   ============================================================ */

async function loadHospitals() {

    const list =
        getElement("hospital-list");

    const message =
        getElement("result-message");


    if (list) {

        showLoading(
            list,
            "Loading government hospitals..."
        );

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/hospitals`
            );


        if (!response.ok) {

            throw new Error(
                "Hospital API failed"
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid hospital data"
            );

        }


        hospitals = data;


        if (list) {
            list.innerHTML = "";
        }


        if (message) {

            message.innerText =
                "Select a healthcare service to search.";

        }


    } catch (error) {

        console.error(error);


        if (list) {

            list.innerHTML = `

                <div class="hospital-card">

                    <h3>
                        ⚠️ Unable to load hospitals
                    </h3>

                    <p>
                        Please try again.
                    </p>

                    <button
                        type="button"
                        onclick="loadHospitals()">
                        🔄 Try Again
                    </button>

                </div>

            `;

        }

    }

}


/* ============================================================
   SHOW HOSPITALS
   ============================================================ */

async function showHospitals(service) {

    const list =
        getElement("hospital-list");

    const message =
        getElement("result-message");


    if (!list) return;


    showLoading(
        list,
        "Finding hospitals..."
    );


    const filtered =
        hospitals.filter(hospital => {

            return (
                Array.isArray(
                    hospital.services
                ) &&
                hospital.services.includes(
                    service
                )
            );

        });


    list.innerHTML = "";


    if (message) {

        message.innerText =
            `Government healthcare services for: ${service}`;

    }


    if (filtered.length === 0) {

        list.innerHTML = `

            <div class="hospital-card">

                <h3>
                    No matching hospital found
                </h3>

                <p>
                    No government healthcare facility
                    currently lists this service.
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach(hospital => {

        const doctorCount =
            Array.isArray(hospital.doctors)
                ? hospital.doctors.length
                : 0;


        const card =
            document.createElement("div");


        card.className =
            "hospital-card";


        card.innerHTML = `

            <h3>
                🏥 ${escapeHTML(hospital.name)}
            </h3>

            <p>
                📍 ${escapeHTML(hospital.district)}
            </p>

            <p>
                🏛️ ${escapeHTML(
                    hospital.type ||
                    "Government Healthcare Facility"
                )}
            </p>

            <p>
                🩺 ${doctorCount} doctor(s) listed
            </p>

            <button
                type="button"
                class="view-doctors-btn">
                👨‍⚕️ View Doctors
            </button>

        `;


        card.querySelector(
            ".view-doctors-btn"
        ).onclick = () => {

            showDoctors(hospital.id);

        };


        list.appendChild(card);

    });


    getElement(
        "results"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* ============================================================
   SHOW DOCTORS
   ============================================================ */

function showDoctors(hospitalId) {

    const list =
        getElement("hospital-list");

    const message =
        getElement("result-message");


    const hospital =
        hospitals.find(
            h =>
                Number(h.id) ===
                Number(hospitalId)
        );


    if (!hospital) {

        alert(
            "Hospital information not found."
        );

        return;
    }


    list.innerHTML = "";


    if (message) {

        message.innerText =
            `Doctors at ${hospital.name}`;

    }


    const back =
        document.createElement("button");


    back.className =
        "back-button";

    back.type =
        "button";

    back.innerText =
        "← Back to Hospitals";


    back.onclick = () => {

        const service =
            getElement(
                "service-select"
            ).value;

        if (service) {
            showHospitals(service);
        }

    };


    list.appendChild(back);


    const doctors =
        Array.isArray(hospital.doctors)
            ? hospital.doctors
            : [];


    if (!doctors.length) {

        list.innerHTML += `

            <div class="hospital-card">

                <h3>
                    No doctors available
                </h3>

                <p>
                    Doctor information is currently unavailable.
                </p>

            </div>

        `;

        return;
    }


    doctors.forEach(doctor => {

        const card =
            document.createElement("div");


        card.className =
            "hospital-card";


        const available =
            Boolean(doctor.available);


        card.innerHTML = `

            <h3>
                👨‍⚕️ ${escapeHTML(
                    doctor.name || "Doctor"
                )}
            </h3>

            <p>
                🏥 ${escapeHTML(hospital.name)}
            </p>

            <p>
                🩺 ${escapeHTML(
                    doctor.department ||
                    "General Medicine"
                )}
            </p>

            <p>
                🕐 OPD:
                ${escapeHTML(
                    doctor.timing ||
                    "Timing not available"
                )}
            </p>

            <p>
                ${
                    available
                    ? "🟢 Available"
                    : "🔴 Currently Unavailable"
                }
            </p>

        `;


        const button =
            document.createElement("button");


        button.type =
            "button";


        if (available) {

            button.innerText =
                "📅 Book Appointment";


            button.onclick = () => {

                if (
                    requireLoginForAppointment()
                ) {

                    showAppointmentForm(
                        doctor.name,
                        hospital.name,
                        doctor.timing
                    );

                }

            };

        } else {

            button.innerText =
                "Appointment Unavailable";

            button.disabled =
                true;

        }


        card.appendChild(button);

        list.appendChild(card);

    });

}


/* ============================================================
   APPOINTMENT FORM
   ============================================================ */

function showAppointmentForm(
    doctorName,
    hospitalName,
    timing
) {

    if (
        !requireLoginForAppointment()
    ) return;


    const list =
        getElement("hospital-list");


    list.innerHTML = `

        <div class="hospital-card">

            <h3>
                📅 Book Appointment
            </h3>

            <p>
                👨‍⚕️ <strong>
                    ${escapeHTML(doctorName)}
                </strong>
            </p>

            <p>
                🏥 ${escapeHTML(hospitalName)}
            </p>

            <p>
                🕐 ${escapeHTML(
                    timing || "Timing not available"
                )}
            </p>


            <input
                type="text"
                id="patient-name"
                placeholder="Enter patient's name"
                maxlength="60">

            <input
                type="tel"
                id="patient-mobile"
                placeholder="Enter mobile number"
                maxlength="10"
                inputmode="numeric">

            <input
                type="number"
                id="patient-age"
                placeholder="Enter age"
                min="1"
                max="120">

            <input
                type="date"
                id="appointment-date">


            <button
                type="button"
                id="confirm-appointment-btn">
                ✅ Confirm Appointment
            </button>


            <button
                type="button"
                class="back-button"
                id="back-doctor-btn">
                ← Back to Doctors
            </button>

        </div>

    `;


    getElement(
        "appointment-date"
    ).min =
        getLocalDateString();


    getElement(
        "confirm-appointment-btn"
    ).onclick = () => {

        submitAppointment(
            doctorName,
            hospitalName,
            timing
        );

    };


    getElement(
        "back-doctor-btn"
    ).onclick = () => {

        const hospital =
            hospitals.find(
                h =>
                    h.name ===
                    hospitalName
            );

        if (hospital) {

            showDoctors(
                hospital.id
            );

        }

    };

}


/* ============================================================
   SUBMIT APPOINTMENT
   ============================================================ */

async function submitAppointment(
    doctorName,
    hospitalName,
    timing
) {

    if (
        !requireLoginForAppointment()
    ) return;


    const patientName =
        getElement("patient-name")
            .value.trim();

    const mobile =
        getElement("patient-mobile")
            .value.trim();

    const age =
        Number(
            getElement("patient-age")
                .value
        );

    const appointmentDate =
        getElement("appointment-date")
            .value;


    if (
        !patientName ||
        !mobile ||
        !age ||
        !appointmentDate
    ) {

        alert(
            "Please fill all appointment details."
        );

        return;
    }


    if (
        !/^[A-Za-z\s.'-]+$/.test(
            patientName
        )
    ) {

        alert(
            "Please enter a valid patient name."
        );

        return;
    }


    if (
        !/^[0-9]{10}$/.test(mobile)
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (
        !Number.isInteger(age) ||
        age < 1 ||
        age > 120
    ) {

        alert(
            "Please enter a valid age between 1 and 120."
        );

        return;
    }


    if (
        appointmentDate <
        getLocalDateString()
    ) {

        alert(
            "Past date appointment is not allowed."
        );

        return;
    }


    const button =
        getElement(
            "confirm-appointment-btn"
        );


    setButtonLoading(
        button,
        "⏳ Booking..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/appointments`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        patientName,

                        mobile,

                        age,

                        appointmentDate,

                        doctorName,

                        hospitalName,

                        timing,

                        userId:
                            currentUser.id

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Appointment booking failed."
            );

        }


        const appointment =
            data.appointment;


        const appointmentId =
            appointment?.id
                ? formatAppointmentId(
                    appointment.id
                )
                : "Not available";


        alert(
            "✅ Appointment booked successfully!\n\n" +
            "Appointment ID: " +
            appointmentId
        );


        await loadAppointments();


        getElement(
            "my-appointments"
        ).scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Backend se connection nahi ho pa raha."
        );

    } finally {

        restoreButton(button);

    }

}


/* ============================================================
   LOAD APPOINTMENTS
   ============================================================ */

async function loadAppointments() {

    const list =
        getElement(
            "appointments-list"
        );


    if (!list) return;


    if (!currentUser) {

        list.innerHTML = `

            <div class="appointment-empty">

                <p>
                    🔐 Please login to view your appointments.
                </p>

            </div>

        `;

        return;
    }


    showLoading(
        list,
        "Loading your appointments..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/appointments?userId=${encodeURIComponent(
                    currentUser.id
                )}`
            );


        if (!response.ok) {

            throw new Error(
                "Appointments load failed."
            );

        }


        const appointments =
            await response.json();


        list.innerHTML = "";


        if (
            !Array.isArray(appointments) ||
            appointments.length === 0
        ) {

            list.innerHTML = `

                <div class="appointment-empty">

                    <p>
                        No appointments booked yet.
                    </p>

                </div>

            `;

            return;
        }


        appointments.forEach(
            appointment => {

                const card =
                    document.createElement("div");


                card.className =
                    "appointment-card";


                const appointmentId =
                    formatAppointmentId(
                        appointment.id
                    );


                card.innerHTML = `

                    <div class="appointment-info">

                        <div class="appointment-top">

                            <h3>
                                Appointment
                                ${escapeHTML(
                                    appointmentId
                                )}
                            </h3>

                            <span class="appointment-status">
                                ${escapeHTML(
                                    appointment.status ||
                                    "Booked"
                                )}
                            </span>

                        </div>


                        <p>
                            👨‍⚕️
                            <strong>
                                ${escapeHTML(
                                    appointment.doctorName
                                )}
                            </strong>
                        </p>


                        <p>
                            🏥
                            ${escapeHTML(
                                appointment.hospitalName
                            )}
                        </p>


                        <p>
                            👤
                            ${escapeHTML(
                                appointment.patientName
                            )}
                            (${escapeHTML(
                                appointment.age
                            )} years)
                        </p>


                        <p>
                            📱
                            ${escapeHTML(
                                appointment.mobile
                            )}
                        </p>


                        <p>
                            📅 Appointment:
                            <strong>
                                ${formatDate(
                                    appointment.appointmentDate
                                )}
                            </strong>
                        </p>


                        <p>
                            🕐
                            ${escapeHTML(
                                appointment.timing ||
                                "Not available"
                            )}
                        </p>


                        <div class="appointment-id-box">

                            <strong>
                                Appointment ID:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    appointmentId
                                )}
                            </span>

                            <button
                                type="button"
                                class="copy-appointment-btn">
                                📋 Copy ID
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="cancel-appointment-btn">
                        ❌ Cancel Appointment
                    </button>

                `;


                card.querySelector(
                    ".copy-appointment-btn"
                ).onclick = () => {

                    copyAppointmentId(
                        appointmentId
                    );

                };


                card.querySelector(
                    ".cancel-appointment-btn"
                ).onclick = event => {

                    cancelAppointment(
                        Number(appointment.id),
                        event.currentTarget
                    );

                };


                list.appendChild(card);

            }
        );


    } catch (error) {

        console.error(error);


        list.innerHTML = `

            <div class="appointment-empty">

                <p>
                    ⚠️ Unable to load appointments.
                </p>

                <button
                    type="button"
                    onclick="loadAppointments()">
                    🔄 Try Again
                </button>

            </div>

        `;

    }

}


/* ============================================================
   CANCEL APPOINTMENT
   ============================================================ */

async function cancelAppointment(
    appointmentId,
    button
) {

    if (
        !requireLoginForAppointment()
    ) return;


    if (
        !confirm(
            "Are you sure you want to cancel this appointment?"
        )
    ) return;


    setButtonLoading(
        button,
        "⏳ Cancelling..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/appointments/${appointmentId}?userId=${encodeURIComponent(
                    currentUser.id
                )}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Cancellation failed."
            );

        }


        alert(
            "✅ Appointment cancelled successfully."
        );


        loadAppointments();


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Backend se connection nahi ho pa raha."
        );

    } finally {

        restoreButton(button);

    }

}


/* ============================================================
   APPOINTMENT HELPERS
   ============================================================ */

function formatAppointmentId(id) {

    const number = Number(id);


    if (
        !Number.isInteger(number) ||
        number < 1
    ) {

        return "JS-0000";

    }


    return (
        "JS-" +
        String(number).padStart(4, "0")
    );

}


function formatDate(dateString) {

    if (!dateString) {
        return "Not available";
    }


    const parts =
        String(dateString).split("-");


    if (parts.length !== 3) {
        return dateString;
    }


    return (
        `${parts[2]}/${parts[1]}/${parts[0]}`
    );

}


async function copyAppointmentId(id) {

    try {

        await navigator.clipboard.writeText(id);

        alert(
            "✅ Appointment ID copied!\n\n" +
            id
        );

    } catch {

        alert(
            "Appointment ID:\n" +
            id
        );

    }

}


/* ============================================================
   SEARCH
   ============================================================ */

function initializeSearchButton() {

    const button =
        document.querySelector(
            ".search-btn"
        );


    const select =
        getElement(
            "service-select"
        );


    if (!button || !select) return;


    button.addEventListener(
        "click",
        async () => {

            const service =
                select.value;


            if (!service) {

                alert(
                    "Please select a healthcare service first."
                );

                return;
            }


            setButtonLoading(
                button,
                "🔄 Searching..."
            );


            try {

                if (!hospitals.length) {
                    await loadHospitals();
                }


                showHospitals(service);

            } finally {

                restoreButton(button);

            }

        }
    );

}


/* ============================================================
   EMERGENCY
   ============================================================ */

function showEmergency() {

    const panel =
        getElement(
            "emergency-panel"
        );


    if (panel) {
        panel.style.display = "flex";
    }

}


function closeEmergency() {

    const panel =
        getElement(
            "emergency-panel"
        );


    if (panel) {
        panel.style.display = "none";
    }

}


function requestAmbulance() {

    const confirmRequest =
        confirm(
            "🚑 Request ambulance assistance?"
        );


    if (!confirmRequest) return;


    alert(
        "🚑 Ambulance Request Started\n\n" +
        "This is currently a prototype action.\n\n" +
        "For a real emergency, call 112."
    );

}


function findEmergencyHospital() {

    if (!hospitals.length) {

        alert(
            "Hospital data is still loading."
        );

        return;
    }


    const emergencyHospitals =
        hospitals.filter(
            hospital =>
                Array.isArray(
                    hospital.services
                ) &&
                hospital.services.includes(
                    "Emergency Service"
                )
        );


    if (!emergencyHospitals.length) {

        alert(
            "No emergency hospital information available."
        );

        return;
    }


    const names =
        emergencyHospitals
            .map(
                hospital =>
                    `🏥 ${hospital.name} - ${hospital.district}`
            )
            .join("\n");


    alert(
        "🏥 Emergency Hospitals\n\n" +
        names +
        "\n\nFor immediate emergency assistance, call 112."
    );

}


function callEmergency() {

    window.location.href =
        "tel:112";

}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeJeevanSetu() {

    console.log(
        "JeevanSetu initialized successfully."
    );


    /* Restore login */

    currentUser =
        getLocalStorageJSON(
            "jeevansetu_current_user"
        );


    updateLoginState();


    /* Load hospitals */

    loadHospitals();


    /* Load appointments */

    loadAppointments();


    /* Search */

    initializeSearchButton();


    /* Profile */

    initializeProfilePhoto();


    /* Buttons */

    const editButton =
        getElement(
            "editProfileBtn"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            enableProfileEditing
        );

    }


    const saveButton =
        getElement(
            "saveProfileBtn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveProfile
        );

    }


    const passwordButton =
        getElement(
            "changePasswordBtn"
        );


    if (passwordButton) {

        passwordButton.addEventListener(
            "click",
            changePassword
        );

    }

}


/* ============================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ============================================================ */

window.addEventListener(
    "click",
    event => {

        const authModal =
            getElement("auth-modal");

        const emergencyModal =
            getElement("emergency-panel");


        if (
            event.target ===
            authModal
        ) {

            closeAuthModal();

        }


        if (
            event.target ===
            emergencyModal
        ) {

            closeEmergency();

        }

    }
);


/* ============================================================
   PAGE START
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeJeevanSetu
    );

} else {

    initializeJeevanSetu();

}
