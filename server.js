const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ======================================================
// DATA FILE
// ======================================================

const dataFile = path.join(__dirname, "data.json");


// ======================================================
// INITIAL DATA
// ======================================================

const defaultData = {
    appointments: [],
    nextAppointmentId: 1
};


// ======================================================
// LOAD DATA
// ======================================================

function loadData() {

    try {

        if (!fs.existsSync(dataFile)) {

            fs.writeFileSync(
                dataFile,
                JSON.stringify(
                    defaultData,
                    null,
                    2
                )
            );

            return defaultData;
        }


        const data =
            JSON.parse(
                fs.readFileSync(
                    dataFile,
                    "utf8"
                )
            );


        return {

            appointments:
                Array.isArray(data.appointments)
                    ? data.appointments
                    : [],

            nextAppointmentId:
                Number(data.nextAppointmentId) || 1

        };

    }

    catch (error) {

        console.error(
            "Data loading error:",
            error
        );

        return defaultData;

    }

}


// ======================================================
// SAVE DATA
// ======================================================

function saveData(data) {

    fs.writeFileSync(

        dataFile,

        JSON.stringify(
            data,
            null,
            2
        )

    );

}


// ======================================================
// HOSPITAL DATA
// ======================================================

const hospitals = [

    {

        id: 1,

        name:
            "Government Medical College & Hospital",

        district:
            "Bihar",

        type:
            "Government Hospital",

        services: [

            "General Doctor",
            "Specialist Doctor",
            "Blood Test",
            "X-Ray",
            "Pharmacy",
            "Emergency Service"

        ],

        doctors: [

            {

                name:
                    "Dr. Rajesh Kumar",

                department:
                    "General Medicine",

                timing:
                    "09:00 AM - 01:00 PM",

                available:
                    true

            },

            {

                name:
                    "Dr. Priya Singh",

                department:
                    "General Medicine",

                timing:
                    "10:00 AM - 02:00 PM",

                available:
                    true

            },

            {

                name:
                    "Dr. Amit Kumar",

                department:
                    "Emergency Medicine",

                timing:
                    "24 Hours",

                available:
                    true

            }

        ]

    },


    {

        id: 2,

        name:
            "District Government Hospital",

        district:
            "Buxar",

        type:
            "Government District Hospital",

        services: [

            "General Doctor",
            "Specialist Doctor",
            "Blood Test",
            "X-Ray",
            "Pharmacy",
            "Emergency Service"

        ],

        doctors: [

            {

                name:
                    "Dr. Anil Sharma",

                department:
                    "General Medicine",

                timing:
                    "09:00 AM - 01:00 PM",

                available:
                    true

            },

            {

                name:
                    "Dr. Neha Singh",

                department:
                    "Gynecology",

                timing:
                    "10:00 AM - 01:00 PM",

                available:
                    true

            }

        ]

    },


    {

        id: 3,

        name:
            "Government Sadar Hospital",

        district:
            "Patna",

        type:
            "Government Hospital",

        services: [

            "General Doctor",
            "Specialist Doctor",
            "Blood Test",
            "X-Ray",
            "Pharmacy",
            "Emergency Service"

        ],

        doctors: [

            {

                name:
                    "Dr. Vikash Kumar",

                department:
                    "General Medicine",

                timing:
                    "09:00 AM - 12:00 PM",

                available:
                    true

            },

            {

                name:
                    "Dr. Sneha Gupta",

                department:
                    "Pediatrics",

                timing:
                    "10:00 AM - 02:00 PM",

                available:
                    true

            }

        ]

    }

];


// ======================================================
// HOME API
// ======================================================

app.get(
    "/",
    function(req, res) {

        res.json({

            success: true,

            message:
                "JeevanSetu Backend is running."

        });

    }
);


// ======================================================
// HOSPITAL API
// ======================================================

app.get(
    "/api/hospitals",
    function(req, res) {

        res.json(
            hospitals
        );

    }
);


// ======================================================
// GET APPOINTMENTS
// USER-WISE
// ======================================================

app.get(
    "/api/appointments",
    function(req, res) {

        const userId =
            String(
                req.query.userId || ""
            ).trim();


        if (!userId) {

            return res.status(400).json({

                message:
                    "User ID is required."

            });

        }


        const data =
            loadData();


        const userAppointments =
            data.appointments.filter(

                function(appointment) {

                    return (
                        appointment.userId ===
                        userId
                    );

                }

            );


        res.json(
            userAppointments
        );

    }
);


// ======================================================
// BOOK APPOINTMENT
// WITH BACKEND VALIDATION
// ======================================================

