// ======================================================
// JEEVANSETU - COMPLETE JAVASCRIPT
// STEP 53 - LOADING STATES
// LOGIN + REGISTER + FORGOT USER ID + FORGOT PASSWORD
// OTP + HOSPITAL + DOCTOR + APPOINTMENT + EMERGENCY
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const searchButton =
    document.querySelector(".search-btn");

const serviceSelect =
    document.getElementById("service-select");

const hospitalList =
    document.getElementById("hospital-list");

const resultMessage =
    document.getElementById("result-message");

let hospitals = [];


// ======================================================
// API
// ======================================================
const API_BASE_URL = "https://jeevansetu-new.onrender.com";

// ======================================================
// AUTH DATA
// ======================================================

let currentUser =
    JSON.parse(
        localStorage.getItem(
            "jeevansetu_current_user"
        )
    ) || null;

let registeredUser =
    JSON.parse(
        localStorage.getItem(
            "jeevansetu_user"
        )
    ) || null;


// ======================================================
// OTP VARIABLES
// ======================================================

let userIdOTP = null;
let passwordOTP = null;

let passwordRecoveryUser = null;


// ======================================================
// LOADING STATE
// ======================================================

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


function restoreButton(
    button
) {

    if (!button) {
        return;
    }

    button.disabled = false;

    if (button.dataset.originalText) {

        button.innerText =
            button.dataset.originalText;

    }

}


// ======================================================
// OPEN / CLOSE AUTH MODAL
// ======================================================

function openAuthModal() {

    const modal =
        document.getElementById(
            "auth-modal"
        );

    if (modal) {

        modal.style.display =
            "flex";

    }
}


function closeAuthModal() {

    const modal =
        document.getElementById(
            "auth-modal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }
}


// ======================================================
// SHOW LOGIN
// ======================================================

function showLoginForm() {

    openAuthModal();

    hideAllAuthForms();

    const form =
        document.getElementById(
            "login-form"
        );

    if (form) {

        form.style.display =
            "block";

    }
}


// ======================================================
// SHOW REGISTER
// ======================================================

function showRegisterForm() {

    openAuthModal();

    hideAllAuthForms();

    const form =
        document.getElementById(
            "register-form"
        );

    if (form) {

        form.style.display =
            "block";

    }
}


// ======================================================
// HIDE ALL AUTH FORMS
// ======================================================

function hideAllAuthForms() {

    const forms = [

        "login-form",
        "register-form",
        "forgot-user-id-form",
        "forgot-password-form",
        "new-password-form",
        "user-profile"

    ];

    forms.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.style.display =
                "none";

        }

    });

}


// ======================================================
// GENERATE USER ID
// ======================================================

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


// ======================================================
// REGISTER
// ======================================================

