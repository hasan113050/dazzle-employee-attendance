// ========================================
// DAZZLE HRM - ADMIN PANEL
// ========================================

const byId = id => document.getElementById(id);


// ========================================
// CORE NAVIGATION ELEMENTS
// ========================================

const homeBtn = byId("homeBtn");
const attendanceManagementBtn = byId("attendanceManagementBtn");
const employeesBtn = byId("employeesBtn");
const createEmployeeBtn = byId("createEmployeeBtn");
const departmentsBranchesBtn = byId("departmentsBranchesBtn");
const shiftWeeklyOffBtn = byId("shiftWeeklyOffBtn");
const leaveManagementBtn = byId("leaveManagementBtn");
const probationBtn = byId("probationBtn");
const performanceBtn = byId("performanceBtn");
const payrollBtn = byId("payrollBtn");
const recruitmentBtn = byId("recruitmentBtn");
const documentsBtn = byId("documentsBtn");
const exitManagementBtn = byId("exitManagementBtn");
const reportsBtn = byId("reportsBtn");
const settingsBtn = byId("settingsBtn");

const homePage = byId("homePage");
const attendanceManagementPage = byId("attendanceManagementPage");
const employeesPage = byId("employeesPage");
const createEmployeePage = byId("createEmployeePage");
const departmentsBranchesPage = byId("departmentsBranchesPage");
const shiftWeeklyOffPage = byId("shiftWeeklyOffPage");
const leaveManagementPage = byId("leaveManagementPage");
const probationPage = byId("probationPage");
const performancePage = byId("performancePage");
const payrollPage = byId("payrollPage");
const recruitmentPage = byId("recruitmentPage");
const documentsPage = byId("documentsPage");
const exitManagementPage = byId("exitManagementPage");
const reportsPage = byId("reportsPage");
const settingsPage = byId("settingsPage");


// ========================================
// DASHBOARD ELEMENTS
// ========================================

const attendanceTableBody = byId("attendanceTableBody");
const employeesTableBody = byId("employeesTableBody");
const employeeSearchInput =
    byId("employeeSearchInput");

const clearEmployeeSearchBtn =
    byId("clearEmployeeSearchBtn");
const leaveRequestsTableBody = byId("leaveRequestsTableBody");

const totalEmployees = byId("totalEmployees");
const presentEmployees = byId("presentEmployees");
const checkedInEmployees = byId("checkedInEmployees");
const checkedOutEmployees = byId("checkedOutEmployees");
const absentEmployees = byId("absentEmployees");
const onLeaveEmployees = byId("onLeaveEmployees");
const inactiveEmployees = byId("inactiveEmployees");
const probationEndingSoon = byId("probationEndingSoon");

const filterDate = byId("filterDate");
const filterEmployee = byId("filterEmployee");
const filterStatus = byId("filterStatus");
const filterBtn = byId("filterBtn");
const resetBtn = byId("resetBtn");

const adminDate = byId("adminDate");


// ========================================
// CREATE EMPLOYEE
// ========================================

const employeeForm = byId("employeeForm");
const employeeFormStatus = byId("employeeFormStatus");


// ========================================
// ADMIN PROFILE
// ========================================

const adminProfileMenuBtn = byId("adminProfileMenuBtn");
const adminProfileDropdown = byId("adminProfileDropdown");
const adminMyProfileBtn = byId("adminMyProfileBtn");
const adminLogoutBtn = byId("adminLogoutBtn");

const adminHeaderName = byId("adminHeaderName");
const adminHeaderDesignation = byId("adminHeaderDesignation");

const adminMyProfileModal = byId("adminMyProfileModal");
const closeAdminMyProfileBtn = byId("closeAdminMyProfileBtn");


// ========================================
// EMPLOYEE MODAL
// ========================================

const employeeModal = byId("employeeModal");
const closeEmployeeModal = byId("closeEmployeeModal");
const deleteEmployeeBtn = byId("deleteEmployeeBtn");
const cancelEditBtn = byId("cancelEditBtn");
const saveEmployeeBtn = byId("saveEmployeeBtn");
const employeeEditForm = byId("employeeEditForm");

const modalEmployeeName = byId("modalEmployeeName");
const modalEmployeeId = byId("modalEmployeeId");
const modalName = byId("modalName");
const modalId = byId("modalId");
const modalEmail = byId("modalEmail");
const modalDepartment = byId("modalDepartment");
const modalDesignation = byId("modalDesignation");
const modalOffice = byId("modalOffice");
const modalJoiningDate = byId("modalJoiningDate");
const modalStatus = byId("modalStatus");

const editEmployeeName = byId("editEmployeeName");
const editEmployeeId = byId("editEmployeeId");
const editEmployeeEmail = byId("editEmployeeEmail");
const editDepartment = byId("editDepartment");
const editDesignation = byId("editDesignation");
const editOffice = byId("editOffice");
const editJoiningDate = byId("editJoiningDate");
const editStatus = byId("editStatus");


// ========================================
// DATA
// ========================================

let employees = [];
let currentAdminAccess = null;


let leaveRequests = [];

let selectedEmployeeId = null;

let editMode = false;

let currentAdminEmployee = null;

function isFullAdmin() {

    return (
        currentAdminAccess?.role ===
        "admin"
    );
}


function hasAdminPermission(
    permission
) {

    if (isFullAdmin()) {
        return true;
    }

    return (
        currentAdminAccess?.role ===
            "moderator" &&
        currentAdminAccess?.active ===
            true &&
        currentAdminAccess
            ?.permissions
            ?.[permission] ===
            true
    );
}


// ========================================
// HELPERS
// ========================================

function renderAttendanceTrendChart(
    records
) {

    const canvas =
        document.getElementById(
            "attendanceTrendChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    const days = [];

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        const dateKey =
            `${year}-${month}-${day}`;

        days.push(
            dateKey
        );
    }


    const attendanceCounts =
        days.map(
            dateKey => {

                return records.filter(
                    record =>
                        getRecordDateKey(
                            record
                        ) ===
                        dateKey
                ).length;
            }
        );


    const labels =
        days.map(
            dateKey => {

                const date =
                    new Date(
                        dateKey +
                        "T00:00:00"
                    );

                return date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );
            }
        );


    if (
        window.attendanceTrendChartInstance
    ) {

        window
            .attendanceTrendChartInstance
            .destroy();
    }


    window.attendanceTrendChartInstance =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels:
                        labels,

                    datasets: [
                        {
                            label:
                                "Attendance",

                            data:
                                attendanceCounts,

                            borderColor:
                                "#966E33",

                            backgroundColor:
                                "rgba(150, 110, 51, 0.12)",

                            borderWidth:
                                2,

                            tension:
                                0.35,

                            fill:
                                true,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5,

                            pointBackgroundColor:
                                "#966E33",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth:
                                2
                        }
                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {
                                precision:
                                    0
                            },

                            grid: {
                                color:
                                    "#eee5d8"
                            }

                        },

                        x: {

                            grid: {
                                display:
                                    false
                            }

                        }

                    }

                }

            }
        );
}

function renderDepartmentDistributionChart(
    employeeList
) {

    const canvas =
        document.getElementById(
            "departmentDistributionChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    const departmentCounts = {};


    employeeList.forEach(
        employee => {

            const department =
                String(
                    employee.department ||
                    "Unassigned"
                ).trim() ||
                "Unassigned";


            departmentCounts[
                department
            ] =
                (
                    departmentCounts[
                        department
                    ] ||
                    0
                ) + 1;
        }
    );


    const labels =
        Object.keys(
            departmentCounts
        );


    const values =
        Object.values(
            departmentCounts
        );


    if (
        window
            .departmentDistributionChartInstance
    ) {

        window
            .departmentDistributionChartInstance
            .destroy();
    }


    window.departmentDistributionChartInstance =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels:
                        labels,

                    datasets: [
                        {

                            data:
                                values,

                            backgroundColor: [
                                "#966E33",
                                "#B7894C",
                                "#C9A66B",
                                "#D8BC8A",
                                "#7D5A2A",
                                "#A77B3F",
                                "#E5D3B3",
                                "#6C5235"
                            ],

                            borderColor:
                                "#ffffff",

                            borderWidth:
                                2,

                            hoverOffset:
                                6
                        }
                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                boxWidth:
                                    8,

                                boxHeight:
                                    8,

                                padding:
                                    14,

                                font: {
                                    size:
                                        10
                                },

                                color:
                                    "#7D7164"
                            }

                        }

                    }

                }

            }
        );
}


function renderWeeklyAttendanceChart(
    records
) {

    const canvas =
        document.getElementById(
            "weeklyAttendanceChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    const days = [];

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        days.push(
            `${year}-${month}-${day}`
        );
    }


    const presentCounts =
        days.map(
            dateKey => {

                return records.filter(
                    record =>
                        getRecordDateKey(
                            record
                        ) ===
                        dateKey
                ).length;
            }
        );


    const labels =
        days.map(
            dateKey => {

                const date =
                    new Date(
                        dateKey +
                        "T00:00:00"
                    );

                return date.toLocaleDateString(
                    "en-US",
                    {
                        weekday:
                            "short"
                    }
                );
            }
        );


    if (
        window.weeklyAttendanceChartInstance
    ) {

        window
            .weeklyAttendanceChartInstance
            .destroy();
    }


    window.weeklyAttendanceChartInstance =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels:
                        labels,

                    datasets: [
                        {

                            label:
                                "Present",

                            data:
                                                            presentCounts,

                            backgroundColor:
                                "#966E33",

                            borderColor:
                                "#7D5A2A",

                            borderWidth:
                                1,

                            borderRadius:
                                6,

                            maxBarThickness:
                                28
                        }
                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {
                                precision:
                                    0
                            },

                            grid: {
                                color:
                                    "#eee5d8"
                            }

                        },

                        x: {

                            grid: {
                                display:
                                    false
                            }

                        }

                    }

                }

            }
        );
}

function renderLeaveSummaryChart(
    leaveList
) {

    const canvas =
        document.getElementById(
            "leaveSummaryChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    let approved = 0;
    let pending = 0;
    let rejected = 0;


    leaveList.forEach(
        leave => {

            const status =
                String(
                    leave.status || ""
                )
                    .trim()
                    .toLowerCase();


            if (
                status === "approved"
            ) {

                approved++;

            } else if (
                status === "pending"
            ) {

                pending++;

            } else if (
                status === "rejected"
            ) {

                rejected++;
            }
        }
    );


    if (
        window.leaveSummaryChartInstance
    ) {

        window
            .leaveSummaryChartInstance
            .destroy();
    }


    window.leaveSummaryChartInstance =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [
                        "Approved",
                        "Pending",
                        "Rejected"
                    ],

                    datasets: [
                        {

                            data: [
                                approved,
                                pending,
                                rejected
                            ],

                            backgroundColor: [
                                "#966E33",
                                "#C9A66B",
                                "#6F4F24"
                            ],

                            borderColor:
                                "#ffffff",

                            borderWidth:
                                2,

                            hoverOffset:
                                6
                        }
                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle",

                                boxWidth:
                                    8,

                                boxHeight:
                                    8,

                                padding:
                                    14,

                                font: {
                                    size:
                                        10
                                },

                                color:
                                    "#7D7164"
                            }

                        }

                    }

                }

            }
        );
}


function getTodayDate() {

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


function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";
    }


    if (
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                dateString
            )
    ) {

        const date =
            new Date(
                dateString +
                "T00:00:00"
            );

        return date
            .toLocaleDateString(
                "en-GB",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );
    }


    if (
        /^\d{2}\/\d{2}\/\d{4}$/
            .test(
                dateString
            )
    ) {

        const parts =
            dateString.split(
                "/"
            );

        const day =
            parts[0];

        const month =
            parts[1];

        const year =
            parts[2];


        const date =
            new Date(
                `${year}-${month}-${day}T00:00:00`
            );


        return date
            .toLocaleDateString(
                "en-GB",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );
    }


    return dateString;
}


function getRecordDateKey(
    record
) {

    if (
        record.dateKey
    ) {

        return record.dateKey;
    }


    if (
        record.date &&
        /^\d{2}\/\d{2}\/\d{4}$/
            .test(
                record.date
            )
    ) {

        const [
            day,
            month,
            year
        ] =
            record.date
                .split(
                    "/"
                );


        return (
            `${year}-${month}-${day}`
        );
    }


    if (
        record.date &&
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                record.date
            )
    ) {

        return record.date;
    }


    return "";
}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


function setText(
    id,
    value
) {

    const element =
        byId(
            id
        );


    if (
        !element
    ) {

        return;
    }


    element.textContent =
        value ||
        "-";
}


// ========================================
// PAGE NAVIGATION
// ========================================

const pageMap = {

    home: {

        button:
            homeBtn,

        page:
            homePage

    },


    attendanceManagement: {

        button:
            attendanceManagementBtn,

        page:
            attendanceManagementPage

    },


    employees: {

        button:
            employeesBtn,

        page:
            employeesPage

    },


    createEmployee: {

        button:
            createEmployeeBtn,

        page:
            createEmployeePage

    },


    departmentsBranches: {

        button:
            departmentsBranchesBtn,

        page:
            departmentsBranchesPage

    },


    shiftWeeklyOff: {

        button:
            shiftWeeklyOffBtn,

        page:
            shiftWeeklyOffPage

    },


    leaveManagement: {

        button:
            leaveManagementBtn,

        page:
            leaveManagementPage

    },


    probation: {

        button:
            probationBtn,

        page:
            probationPage

    },


    performance: {

        button:
            performanceBtn,

        page:
            performancePage

    },


    payroll: {

        button:
            payrollBtn,

        page:
            payrollPage

    },


    recruitment: {

        button:
            recruitmentBtn,

        page:
            recruitmentPage

    },


    documents: {

        button:
            documentsBtn,

        page:
            documentsPage

    },


    exitManagement: {

        button:
            exitManagementBtn,

        page:
            exitManagementPage

    },


    reports: {

        button:
            reportsBtn,

        page:
            reportsPage

    },


   settings: {

    button:
        settingsBtn,

    page:
        settingsPage

    },


    rolesPermissions: {

        button:
            null,

        page:
            document.getElementById(
                "rolesPermissionsPage"
            )

    }

};

const pagePermissionMap = {

    home:
        "dashboard",

    attendanceManagement:
        "attendance",

    employees:
        "employees",

    createEmployee:
        "employees",

    departmentsBranches:
        "organization",

    shiftWeeklyOff:
        "shifts",

    leaveManagement:
        "leave",

    probation:
        "probation",

    performance:
        "performance",

    payroll:
        "payroll",

    recruitment:
        "recruitment",

    documents:
        "documents",

    exitManagement:
        "exit",

    reports:
        "reports",

    settings:
        "settings"
};

const rolesPermissionsCard =
    document.getElementById(
        "rolesPermissionsCard"
    );


if (
    rolesPermissionsCard
) {

    rolesPermissionsCard.addEventListener(
        "click",
        () => {

            showPage(
                "rolesPermissions"
            );

        }
        
    );


    rolesPermissionsCard.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                showPage(
                    "rolesPermissions"
                );

            }

        }
    );

}

// ========================================
// MODERATOR MODAL
// ========================================

const addModeratorBtn =
    document.getElementById(
        "addModeratorBtn"
    );

const moderatorModal =
    document.getElementById(
        "moderatorModal"
    );

const moderatorForm =
    document.getElementById(
        "moderatorForm"
    );

const closeModeratorModalBtn =
    document.getElementById(
        "closeModeratorModalBtn"
    );

const cancelModeratorBtn =
    document.getElementById(
        "cancelModeratorBtn"
    );

const moderatorSelectAllPermissions =
    document.getElementById(
        "moderatorSelectAllPermissions"
    );


function openModeratorModal() {

    if (
        !moderatorModal
    ) {
        return;
    }

    moderatorForm?.reset();

    const editingModeratorId =
    document.getElementById(
        "editingModeratorId"
    );

if (editingModeratorId) {
    editingModeratorId.value = "";
}

const submitButton =
    moderatorForm?.querySelector(
        'button[type="submit"]'
    );

if (submitButton) {
    submitButton.textContent =
        "Create Moderator";
}

const modalTitle =
    moderatorModal?.querySelector(
        ".moderator-modal-header h2"
    );

if (modalTitle) {
    modalTitle.textContent =
        "Add Moderator";
}




    moderatorModal
        .classList
        .add(
            "active"
        );

    moderatorModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeModeratorModal() {

    if (
        !moderatorModal
    ) {
        return;
    }

    moderatorModal
        .classList
        .remove(
            "active"
        );

    moderatorModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


addModeratorBtn?.addEventListener(
    "click",
    openModeratorModal
);


closeModeratorModalBtn?.addEventListener(
    "click",
    closeModeratorModal
);


cancelModeratorBtn?.addEventListener(
    "click",
    closeModeratorModal
);


moderatorModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            moderatorModal
        ) {
            closeModeratorModal();
        }

    }
);


// SELECT ALL PERMISSIONS

moderatorSelectAllPermissions?.addEventListener(
    "change",
    event => {

        const permissionCheckboxes =
            document.querySelectorAll(
                'input[name="moderatorPermission"]'
            );

        permissionCheckboxes.forEach(
            checkbox => {

                checkbox.checked =
                    event.target.checked;

            }
        );

    }
);

// ========================================
// MODERATOR EMPLOYEE SEARCH
// ========================================

const moderatorEmployeeSearch =
    document.getElementById(
        "moderatorEmployeeSearch"
    );

const moderatorEmployeeSearchResults =
    document.getElementById(
        "moderatorEmployeeSearchResults"
    );

const moderatorEmployeeId =
    document.getElementById(
        "moderatorEmployeeId"
    );

const selectedModeratorEmployee =
    document.getElementById(
        "selectedModeratorEmployee"
    );

const selectedModeratorInitials =
    document.getElementById(
        "selectedModeratorInitials"
    );

const selectedModeratorName =
    document.getElementById(
        "selectedModeratorName"
    );

const selectedModeratorDesignation =
    document.getElementById(
        "selectedModeratorDesignation"
    );

const selectedModeratorEmail =
    document.getElementById(
        "selectedModeratorEmail"
    );

const clearModeratorEmployeeBtn =
    document.getElementById(
        "clearModeratorEmployeeBtn"
    );


function getModeratorEmployeeInitials(name = "") {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part =>
            part.charAt(0).toUpperCase()
        )
        .join("") || "--";

}


function selectModeratorEmployee(employee) {

    const employeeId =
        employee.firestoreId ||
        employee.id ||
        "";

    const employeeName =
        employee.name ||
        employee.fullName ||
        "Unnamed Employee";

    const employeeEmail =
        employee.email ||
        "";

    const employeeDesignation =
        employee.designation ||
        "Employee";


    moderatorEmployeeId.value =
        employeeId;

    moderatorEmployeeSearch.value =
        employeeName;


    selectedModeratorInitials.textContent =
        getModeratorEmployeeInitials(
            employeeName
        );

    selectedModeratorName.textContent =
        employeeName;

    selectedModeratorDesignation.textContent =
        employeeDesignation;

    selectedModeratorEmail.textContent =
        employeeEmail;


    selectedModeratorEmployee.hidden =
        false;

    moderatorEmployeeSearchResults
        .classList
        .remove("active");

    moderatorEmployeeSearchResults.innerHTML =
        "";

}


function clearSelectedModeratorEmployee() {

    moderatorEmployeeId.value =
        "";

    moderatorEmployeeSearch.value =
        "";

    selectedModeratorEmployee.hidden =
        true;

    moderatorEmployeeSearchResults.innerHTML =
        "";

    moderatorEmployeeSearchResults
        .classList
        .remove("active");

}


moderatorEmployeeSearch?.addEventListener(
    "input",
    () => {

        const query =
            moderatorEmployeeSearch
                .value
                .trim()
                .toLowerCase();


        moderatorEmployeeId.value =
            "";

        selectedModeratorEmployee.hidden =
            true;


        if (
            query.length < 1
        ) {

            moderatorEmployeeSearchResults
                .classList
                .remove("active");

            moderatorEmployeeSearchResults.innerHTML =
                "";

            return;
        }


        const matches =
            employees
                .filter(employee => {

                    const name =
                        String(
                            employee.name ||
                            employee.fullName ||
                            ""
                        ).toLowerCase();

                    const email =
                        String(
                            employee.email ||
                            ""
                        ).toLowerCase();

                    const employeeId =
                        String(
                            employee.employeeId ||
                            employee.employeeID ||
                            employee.id ||
                            ""
                        ).toLowerCase();


                    return (
                        name.includes(query) ||
                        email.includes(query) ||
                        employeeId.includes(query)
                    );

                })
                .slice(0, 8);


        if (
            matches.length === 0
        ) {

            moderatorEmployeeSearchResults.innerHTML =
                `
                    <div class="moderator-search-empty">
                        No matching employee found.
                    </div>
                `;

            moderatorEmployeeSearchResults
                .classList
                .add("active");

            return;
        }


        moderatorEmployeeSearchResults.innerHTML =
            matches
                .map((employee, index) => {

                    const name =
                        employee.name ||
                        employee.fullName ||
                        "Unnamed Employee";

                    const email =
                        employee.email ||
                        "";

                    const designation =
                        employee.designation ||
                        "Employee";

                    const employeeCode =
                        employee.employeeId ||
                        employee.employeeID ||
                        employee.id ||
                        "";


                    return `
                        <button
                            type="button"
                            class="moderator-search-result-item"
                            data-moderator-result-index="${index}"
                        >
                            <span class="moderator-search-result-avatar">
                                ${getModeratorEmployeeInitials(name)}
                            </span>

                            <span class="moderator-search-result-info">

                                <strong>
                                    ${name}
                                </strong>

                                <span>
                                    ${designation}
                                    ${employeeCode ? ` • ${employeeCode}` : ""}
                                </span>

                                <small>
                                    ${email}
                                </small>

                            </span>
                        </button>
                    `;

                })
                .join("");


        moderatorEmployeeSearchResults
            .classList
            .add("active");


        moderatorEmployeeSearchResults
            .querySelectorAll(
                "[data-moderator-result-index]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset
                                    .moderatorResultIndex
                            );

                        selectModeratorEmployee(
                            matches[index]
                        );

                    }
                );

            });

    }
);


clearModeratorEmployeeBtn?.addEventListener(
    "click",
    () => {

        clearSelectedModeratorEmployee();

        moderatorEmployeeSearch?.focus();

    }
);

