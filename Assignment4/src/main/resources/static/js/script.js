const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const searchBtn = document.getElementById("searchBtn");

const resultSection = document.getElementById("resultSection");
const messageBox = document.getElementById("messageBox");


calculateBtn.addEventListener("click", createResult);

resetBtn.addEventListener("click", resetForm);

searchBtn.addEventListener("click", searchResult);


async function createResult() {

    clearMessage();

    const data = collectFormData();

    const validationError = validateForm(data);

    if (validationError) {

        showMessage(
            validationError,
            "error"
        );

        return;
    }


    try {

        calculateBtn.disabled = true;

        calculateBtn.textContent = "Saving...";


        const response = await fetch(
            "/api/results",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to save result."
            );
        }


        showMessage(
            "Result calculated and saved successfully.",
            "success"
        );


        displayResult(result);


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    } finally {

        calculateBtn.disabled = false;

        calculateBtn.textContent =
            "Calculate & Save Result";
    }
}


function collectFormData() {

    return {

        prn:
            document.getElementById("prn").value.trim(),

        studentName:
            document.getElementById("studentName").value.trim(),

        branch:
            document.getElementById("branch").value,

        semester:
            Number(
                document.getElementById("semester").value
            ),

        academicYear:
            document
                .getElementById("academicYear")
                .value
                .trim(),

        subjects: [

            {
                name:
                    document
                        .getElementById("subject1Name")
                        .value
                        .trim(),

                see:
                    Number(
                        document
                            .getElementById("subject1See")
                            .value
                    ),

                ese:
                    Number(
                        document
                            .getElementById("subject1Ese")
                            .value
                    )
            },


            {
                name:
                    document
                        .getElementById("subject2Name")
                        .value
                        .trim(),

                see:
                    Number(
                        document
                            .getElementById("subject2See")
                            .value
                    ),

                ese:
                    Number(
                        document
                            .getElementById("subject2Ese")
                            .value
                    )
            },


            {
                name:
                    document
                        .getElementById("subject3Name")
                        .value
                        .trim(),

                see:
                    Number(
                        document
                            .getElementById("subject3See")
                            .value
                    ),

                ese:
                    Number(
                        document
                            .getElementById("subject3Ese")
                            .value
                    )
            },


            {
                name:
                    document
                        .getElementById("subject4Name")
                        .value
                        .trim(),

                see:
                    Number(
                        document
                            .getElementById("subject4See")
                            .value
                    ),

                ese:
                    Number(
                        document
                            .getElementById("subject4Ese")
                            .value
                    )
            }

        ]
    };
}


function validateForm(data) {

    if (!data.prn) {
        return "Please enter PRN.";
    }


    if (!data.studentName) {
        return "Please enter student name.";
    }


    if (!data.branch) {
        return "Please select a branch.";
    }


    if (!data.semester ||
        data.semester < 1 ||
        data.semester > 8) {

        return "Please select a valid semester.";
    }


    if (!data.academicYear) {
        return "Please enter academic year.";
    }


    for (let i = 0; i < data.subjects.length; i++) {

        const subject = data.subjects[i];

        const subjectNumber = i + 1;


        if (!subject.name) {

            return `Please enter the name of Subject ${subjectNumber}.`;
        }


        if (
            subject.see < 0 ||
            subject.see > 30 ||
            !Number.isInteger(subject.see)
        ) {

            return `SEE marks for Subject ${subjectNumber} must be between 0 and 30.`;
        }


        if (
            subject.ese < 0 ||
            subject.ese > 70 ||
            !Number.isInteger(subject.ese)
        ) {

            return `ESE marks for Subject ${subjectNumber} must be between 0 and 70.`;
        }
    }


    return null;
}


function displayResult(result) {

    resultSection.classList.remove("hidden");


    document.getElementById(
        "studentSummary"
    ).innerHTML = `

        <div class="student-item">
            <span>PRN</span>
            <strong>${escapeHtml(result.prn)}</strong>
        </div>

        <div class="student-item">
            <span>Student Name</span>
            <strong>${escapeHtml(result.studentName)}</strong>
        </div>

        <div class="student-item">
            <span>Branch</span>
            <strong>${escapeHtml(result.branch)}</strong>
        </div>

        <div class="student-item">
            <span>Semester</span>
            <strong>${result.semester}</strong>
        </div>

        <div class="student-item">
            <span>Academic Year</span>
            <strong>${escapeHtml(result.academicYear)}</strong>
        </div>

    `;


    const tableBody =
        document.getElementById(
            "resultTableBody"
        );


    tableBody.innerHTML = "";


    result.subjects.forEach(
        (subject, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    ${escapeHtml(subject.subjectName)}
                </td>

                <td>
                    ${subject.seeMarks}
                </td>

                <td>
                    ${subject.eseMarks}
                </td>

                <td>
                    <strong>
                        ${subject.totalMarks}
                    </strong>
                </td>

            `;


            tableBody.appendChild(row);
        }
    );


    document.getElementById(
        "grandTotal"
    ).textContent = result.grandTotal;


    document.getElementById(
        "percentage"
    ).textContent = result.percentage;


    const resultStatus =
        document.getElementById(
            "resultStatus"
        );


    resultStatus.textContent =
        result.resultStatus;


    if (result.resultStatus === "PASS") {

        resultStatus.style.color = "#15803d";

    } else {

        resultStatus.style.color = "#dc2626";
    }


    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}


async function searchResult() {

    clearMessage();

    const prn =
        document
            .getElementById("searchPrn")
            .value
            .trim();


    if (!prn) {

        showMessage(
            "Please enter a PRN to search.",
            "error"
        );

        return;
    }


    try {

        searchBtn.disabled = true;

        searchBtn.textContent = "Searching...";


        const response = await fetch(
            `/api/results/prn/${encodeURIComponent(prn)}`
        );


        const results = await response.json();


        if (!response.ok) {

            throw new Error(
                results.message ||
                "No result found."
            );
        }


        /*
         * The API returns all semesters for the PRN.
         * For this page we display the first result.
         *
         * You can later add a semester selector
         * if required.
         */

        if (results.length > 0) {

            displayResult(results[0]);

            showMessage(
                "Result found successfully.",
                "success"
            );
        }


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

        resultSection.classList.add("hidden");

    } finally {

        searchBtn.disabled = false;

        searchBtn.textContent =
            "Search Result";
    }
}


function resetForm() {

    document
        .querySelectorAll(
            "input"
        )
        .forEach(input => {

            input.value = "";
        });


    document
        .querySelectorAll(
            "select"
        )
        .forEach(select => {

            select.selectedIndex = 0;
        });


    resultSection.classList.add(
        "hidden"
    );


    clearMessage();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showMessage(
    message,
    type
) {

    messageBox.textContent = message;

    messageBox.className =
        `message ${type}`;

}


function clearMessage() {

    messageBox.textContent = "";

    messageBox.className =
        "message hidden";
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}