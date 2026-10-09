/* ========================= */
/* EMPLOYEE INFORMATION */
/* ========================= */

let employee = null;


/* ========================= */
/* OFFICE LOCATION */
/* ========================= */

const OFFICE_LAT = 22.369146;
const OFFICE_LNG = 91.832031;
const ALLOWED_RADIUS = 50;


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

const employeeDesignation =
    document.getElementById("employeeDesignation");

const employeeDepartment =
    document.getElementById("employeeDepartment");

const employeeOffice =
    document.getElementById("employeeOffice");

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
/* PROFILE MENU */
/* ========================= */

const profileMenuWrapper =
    document.getElementById("profileMenuWrapper");

const profileMenuBtn =
    document.getElementById("profileMenuBtn");

const profileDropdown =
    document.getElementById("profileDropdown");

const headerEmployeeName =
    document.getElementById("headerEmployeeName");

const headerEmployeeDesignation =
    document.getElementById("headerEmployeeDesignation");

const myProfileBtn =
    document.getElementById("myProfileBtn");

const attendanceReportBtn =
    document.getElementById("attendanceReportBtn");

const openAttendanceReportBtn =
    document.getElementById("openAttendanceReportBtn");

const openLeaveRequestBtn =
    document.getElementById("openLeaveRequestBtn");


/* ========================= */
/* PROFILE MODAL */
/* ========================= */

const myProfileModal =
    document.getElementById("myProfileModal");

const closeMyProfileBtn =
    document.getElementById("closeMyProfileBtn");


/* ========================= */
/* ATTENDANCE REPORT MODAL */
/* ========================= */

const attendanceReportModal =
    document.getElementById("attendanceReportModal");

const closeAttendanceReportBtn =
    document.getElementById("closeAttendanceReportBtn");

const attendanceFromDate =
    document.getElementById("attendanceFromDate");

const attendanceToDate =
    document.getElementById("attendanceToDate");

const filterAttendanceReportBtn =
    document.getElementById("filterAttendanceReportBtn");

const resetAttendanceReportBtn =
    document.getElementById("resetAttendanceReportBtn");

const attendanceReportBody =
    document.getElementById("attendanceReportBody");


/* ========================= */
/* LEAVE REQUEST */
/* ========================= */

const leaveRequestModal =
    document.getElementById("leaveRequestModal");

const closeLeaveRequestBtn =
    document.getElementById("closeLeaveRequestBtn");

const cancelLeaveRequestBtn =
    document.getElementById("cancelLeaveRequestBtn");

const leaveRequestForm =
    document.getElementById("leaveRequestForm");

const leaveTypeInput =
    document.getElementById("leaveTypeInput");

const leaveFromDateInput =
    document.getElementById("leaveFromDateInput");

const leaveToDateInput =
    document.getElementById("leaveToDateInput");

const leaveReasonInput =
    document.getElementById("leaveReasonInput");

const leaveRequestStatus =
    document.getElementById("leaveRequestStatus");

const employeeLeaveRequestsBody =
    document.getElementById("employeeLeaveRequestsBody");


/* ========================= */
/* DATE HELPERS */
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


function formatDateValue(value) {

    if (!value) {
        return "-";
    }

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function calculateLeaveDays(
    fromDate,
    toDate
) {

    const from =
        new Date(
            fromDate + "T00:00:00"
        );

    const to =
        new Date(
            toDate + "T00:00:00"
        );

    const difference =
        to.getTime() -
        from.getTime();

    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );
}


/* ========================= */
/* MODAL HELPERS */
/* ========================= */

function closeProfileDropdown() {

    if (profileDropdown) {

        profileDropdown.classList.remove(
            "active"
        );
    }
}