// ========================================
// LOAD MODERATORS
// ========================================
let loadedModerators = [];
async function loadModerators() {

    const tableBody =
        document.getElementById(
            "moderatorsTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="5">
                Loading moderators...
            </td>
        </tr>
    `;


    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "admins"
                )

            );


      loadedModerators = [];

const moderators = loadedModerators;


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                if (
                    data.role !==
                    "moderator"
                ) {
                    return;
                }


                moderators.push({
                    uid:
                        documentSnapshot.id,

                    ...data
                });

            }
        );


        if (
            moderators.length === 0
        ) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No moderators found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            moderators
                .map(
                    moderator => {

                        const permissions =
                            Object
                                .entries(
                                    moderator.permissions ||
                                    {}
                                )
                                .filter(
                                    ([, allowed]) =>
                                        allowed === true
                                )
                                .map(
                                    ([permission]) =>
                                        permission
                                );


                        const permissionText =
                            permissions.length
                                ? permissions
                                    .map(
                                        permission =>
                                            permission
                                                .replace(
                                                    /([A-Z])/g,
                                                    " $1"
                                                )
                                                .replace(
                                                    /^./,
                                                    char =>
                                                        char.toUpperCase()
                                                )
                                    )
                                    .join(", ")
                                : "No access";


                        const statusText =
                            moderator.active
                                ? "Active"
                                : "Inactive";


                        return `
                            <tr>

                                <td>
                                    <strong>
                                        ${moderator.name || "—"}
                                    </strong>

                                    <br>

                                    <small>
                                        ${moderator.email || "—"}
                                    </small>
                                </td>


                                <td>
                                    ${moderator.employeeId || "—"}
                                </td>


                                <td>
                                    ${permissionText}
                                </td>


                                <td>
                                    <span
                                        class="moderator-status ${
                                            moderator.active
                                                ? "active"
                                                : "inactive"
                                        }"
                                    >
                                        ${statusText}
                                    </span>
                                </td>


                                <td>
                                    <button
                                        type="button"
                                        class="secondary-btn"
                                        data-moderator-uid="${moderator.uid}"
                                    >
                                        Manage
                                    </button>
                                </td>

                            </tr>
                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Failed to load moderators:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load moderators.
                </td>
            </tr>
        `;

    }

    const manageButtons =
    tableBody.querySelectorAll(
        "[data-moderator-uid]"
    );

manageButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const uid =
                    button.dataset
                        .moderatorUid;

                openModeratorForEdit(
                    uid
                );

            }
        );

    }
);

}

function openModeratorForEdit(uid) {

    const moderator =
        loadedModerators.find(
            item =>
                item.uid === uid
        );

    if (!moderator) {

        alert(
            "Moderator information could not be found."
        );

        return;
    }

    console.log(
        "Selected moderator:",
        moderator
    );
    const editingModeratorId =
    document.getElementById(
        "editingModeratorId"
    );

if (editingModeratorId) {
    editingModeratorId.value =
        moderator.uid;
}


if (moderatorEmployeeId) {
    moderatorEmployeeId.value =
        moderator.uid;
}

if (moderatorEmployeeSearch) {
    moderatorEmployeeSearch.value =
        moderator.name || "";
}


selectedModeratorInitials.textContent =
    getModeratorEmployeeInitials(
        moderator.name || ""
    );

selectedModeratorName.textContent =
    moderator.name ||
    "Employee";

selectedModeratorDesignation.textContent =
    "Moderator";

selectedModeratorEmail.textContent =
    moderator.email ||
    "";

selectedModeratorEmployee.hidden =
    false;
const moderatorStatus =
    document.getElementById(
        "moderatorStatus"
    );

if (moderatorStatus) {

    moderatorStatus.value =
        moderator.active
            ? "active"
            : "inactive";

}

document
    .querySelectorAll(
        'input[name="moderatorPermission"]'
    )
    .forEach(
        checkbox => {

            checkbox.checked =
                moderator.permissions?.[
                    checkbox.value
                ] === true;

        }
    );

    const submitButton =
    moderatorForm?.querySelector(
        'button[type="submit"]'
    );

if (submitButton) {
    submitButton.textContent =
        "Save Changes";
}

const modalTitle =
    moderatorModal?.querySelector(
        ".moderator-modal-header h2"
    );

if (modalTitle) {
    modalTitle.textContent =
        "Manage Moderator";
}

moderatorModal.classList.add(
    "active"
);

moderatorModal.setAttribute(
    "aria-hidden",
    "false"
);
}

// ========================================
// MODERATOR FORM VALIDATION
// ========================================

moderatorForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        // SELECTED EMPLOYEE

const editingModeratorUid =
    document
        .getElementById(
            "editingModeratorId"
        )
        ?.value
        ?.trim();

        const selectedEmployeeId =
            moderatorEmployeeId
                ?.value
                ?.trim();


        if (
            !selectedEmployeeId
        ) {
            alert(
                "Please select an employee first."
            );

            return;
        }


        const selectedEmployee =
            employees.find(
                employee => {

                    const employeeFirestoreId =
                        String(
                            employee.firestoreId ||
                            employee.id ||
                            ""
                        );

                    return (
                        employeeFirestoreId ===
                        selectedEmployeeId
                    );

                }
            );


        if (
            !selectedEmployee
        ) {
            alert(
                "Selected employee could not be found. Please select the employee again."
            );

            return;
        }


        // EMPLOYEE INFORMATION

        const name =
            selectedEmployee.name ||
            selectedEmployee.fullName ||
            "";

        const email =
            selectedEmployee.email ||
            "";

        const employeeId =
    selectedEmployee.employeeId ||
    "";

const employeeUid =
    editingModeratorUid ||
    selectedEmployee.uid ||
    selectedEmployee.firestoreId ||
    "";


        if (
            !email
        ) {
            alert(
                "This employee does not have an email address."
            );

            return;
        }


        // STATUS

        const status =
            document
                .getElementById(
                    "moderatorStatus"
                )
                ?.value ||
            "active";


        // SELECTED PERMISSIONS

        const selectedPermissions =
            Array.from(
                document.querySelectorAll(
                    'input[name="moderatorPermission"]:checked'
                )
            ).map(
                checkbox =>
                    checkbox.value
            );


        if (
            selectedPermissions.length === 0
        ) {
            alert(
                "Please select at least one module permission."
            );

            return;
        }


        // PREPARE PERMISSIONS

        const permissions = {};

        selectedPermissions.forEach(
            permission => {

                permissions[
                    permission
                ] = true;

            }
        );


        // PREPARE MODERATOR DATA

      const moderatorData = {
    uid: employeeUid,
    employeeId,
    name,
    email,

    role: "moderator",

    active:
        status ===
        "active",

    permissions
};


       try {

    if (
        !employeeUid
    ) {
        alert(
            "Firebase UID was not found for this employee."
        );

        return;
    }


    await window.adminSetDoc(

        window.adminDoc(
            window.adminDB,
            "admins",
            employeeUid
        ),

        moderatorData

    );


   alert(
    editingModeratorUid
        ? "Moderator access updated successfully."
        : "Moderator access created successfully."
);


closeModeratorModal();

await loadModerators();


} catch (error) {

    console.error(
        "Failed to create moderator:",
        error
    );


    alert(
        "Failed to create moderator access. Please try again."
    );

}

    }
);

async function showPage(
    pageName
) {
    // Roles & Permissions is Full Admin only
if (
    pageName === "rolesPermissions" &&
    !isFullAdmin()
) {
    return;
}


// Check Moderator page permission
const requiredPermission =
    pagePermissionMap[
        pageName
    ];

if (
    !isFullAdmin() &&
    requiredPermission &&
    !hasAdminPermission(
        requiredPermission
    )
) {
    return;
}

    Object
        .values(
            pageMap
        )
        .forEach(
            item => {

                if (
                    item.page
                ) {
                                        item.page
                        .classList
                        .remove(
                            "active-page"
                        );

                }


                if (
                    item.button
                ) {

                    item.button
                        .classList
                        .remove(
                            "active"
                        );

                }

            }
        );


    const selected =
        pageMap[
            pageName
        ];


    if (
        !selected
    ) {

        return;
    }
localStorage.setItem(
    "dazzleAdminActivePage",
    pageName
);

    if (
        selected.page
    ) {

        selected.page
            .classList
            .add(
                "active-page"
            );
    }


    if (
        selected.button
    ) {

        selected.button
            .classList
            .add(
                "active"
            );
    }


    if (
        pageName ===
        "home"
    ) {

        await loadEmployees();

        await loadLeaveRequests(
            false
        );

        await loadAttendance();

    }


    if (
        pageName ===
        "employees"
    ) {

        await loadEmployees();

    }

    if (
    pageName ===
    "departmentsBranches"
) {

    await loadDepartments();

    await loadBranches();

}

    if (
        pageName ===
        "attendanceManagement"
    ) {

        await loadAttendance();

    }


    if (
        pageName ===
        "leaveManagement"
    ) {

        await loadLeaveRequests(
            true
        );

    }


 if (
    pageName ===
    "probation"
) {

    await loadEmployees();

    updateProbationDashboard();

}

if (pageName === "rolesPermissions") {
    await loadEmployees();
    await loadModerators();
}

    if (
        pageName ===
        "recruitment"
    ) {

        await loadRecruitmentModule();

    }

}


// ========================================
// SIDEBAR EVENTS
// ========================================

Object
    .entries(
        pageMap
    )
    .forEach(
        (
            [
                pageName,
                item
            ]
        ) => {

            if (
                !item.button
            ) {

                return;
            }


            item.button
                .addEventListener(
                    "click",
                    () => {

                        showPage(
                            pageName
                        );

                    }
                );

        }
    );

    function applyAdminModulePermissions() {

    // Full Admin sees everything
    if (isFullAdmin()) {

        Object
            .values(pageMap)
            .forEach(item => {

                if (item.button) {
                    item.button.style.display =
                        "";
                }

            });

        return;
    }


    // Moderator sees only assigned modules
    Object
        .entries(pageMap)
        .forEach(([pageName, item]) => {

            if (!item.button) {
                return;
            }

            const permission =
                pagePermissionMap[
                    pageName
                ];

            const allowed =
                permission &&
                hasAdminPermission(
                    permission
                );

            item.button.style.display =
                allowed
                    ? ""
                    : "none";
        });


    // Roles & Permissions is Admin-only
    const rolesPermissionsCard =
        document.getElementById(
            "rolesPermissionsCard"
        );

    if (rolesPermissionsCard) {
        rolesPermissionsCard.style.display =
            "none";
    }
}


// ========================================
// LOAD EMPLOYEES
// ========================================

async function loadEmployees() {

    if (
        !employeesTableBody
    ) {

        return;
    }


    try {

        const snapshot =
            await window
                .adminGetDocs(

                    window
                        .adminCollection(

                            window.adminDB,

                            "employees"

                        )

                );


        employees =
            [];


        snapshot.forEach(
            documentSnapshot => {

                employees.push({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot
                        .data()

                });

            }
        );


        employees.sort(
            (
                a,
                b
            ) =>

                String(
                    a.employeeId ||
                    ""
                )
                    .localeCompare(

                        String(
                            b.employeeId ||
                            ""
                        )

                    )
        );


        renderEmployees();

        updateEmployeeBasedKPIs();
renderDepartmentDistributionChart(
    employees
);

    } catch (
        error
    ) {

        console.error(
            "LOAD EMPLOYEES ERROR:",
            error
        );


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

function renderEmployees(
    employeeList = employees
) {

    if (
        !employeesTableBody
    ) {

        return;
    }


    if (
        employeeList.length ===
        0
    ) {

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


    employeesTableBody.innerHTML =
        "";


    employeeList.forEach(
        employee => {

            const row =
                document
                    .createElement(
                        "tr"
                    );


            const status =
                employee.status ||
                "active";


            const statusText =
                status ===
                "active"

                    ? "Active"

                    : "Inactive";


            row.innerHTML = `

                <td>

                    ${escapeHtml(
                        employee.name ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.employeeId ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.department ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.designation ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.office ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        formatDate(
                            employee.joiningDate
                        )
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
                            data-id="${escapeHtml(
                                employee.firestoreId
                            )}"
                        >

                            View

                        </button>


                        <button
                            type="button"
                            class="edit-employee-btn"
                            data-id="${escapeHtml(
                                employee.firestoreId
                            )}"
                        >

                            Edit

                        </button>


                        <button
                            type="button"
                            class="deactivate-employee-btn"
                            data-id="${escapeHtml(
                                employee.firestoreId
                            )}"
                        >

                            ${
                                status ===
                                "active"

                                    ? "Deactivate"

                                    : "Activate"
                            }

                        </button>


                    </div>

                </td>

            `;


            employeesTableBody
                .appendChild(
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

    document
        .querySelectorAll(
            ".view-employee-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openEmployeeModal(

                            button.dataset.id,

                            false

                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".edit-employee-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openEmployeeModal(

                            button.dataset.id,

                            true

                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".deactivate-employee-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

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
            item =>
                item.firestoreId ===
                firestoreId
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
        employee.name ||
        "Employee";


    modalEmployeeId.textContent =
        employee.employeeId ||
        "-";


    modalName.textContent =
        employee.name ||
        "-";


    modalId.textContent =
        employee.employeeId ||
        "-";


    modalEmail.textContent =
        employee.email ||
        "-";


    setText(
        "modalPhone",
        employee.phone
    );


    setText(
        "modalDob",

        employee.dateOfBirth
            ? formatDate(
                employee.dateOfBirth
            )
            : "-"
    );
        setText(
        "modalNid",
        employee.nid
    );


    setText(
        "modalEmergencyContact",
        employee.emergencyContact
    );


    setText(
        "modalPresentAddress",
        employee.presentAddress
    );


    modalDepartment.textContent =
        employee.department ||
        "-";


    modalDesignation.textContent =
        employee.designation ||
        "-";


    modalOffice.textContent =
        employee.office ||
        "-";


    modalJoiningDate.textContent =
        formatDate(
            employee.joiningDate
        );


    setText(
        "modalEmploymentType",
        employee.employmentType
    );


    setText(
        "modalProbationEndDate",

        employee.probationEndDate
            ? formatDate(
                employee.probationEndDate
            )
            : "-"
    );


    modalStatus.textContent =
        employee.status ===
        "active"

            ? "Active"

            : "Inactive";


    /* ========================= */
    /* EDIT FORM VALUES */
    /* ========================= */

    editEmployeeName.value =
        employee.name ||
        "";


    editEmployeeId.value =
        employee.employeeId ||
        "";


    editEmployeeEmail.value =
        employee.email ||
        "";


    /*
     * Firebase Authentication email is not
     * being updated by this frontend.
     *
     * So email stays read-only here to avoid
     * Firebase Auth + Firestore mismatch.
     */

    editEmployeeEmail.readOnly =
        true;


    editEmployeeEmail.title =
        "Email change is disabled because Firebase Authentication email must also be updated.";


    byId(
        "editEmployeePhone"
    ).value =
        employee.phone ||
        "";


    byId(
        "editEmployeeDob"
    ).value =
        employee.dateOfBirth ||
        "";


    byId(
        "editEmployeeNid"
    ).value =
        employee.nid ||
        "";


    byId(
        "editEmergencyContact"
    ).value =
        employee.emergencyContact ||
        "";


    byId(
        "editPresentAddress"
    ).value =
        employee.presentAddress ||
        "";


    editDepartment.value =
        employee.department ||
        "";


    editDesignation.value =
        employee.designation ||
        "";


    editOffice.value =
        employee.office ||
        "";


    editJoiningDate.value =
        employee.joiningDate ||
        "";


    byId(
        "editEmploymentType"
    ).value =
        employee.employmentType ||
        "";


    byId(
        "editProbationEndDate"
    ).value =
        employee.probationEndDate ||
        "";


    editStatus.value =
        employee.status ||
        "active";


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
// EMPLOYEE MODAL CLOSE
// ========================================

function closeEmployeeDetailsModal() {

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
    closeEmployeeDetailsModal
);


cancelEditBtn.addEventListener(
    "click",
    () => {

        if (editMode) {

            setEditMode(
                false
            );

            return;
        }


        closeEmployeeDetailsModal();

    }
);


employeeModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            employeeModal
        ) {

            closeEmployeeDetailsModal();

        }

    }
);


// ========================================
// SAVE EMPLOYEE
// ========================================

saveEmployeeBtn.addEventListener(
    "click",
    async () => {

        if (
            !selectedEmployeeId
        ) {

            return;
        }


        const existingEmployee =
            employees.find(
                item =>
                    item.firestoreId ===
                    selectedEmployeeId
            );


        if (
            !existingEmployee
        ) {

            alert(
                "Employee not found."
            );

            return;
        }


        const name =
            editEmployeeName
                .value
                .trim();


        const newEmployeeId =
            editEmployeeId
                .value
                .trim();


        const phone =
            byId(
                "editEmployeePhone"
            ).value.trim();


        const dateOfBirth =
            byId(
                "editEmployeeDob"
            ).value;


        const nid =
            byId(
                "editEmployeeNid"
            ).value.trim();


        const emergencyContact =
            byId(
                "editEmergencyContact"
            ).value.trim();


        const presentAddress =
            byId(
                "editPresentAddress"
            ).value.trim();


        const department =
            editDepartment
                .value
                .trim();


        const designation =
            editDesignation
                .value
                .trim();


        const office =
            editOffice
                .value
                .trim();


        const joiningDate =
            editJoiningDate.value;


        const employmentType =
            byId(
                "editEmploymentType"
            ).value;


        const probationEndDate =
            byId(
                "editProbationEndDate"
            ).value;


        const status =
            editStatus.value;


        if (
            !name
        ) {

            alert(
                "Employee name is required."
            );

            return;
        }


        if (
            !newEmployeeId
        ) {

            alert(
                "Employee ID is required."
            );

            return;
        }


        try {

            const employeeSnapshot =
                await window.adminGetDocs(

                    window.adminCollection(

                        window.adminDB,

                        "employees"

                    )

                );


            const duplicateEmployee =
                employeeSnapshot.docs.find(

                    employeeDoc =>

                        employeeDoc.id !==
                        selectedEmployeeId &&

                        employeeDoc
                            .data()
                            .employeeId ===
                        newEmployeeId

                );


            if (
                duplicateEmployee
            ) {

                alert(
                    "This Employee ID is already assigned to another employee."
                );

                return;
            }


            await window.adminUpdateDoc(

                window.adminDoc(

                    window.adminDB,

                    "employees",

                    selectedEmployeeId

                ),

                {

                    name,

                    employeeId:
                        newEmployeeId,


                    /*
                     * Keep original email.
                     * Changing Firestore alone would
                     * not update Firebase Auth.
                     */

                    email:
                        existingEmployee.email,


                    phone,

                    dateOfBirth,

                    nid,

                    emergencyContact,

                    presentAddress,

                    department,

                    designation,

                    office,

                    joiningDate,

                    employmentType,

                    probationEndDate,

                    status,


                    updatedAt:
                        new Date()
                            .toISOString()

                }

            );


            alert(
                "Employee updated successfully."
            );


            closeEmployeeDetailsModal();


            await loadEmployees();


            await loadAttendance();


        } catch (
            error
        ) {

            console.error(
                "UPDATE EMPLOYEE ERROR:",
                error
            );


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
    async () => {

        if (
            !selectedEmployeeId
        ) {

            return;
        }


        const employee =
            employees.find(
                item =>
                    item.firestoreId ===
                    selectedEmployeeId
            );


        if (
            !employee
        ) {

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

                "\n\nThis employee profile will be permanently removed from Firestore.\n\n" +

                "You must also delete the Authentication user manually."

            );


        if (
            !confirmed
        ) {

            return;
        }


        try {

            await window.adminDeleteDoc(

                window.adminDoc(
                                        window.adminDB,

                    "employees",

                    selectedEmployeeId

                )

            );


            alert(

                "Employee profile deleted from Firestore.\n\n" +

                "Important: Now delete this employee manually from Firebase Authentication > Users."

            );


            closeEmployeeDetailsModal();


            await loadEmployees();


            await loadAttendance();


        } catch (
            error
        ) {

            console.error(
                "DELETE EMPLOYEE ERROR:",
                error
            );


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
            item =>
                item.firestoreId ===
                firestoreId
        );


    if (
        !employee
    ) {

        alert(
            "Employee not found."
        );

        return;
    }


    const currentStatus =
        employee.status ||
        "active";


    const newStatus =
        currentStatus ===
        "active"

            ? "inactive"

            : "active";


    const actionText =
        newStatus ===
        "inactive"

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


    if (
        !confirmed
    ) {

        return;
    }


    try {

        await window.adminUpdateDoc(

            window.adminDoc(

                window.adminDB,

                "employees",

                firestoreId

            ),

            {

                status:
                    newStatus,


                updatedAt:
                    new Date()
                        .toISOString()

            }

        );


        alert(

            "Employee " +

            (
                newStatus ===
                "active"

                    ? "activated"

                    : "deactivated"
            ) +

            " successfully."

        );


        await loadEmployees();


        await loadAttendance();


    } catch (
        error
    ) {

        console.error(
            "EMPLOYEE STATUS ERROR:",
            error
        );


        alert(
            "Failed to change employee status.\n\n" +
            error.message
        );

    }

}


// ========================================
// ATTENDANCE
// ========================================

async function getAttendanceRecords() {

    const snapshot =
        await window.adminGetDocs(

            window.adminCollection(

                window.adminDB,

                "attendance"

            )

        );


    const records =
        [];


    snapshot.forEach(
        documentSnapshot => {

            records.push({

                firestoreId:
                    documentSnapshot.id,

                ...documentSnapshot.data()

            });

        }
    );


    records.sort(
        (
            a,
            b
        ) =>

            getRecordDateKey(
                b
            )
                .localeCompare(

                    getRecordDateKey(
                        a
                    )

                )
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
       renderAttendanceTrendChart(
    records
); 
renderWeeklyAttendanceChart(
    records
);


    } catch (
        error
    ) {

        console.error(
            "LOAD ATTENDANCE ERROR:",
            error
        );


        if (
            attendanceTableBody
        ) {

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

}


// ========================================
// RENDER ATTENDANCE
// ========================================

function renderAttendance(
    records
) {

    if (
        !attendanceTableBody
    ) {

        return;
    }


    if (
        records.length ===
        0
    ) {

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


    attendanceTableBody.innerHTML =
        "";


    records.forEach(
        record => {

            const employee =
                employees.find(

                    item =>
                        item.employeeId ===
                        record.employeeId

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

                formatDate(

                    getRecordDateKey(
                        record
                    )

                );


            const checkIn =
                record.checkInTime ||

                record.checkIn ||

                "-";


            const checkOut =
                record.checkOutTime ||

                record.checkOut ||

                "-";


            const checkInDistance =
                record.checkInDistance !==
                undefined

                    ? `${record.checkInDistance}m`

                    : "-";


            const checkOutDistance =
                record.checkOutDistance !==
                undefined

                    ? `${record.checkOutDistance}m`

                    : "-";


            const checkInAccuracy =
                record.checkInAccuracy !==
                undefined

                    ? `${Math.round(record.checkInAccuracy)}m`

                    : "-";


            const checkOutAccuracy =
                record.checkOutAccuracy !==
                undefined

                    ? `${Math.round(record.checkOutAccuracy)}m`

                    : "-";


            const location =

                `Check In: ${checkInDistance}<br>` +

                `Check Out: ${checkOutDistance}<br>` +

                `Accuracy: ${checkInAccuracy} / ${checkOutAccuracy}`;


            const status =
                record.status ===
                "completed"

                    ? "Completed"

                    : record.status ===
                      "checked-in"

                        ? "Checked In"

                        : record.status ||
                          "-";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    ${escapeHtml(
                        employeeName
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employeeId
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        formatDate(
                            date
                        )
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        checkIn
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        checkOut
                    )}

                </td>


                <td>

                    ${location}

                </td>


                <td>

                    ${escapeHtml(
                        status
                    )}

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// DASHBOARD KPI
// ========================================

function updateEmployeeBasedKPIs() {

    if (
        totalEmployees
    ) {

        totalEmployees.textContent =
            employees.length;

    }


    if (
        inactiveEmployees
    ) {

        inactiveEmployees.textContent =
            employees.filter(

                employee =>
                    employee.status ===
                    "inactive"

            ).length;

    }


    if (
        probationEndingSoon
    ) {

        probationEndingSoon.textContent =
            getProbationEndingSoonCount();

    }

}


function getProbationEndingSoonCount() {

    const today =
        new Date(

            getTodayDate() +
            "T00:00:00"

        );


    const deadline =
        new Date(
            today
        );


    deadline.setDate(

        deadline.getDate() +
        30

    );


    return employees.filter(
        employee => {

            if (
                                employee.status !==
                "active" ||

                !employee.probationEndDate

            ) {

                return false;
            }


            const probationDate =
                new Date(

                    employee.probationEndDate +
                    "T00:00:00"

                );


            return (

                probationDate >=
                today &&

                probationDate <=
                deadline

            );

        }
    ).length;

}


function getTodayApprovedLeaveEmployeeIds() {

    const today =
        getTodayDate();


    return new Set(

        leaveRequests

            .filter(

                request =>

                    request.status ===
                    "approved" &&

                    request.fromDate <=
                    today &&

                    request.toDate >=
                    today

            )

            .map(

                request =>
                    request.employeeId

            )

            .filter(
                Boolean
            )

    );

}


function updateAttendanceSummary(
    records
) {

    const today =
        getTodayDate();


    const todayRecords =
        records.filter(

            record =>

                getRecordDateKey(
                    record
                ) ===
                today

        );


    const presentSet =
        new Set();


    const checkedInSet =
        new Set();


    const checkedOutSet =
        new Set();


    todayRecords.forEach(
        record => {

            if (
                record.employeeId
            ) {

                presentSet.add(
                    record.employeeId
                );

            }


            if (

                record.employeeId &&

                (
                    record.checkInTime ||
                    record.checkIn
                )

            ) {

                checkedInSet.add(
                    record.employeeId
                );

            }


            if (

                record.employeeId &&

                (
                    record.checkOutTime ||
                    record.checkOut
                )

            ) {

                checkedOutSet.add(
                    record.employeeId
                );

            }

        }
    );


    const leaveSet =
        getTodayApprovedLeaveEmployeeIds();


    const activeEmployees =
        employees.filter(

            employee =>
                employee.status !==
                "inactive"

        );


    /*
     * Shift & Weekly Off এখনো functional না।
     *
     * তাই আপাতত:
     * Absent = Active Employee
     *          - Present
     *          - Approved Leave
     */

    const absentCount =
        activeEmployees.filter(

            employee =>

                employee.employeeId &&

                !presentSet.has(
                    employee.employeeId
                ) &&

                !leaveSet.has(
                    employee.employeeId
                )

        ).length;


    if (
        totalEmployees
    ) {

        totalEmployees.textContent =
            employees.length;

    }


    if (
        presentEmployees
    ) {

        presentEmployees.textContent =
            presentSet.size;

    }


    if (
        checkedInEmployees
    ) {

        checkedInEmployees.textContent =
            checkedInSet.size;

    }


    if (
        checkedOutEmployees
    ) {

        checkedOutEmployees.textContent =
            checkedOutSet.size;

    }


    if (
        absentEmployees
    ) {

        absentEmployees.textContent =
            absentCount;

    }


    if (
        onLeaveEmployees
    ) {

        onLeaveEmployees.textContent =
            leaveSet.size;

    }


    if (
        inactiveEmployees
    ) {

        inactiveEmployees.textContent =
            employees.filter(

                employee =>
                    employee.status ===
                    "inactive"

            ).length;

    }


    if (
        probationEndingSoon
    ) {

        probationEndingSoon.textContent =
            getProbationEndingSoonCount();

    }

}

let selectedProbationEmployeeId = null;

function updateProbationDashboard() {

    const tableBody =
        byId("probationTableBody");

    if (!tableBody) {
        return;
    }

    const probationEmployees =
    employees.filter(
        employee =>
            employee.probationEndDate &&
            employee.probationStatus !==
                "confirmed"
    );


const confirmedThisMonth =
    employees.filter(
        employee => {

            if (
                employee.probationStatus !==
                    "confirmed" ||
                !employee.confirmationDate
            ) {
                return false;
            }


            const confirmationDate =
                new Date(
                    employee.confirmationDate +
                    "T00:00:00"
                );

            const now =
                new Date();


            return (
                confirmationDate.getFullYear() ===
                    now.getFullYear() &&
                confirmationDate.getMonth() ===
                    now.getMonth()
            );

        }
    );

const today = new Date();

today.setHours(
    0,
    0,
    0,
    0
);


let onProbationCount = 0;
let dueSoonCount = 0;
let overdueCount = 0;


probationEmployees.forEach(
    employee => {

        const endDate =
            new Date(
                employee.probationEndDate +
                "T00:00:00"
            );

        const difference =
            endDate.getTime() -
            today.getTime();

        const daysLeft =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        if (daysLeft < 0) {

            overdueCount++;

        } else if (daysLeft <= 30) {

            dueSoonCount++;

        } else {

            onProbationCount++;

        }

    }
);


const totalCountElement =
    byId("probationTotalCount");

const dueSoonCountElement =
    byId("probationDueSoonCount");

const overdueCountElement =
    byId("probationOverdueCount");

const confirmedCountElement =
    byId("probationConfirmedCount");


if (totalCountElement) {

    totalCountElement.textContent =
        probationEmployees.length;

}


if (dueSoonCountElement) {

    dueSoonCountElement.textContent =
        dueSoonCount;

}


if (overdueCountElement) {

    overdueCountElement.textContent =
        overdueCount;

}


if (confirmedCountElement) {

    confirmedCountElement.textContent =
        confirmedThisMonth.length;

}

    if (probationEmployees.length === 0) {

        tableBody.innerHTML = `
            <tr class="probation-empty-row">
                <td colspan="7">
                    No probation employee data available.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = "";

