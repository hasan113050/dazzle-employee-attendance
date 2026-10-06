/* ========================= */
/* EMPLOYEE INFORMATION */
/* ========================= */


let employee = null;


/* ========================= */
/* OFFICE LOCATION */
/* ========================= */

const OFFICE_LAT =
    22.36887332674252;

const OFFICE_LNG =
    91.83160766263178;

const ALLOWED_RADIUS =
    50;


/* ========================= */
/* ELEMENTS */
/* ========================= */

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const employeeName =
    document.getElementById("employeeName");

const employeeId =
    document.getElementById("employeeId");

const todayDate =
    document.getElementById("todayDate");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const checkInTime =
    document.getElementById("checkInTime");

const checkOutTime =
    document.getElementById("checkOutTime");

const checkInBtn =
    document.getElementById("checkInBtn");

const checkOutBtn =
    document.getElementById("checkOutBtn");

const attendanceMessage =
    document.getElementById("attendanceMessage");

const attendanceHistory =
    document.getElementById("attendanceHistory");

const adminAccess =
    document.getElementById("adminAccess");

const adminDashboardBtn =
    document.getElementById("adminDashboardBtn");

/* ========================= */
/* DATE KEY */
/* ========================= */

function getTodayKey() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ========================= */
/* DISPLAY DATE */
/* ========================= */

function displayToday() {

    const now =
        new Date();

    todayDate.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


/* ========================= */
/* DISTANCE */
/* ========================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371000;

    const dLat =
        (lat2 - lat1)
        * Math.PI / 180;

    const dLon =
        (lon2 - lon1)
        * Math.PI / 180;


    const a =
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            lat1 * Math.PI / 180
        ) *

        Math.cos(
            lat2 * Math.PI / 180
        ) *

        Math.sin(dLon / 2) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}


/* ========================= */
/* GET LOCATION */
/* ========================= */

function getLocation() {

    return new Promise(
        function (resolve, reject) {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported by this browser."
                    )
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(
                
                function (position) {

                    resolve(position);

                },

                function (error) {

                    let message = "";

                    if (error.code === 1) {

                        message =
                            "Location permission denied. Please allow location access for this website.";

                    } else if (error.code === 2) {

                        message =
                            "Location unavailable. Please check your GPS/location service.";

                    } else if (error.code === 3) {

                        message =
                            "Location request timed out. Please try again.";

                    } else {

                        message =
                            "Unable to get your location.";

                    }

                    reject(
                        new Error(message)
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }

            );

        }
    );
}


/* ========================= */
/* CHECK OFFICE LOCATION */
/* ========================= */

async function verifyOfficeLocation() {

    const position =
        await getLocation();


    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    const accuracy =
        position.coords.accuracy;


    const distance =
        calculateDistance(

            latitude,

            longitude,

            OFFICE_LAT,

            OFFICE_LNG

        );


    return {

        latitude,

        longitude,

        accuracy,

        distance,

        withinOffice:
            distance <= ALLOWED_RADIUS

    };

}


/* ========================= */
/* LOGIN */
/* ========================= */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        loginMessage.textContent =
            "Logging in...";


        try {

            await window.firebaseSignIn(

                window.firebaseAuth,

                emailInput.value.trim(),

                passwordInput.value

            );


            loginMessage.textContent =
                "";

        } 
        catch (error) {

    console.error(
        "LOGIN ERROR:",
        error.code,
        error.message
    );

    loginMessage.textContent =
        error.code + " — " + error.message;

}

    }
);


/* ========================= */
/* AUTH STATE */
/* ========================= */

window.firebaseOnAuthStateChanged(

    window.firebaseAuth,

    async user => {

        if (user) {

            loginPage.style.display =
                "none";

            dashboardPage.classList.add(
                "active"
            );

            logoutBtn.style.display =
                "block";


            /* ========================= */
            /* LOAD EMPLOYEE PROFILE */
            /* ========================= */

            try {

                const db =
                    window.firebaseDB;

                const collection =
                    window.firebaseCollection;

                const getDocs =
                    window.firebaseGetDocs;

                const employeeSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "employees"
                        )
                    );

                const employeeDoc =
                    employeeSnapshot.docs.find(
                        doc =>
                            doc.data().email ===
                            user.email
                    );


                if (!employeeDoc) {

                    alert(
                        "Employee profile not found."
                    );

                    await window.firebaseSignOut(
                        window.firebaseAuth
                    );

                    return;

                }


                employee =
    employeeDoc.data();


employeeName.textContent =
    employee.name;

employeeId.textContent =
    employee.employeeId;


/* ========================= */
/* ROLE ACCESS */
/* ========================= */

const roles =
    employee.roles || [];


if (
    roles.includes("admin")
) {

    adminAccess.style.display =
        "block";

} else {

    adminAccess.style.display =
        "none";

}


                displayToday();

                loadTodayAttendance();

                loadAttendanceHistory();


            } catch (error) {

                console.error(error);

                alert(
                    "Failed to load employee profile.\n\n" +
                    error.message
                );

            }

        } else {

            loginPage.style.display =
                "flex";

            dashboardPage.classList.remove(
                "active"
            );

            logoutBtn.style.display =
                "none";
                adminAccess.style.display =
    "none";

        }

    }

);


/* ========================= */
/* LOGOUT */
/* ========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        await window.firebaseSignOut(
            window.firebaseAuth
        );

    }
);


/* ========================= */
/* CHECK IN */
/* ========================= */