function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add(
        "active"
    );
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
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
        function (
            resolve,
            reject
        ) {

            if (
                !navigator.geolocation
            ) {

                reject(
                    new Error(
                        "Geolocation is not supported by this browser."
                    )
                );

                return;
            }

            navigator.geolocation
                .getCurrentPosition(

                    function (
                        position
                    ) {

                        resolve(
                            position
                        );
                    },

                    function (
                        error
                    ) {

                        let message =
                            "";

                        if (
                            error.code === 1
                        ) {

                            message =
                                "Location permission denied. Please allow location access for this website.";

                        } else if (
                            error.code === 2
                        ) {

                            message =
                                "Location unavailable. Please check your GPS/location service.";

                        } else if (
                            error.code === 3
                        ) {

                            message =
                                "Location request timed out. Please try again.";

                        } else {

                            message =
                                "Unable to get your location.";
                        }

                        reject(
                            new Error(
                                message
                            )
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
/* VERIFY OFFICE LOCATION */
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
            distance <=
            ALLOWED_RADIUS

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

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error.code,
                error.message
            );

            loginMessage.textContent =
                error.code +
                " — " +
                error.message;
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


            if (
                profileMenuWrapper
            ) {

                profileMenuWrapper.style.display =
                    "block";
            }


            try {

                const db =
                    window.firebaseDB;

                const collection =
                    window.firebaseCollection;

                const getDocs =
                    window.firebaseGetDocs;

                const query =
                    window.firebaseQuery;

                const where =
                    window.firebaseWhere;


                const employeeQuery =
                    query(

                        collection(
                            db,
                            "employees"
                        ),

                        where(
                            "email",
                            "==",
                            user.email
                        )

                    );


                const employeeSnapshot =
                    await getDocs(
                        employeeQuery
                    );


                const employeeDoc =
                    employeeSnapshot.docs[0];


                if (
                    !employeeDoc
                ) {

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


                /* ========================= */
                /* ACTIVE STATUS */
                /* ========================= */

                if (
                    employee.status !==
                    "active"
                ) {

                    alert(
                        "Your account is inactive. Please contact HR."
                    );

                    await window.firebaseSignOut(
                        window.firebaseAuth
                    );

                    return;
                }


                /* ========================= */
                /* DASHBOARD INFO */
                /* ========================= */

                employeeName.textContent =
                    employee.name ||
                    "Employee";

                employeeId.textContent =
                    employee.employeeId ||
                    "-";


                if (
                    employeeDesignation
                ) {

                    employeeDesignation.textContent =
                        employee.designation ||
                        "-";
                }


                if (
                    employeeDepartment
                ) {

                    employeeDepartment.textContent =
                        employee.department ||
                        "-";
                }


                if (
                    employeeOffice
                ) {

                    employeeOffice.textContent =
                        employee.office ||
                        "-";
                }


                /* ========================= */
                /* HEADER PROFILE */
                /* ========================= */

                if (
                    headerEmployeeName
                ) {

                    headerEmployeeName.textContent =
                        employee.name ||
                        "Employee";
                }


                if (
                    headerEmployeeDesignation
                ) {

                    headerEmployeeDesignation.textContent =
                        employee.designation ||
                        "My Account";
                }


                populateProfileModal();


                /* ========================= */
                /* ADMIN ROLE */
                /* ========================= */

                const roles =
                    employee.roles ||
                    [];


                if (
                    roles.includes(
                        "admin"
                    )
                ) {

                    adminAccess.style.display =
                        "block";

                } else {

                    adminAccess.style.display =
                        "none";

                }


                displayToday();

                await loadTodayAttendance();

                await loadAttendanceHistory();

                await loadEmployeeLeaveRequests();


            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Failed to load employee profile.\n\n" +
                    error.message
                );

            }


        } else {

            employee =
                null;

            loginPage.style.display =
                "flex";

            dashboardPage.classList.remove(
                "active"
            );


            if (
                profileMenuWrapper
            ) {

                profileMenuWrapper.style.display =
                    "none";
            }


            if (
                adminAccess
            ) {

                adminAccess.style.display =
                    "none";
            }


            closeProfileDropdown();

            closeModal(
                myProfileModal
            );

            closeModal(
                attendanceReportModal
            );

            closeModal(
                leaveRequestModal
            );

        }

    }

);