app.post(
    "/api/appointments",
    function(req, res) {

        const {
            patientName,
            mobile,
            age,
            appointmentDate,
            doctorName,
            hospitalName,
            timing,
            userId
        } = req.body;


        // --------------------------------------------------
        // 1. REQUIRED FIELD VALIDATION
        // --------------------------------------------------

        if (
            patientName === undefined ||
            mobile === undefined ||
            age === undefined ||
            appointmentDate === undefined ||
            doctorName === undefined ||
            hospitalName === undefined ||
            timing === undefined ||
            userId === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All appointment details are required."

            });

        }


        // --------------------------------------------------
        // 2. STRING CLEANING
        // --------------------------------------------------

        const cleanPatientName =
            String(patientName).trim();

        const cleanMobile =
            String(mobile).trim();

        const cleanDoctorName =
            String(doctorName).trim();

        const cleanHospitalName =
            String(hospitalName).trim();

        const cleanTiming =
            String(timing).trim();

        const cleanUserId =
            String(userId).trim();

        const cleanAppointmentDate =
            String(appointmentDate).trim();


        // --------------------------------------------------
        // 3. EMPTY FIELD VALIDATION
        // --------------------------------------------------

        if (
            !cleanPatientName ||
            !cleanMobile ||
            !cleanDoctorName ||
            !cleanHospitalName ||
            !cleanTiming ||
            !cleanUserId ||
            !cleanAppointmentDate
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Appointment fields cannot be empty."

            });

        }


        // --------------------------------------------------
        // 4. PATIENT NAME VALIDATION
        // --------------------------------------------------

        if (
            cleanPatientName.length < 2 ||
            cleanPatientName.length > 100
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid patient name."

            });

        }


        if (
            !/^[A-Za-z .'-]+$/.test(
                cleanPatientName
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Patient name contains invalid characters."

            });

        }


        // --------------------------------------------------
        // 5. MOBILE NUMBER VALIDATION
        // --------------------------------------------------

        if (
            !/^[0-9]{10}$/.test(
                cleanMobile
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid mobile number."

            });

        }


        // --------------------------------------------------
        // 6. AGE VALIDATION
        // --------------------------------------------------

        const numericAge =
            Number(age);


        if (
            !Number.isInteger(numericAge) ||
            numericAge < 1 ||
            numericAge > 120
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid age."

            });

        }


        // --------------------------------------------------
        // 7. DATE FORMAT VALIDATION
        // --------------------------------------------------

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(
                cleanAppointmentDate
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid appointment date."

            });

        }


        const selectedDate =
            new Date(
                cleanAppointmentDate + "T00:00:00"
            );


        if (
            Number.isNaN(
                selectedDate.getTime()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid appointment date."

            });

        }


        // --------------------------------------------------
        // 8. PREVENT PAST APPOINTMENT
        // --------------------------------------------------

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        if (
            selectedDate < today
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Appointment date cannot be in the past."

            });

        }


        // --------------------------------------------------
        // 9. HOSPITAL VALIDATION
        // --------------------------------------------------

        const hospital =
            hospitals.find(

                function(item) {

                    return (
                        item.name ===
                        cleanHospitalName
                    );

                }

            );


        if (!hospital) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid hospital."

            });

        }


        // --------------------------------------------------
        // 10. DOCTOR VALIDATION
        // --------------------------------------------------

        const doctor =
            hospital.doctors.find(

                function(item) {

                    return (
                        item.name ===
                        cleanDoctorName
                    );

                }

            );


        if (!doctor) {

            return res.status(400).json({

                success: false,

                message:
                    "Doctor does not belong to the selected hospital."

            });

        }


        // --------------------------------------------------
        // 11. DOCTOR AVAILABILITY
        // --------------------------------------------------

        if (
            doctor.available !== true
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected doctor is currently unavailable."

            });

        }


        // --------------------------------------------------
        // 12. TIMING VALIDATION
        // --------------------------------------------------

        if (
            cleanTiming !==
            doctor.timing
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid doctor timing."

            });

        }


        // --------------------------------------------------
        // 13. LOAD EXISTING DATA
        // --------------------------------------------------

        const data =
            loadData();


        // --------------------------------------------------
        // 14. CREATE APPOINTMENT
        // --------------------------------------------------

        const appointment = {

            id:
                data.nextAppointmentId,

            userId:
                cleanUserId,

            patientName:
                cleanPatientName,

            mobile:
                cleanMobile,

            age:
                numericAge,

            appointmentDate:
                cleanAppointmentDate,

            doctorName:
                doctor.name,

            hospitalName:
                hospital.name,

            timing:
                doctor.timing,

            status:
                "Booked",

            createdAt:
                new Date().toISOString()

        };


        // --------------------------------------------------
        // 15. SAVE APPOINTMENT
        // --------------------------------------------------

        data.appointments.push(
            appointment
        );


        data.nextAppointmentId =
            data.nextAppointmentId + 1;


        saveData(data);


        // --------------------------------------------------
        // 16. SUCCESS RESPONSE
        // --------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Appointment booked successfully.",

            appointment:
                appointment

        });

    }
);


// ======================================================
// CANCEL APPOINTMENT
// USER-WISE
// ======================================================

app.delete(
    "/api/appointments/:id",
    function(req, res) {

        const appointmentId =
            Number(
                req.params.id
            );


        const userId =
            String(
                req.query.userId || ""
            ).trim();


        if (
            !Number.isInteger(
                appointmentId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid appointment ID."

            });

        }


        if (!userId) {

            return res.status(400).json({

                message:
                    "User ID is required."

            });

        }


        const data =
            loadData();


        const appointmentIndex =
            data.appointments.findIndex(

                function(appointment) {

                    return (

                        appointment.id ===
                            appointmentId &&

                        appointment.userId ===
                            userId

                    );

                }

            );


        if (
            appointmentIndex === -1
        ) {

            return res.status(404).json({

                message:
                    "Appointment not found or does not belong to this user."

            });

        }


        data.appointments.splice(
            appointmentIndex,
            1
        );


        saveData(data);


        res.json({

            success: true,

            message:
                "Appointment cancelled successfully."

        });

    }
);
// ======================================================
// GLOBAL API ERROR HANDLER
// ======================================================

app.use(function (err, req, res, next) {

    console.error("API Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({

        success: false,

        message:
            "Something went wrong on the server."

    });

});

// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    function() {

        console.log(
            "======================================"
        );

        console.log(
            "JeevanSetu Backend Started"
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log(
            "======================================"
        );

    }
);