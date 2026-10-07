// ========================================
// DAZZLE ATTENDANCE - ADMIN PANEL
// ========================================


// ========================================
// ELEMENTS
// ========================================

const homeBtn =
    document.getElementById("homeBtn");

const createEmployeeBtn =
    document.getElementById("createEmployeeBtn");

const employeesBtn =
    document.getElementById("employeesBtn");

const homePage =
    document.getElementById("homePage");

const createEmployeePage =
    document.getElementById("createEmployeePage");

const employeesPage =
    document.getElementById("employeesPage");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const employeesTableBody =
    document.getElementById("employeesTableBody");

const totalEmployees =
    document.getElementById("totalEmployees");

const presentEmployees =
    document.getElementById("presentEmployees");

const checkedInEmployees =
    document.getElementById("checkedInEmployees");

const checkedOutEmployees =
    document.getElementById("checkedOutEmployees");

const filterDate =
    document.getElementById("filterDate");

const filterEmployee =
    document.getElementById("filterEmployee");

const filterStatus =
    document.getElementById("filterStatus");

const filterBtn =
    document.getElementById("filterBtn");

const resetBtn =
    document.getElementById("resetBtn");

const adminDate =
    document.getElementById("adminDate");

const employeeForm =
    document.getElementById("employeeForm");

const employeeFormStatus =
    document.getElementById("employeeFormStatus");

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");


// ========================================
// EMPLOYEE MODAL ELEMENTS
// ========================================

const employeeModal =
    document.getElementById("employeeModal");

const closeEmployeeModal =
    document.getElementById("closeEmployeeModal");