/* ========================= */
/* PROFILE DROPDOWN */
/* ========================= */

if (
    profileMenuBtn
) {

    profileMenuBtn.addEventListener(
        "click",
        function (
            event
        ) {

            event.stopPropagation();

            profileDropdown.classList.toggle(
                "active"
            );

        }
    );

}


document.addEventListener(
    "click",
    function (
        event
    ) {

        if (
            !profileMenuWrapper ||
            !profileDropdown
        ) {

            return;
        }


        if (
            !profileMenuWrapper.contains(
                event.target
            )
        ) {

            closeProfileDropdown();

        }

    }
);


/* ========================= */
/* MY PROFILE */
/* ========================= */

function populateProfileModal() {

    if (
        !employee
    ) {

        return;
    }


    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            element
        ) {

            element.textContent =
                value ||
                "-";

        }

    }


    setText(
        "profileEmployeeName",
        employee.name
    );


    setText(
        "profileEmployeeId",
        employee.employeeId
    );


    setText(
        "profileEmployeeEmail",
        employee.email
    );


    setText(
        "profileEmployeePhone",
        employee.phone
    );


    setText(
        "profileEmployeeDob",

        employee.dateOfBirth
            ? formatDateValue(
                employee.dateOfBirth
            )
            : "-"
    );


    setText(
        "profileEmployeeNid",
        employee.nid
    );


    setText(
        "profileEmergencyContact",
        employee.emergencyContact
    );


    setText(
        "profilePresentAddress",
        employee.presentAddress
    );


    setText(
        "profileDepartment",
        employee.department
    );


    setText(
        "profileDesignation",
        employee.designation
    );


    setText(
        "profileOffice",
        employee.office
    );


    setText(
        "profileJoiningDate",

        employee.joiningDate
            ? formatDateValue(
                employee.joiningDate
            )
            : "-"
    );


    setText(
        "profileEmploymentType",
        employee.employmentType
    );


    setText(
        "profileProbationEndDate",

        employee.probationEndDate
            ? formatDateValue(
                employee.probationEndDate
            )
            : "-"
    );


    setText(
        "profileEmployeeStatus",

        employee.status ===
        "active"
            ? "Active"
            : "Inactive"
    );

}


if (
    myProfileBtn
) {

    myProfileBtn.addEventListener(
        "click",
        function () {

            populateProfileModal();

            closeProfileDropdown();

            openModal(
                myProfileModal
            );

        }
    );

}


if (
    closeMyProfileBtn
) {

    closeMyProfileBtn.addEventListener(
        "click",
        function () {

            closeModal(
                myProfileModal
            );

        }
    );

}