probationEmployees.forEach(
    employee => {

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const endDate =
            new Date(
                employee.probationEndDate +
                "T00:00:00"
            );

        const difference =
            endDate.getTime() -
            today.getTime();

        const daysLeft =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        let statusText =
            "On Probation";

        let statusClass =
            "active";


        if (daysLeft < 0) {

            statusText =
                "Overdue";

            statusClass =
                "overdue";

        } else if (daysLeft === 0) {

            statusText =
                "Due Today";

            statusClass =
                "due-soon";

        } else if (daysLeft <= 30) {

            statusText =
                "Due Soon";

            statusClass =
                "due-soon";

        }


        let daysText =
            `${daysLeft} days`;


        if (daysLeft === 1) {

            daysText =
                "1 day";

        } else if (daysLeft === 0) {

            daysText =
                "Today";

        } else if (daysLeft < 0) {

            daysText =
                `${Math.abs(daysLeft)} days overdue`;

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${employee.name || "—"}
            </td>

            <td>
                ${employee.department || "—"}
            </td>

            <td>
                ${employee.joiningDate || "—"}
            </td>

            <td>
                ${employee.probationEndDate || "—"}
            </td>

            <td>
                ${daysText}
            </td>

            <td>
                <span class="probation-status ${statusClass}">
                    ${statusText}
                </span>
            </td>

            <td>
            <button
    type="button"
    class="probation-action-btn"
    data-employee-id="${employee.firestoreId || employee.id || ""}"
>
    Review
</button>   
            </td>
        `;


        tableBody.appendChild(row);

    }
);
const reviewButtons =
    tableBody.querySelectorAll(
        ".probation-action-btn"
    );


reviewButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const employeeId =
                    button.dataset.employeeId;

                  selectedProbationEmployeeId =
    employeeId;  

                const employee =
                    employees.find(
                        item =>
                            (
                                item.firestoreId ||
                                item.id
                            ) === employeeId
                    );


                if (!employee) {
                    return;
                }


                const modal =
                    byId(
                        "probationActionModal"
                    );


                if (!modal) {
                    return;
                }
// Reset previous probation decision data

document
    .querySelectorAll(
        'input[name="probationDecision"]'
    )
    .forEach(
        input => {
            input.checked = false;
        }
    );


const confirmationDateInput =
    byId("probationConfirmationDate");

const extensionDateInput =
    byId("probationExtensionDate");

const extensionReasonInput =
    byId("probationExtensionReason");

const decisionNoteInput =
    byId("probationDecisionNote");


if (confirmationDateInput) {
    confirmationDateInput.value = "";
}


if (extensionDateInput) {
    extensionDateInput.value = "";
}


if (extensionReasonInput) {
    extensionReasonInput.value = "";
}


if (decisionNoteInput) {
    decisionNoteInput.value = "";
}


if (probationConfirmFields) {
    probationConfirmFields.style.display = "none";
}


if (probationExtensionFields) {
    probationExtensionFields.style.display = "none";
}

                const employeeName =
                    byId(
                        "probationModalEmployeeName"
                    );

                const employeeMeta =
                    byId(
                        "probationModalEmployeeMeta"
                    );

                const joiningDate =
                    byId(
                        "probationModalJoiningDate"
                    );

                const endDate =
                    byId(
                        "probationModalEndDate"
                    );

                const currentStatus =
                    byId(
                        "probationModalCurrentStatus"
                    );


                if (employeeName) {

                    employeeName.textContent =
                        employee.name ||
                        "Employee";

                }


                if (employeeMeta) {

                    employeeMeta.textContent =
                        [
                            employee.department,
                            employee.designation
                        ]
                            .filter(Boolean)
                            .join(" • ") ||
                        "—";

                }


                if (joiningDate) {

                    joiningDate.textContent =
                        employee.joiningDate ||
                        "—";

                }


                if (endDate) {

                    endDate.textContent =
                        employee.probationEndDate ||
                        "—";

                }


                if (currentStatus) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const probationEndDate =
        new Date(
            employee.probationEndDate +
            "T00:00:00"
        );

    const daysLeft =
        Math.ceil(
            (
                probationEndDate.getTime() -
                today.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );


    let modalStatus =
        "On Probation";


    if (daysLeft < 0) {

        modalStatus =
            "Overdue";

    } else if (daysLeft === 0) {

        modalStatus =
            "Due Today";

    } else if (daysLeft <= 30) {

        modalStatus =
            "Due Soon";

    }


    currentStatus.textContent =
        modalStatus;

}


                modal.classList.add(
                    "active"
                );

            }
        );

    }
);

const probationSearchInput =
    byId("probationSearchInput");


if (
    probationSearchInput &&
    !probationSearchInput.dataset.listenerAdded
) {

    probationSearchInput.dataset.listenerAdded =
        "true";


    probationSearchInput.addEventListener(
        "input",
        () => {

            const searchText =
                probationSearchInput.value
                    .trim()
                    .toLowerCase();


            const rows =
                tableBody.querySelectorAll(
                    "tr:not(.probation-empty-row)"
                );


            rows.forEach(
                row => {

                    const rowText =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        rowText.includes(
                            searchText
                        )
                            ? ""
                            : "none";

                }
            );

        }
    );

}

const probationStatusFilter =
    byId("probationStatusFilter");


if (
    probationStatusFilter &&
    !probationStatusFilter.dataset.listenerAdded
) {

    probationStatusFilter.dataset.listenerAdded =
        "true";


    probationStatusFilter.addEventListener(
        "change",
        () => {

            const selectedStatus =
                probationStatusFilter.value;

  if (
    probationStatusFilter.dataset.previousStatus ===
        "confirmed" &&
    selectedStatus !==
        "confirmed"
) {

    probationStatusFilter.dataset.previousStatus =
        selectedStatus;

    updateProbationDashboard();

    return;

}


probationStatusFilter.dataset.previousStatus =
    selectedStatus;

if (
    selectedStatus ===
    "confirmed"
) {

    const confirmedEmployees =
        employees.filter(
            employee =>
                employee.probationStatus ===
                "confirmed"
        );


    tableBody.innerHTML = "";


    if (
        confirmedEmployees.length === 0
    ) {

        tableBody.innerHTML = `
            <tr class="probation-empty-row">
                <td colspan="7">
                    No confirmed employees found.
                </td>
            </tr>
        `;

        return;

    }


    confirmedEmployees.forEach(
        employee => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${employee.name || "—"}
                </td>

                <td>
                    ${employee.department || "—"}
                </td>

                <td>
                    ${employee.joiningDate || "—"}
                </td>

                <td>
                    ${employee.confirmationDate || "—"}
                </td>

                <td>
                    —
                </td>

                <td>
                    <span class="probation-status confirmed">
                        Confirmed
                    </span>
                </td>

                <td>
                    —
                </td>
            `;


            tableBody.appendChild(row);

        }
    );


    return;

}

            const rows =
                tableBody.querySelectorAll(
                    "tr:not(.probation-empty-row)"
                );


            rows.forEach(
                row => {

                    const statusElement =
                        row.querySelector(
                            ".probation-status"
                        );


                    if (!statusElement) {
                        return;
                    }


                    const statusText =
                        statusElement.textContent
                            .trim()
                            .toLowerCase();


                    let shouldShow =
                        true;


                    if (
                        selectedStatus ===
                        "probation"
                    ) {

                        shouldShow =
                            statusText ===
                            "on probation";

                    }


                    if (
                        selectedStatus ===
                        "due_soon"
                    ) {

                        shouldShow =
                            statusText ===
                                "due soon" ||
                            statusText ===
                                "due today";

                    }


                    if (
                        selectedStatus ===
                        "overdue"
                    ) {

                        shouldShow =
                            statusText ===
                            "overdue";

                    }


                    if (
                        selectedStatus ===
                        "confirmed"
                    ) {

                        shouldShow =
                            statusText ===
                            "confirmed";

                    }


                    row.style.display =
                        shouldShow
                            ? ""
                            : "none";

                }
            );

        }
    );

}

}

const probationModal =
    byId("probationActionModal");

const closeProbationModalBtn =
    byId("closeProbationModalBtn");

const cancelProbationDecisionBtn =
    byId("cancelProbationDecisionBtn");


function closeProbationModal() {

    if (!probationModal) {
        return;
    }

    probationModal.classList.remove(
        "active"
    );

}


if (closeProbationModalBtn) {

    closeProbationModalBtn.addEventListener(
        "click",
        closeProbationModal
    );

}


if (cancelProbationDecisionBtn) {

    cancelProbationDecisionBtn.addEventListener(
        "click",
        closeProbationModal
    );

}

const probationDecisionInputs =
    document.querySelectorAll(
        'input[name="probationDecision"]'
    );

const probationConfirmFields =
    byId("probationConfirmFields");

const probationExtensionFields =
    byId("probationExtensionFields");


function updateProbationDecisionFields() {

    const selectedDecision =
        document.querySelector(
            'input[name="probationDecision"]:checked'
        );


    if (probationConfirmFields) {

        probationConfirmFields.style.display =
            "none";

    }


    if (probationExtensionFields) {

        probationExtensionFields.style.display =
            "none";

    }


    if (!selectedDecision) {
        return;
    }


    if (
        selectedDecision.value ===
        "confirm"
    ) {

        if (probationConfirmFields) {

            probationConfirmFields.style.display =
                "block";

        }

    }


    if (
        selectedDecision.value ===
        "extend"
    ) {

        if (probationExtensionFields) {

            probationExtensionFields.style.display =
                "block";

        }

    }

}


probationDecisionInputs.forEach(
    input => {

        input.addEventListener(
            "change",
            updateProbationDecisionFields
        );

    }
);


updateProbationDecisionFields();

const saveProbationDecisionBtn =
    byId("saveProbationDecisionBtn");


if (saveProbationDecisionBtn) {

    saveProbationDecisionBtn.addEventListener(
        "click",
        async () => {

            const selectedDecision =
                document.querySelector(
                    'input[name="probationDecision"]:checked'
                );


            if (!selectedDecision) {

                alert(
                    "Please select a decision."
                );

                return;

            }


           


            const confirmationDate =
                byId(
                    "probationConfirmationDate"
                )?.value;


            const decisionNote =
                byId(
                    "probationDecisionNote"
                )?.value.trim() || "";


          if (
    selectedDecision.value === "confirm" &&
    !confirmationDate
) {

    alert(
        "Please select the confirmation effective date."
    );

    return;

} 


            if (!selectedProbationEmployeeId) {

                alert(
                    "Employee could not be identified."
                );

                return;

            }


            try {

                saveProbationDecisionBtn.disabled =
                    true;

                saveProbationDecisionBtn.textContent =
                    "Saving...";


           if (
    selectedDecision.value ===
    "confirm"
) {

    await window.adminUpdateDoc(
        window.adminDoc(
            window.adminDB,
            "employees",
            selectedProbationEmployeeId
        ),
        {
            probationStatus:
                "confirmed",

            confirmationDate:
                confirmationDate,

            probationDecisionNote:
                decisionNote,

            confirmedAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        }
    );

} else if (
    selectedDecision.value ===
    "extend"
) {

    const extensionDate =
        byId(
            "probationExtensionDate"
        )?.value;

    const extensionReason =
        byId(
            "probationExtensionReason"
        )?.value;


    if (!extensionDate) {

        alert(
            "Please select the new probation end date."
        );

        return;

    }


    if (!extensionReason) {

        alert(
            "Please select an extension reason."
        );

        return;

    }


    await window.adminUpdateDoc(
        window.adminDoc(
            window.adminDB,
            "employees",
            selectedProbationEmployeeId
        ),
        {
            probationStatus:
                "probation",

            probationEndDate:
                extensionDate,

            probationExtensionReason:
                extensionReason,

            probationDecisionNote:
                decisionNote,

            probationExtendedAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        }
    );

}  


                alert(
                    "Employee confirmed successfully."
                );


                closeProbationModal();


                await loadEmployees();

                updateProbationDashboard();


            } catch (error) {

                console.error(
                    "Probation confirmation failed:",
                    error
                );

                alert(
                    "Failed to confirm employee.\n\n" +
                    error.message
                );

            } finally {

                saveProbationDecisionBtn.disabled =
                    false;

                saveProbationDecisionBtn.textContent =
                    "Save Decision";

            }

        }
    );

}

// ========================================
// ATTENDANCE FILTER
// ========================================

filterBtn.addEventListener(
    "click",
    async () => {

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
                    record => {

                        if (

                            selectedDate &&

                            getRecordDateKey(
                                record
                            ) !==
                            selectedDate

                        ) {

                            return false;

                        }


                        if (
                            selectedEmployee
                        ) {

                            const name =
                                String(

                                    record.employeeName ||
                                    ""

                                ).toLowerCase();


                            const id =
                                String(

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

                            const normalizedStatus =
                                record.status ===
                                "completed"

                                    ? "checked-out"

                                    : record.status;


                            if (

                                normalizedStatus !==
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


        } catch (
            error
        ) {

            console.error(
                "ATTENDANCE FILTER ERROR:",
                error
            );

        }

    }
);


resetBtn.addEventListener(
    "click",
    () => {

        filterDate.value =
            "";


        filterEmployee.value =
            "";


        filterStatus.value =
            "all";


        loadAttendance();

    }
);
// ========================================
// CREATE EMPLOYEE
// ========================================

employeeForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            byId(
                "employeeNameInput"
            ).value.trim();


        const employeeId =
            byId(
                "employeeIdInput"
            ).value.trim();


        const email =
            byId(
                "employeeEmailInput"
            ).value.trim();


        const phone =
            byId(
                "employeePhoneInput"
            ).value.trim();


        const dateOfBirth =
            byId(
                "employeeDobInput"
            ).value;


        const nid =
            byId(
                "employeeNidInput"
            ).value.trim();


        const emergencyContact =
            byId(
                "employeeEmergencyContactInput"
            ).value.trim();


        const presentAddress =
            byId(
                "employeePresentAddressInput"
            ).value.trim();


        const password =
            byId(
                "employeePasswordInput"
            ).value;


        const department =
            byId(
                "departmentInput"
            ).value.trim();


        const designation =
            byId(
                "designationInput"
            ).value.trim();


        const office =
            byId(
                "officeInput"
            ).value.trim();


        const joiningDate =
            byId(
                "joiningDateInput"
            ).value;


        const employmentType =
            byId(
                "employmentTypeInput"
            ).value;


        const probationEndDate =
            byId(
                "probationEndDateInput"
            ).value;


        const statusElement =
            document.querySelector(
                'input[name="employeeStatus"]:checked'
            );


        const status =
            statusElement
                ? statusElement.value
                : "active";


        if (
            !name ||
            !employeeId ||
            !email ||
            !phone ||
            !dateOfBirth ||
            !password ||
            !department ||
            !designation ||
            !office ||
            !joiningDate ||
            !employmentType
        ) {

            alert(
                "Please fill in all required employee information."
            );

            return;

        }


        if (
            password.length <
            6
        ) {

            alert(
                "Employee password must be at least 6 characters."
            );

            return;

        }


        employeeFormStatus.textContent =
            "Creating employee...";


        employeeFormStatus.style.color =
            "";


        try {

            const employeeSnapshot =
                await window.adminGetDocs(

                    window.adminCollection(

                        window.adminDB,

                        "employees"

                    )

                );


            const duplicateEmployee =
                employeeSnapshot.docs.find(

                    employeeDoc =>
                        employeeDoc
                            .data()
                            .employeeId ===
                        employeeId

                );


            if (
                                duplicateEmployee
            ) {

                employeeFormStatus.textContent =
                    "Employee ID already exists.";


                employeeFormStatus.style.color =
                    "red";


                alert(
                    "This Employee ID is already assigned to another employee."
                );


                return;

            }


            employeeFormStatus.textContent =
                "Creating employee login account...";


            const userCredential =
                await window.adminCreateUser(

                    window.employeeAuth,

                    email,

                    password

                );


            const user =
                userCredential.user;


            employeeFormStatus.textContent =
                "Saving employee profile...";


            await window.adminSetDoc(

                window.adminDoc(

                    window.adminDB,

                    "employees",

                    user.uid

                ),

                {

                    uid:
                        user.uid,


                    name,

                    employeeId,

                    email,

                    phone,

                    dateOfBirth,

                    nid,

                    emergencyContact,

                    presentAddress,

                    department,

                    designation,

                    office,

                    joiningDate,

                    employmentType,

                    probationEndDate,

                    status,


                    roles:
                        [
                            "employee"
                        ],


                    createdAt:
                        new Date()
                            .toISOString()

                }

            );


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


            if (
                activeRadio
            ) {

                activeRadio.checked =
                    true;

            }


            await loadEmployees();


        } catch (
            error
        ) {

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
// LEAVE MANAGEMENT
// ========================================

async function loadLeaveRequests(
    showErrorInTable = true
) {

    if (
        !leaveRequestsTableBody
    ) {

        return;

    }


    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(

                    window.adminDB,

                    "leaveRequests"

                )

            );


        leaveRequests =
            snapshot.docs.map(

                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })

            );


        leaveRequests.sort(

            (
                a,
                b
            ) =>

                String(
                    b.requestedAt ||
                    ""
                )
                    .localeCompare(

                        String(
                            a.requestedAt ||
                            ""
                        )

                    )

        );


        renderLeaveRequests();
renderLeaveSummaryChart(
    leaveRequests
);

        try {

            const records =
                await getAttendanceRecords();


            updateAttendanceSummary(
                records
            );


        } catch (
            error
        ) {

            console.error(
                "KPI REFRESH ERROR:",
                error
            );

        }


    } catch (
        error
    ) {

        console.error(
            "LOAD LEAVE REQUESTS ERROR:",
            error
        );


        leaveRequests =
            [];


        if (
            showErrorInTable
        ) {

            leaveRequestsTableBody.innerHTML = `

                <tr>

                    <td colspan="8">

                        Unable to load leave requests. Firestore Rules for leaveRequests may not be enabled yet.

                    </td>

                </tr>

            `;

        }

    }

}