const deleteEmployeeBtn =
    document.getElementById("deleteEmployeeBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const saveEmployeeBtn =
    document.getElementById("saveEmployeeBtn");

const employeeEditForm =
    document.getElementById("employeeEditForm");


const modalEmployeeName =
    document.getElementById("modalEmployeeName");

const modalEmployeeId =
    document.getElementById("modalEmployeeId");

const modalName =
    document.getElementById("modalName");

const modalId =
    document.getElementById("modalId");

const modalEmail =
    document.getElementById("modalEmail");

const modalDepartment =
    document.getElementById("modalDepartment");

const modalDesignation =
    document.getElementById("modalDesignation");

const modalOffice =
    document.getElementById("modalOffice");

const modalJoiningDate =
    document.getElementById("modalJoiningDate");

const modalStatus =
    document.getElementById("modalStatus");


const editEmployeeName =
    document.getElementById("editEmployeeName");

const editEmployeeId =
    document.getElementById("editEmployeeId");

const editEmployeeEmail =
    document.getElementById("editEmployeeEmail");

const editDepartment =
    document.getElementById("editDepartment");

const editDesignation =
    document.getElementById("editDesignation");

const editOffice =
    document.getElementById("editOffice");

const editJoiningDate =
    document.getElementById("editJoiningDate");

const editStatus =
    document.getElementById("editStatus");


// ========================================
// DATA
// ========================================

let employees = [];

let selectedEmployeeId = null;

let editMode = false;


// ========================================
// DATE
// ========================================

function getTodayDate() {

    const now = new Date();

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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {

        const parts =
            dateString.split("/");

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        const date =
            new Date(
                `${year}-${month}-${day}T00:00:00`
            );

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    return dateString;
}


// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageName) {

    homePage.classList.remove(
        "active-page"
    );

    createEmployeePage.classList.remove(
        "active-page"
    );

    employeesPage.classList.remove(
        "active-page"
    );

    homeBtn.classList.remove(
        "active"
    );

    createEmployeeBtn.classList.remove(
        "active"
    );

    employeesBtn.classList.remove(
        "active"
    );


    if (pageName === "home") {

        homePage.classList.add(
            "active-page"
        );

        homeBtn.classList.add(
            "active"
        );

        loadAttendance();

    }


    if (pageName === "createEmployee") {

        createEmployeePage.classList.add(
            "active-page"
        );

        createEmployeeBtn.classList.add(
            "active"
        );

    }


    if (pageName === "employees") {

        employeesPage.classList.add(
            "active-page"
        );

        employeesBtn.classList.add(
            "active"
        );

        loadEmployees();

    }

}


// ========================================
// SIDEBAR
// ========================================

homeBtn.addEventListener(
    "click",
    function () {

        showPage("home");

    }
);


createEmployeeBtn.addEventListener(
    "click",
    function () {

        showPage("createEmployee");

    }
);


employeesBtn.addEventListener(
    "click",
    function () {

        showPage("employees");

    }
);


// ========================================
// LOAD EMPLOYEES
// ========================================

async function loadEmployees() {

    employeesTableBody.innerHTML = "";


    try {

        const db =
            window.adminDB;

        const collection =
            window.adminCollection;

        const getDocs =
            window.adminGetDocs;


        const employeesRef =
            collection(
                db,
                "employees"
            );


        const snapshot =
            await getDocs(
                employeesRef
            );


        employees = [];


        snapshot.forEach(
            function (documentSnapshot) {

                employees.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        renderEmployees();


    } catch (error) {

        console.error(error);


        employeesTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Failed to load employees.
                </td>
            </tr>
        `;

    }

}


// ========================================
// RENDER EMPLOYEES
// ========================================

function renderEmployees() {

    if (employees.length === 0) {

        employeesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    style="text-align:center; padding:30px;"
                >
                    No employees found.
                </td>
            </tr>
        `;

        return;

    }


    employeesTableBody.innerHTML = "";


    employees.forEach(
        function (employee) {

            const row =
                document.createElement("tr");


            const status =
                employee.status ||
                "active";


            const statusText =
                status === "active"
                    ? "Active"
                    : "Inactive";


            row.innerHTML = `

                <td>
                    ${employee.name || "-"}
                </td>

                <td>
                    ${employee.employeeId || "-"}
                </td>

                <td>
                    ${employee.department || "-"}
                </td>

                <td>
                    ${employee.designation || "-"}
                </td>

                <td>
                    ${employee.office || "-"}
                </td>

                <td>
                    ${formatDate(
                        employee.joiningDate
                    )}
                </td>

                <td>
                    ${statusText}
                </td>

                <td>

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="view-employee-btn"
                            data-id="${employee.firestoreId}"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="edit-employee-btn"
                            data-id="${employee.firestoreId}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="deactivate-employee-btn"
                            data-id="${employee.firestoreId}"
                        >
                            ${
                                status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>

                    </div>

                </td>

            `;


            employeesTableBody.appendChild(
                row
            );

        }
    );


    attachEmployeeActionEvents();

}


// ========================================
// EMPLOYEE ACTION EVENTS
// ========================================

function attachEmployeeActionEvents() {

    const viewButtons =
        document.querySelectorAll(
            ".view-employee-btn"
        );

    const editButtons =
        document.querySelectorAll(
            ".edit-employee-btn"
        );

    const deactivateButtons =
        document.querySelectorAll(
            ".deactivate-employee-btn"
        );


    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openEmployeeModal(
                        button.dataset.id,
                        false
                    );

                }
            );

        }
    );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openEmployeeModal(
                        button.dataset.id,
                        true
                    );

                }
            );

        }
    );


    deactivateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    toggleEmployeeStatus(
                        button.dataset.id
                    );

                }
            );

        }
    );

}


// ========================================
// OPEN EMPLOYEE MODAL
// ========================================

function openEmployeeModal(
    firestoreId,
    startEditing
) {

    const employee =
        employees.find(
            function (item) {

                return (
                    item.firestoreId ===
                    firestoreId
                );

            }
        );


    if (!employee) {

        alert(
            "Employee not found."
        );

        return;

    }


    selectedEmployeeId =
        firestoreId;


    modalEmployeeName.textContent =
        employee.name || "Employee";


    modalEmployeeId.textContent =
        employee.employeeId || "-";


    modalName.textContent =
        employee.name || "-";

    modalId.textContent =
        employee.employeeId || "-";

    modalEmail.textContent =
        employee.email || "-";

    modalDepartment.textContent =
        employee.department || "-";

    modalDesignation.textContent =
        employee.designation || "-";

    modalOffice.textContent =
        employee.office || "-";

    modalJoiningDate.textContent =
        formatDate(
            employee.joiningDate
        );

    modalStatus.textContent =
        employee.status === "active"
            ? "Active"
            : "Inactive";


    editEmployeeName.value =
        employee.name || "";

    editEmployeeId.value =
        employee.employeeId || "";

    editEmployeeEmail.value =
        employee.email || "";

    editDepartment.value =
        employee.department || "";

    editDesignation.value =
        employee.designation || "";

    editOffice.value =
        employee.office || "";

    editJoiningDate.value =
        employee.joiningDate || "";

    editStatus.value =
        employee.status || "active";


    setEditMode(
        startEditing
    );


    employeeModal.classList.add(
        "active"
    );

}