/* ========================= */
/* LOGOUT */
/* ========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        closeProfileDropdown();

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
            "Checking today's attendance...";

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
                        "email",
                        "==",
                        employee.email
                    )

                );


            const snapshot =
                await window.firebaseGetDocs(
                    q
                );


            const todayKey =
                getTodayKey();


            let todayAttendance =
                null;


            snapshot.forEach(
                doc => {

                    const record =
                        doc.data();


                    if (
                        record.dateKey ===
                        todayKey
                    ) {

                        todayAttendance = {

                            id:
                                doc.id,

                            ...record

                        };

                    }

                }
            );


            if (
                todayAttendance
            ) {

                if (
                    todayAttendance.status ===
                    "completed"
                ) {

                    attendanceMessage.textContent =
                        "You have already completed today's attendance.";

                } else {

                    attendanceMessage.textContent =
                        "You are already checked in today.";

                }


                checkInBtn.disabled =
                    true;

                return;
            }


            attendanceMessage.textContent =
                "Checking your location...";


            const location =
                await verifyOfficeLocation();


            if (
                !location.withinOffice
            ) {

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


            await window.firebaseAddDoc(

                attendanceRef,

                {

                    employeeId:
                        employee.employeeId,

                    employeeName:
                        employee.name,

                    email:
                        employee.email,

                    uid:
                        window.firebaseAuth
                            .currentUser
                            .uid,

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


            checkOutBtn.disabled =
                false;


            await loadAttendanceHistory();


        } catch (error) {

            console.error(
                error
            );


            attendanceMessage.textContent =
                "Check In failed: " +
                (
                    error.message ||
                    error
                );


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

        checkOutBtn.disabled =
            true;


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


            const q =
                window.firebaseQuery(

                    attendanceRef,

                    window.firebaseWhere(
                        "email",
                        "==",
                        employee.email
                    ),

                    window.firebaseWhere(
                        "dateKey",
                        "==",
                        todayKey
                    )

                );


            const snapshot =
                await window.firebaseGetDocs(
                    q
                );


            if (
                snapshot.empty
            ) {

                attendanceMessage.textContent =
                    "You should Check In first.";


                checkOutBtn.disabled =
                    false;


                return;
            }


            let activeRecord =
                null;


            snapshot.forEach(
                doc => {

                    const record =
                        doc.data();


                    if (
                        record.status ===
                            "checked-in" &&
                        !record.checkOutTime
                    ) {

                        activeRecord = {

                            id:
                                doc.id,

                            ...record

                        };

                    }

                }
            );


            if (
                !activeRecord
            ) {

                attendanceMessage.textContent =
                    "Today's Check In & Check Out are already completed.";


                checkOutBtn.disabled =
                    true;


                return;
            }


            attendanceMessage.textContent =
                "Checking your location...";


            const location =
                await verifyOfficeLocation();


            if (
                !location.withinOffice
            ) {

                attendanceMessage.textContent =
                    `You are ${Math.round(location.distance)}m away from the office.`;

                checkOutBtn.disabled =
                    false;

                return;
            }


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


            const attendanceDoc =
                window.firebaseDoc(
                    window.firebaseDB,
                    "attendance",
                    activeRecord.id
                );


            await window.firebaseUpdateDoc(

                attendanceDoc,

                {

                    checkOutTime:
                        time,

                    checkOutLatitude:
                        location.latitude,

                    checkOutLongitude:
                        location.longitude,

                    checkOutAccuracy:
                        location.accuracy,

                    checkOutDistance:
                        Math.round(
                            location.distance
                        ),

                    status:
                        "completed"

                }

            );


            checkOutTime.textContent =
                time;


            attendanceStatus.textContent =
                "Completed";


            attendanceMessage.textContent =
                "Check Out successful.";


            checkOutBtn.disabled =
                true;


            await loadTodayAttendance();

            await loadAttendanceHistory();


        } catch (error) {

            console.error(
                error
            );


            attendanceMessage.textContent =
                "Check Out failed: " +
                (
                    error.message ||
                    error
                );


            checkOutBtn.disabled =
                false;

        }

    }
);


/* ========================= */
/* TODAY ATTENDANCE */
/* ========================= */

async function loadTodayAttendance() {

    if (
        !employee
    ) {

        return;
    }


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
                    "email",
                    "==",
                    employee.email
                ),

                window.firebaseWhere(
                    "dateKey",
                    "==",
                    getTodayKey()
                )

            );


        const snapshot =
            await window.firebaseGetDocs(
                q
            );


        if (
            snapshot.empty
        ) {

            checkInTime.textContent =
                "--";


            checkOutTime.textContent =
                "--";


            attendanceStatus.textContent =
                "Not Checked In";


            attendanceMessage.textContent =
                "";


            checkInBtn.disabled =
                false;


            checkOutBtn.disabled =
                true;


            return;
        }


        let record =
            null;


        snapshot.forEach(
            doc => {

                const data =
                    doc.data();


                if (
                    data.status ===
                        "checked-in" &&
                    !data.checkOutTime
                ) {

                    record =
                        data;

                }

            }
        );


        if (
            record
        ) {

            checkInTime.textContent =
                record.checkInTime ||
                "--";


            checkOutTime.textContent =
                "--";


            attendanceStatus.textContent =
                "Working";


            attendanceMessage.textContent =
                "";


            checkInBtn.disabled =
                true;


            checkOutBtn.disabled =
                false;


            return;
        }


        const completedRecord =
            snapshot.docs
                .map(
                    doc =>
                        doc.data()
                )
                .find(
                    data =>
                        data.status ===
                        "completed"
                );


        if (
            completedRecord
        ) {

            checkInTime.textContent =
                completedRecord.checkInTime ||
                "--";


            checkOutTime.textContent =
                completedRecord.checkOutTime ||
                "--";


            attendanceStatus.textContent =
                "Completed";


            checkInBtn.disabled =
                true;


            checkOutBtn.disabled =
                true;


            attendanceMessage.textContent =
                "Today's Check In & Check Out are already completed.";

        }


    } catch (error) {

        console.error(
            error
        );

    }

}