// ========================================
// RENDER LEAVE REQUESTS
// ========================================

function renderLeaveRequests() {

    if (
        !leaveRequestsTableBody
    ) {

        return;

    }


    if (
        leaveRequests.length ===
        0
    ) {

        leaveRequestsTableBody.innerHTML = `

            <tr>

                <td colspan="8">

                    No leave requests found.

                </td>

            </tr>

        `;


        return;

    }


    leaveRequestsTableBody.innerHTML =
        "";


    leaveRequests.forEach(
        request => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                request.status ||
                "pending";


            let actionHtml =
                `<span>-</span>`;


            if (
                status ===
                "pending"
            ) {

                actionHtml = `

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="approve-leave-btn"
                            data-id="${escapeHtml(
                                request.firestoreId
                            )}"
                        >
                            Approve
                        </button>


                        <button
                            type="button"
                            class="reject-leave-btn"
                            data-id="${escapeHtml(
                                request.firestoreId
                            )}"
                        >
                            Reject
                        </button>

                    </div>

                `;

            }


            row.innerHTML = `

                <td>

                    ${escapeHtml(
                        request.employeeName ||
                        "-"
                    )}

                    <br>

                    <small>

                        ${escapeHtml(
                            request.employeeId ||
                            "-"
                        )}

                    </small>

                </td>


                <td>

                    ${escapeHtml(
                        request.leaveType ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(

                        formatDate(
                            request.fromDate
                        )

                    )}

                </td>


                <td>

                    ${escapeHtml(

                        formatDate(
                            request.toDate
                        )

                    )}

                </td>


                <td>

                    ${escapeHtml(
                        request.totalDays ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        request.reason ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(

                        status ===
                        "approved"

                            ? "Approved"

                            : status ===
                              "rejected"

                                ? "Rejected"

                                : "Pending"

                    )}

                </td>


                <td>

                    ${actionHtml}

                </td>

            `;


            leaveRequestsTableBody
                .appendChild(
                    row
                );

        }
    );


    attachLeaveActionEvents();

}


// ========================================
// LEAVE ACTION BUTTONS
// ========================================

function attachLeaveActionEvents() {

    document
        .querySelectorAll(
            ".approve-leave-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateLeaveStatus(

                            button.dataset.id,

                            "approved"

                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".reject-leave-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateLeaveStatus(

                            button.dataset.id,

                            "rejected"

                        );

                    }
                );

            }
        );

}


// ========================================
// APPROVE / REJECT LEAVE
// ========================================

async function updateLeaveStatus(
    firestoreId,
    status
) {

    const request =
        leaveRequests.find(

            item =>
                item.firestoreId ===
                firestoreId

        );

        if (
        !request
    ) {

        return;

    }


    const action =
        status ===
        "approved"

            ? "approve"

            : "reject";


    const confirmed =
        confirm(

            `Are you sure you want to ${action} this leave request?`

        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        await window.adminUpdateDoc(

            window.adminDoc(

                window.adminDB,

                "leaveRequests",

                firestoreId

            ),

            {

                status,


                reviewedAt:
                    new Date()
                        .toISOString(),


                reviewedByUid:
                    window
                        .adminAuth
                        .currentUser
                        ?.uid ||
                    "",


                reviewedByEmail:
                    window
                        .adminAuth
                        .currentUser
                        ?.email ||
                    ""

            }

        );


        alert(

            status ===
            "approved"

                ? "Leave request approved."

                : "Leave request rejected."

        );


        await loadLeaveRequests(
            true
        );


    } catch (
        error
    ) {

        console.error(
            "LEAVE UPDATE ERROR:",
            error
        );


        alert(

            "Failed to update leave request.\n\n" +
            error.message

        );

    }

}

// ========================================
// ADMIN PROFILE DROPDOWN
// ========================================

adminProfileMenuBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        adminProfileDropdown
            .classList
            .toggle(
                "active"
            );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !adminProfileDropdown ||
            !adminProfileMenuBtn
        ) {

            return;

        }


        if (
            !adminProfileDropdown.contains(
                event.target
            ) &&
            !adminProfileMenuBtn.contains(
                event.target
            )
        ) {

            adminProfileDropdown
                .classList
                .remove(
                    "active"
                );

        }

    }
);


// ========================================
// ADMIN PROFILE
// ========================================

function populateAdminProfile() {

    if (
        !currentAdminEmployee
    ) {

        return;

    }


    const employee =
        currentAdminEmployee;


    adminHeaderName.textContent =
        employee.name ||
        "Admin";


    adminHeaderDesignation.textContent =
        employee.designation ||
        "Administrator";


    setText(
        "adminProfileName",
        employee.name
    );


    setText(
        "adminProfileEmployeeId",
        employee.employeeId
    );


    setText(
        "adminProfileEmail",
        employee.email
    );


    setText(
        "adminProfilePhone",
        employee.phone
    );


    setText(
        "adminProfileDepartment",
        employee.department
    );


    setText(
        "adminProfileDesignation",
        employee.designation
    );


    setText(
        "adminProfileOffice",
        employee.office
    );


    setText(
        "adminProfileJoiningDate",

        employee.joiningDate
            ? formatDate(
                employee.joiningDate
            )
            : "-"
    );


    setText(
        "adminProfileEmploymentType",
        employee.employmentType
    );


    setText(
        "adminProfileStatus",

        employee.status ===
        "active"

            ? "Active"

            : "Inactive"
    );

}


// ========================================
// OPEN ADMIN PROFILE
// ========================================

adminMyProfileBtn.addEventListener(
    "click",
    () => {

        populateAdminProfile();


        adminProfileDropdown
            .classList
            .remove(
                "active"
            );


        adminMyProfileModal
            .classList
            .add(
                "active"
            );

    }
);


// ========================================
// CLOSE ADMIN PROFILE
// ========================================

function closeAdminProfileModal() {

    adminMyProfileModal
        .classList
        .remove(
            "active"
        );

}


closeAdminMyProfileBtn.addEventListener(
    "click",
    closeAdminProfileModal
);


adminMyProfileModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            adminMyProfileModal
        ) {

            closeAdminProfileModal();

        }

    }
);


// ========================================
// ESCAPE KEY
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        adminProfileDropdown
            ?.classList
            .remove(
                "active"
            );


        adminMyProfileModal
            ?.classList
            .remove(
                "active"
            );


        employeeModal
            ?.classList
            .remove(
                "active"
            );

    }
);


// ========================================
// LOGOUT
// ========================================

adminLogoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await window.adminSignOut(
                window.adminAuth
            );


            window.location.href =
                "index.html";


        } catch (
            error
        ) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

        }

    }
);


// ========================================
// ADMIN DATE
// ========================================

if (
    adminDate
) {

    adminDate.textContent =
        new Date()
            .toLocaleDateString(
                "en-GB",
                {

                    weekday:
                        "long",

                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"

                }
            );

}


// ========================================
// ADMIN SECURITY + STARTUP
// ========================================

window.adminOnAuthStateChanged(

    window.adminAuth,

    async user => {

        if (
            !user
        ) {

            window.location.href =
                "index.html";


            return;

        }


        try {

            const employeeQuery =
                window.adminQuery(

                    window.adminCollection(

                        window.adminDB,

                        "employees"

                    ),

                    window.adminWhere(

                        "email",

                        "==",

                        user.email

                    )

                );


            const employeeSnapshot =
                await window.adminGetDocs(
                    employeeQuery
                );


            const employeeDocument =
                employeeSnapshot.docs[0];


            if (
                !employeeDocument
            ) {

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
                {

                    firestoreId:
                        employeeDocument.id,

                    ...employeeDocument.data()

                };


         const roles =
    employee.roles ||
    [];


const isAdminUser =
    roles.includes(
        "admin"
    );


let moderatorAccess =
    null;


if (!isAdminUser) {

    const moderatorAccessDoc =
        await window.adminGetDoc(
            window.adminDoc(
                window.adminDB,
                "admins",
                user.uid
            )
        );


    if (
        moderatorAccessDoc.exists()
    ) {
        moderatorAccess =
            moderatorAccessDoc.data();
    }

}


const isActiveModerator =
    moderatorAccess?.role ===
        "moderator" &&
    moderatorAccess?.active ===
        true;

        if (isAdminUser) {

    currentAdminAccess = {
        role: "admin",
        active: true,
        permissions: {}
    };

} else {

    currentAdminAccess =
        moderatorAccess;

}

applyAdminModulePermissions();

if (
    !isAdminUser &&
    !isActiveModerator
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


            // Save current admin profile



            currentAdminEmployee =
                employee;


            populateAdminProfile();


            console.log(
                "Admin access verified."
            );


            // Show page only after admin verification

            document.body.style.visibility =
                "visible";


const savedPage =
    localStorage.getItem(
        "dazzleAdminActivePage"
    );

let pageToOpen =
    pageMap[savedPage]
        ? savedPage
        : "home";


// Moderator হলে saved page-এর
// permission আছে কি না check করবে
if (!isFullAdmin()) {

    const savedPermission =
        pagePermissionMap[
            pageToOpen
        ];

    const savedPageAllowed =
        pageToOpen !==
            "rolesPermissions" &&
        savedPermission &&
        hasAdminPermission(
            savedPermission
        );


    // Saved page allowed না হলে
    // প্রথম permitted page খুঁজবে
    if (!savedPageAllowed) {

        pageToOpen =
            Object
                .keys(
                    pagePermissionMap
                )
                .find(
                    pageName =>
                        pageMap[
                            pageName
                        ] &&
                        hasAdminPermission(
                            pagePermissionMap[
                                pageName
                            ]
                        )
                );
    }
}


if (pageToOpen) {

    await showPage(
        pageToOpen
    );

}


        } catch (
            error
        ) {

            console.error(
                "ADMIN SECURITY ERROR:",
                error
            );




            alert(
                "Unable to verify admin access."
            );


            try {

                await window.adminSignOut(
                    window.adminAuth
                );

            } catch (
                signOutError
            ) {

                console.error(
                    signOutError
                );

            }


            window.location.href =
                "index.html";

        }

    }

);

// ========================================================
// ORGANIZATION STRUCTURE
// Departments / Designations / Branches
// ========================================================


// ========================================
// ELEMENTS
// ========================================

const departmentForm =
    byId("departmentForm");

const departmentNameInput =
    byId("departmentNameInput");

const departmentCodeInput =
    byId("departmentCodeInput");

const departmentStatusInput =
    byId("departmentStatusInput");

const departmentFormStatus =
    byId("departmentFormStatus");

const departmentsTableBody =
    byId("departmentsTableBody");


const designationForm =
    byId("designationForm");

const designationNameInput =
    byId("designationNameInput");

const designationDepartmentInput =
    byId("designationDepartmentInput");

const designationStatusInput =
    byId("designationStatusInput");

const designationFormStatus =
    byId("designationFormStatus");

const designationsTableBody =
    byId("designationsTableBody");


const branchForm =
    byId("branchForm");

const branchNameInput =
    byId("branchNameInput");

const branchCodeInput =
    byId("branchCodeInput");

const branchTypeInput =
    byId("branchTypeInput");

const branchCityInput =
    byId("branchCityInput");

const branchAddressInput =
    byId("branchAddressInput");

const branchStatusInput =
    byId("branchStatusInput");

const branchFormStatus =
    byId("branchFormStatus");

const branchesTableBody =
    byId("branchesTableBody");


// ========================================
// DATA
// ========================================

let departments = [];
let designations = [];
let branches = [];

let editingDepartmentId = null;
let editingDesignationId = null;
let editingBranchId = null;


// ========================================
// LOAD ORGANIZATION DATA
// ========================================

async function loadOrganizationData() {

    await loadDepartments();

    populateDesignationDepartmentDropdown();

    await Promise.all([
        loadDesignations(),
        loadBranches()
    ]);
}


// ========================================
// LOAD DEPARTMENTS
// ========================================

async function loadDepartments() {

    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "departments"
                )

            );


        departments =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


        departments.sort(
            (a, b) =>
                String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    )
                )
        );


        renderDepartments();


    } catch (error) {

        console.error(
            "LOAD DEPARTMENTS ERROR:",
            error
        );


        departmentsTableBody.innerHTML = `

            <tr>
                <td colspan="4">
                    Unable to load departments.
                </td>
            </tr>

        `;
    }
}


// ========================================
// RENDER DEPARTMENTS
// ========================================

function renderDepartments() {

    if (
        departments.length === 0
    ) {

        departmentsTableBody.innerHTML = `

            <tr>
                <td colspan="4">
                    No departments found.
                </td>
            </tr>

        `;

        return;
    }


    departmentsTableBody.innerHTML = "";


    departments.forEach(
        department => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                department.status ||
                "active";


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        department.name || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        department.code || "-"
                    )}
                </td>

                <td>

                    <span
                        class="organization-status ${status}"
                    >
                        ${
                            status === "active"
                                ? "Active"
                                : "Inactive"
                        }
                    </span>

                </td>

                <td>

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="edit-organization-btn edit-department-btn"
                            data-id="${department.firestoreId}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="toggle-organization-btn toggle-department-btn"
                            data-id="${department.firestoreId}"
                        >
                            ${
                                status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>

                        <button
                            type="button"
                            class="delete-organization-btn delete-department-btn"
                            data-id="${department.firestoreId}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            departmentsTableBody
                .appendChild(
                    row
                );
        }
    );


    attachDepartmentActions();
}


// ========================================
// DEPARTMENT FORM
// ========================================

departmentForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            departmentNameInput
                .value
                .trim();


        const code =
            departmentCodeInput
                .value
                .trim();


        const status =
            departmentStatusInput.value;


        if (!name) {

            alert(
                "Department name is required."
            );

            return;
        }


        const duplicate =
            departments.find(
                department =>

                    department.firestoreId !==
                    editingDepartmentId &&

                    department.name
                        ?.trim()
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (duplicate) {

            alert(
                "This department already exists."
            );

            return;
        }


        departmentFormStatus.textContent =
            editingDepartmentId
                ? "Updating department..."
                : "Adding department...";


        try {

            if (
                editingDepartmentId
            ) {

                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "departments",
                        editingDepartmentId
                    ),

                    {
                        name,
                        code,
                        status,

                        updatedAt:
                            new Date()
                                .toISOString()
                    }
                );


                editingDepartmentId =
                    null;


                alert(
                    "Department updated successfully."
                );


            } else {

                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "departments"
                    ),

                    {
                        name,
                        code,
                        status,

                        createdAt:
                            new Date()
                                .toISOString()
                    }
                );


                alert(
                    "Department added successfully."
                );
            }


            departmentForm.reset();

            departmentStatusInput.value =
                "active";


            const submitButton =
                departmentForm.querySelector(
                    'button[type="submit"]'
                );


            submitButton.textContent =
                "+ Add Department";


            departmentFormStatus.textContent =
                "";


            await loadDepartments();

            populateDesignationDepartmentDropdown();


        } catch (error) {

            console.error(
                "DEPARTMENT SAVE ERROR:",
                error
            );


            departmentFormStatus.textContent =
                "Failed to save department.";


            alert(
                "Failed to save department.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// DEPARTMENT ACTIONS
// ========================================

function attachDepartmentActions() {

    document
        .querySelectorAll(
            ".edit-department-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const department =
                            departments.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!department) {
                            return;
                        }


                        editingDepartmentId =
                            department.firestoreId;


                        departmentNameInput.value =
                            department.name || "";


                        departmentCodeInput.value =
                            department.code || "";


                        departmentStatusInput.value =
                            department.status ||
                            "active";


                        const submitButton =
                            departmentForm
                                .querySelector(
                                    'button[type="submit"]'
                                );


                        submitButton.textContent =
                            "Save Changes";


                        departmentNameInput.focus();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".toggle-department-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const department =
                            departments.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!department) {
                            return;
                        }


                        const newStatus =
                            department.status ===
                            "inactive"

                                ? "active"

                                : "inactive";


                        try {

                            await window.adminUpdateDoc(

                                window.adminDoc(
                                    window.adminDB,
                                    "departments",
                                    department.firestoreId
                                ),

                                {
                                    status:
                                        newStatus,

                                    updatedAt:
                                        new Date()
                                            .toISOString()
                                }
                            );


                            await loadDepartments();

                            populateDesignationDepartmentDropdown();


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Failed to change department status."
                            );
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".delete-department-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const department =
                            departments.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!department) {
                            return;
                        }


                        const usedByDesignation =
                            designations.some(
                                designation =>
                                    designation.departmentId ===
                                    department.firestoreId
                            );


                        if (usedByDesignation) {

                            alert(
                                "This department cannot be deleted because one or more designations are assigned to it."
                            );

                            return;
                        }


                        const usedByEmployee =
                            employees.some(
                                employee =>
                                    employee.department ===
                                    department.name
                            );


                        if (usedByEmployee) {

                            alert(
                                                                "This department cannot be deleted because employees are currently assigned to it."
                            );

                            return;
                        }


                        const confirmed =
                            confirm(
                                `Delete department "${department.name}"?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            await window.adminDeleteDoc(

                                window.adminDoc(
                                    window.adminDB,
                                    "departments",
                                    department.firestoreId
                                )
                            );


                            await loadDepartments();

                            populateDesignationDepartmentDropdown();


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Failed to delete department."
                            );
                        }
                    }
                );
            }
        );
}


// ========================================
// DESIGNATION DEPARTMENT DROPDOWN
// ========================================

function populateDesignationDepartmentDropdown() {

    const currentValue =
        designationDepartmentInput.value;


    designationDepartmentInput.innerHTML = `

        <option value="">
            Select Department
        </option>

    `;


    departments
        .filter(
            department =>
                department.status !==
                "inactive"
        )
        .forEach(
            department => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    department.firestoreId;


                option.textContent =
                    department.name;


                designationDepartmentInput
                    .appendChild(
                        option
                    );
            }
        );


    if (
        currentValue &&
        departments.some(
            department =>
                department.firestoreId ===
                currentValue
        )
    ) {

        designationDepartmentInput.value =
            currentValue;
    }
}


// ========================================
// LOAD DESIGNATIONS
// ========================================

async function loadDesignations() {

    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "designations"
                )

            );


        designations =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


        designations.sort(
            (a, b) =>
                String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    )
                )
        );


        renderDesignations();


    } catch (error) {

        console.error(
            "LOAD DESIGNATIONS ERROR:",
            error
        );


        designationsTableBody.innerHTML = `

            <tr>
                <td colspan="4">
                    Unable to load designations.
                </td>
            </tr>

        `;
    }
}


// ========================================
// RENDER DESIGNATIONS
// ========================================

function renderDesignations() {

    if (
        designations.length === 0
    ) {

        designationsTableBody.innerHTML = `

            <tr>
                <td colspan="4">
                    No designations found.
                </td>
            </tr>

        `;

        return;
    }


    designationsTableBody.innerHTML =
        "";


    designations.forEach(
        designation => {

            const status =
                designation.status ||
                "active";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        designation.name || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        designation.departmentName || "-"
                    )}
                </td>

                <td>

                    <span
                        class="organization-status ${status}"
                    >
                        ${
                            status === "active"
                                ? "Active"
                                : "Inactive"
                        }
                    </span>

                </td>

                <td>

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="edit-organization-btn edit-designation-btn"
                            data-id="${designation.firestoreId}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="toggle-organization-btn toggle-designation-btn"
                            data-id="${designation.firestoreId}"
                        >
                            ${
                                status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>

                        <button
                            type="button"
                            class="delete-organization-btn delete-designation-btn"
                            data-id="${designation.firestoreId}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            designationsTableBody
                .appendChild(
                    row
                );
        }
    );


    attachDesignationActions();
}


// ========================================
// DESIGNATION FORM
// ========================================

designationForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            designationNameInput
                .value
                .trim();


        const departmentId =
            designationDepartmentInput.value;


        const status =
            designationStatusInput.value;


        const department =
            departments.find(
                item =>
                    item.firestoreId ===
                    departmentId
            );


        if (
            !name ||
            !department
        ) {

            alert(
                "Designation and Department are required."
            );

            return;
        }


        const duplicate =
            designations.find(
                designation =>

                    designation.firestoreId !==
                    editingDesignationId &&

                    designation.name
                        ?.trim()
                        .toLowerCase() ===
                    name.toLowerCase() &&

                    designation.departmentId ===
                    departmentId
            );


        if (duplicate) {

            alert(
                "This designation already exists in this department."
            );

            return;
        }


        designationFormStatus.textContent =
            editingDesignationId
                ? "Updating designation..."
                : "Adding designation...";


        try {

            const data = {

                name,

                departmentId,

                departmentName:
                    department.name,

                status,

                updatedAt:
                    new Date()
                        .toISOString()
            };


            if (
                editingDesignationId
            ) {

                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "designations",
                        editingDesignationId
                    ),

                    data
                );


                editingDesignationId =
                    null;


                alert(
                    "Designation updated successfully."
                );


            } else {

                delete data.updatedAt;


                data.createdAt =
                    new Date()
                        .toISOString();


                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "designations"
                    ),

                    data
                );


                alert(
                    "Designation added successfully."
                );
            }


            designationForm.reset();

            designationStatusInput.value =
                "active";


            const submitButton =
                designationForm
                    .querySelector(
                        'button[type="submit"]'
                    );


            submitButton.textContent =
                "+ Add Designation";


            designationFormStatus.textContent =
                "";


            populateDesignationDepartmentDropdown();

            await loadDesignations();


        } catch (error) {

            console.error(
                "DESIGNATION SAVE ERROR:",
                error
            );


            designationFormStatus.textContent =
                "Failed to save designation.";


            alert(
                "Failed to save designation.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// DESIGNATION ACTIONS
// ========================================

function attachDesignationActions() {

    document
        .querySelectorAll(
            ".edit-designation-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const designation =
                            designations.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!designation) {
                            return;
                        }


                        editingDesignationId =
                            designation.firestoreId;


                        designationNameInput.value =
                            designation.name || "";


                        designationDepartmentInput.value =
                            designation.departmentId || "";


                        designationStatusInput.value =
                            designation.status ||
                            "active";


                        designationForm
                            .querySelector(
                                'button[type="submit"]'
                            )
                            .textContent =
                            "Save Changes";


                        designationNameInput.focus();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".toggle-designation-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const designation =
                            designations.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!designation) {
                            return;
                        }


                        const newStatus =
                            designation.status ===
                            "inactive"

                                ? "active"

                                : "inactive";


                        await window.adminUpdateDoc(

                            window.adminDoc(
                                window.adminDB,
                                "designations",
                                designation.firestoreId
                            ),

                            {
                                status:
                                    newStatus,

                                updatedAt:
                                    new Date()
                                        .toISOString()
                            }
                        );


                        await loadDesignations();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".delete-designation-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const designation =
                            designations.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!designation) {
                            return;
                        }


                        const usedByEmployee =
                            employees.some(
                                employee =>
                                    employee.designation ===
                                                                    designation.name
                            );


                        if (usedByEmployee) {

                            alert(
                                "This designation cannot be deleted because employees are assigned to it."
                            );

                            return;
                        }


                        if (
                            !confirm(
                                `Delete designation "${designation.name}"?`
                            )
                        ) {

                            return;
                        }


                        await window.adminDeleteDoc(

                            window.adminDoc(
                                window.adminDB,
                                "designations",
                                designation.firestoreId
                            )
                        );


                        await loadDesignations();
                    }
                );
            }
        );
}


// ========================================
// LOAD BRANCHES
// ========================================

async function loadBranches() {

    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "branches"
                )

            );


        branches =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


        branches.sort(
            (a, b) =>
                String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    )
                )
        );


        renderBranches();


    } catch (error) {

        console.error(
            "LOAD BRANCHES ERROR:",
            error
        );


        branchesTableBody.innerHTML = `

            <tr>
                <td colspan="6">
                    Unable to load branches.
                </td>
            </tr>

        `;
    }
}


// ========================================
// RENDER BRANCHES
// ========================================

function renderBranches() {

    if (
        branches.length === 0
    ) {

        branchesTableBody.innerHTML = `

            <tr>
                <td colspan="6">
                    No branches found.
                </td>
            </tr>

        `;

        return;
    }


    branchesTableBody.innerHTML =
        "";


    branches.forEach(
        branch => {

            const status =
                branch.status ||
                "active";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        branch.name || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        branch.code || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        branch.type || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        branch.city || "-"
                    )}
                </td>

                <td>

                    <span
                        class="organization-status ${status}"
                    >
                        ${
                            status === "active"
                                ? "Active"
                                : "Inactive"
                        }
                    </span>

                </td>

                <td>

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="edit-organization-btn edit-branch-btn"
                            data-id="${branch.firestoreId}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="toggle-organization-btn toggle-branch-btn"
                            data-id="${branch.firestoreId}"
                        >
                            ${
                                status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>

                        <button
                            type="button"
                            class="delete-organization-btn delete-branch-btn"
                            data-id="${branch.firestoreId}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            branchesTableBody
                .appendChild(
                    row
                );
        }
    );


    attachBranchActions();
}


// ========================================
// BRANCH FORM
// ========================================

branchForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            branchNameInput
                .value
                .trim();


        const code =
            branchCodeInput
                .value
                .trim();


        const type =
            branchTypeInput.value;


        const city =
            branchCityInput
                .value
                .trim();


        const address =
            branchAddressInput
                .value
                .trim();


        const status =
            branchStatusInput.value;


        if (
            !name ||
            !type
        ) {

            alert(
                "Branch name and location type are required."
            );

            return;
        }


        const duplicate =
            branches.find(
                branch =>

                    branch.firestoreId !==
                    editingBranchId &&

                    branch.name
                        ?.trim()
                        .toLowerCase() ===
                    name.toLowerCase() &&

                    String(
                        branch.city || ""
                    ).toLowerCase() ===
                    city.toLowerCase()
            );


        if (duplicate) {

            alert(
                "This branch / office already exists."
            );

            return;
        }


        try {

            const data = {

                name,
                code,
                type,
                city,
                address,
                status,

                updatedAt:
                    new Date()
                        .toISOString()
            };


            if (
                editingBranchId
            ) {

                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "branches",
                        editingBranchId
                    ),

                    data
                );


                editingBranchId =
                    null;


                alert(
                    "Branch updated successfully."
                );


            } else {

                delete data.updatedAt;


                data.createdAt =
                    new Date()
                        .toISOString();


                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "branches"
                    ),

                    data
                );


                alert(
                    "Branch added successfully."
                );
            }


            branchForm.reset();

            branchStatusInput.value =
                "active";


            branchForm
                .querySelector(
                    'button[type="submit"]'
                )
                .textContent =
                "+ Add Branch";


            branchFormStatus.textContent =
                "";


            await loadBranches();


        } catch (error) {

            console.error(
                "BRANCH SAVE ERROR:",
                error
            );


            branchFormStatus.textContent =
                "Failed to save branch.";


            alert(
                "Failed to save branch.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// BRANCH ACTIONS
// ========================================

function attachBranchActions() {

    document
        .querySelectorAll(
            ".edit-branch-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const branch =
                            branches.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!branch) {
                            return;
                        }


                        editingBranchId =
                            branch.firestoreId;


                        branchNameInput.value =
                            branch.name || "";


                        branchCodeInput.value =
                            branch.code || "";


                        branchTypeInput.value =
                            branch.type || "";


                        branchCityInput.value =
                            branch.city || "";


                        branchAddressInput.value =
                            branch.address || "";


                        branchStatusInput.value =
                            branch.status ||
                            "active";


                        branchForm
                            .querySelector(
                                'button[type="submit"]'
                            )
                            .textContent =
                            "Save Changes";


                        branchNameInput.focus();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".toggle-branch-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const branch =
                            branches.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!branch) {
                            return;
                        }


                        const newStatus =
                            branch.status ===
                            "inactive"

                                ? "active"

                                : "inactive";


                        await window.adminUpdateDoc(

                            window.adminDoc(
                                window.adminDB,
                                "branches",
                                branch.firestoreId
                            ),

                            {
                                status:
                                    newStatus,

                                updatedAt:
                                    new Date()
                                        .toISOString()
                            }
                        );


                        await loadBranches();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".delete-branch-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const branch =
                            branches.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!branch) {
                            return;
                        }


                        const usedByEmployee =
                            employees.some(
                                employee =>
                                    employee.office ===
                                    branch.name
                            );


                        if (usedByEmployee) {

                            alert(
                                "This branch cannot be deleted because employees are currently assigned to it."
                            );

                            return;
                        }


                        if (
                            !confirm(
                                `Delete branch / office "${branch.name}"?`
                            )
                        ) {

                            return;
                        }


                        await window.adminDeleteDoc(

                            window.adminDoc(
                                window.adminDB,
                                "branches",
                                branch.firestoreId
                            )
                        );


                        await loadBranches();
                    }
                );
            }
        );
}


// ========================================
// LOAD WHEN ORGANIZATION PAGE OPENS
// ========================================

departmentsBranchesBtn.addEventListener(
    "click",
    async () => {

                await loadOrganizationData();

    }
);

// ========================================================
// SHIFT & WEEKLY OFF MANAGEMENT
// ========================================================


// ========================================
// ELEMENTS
// ========================================

const shiftForm =
    byId("shiftForm");

const shiftNameInput =
    byId("shiftNameInput");

const shiftStartTimeInput =
    byId("shiftStartTimeInput");

const shiftEndTimeInput =
    byId("shiftEndTimeInput");

const shiftGraceMinutesInput =
    byId("shiftGraceMinutesInput");

const shiftStatusInput =
    byId("shiftStatusInput");

const shiftFormStatus =
    byId("shiftFormStatus");

const shiftsTableBody =
    byId("shiftsTableBody");


const employeeShiftForm =
    byId("employeeShiftForm");

const shiftEmployeeInput =
    byId("shiftEmployeeInput");

const employeeShiftInput =
    byId("employeeShiftInput");

const employeeShiftFormStatus =
    byId("employeeShiftFormStatus");


const weeklyOffForm =
    byId("weeklyOffForm");

const weeklyOffEmployeeInput =
    byId("weeklyOffEmployeeInput");

const weeklyOffDayInput =
    byId("weeklyOffDayInput");

const weeklyOffFormStatus =
    byId("weeklyOffFormStatus");


const employeeScheduleTableBody =
    byId("employeeScheduleTableBody");


// ========================================
// DATA
// ========================================

let shifts = [];

let employeeSchedules = [];

let editingShiftId = null;


// ========================================
// LOAD SHIFT MODULE
// ========================================

async function loadShiftWeeklyOffModule() {

    await loadEmployees();

    await loadShifts();

    await loadEmployeeSchedules();

    populateScheduleEmployeeDropdowns();

    populateShiftDropdown();

    renderEmployeeSchedules();
}


// ========================================
// LOAD SHIFTS
// ========================================

async function loadShifts() {

    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "shifts"
                )

            );


        shifts =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


        shifts.sort(
            (a, b) =>
                String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    )
                )
        );


        renderShifts();


    } catch (error) {

        console.error(
            "LOAD SHIFTS ERROR:",
            error
        );


        shiftsTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    Unable to load shifts.
                </td>

            </tr>

        `;
    }
}


// ========================================
// RENDER SHIFTS
// ========================================

function renderShifts() {

    if (!shifts.length) {

        shiftsTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No shifts found.
                </td>

            </tr>

        `;

        return;
    }


    shiftsTableBody.innerHTML = "";


    shifts.forEach(
        shift => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                shift.status || "active";


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(
                            shift.name || "-"
                        )}
                    </strong>

                </td>


                <td>
                    ${escapeHtml(
                        shift.startTime || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        shift.endTime || "-"
                    )}
                </td>


                <td>

                    ${
                        Number(
                            shift.graceMinutes || 0
                        )
                    } min

                </td>


                <td>

                    <span
                        class="shift-status ${status}"
                    >

                        ${
                            status === "active"
                                ? "Active"
                                : "Inactive"
                        }

                    </span>

                </td>


                <td>

                    <div class="employee-actions">

                        <button
                            type="button"
                            class="edit-shift-btn"
                            data-id="${shift.firestoreId}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="toggle-shift-btn"
                            data-id="${shift.firestoreId}"
                        >

                            ${
                                status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }

                        </button>


                        <button
                            type="button"
                            class="delete-shift-btn"
                            data-id="${shift.firestoreId}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            shiftsTableBody.appendChild(row);
        }
    );


    attachShiftActions();
}


// ========================================
// CREATE / UPDATE SHIFT
// ========================================

shiftForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            shiftNameInput
                .value
                .trim();


        const startTime =
            shiftStartTimeInput.value;


        const endTime =
            shiftEndTimeInput.value;


        const graceMinutes =
            Number(
                shiftGraceMinutesInput.value || 0
            );


        const status =
            shiftStatusInput.value;


        if (
            !name ||
            !startTime ||
            !endTime
        ) {

            alert(
                "Shift name, start time and end time are required."
            );

            return;
        }


        if (graceMinutes < 0) {

            alert(
                "Grace minutes cannot be negative."
            );

            return;
        }


        const duplicate =
            shifts.find(
                shift =>

                    shift.firestoreId !==
                    editingShiftId &&

                    String(
                        shift.name || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (duplicate) {

            alert(
                "This shift already exists."
            );

            return;
        }


        shiftFormStatus.textContent =
            editingShiftId
                ? "Updating shift..."
                : "Adding shift...";


        try {

            const data = {

                name,

                startTime,

                endTime,

                graceMinutes,

                status
            };


            if (editingShiftId) {

                data.updatedAt =
                    new Date()
                        .toISOString();


                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "shifts",
                        editingShiftId
                    ),

                    data
                );


                editingShiftId =
                    null;


                alert(
                    "Shift updated successfully."
                );


            } else {

                data.createdAt =
                    new Date()
                        .toISOString();


                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "shifts"
                    ),

                    data
                );


                alert(
                    "Shift added successfully."
                );
            }


            shiftForm.reset();


            shiftGraceMinutesInput.value =
                "0";


            shiftStatusInput.value =
                "active";


            shiftForm
                .querySelector(
                    'button[type="submit"]'
                )
                .textContent =
                "+ Add Shift";


            shiftFormStatus.textContent =
                "";


            await loadShifts();


            populateShiftDropdown();


            await loadEmployeeSchedules();


            renderEmployeeSchedules();


        } catch (error) {

            console.error(
                "SHIFT SAVE ERROR:",
                error
            );


            shiftFormStatus.textContent =
                "Failed to save shift.";


            alert(
                "Failed to save shift.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// SHIFT ACTIONS
// ========================================

function attachShiftActions() {

    document
        .querySelectorAll(
            ".edit-shift-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const shift =
                            shifts.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!shift) {
                            return;
                        }


                        editingShiftId =
                            shift.firestoreId;


                        shiftNameInput.value =
                            shift.name || "";


                        shiftStartTimeInput.value =
                            shift.startTime || "";


                        shiftEndTimeInput.value =
                            shift.endTime || "";


                        shiftGraceMinutesInput.value =
                            Number(
                                shift.graceMinutes || 0
                            );


                        shiftStatusInput.value =
                            shift.status || "active";


                        shiftForm
                            .querySelector(
                                'button[type="submit"]'
                            )
                            .textContent =
                            "Save Changes";


                        shiftNameInput.focus();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".toggle-shift-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const shift =
                            shifts.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!shift) {
                            return;
                        }


                        const newStatus =
                            shift.status ===
                            "inactive"
                                ? "active"
                                : "inactive";


                        try {

                            await window.adminUpdateDoc(

                                window.adminDoc(
                                    window.adminDB,
                                    "shifts",
                                    shift.firestoreId
                                ),

                                {
                                    status:
                                        newStatus,

                                    updatedAt:
                                        new Date()
                                                       .toISOString()
                                }
                            );


                            await loadShifts();

                            populateShiftDropdown();

                            renderEmployeeSchedules();


                        } catch (error) {

                            console.error(
                                "SHIFT STATUS ERROR:",
                                error
                            );


                            alert(
                                "Failed to change shift status."
                            );
                        }
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".delete-shift-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const shift =
                            shifts.find(
                                item =>
                                    item.firestoreId ===
                                    button.dataset.id
                            );


                        if (!shift) {
                            return;
                        }


                        const used =
                            employeeSchedules.some(
                                schedule =>
                                    schedule.shiftId ===
                                    shift.firestoreId
                            );


                        if (used) {

                            alert(
                                "This shift cannot be deleted because employees are assigned to it."
                            );

                            return;
                        }


                        const confirmed =
                            confirm(
                                `Delete shift "${shift.name}"?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            await window.adminDeleteDoc(

                                window.adminDoc(
                                    window.adminDB,
                                    "shifts",
                                    shift.firestoreId
                                )
                            );


                            await loadShifts();

                            populateShiftDropdown();


                        } catch (error) {

                            console.error(
                                "DELETE SHIFT ERROR:",
                                error
                            );


                            alert(
                                "Failed to delete shift."
                            );
                        }
                    }
                );
            }
        );
}


// ========================================
// EMPLOYEE DROPDOWNS
// ========================================

function populateScheduleEmployeeDropdowns() {

    const dropdowns = [

        shiftEmployeeInput,

        weeklyOffEmployeeInput

    ];


    dropdowns.forEach(
        dropdown => {

            const current =
                dropdown.value;


            dropdown.innerHTML = `

                <option value="">
                    Select Employee
                </option>

            `;


            employees
                .filter(
                    employee =>
                        employee.status ===
                        "active"
                )
                .sort(
                    (a, b) =>
                        String(
                            a.name || ""
                        ).localeCompare(
                            String(
                                b.name || ""
                            )
                        )
                )
                .forEach(
                    employee => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            employee.firestoreId;


                        option.textContent =
                            `${employee.name || "-"} — ${employee.employeeId || "-"}`;


                        dropdown
                            .appendChild(
                                option
                            );
                    }
                );


            if (
                current &&
                employees.some(
                    employee =>
                        employee.firestoreId ===
                        current
                )
            ) {

                dropdown.value =
                    current;
            }
        }
    );
}


// ========================================
// SHIFT DROPDOWN
// ========================================

function populateShiftDropdown() {

    const current =
        employeeShiftInput.value;


    employeeShiftInput.innerHTML = `

        <option value="">
            Select Shift
        </option>

    `;


    shifts
        .filter(
            shift =>
                shift.status ===
                "active"
        )
        .forEach(
            shift => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    shift.firestoreId;


                option.textContent =
                    `${shift.name} (${shift.startTime} - ${shift.endTime})`;


                employeeShiftInput
                    .appendChild(
                        option
                    );
            }
        );


    if (
        current &&
        shifts.some(
            shift =>
                shift.firestoreId ===
                current
        )
    ) {

        employeeShiftInput.value =
            current;
    }
}


// ========================================
// LOAD EMPLOYEE SCHEDULES
// ========================================

async function loadEmployeeSchedules() {

    try {

        const snapshot =
            await window.adminGetDocs(

                window.adminCollection(
                    window.adminDB,
                    "employeeSchedules"
                )

            );


        employeeSchedules =
            snapshot.docs.map(
                documentSnapshot => ({

                    firestoreId:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                })
            );


    } catch (error) {

        console.error(
            "LOAD EMPLOYEE SCHEDULE ERROR:",
            error
        );


        employeeSchedules = [];
    }
}


// ========================================
// ASSIGN SHIFT
// ========================================

employeeShiftForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const employeeUid =
            shiftEmployeeInput.value;


        const shiftId =
            employeeShiftInput.value;


        const employee =
            employees.find(
                item =>
                    item.firestoreId ===
                    employeeUid
            );


        const shift =
            shifts.find(
                item =>
                    item.firestoreId ===
                    shiftId
            );


        if (
            !employee ||
            !shift
        ) {

            alert(
                "Please select an employee and shift."
            );

            return;
        }


        employeeShiftFormStatus.textContent =
            "Assigning shift...";


        try {

            const existing =
                employeeSchedules.find(
                    schedule =>
                        schedule.employeeUid ===
                        employeeUid
                );


            const scheduleData = {

                employeeUid,

                employeeId:
                    employee.employeeId || "",

                employeeName:
                    employee.name || "",

                office:
                    employee.office || "",

                department:
                    employee.department || "",

                designation:
                    employee.designation || "",

                shiftId:
                    shift.firestoreId,

                shiftName:
                    shift.name,

                shiftStartTime:
                    shift.startTime,

                shiftEndTime:
                    shift.endTime,

                graceMinutes:
                    Number(
                        shift.graceMinutes || 0
                    ),

                updatedAt:
                    new Date()
                        .toISOString()
            };


            if (existing) {

                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "employeeSchedules",
                        existing.firestoreId
                    ),

                    scheduleData
                );


            } else {

                scheduleData.weeklyOff = "";

                scheduleData.createdAt =
                    new Date()
                        .toISOString();


                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "employeeSchedules"
                    ),

                    scheduleData
                );
            }


            employeeShiftForm.reset();


            employeeShiftFormStatus.textContent =
                "";


            await loadEmployeeSchedules();

            renderEmployeeSchedules();


            alert(
                "Shift assigned successfully."
            );


        } catch (error) {

            console.error(
                "ASSIGN SHIFT ERROR:",
                error
            );


            employeeShiftFormStatus.textContent =
                "Failed to assign shift.";


            alert(
                "Failed to assign shift.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// WEEKLY OFF ASSIGNMENT
// ========================================

weeklyOffForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const employeeUid =
            weeklyOffEmployeeInput.value;


        const weeklyOff =
            weeklyOffDayInput.value;


        const employee =
            employees.find(
                item =>
                    item.firestoreId ===
                    employeeUid
            );


        if (
            !employee ||
            !weeklyOff
        ) {

            alert(
                "Please select employee and weekly off day."
            );

            return;
        }


        weeklyOffFormStatus.textContent =
            "Saving weekly off...";


        try {

            const existing =
                employeeSchedules.find(
                    schedule =>
                        schedule.employeeUid ===
                        employeeUid
                );


            if (existing) {

                await window.adminUpdateDoc(

                    window.adminDoc(
                        window.adminDB,
                        "employeeSchedules",
                        existing.firestoreId
                    ),

                    {

                        weeklyOff,

                        employeeId:
                            employee.employeeId || "",

                        employeeName:
                            employee.name || "",

                        office:
                            employee.office || "",

                        department:
                            employee.department || "",

                        designation:
                            employee.designation || "",

                        updatedAt:
                            new Date()
                                .toISOString()
                    }
                );


            } else {

                await window.adminAddDoc(

                    window.adminCollection(
                        window.adminDB,
                        "employeeSchedules"
                    ),

                    {

                        employeeUid,

                        employeeId:
                            employee.employeeId || "",

                        employeeName:
                            employee.name || "",

                        office:
                            employee.office || "",

                        department:
                            employee.department || "",

                        designation:
                            employee.designation || "",

                        shiftId: "",

                        shiftName: "",

                        shiftStartTime: "",

                        shiftEndTime: "",

                        graceMinutes: 0,

                        weeklyOff,

                        createdAt:
                            new Date()
                                .toISOString(),

                        updatedAt:
                            new Date()
                                .toISOString()
                    }
                );
            }


            weeklyOffForm.reset();


            weeklyOffFormStatus.textContent =
                "";


            await loadEmployeeSchedules();

            renderEmployeeSchedules();


            alert(
                                                             "Weekly off saved successfully."
            );


        } catch (error) {

            console.error(
                "WEEKLY OFF ERROR:",
                error
            );


            weeklyOffFormStatus.textContent =
                "Failed to save weekly off.";


            alert(
                "Failed to save weekly off.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// RENDER EMPLOYEE SCHEDULE TABLE
// ========================================

function renderEmployeeSchedules() {

    if (!employees.length) {

        employeeScheduleTableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No employees found.
                </td>

            </tr>

        `;

        return;
    }


    employeeScheduleTableBody.innerHTML = "";


    const sortedEmployees =
        [...employees]
            .filter(
                employee =>
                    employee.status ===
                    "active"
            )
            .sort(
                (a, b) =>
                    String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        )
                    )
            );


    sortedEmployees.forEach(
        employee => {

            const schedule =
                employeeSchedules.find(
                    item =>
                        item.employeeUid ===
                        employee.firestoreId
                );


            const shift =
                schedule?.shiftId
                    ? shifts.find(
                        item =>
                            item.firestoreId ===
                            schedule.shiftId
                    )
                    : null;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="schedule-employee-info">

                        <span class="schedule-employee-name">

                            ${escapeHtml(
                                employee.name || "-"
                            )}

                        </span>

                        <span class="schedule-employee-designation">

                            ${escapeHtml(
                                employee.designation || "-"
                            )}

                        </span>

                    </div>

                </td>


                <td>

                    ${escapeHtml(
                        employee.employeeId || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.office || "-"
                    )}

                </td>


                <td>

                    ${
                        shift
                            ? `

                                <span class="schedule-shift-name">

                                    ${escapeHtml(
                                        shift.name
                                    )}

                                </span>

                                <span class="schedule-shift-time">

                                    ${escapeHtml(
                                        shift.startTime
                                    )}

                                    -

                                    ${escapeHtml(
                                        shift.endTime
                                    )}

                                </span>

                              `

                            : `

                                <span class="schedule-empty">
                                    Not Assigned
                                </span>

                              `
                    }

                </td>


                <td>

                    ${
                        schedule?.weeklyOff

                            ? `

                                <span class="weekly-off-badge">

                                    ${escapeHtml(
                                        schedule.weeklyOff
                                    )}

                                </span>

                              `

                            : `

                                <span class="no-weekly-off-badge">
                                    Not Set
                                </span>

                              `
                    }

                </td>


                <td>

                    <button
                        type="button"
                        class="edit-schedule-btn"
                        data-id="${employee.firestoreId}"
                    >
                        Edit
                    </button>

                </td>

            `;


            employeeScheduleTableBody
                .appendChild(
                    row
                );
        }
    );


    attachScheduleEditActions();
}


// ========================================
// EDIT EMPLOYEE SCHEDULE
// ========================================

function attachScheduleEditActions() {

    document
        .querySelectorAll(
            ".edit-schedule-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const employeeUid =
                            button.dataset.id;


                        const schedule =
                            employeeSchedules.find(
                                item =>
                                    item.employeeUid ===
                                    employeeUid
                            );


                        shiftEmployeeInput.value =
                            employeeUid;


                        weeklyOffEmployeeInput.value =
                            employeeUid;


                        if (schedule) {

                            employeeShiftInput.value =
                                schedule.shiftId || "";


                            weeklyOffDayInput.value =
                                schedule.weeklyOff || "";
                        }


                        shiftEmployeeInput.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                );
            }
        );
}


// ========================================
// LOAD MODULE WHEN PAGE OPENS
// ========================================

shiftWeeklyOffBtn.addEventListener(
    "click",
    async () => {

        await loadShiftWeeklyOffModule();

    }
);

// ========================================================
// ATTENDANCE MANAGEMENT
// Daily Attendance / Late / Absent / Leave / Weekly Off
// Date Range Report / Manual Correction
// ========================================================


// ========================================
// ELEMENTS
// ========================================

const attendanceManageDate =
    byId("attendanceManageDate");

const attendanceManageDepartment =
    byId("attendanceManageDepartment");

const attendanceManageBranch =
    byId("attendanceManageBranch");

const attendanceManageEmployee =
    byId("attendanceManageEmployee");

const loadDailyAttendanceBtn =
    byId("loadDailyAttendanceBtn");

const attendanceTodayBtn =
    byId("attendanceTodayBtn");


const attendanceMgmtPresentCount =
    byId("attendanceMgmtPresentCount");

const attendanceMgmtLateCount =
    byId("attendanceMgmtLateCount");

const attendanceMgmtAbsentCount =
    byId("attendanceMgmtAbsentCount");

const attendanceMgmtLeaveCount =
    byId("attendanceMgmtLeaveCount");

const attendanceMgmtWeeklyOffCount =
    byId("attendanceMgmtWeeklyOffCount");

const attendanceMgmtCheckedOutCount =
    byId("attendanceMgmtCheckedOutCount");


const attendanceManagementTableBody =
    byId("attendanceManagementTableBody");


const attendanceRangeFrom =
    byId("attendanceRangeFrom");

const attendanceRangeTo =
    byId("attendanceRangeTo");

const attendanceRangeEmployee =
    byId("attendanceRangeEmployee");

const attendanceRangeStatus =
    byId("attendanceRangeStatus");

const attendanceRangeFilterBtn =
    byId("attendanceRangeFilterBtn");

const attendanceRangeResetBtn =
    byId("attendanceRangeResetBtn");

const attendanceRangeTableBody =
    byId("attendanceRangeTableBody");


// Correction Modal

const attendanceCorrectionModal =
    byId("attendanceCorrectionModal");

const closeAttendanceCorrectionBtn =
    byId("closeAttendanceCorrectionBtn");

const cancelAttendanceCorrectionBtn =
    byId("cancelAttendanceCorrectionBtn");

const saveAttendanceCorrectionBtn =
    byId("saveAttendanceCorrectionBtn");

const correctionAttendanceRecordId =
    byId("correctionAttendanceRecordId");

const correctionEmployeeName =
    byId("correctionEmployeeName");

const correctionAttendanceDate =
    byId("correctionAttendanceDate");

const correctionCheckInTime =
    byId("correctionCheckInTime");

const correctionCheckOutTime =
    byId("correctionCheckOutTime");

const correctionReason =
    byId("correctionReason");

const attendanceCorrectionStatus =
    byId("attendanceCorrectionStatus");


// ========================================
// ATTENDANCE MANAGEMENT DATA
// ========================================

let attendanceManagementRecords = [];

let currentDailyAttendanceRows = [];

let currentRangeAttendanceRows = [];


// ========================================
// LOCAL DATE
// ========================================

function attendanceMgmtToday() {

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


    return `${year}-${month}-${day}`;
}


// ========================================
// DATE -> DAY NAME
// ========================================

function attendanceMgmtDayName(
    dateKey
) {

    if (!dateKey) {
        return "";
    }


    const date =
        new Date(
            `${dateKey}T12:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }


    const days = [

        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"

    ];


    return days[
        date.getDay()
    ];
}


// ========================================
// TIME -> MINUTES
// ========================================

function attendanceMgmtTimeToMinutes(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return null;
    }


    const raw =
        String(value).trim();


    // Example:
    // 10:05
    // 10:05:20
    // 10:05 AM

    const timeMatch =
        raw.match(
            /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i
        );


    if (timeMatch) {

        let hours =
            Number(
                timeMatch[1]
            );


        const minutes =
            Number(
                timeMatch[2]
            );


        const meridiem =
            timeMatch[3]
                ? timeMatch[3]
                    .toUpperCase()
                : null;


        if (meridiem) {

            if (
                meridiem === "AM" &&
                hours === 12
            ) {

                hours = 0;
            }


            if (
                meridiem === "PM" &&
                hours !== 12
            ) {

                hours += 12;
            }
        }


        return (
            hours * 60 +
            minutes
        );
    }


    // ISO Date / other valid date string

    const parsed =
        new Date(raw);


    if (
        !Number.isNaN(
            parsed.getTime()
        )
    ) {

        return (
            parsed.getHours() * 60 +
            parsed.getMinutes()
        );
    }


    return null;
}


// ========================================
// TIME FOR DISPLAY
// ========================================

function attendanceMgmtDisplayTime(
    value
) {

    if (!value) {
        return "-";
    }


    const raw =
        String(value).trim();


    const simpleTime =
        raw.match(
            /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i
        );


    if (simpleTime) {

        return raw;
            }


    const parsed =
        new Date(raw);


    if (
        !Number.isNaN(
            parsed.getTime()
        )
    ) {

        return parsed
            .toLocaleTimeString(
                [],
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );
    }


    return raw;
}


// ========================================
// TIME FOR <input type="time">
// ========================================

function attendanceMgmtTimeForInput(
    value
) {

    const minutes =
        attendanceMgmtTimeToMinutes(
            value
        );


    if (
        minutes === null
    ) {

        return "";
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return (
        String(hours)
            .padStart(
                2,
                "0"
            ) +
        ":" +
        String(mins)
            .padStart(
                2,
                "0"
            )
    );
}


// ========================================
// FIND EMPLOYEE SCHEDULE
// ========================================

function attendanceMgmtGetSchedule(
    employee
) {

    return employeeSchedules.find(
        schedule =>

            schedule.employeeUid ===
            employee.firestoreId

            ||

            (
                schedule.employeeId &&
                employee.employeeId &&
                String(
                    schedule.employeeId
                ) ===
                String(
                    employee.employeeId
                )
            )
    ) || null;
}


// ========================================
// FIND ATTENDANCE RECORD
// ========================================

function attendanceMgmtFindRecord(
    employee,
    dateKey,
    records =
        attendanceManagementRecords
) {

    return records.find(
        record => {

            const recordDate =
                getRecordDateKey(
                    record
                );


            if (
                recordDate !==
                dateKey
            ) {

                return false;
            }


            if (
                record.uid &&
                record.uid ===
                employee.firestoreId
            ) {

                return true;
            }


            if (
                record.employeeId &&
                employee.employeeId &&
                String(
                    record.employeeId
                ) ===
                String(
                    employee.employeeId
                )
            ) {

                return true;
            }


            if (
                record.email &&
                employee.email &&
                String(
                    record.email
                ).toLowerCase() ===
                String(
                    employee.email
                ).toLowerCase()
            ) {

                return true;
            }


            return false;
        }
    ) || null;
}


// ========================================
// APPROVED LEAVE CHECK
// ========================================

function attendanceMgmtGetApprovedLeave(
    employee,
    dateKey
) {

    return leaveRequests.find(
        leave => {

            if (
                String(
                    leave.status || ""
                ).toLowerCase() !==
                "approved"
            ) {

                return false;
            }


            const sameEmployee =

                (
                    leave.uid &&
                    leave.uid ===
                    employee.firestoreId
                )

                ||

                (
                    leave.employeeId &&
                    employee.employeeId &&
                    String(
                        leave.employeeId
                    ) ===
                    String(
                        employee.employeeId
                    )
                )

                ||

                (
                    leave.email &&
                    employee.email &&
                    String(
                        leave.email
                    ).toLowerCase() ===
                    String(
                        employee.email
                    ).toLowerCase()
                );


            if (!sameEmployee) {
                return false;
            }


            return (
                dateKey >=
                    leave.fromDate

                &&

                dateKey <=
                    leave.toDate
            );
        }
    ) || null;
}


// ========================================
// WEEKLY OFF CHECK
// ========================================

function attendanceMgmtIsWeeklyOff(
    schedule,
    dateKey
) {

    if (
        !schedule ||
        !schedule.weeklyOff
    ) {

        return false;
    }


    const dayName =
        attendanceMgmtDayName(
            dateKey
        );


    return (
        String(
            schedule.weeklyOff
        ).toLowerCase() ===
        String(
            dayName
        ).toLowerCase()
    );
}


// ========================================
// LATE CALCULATION
// ========================================

function attendanceMgmtCalculateLate(
    record,
    schedule
) {

    if (
        !record ||
        !schedule ||
        !schedule.shiftStartTime
    ) {

        return {
            isLate: false,
            lateMinutes: 0,
            calculable: false
        };
    }


    const checkInMinutes =
        attendanceMgmtTimeToMinutes(
            record.checkInTime
        );


    const shiftStartMinutes =
        attendanceMgmtTimeToMinutes(
            schedule.shiftStartTime
        );


    if (
        checkInMinutes === null ||
        shiftStartMinutes === null
    ) {

        return {
            isLate: false,
            lateMinutes: 0,
            calculable: false
        };
    }


    const graceMinutes =
        Number(
            schedule.graceMinutes || 0
        );


    const latestOnTime =
        shiftStartMinutes +
        graceMinutes;


    const lateMinutes =
        Math.max(
            0,
            checkInMinutes -
            latestOnTime
        );


    return {

        isLate:
            lateMinutes > 0,

        lateMinutes,

        calculable:
            true
    };
}


// ========================================
// BUILD ONE EMPLOYEE-DATE STATUS
// ========================================

function attendanceMgmtBuildRow(
    employee,
    dateKey
) {

    const schedule =
        attendanceMgmtGetSchedule(
            employee
        );


    const attendanceRecord =
        attendanceMgmtFindRecord(
            employee,
            dateKey
        );


    const approvedLeave =
        attendanceMgmtGetApprovedLeave(
            employee,
            dateKey
        );


    const weeklyOff =
        attendanceMgmtIsWeeklyOff(
            schedule,
            dateKey
        );


    const late =
        attendanceMgmtCalculateLate(
            attendanceRecord,
            schedule
        );


    let category =
        "absent";


    let statusLabel =
        "Absent";


    let checkedOut =
        false;


    // Actual attendance gets first priority.
    if (attendanceRecord) {

        checkedOut =
            String(
                attendanceRecord.status || ""
            ).toLowerCase() ===
            "completed"

            ||

            Boolean(
                attendanceRecord.checkOutTime
            );


        if (late.isLate) {

            category =
                "late";

            statusLabel =
                "Late";

        } else {

            category =
                "present";


            statusLabel =
                checkedOut
                    ? "Checked Out"
                    : "Present";
        }


    } else if (approvedLeave) {

        category =
            "leave";

        statusLabel =
            "On Leave";


    } else if (weeklyOff) {

        category =
            "weekly-off";

        statusLabel =
            "Weekly Off";
    }


    const shift =
        schedule?.shiftId
            ? shifts.find(
                item =>
                    item.firestoreId ===
                    schedule.shiftId
            )
            : null;


    return {

        dateKey,

        employee,

        schedule,

        shift,

        attendanceRecord,

        approvedLeave,

        weeklyOff,

        category,

        statusLabel,

        checkedOut,

        lateMinutes:
            late.lateMinutes,

        isLate:
            late.isLate,

        lateCalculable:
            late.calculable
    };
}


// ========================================
// POPULATE ATTENDANCE FILTERS
// ========================================

function populateAttendanceManagementFilters() {

    // Department

    const departmentCurrent =
        attendanceManageDepartment.value;


    attendanceManageDepartment.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    const departmentNames =
        [
            ...new Set(

                employees
                    .map(
                        employee =>
                            employee.department
                    )
                    .filter(Boolean)

            )
        ]
        .sort();


    departmentNames.forEach(
        department => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            attendanceManageDepartment
                .appendChild(
                    option
                );
        }
    );


    if (
        departmentNames.includes(
            departmentCurrent
        )
    ) {

        attendanceManageDepartment.value =
            departmentCurrent;
    }


    // Branch

    const branchCurrent =
        attendanceManageBranch.value;


    attendanceManageBranch.innerHTML = `

        <option value="">
            All Branches
        </option>

    `;


    const branchNames =
        [
            ...new Set(

                employees
                    .map(
                        employee =>
                            employee.office
                    )
                    .filter(Boolean)

            )
        ]
        .sort();


    branchNames.forEach(
        branch => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                branch;


            option.textContent =
                branch;
                            attendanceManageBranch
                .appendChild(
                    option
                );
        }
    );


    if (
        branchNames.includes(
            branchCurrent
        )
    ) {

        attendanceManageBranch.value =
            branchCurrent;
    }


    // Employee dropdowns

    const employeeDropdowns = [

        attendanceManageEmployee,

        attendanceRangeEmployee

    ];


    employeeDropdowns.forEach(
        dropdown => {

            const current =
                dropdown.value;


            dropdown.innerHTML = `

                <option value="">
                    All Employees
                </option>

            `;


            employees
                .filter(
                    employee =>
                        employee.status ===
                        "active"
                )
                .sort(
                    (a, b) =>
                        String(
                            a.name || ""
                        ).localeCompare(
                            String(
                                b.name || ""
                            )
                        )
                )
                .forEach(
                    employee => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            employee.firestoreId;


                        option.textContent =
                            `${employee.name || "-"} — ${employee.employeeId || "-"}`;


                        dropdown.appendChild(
                            option
                        );
                    }
                );


            if (
                current &&
                employees.some(
                    employee =>
                        employee.firestoreId ===
                        current
                )
            ) {

                dropdown.value =
                    current;
            }
        }
    );
}


// ========================================
// FILTER EMPLOYEES FOR DAILY VIEW
// ========================================

function attendanceMgmtFilteredEmployees() {

    const department =
        attendanceManageDepartment.value;


    const branch =
        attendanceManageBranch.value;


    const employeeUid =
        attendanceManageEmployee.value;


    return employees.filter(
        employee => {

            if (
                employee.status !==
                "active"
            ) {

                return false;
            }


            if (
                department &&
                employee.department !==
                department
            ) {

                return false;
            }


            if (
                branch &&
                employee.office !==
                branch
            ) {

                return false;
            }


            if (
                employeeUid &&
                employee.firestoreId !==
                employeeUid
            ) {

                return false;
            }


            return true;
        }
    );
}


// ========================================
// LOAD DAILY ATTENDANCE
// ========================================

async function loadDailyAttendanceManagement() {

    const dateKey =
        attendanceManageDate.value;


    if (!dateKey) {

        alert(
            "Please select a date."
        );

        return;
    }


    const filteredEmployees =
        attendanceMgmtFilteredEmployees();


    currentDailyAttendanceRows =
        filteredEmployees.map(
            employee =>
                attendanceMgmtBuildRow(
                    employee,
                    dateKey
                )
        );


    renderDailyAttendanceManagement();

    updateAttendanceManagementSummary();
}


// ========================================
// DAILY SUMMARY
// ========================================

function updateAttendanceManagementSummary() {

    const present =
        currentDailyAttendanceRows.filter(
            row =>
                Boolean(
                    row.attendanceRecord
                )
        ).length;


    const late =
        currentDailyAttendanceRows.filter(
            row =>
                row.isLate
        ).length;


    const absent =
        currentDailyAttendanceRows.filter(
            row =>
                row.category ===
                "absent"
        ).length;


    const leave =
        currentDailyAttendanceRows.filter(
            row =>
                row.category ===
                "leave"
        ).length;


    const weeklyOff =
        currentDailyAttendanceRows.filter(
            row =>
                row.category ===
                "weekly-off"
        ).length;


    const checkedOut =
        currentDailyAttendanceRows.filter(
            row =>
                row.checkedOut
        ).length;


    attendanceMgmtPresentCount.textContent =
        present;


    attendanceMgmtLateCount.textContent =
        late;


    attendanceMgmtAbsentCount.textContent =
        absent;


    attendanceMgmtLeaveCount.textContent =
        leave;


    attendanceMgmtWeeklyOffCount.textContent =
        weeklyOff;


    attendanceMgmtCheckedOutCount.textContent =
        checkedOut;
}


// ========================================
// STATUS BADGE CLASS
// ========================================

function attendanceMgmtBadgeClass(
    row
) {

    if (
        row.category ===
        "late"
    ) {

        return "late";
    }


    if (
        row.category ===
        "leave"
    ) {

        return "leave";
    }


    if (
        row.category ===
        "weekly-off"
    ) {

        return "weekly-off";
    }


    if (
        row.category ===
        "absent"
    ) {

        return "absent";
    }


    if (
        row.checkedOut
    ) {

        return "checked-out";
    }


    return "present";
}


// ========================================
// RENDER DAILY TABLE
// ========================================

function renderDailyAttendanceManagement() {

    if (
        !currentDailyAttendanceRows.length
    ) {

        attendanceManagementTableBody.innerHTML = `

            <tr>

                <td colspan="9">
                    No employees found for the selected filters.
                </td>

            </tr>

        `;

        return;
    }


    attendanceManagementTableBody.innerHTML =
        "";


    currentDailyAttendanceRows.forEach(
        rowData => {

            const employee =
                rowData.employee;


            const record =
                rowData.attendanceRecord;


            const schedule =
                rowData.schedule;


            const tr =
                document.createElement(
                    "tr"
                );


            let lateDisplay = `

                <span class="attendance-not-applicable">
                    -
                </span>

            `;


            if (record) {

                if (
                    rowData.isLate
                ) {

                    lateDisplay = `

                        <span class="attendance-late">
                            ${rowData.lateMinutes} min
                        </span>

                    `;

                } else if (
                    rowData.lateCalculable
                ) {

                    lateDisplay = `

                        <span class="attendance-on-time">
                            On Time
                        </span>

                    `;
                }
            }


            const shiftDisplay =
                schedule?.shiftName

                    ? `

                        <span class="schedule-shift-name">

                            ${escapeHtml(
                                schedule.shiftName
                            )}

                        </span>

                        <span class="schedule-shift-time">

                            ${escapeHtml(
                                schedule.shiftStartTime || "-"
                            )}

                            -

                            ${escapeHtml(
                                schedule.shiftEndTime || "-"
                            )}

                        </span>

                      `

                    : `

                        <span class="schedule-empty">
                            Not Assigned
                        </span>

                      `;


            const correctionButton =
                record

                    ? `

                        <button
                            type="button"
                            class="attendance-correction-btn"
                            data-id="${record.firestoreId}"
                        >
                            Correct
                        </button>

                      `

                    : `

                        <span class="attendance-not-applicable">
                            -
                        </span>

                      `;


            tr.innerHTML = `

                <td>

                    <div class="attendance-employee-info">

                        <span class="attendance-employee-name">

                            ${escapeHtml(
                                employee.name || "-"
                            )}

                        </span>

                        <span class="attendance-employee-designation">

                            ${escapeHtml(
                                employee.designation || "-"
                            )}

                        </span>

                    </div>

                </td>


                <td>

                    ${escapeHtml(
                        employee.employeeId || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.office || "-"
                    )}

                </td>


                <td>

                    ${shiftDisplay}

                </td>


                <td>

                    ${escapeHtml(
                        attendanceMgmtDisplayTime(
                            record?.checkInTime
                        )
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        attendanceMgmtDisplayTime(
                            record?.checkOutTime
                        )
                    )}

                </td>


                <td>

                    ${lateDisplay}

                </td>


                <td>

                    <span
                        class="attendance-status-badge ${attendanceMgmtBadgeClass(rowData)}"
                    >

                        ${escapeHtml(
                            rowData.statusLabel
                        )}

                    </span>

                </td>


                <td>

                    ${correctionButton}

                </td>

            `;


            attendanceManagementTableBody
                .appendChild(
                    tr
                );
        }
    );


    attachAttendanceCorrectionButtons();
}


// ========================================
// DAILY BUTTONS
// ========================================

loadDailyAttendanceBtn.addEventListener(
    "click",
    async () => {

        await loadDailyAttendanceManagement();

    }
);


attendanceTodayBtn.addEventListener(
    "click",
    async () => {

        attendanceManageDate.value =
            attendanceMgmtToday();


        await loadDailyAttendanceManagement();

    }
);


attendanceManageDepartment.addEventListener(
    "change",
    async () => {

        await loadDailyAttendanceManagement();

    }
);
attendanceManageBranch.addEventListener(
    "change",
    async () => {

        await loadDailyAttendanceManagement();

    }
);


attendanceManageEmployee.addEventListener(
    "change",
    async () => {

        await loadDailyAttendanceManagement();

    }
);


// ========================================
// DATE RANGE HELPERS
// ========================================

function attendanceMgmtDatesBetween(
    fromDate,
    toDate
) {

    const dates = [];


    const current =
        new Date(
            `${fromDate}T12:00:00`
        );


    const end =
        new Date(
            `${toDate}T12:00:00`
        );


    while (
        current <= end
    ) {

        const year =
            current.getFullYear();


        const month =
            String(
                current.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                current.getDate()
            ).padStart(
                2,
                "0"
            );


        dates.push(
            `${year}-${month}-${day}`
        );


        current.setDate(
            current.getDate() + 1
        );
    }


    return dates;
}


// ========================================
// GENERATE DATE RANGE REPORT
// ========================================

async function generateAttendanceRangeReport() {

    const fromDate =
        attendanceRangeFrom.value;


    const toDate =
        attendanceRangeTo.value;


    if (
        !fromDate ||
        !toDate
    ) {

        alert(
            "Please select From and To date."
        );

        return;
    }


    if (
        fromDate >
        toDate
    ) {

        alert(
            "From date cannot be after To date."
        );

        return;
    }


    const dates =
        attendanceMgmtDatesBetween(
            fromDate,
            toDate
        );


    if (
        dates.length > 62
    ) {

        alert(
            "Please generate a report for maximum 62 days at a time."
        );

        return;
    }


    const selectedEmployeeUid =
        attendanceRangeEmployee.value;


    const selectedStatus =
        attendanceRangeStatus.value;


    const reportEmployees =
        employees.filter(
            employee => {

                if (
                    employee.status !==
                    "active"
                ) {

                    return false;
                }


                if (
                    selectedEmployeeUid &&
                    employee.firestoreId !==
                    selectedEmployeeUid
                ) {

                    return false;
                }


                return true;
            }
        );


    const rows = [];


    dates.forEach(
        dateKey => {

            reportEmployees.forEach(
                employee => {

                    const row =
                        attendanceMgmtBuildRow(
                            employee,
                            dateKey
                        );


                    let matchesStatus =
                        true;


                    if (selectedStatus) {

                        matchesStatus =
                            row.category ===
                            selectedStatus;
                    }


                    if (matchesStatus) {

                        rows.push(
                            row
                        );
                    }
                }
            );
        }
    );


    currentRangeAttendanceRows =
        rows;


    renderAttendanceRangeReport();
}


// ========================================
// RENDER RANGE REPORT
// ========================================

function renderAttendanceRangeReport() {

    if (
        !currentRangeAttendanceRows.length
    ) {

        attendanceRangeTableBody.innerHTML = `

            <tr>

                <td colspan="9">
                    No attendance data found for this report.
                </td>

            </tr>

        `;

        return;
    }


    attendanceRangeTableBody.innerHTML =
        "";


    currentRangeAttendanceRows.forEach(
        rowData => {

            const employee =
                rowData.employee;


            const record =
                rowData.attendanceRecord;


            const schedule =
                rowData.schedule;


            const tr =
                document.createElement(
                    "tr"
                );


            let lateDisplay =
                "-";


            if (
                record &&
                rowData.isLate
            ) {

                lateDisplay =
                    `${rowData.lateMinutes} min`;


            } else if (
                record &&
                rowData.lateCalculable
            ) {

                lateDisplay =
                    "On Time";
            }


            tr.innerHTML = `

                <td>

                    ${escapeHtml(
                        rowData.dateKey
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.name || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.employeeId || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        employee.office || "-"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        schedule?.shiftName ||
                        "Not Assigned"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        attendanceMgmtDisplayTime(
                            record?.checkInTime
                        )
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        attendanceMgmtDisplayTime(
                            record?.checkOutTime
                        )
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        lateDisplay
                    )}

                </td>


                <td>

                    <span
                        class="attendance-status-badge ${attendanceMgmtBadgeClass(rowData)}"
                    >

                        ${escapeHtml(
                            rowData.statusLabel
                        )}

                    </span>

                </td>

            `;


            attendanceRangeTableBody
                .appendChild(
                    tr
                );
        }
    );
}


// ========================================
// RANGE BUTTONS
// ========================================

attendanceRangeFilterBtn.addEventListener(
    "click",
    async () => {

        await generateAttendanceRangeReport();

    }
);


attendanceRangeResetBtn.addEventListener(
    "click",
    () => {

        attendanceRangeFrom.value =
            "";

        attendanceRangeTo.value =
            "";

        attendanceRangeEmployee.value =
            "";

        attendanceRangeStatus.value =
            "";


        currentRangeAttendanceRows =
            [];


        attendanceRangeTableBody.innerHTML = `

            <tr>

                <td colspan="9">
                    Select a date range to generate report.
                </td>

            </tr>

        `;
    }
);


// ========================================
// CORRECTION BUTTONS
// ========================================

function attachAttendanceCorrectionButtons() {

    document
        .querySelectorAll(
            ".attendance-correction-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openAttendanceCorrection(
                            button.dataset.id
                        );

                    }
                );
            }
        );
}


// ========================================
// OPEN CORRECTION MODAL
// ========================================

function openAttendanceCorrection(
    recordId
) {

    const record =
        attendanceManagementRecords.find(
            item =>
                item.firestoreId ===
                recordId
        );


    if (!record) {

        alert(
            "Attendance record not found."
        );

        return;
    }


    correctionAttendanceRecordId.value =
        record.firestoreId;


    correctionEmployeeName.value =
        record.employeeName ||
        "-";


    correctionAttendanceDate.value =
        getRecordDateKey(
            record
        );


    correctionCheckInTime.value =
        attendanceMgmtTimeForInput(
            record.checkInTime
        );


    correctionCheckOutTime.value =
        attendanceMgmtTimeForInput(
            record.checkOutTime
        );


    correctionReason.value =
        "";


    attendanceCorrectionStatus.textContent =
        "";


    attendanceCorrectionModal
        .classList.add(
            "active"
        );
}


// ========================================
// CLOSE CORRECTION MODAL
// ========================================

function closeAttendanceCorrection() {

    attendanceCorrectionModal
        .classList.remove(
            "active"
        );


    correctionAttendanceRecordId.value =
        "";

    correctionEmployeeName.value =
        "";

    correctionAttendanceDate.value =
        "";

    correctionCheckInTime.value =
        "";

    correctionCheckOutTime.value =
        "";

    correctionReason.value =
        "";

    attendanceCorrectionStatus.textContent =
        "";
}


closeAttendanceCorrectionBtn
    .addEventListener(
        "click",
        closeAttendanceCorrection
    );


cancelAttendanceCorrectionBtn
    .addEventListener(
        "click",
        closeAttendanceCorrection
    );


attendanceCorrectionModal
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                attendanceCorrectionModal
            ) {

                closeAttendanceCorrection();
            }
        }
    );


// ========================================
// SAVE MANUAL CORRECTION
// ========================================

saveAttendanceCorrectionBtn.addEventListener(
    "click",
    async () => {

        const recordId =
            correctionAttendanceRecordId.value;


        const checkInTime =
            correctionCheckInTime.value;


        const checkOutTime =
            correctionCheckOutTime.value;


        const reason =
            correctionReason
                .value
                .trim();


        if (!recordId) {

            alert(
                "Attendance record not found."
            );
                        return;
        }


        if (!checkInTime) {

            alert(
                "Check In time is required."
            );

            return;
        }


        if (!reason) {

            alert(
                "Please enter a correction reason."
            );

            return;
        }


        attendanceCorrectionStatus.textContent =
            "Saving correction...";


        try {

            const updateData = {

                checkInTime,

                checkOutTime:
                    checkOutTime || "",

                status:
                    checkOutTime
                        ? "completed"
                        : "checked-in",

                manuallyCorrected:
                    true,

                correctionReason:
                    reason,

                correctedAt:
                    new Date()
                        .toISOString(),

                correctedByEmployeeId:
                    currentAdminEmployee
                        ?.employeeId || "",

                correctedByEmail:
                    currentAdminEmployee
                        ?.email || "",

                correctedByName:
                    currentAdminEmployee
                        ?.name || ""
            };


            await window.adminUpdateDoc(

                window.adminDoc(
                    window.adminDB,
                    "attendance",
                    recordId
                ),

                updateData
            );


            attendanceCorrectionStatus.textContent =
                "";


            closeAttendanceCorrection();


            // Reload attendance records

            attendanceManagementRecords =
                await getAttendanceRecords();


            await loadDailyAttendanceManagement();


            alert(
                "Attendance corrected successfully."
            );


        } catch (error) {

            console.error(
                "ATTENDANCE CORRECTION ERROR:",
                error
            );


            attendanceCorrectionStatus.textContent =
                "Failed to save correction.";


            alert(
                "Failed to correct attendance.\n\n" +
                error.message
            );
        }
    }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                attendanceCorrectionModal
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                closeAttendanceCorrection();
            }
        }
    }
);


// ========================================
// LOAD ATTENDANCE MANAGEMENT MODULE
// ========================================

async function loadAttendanceManagementModule() {

    try {

        // Employees

        await loadEmployees();


        // Attendance

        attendanceManagementRecords =
            await getAttendanceRecords();


        // Approved / rejected leave data

        await loadLeaveRequests(
            false
        );


        // Shift setup

        await loadShifts();


        // Employee shift + weekly off

        await loadEmployeeSchedules();


        // Dropdowns

        populateAttendanceManagementFilters();


        // Today by default

        if (
            !attendanceManageDate.value
        ) {

            attendanceManageDate.value =
                attendanceMgmtToday();
        }


        // Default Date Range

        if (
            !attendanceRangeTo.value
        ) {

            attendanceRangeTo.value =
                attendanceMgmtToday();
        }


        if (
            !attendanceRangeFrom.value
        ) {

            const sevenDaysAgo =
                new Date();


            sevenDaysAgo.setDate(
                sevenDaysAgo.getDate() - 6
            );


            const year =
                sevenDaysAgo.getFullYear();


            const month =
                String(
                    sevenDaysAgo.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    sevenDaysAgo.getDate()
                ).padStart(
                    2,
                    "0"
                );


            attendanceRangeFrom.value =
                `${year}-${month}-${day}`;
        }


        await loadDailyAttendanceManagement();


    } catch (error) {

        console.error(
            "ATTENDANCE MANAGEMENT LOAD ERROR:",
            error
        );


        attendanceManagementTableBody.innerHTML = `

            <tr>

                <td colspan="9">
                    Unable to load Attendance Management.
                </td>

            </tr>

        `;
    }
}


// ========================================
// OPEN MODULE
// ========================================

attendanceManagementBtn.addEventListener(
    "click",
    async () => {

        await loadAttendanceManagementModule();

    }
);

// ========================================================
// EMPLOYEE SEARCH
// ========================================================

function filterEmployeeList() {

    if (!employeeSearchInput) {
        return;
    }

    const searchText =
        employeeSearchInput
            .value
            .trim()
            .toLowerCase();

    if (clearEmployeeSearchBtn) {

        clearEmployeeSearchBtn.classList.toggle(
            "visible",
            searchText.length > 0
        );
    }

    if (!searchText) {

        renderEmployees();

        return;
    }

    const filteredEmployees =
        employees.filter(
            employee => {

                const employeeName =
                    String(
                        employee.name || ""
                    ).toLowerCase();

                const employeeId =
                    String(
                        employee.employeeId || ""
                    ).toLowerCase();

                return (
                    employeeName.includes(searchText)
                    ||
                    employeeId.includes(searchText)
                );
            }
        );

    renderEmployees(filteredEmployees);
}
if (employeeSearchInput) {

    employeeSearchInput.addEventListener(
        "input",
        filterEmployeeList
    );
}


if (clearEmployeeSearchBtn) {

    clearEmployeeSearchBtn.addEventListener(
        "click",
        () => {

            employeeSearchInput.value = "";

            clearEmployeeSearchBtn.classList.remove(
                "visible"
            );

            renderEmployees();

            employeeSearchInput.focus();
        }
    );
}

// ========================================
// ADMIN MOBILE BOTTOM NAVIGATION
// ========================================

const adminMobileDashboardBtn =
    document.getElementById(
        "adminMobileDashboardBtn"
    );

const adminMobileAttendanceBtn =
    document.getElementById(
        "adminMobileAttendanceBtn"
    );

const adminMobileEmployeesBtn =
    document.getElementById(
        "adminMobileEmployeesBtn"
    );

const adminMobileLeaveBtn =
    document.getElementById(
        "adminMobileLeaveBtn"
    );

const adminMobileMoreBtn =
    document.getElementById(
        "adminMobileMoreBtn"
    );


function setActiveAdminMobileNav(
    activeButton
) {

    document
        .querySelectorAll(
            ".admin-mobile-nav-item"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );

    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


adminMobileDashboardBtn?.addEventListener(
    "click",
    () => {

        document
            .getElementById("homeBtn")
            ?.click();

        setActiveAdminMobileNav(
            adminMobileDashboardBtn
        );

    }
);


adminMobileAttendanceBtn?.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "attendanceManagementBtn"
            )
            ?.click();

        setActiveAdminMobileNav(
            adminMobileAttendanceBtn
        );

    }
);


adminMobileEmployeesBtn?.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "employeesBtn"
            )
            ?.click();

        setActiveAdminMobileNav(
            adminMobileEmployeesBtn
        );

    }
);


adminMobileLeaveBtn?.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "leaveManagementBtn"
            )
            ?.click();

        setActiveAdminMobileNav(
            adminMobileLeaveBtn
        );

    }
);
const adminMobileMoreMenu =
    document.getElementById(
        "adminMobileMoreMenu"
    );

const adminMobileCreateEmployeeBtn =
    document.getElementById(
        "adminMobileCreateEmployeeBtn"
    );

const adminMobileDepartmentsBtn =
    document.getElementById(
        "adminMobileDepartmentsBtn"
    );

const adminMobileShiftBtn =
    document.getElementById(
        "adminMobileShiftBtn"
    );

const adminMobileSettingsBtn =
    document.getElementById(
        "adminMobileSettingsBtn"
    );


function closeAdminMobileMoreMenu() {

    adminMobileMoreMenu
        ?.classList
        .remove(
            "active"
        );

}


adminMobileMoreBtn?.addEventListener(
    "click",
    () => {

        adminMobileMoreMenu
            ?.classList
            .toggle(
                "active"
            );

        setActiveAdminMobileNav(
            adminMobileMoreBtn
        );

    }
);


adminMobileCreateEmployeeBtn?.addEventListener(
    "click",
    () => {

        closeAdminMobileMoreMenu();

        document
            .getElementById(
                "createEmployeeBtn"
            )
            ?.click();

    }
);


adminMobileDepartmentsBtn?.addEventListener(
    "click",
    () => {

        closeAdminMobileMoreMenu();

        document
            .getElementById(
                "departmentsBranchesBtn"
            )
            ?.click();

    }
);


adminMobileShiftBtn?.addEventListener(
    "click",
    () => {

        closeAdminMobileMoreMenu();

        document
            .getElementById(
                "shiftWeeklyOffBtn"
            )
            ?.click();

    }
);


adminMobileSettingsBtn?.addEventListener(
    "click",
    () => {

        closeAdminMobileMoreMenu();

        document
            .getElementById(
                "settingsBtn"
            )
            ?.click();

    }
);
// ========================================================
// AI RECRUITMENT MODULE
// ========================================================

let recruitmentJobs = [];
let recruitmentCandidates = [];
let selectedRecruitmentCandidateId = null;
let recruitmentLoadedOnce = false;

const recruitmentEls = {
    openCreateJobBtn: byId("openCreateJobBtn"),
    syncBtn: byId("syncRecruitmentEmailBtn"),
    jobModal: byId("createJobModal"),
    closeJobModal: byId("closeCreateJobModal"),
    cancelJobBtn: byId("cancelCreateJobBtn"),
    jobForm: byId("recruitmentJobForm"),
    jobId: byId("recruitmentJobId"),
    jobTitle: byId("recruitmentJobTitle"),
    department: byId("recruitmentJobDepartment"),
    location: byId("recruitmentJobLocation"),
    employmentType: byId("recruitmentEmploymentType"),
    minScore: byId("recruitmentMinScore"),
    reviewScore: byId("recruitmentReviewScore"),
    description: byId("recruitmentJobDescription"),
    mandatory: byId("recruitmentMandatoryCriteria"),
    preferred: byId("recruitmentPreferredCriteria"),
    jobFormStatus: byId("recruitmentJobFormStatus"),
    jobsGrid: byId("recruitmentJobsGrid"),
    candidatesBody: byId("recruitmentCandidatesTableBody"),
    candidateSearch: byId("recruitmentCandidateSearch"),
    jobFilter: byId("recruitmentJobFilter"),
    statusFilter: byId("recruitmentStatusFilter"),

        detailModal: byId("candidateDetailModal"),
    closeDetailModal: byId("closeCandidateDetailModal"),
    detailName: byId("candidateDetailName"),
    detailSubtitle: byId("candidateDetailSubtitle"),
    detailBody: byId("candidateDetailBody"),
    viewCvBtn: byId("candidateViewCvBtn"),
    rescreenBtn: byId("candidateRescreenBtn"),
    shortlistBtn: byId("candidateShortlistBtn"),
    notShortlistBtn: byId("candidateNotShortlistBtn"),
    openJobsCount: byId("recruitmentOpenJobsCount"),
    applicationsCount: byId("recruitmentApplicationsCount"),
    recommendedCount: byId("recruitmentRecommendedCount"),
    reviewCount: byId("recruitmentReviewCount"),
    shortlistedCount: byId("recruitmentShortlistedCount"),
    automationStatus: byId("recruitmentAutomationStatus"),
    lastSync: byId("recruitmentLastSync"),
    processedEmails: byId("recruitmentProcessedEmails")
};

function escapeRecruitmentHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const RECRUITMENT_API_BASE =
    "https://dazzle-hrm-recruitment.hasanmehedi021996.workers.dev";

async function recruitmentApiRequest(path, options = {}) {
    const user = window.adminAuth?.currentUser;

    if (!user) {
        throw new Error("Admin authentication is required.");
    }

    const idToken = await user.getIdToken();

    const response = await fetch(
        `${RECRUITMENT_API_BASE}${path}`,
        {
            method: options.method || "GET",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
                ...(options.headers || {})
            },

            body:
                options.body !== undefined
                    ? JSON.stringify(options.body)
                    : undefined
        }
    );

    const responseText = await response.text();

    let data = {};

    try {
        data = responseText
            ? JSON.parse(responseText)
            : {};
    } catch {
        throw new Error(
            `Recruitment server returned an invalid response. HTTP ${response.status}`
        );
    }

    if (!response.ok || data.success === false) {
 throw new Error(
    [data.message, data.error]
        .filter(Boolean)
        .join(" | ") ||
    `Recruitment request failed. HTTP ${response.status}`
);
    }

    return data;
}

window.recruitmentApiRequest = recruitmentApiRequest;

window.runRecruitmentCleanupDryRun = async function () {
    try {
        console.log("Starting recruitment cleanup dry run...");

        const result = await recruitmentApiRequest(
            "/api/recruitment/cleanup-non-cv",
            {
                method: "POST",
                body: {
                    dryRun: true
                }
            }
        );

        console.log(
            "RECRUITMENT CLEANUP DRY RUN:",
            result
        );

        alert(
            `Cleanup Dry Run Complete\n\n` +
            `Candidates scanned: ${result.scanned || 0}\n` +
            `Clearly non-CV: ${result.clearlyNonCv || 0}\n` +
            `Duplicate groups: ${result.duplicateGroups || 0}\n` +
            `Duplicate records: ${result.duplicateRecordsToRemove || 0}\n` +
            `Total would delete: ${result.totalWouldDelete || 0}\n\n` +
            `Nothing has been deleted.`
        );

        return result;

    } catch (error) {
        console.error(
            "CLEANUP DRY RUN ERROR:",
            error
        );

        alert(
            error.message ||
            "Cleanup dry run failed."
        );
    }
};

window.runSmartDuplicateDryRun = async function () {
    try {
        console.log("Starting smart duplicate dry run...");

        const dashboard = await recruitmentApiRequest(
            "/api/recruitment/dashboard",
            {
                method: "GET"
            }
        );

        const candidates = Array.isArray(dashboard.candidates)
            ? dashboard.candidates
            : [];

        const normalize = (value) =>
            String(value || "")
                .toLowerCase()
                .replace(/[_\-./\\()[\]{}]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        const normalizeEmail = (value) =>
            String(value || "")
                .trim()
                .toLowerCase();

        const duplicateMap = new Map();

        for (const candidate of candidates) {
            const email = normalizeEmail(candidate.email);

            const filename = normalize(
                candidate.cvFilename ||
                candidate.cvFileName ||
                ""
            );

            const subject = normalize(
                candidate.subject || ""
            );

            if (!email) {
                continue;
            }

            /*
             * SAFE SMART DUPLICATE RULES
             *
             * Rule 1:
             * Same email + same CV filename
             *
             * Rule 2:
             * If filename is unavailable,
             * same email + same subject
             *
             * We DO NOT classify candidates
             * as duplicate using email alone.
             */

            let key = "";

            if (filename) {
                key = `email-file|${email}|${filename}`;
            } else if (subject) {
                key = `email-subject|${email}|${subject}`;
            }

            if (!key) {
                continue;
            }

            if (!duplicateMap.has(key)) {
                duplicateMap.set(key, []);
            }

            duplicateMap
                .get(key)
                .push(candidate);
        }


        const duplicateGroups = [];

        let duplicateRecords = 0;


        for (const [key, group] of duplicateMap.entries()) {
            if (group.length < 2) {
                continue;
            }


            /*
             * Keep oldest candidate.
             *
             * This is only a DRY RUN.
             * Nothing is being deleted.
             */

            const sorted = [...group].sort((a, b) => {
                return String(a.createdAt || "")
                    .localeCompare(
                        String(b.createdAt || "")
                    );
            });


            const keep = sorted[0];
            const duplicates = sorted.slice(1);

            duplicateRecords += duplicates.length;


            duplicateGroups.push({
                key,

                keep: {
                    id: keep.id,
                    name: keep.name || "",
                    email: keep.email || "",
                    subject: keep.subject || "",
                    filename:
                        keep.cvFilename ||
                        keep.cvFileName ||
                        "",
                    createdAt:
                        keep.createdAt || ""
                },

                duplicates: duplicates.map(candidate => ({
                    id: candidate.id,
                    name: candidate.name || "",
                    email: candidate.email || "",
                    subject: candidate.subject || "",
                    filename:
                        candidate.cvFilename ||
                        candidate.cvFileName ||
                        "",
                    createdAt:
                        candidate.createdAt || ""
                }))
            });
        }


        const result = {
            success: true,
            dryRun: true,

            scanned:
                candidates.length,

            duplicateGroups:
                duplicateGroups.length,

            duplicateRecords,

            duplicates:
                duplicateGroups
        };


        console.log(
            "SMART DUPLICATE DRY RUN:",
            result
        );


        console.log(
            JSON.stringify(
                duplicateGroups,
                null,
                2
            )
        );


        alert(
            `Smart Duplicate Dry Run Complete\n\n` +
            `Candidates scanned: ${result.scanned}\n` +
            `Duplicate groups: ${result.duplicateGroups}\n` +
            `Duplicate records: ${result.duplicateRecords}\n\n` +
            `Nothing has been deleted.`
        );


        return result;

    } catch (error) {
        console.error(
            "SMART DUPLICATE DRY RUN ERROR:",
            error
        );

        alert(
            error.message ||
            "Smart duplicate dry run failed."
        );
    }
};

function toDateText(value) {
    if (!value) return "—";
    const d = value?.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function splitCriteria(value) {
    return String(value || "")
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);
}

function openRecruitmentJobModal(job = null) {
    recruitmentEls.jobForm?.reset();
    if (recruitmentEls.jobFormStatus) recruitmentEls.jobFormStatus.textContent = "";
    recruitmentEls.jobId.value = job?.id || "";
    recruitmentEls.jobTitle.value = job?.title || "";
    recruitmentEls.department.value = job?.department || "";
    recruitmentEls.location.value = job?.location || "";
    recruitmentEls.employmentType.value = job?.employmentType || "Full-time";
    recruitmentEls.minScore.value = job?.recommendedScore ?? 80;
    recruitmentEls.reviewScore.value = job?.reviewScore ?? 60;
    recruitmentEls.description.value = job?.description || "";
    recruitmentEls.mandatory.value = (job?.mandatoryCriteria || []).join("\n");
    recruitmentEls.preferred.value = (job?.preferredCriteria || []).join("\n");
    const title = byId("createJobModalTitle");
    if (title) title.textContent = job ? "Edit Job Opening" : "Create Job Opening";
    recruitmentEls.jobModal?.classList.add("active");
}

function closeRecruitmentJobModal() {
    recruitmentEls.jobModal?.classList.remove("active");
}

function closeCandidateDetailModal() {
    recruitmentEls.detailModal?.classList.remove("active");
    selectedRecruitmentCandidateId = null;
}

function recruitmentStatusLabel(status) {
    const labels = {
        recommended: "AI Recommended",
        review: "Needs Review",
        needs_assignment: "Needs Assignment",
        shortlisted: "Shortlisted",
        not_shortlisted: "Not Shortlisted",
        processing_failed: "Processing Failed",
        processing: "Processing"
    };
    return labels[status] || status || "Pending";
}

function scoreClass(score) {
    const n = Number(score || 0);
    if (n >= 80) return "high";
    if (n >= 60) return "medium";
    return "low";
}

function renderRecruitmentSummary() {
    const openJobs = recruitmentJobs.filter(job => job.status !== "closed").length;
    recruitmentEls.openJobsCount.textContent = openJobs;
    recruitmentEls.applicationsCount.textContent = recruitmentCandidates.length;
    recruitmentEls.recommendedCount.textContent = recruitmentCandidates.filter(c => c.status === "recommended").length;
    recruitmentEls.reviewCount.textContent = recruitmentCandidates.filter(c => ["review", "needs_assignment", "processing_failed"].includes(c.status)).length;
    recruitmentEls.shortlistedCount.textContent = recruitmentCandidates.filter(c => c.status === "shortlisted").length;
}

function renderRecruitmentJobFilter() {
    if (!recruitmentEls.jobFilter) return;
    const current = recruitmentEls.jobFilter.value;
    recruitmentEls.jobFilter.innerHTML = '<option value="">All Jobs</option>' + recruitmentJobs.map(job => `<option value="${escapeRecruitmentHtml(job.id)}">${escapeRecruitmentHtml(job.title)}</option>`).join("");
    recruitmentEls.jobFilter.value = current;
}

function renderRecruitmentJobs() {
    if (!recruitmentEls.jobsGrid) return;
    if (!recruitmentJobs.length) {
        recruitmentEls.jobsGrid.innerHTML = '<div class="candidate-empty">No job opening yet. Create a job first so incoming CVs can be matched against its requirements.</div>';
        return;
    }
    recruitmentEls.jobsGrid.innerHTML = recruitmentJobs.map(job => {
        const count = recruitmentCandidates.filter(c => c.jobId === job.id).length;
        const status = job.status || "open";
        return `<article class="recruitment-job-card">
            <div class="recruitment-job-card-top"><div><h3>${escapeRecruitmentHtml(job.title)}</h3><p>${escapeRecruitmentHtml(job.department || "No department")} · ${escapeRecruitmentHtml(job.location || "Location not set")}</p></div><span class="job-status-pill ${status === "closed" ? "closed" : ""}">${escapeRecruitmentHtml(status)}</span></div>
            <div class="job-card-meta"><span>${count} application${count === 1 ? "" : "s"}</span><span>Recommend ${Number(job.recommendedScore ?? 80)}+</span><span>Review ${Number(job.reviewScore ?? 60)}+</span></div>
            <div class="job-card-actions"><button class="table-action-btn" data-job-action="edit" data-job-id="${job.id}">Edit</button><button class="table-action-btn" data-job-action="toggle" data-job-id="${job.id}">${status === "closed" ? "Reopen" : "Close Job"}</button></div>
        </article>`;
    }).join("");
}

function filteredRecruitmentCandidates() {
    const search = (recruitmentEls.candidateSearch?.value || "").trim().toLowerCase();
    const jobId = recruitmentEls.jobFilter?.value || "";
    const status = recruitmentEls.statusFilter?.value || "";
    return recruitmentCandidates.filter(c => {
        const hay = `${c.name || ""} ${c.email || ""} ${c.jobTitle || ""}`.toLowerCase();
        return (!search || hay.includes(search)) && (!jobId || c.jobId === jobId) && (!status || c.status === status);
    });
}

function renderRecruitmentCandidates() {
    if (!recruitmentEls.candidatesBody) return;
    const rows = filteredRecruitmentCandidates();
    if (!rows.length) {
        recruitmentEls.candidatesBody.innerHTML = '<tr><td colspan="6"><div class="candidate-empty">No applications match this view.</div></td></tr>';
        return;
    }
    recruitmentEls.candidatesBody.innerHTML = rows.map(c => {
        const score = Number(c.aiScore ?? 0);
        const scoreText = c.aiScore === null || c.aiScore === undefined ? "—" : `${score}%`;
        return `<tr>
            <td><div class="candidate-name-cell"><strong>${escapeRecruitmentHtml(c.name || "Unknown Candidate")}</strong><span>${escapeRecruitmentHtml(c.email || "No email")}</span></div></td>
            <td>${escapeRecruitmentHtml(c.jobTitle || "Needs Assignment")}</td>
            <td><span class="ai-score ${scoreClass(score)}">${scoreText}</span></td>
            <td><span class="recruitment-status ${escapeRecruitmentHtml(c.status)}">${escapeRecruitmentHtml(recruitmentStatusLabel(c.status))}</span></td>
            <td>${escapeRecruitmentHtml(toDateText(c.receivedAt || c.createdAt))}</td>
            <td><button class="table-action-btn" data-candidate-id="${c.id}">Review</button></td>
        </tr>`;
    }).join("");
}

function renderAutomationState(state = {}) {
    if (recruitmentEls.automationStatus) recruitmentEls.automationStatus.textContent = state.configured ? "Connected" : "Backend setup required";
    if (recruitmentEls.lastSync) recruitmentEls.lastSync.textContent = toDateText(state.lastSyncAt);
    if (recruitmentEls.processedEmails) recruitmentEls.processedEmails.textContent = Number(state.processedEmails || 0);
}

async function loadRecruitmentModule(force = false) {
    if (recruitmentLoadedOnce && !force) {
        renderRecruitmentSummary();
        renderRecruitmentJobs();
        renderRecruitmentCandidates();
        return;
    }

    recruitmentPage?.classList.add("recruitment-loading");

    try {
        const result = await recruitmentApiRequest(
            "/api/recruitment/dashboard"
        );

        recruitmentJobs =
            result.jobs || [];

        recruitmentCandidates =
            result.candidates || [];

        renderAutomationState(
            result.automation || {}
        );

        renderRecruitmentSummary();
        renderRecruitmentJobFilter();
        renderRecruitmentJobs();
        renderRecruitmentCandidates();

        recruitmentLoadedOnce = true;

    } catch (error) {
        console.error(
            "RECRUITMENT LOAD ERROR:",
            error
        );

        if (recruitmentEls.candidatesBody) {
            recruitmentEls.candidatesBody.innerHTML =
                `<tr>
                    <td colspan="6">
                        Unable to load Recruitment.
                        ${escapeRecruitmentHtml(error.message || "")}
                    </td>
                </tr>`;
        }

    } finally {
        recruitmentPage?.classList.remove(
            "recruitment-loading"
        );
    }
}

function findRecruitmentCandidate(id) {
    return recruitmentCandidates.find(c => c.id === id);
}

function renderCandidateDetail(candidate) {
    if (!candidate || !recruitmentEls.detailBody) return;
    recruitmentEls.detailName.textContent = candidate.name || "Candidate";
    recruitmentEls.detailSubtitle.textContent = `${candidate.jobTitle || "Needs Assignment"} · ${candidate.email || "No email"}`;
    const matched = candidate.analysis?.matchedRequirements || [];
    const strengths = candidate.analysis?.strengths || [];
    const gaps = candidate.analysis?.gaps || [];
    const jobOptions = recruitmentJobs.filter(j => j.status !== "closed" || j.id === candidate.jobId).map(job => `<option value="${job.id}" ${job.id === candidate.jobId ? "selected" : ""}>${escapeRecruitmentHtml(job.title)}</option>`).join("");
    recruitmentEls.detailBody.innerHTML = `
        <div class="candidate-score-hero">
            <div class="candidate-score-ring ${scoreClass(candidate.aiScore)}"><strong>${candidate.aiScore ?? "—"}</strong><span>/100</span></div>
            <div><span class="recruitment-status ${escapeRecruitmentHtml(candidate.status)}">${escapeRecruitmentHtml(recruitmentStatusLabel(candidate.status))}</span><h3>${escapeRecruitmentHtml(candidate.analysis?.recommendation || "HR Review")}</h3><p>${escapeRecruitmentHtml(candidate.analysis?.summary || candidate.processingError || "No AI summary available yet.")}</p></div>
        </div>
        <div class="candidate-detail-grid">
            <div class="candidate-detail-box"><span>Email</span><strong>${escapeRecruitmentHtml(candidate.email || "—")}</strong></div>
            <div class="candidate-detail-box"><span>Phone</span><strong>${escapeRecruitmentHtml(candidate.phone || "—")}</strong></div>
            <div class="candidate-detail-box"><span>CV File</span><strong>${escapeRecruitmentHtml(candidate.cvFileName || "—")}</strong></div>
            <div class="candidate-detail-box"><span>Received</span><strong>${escapeRecruitmentHtml(toDateText(candidate.receivedAt || candidate.createdAt))}</strong></div>
        </div>
        <div class="candidate-analysis-section"><h4>Assigned Job</h4><select class="candidate-assignment-select" id="candidateJobAssignment"><option value="">Needs Assignment</option>${jobOptions}</select></div>
        <div class="candidate-analysis-section"><h4>Strengths</h4><div class="candidate-analysis-list">${strengths.length ? strengths.map(x => `<div class="candidate-analysis-item">${escapeRecruitmentHtml(x)}</div>`).join("") : '<div class="candidate-analysis-item">No strengths extracted.</div>'}</div></div>
        <div class="candidate-analysis-section"><h4>Matched Requirements</h4><div class="candidate-analysis-list">${matched.length ? matched.map(x => `<div class="candidate-analysis-item"><strong>${escapeRecruitmentHtml(x.requirement || x)}</strong>${escapeRecruitmentHtml(x.evidence || "")}</div>`).join("") : '<div class="candidate-analysis-item">No matched requirements listed.</div>'}</div></div>
        <div class="candidate-analysis-section"><h4>Gaps / Items for HR Review</h4><div class="candidate-analysis-list">${gaps.length ? gaps.map(x => `<div class="candidate-analysis-item">${escapeRecruitmentHtml(x)}</div>`).join("") : '<div class="candidate-analysis-item">No major gap identified.</div>'}</div></div>
    `;
    recruitmentEls.shortlistBtn.disabled = !candidate.jobId || candidate.status === "shortlisted";
    recruitmentEls.notShortlistBtn.disabled = candidate.status === "not_shortlisted";
}

function openCandidateDetail(id) {
    const candidate = findRecruitmentCandidate(id);
    if (!candidate) return;
    selectedRecruitmentCandidateId = id;
    renderCandidateDetail(candidate);
    recruitmentEls.detailModal?.classList.add("active");
}

async function refreshRecruitmentAndKeepCandidate(id = null) {
    recruitmentLoadedOnce = false;
    await loadRecruitmentModule(true);
    if (id) {
        const c = findRecruitmentCandidate(id);
        if (c) {
            selectedRecruitmentCandidateId = id;
            renderCandidateDetail(c);
        }
    }
}

recruitmentEls.openCreateJobBtn?.addEventListener("click", () => openRecruitmentJobModal());
recruitmentEls.closeJobModal?.addEventListener("click", closeRecruitmentJobModal);
recruitmentEls.cancelJobBtn?.addEventListener("click", closeRecruitmentJobModal);
recruitmentEls.closeDetailModal?.addEventListener("click", closeCandidateDetailModal);

recruitmentEls.jobForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const recommendedScore = Number(recruitmentEls.minScore.value || 80);
    const reviewScore = Number(recruitmentEls.reviewScore.value || 60);
    if (reviewScore >= recommendedScore) {
        recruitmentEls.jobFormStatus.textContent = "Review score must be lower than recommended score.";
        return;
    }
    const payload = {
        id: recruitmentEls.jobId.value || null,
        title: recruitmentEls.jobTitle.value.trim(),
        department: recruitmentEls.department.value.trim(),
        location: recruitmentEls.location.value.trim(),
        employmentType: recruitmentEls.employmentType.value,
        recommendedScore,
        reviewScore,
        description: recruitmentEls.description.value.trim(),
        mandatoryCriteria: splitCriteria(recruitmentEls.mandatory.value),
        preferredCriteria: splitCriteria(recruitmentEls.preferred.value)
    };
    try {
        recruitmentEls.jobFormStatus.textContent = "Saving...";
        await recruitmentApiRequest(
    "/api/recruitment/jobs",
    {
        method: "POST",
        body: {
            title: payload.title,
            department: payload.department,
            location: payload.location,
            employmentType: payload.employmentType,
            description: payload.description,
            mandatoryCriteria: payload.mandatoryCriteria,
            preferredCriteria: payload.preferredCriteria,
            recommendedThreshold: payload.recommendedScore,
            reviewThreshold: payload.reviewScore
        }
    }
);
        closeRecruitmentJobModal();
        await refreshRecruitmentAndKeepCandidate();
    } catch (error) {
        recruitmentEls.jobFormStatus.textContent = error.message || "Unable to save job.";
    }
});

recruitmentEls.jobsGrid?.addEventListener("click", async event => {
    const btn = event.target.closest("[data-job-action]");
    if (!btn) return;
    const job = recruitmentJobs.find(j => j.id === btn.dataset.jobId);
    if (!job) return;
    if (btn.dataset.jobAction === "edit") {
        openRecruitmentJobModal(job);
        return;
    }
    if (btn.dataset.jobAction === "toggle") {
        try {
await recruitmentApiRequest(
    "/api/recruitment/jobs/status",
    {
        method: "PATCH",
        body: {
            jobId: job.id,
            status:
                job.status === "closed"
                    ? "open"
                    : "closed"
        }
    }
);
            await refreshRecruitmentAndKeepCandidate();
        } catch (error) {
            alert(error.message || "Unable to update job status.");
        }
    }
});

recruitmentEls.candidatesBody?.addEventListener("click", event => {
    const btn = event.target.closest("[data-candidate-id]");
    if (btn) openCandidateDetail(btn.dataset.candidateId);
});

[recruitmentEls.candidateSearch, recruitmentEls.jobFilter, recruitmentEls.statusFilter].forEach(el => {
    el?.addEventListener(el?.tagName === "INPUT" ? "input" : "change", renderRecruitmentCandidates);
});

document.querySelectorAll(".recruitment-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".recruitment-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".recruitment-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.recruitmentTab;
        byId(`recruitment${target.charAt(0).toUpperCase()}${target.slice(1)}Panel`)?.classList.add("active");
    });
});

recruitmentEls.syncBtn?.addEventListener("click", async () => {
    const original = recruitmentEls.syncBtn.textContent;
    try {
        recruitmentEls.syncBtn.disabled = true;
        recruitmentEls.syncBtn.textContent = "Syncing...";
      const result = await recruitmentApiRequest(
    "/api/recruitment/sync",
    {
        method: "POST"
    }
);
        await refreshRecruitmentAndKeepCandidate();
    alert(
    `Inbox sync complete.\n\n` +
    `${result.emailsFound || 0} email(s) found\n` +
    `${result.cvAttachmentsFound || 0} CV attachment(s) detected\n` +
    `${result.processed || 0} new candidate(s) added\n` +
    `${result.duplicatesSkipped || 0} duplicate(s) skipped\n` +
    `${result.failed || 0} failed`
);
    } catch (error) {
        alert(error.message || "Email sync failed.");
    } finally {
        recruitmentEls.syncBtn.disabled = false;
        recruitmentEls.syncBtn.textContent = original;
    }
});

recruitmentEls.viewCvBtn?.addEventListener("click", async () => {
    if (!selectedRecruitmentCandidateId) return;

    const originalText = recruitmentEls.viewCvBtn.textContent;

    // Open the window immediately from the user's click.
    // This prevents Safari/Chrome from treating it as a blocked popup.
    const cvWindow = window.open("", "_blank");

    if (!cvWindow) {
        alert("Unable to open a new tab. Please allow pop-ups for this website.");
        return;
    }

    cvWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Loading CV...</title>
        </head>
        <body style="
            font-family: Arial, sans-serif;
            padding: 30px;
            text-align: center;
        ">
            <p>Loading CV...</p>
        </body>
        </html>
    `);

    try {
        recruitmentEls.viewCvBtn.disabled = true;
        recruitmentEls.viewCvBtn.textContent = "Opening CV...";

        const user = window.adminAuth?.currentUser;

        if (!user) {
            throw new Error("Admin authentication is required.");
        }

        const idToken = await user.getIdToken();

        const response = await fetch(
            `${RECRUITMENT_API_BASE}/api/recruitment/candidates/cv?candidateId=${encodeURIComponent(selectedRecruitmentCandidateId)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            }
        );

        if (!response.ok) {
            const responseText = await response.text();

            let errorData = {};

            try {
                errorData = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch {
                // Response was not JSON.
            }

            throw new Error(
                [errorData.message, errorData.error]
                    .filter(Boolean)
                    .join(" | ") ||
                `Unable to open CV. HTTP ${response.status}`
            );
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        cvWindow.location.href = objectUrl;

        setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
        }, 60000);

    } catch (error) {
        console.error("VIEW CV ERROR:", error);

        if (cvWindow && !cvWindow.closed) {
            cvWindow.close();
        }

        alert(
            error.message ||
            "Unable to open CV."
        );

    } finally {
        recruitmentEls.viewCvBtn.disabled = false;
        recruitmentEls.viewCvBtn.textContent = originalText;
    }
});

recruitmentEls.rescreenBtn?.addEventListener("click", async () => {
    if (!selectedRecruitmentCandidateId) return;
    const assignment = byId("candidateJobAssignment")?.value || "";
    if (!assignment) {
        alert("Select a job opening first.");
        return;
    }
    try {
        recruitmentEls.rescreenBtn.disabled = true;
        recruitmentEls.rescreenBtn.textContent = "Screening...";
        await recruitmentCallable("rescreenCandidate")({ candidateId: selectedRecruitmentCandidateId, jobId: assignment });
        await refreshRecruitmentAndKeepCandidate(selectedRecruitmentCandidateId);
    } catch (error) {
        alert(error.message || "AI screening failed.");
    } finally {
        recruitmentEls.rescreenBtn.disabled = false;
        recruitmentEls.rescreenBtn.textContent = "Run AI Again";
    }
});

recruitmentEls.shortlistBtn?.addEventListener("click", async () => {
    if (!selectedRecruitmentCandidateId) {
        return;
    }

    const candidate =
        recruitmentCandidates.find(
            item =>
                item.id === selectedRecruitmentCandidateId
        );

    if (!candidate) {
        alert("Candidate not found.");
        return;
    }

    const assignment =
        recruitmentEls.candidateJobAssignment?.value ||
        candidate.jobId ||
        "";

    if (!assignment) {
        alert("Please assign this candidate to a job before shortlisting.");
        return;
    }

    const confirmed = confirm(
        `Shortlist ${candidate.name || "this candidate"}?\n\n` +
        `A shortlist email will be sent to ${candidate.email || "the candidate"}.`
    );

    if (!confirmed) {
        return;
    }

    const originalText =
        recruitmentEls.shortlistBtn.textContent;

    try {
        recruitmentEls.shortlistBtn.disabled = true;
        recruitmentEls.shortlistBtn.textContent =
            "Shortlisting...";

        const result =
            await recruitmentApiRequest(
                "/api/recruitment/candidates/shortlist",
                {
                    method: "POST",
                    body: {
                        candidateId:
                            selectedRecruitmentCandidateId
                    }
                }
            );

        alert(
            result.message ||
            "Candidate shortlisted successfully."
        );

       await refreshRecruitmentAndKeepCandidate(
    selectedRecruitmentCandidateId
);

    } catch (error) {
        console.error(
            "SHORTLIST CANDIDATE ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to shortlist candidate."
        );

    } finally {
        recruitmentEls.shortlistBtn.disabled = false;
        recruitmentEls.shortlistBtn.textContent =
            originalText;
    }
});

recruitmentEls.notShortlistBtn?.addEventListener("click", async () => {
    if (!selectedRecruitmentCandidateId) {
        return;
    }

    const candidate =
        recruitmentCandidates.find(
            item =>
                item.id === selectedRecruitmentCandidateId
        );

    if (!candidate) {
        alert("Candidate not found.");
        return;
    }

    const confirmed = confirm(
        `Mark ${candidate.name || "this candidate"} as Not Shortlisted?`
    );

    if (!confirmed) {
        return;
    }

    const originalText =
        recruitmentEls.notShortlistBtn.textContent;

    try {
        recruitmentEls.notShortlistBtn.disabled = true;
        recruitmentEls.notShortlistBtn.textContent =
            "Updating...";

        const result =
            await recruitmentApiRequest(
                "/api/recruitment/candidates/not-shortlisted",
                {
                    method: "PATCH",
                    body: {
                        candidateId:
                            selectedRecruitmentCandidateId
                    }
                }
            );

        alert(
            result.message ||
            "Candidate marked as not shortlisted."
        );

     await refreshRecruitmentAndKeepCandidate(
    selectedRecruitmentCandidateId
);

    } catch (error) {
        console.error(
            "NOT SHORTLISTED ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to update candidate."
        );

    } finally {
        recruitmentEls.notShortlistBtn.disabled = false;
        recruitmentEls.notShortlistBtn.textContent =
            originalText;
    }
});

byId("candidateDetailBody")?.addEventListener("change", async event => {
    if (event.target.id !== "candidateJobAssignment" || !selectedRecruitmentCandidateId) return;
    const jobId = event.target.value;
    if (!jobId) return;
    try {
       await recruitmentApiRequest(
    "/api/recruitment/candidates/assign-job",
    {
        method: "PATCH",
        body: {
            candidateId: selectedRecruitmentCandidateId,
            jobId
        }
    }
);
        await refreshRecruitmentAndKeepCandidate(selectedRecruitmentCandidateId);
    } catch (error) {
        alert(error.message || "Unable to assign job.");
    }
});

byId("adminMobileRecruitmentBtn")?.addEventListener("click", () => {
    closeAdminMobileMoreMenu();
    byId("recruitmentBtn")?.click();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeRecruitmentJobModal();
        closeCandidateDetailModal();
    }
});