// ========================================
// EDIT MODE
// ========================================

function setEditMode(
    enabled
) {

    editMode =
        enabled;


    if (enabled) {

        employeeEditForm.classList.add(
            "active"
        );

        saveEmployeeBtn.style.display =
            "block";

        cancelEditBtn.textContent =
            "Cancel";

    } else {

        employeeEditForm.classList.remove(
            "active"
        );

        saveEmployeeBtn.style.display =
            "none";

        cancelEditBtn.textContent =
            "Close";

    }

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    employeeModal.classList.remove(
        "active"
    );

    selectedEmployeeId =
        null;

    editMode =
        false;

}


closeEmployeeModal.addEventListener(
    "click",
    closeModal
);


cancelEditBtn.addEventListener(
    "click",
    function () {

        if (editMode) {

            setEditMode(
                false
            );

            return;

        }

        closeModal();

    }
);


// Close when clicking outside modal

employeeModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            employeeModal
        ) {

            closeModal();

        }

    }
);


// ========================================
// SAVE EMPLOYEE
// ========================================

saveEmployeeBtn.addEventListener(
    "click",
    async function () {

        if (!selectedEmployeeId) {
            return;
        }


        const name =
            editEmployeeName.value.trim();

        const email =
            editEmployeeEmail.value.trim();

        const department =
            editDepartment.value.trim();

        const designation =
            editDesignation.value.trim();

        const office =
            editOffice.value.trim();

        const joiningDate =
            editJoiningDate.value;

        const status =
            editStatus.value;


        if (!name) {

            alert(
                "Employee name is required."
            );

            return;

        }


        try {

            const db =
                window.adminDB;

            const doc =
                window.adminDoc;

            const updateDoc =
                window.adminUpdateDoc;
const newEmployeeId = editEmployeeId.value.trim();

if (!newEmployeeId) {
    alert("Employee ID is required.");
    return;
}

const employeeSnapshot =
    await window.adminGetDocs(
        window.adminCollection(
            db,
            "employees"
        )
    );

const duplicateEmployee = employeeSnapshot.docs.find(
    employeeDoc =>
        employeeDoc.id !== selectedEmployeeId &&
        employeeDoc.data().employeeId === newEmployeeId
);

if (duplicateEmployee) {
    alert("This Employee ID is already assigned to another employee.");
    return;
}

            await updateDoc(

    doc(
        db,
        "employees",
        selectedEmployeeId
    ),

    {

        name:
            name,

       employeeId: newEmployeeId,

        email:
            email,

        department:
            department,

        designation:
            designation,

        office:
            office,

        joiningDate:
            joiningDate,

        status:
            status

    }

);


            alert(
                "Employee updated successfully."
            );


            closeModal();

            await loadEmployees();


        } catch (error) {

            console.error(error);


            alert(
                "Failed to update employee.\n\n" +
                error.message
            );

        }

    }
);


// ========================================
// DELETE EMPLOYEE
// ========================================

deleteEmployeeBtn.addEventListener(
    "click",
    async function () {

        if (!selectedEmployeeId) {
            return;
        }


        const employee =
            employees.find(
                function (item) {

                    return (
                        item.firestoreId ===
                        selectedEmployeeId
                    );

                }
            );


        if (!employee) {

            alert(
                "Employee not found."
            );

            return;

        }


        const confirmed =
            confirm(

                "PERMANENT DELETE\n\n" +

                "Are you sure you want to permanently delete:\n\n" +

                (
                    employee.name ||
                    "this employee"
                ) +

                "\n\n" +

                "This employee profile will be permanently removed from the system.\n\n" +

                "This action cannot be undone."

            );


        if (!confirmed) {
            return;
        }


        try {

            const db =
                window.adminDB;

            const doc =
                window.adminDoc;

            const deleteDoc =
                window.adminDeleteDoc;


            await deleteDoc(

                doc(
                    db,
                    "employees",
                    selectedEmployeeId
                )

            );


            alert(
                "Employee deleted permanently."
            );


            closeModal();

            await loadEmployees();

            updateAttendanceSummary(
                await getAttendanceRecords()
            );


        } catch (error) {

            console.error(error);


            alert(
                "Failed to delete employee.\n\n" +
                error.message
            );

        }

    }
);


