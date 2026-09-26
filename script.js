// ============================================================
// JEEVANSETU - COMPLETE JAVASCRIPT
// CLEAN REPLACEMENT VERSION
// ============================================================


// ============================================================
// API
// ============================================================

const API_BASE_URL =
    "https://jeevansetu-new.onrender.com";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let hospitals = [];

let currentUser = null;

let registeredUser = null;

let userIdOTP = null;

let passwordOTP = null;

let passwordRecoveryUser = null;


// ============================================================
// SAFE LOCAL STORAGE
// ============================================================

function getLocalStorageJSON(key) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value);

    }

    catch (error) {

        console.error(
            "LocalStorage read error:",
            error
        );

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

    }

    catch (error) {

        console.error(
            "LocalStorage save error:",
            error
        );

        return false;
    }
}


// ============================================================
// INITIAL AUTH DATA
// ============================================================

function initializeStoredUser() {

    registeredUser =
        getLocalStorageJSON(
            "jeevansetu_user"
        );

    currentUser =
        getLocalStorageJSON(
            "jeevansetu_current_user"
        );

}


// ============================================================
// ELEMENT HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// LOADING STATE
// ============================================================

function showLoading(
    container,
    message = "Loading..."
) {

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


// ============================================================
// BUTTON LOADING
// ============================================================

function setButtonLoading(
    button,
    loadingText = "Please wait..."
) {

    if (!button) {
        return;
    }

    if (!button.dataset.originalText) {

        button.dataset.originalText =
            button.innerText;

    }

    button.disabled = true;

    button.innerText =
        loadingText;

}


function restoreButton(button) {

    if (!button) {
        return;
    }

    button.disabled = false;

    if (button.dataset.originalText) {

        button.innerText =
            button.dataset.originalText;

    }

}


// ============================================================
// AUTH MODAL
// ============================================================

function openAuthModal() {

    const modal =
        getElement("auth-modal");

    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeAuthModal() {

    const modal =
        getElement("auth-modal");

    if (modal) {

        modal.style.display =
            "none";

    }

}


// ============================================================
// HIDE ALL AUTH FORMS
// ============================================================

function hideAllAuthForms() {

    const forms = [

        "login-form",

        "register-form",

        "forgot-user-id-form",

        "forgot-password-form",

        "new-password-form",

        "user-profile"

    ];

    forms.forEach(
        function(id) {

            const element =
                getElement(id);

            if (element) {

                element.style.display =
                    "none";

            }

        }
    );

}


// ============================================================
// LOGIN FORM
// ============================================================

function showLoginForm() {

    openAuthModal();

    hideAllAuthForms();

    const form =
        getElement("login-form");

    if (form) {

        form.style.display =
            "block";

    }

}


// ============================================================
// REGISTER FORM
// ============================================================

function showRegisterForm() {

    openAuthModal();

    hideAllAuthForms();

    const form =
        getElement("register-form");

    if (form) {

        form.style.display =
            "block";

    }

}


// ============================================================
// GENERATE USER ID
// ============================================================

function generateUserId() {

    let userId;

    do {

        const randomNumber =
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        userId =
            "JSU-" +
            randomNumber;

    }

    while (
        registeredUser &&
        registeredUser.id === userId
    );

    return userId;

}


// ============================================================
// REGISTER USER
// ============================================================

function registerUser() {

    const nameElement =
        getElement("register-name");

    const mobileElement =
        getElement("register-mobile");

    const emailElement =
        getElement("register-email");

    const passwordElement =
        getElement("register-password");


    if (
        !nameElement ||
        !mobileElement ||
        !emailElement ||
        !passwordElement
    ) {

        alert(
            "Registration form is not available."
        );

        return;
    }


    const name =
        nameElement.value.trim();

    const mobile =
        mobileElement.value.trim();

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value.trim();


    if (
        !name ||
        !mobile ||
        !email ||
        !password
    ) {

        alert(
            "Please fill all registration details."
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


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    if (registeredUser) {

        alert(
            "An account is already registered on this browser."
        );

        showLoginForm();

        return;
    }


    const userId =
        generateUserId();


    const user = {

        id: userId,

        name: name,

        mobile: mobile,

        email: email,

        password: password

    };


    setLocalStorageJSON(
        "jeevansetu_user",
        user
    );

    setLocalStorageJSON(
        "jeevansetu_current_user",
        user
    );


    registeredUser =
        user;

    currentUser =
        user;


    alert(
        "✅ Registration Successful!\n\n" +
        "Your User ID:\n" +
        userId +
        "\n\nPlease save your User ID."
    );


    closeAuthModal();

    updateLoginState();

    loadAppointments();

}


// ============================================================
// LOGIN USER
// ============================================================

function loginUser() {

    const userIdElement =
        getElement("login-user-id");

    const passwordElement =
        getElement("login-password");


    if (
        !userIdElement ||
        !passwordElement
    ) {

        alert(
            "Login form is not available."
        );

        return;
    }


    const userId =
        userIdElement.value
            .trim()
            .toUpperCase();

    const password =
        passwordElement.value
            .trim();


    if (
        !userId ||
        !password
    ) {

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
            "No registered account found.\n\nPlease register first."
        );

        showRegisterForm();

        return;
    }


    if (
        !user.id ||
        user.id.toUpperCase() !== userId ||
        user.password !== password
    ) {

        alert(
            "❌ Invalid User ID or password."
        );

        return;
    }


    currentUser =
        user;

    registeredUser =
        user;


    setLocalStorageJSON(
        "jeevansetu_current_user",
        user
    );


    alert(
        "✅ Login Successful!"
    );


    closeAuthModal();

    updateLoginState();

    loadAppointments();

}


// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {

    currentUser =
        null;


    localStorage.removeItem(
        "jeevansetu_current_user"
    );


    const appointmentsList =
        getElement(
            "appointments-list"
        );


    if (appointmentsList) {

        appointmentsList.innerHTML = `

            <div class="appointment-empty">

                <p>
                    🔐 Please login to view your appointments.
                </p>

            </div>

        `;

    }


    alert(
        "✅ You have been logged out."
    );


    updateLoginState();

}


// ============================================================
// LOGIN STATE
// ============================================================

function updateLoginState() {

    const authArea =
        getElement("auth-area");


    if (!authArea) {
        return;
    }


    if (currentUser) {

        authArea.innerHTML = `

            <button
                type="button"
                class="auth-profile-btn"
                onclick="showUserProfile()">

                👤 ${escapeHTML(
                    currentUser.name
                )}

            </button>

            <button
                type="button"
                class="auth-logout-btn"
                onclick="logoutUser()">

                Logout

            </button>

        `;

    }

    else {

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


// ============================================================
// FORGOT USER ID
// ============================================================

function showForgotUserId() {

    openAuthModal();

    hideAllAuthForms();


    const form =
        getElement(
            "forgot-user-id-form"
        );


    if (form) {

        form.style.display =
            "block";

    }


    const otpSection =
        getElement(
            "forgot-id-otp-section"
        );


    if (otpSection) {

        otpSection.style.display =
            "none";

    }


    const result =
        getElement(
            "forgot-id-result"
        );


    if (result) {

        result.innerHTML =
            "";

    }

}


// ============================================================
// GENERATE OTP
// ============================================================

function generateOTP() {

    return String(
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );

}


// ============================================================
// SEND USER ID OTP
// ============================================================

function sendUserIdOTP() {

    const mobileElement =
        getElement(
            "forgot-id-mobile"
        );


    if (!mobileElement) {
        return;
    }


    const mobile =
        mobileElement.value.trim();


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!mobile) {

        alert(
            "Please enter your mobile number."
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


    userIdOTP =
        generateOTP();


    const otpSection =
        getElement(
            "forgot-id-otp-section"
        );


    if (otpSection) {

        otpSection.style.display =
            "block";

    }


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        userIdOTP
    );

}


// ============================================================
// VERIFY USER ID OTP
// ============================================================

function verifyUserIdOTP() {

    const otpElement =
        getElement(
            "forgot-id-otp"
        );


    if (!otpElement) {
        return;
    }


    const enteredOTP =
        otpElement.value.trim();


    if (!enteredOTP) {

        alert(
            "Please enter OTP."
        );

        return;
    }


    if (enteredOTP !== userIdOTP) {

        alert(
            "❌ Invalid OTP."
        );

        return;
    }


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (!user) {

        alert(
            "User account not found."
        );

        return;
    }


    const result =
        getElement(
            "forgot-id-result"
        );


    if (result) {

        result.innerHTML =
            "✅ OTP verified.<br><br>" +
            "<strong>Your User ID: " +
            escapeHTML(user.id) +
            "</strong>";

    }


    userIdOTP =
        null;

}


// ============================================================
// FORGOT PASSWORD
// ============================================================

function showForgotPassword() {

    openAuthModal();

    hideAllAuthForms();


    const form =
        getElement(
            "forgot-password-form"
        );


    if (form) {

        form.style.display =
            "block";

    }


    const otpSection =
        getElement(
            "forgot-password-otp-section"
        );


    if (otpSection) {

        otpSection.style.display =
            "none";

    }


    const message =
        getElement(
            "forgot-password-message"
        );


    if (message) {

        message.innerText =
            "";

    }


    passwordRecoveryUser =
        null;

}


// ============================================================
// SEND PASSWORD OTP
// ============================================================

function sendPasswordOTP() {

    const userIdElement =
        getElement(
            "forgot-password-user-id"
        );

    const mobileElement =
        getElement(
            "forgot-password-mobile"
        );


    if (
        !userIdElement ||
        !mobileElement
    ) {
        return;
    }


    const userId =
        userIdElement.value
            .trim()
            .toUpperCase();

    const mobile =
        mobileElement.value.trim();


    const user =
        getLocalStorageJSON(
            "jeevansetu_user"
        );


    if (
        !userId ||
        !mobile
    ) {

        alert(
            "Please enter User ID and mobile number."
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


    if (!user) {

        alert(
            "No JeevanSetu account found."
        );

        return;
    }


    if (
        !user.id ||
        user.id.toUpperCase() !== userId ||
        user.mobile !== mobile
    ) {

        alert(
            "User ID and mobile number do not match."
        );

        return;
    }


    passwordRecoveryUser =
        user;


    passwordOTP =
        generateOTP();


    const otpSection =
        getElement(
            "forgot-password-otp-section"
        );


    if (otpSection) {

        otpSection.style.display =
            "block";

    }


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        passwordOTP
    );

}


// ============================================================
// VERIFY PASSWORD OTP
// ============================================================

function verifyPasswordOTP() {

    const otpElement =
        getElement(
            "forgot-password-otp"
        );


    if (!otpElement) {
        return;
    }


    const enteredOTP =
        otpElement.value.trim();


    if (!enteredOTP) {

        alert(
            "Please enter OTP."
        );

        return;
    }


    if (enteredOTP !== passwordOTP) {

        alert(
            "❌ Invalid OTP."
        );

        return;
    }


    if (!passwordRecoveryUser) {

        alert(
            "Recovery session expired. Please try again."
        );

        showForgotPassword();

        return;
    }


    passwordOTP =
        null;


    hideAllAuthForms();


    const newPasswordForm =
        getElement(
            "new-password-form"
        );


    if (newPasswordForm) {

        newPasswordForm.style.display =
            "block";

    }


    const newPassword =
        getElement("new-password");

    const confirmPassword =
        getElement(
            "confirm-new-password"
        );


    if (newPassword) {
        newPassword.value = "";
    }

    if (confirmPassword) {
        confirmPassword.value = "";
    }

}


// ============================================================
// RESET PASSWORD
// ============================================================

function resetPassword() {

    if (!passwordRecoveryUser) {

        alert(
            "Password recovery session expired."
        );

        showForgotPassword();

        return;
    }


    const newPasswordElement =
        getElement(
            "new-password"
        );

    const confirmPasswordElement =
        getElement(
            "confirm-new-password"
        );


    if (
        !newPasswordElement ||
        !confirmPasswordElement
    ) {
        return;
    }


    const newPassword =
        newPasswordElement.value;

    const confirmPassword =
        confirmPasswordElement.value;


    if (
        !newPassword ||
        !confirmPassword
    ) {

        alert(
            "Please enter and confirm your new password."
        );

        return;
    }


    if (newPassword.length < 6) {

        alert(
            "New password must contain at least 6 characters."
        );

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

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

        alert(
            "User account not found."
        );

        return;
    }


    user.password =
        newPassword;


    setLocalStorageJSON(
        "jeevansetu_user",
        user
    );


    registeredUser =
        user;

    passwordRecoveryUser =
        null;


    alert(
        "✅ Password reset successfully!\n\n" +
        "You can now login using your new password."
    );


    showLoginForm();


    const loginUserId =
        getElement(
            "login-user-id"
        );

    const loginPassword =
        getElement(
            "login-password"
        );


    if (loginUserId) {
        loginUserId.value =
            user.id;
    }

    if (loginPassword) {
        loginPassword.value =
            "";
    }

}


// ============================================================
// SHOW PROFILE
// ============================================================

function showUserProfile() {

    if (!currentUser) {

        showLoginForm();

        return;
    }


    openAuthModal();

    hideAllAuthForms();


    const profile =
        getElement(
            "user-profile"
        );


    if (profile) {

        profile.style.display =
            "block";

    }


    const profileName =
        getElement(
            "profile-name"
        );

    const profileUserId =
        getElement(
            "profile-user-id"
        );


    if (profileName) {

        profileName.innerText =
            currentUser.name || "";

    }


    if (profileUserId) {

        profileUserId.innerText =
            currentUser.id || "";

    }

}


// ============================================================
// COPY USER ID
// ============================================================

async function copyUserId() {

    if (!currentUser) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            currentUser.id
        );


        alert(
            "✅ User ID copied!\n\n" +
            currentUser.id
        );

    }

    catch (error) {

        alert(
            "Your User ID:\n" +
            currentUser.id
        );

    }

}


// ============================================================
// LOGIN CHECK
// ============================================================

function isUserLoggedIn() {

    return (
        currentUser !== null &&
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


// ============================================================
// LOAD HOSPITALS
// ============================================================

async function loadHospitals() {

    const hospitalList =
        getElement(
            "hospital-list"
        );

    const resultMessage =
        getElement(
            "result-message"
        );


    if (hospitalList) {

        showLoading(
            hospitalList,
            "Loading government hospitals..."
        );

    }


    if (resultMessage) {

        resultMessage.innerText =
            "Loading healthcare facilities...";

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/hospitals`
            );


        if (!response.ok) {

            throw new Error(
                "Hospital data load failed."
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid hospital data."
            );

        }


        hospitals =
            data;


        if (resultMessage) {

            resultMessage.innerText =
                "Select a healthcare service to search.";

        }


        if (
            hospitalList &&
            hospitals.length === 0
        ) {

            hospitalList.innerHTML = `

                <div class="hospital-card">

                    <h3>
                        No hospitals available
                    </h3>

                    <p>
                        Hospital information is currently unavailable.
                    </p>

                </div>

            `;

        }

    }

    catch (error) {

        console.error(
            "Hospital loading error:",
            error
        );


        if (hospitalList) {

            hospitalList.innerHTML = `

                <div class="hospital-card">

                    <h3>
                        ⚠️ Unable to load hospitals
                    </h3>

                    <p>
                        Please make sure the backend
                        server is running.
                    </p>

                    <button
                        type="button"
                        onclick="loadHospitals()">

                        🔄 Try Again

                    </button>

                </div>

            `;

        }


        if (resultMessage) {

            resultMessage.innerText =
                "Unable to load hospital data.";

        }

    }

}


// ============================================================
// SHOW HOSPITALS
// ============================================================

async function showHospitals(service) {

    const hospitalList =
        getElement(
            "hospital-list"
        );

    const resultMessage =
        getElement(
            "result-message"
        );


    if (!hospitalList) {
        return;
    }


    showLoading(
        hospitalList,
        "Finding hospitals..."
    );


    if (resultMessage) {

        resultMessage.innerText =
            "Searching government healthcare services...";

    }


    await new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                300
            );

        }
    );


    hospitalList.innerHTML =
        "";


    const filteredHospitals =
        hospitals.filter(
            function(hospital) {

                return (
                    Array.isArray(
                        hospital.services
                    ) &&
                    hospital.services.includes(
                        service
                    )
                );

            }
        );


    if (resultMessage) {

        resultMessage.innerText =
            "Government healthcare services for: " +
            service;

    }


    if (
        filteredHospitals.length === 0
    ) {

        hospitalList.innerHTML = `

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


    filteredHospitals.forEach(
        function(hospital) {

            const doctorCount =
                Array.isArray(
                    hospital.doctors
                )
                    ? hospital.doctors.length
                    : 0;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "hospital-card";


            card.innerHTML = `

                <h3>
                    🏥 ${escapeHTML(
                        hospital.name
                    )}
                </h3>

                <p>
                    📍 ${escapeHTML(
                        hospital.district
                    )}
                </p>

                <p>
                    🏛️ ${escapeHTML(
                        hospital.type ||
                        "Government Healthcare Facility"
                    )}
                </p>

                <p>
                    🩺 ${doctorCount}
                    doctor(s) listed
                </p>

                <button
                    type="button"
                    class="view-doctors-btn">

                    👨‍⚕️ View Doctors

                </button>

            `;


            const viewDoctorsButton =
                card.querySelector(
                    ".view-doctors-btn"
                );


            if (viewDoctorsButton) {

                viewDoctorsButton.onclick =
                    function() {

                        showDoctors(
                            Number(
                                hospital.id
                            )
                        );

                    };

            }


            hospitalList.appendChild(
                card
            );

        }
    );


    const results =
        getElement(
            "results"
        );


    if (results) {

        results.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ============================================================
// SHOW DOCTORS
// ============================================================

async function showDoctors(
    hospitalId
) {

    const hospitalList =
        getElement(
            "hospital-list"
        );

    const resultMessage =
        getElement(
            "result-message"
        );


    if (!hospitalList) {
        return;
    }


    showLoading(
        hospitalList,
        "Loading doctors..."
    );


    await new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                350
            );

        }
    );


    const hospital =
        hospitals.find(
            function(item) {

                return (
                    Number(item.id) ===
                    Number(hospitalId)
                );

            }
        );


    if (!hospital) {

        hospitalList.innerHTML =
            "";

        alert(
            "Hospital information not found."
        );

        return;
    }


    hospitalList.innerHTML =
        "";


    if (resultMessage) {

        resultMessage.innerText =
            "Doctors at " +
            hospital.name;

    }


    const backButton =
        document.createElement(
            "button"
        );


    backButton.type =
        "button";

    backButton.className =
        "back-button";

    backButton.innerText =
        "← Back to Hospitals";


    backButton.onclick =
        function() {

            const serviceSelect =
                getElement(
                    "service-select"
                );

            const selectedService =
                serviceSelect
                    ? serviceSelect.value
                    : "";


            if (selectedService) {

                showHospitals(
                    selectedService
                );

            }

        };


    hospitalList.appendChild(
        backButton
    );


    const doctors =
        Array.isArray(
            hospital.doctors
        )
            ? hospital.doctors
            : [];


    if (doctors.length === 0) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "hospital-card";


        empty.innerHTML = `

            <h3>
                No doctors available
            </h3>

            <p>
                Doctor information is currently unavailable.
            </p>

        `;


        hospitalList.appendChild(
            empty
        );

        return;
    }


    doctors.forEach(
        function(doctor) {

            const doctorCard =
                document.createElement(
                    "div"
                );


            doctorCard.className =
                "hospital-card";


            const availabilityText =
                doctor.available
                    ? "🟢 Available"
                    : "🔴 Currently Unavailable";


            doctorCard.innerHTML = `

                <h3>
                    👨‍⚕️ ${escapeHTML(
                        doctor.name ||
                        "Doctor"
                    )}
                </h3>

                <p>
                    🏥 ${escapeHTML(
                        hospital.name
                    )}
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
                    ${availabilityText}
                </p>

            `;


            if (doctor.available) {

                const bookButton =
                    document.createElement(
                        "button"
                    );


                bookButton.type =
                    "button";


                bookButton.innerText =
                    "📅 Book Appointment";


                bookButton.onclick =
                    function() {

                        if (
                            !requireLoginForAppointment()
                        ) {

                            return;
                        }


                        showAppointmentForm(
                            doctor.name,
                            hospital.name,
                            doctor.timing
                        );

                    };


                doctorCard.appendChild(
                    bookButton
                );

            }

            else {

                const disabledButton =
                    document.createElement(
                        "button"
                    );


                disabledButton.type =
                    "button";

                disabledButton.disabled =
                    true;

                disabledButton.innerText =
                    "Appointment Unavailable";


                doctorCard.appendChild(
                    disabledButton
                );

            }


            hospitalList.appendChild(
                doctorCard
            );

        }
    );

}


// ============================================================
// APPOINTMENT FORM
// ============================================================

function showAppointmentForm(
    doctorName,
    hospitalName,
    timing
) {

    if (
        !requireLoginForAppointment()
    ) {

        return;
    }


    const hospitalList =
        getElement(
            "hospital-list"
        );


    if (!hospitalList) {
        return;
    }


    hospitalList.innerHTML =
        "";


    const formCard =
        document.createElement(
            "div"
        );


    formCard.className =
        "hospital-card";


    formCard.innerHTML = `

        <h3>
            📅 Book Appointment
        </h3>

        <p>
            👨‍⚕️
            <strong>
                ${escapeHTML(doctorName)}
            </strong>
        </p>

        <p>
            🏥 ${escapeHTML(
                hospitalName
            )}
        </p>

        <p>
            🕐 ${escapeHTML(
                timing ||
                "Timing not available"
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

    `;


    hospitalList.appendChild(
        formCard
    );


    const confirmButton =
        getElement(
            "confirm-appointment-btn"
        );


    if (confirmButton) {

        confirmButton.onclick =
            function() {

                submitAppointment(
                    doctorName,
                    hospitalName,
                    timing
                );

            };

    }


    const backButton =
        getElement(
            "back-doctor-btn"
        );


    if (backButton) {

        backButton.onclick =
            function() {

                goBackToDoctors(
                    hospitalName
                );

            };

    }


    const dateInput =
        getElement(
            "appointment-date"
        );


    if (dateInput) {

        dateInput.min =
            getLocalDateString();

    }


    const results =
        getElement(
            "results"
        );


    if (results) {

        results.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ============================================================
// BACK TO DOCTORS
// ============================================================

function goBackToDoctors(
    hospitalName
) {

    const hospital =
        hospitals.find(
            function(item) {

                return (
                    item.name ===
                    hospitalName
                );

            }
        );


    if (hospital) {

        showDoctors(
            hospital.id
        );

    }

}


// ============================================================
// SUBMIT APPOINTMENT
// ============================================================

async function submitAppointment(
    doctorName,
    hospitalName,
    timing
) {

    if (
        !requireLoginForAppointment()
    ) {

        return;
    }


    const patientNameElement =
        getElement(
            "patient-name"
        );

    const mobileElement =
        getElement(
            "patient-mobile"
        );

    const ageElement =
        getElement(
            "patient-age"
        );

    const dateElement =
        getElement(
            "appointment-date"
        );

    const confirmButton =
        getElement(
            "confirm-appointment-btn"
        );


    if (
        !patientNameElement ||
        !mobileElement ||
        !ageElement ||
        !dateElement
    ) {

        alert(
            "Appointment form is not available."
        );

        return;
    }


    const patientName =
        patientNameElement.value.trim();

    const mobile =
        mobileElement.value.trim();

    const age =
        ageElement.value.trim();

    const appointmentDate =
        dateElement.value;


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
        patientName.length < 2 ||
        patientName.length > 60
    ) {

        alert(
            "Please enter a valid patient name."
        );

        return;
    }


    if (
        !/^[A-Za-z\s.'-]+$/.test(
            patientName
        )
    ) {

        alert(
            "Patient name can contain letters and spaces only."
        );

        return;
    }


    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    const numericAge =
        Number(age);


    if (
        !Number.isInteger(
            numericAge
        ) ||
        numericAge < 1 ||
        numericAge > 120
    ) {

        alert(
            "Please enter a valid age between 1 and 120."
        );

        return;
    }


    const today =
        getLocalDateString();


    if (
        appointmentDate < today
    ) {

        alert(
            "❌ Past date appointment is not allowed."
        );

        return;
    }


    setButtonLoading(
        confirmButton,
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

                    body:
                        JSON.stringify({

                            patientName:
                                patientName,

                            mobile:
                                mobile,

                            age:
                                numericAge,

                            appointmentDate:
                                appointmentDate,

                            doctorName:
                                doctorName,

                            hospitalName:
                                hospitalName,

                            timing:
                                timing,

                            userId:
                                String(
                                    currentUser.id
                                )

                        })

                }
            );


        let data = {};

        try {

            data =
                await response.json();

        }

        catch (jsonError) {

            data = {};

        }


        if (!response.ok) {

            alert(
                data.message ||
                "Appointment booking failed."
            );

            return;
        }


        const appointment =
            data.appointment;


        const appointmentId =
            appointment &&
            appointment.id
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


        const appointmentsSection =
            getElement(
                "my-appointments"
            );


        if (appointmentsSection) {

            appointmentsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    }

    catch (error) {

        console.error(
            "Appointment booking error:",
            error
        );


        alert(
            "Backend se connection nahi ho pa raha."
        );

    }

    finally {

        restoreButton(
            confirmButton
        );

    }

}


// ============================================================
// LOAD APPOINTMENTS
// ============================================================

async function loadAppointments() {

    const appointmentsList =
        getElement(
            "appointments-list"
        );


    if (!appointmentsList) {
        return;
    }


    if (!currentUser) {

        appointmentsList.innerHTML = `

            <div class="appointment-empty">

                <p>
                    🔐 Please login to view your appointments.
                </p>

            </div>

        `;

        return;
    }


    showLoading(
        appointmentsList,
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


        appointmentsList.innerHTML =
            "";


        if (
            !Array.isArray(
                appointments
            ) ||
            appointments.length === 0
        ) {

            appointmentsList.innerHTML = `

                <div class="appointment-empty">

                    <p>
                        No appointments booked yet.
                    </p>

                </div>

            `;

            return;
        }


        appointments.forEach(
            function(appointment) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "appointment-card";


                const status =
                    appointment.status ||
                    "Booked";


                const createdDate =
                    appointment.createdAt
                        ? formatBookingDate(
                            appointment.createdAt
                        )
                        : "Not available";


                const displayAppointmentId =
                    formatAppointmentId(
                        appointment.id
                    );


                card.innerHTML = `

                    <div class="appointment-info">

                        <div class="appointment-top">

                            <h3>
                                Appointment
                                ${escapeHTML(
                                    displayAppointmentId
                                )}
                            </h3>

                            <span
                                class="appointment-status">

                                ${escapeHTML(
                                    status
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
                                appointment.timing
                            )}
                        </p>

                        <p class="booking-time">

                            📝 Booked on:
                            ${escapeHTML(
                                createdDate
                            )}

                        </p>

                        <div
                            class="appointment-id-box">

                            <strong>
                                Appointment ID:
                            </strong>

                            <span>
                                ${escapeHTML(
                                    displayAppointmentId
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


                const copyButton =
                    card.querySelector(
                        ".copy-appointment-btn"
                    );


                if (copyButton) {

                    copyButton.onclick =
                        function() {

                            copyAppointmentId(
                                displayAppointmentId
                            );

                        };

                }


                const cancelButton =
                    card.querySelector(
                        ".cancel-appointment-btn"
                    );


                if (cancelButton) {

                    cancelButton.onclick =
                        function() {

                            cancelAppointment(
                                Number(
                                    appointment.id
                                ),
                                cancelButton
                            );

                        };

                }


                appointmentsList.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Appointment loading failed:",
            error
        );


        appointmentsList.innerHTML = `

            <div class="appointment-empty">

                <p>
                    ⚠️ Unable to load appointments.
                </p>

                <p>
                    Please make sure the backend server is running.
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


// ============================================================
// COPY APPOINTMENT ID
// ============================================================

async function copyAppointmentId(
    appointmentId
) {

    try {

        await navigator.clipboard.writeText(
            appointmentId
        );


        alert(
            "✅ Appointment ID copied!\n\n" +
            appointmentId
        );

    }

    catch (error) {

        alert(
            "Appointment ID:\n" +
            appointmentId
        );

    }

}


// ============================================================
// FORMAT APPOINTMENT ID
// ============================================================

function formatAppointmentId(
    numericId
) {

    const number =
        Number(numericId);


    if (
        !Number.isInteger(number) ||
        number < 1
    ) {

        return "JS-0000";

    }


    return (
        "JS-" +
        String(number).padStart(
            4,
            "0"
        )
    );

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
    dateString
) {

    if (!dateString) {

        return "Not available";

    }


    const parts =
        String(dateString).split("-");


    if (
        parts.length !== 3
    ) {

        return dateString;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


// ============================================================
// LOCAL DATE
// ============================================================

function getLocalDateString() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================================================
// BOOKING DATE
// ============================================================

function formatBookingDate(
    dateString
) {

    try {

        const date =
            new Date(
                dateString
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Not available";

        }


        return date.toLocaleString(
            "en-IN",
            {

                day: "2-digit",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }
        );

    }

    catch (error) {

        return "Not available";

    }

}


// ============================================================
// CANCEL APPOINTMENT
// ============================================================

async function cancelAppointment(
    appointmentId,
    clickedButton = null
) {

    if (
        !requireLoginForAppointment()
    ) {

        return;
    }


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmCancel) {
        return;
    }


    setButtonLoading(
        clickedButton,
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


        let data = {};

        try {

            data =
                await response.json();

        }

        catch (jsonError) {

            data = {};

        }


        if (!response.ok) {

            alert(
                data.message ||
                "Appointment cancellation failed."
            );

            return;
        }


        alert(
            "✅ Appointment cancelled successfully."
        );


        await loadAppointments();

    }

    catch (error) {

        console.error(
            "Cancellation error:",
            error
        );


        alert(
            "Backend se connection nahi ho pa raha."
        );

    }

    finally {

        restoreButton(
            clickedButton
        );

    }

}


// ============================================================
// EMERGENCY
// ============================================================

function showEmergency() {

    const panel =
        getElement(
            "emergency-panel"
        );


    if (panel) {

        panel.style.display =
            "flex";

    }

}


function closeEmergency() {

    const panel =
        getElement(
            "emergency-panel"
        );


    if (panel) {

        panel.style.display =
            "none";

    }

}


// ============================================================
// AMBULANCE
// ============================================================

function requestAmbulance() {

    const confirmed =
        confirm(
            "🚑 Request ambulance assistance?\n\n" +
            "This is a prototype request."
        );


    if (!confirmed) {
        return;
    }


    alert(
        "🚑 Ambulance Request Started\n\n" +
        "Your request has been recorded as a prototype action.\n\n" +
        "For a real emergency, please call 112."
    );

}


// ============================================================
// FIND EMERGENCY HOSPITAL
// ============================================================

function findEmergencyHospital() {

    if (!hospitals.length) {

        alert(
            "Hospital data is still loading. Please try again."
        );

        return;
    }


    const emergencyHospitals =
        hospitals.filter(
            function(hospital) {

                return (
                    Array.isArray(
                        hospital.services
                    ) &&
                    hospital.services.includes(
                        "Emergency Service"
                    )
                );

            }
        );


    if (
        emergencyHospitals.length === 0
    ) {

        alert(
            "No emergency hospital information is currently available."
        );

        return;
    }


    const names =
        emergencyHospitals
            .map(
                function(hospital) {

                    return (
                        "🏥 " +
                        hospital.name +
                        " - " +
                        hospital.district
                    );

                }
            )
            .join("\n");


    alert(
        "🏥 Emergency Hospitals\n\n" +
        names +
        "\n\n" +
        "For immediate emergency assistance, call 112."
    );

}


// ============================================================
// CALL EMERGENCY
// ============================================================

function callEmergency() {

    window.location.href =
        "tel:112";

}


// ============================================================
// PROFILE PHOTO
// ============================================================

function initializeProfilePhoto() {

    const profilePhotoInput =
        getElement(
            "profilePhotoInput"
        );

    const profilePreview =
        getElement(
            "profilePreview"
        );


    if (
        !profilePhotoInput ||
        !profilePreview
    ) {

        return;
    }


    profilePhotoInput.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                this.value =
                    "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    profilePreview.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// EDIT PROFILE
// ============================================================

function initializeEditProfile() {

    const editProfileBtn =
        getElement(
            "editProfileBtn"
        );


    if (!editProfileBtn) {
        return;
    }


    editProfileBtn.addEventListener(
        "click",
        function() {

            const fields =
                document.querySelectorAll(
                    "#profileSection input, " +
                    "#profileSection select, " +
                    "#profileSection textarea"
                );


            fields.forEach(
                function(field) {

                    if (
                        field.id !==
                        "profilePhotoInput"
                    ) {

                        field.disabled =
                            false;

                    }

                }
            );


            alert(
                "You can now edit your profile."
            );

        }
    );

}


// ============================================================
// SAVE PROFILE
// ============================================================

function initializeSaveProfile() {

    const saveProfileBtn =
        getElement(
            "saveProfileBtn"
        );


    if (!saveProfileBtn) {
        return;
    }


    saveProfileBtn.addEventListener(
        "click",
        function() {

            const getValue =
                function(id) {

                    const element =
                        getElement(id);

                    return element
                        ? element.value
                        : "";

                };


            const profileData = {

                firstName:
                    getValue(
                        "profileFirstName"
                    ),

                lastName:
                    getValue(
                        "profileLastName"
                    ),

                mobile:
                    getValue(
                        "profileMobile"
                    ),

                email:
                    getValue(
                        "profileEmail"
                    ),

                dob:
                    getValue(
                        "profileDOB"
                    ),

                gender:
                    getValue(
                        "profileGender"
                    ),

                address:
                    getValue(
                        "profileAddress"
                    ),

                city:
                    getValue(
                        "profileCity"
                    ),

                state:
                    getValue(
                        "profileState"
                    ),

                pin:
                    getValue(
                        "profilePin"
                    ),

                bloodGroup:
                    getValue(
                        "profileBloodGroup"
                    ),

                height:
                    getValue(
                        "profileHeight"
                    ),

                weight:
                    getValue(
                        "profileWeight"
                    ),

                emergencyName:
                    getValue(
                        "emergencyContactName"
                    ),

                emergencyNumber:
                    getValue(
                        "emergencyContactNumber"
                    )

            };


            setLocalStorageJSON(
                "jeevansetuProfile",
                profileData
            );


            alert(
                "Profile changes saved successfully!"
            );

        }
    );

}


// ============================================================
// LOAD PROFILE
// ============================================================

function loadJeevanSetuProfile() {

    const savedProfile =
        localStorage.getItem(
            "jeevansetuProfile"
        );


    if (!savedProfile) {
        return;
    }


    try {

        const data =
            JSON.parse(
                savedProfile
            );


        const fields = {

            profileFirstName:
                data.firstName,

            profileLastName:
                data.lastName,

            profileMobile:
                data.mobile,

            profileEmail:
                data.email,

            profileDOB:
                data.dob,

            profileGender:
                data.gender,

            profileAddress:
                data.address,

            profileCity:
                data.city,

            profileState:
                data.state,

            profilePin:
                data.pin,

            profileBloodGroup:
                data.bloodGroup,

            profileHeight:
                data.height,

            profileWeight:
                data.weight,

            emergencyContactName:
                data.emergencyName,

            emergencyContactNumber:
                data.emergencyNumber

        };


        Object.keys(fields).forEach(
            function(id) {

                const element =
                    getElement(id);


                if (element) {

                    element.value =
                        fields[id] || "";

                }

            }
        );

    }

    catch (error) {

        console.error(
            "Could not load profile:",
            error
        );

    }

}


// ============================================================
// CHANGE PASSWORD BUTTON
// ============================================================

function initializeChangePassword() {

    const changePasswordBtn =
        getElement(
            "changePasswordBtn"
        );


    if (!changePasswordBtn) {
        return;
    }


    changePasswordBtn.addEventListener(
        "click",
        function() {

            alert(
                "Change Password feature will be connected to the account system."
            );

        }
    );

}


// ============================================================
// SEARCH BUTTON
// ============================================================

function initializeSearchButton() {

    const searchButton =
        document.querySelector(
            ".search-btn"
        );

    const serviceSelect =
        getElement(
            "service-select"
        );


    if (!searchButton) {
        return;
    }


    searchButton.addEventListener(
        "click",
        async function() {

            const selectedService =
                serviceSelect
                    ? serviceSelect.value
                    : "";


            if (!selectedService) {

                alert(
                    "Please select a healthcare service first."
                );

                return;
            }


            setButtonLoading(
                searchButton,
                "🔄 Searching..."
            );


            try {

                await showHospitals(
                    selectedService
                );

            }

            finally {

                restoreButton(
                    searchButton
                );

            }

        }
    );

}


// ============================================================
// INITIALIZE EVERYTHING
// ============================================================

function initializeJeevanSetu() {

    console.log(
        "JeevanSetu JavaScript initialized."
    );


    // Stored login
    initializeStoredUser();


    // Authentication UI
    updateLoginState();


    // Hospital data
    loadHospitals();


    // Appointments
    loadAppointments();


    // Search
    initializeSearchButton();


    // Profile
    initializeProfilePhoto();

    initializeEditProfile();

    initializeSaveProfile();

    initializeChangePassword();

    loadJeevanSetuProfile();

}


// ============================================================
// PAGE LOAD
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeJeevanSetu
    );

}

else {

    initializeJeevanSetu();

}


// ============================================================
// END OF JEEVANSETU JAVASCRIPT
// ============================================================