/* ========================= */
/* GET MY ATTENDANCE */
/* ========================= */

async function getMyAttendanceRecords() {

    if (
        !employee
    ) {

        return [];
    }


    const attendanceRef =
        window.firebaseCollection(
            window.firebaseDB,
            "attendance"
        );


    const q =
        window.firebaseQuery(

            attendanceRef,

            window.firebaseWhere(
                "email",
                "==",
                employee.email
            )

        );


    const snapshot =
        await window.firebaseGetDocs(
            q
        );


    const records =
        snapshot.docs.map(
            doc => ({

                id:
                    doc.id,

                ...doc.data()

            })
        );


    records.sort(
        (
            a,
            b
        ) => {

            return (
                b.dateKey ||
                ""
            ).localeCompare(
                a.dateKey ||
                ""
            );

        }
    );


    return records;

}


/* ========================= */
/* ATTENDANCE HISTORY */
/* ========================= */

async function loadAttendanceHistory() {

    attendanceHistory.innerHTML =
        "";


    try {

        const records =
            await getMyAttendanceRecords();


        if (
            records.length === 0
        ) {

            attendanceHistory.innerHTML = `
                <tr>
                    <td colspan="5">
                        No attendance found.
                    </td>
                </tr>
            `;


            return;
        }


        records.forEach(
            record => {

                const checkInDistance =
                    record.checkInDistance !==
                    undefined

                        ? record.checkInDistance +
                          " m"

                        : "-";


                const checkOutDistance =
                    record.checkOutDistance !==
                    undefined

                        ? record.checkOutDistance +
                          " m"

                        : "-";


                const location =
                    `Check In: ${checkInDistance}<br>
                     Check Out: ${checkOutDistance}`;


                const status =
                    record.status ===
                    "completed"

                        ? "Completed"

                        : record.status ===
                          "checked-in"

                            ? "Checked In"

                            : record.status ||
                              "-";


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

        console.error(
            "ATTENDANCE HISTORY ERROR:",
            error
        );

    }

}


/* ========================= */
/* ATTENDANCE REPORT */
/* ========================= */

async function openAttendanceReport() {

    closeProfileDropdown();


    openModal(
        attendanceReportModal
    );


    await renderAttendanceReport();

}


/* ========================= */
/* RENDER ATTENDANCE REPORT */
/* ========================= */

async function renderAttendanceReport() {

    if (
        !attendanceReportBody
    ) {

        return;
    }


    attendanceReportBody.innerHTML = `
        <tr>
            <td colspan="6">
                Loading attendance...
            </td>
        </tr>
    `;


    try {

        const records =
            await getMyAttendanceRecords();


        const from =
            attendanceFromDate

                ? attendanceFromDate.value

                : "";


        const to =
            attendanceToDate

                ? attendanceToDate.value

                : "";


        const filteredRecords =
            records.filter(
                record => {

                    const dateKey =
                        record.dateKey ||
                        "";


                    if (
                        from &&
                        dateKey < from
                    ) {

                        return false;
                    }


                    if (
                        to &&
                        dateKey > to
                    ) {

                        return false;
                    }


                    return true;

                }
            );


        if (
            filteredRecords.length ===
            0
        ) {

            attendanceReportBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No attendance data found.
                    </td>
                </tr>
            `;


            return;
        }


        attendanceReportBody.innerHTML =
            "";


        filteredRecords.forEach(
            record => {

                const checkInDistance =
                    record.checkInDistance !==
                    undefined

                        ? record.checkInDistance +
                          " m"

                        : "-";


                const checkOutDistance =
                    record.checkOutDistance !==
                    undefined

                        ? record.checkOutDistance +
                          " m"

                        : "-";


                const status =
                    record.status ===
                    "completed"

                        ? "Completed"

                        : record.status ===
                          "checked-in"

                            ? "Checked In"

                            : record.status ||
                              "-";


                attendanceReportBody.innerHTML += `
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
                            ${checkInDistance}
                        </td>

                        <td>
                            ${checkOutDistance}
                        </td>

                        <td>
                            ${status}
                        </td>

                    </tr>
                `;

            }
        );


    } catch (error) {

        console.error(
            "ATTENDANCE REPORT ERROR:",
            error
        );


        attendanceReportBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load attendance report.
                </td>
            </tr>
        `;

    }

}


/* ========================= */
/* ATTENDANCE REPORT BUTTONS */
/* ========================= */

if (
    attendanceReportBtn
) {

    attendanceReportBtn.addEventListener(
        "click",
        openAttendanceReport
    );

}


if (
    openAttendanceReportBtn
) {

    openAttendanceReportBtn.addEventListener(
        "click",
        openAttendanceReport
    );

}


if (
    closeAttendanceReportBtn
) {

    closeAttendanceReportBtn.addEventListener(
        "click",
        function () {

            closeModal(
                attendanceReportModal
            );

        }
    );

}


if (
    filterAttendanceReportBtn
) {

    filterAttendanceReportBtn.addEventListener(
        "click",
        renderAttendanceReport
    );

}


if (
    resetAttendanceReportBtn
) {

    resetAttendanceReportBtn.addEventListener(
        "click",
        async function () {

            attendanceFromDate.value =
                "";


            attendanceToDate.value =
                "";


            await renderAttendanceReport();

        }
    );

}

/* ========================= */
/* LEAVE REQUEST MODAL */
/* ========================= */

if (
    openLeaveRequestBtn
) {

    openLeaveRequestBtn.addEventListener(
        "click",
        function () {

            if (
                leaveRequestStatus
            ) {

                leaveRequestStatus.textContent =
                    "";
            }

            openModal(
                leaveRequestModal
            );
        }
    );
}


if (
    closeLeaveRequestBtn
) {

    closeLeaveRequestBtn.addEventListener(
        "click",
        function () {

            closeModal(
                leaveRequestModal
            );
        }
    );
}


if (
    cancelLeaveRequestBtn
) {

    cancelLeaveRequestBtn.addEventListener(
        "click",
        function () {

            closeModal(
                leaveRequestModal
            );
        }
    );
}


/* ========================= */
/* SUBMIT LEAVE REQUEST */
/* ========================= */

if (
    leaveRequestForm
) {

    leaveRequestForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();


            if (
                !employee ||
                !window.firebaseAuth.currentUser
            ) {

                return;
            }


            const leaveType =
                leaveTypeInput.value;


            const fromDate =
                leaveFromDateInput.value;


            const toDate =
                leaveToDateInput.value;


            const reason =
                leaveReasonInput.value
                    .trim();


            if (
                !leaveType ||
                !fromDate ||
                !toDate ||
                !reason
            ) {

                leaveRequestStatus.textContent =
                    "Please fill in all required information.";

                return;
            }


            if (
                toDate < fromDate
            ) {

                leaveRequestStatus.textContent =
                    "To Date cannot be earlier than From Date.";

                return;
            }


            const totalDays =
                calculateLeaveDays(
                    fromDate,
                    toDate
                );


            leaveRequestStatus.textContent =
                "Submitting leave request...";


            try {

                const leaveRef =
                    window.firebaseCollection(
                        window.firebaseDB,
                        "leaveRequests"
                    );


                await window.firebaseAddDoc(

                    leaveRef,

                    {

                        uid:
                            window.firebaseAuth
                                .currentUser
                                .uid,

                        employeeId:
                            employee.employeeId,

                        employeeName:
                            employee.name,

                        email:
                            employee.email,

                        department:
                            employee.department ||
                            "",

                        designation:
                            employee.designation ||
                            "",

                        office:
                            employee.office ||
                            "",

                        leaveType:
                            leaveType,

                        fromDate:
                            fromDate,

                        toDate:
                            toDate,

                        totalDays:
                            totalDays,

                        reason:
                            reason,

                        status:
                            "pending",

                        requestedAt:
                            new Date()
                                .toISOString()

                    }

                );


                leaveRequestStatus.textContent =
                    "Leave request submitted successfully.";


                leaveRequestForm.reset();


                await loadEmployeeLeaveRequests();


                setTimeout(
                    function () {

                        closeModal(
                            leaveRequestModal
                        );

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "LEAVE REQUEST ERROR:",
                    error
                );


                leaveRequestStatus.textContent =
                    "Failed to submit leave request: " +
                    (
                        error.message ||
                        error
                    );

            }

        }
    );

}


/* ========================= */
/* MY LEAVE REQUESTS */
/* ========================= */

async function loadEmployeeLeaveRequests() {

    if (
        !employeeLeaveRequestsBody ||
        !employee ||
        !window.firebaseAuth.currentUser
    ) {

        return;
    }


    employeeLeaveRequestsBody.innerHTML = `
        <tr>
            <td colspan="5">
                Loading leave requests...
            </td>
        </tr>
    `;


    try {

        const leaveRef =
            window.firebaseCollection(
                window.firebaseDB,
                "leaveRequests"
            );


        const q =
            window.firebaseQuery(

                leaveRef,

                window.firebaseWhere(
                    "uid",
                    "==",
                    window.firebaseAuth
                        .currentUser
                        .uid
                )

            );


        const snapshot =
            await window.firebaseGetDocs(
                q
            );


        if (
            snapshot.empty
        ) {

            employeeLeaveRequestsBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No leave requests found.
                    </td>
                </tr>
            `;


            return;
        }


        const requests =
            snapshot.docs.map(
                doc => ({

                    id:
                        doc.id,

                    ...doc.data()

                })
            );


        requests.sort(
            (
                a,
                b
            ) => {

                return (
                    b.requestedAt ||
                    ""
                ).localeCompare(
                    a.requestedAt ||
                    ""
                );

            }
        );


        employeeLeaveRequestsBody.innerHTML =
            "";


        requests.forEach(
            request => {

                const status =
                    request.status ===
                    "approved"

                        ? "Approved"

                        : request.status ===
                          "rejected"

                            ? "Rejected"

                            : "Pending";


                employeeLeaveRequestsBody.innerHTML += `
                    <tr>

                        <td>
                            ${request.leaveType || "-"}
                        </td>

                        <td>
                            ${formatDateValue(request.fromDate)}
                        </td>

                        <td>
                            ${formatDateValue(request.toDate)}
                        </td>

                        <td>
                            ${request.totalDays || "-"}
                        </td>

                        <td>
                            ${status}
                        </td>

                    </tr>
                `;

            }
        );


    } catch (error) {

        console.error(
            "LOAD LEAVE REQUESTS ERROR:",
            error
        );


        employeeLeaveRequestsBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Leave system setup is not completed yet.
                </td>
            </tr>
        `;

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

    }
);


/* ========================= */
/* MODAL BACKDROP CLOSE */
/* ========================= */

[
    myProfileModal,
    attendanceReportModal,
    leaveRequestModal

].forEach(
    modal => {

        if (
            !modal
        ) {

            return;
        }


        modal.addEventListener(
            "click",
            function (
                event
            ) {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal(
                        modal
                    );

                }

            }
        );

    }
);