// ========================================
// ACTIVATE / DEACTIVATE
// ========================================

async function toggleEmployeeStatus(
    firestoreId
) {

    const employee =
        employees.find(
            function (item) {

                return (
                    item.firestoreId ===
                    firestoreId
                );

            }
        );


    if (!employee) {

        alert(
            "Employee not found."
        );

        return;

    }


    const currentStatus =
        employee.status || "active";


    const newStatus =
        currentStatus === "active"
            ? "inactive"
            : "active";


    const actionText =
        newStatus === "inactive"
            ? "deactivate"
            : "activate";


    const confirmed =
        confirm(

            "Are you sure you want to " +
            actionText +
            " " +
            (
                employee.name ||
                "this employee"
            ) +
            "?"

        );


    if (!confirmed) {
        return;
    }


    try {

        const db =
            window.adminDB;

        const doc =
            window.adminDoc;

        const updateDoc =
            window.adminUpdateDoc;


        await updateDoc(

            doc(
                db,
                "employees",
                firestoreId
            ),

            {
                status:
                    newStatus
            }

        );


        alert(
            "Employee " +
            (
                newStatus === "active"
                    ? "activated"
                    : "deactivated"
            ) +
            " successfully."
        );


        loadEmployees();


    } catch (error) {

        console.error(error);


        alert(
            "Failed to change employee status.\n\n" +
            error.message
        );

    }

}


// ========================================
// GET ATTENDANCE RECORDS
// ========================================

async function getAttendanceRecords() {

    const db =
        window.adminDB;

    const collection =
        window.adminCollection;

    const getDocs =
        window.adminGetDocs;


    const snapshot =
        await getDocs(
            collection(
                db,
                "attendance"
            )
        );


    const records = [];


    snapshot.forEach(
        function (documentSnapshot) {

            records.push(
                documentSnapshot.data()
            );

        }
    );


    return records;

}


// ========================================
// LOAD ATTENDANCE
// ========================================

