/* ========================= */
/* EMPLOYEE INFORMATION */
/* ========================= */


let employee = null;


/* ========================= */
/* OFFICE LOCATION */
/* ========================= */

const OFFICE_LAT = 22.369146;
const OFFICE_LNG = 91.832031;

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

        checkInBtn.disabled = true;

        attendanceMessage.textContent =
            "Checking today's attendance...";

        try {

            const attendanceRef =
                window.firebaseCollection(
                    window.firebaseDB,
                    "attendance"
                );

            /* ========================= */
            /* CHECK EXISTING ATTENDANCE */
            /* ========================= */

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

            const todayKey =
                getTodayKey();

            let todayAttendance = null;

            snapshot.forEach(
                doc => {

                    const record =
                        doc.data();

                    if (
                        record.dateKey === todayKey
                    ) {

                        todayAttendance = {
                            id: doc.id,
                            ...record
                        };

                    }

                }
            );


            /* ========================= */
            /* ALREADY CHECKED IN / COMPLETED */
            /* ========================= */

            if (todayAttendance) {

                if (
                    todayAttendance.status === "completed"
                ) {

                    attendanceMessage.textContent =
                        "You have already completed today's attendance.";

                } else {

                    attendanceMessage.textContent =
                        "You are already checked in today.";

                }

                checkInBtn.disabled = true;

                return;

            }


            /* ========================= */
            /* VERIFY OFFICE LOCATION */
            /* ========================= */

            attendanceMessage.textContent =
                "Checking your location...";


            const location =
                await verifyOfficeLocation();


            if (!location.withinOffice) {

                attendanceMessage.textContent =
                    `You are ${Math.round(location.distance)}m away from the office.`;

                checkInBtn.disabled = false;

                return;

            }


            /* ========================= */
            /* TIME */
            /* ========================= */

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
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );


            /* ========================= */
            /* SAVE ATTENDANCE */
            /* ========================= */

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


            /* ========================= */
            /* UPDATE UI */
            /* ========================= */

            attendanceMessage.textContent =
                "Check In successful.";

            checkInTime.textContent =
                time;

            attendanceStatus.textContent =
                "Working";

            checkInBtn.disabled =
                true;
checkOutBtn.disabled =
    false;

            loadAttendanceHistory();


        }

        catch (error) {

            console.error(error);

            attendanceMessage.textContent =
                "Check In failed: " +
                (error.message || error);

            checkInBtn.disabled =
                false;

        }

    }
);

/* ========================= */
/* CHECK OUT */
/* ========================= */

checkOutBtn.addEventListener(
    "click",
    async () => {

        checkOutBtn.disabled = true;

        attendanceMessage.textContent =
            "Checking today's attendance...";

        try {

            const todayKey =
                getTodayKey();

            const attendanceRef =
                window.firebaseCollection(
                    window.firebaseDB,
                    "attendance"
                );


            /* ========================= */
            /* FIND TODAY'S ATTENDANCE */
            /* ========================= */

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
        "You should Check In first.";

    checkOutBtn.disabled = false;

    return;

}


            /* ========================= */
            /* FIND ACTIVE CHECK-IN */
            /* ========================= */

            let activeRecord = null;

            snapshot.forEach(
                doc => {

                    const record =
                        doc.data();

                    if (
                        record.status === "checked-in" &&
                        !record.checkOutTime
                    ) {

                        activeRecord = {
                            id: doc.id,
                            ...record
                        };

                    }

                }
            );


            /* ========================= */
            /* ALREADY COMPLETED */
            /* ========================= */

            if (!activeRecord) {

                attendanceMessage.textContent =
                    "Today's Check In & Check Out are already completed.";

                checkOutBtn.disabled = true;

                return;

            }


            /* ========================= */
            /* VERIFY OFFICE LOCATION */
            /* ========================= */

            attendanceMessage.textContent =
                "Checking your location...";


            const location =
                await verifyOfficeLocation();


            if (!location.withinOffice) {

                attendanceMessage.textContent =
                    `You are ${Math.round(location.distance)}m away from the office.`;

                checkOutBtn.disabled = false;

                return;

            }


            /* ========================= */
            /* TIME */
            /* ========================= */

            const now =
                new Date();


            const time =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );


            /* ========================= */
            /* UPDATE FIRESTORE */
            /* ========================= */

            const attendanceDoc =
                window.firebaseDoc(
                    window.firebaseDB,
                    "attendance",
                    activeRecord.id
                );


            await window.firebaseUpdateDoc(
                attendanceDoc,
                {
                    checkOutTime: time,
                    checkOutLatitude: location.latitude,
                    checkOutLongitude: location.longitude,
                    checkOutAccuracy: location.accuracy,
                    checkOutDistance: Math.round(
                        location.distance
                    ),
                    status: "completed"
                }
            );


            /* ========================= */
            /* UPDATE UI */
            /* ========================= */

            checkOutTime.textContent =
                time;

            attendanceStatus.textContent =
                "Completed";

            attendanceMessage.textContent =
                "Check Out successful.";

            checkOutBtn.disabled =
                true;


            loadTodayAttendance();
            loadAttendanceHistory();


        } catch (error) {

            console.error(error);

            attendanceMessage.textContent =
                "Check Out failed: " +
                (error.message || error);

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


        /* ========================= */
        /* NO ATTENDANCE */
        /* ========================= */

        if (snapshot.empty) {

            checkInTime.textContent =
                "--";

            checkOutTime.textContent =
                "--";

            attendanceStatus.textContent =
                "Not Checked In";

            checkInBtn.disabled =
                false;

            checkOutBtn.disabled =
                true;

            return;

        }


        /* ========================= */
        /* FIND TODAY'S RECORD */
        /* ========================= */

        let record = null;

        snapshot.forEach(
            doc => {

                const data =
                    doc.data();

                if (
                    data.status === "checked-in" &&
                    !data.checkOutTime
                ) {

                    record = data;

                }

            }
        );


        /* ========================= */
        /* ACTIVE CHECK-IN */
        /* ========================= */

        if (record) {

            checkInTime.textContent =
                record.checkInTime || "--";

            checkOutTime.textContent =
                "--";

            attendanceStatus.textContent =
                "Working";

            checkInBtn.disabled =
                true;

            checkOutBtn.disabled =
                false;

            return;

        }


        /* ========================= */
        /* COMPLETED */
        /* ========================= */

        const completedRecord =
            snapshot.docs
                .map(doc => doc.data())
                .find(
                    data =>
                        data.status === "completed"
                );


        if (completedRecord) {

            checkInTime.textContent =
                completedRecord.checkInTime || "--";

            checkOutTime.textContent =
                completedRecord.checkOutTime || "--";

            attendanceStatus.textContent =
                "Completed";

            checkInBtn.disabled =
                true;

            checkOutBtn.disabled =
                true;
                 attendanceMessage.textContent =
        "Today's Check In & Check Out are already completed.";

            return;

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

                    <td colspan="5">
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

                const checkInDistance =
                    record.checkInDistance !== undefined
                        ? record.checkInDistance + " m"
                        : "-";

                const checkOutDistance =
                    record.checkOutDistance !== undefined
                        ? record.checkOutDistance + " m"
                        : "-";

                const location =
                    `Check In: ${checkInDistance}<br>
                     Check Out: ${checkOutDistance}`;

                const status =
                    record.status === "completed"
                        ? "Completed"
                        : record.status === "checked-in"
                            ? "Checked In"
                            : record.status || "-";

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
                            ${location}
                        </td>

                        <td>
                            ${status}
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