checkInBtn.addEventListener(
    "click",
    async () => {

        checkInBtn.disabled =
            true;

        attendanceMessage.textContent =
            "Checking your location...";


        try {

            const location =
                await verifyOfficeLocation();


            if (!location.withinOffice) {

                attendanceMessage.textContent =
                    `You are ${Math.round(location.distance)}m away from the office.`;

                checkInBtn.disabled =
                    false;

                return;

            }


            const now =
                new Date();


            const dateKey =
                getTodayKey();


            const date =
                now.toLocaleDateString(
                    "en-GB"
                );


            const time =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"
                    }
                );


            const attendanceRef =
                window.firebaseCollection(

                    window.firebaseDB,

                    "attendance"

                );


            await window.firebaseAddDoc(

                attendanceRef,

                {

                    employeeId:
                        employee.employeeId,

                    employeeName:
                        employee.name,

                    email:
                        employee.email,

                    dateKey:
                        dateKey,

                    date:
                        date,

                    checkInTime:
                        time,

                    checkOutTime:
                        "",

                    checkInLatitude:
                        location.latitude,

                    checkInLongitude:
                        location.longitude,

                    checkInAccuracy:
                        location.accuracy,

                    checkInDistance:
                        Math.round(
                            location.distance
                        ),

                    status:
                        "checked-in"

                }

            );


            attendanceMessage.textContent =
                "Check In successful.";

            checkInTime.textContent =
                time;

            attendanceStatus.textContent =
                "Working";

            checkInBtn.disabled =
                true;


            loadAttendanceHistory();

        } 
        catch (error) {

    console.error(error);

    attendanceMessage.textContent =
        "Check In failed: " +
        (error.message || error);

    checkInBtn.disabled =
        false;

}});


/* ========================= */
/* CHECK OUT */
/* ========================= */

checkOutBtn.addEventListener(
    "click",
    async () => {

        checkOutBtn.disabled =
            true;

        attendanceMessage.textContent =
            "Checking your location...";


        try {

            const location =
                await verifyOfficeLocation();


            if (!location.withinOffice) {

                attendanceMessage.textContent =
                    `You are ${Math.round(location.distance)}m away from the office.`;

                checkOutBtn.disabled =
                    false;

                return;

            }


            const todayKey =
                getTodayKey();


            const attendanceRef =
                window.firebaseCollection(

                    window.firebaseDB,

                    "attendance"

                );


            const q =
                window.firebaseQuery(

                    attendanceRef,

                    window.firebaseWhere(
                        "employeeId",
                        "==",
                        employee.employeeId
                    ),

                    window.firebaseWhere(
                        "dateKey",
                        "==",
                        todayKey
                    )

                );


            const snapshot =
                await window.firebaseGetDocs(q);


            if (snapshot.empty) {

                attendanceMessage.textContent =
                    "No Check In record found.";

                checkOutBtn.disabled =
                    false;

                return;

            }


            const record =
                snapshot.docs[0];


            const now =
                new Date();


            const time =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"
                    }
                );


            /*

            NOTE:

            Firestore update functionality
            will be added in the next stage.

            */


            checkOutTime.textContent =
                time;

            attendanceStatus.textContent =
                "Completed";


            attendanceMessage.textContent =
                "Check Out successful.";

            checkOutBtn.disabled =
                true;


        } catch (error) {

            console.error(error);


            attendanceMessage.textContent =
                "Unable to check out.";

            checkOutBtn.disabled =
                false;

        }

    }
);


/* ========================= */
/* TODAY ATTENDANCE */
/* ========================= */

async function loadTodayAttendance() {

    try {

        const attendanceRef =
            window.firebaseCollection(

                window.firebaseDB,

                "attendance"

            );


        const q =
            window.firebaseQuery(

                attendanceRef,

                window.firebaseWhere(
                    "employeeId",
                    "==",
                    employee.employeeId
                ),

                window.firebaseWhere(
                    "dateKey",
                    "==",
                    getTodayKey()
                )

            );


        const snapshot =
            await window.firebaseGetDocs(q);


        if (snapshot.empty) {

            checkInTime.textContent =
                "--";

            checkOutTime.textContent =
                "--";

            attendanceStatus.textContent =
                "Not Checked In";

            return;

        }


        const record =
            snapshot.docs[0].data();


        checkInTime.textContent =
            record.checkInTime || "--";

        checkOutTime.textContent =
            record.checkOutTime || "--";


        if (record.checkOutTime) {

            attendanceStatus.textContent =
                "Completed";

        } else {

            attendanceStatus.textContent =
                "Working";

        }

    } catch (error) {

        console.error(error);

    }

}


/* ========================= */
/* HISTORY */
/* ========================= */

async function loadAttendanceHistory() {

    attendanceHistory.innerHTML = "";

    try {

        const attendanceRef =
            window.firebaseCollection(

                window.firebaseDB,

                "attendance"

            );


        const q =
            window.firebaseQuery(

                attendanceRef,

                window.firebaseWhere(
                    "employeeId",
                    "==",
                    employee.employeeId
                )

            );


        const snapshot =
            await window.firebaseGetDocs(q);


        if (snapshot.empty) {

            attendanceHistory.innerHTML = `

                <tr>

                    <td colspan="4">
                        No attendance found.
                    </td>

                </tr>

            `;

            return;

        }


        snapshot.forEach(
            doc => {

                const record =
                    doc.data();


                attendanceHistory.innerHTML += `

                    <tr>

                        <td>
                            ${record.date || "-"}
                        </td>

                        <td>
                            ${record.checkInTime || "-"}
                        </td>

                        <td>
                            ${record.checkOutTime || "-"}
                        </td>

                        <td>
                            ${
                                record.checkInDistance !== undefined
                                ? record.checkInDistance + " m"
                                : "-"
                            }
                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(error);

    }

}

/* ========================= */
/* ADMIN DASHBOARD */
/* ========================= */

adminDashboardBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "admin.html";

    } )