async function loadAttendance() {

    try {

        const records =
            await getAttendanceRecords();


        renderAttendance(
            records
        );


        updateAttendanceSummary(
            records
        );


    } catch (error) {

        console.error(error);


        attendanceTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >
                    Failed to load attendance.
                </td>
            </tr>
        `;

    }

}


// ========================================
// RENDER ATTENDANCE
// ========================================

function renderAttendance(
    records
) {

    if (records.length === 0) {

        attendanceTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >
                    No attendance records found.
                </td>
            </tr>
        `;

        return;

    }


    attendanceTableBody.innerHTML = "";


    records.forEach(
        function (record) {

            const employee =
                employees.find(
                    function (item) {

                        return (
                            item.employeeId ===
                            record.employeeId
                        );

                    }
                );


            const employeeName =
                record.employeeName ||
                (
                    employee
                        ? employee.name
                        : "-"
                );


            const employeeId =
                record.employeeId ||
                "-";


            const date =
                record.date ||
                "-";


            const checkIn =
                record.checkInTime ||
                record.checkIn ||
                "-";


            const checkOut =
                record.checkOutTime ||
                record.checkOut ||
                "-";


    const checkInDistance =
    record.checkInDistance !== undefined
        ? `${record.checkInDistance}m`
        : "-";

const checkOutDistance =
    record.checkOutDistance !== undefined
        ? `${record.checkOutDistance}m`
        : "-";

const checkInAccuracy =
    record.checkInAccuracy !== undefined
        ? `${Math.round(record.checkInAccuracy)}m`
        : "-";

const checkOutAccuracy =
    record.checkOutAccuracy !== undefined
        ? `${Math.round(record.checkOutAccuracy)}m`
        : "-";

const location =
    `Check In: ${checkInDistance}<br>
     Check Out: ${checkOutDistance}<br>
     Accuracy: ${checkInAccuracy} / ${checkOutAccuracy}`;


            const status =
                record.status ||
                "-";


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${employeeName}
                </td>

                <td>
                    ${employeeId}
                </td>

                <td>
                    ${formatDate(date)}
                </td>

                <td>
                    ${checkIn}
                </td>

                <td>
                    ${checkOut}
                </td>

                <td>
                    ${location}
                </td>

                <td>
                    ${status}
                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// SUMMARY
// ========================================

function updateAttendanceSummary(
    records
) {

    const today =
        getTodayDate();


    const todayRecords =
        records.filter(
            function (record) {

                return (
                    record.date ===
                    today
                );

            }
        );


    const presentSet =
        new Set();

    const checkedInSet =
        new Set();

    const checkedOutSet =
        new Set();


    todayRecords.forEach(
        function (record) {

            if (record.employeeId) {

                presentSet.add(
                    record.employeeId
                );

            }


            if (
                record.checkInTime ||
                record.checkIn
            ) {

                checkedInSet.add(
                    record.employeeId
                );

            }


            if (
                record.checkOutTime ||
                record.checkOut
            ) {

                checkedOutSet.add(
                    record.employeeId
                );

            }

        }
    );


    totalEmployees.textContent =
        employees.length;

    presentEmployees.textContent =
        presentSet.size;

    checkedInEmployees.textContent =
        checkedInSet.size;

    checkedOutEmployees.textContent =
        checkedOutSet.size;

}


// ========================================
// FILTER
// ========================================

filterBtn.addEventListener(
    "click",
    async function () {

        try {

            let records =
                await getAttendanceRecords();


            const selectedDate =
                filterDate.value;


            const selectedEmployee =
                filterEmployee.value
                    .trim()
                    .toLowerCase();


            const selectedStatus =
                filterStatus.value;


            records =
                records.filter(
                    function (record) {

                        if (
                            selectedDate &&
                            record.date !==
                            selectedDate
                        ) {

                            return false;

                        }


                        if (
                            selectedEmployee
                        ) {

                            const name =
                                (
                                    record.employeeName ||
                                    ""
                                ).toLowerCase();


                            const id =
                                (
                                    record.employeeId ||
                                    ""
                                ).toLowerCase();


                            if (
                                !name.includes(
                                    selectedEmployee
                                ) &&
                                !id.includes(
                                    selectedEmployee
                                )
                            ) {

                                return false;

                            }

                        }


                        if (
                            selectedStatus !==
                            "all"
                        ) {

                            if (
                                record.status !==
                                selectedStatus
                            ) {

                                return false;

                            }

                        }


                        return true;

                    }
                );


            renderAttendance(
                records
            );


        } catch (error) {

            console.error(error);

        }

    }
);


// ========================================
// RESET FILTER
// ========================================

resetBtn.addEventListener(
    "click",
    function () {

        filterDate.value = "";

        filterEmployee.value = "";

        filterStatus.value = "all";

        loadAttendance();

    }
);


// ========================================
// CREATE EMPLOYEE
// ========================================

employeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("employeeNameInput")
                .value
                .trim();

        const employeeId =
            document
                .getElementById("employeeIdInput")
                .value
                .trim();

        const email =
            document
                .getElementById("employeeEmailInput")
                .value
                .trim();

        const password =
            document
                .getElementById("employeePasswordInput")
                .value;

        const department =
            document
                .getElementById("departmentInput")
                .value
                .trim();

        const designation =
            document
                .getElementById("designationInput")
                .value
                .trim();

        const office =
            document
                .getElementById("officeInput")
                .value
                .trim();

        const joiningDate =
            document
                .getElementById("joiningDateInput")
                .value;

        const statusElement =
            document.querySelector(
                'input[name="employeeStatus"]:checked'
            );

        const status =
            statusElement
                ? statusElement.value
                : "active";

        // ========================================
        // VALIDATION
        // ========================================

        if (
            !name ||
            !employeeId ||
            !email ||
            !password ||
            !department ||
            !designation ||
            !office ||
            !joiningDate
        ) {

            alert(
                "Please fill in all required employee information."
            );

            return;
        }

        if (password.length < 6) {

            alert(
                "Employee password must be at least 6 characters."
            );

            return;
        }

        employeeFormStatus.textContent =
            "Creating employee...";

        employeeFormStatus.style.color = "";

        try {

            const db =
                window.adminDB;

            const collection =
                window.adminCollection;

            const addDoc =
                window.adminAddDoc;

            const getDocs =
                window.adminGetDocs;

            // ========================================
            // CHECK DUPLICATE EMPLOYEE ID
            // ========================================

            const employeeSnapshot =
                await getDocs(
                    collection(
                        db,
                        "employees"
                    )
                );

            const duplicateEmployee =
                employeeSnapshot.docs.find(
                    function (employeeDoc) {

                        return (
                            employeeDoc.data().employeeId ===
                            employeeId
                        );

                    }
                );

            if (duplicateEmployee) {

                employeeFormStatus.textContent =
                    "Employee ID already exists.";

                employeeFormStatus.style.color =
                    "red";

                alert(
                    "This Employee ID is already assigned to another employee."
                );

                return;
            }

            // ========================================
            // CREATE FIREBASE AUTH ACCOUNT
            // ========================================

            employeeFormStatus.textContent =
                "Creating employee login account...";

            const employeeAuth =
                window.employeeAuth;

            const createUser =
                window.adminCreateUser;

            const userCredential =
                await createUser(
                    employeeAuth,
                    email,
                    password
                );

            const user =
                userCredential.user;

            // ========================================
            // CREATE FIRESTORE EMPLOYEE PROFILE
            // ========================================

            employeeFormStatus.textContent =
                "Saving employee profile...";

            await addDoc(
                collection(
                    db,
                    "employees"
                ),
                {
                    uid:
                        user.uid,

                    name:
                        name,

                    employeeId:
                        employeeId,

                    email:
                        email,

                    department:
                        department,

                    designation:
                        designation,

                    office:
                        office,

                    joiningDate:
                        joiningDate,

                    status:
                        status,

                    roles:
                        ["employee"],

                    createdAt:
                        new Date().toISOString()
                }
            );

            // ========================================
            // SUCCESS
            // ========================================

            employeeFormStatus.textContent =
                "Employee created successfully.";

            employeeFormStatus.style.color =
                "green";

            alert(
                "Employee account and profile created successfully."
            );

            employeeForm.reset();

            const activeRadio =
                document.querySelector(
                    'input[name="employeeStatus"][value="active"]'
                );

            if (activeRadio) {

                activeRadio.checked =
                    true;

            }

        } catch (error) {

            console.error(
                "CREATE EMPLOYEE ERROR:",
                error
            );

            let message =
                error.message;

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "This email address is already registered in Firebase Authentication.";

            }

            if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email address.";

            }

            if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password must be at least 6 characters.";

            }

            employeeFormStatus.textContent =
                "Failed to create employee: " +
                message;

            employeeFormStatus.style.color =
                "red";

            alert(
                "Failed to create employee.\n\n" +
                message
            );

        }

    }
);