function registerUser() {

    const name =
        document
            .getElementById("register-name")
            .value
            .trim();

    const mobile =
        document
            .getElementById("register-mobile")
            .value
            .trim();

    const email =
        document
            .getElementById("register-email")
            .value
            .trim();

    const password =
        document
            .getElementById("register-password")
            .value
            .trim();


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


    localStorage.setItem(
        "jeevansetu_user",
        JSON.stringify(user)
    );


    localStorage.setItem(
        "jeevansetu_current_user",
        JSON.stringify(user)
    );


    registeredUser = user;

    currentUser = user;


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


// ======================================================
// LOGIN
// ======================================================

function loginUser() {

    const userId =
        document
            .getElementById("login-user-id")
            .value
            .trim()
            .toUpperCase();

    const password =
        document
            .getElementById("login-password")
            .value
            .trim();


    if (!userId || !password) {

        alert(
            "Please enter User ID and password."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem(
                "jeevansetu_user"
            )
        );


    if (!user) {

        alert(
            "No registered account found.\n\nPlease register first."
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

    registeredUser = user;


    localStorage.setItem(
        "jeevansetu_current_user",
        JSON.stringify(user)
    );


    alert(
        "✅ Login Successful!"
    );


    closeAuthModal();

    updateLoginState();

    loadAppointments();

}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "jeevansetu_current_user"
    );


    const appointmentsList =
        document.getElementById(
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


// ======================================================
// LOGIN STATE
// ======================================================

function updateLoginState() {

    const authArea =
        document.getElementById("auth-area");

    if (!authArea) {
        return;
    }


    // USER LOGGED IN
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


        console.log(
            "Logged in as:",
            currentUser.id
        );

    }


    // USER NOT LOGGED IN
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


        console.log(
            "No user logged in."
        );

    }

}


// ======================================================
// FORGOT USER ID
// ======================================================

function showForgotUserId() {

    openAuthModal();

    hideAllAuthForms();


    const form =
        document.getElementById(
            "forgot-user-id-form"
        );


    if (form) {

        form.style.display =
            "block";

    }


    const otpSection =
        document.getElementById(
            "forgot-id-otp-section"
        );


    if (otpSection) {

        otpSection.style.display =
            "none";

    }


    const result =
        document.getElementById(
            "forgot-id-result"
        );


    if (result) {

        result.innerText = "";

    }

}


// ======================================================
// SEND USER ID OTP
// ======================================================

function sendUserIdOTP() {

    const mobile =
        document
            .getElementById("forgot-id-mobile")
            .value
            .trim();


    const user =
        JSON.parse(
            localStorage.getItem(
                "jeevansetu_user"
            )
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


    document.getElementById(
        "forgot-id-otp-section"
    ).style.display =
        "block";


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        userIdOTP
    );

}


// ======================================================
// VERIFY USER ID OTP
// ======================================================

function verifyUserIdOTP() {

    const enteredOTP =
        document
            .getElementById("forgot-id-otp")
            .value
            .trim();


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
        JSON.parse(
            localStorage.getItem(
                "jeevansetu_user"
            )
        );


    document.getElementById(
        "forgot-id-result"
    ).innerHTML =
        "✅ OTP verified.<br><br>" +
        "<strong>Your User ID: " +
        escapeHTML(user.id) +
        "</strong>";


    userIdOTP = null;

}


// ======================================================
// FORGOT PASSWORD
// ======================================================

function showForgotPassword() {

    openAuthModal();

    hideAllAuthForms();


    document.getElementById(
        "forgot-password-form"
    ).style.display =
        "block";


    document.getElementById(
        "forgot-password-otp-section"
    ).style.display =
        "none";


    document.getElementById(
        "forgot-password-message"
    ).innerText =
        "";


    passwordRecoveryUser = null;

}


// ======================================================
// SEND PASSWORD OTP
// ======================================================

function sendPasswordOTP() {

    const userId =
        document
            .getElementById(
                "forgot-password-user-id"
            )
            .value
            .trim()
            .toUpperCase();


    const mobile =
        document
            .getElementById(
                "forgot-password-mobile"
            )
            .value
            .trim();


    const user =
        JSON.parse(
            localStorage.getItem(
                "jeevansetu_user"
            )
        );


    if (!userId || !mobile) {

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


    document.getElementById(
        "forgot-password-otp-section"
    ).style.display =
        "block";


    alert(
        "📱 OTP sent successfully!\n\n" +
        "DEMO OTP: " +
        passwordOTP
    );

}


// ======================================================
// VERIFY PASSWORD OTP
// ======================================================

function verifyPasswordOTP() {

    const enteredOTP =
        document
            .getElementById(
                "forgot-password-otp"
            )
            .value
            .trim();


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


    passwordOTP = null;


    hideAllAuthForms();


    document.getElementById(
        "new-password-form"
    ).style.display =
        "block";


    document.getElementById(
        "new-password"
    ).value =
        "";


    document.getElementById(
        "confirm-new-password"
    ).value =
        "";

}


// ======================================================
// RESET PASSWORD
// ======================================================

function resetPassword() {

    if (!passwordRecoveryUser) {

        alert(
            "Password recovery session expired."
        );

        showForgotPassword();

        return;
    }


    const newPassword =
        document
            .getElementById("new-password")
            .value;


    const confirmPassword =
        document
            .getElementById(
                "confirm-new-password"
            )
            .value;


    if (!newPassword || !confirmPassword) {

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


    if (newPassword !== confirmPassword) {

        alert(
            "❌ New passwords do not match."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem(
                "jeevansetu_user"
            )
        );


    if (!user) {

        alert(
            "User account not found."
        );

        return;
    }


    user.password =
        newPassword;


    localStorage.setItem(
        "jeevansetu_user",
        JSON.stringify(user)
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


    document.getElementById(
        "login-user-id"
    ).value =
        user.id;


    document.getElementById(
        "login-password"
    ).value =
        "";

}


// ======================================================
// GENERATE OTP
// ======================================================

function generateOTP() {

    return String(
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );

}


// ======================================================
// SHOW PROFILE
// ======================================================

function showUserProfile() {

    if (!currentUser) {

        showLoginForm();

        return;

    }


    openAuthModal();

    hideAllAuthForms();


    document.getElementById(
        "user-profile"
    ).style.display =
        "block";


    document.getElementById(
        "profile-name"
    ).innerText =
        currentUser.name;


    document.getElementById(
        "profile-user-id"
    ).innerText =
        currentUser.id;

}


// ======================================================
// COPY USER ID
// ======================================================

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


// ======================================================
// APPOINTMENT LOGIN CHECK
// ======================================================

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


// ======================================================
// LOAD HOSPITALS
// STEP 53 LOADING STATE
// ======================================================

async function loadHospitals() {

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


        hospitals =
            await response.json();


        console.log(
            "Hospitals loaded:",
            hospitals
        );


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


// ======================================================
// SEARCH
// ======================================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        async function() {

            const selectedService =
                serviceSelect.value;


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


// ======================================================
// SHOW HOSPITALS
// ======================================================

async function showHospitals(service) {

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


    // Small delay makes loading state visible
    await new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                300
            );

        }
    );


    hospitalList.innerHTML = "";


    if (resultMessage) {

        resultMessage.innerText =
            "Government healthcare services for: " +
            service;

    }


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


    if (filteredHospitals.length === 0) {

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
                    🏥 ${escapeHTML(hospital.name)}
                </h3>

                <p>
                    📍 ${escapeHTML(hospital.district)}
                </p>

                <p>
                    🏛️ ${
                        escapeHTML(
                            hospital.type ||
                            "Government Healthcare Facility"
                        )
                    }
                </p>

                <p>
                    🩺 ${doctorCount}
                    doctor(s) listed
                </p>

                <button
                    type="button"
                    onclick="showDoctors(${Number(hospital.id)})">

                    👨‍⚕️ View Doctors

                </button>

            `;


            hospitalList.appendChild(
                card
            );

        }
    );


    const results =
        document.getElementById(
            "results"
        );


    if (results) {

        results.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// SHOW DOCTORS
// STEP 53 LOADING STATE
// ======================================================

async function showDoctors(hospitalId) {

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
            function(hospital) {

                return (
                    Number(hospital.id) ===
                    Number(hospitalId)
                );

            }
        );


    if (!hospital) {

        hospitalList.innerHTML = "";

        alert(
            "Hospital information not found."
        );

        return;

    }


    hospitalList.innerHTML = "";


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

            showHospitals(
                serviceSelect.value ||
                "General Doctor"
            );

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


// ======================================================
// APPOINTMENT FORM
// ======================================================

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


    hospitalList.innerHTML = "";


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
            🏥 ${escapeHTML(hospitalName)}
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


    document
        .getElementById(
            "confirm-appointment-btn"
        )
        .onclick =
        function() {

            submitAppointment(
                doctorName,
                hospitalName,
                timing
            );

        };


    document
        .getElementById(
            "back-doctor-btn"
        )
        .onclick =
        function() {

            goBackToDoctors(
                hospitalName
            );

        };


    const dateInput =
        document.getElementById(
            "appointment-date"
        );


    const today =
        getLocalDateString();


    dateInput.min =
        today;


    const results =
        document.getElementById(
            "results"
        );


    if (results) {

        results.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// BACK TO DOCTORS
// ======================================================

function goBackToDoctors(
    hospitalName
) {

    const hospital =
        hospitals.find(
            function(hospital) {

                return (
                    hospital.name ===
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


// ======================================================
// SUBMIT APPOINTMENT
// STEP 53 BOOKING LOADING
// ======================================================

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


    const patientName =
        document
            .getElementById("patient-name")
            .value
            .trim();


    const mobile =
        document
            .getElementById("patient-mobile")
            .value
            .trim();


    const age =
        document
            .getElementById("patient-age")
            .value
            .trim();


    const appointmentDate =
        document
            .getElementById("appointment-date")
            .value;


    const confirmButton =
        document.getElementById(
            "confirm-appointment-btn"
        );


    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------

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


    // --------------------------------------------------
    // PATIENT NAME VALIDATION
    // --------------------------------------------------

    if (
        patientName.length < 2
    ) {

        alert(
            "Please enter a valid patient name."
        );

        return;

    }


    if (
        patientName.length > 60
    ) {

        alert(
            "Patient name is too long."
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


    // --------------------------------------------------
    // MOBILE VALIDATION
    // --------------------------------------------------

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


    // --------------------------------------------------
    // AGE VALIDATION
    // --------------------------------------------------

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


    // --------------------------------------------------
    // DATE VALIDATION
    // --------------------------------------------------

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


    // --------------------------------------------------
    // LOADING START
    // --------------------------------------------------

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


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Appointment booking failed."
            );

            restoreButton(
                confirmButton
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
            document.getElementById(
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


// ======================================================
// LOAD APPOINTMENTS
// STEP 53 LOADING STATE
// ======================================================

async function loadAppointments() {

    const appointmentsList =
        document.getElementById(
            "appointments-list"
        );


    if (!appointmentsList) {

        return;

    }


    // --------------------------------------------------
    // LOGIN CHECK
    // --------------------------------------------------

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


    // --------------------------------------------------
    // LOADING STATE
    // --------------------------------------------------

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
                            (${appointment.age} years)
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
                                onclick="copyAppointmentId(
                                    '${escapeHTML(
                                        displayAppointmentId
                                    )}'
                                )">

                                📋 Copy ID

                            </button>

                        </div>

                    </div>

                    <button
                        type="button"
                        class="cancel-appointment-btn"
                        onclick="cancelAppointment(
                            ${Number(
                                appointment.id
                            )}
                        )">

                        ❌ Cancel Appointment

                    </button>

                `;


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


// ======================================================
// COPY APPOINTMENT ID
// ======================================================

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


// ======================================================
// FORMAT APPOINTMENT ID
// ======================================================

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


// ======================================================
// DATE
// ======================================================

function formatDate(
    dateString
) {

    if (!dateString) {

        return "Not available";

    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

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


// ======================================================
// LOCAL DATE
// ======================================================

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


// ======================================================
// BOOKING DATE
// ======================================================

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


// ======================================================
// CANCEL APPOINTMENT
// STEP 53 LOADING STATE
// ======================================================

async function cancelAppointment(
    appointmentId
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


    // Find clicked button
    const buttons =
        document.querySelectorAll(
            ".cancel-appointment-btn"
        );


    let clickedButton = null;


    buttons.forEach(
        function(button) {

            const onclickText =
                button.getAttribute(
                    "onclick"
                );


            if (
                onclickText &&
                onclickText.includes(
                    String(appointmentId)
                )
            ) {

                clickedButton =
                    button;

            }

        }
    );


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


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Appointment cancellation failed."
            );

            restoreButton(
                clickedButton
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

        restoreButton(
            clickedButton
        );

    }

}


// ======================================================
// EMERGENCY
// ======================================================

function showEmergency() {

    const panel =
        document.getElementById(
            "emergency-panel"
        );


    if (panel) {

        panel.style.display =
            "flex";

    }

}


function closeEmergency() {

    const panel =
        document.getElementById(
            "emergency-panel"
        );


    if (panel) {

        panel.style.display =
            "none";

    }

}


// ======================================================
// AMBULANCE
// ======================================================

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


// ======================================================
// FIND EMERGENCY HOSPITAL
// ======================================================

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


// ======================================================
// CALL EMERGENCY
// ======================================================

function callEmergency() {

    window.location.href =
        "tel:112";

}


// ======================================================
// SAFE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

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


// ======================================================
// INITIAL AUTH
// ======================================================

function initializeAuth() {

    /*
        IMPORTANT:

        Do NOT automatically open the profile modal
        after page refresh.

        Login session remains stored in localStorage,
        but profile popup stays closed until
        the user clicks the profile/login button.
    */


    if (currentUser) {

        updateLoginState();


        console.log(
            "Existing login session:",
            currentUser.id
        );

    }

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadHospitals();

        initializeAuth();

        loadAppointments();

    }/* =====================================================
   JEEVANSETU PROFILE JAVASCRIPT
===================================================== */


/* PROFILE PHOTO PREVIEW */

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const profilePreview =
    document.getElementById("profilePreview");


if (profilePhotoInput && profilePreview) {

    profilePhotoInput.addEventListener(
        "change",
        function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                alert("Please select an image file.");

                this.value = "";

                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                profilePreview.src =
                    event.target.result;

            };

            reader.readAsDataURL(file);
        }
    );
}


/* EDIT PROFILE */

const editProfileBtn =
    document.getElementById("editProfileBtn");


if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        function () {

            const fields =
                document.querySelectorAll(
                    "#profileSection input, #profileSection select, #profileSection textarea"
                );

            fields.forEach(function (field) {

                if (field.id !== "profilePhotoInput") {
                    field.disabled = false;
                }

            });

            alert("You can now edit your profile.");

        }
    );
}


/* SAVE PROFILE */

const saveProfileBtn =
    document.getElementById("saveProfileBtn");


if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        function () {

            const profileData = {

                firstName:
                    document.getElementById(
                        "profileFirstName"
                    )?.value || "",

                lastName:
                    document.getElementById(
                        "profileLastName"
                    )?.value || "",

                mobile:
                    document.getElementById(
                        "profileMobile"
                    )?.value || "",

                email:
                    document.getElementById(
                        "profileEmail"
                    )?.value || "",

                dob:
                    document.getElementById(
                        "profileDOB"
                    )?.value || "",

                gender:
                    document.getElementById(
                        "profileGender"
                    )?.value || "",

                address:
                    document.getElementById(
                        "profileAddress"
                    )?.value || "",

                city:
                    document.getElementById(
                        "profileCity"
                    )?.value || "",

                state:
                    document.getElementById(
                        "profileState"
                    )?.value || "",

                pin:
                    document.getElementById(
                        "profilePin"
                    )?.value || "",

                bloodGroup:
                    document.getElementById(
                        "profileBloodGroup"
                    )?.value || "",

                height:
                    document.getElementById(
                        "profileHeight"
                    )?.value || "",

                weight:
                    document.getElementById(
                        "profileWeight"
                    )?.value || "",

                emergencyName:
                    document.getElementById(
                        "emergencyContactName"
                    )?.value || "",

                emergencyNumber:
                    document.getElementById(
                        "emergencyContactNumber"
                    )?.value || ""
            };


            /*
             * Temporary local save.
             * Later this can be connected
             * to your Node.js backend.
             */

            localStorage.setItem(
                "jeevansetuProfile",
                JSON.stringify(profileData)
            );


            alert(
                "Profile changes saved successfully!"
            );

        }
    );
}


/* LOAD SAVED PROFILE */

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
            JSON.parse(savedProfile);


        const fields = {

            profileFirstName: data.firstName,
            profileLastName: data.lastName,
            profileMobile: data.mobile,
            profileEmail: data.email,
            profileDOB: data.dob,
            profileGender: data.gender,
            profileAddress: data.address,
            profileCity: data.city,
            profileState: data.state,
            profilePin: data.pin,
            profileBloodGroup: data.bloodGroup,
            profileHeight: data.height,
            profileWeight: data.weight,
            emergencyContactName: data.emergencyName,
            emergencyContactNumber: data.emergencyNumber

        };


        Object.keys(fields).forEach(
            function (id) {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.value =
                        fields[id] || "";
                }

            }
        );

    } catch (error) {

        console.error(
            "Could not load profile:",
            error
        );

    }
}


/* LOAD PROFILE WHEN PAGE OPENS */

document.addEventListener(
    "DOMContentLoaded",
    loadJeevanSetuProfile
);


/* CHANGE PASSWORD */

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        function () {

            alert(
                "Change Password feature will be connected to the account system."
            );

        }
    );
                }
);