// ========================================
// LOGOUT
// ========================================

adminLogoutBtn.addEventListener(
    "click",
    async function () {

        try {

            await window.adminSignOut(
                window.adminAuth
            );


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(error);

        }

    }
);


// ========================================
// ADMIN DATE
// ========================================

adminDate.textContent =
    new Date().toLocaleDateString(
        "en-GB",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );


// ========================================
// START
// ========================================

loadEmployees();

loadAttendance();

showPage("home");

/* ========================= */
/* ADMIN ROLE SECURITY */
/* ========================= */

window.adminOnAuthStateChanged(
    window.adminAuth,
    async function (user) {

        if (!user) {

            window.location.href =
                "index.html";

            return;
        }


        try {

            const db =
                window.adminDB;

            const collection =
                window.adminCollection;

            const getDocs =
                window.adminGetDocs;


            const employeeSnapshot =
                await getDocs(
                    collection(
                        db,
                        "employees"
                    )
                );


            const employeeDoc =
                employeeSnapshot.docs.find(
                    function (doc) {

                        return (
                            doc.data().email ===
                            user.email
                        );

                    }
                );


            if (!employeeDoc) {

                alert(
                    "Access denied."
                );

                await window.adminSignOut(
                    window.adminAuth
                );

                window.location.href =
                    "index.html";

                return;
            }


            const employee =
                employeeDoc.data();


            const roles =
                employee.roles || [];


            if (
                !roles.includes("admin")
            ) {

                alert(
                    "You do not have permission to access the Admin Panel."
                );

                await window.adminSignOut(
                    window.adminAuth
                );

                window.location.href =
                    "index.html";

                return;
            }


            console.log(
                "Admin access verified."
            );


        } catch (error) {

            console.error(
                "ADMIN SECURITY ERROR:",
                error
            );

            alert(
                "Unable to verify admin access."
            );

            await window.adminSignOut(
                window.adminAuth
            );

            window.location.href =
                "index.html";
        }

    }
);
