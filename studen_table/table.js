// https://www.w3schools.com/jsref/event_onblur.asp
// https://www.tutorialspoint.com/How-to-add-rows-to-a-table-using-JavaScript-DOM
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// https://www.w3schools.com/js/js_operators.asp
// https://www.w3schools.com/jsref/prop_html_contenteditable.asp

const elements = {
    addRow: document.querySelector('#addrow-btn'),
    addColumn: document.querySelector('#addcolumn-btn'),
    averageHeader: document.querySelector('#average'),
    retrieveTable: document.querySelector('#retrieve-btn')
};

// Adding event listeners to each element
Object.keys(elements).forEach(key => {
    if (key === 'addRow' || key === 'addColumn') {
        elements[key].addEventListener('click', () => {
            if (key === 'addRow') {
                addRow();
            } else if (key === 'addColumn') {
                addAssignment();
            }
        });
    } else if (key === 'retrieveTable') {
        elements[key].addEventListener('click', retrieveTable);
    } else if (key === 'averageHeader') {
        elements[key].addEventListener('click', conversionTable);
    }
});
initializeTable();
savedState(); // Initialize savedState when the document is loaded

function initializeTable() {
    const tbody = document.querySelector('#grades-table tbody');
    for (let i = 0; i < 10; i++) { // Initialize 10 students
        const row = tbody.insertRow(-1); // Insert at the end of the table body

        // Insert cells for student name and ID
        const nameCell = row.insertCell(0);
        nameCell.textContent = 'Student ' + (i + 1);
        nameCell.className = 'name';
        nameCell.contentEditable = 'true'; // Make the cell editable

        const idCell = row.insertCell(1);
        idCell.textContent = 'ID ' + (i + 1);
        idCell.className = 'id';
        idCell.contentEditable = 'true'; // Make the cell editable

        // Insert cells for grades
        for (let j = 2; j < 7; j++) { // 5 assignments per student
            const cell = row.insertCell(j);
            cell.textContent = '-';
            cell.contentEditable = 'true';
            cell.className = 'grade';
            cell.onblur = recalculateAverages; // Recalculate when user finishes editing
        }

        // Insert cell for average
        const averageCell = row.insertCell(7);
        averageCell.className = 'average';
    }
    recalculateAverages();
}


function savedState() {
    const table = document.querySelector('#grades-table');
    savedState = {
        rowCount: table.tBodies[0].rows.length,
        columnCount: table.rows[0].cells.length
    };
}

let savedStateData = {};
function retrieveTable() {
    if (!savedStateData) return; // If saved state data is not available, return

    const table = document.querySelector('#grades-table');
    const tbody = table.tBodies[0];

    // Remove excess rows if any
    while (tbody.rows.length > savedStateData.rowCount) {
        tbody.deleteRow(savedStateData.rowCount); // Delete rows beyond saved state
    }

    // Remove excess columns if any
    const columnCount = table.rows[0].cells.length;
    while (columnCount > savedStateData.columnCount) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(savedStateData.columnCount); // Delete cells beyond saved state
        }
    }
}

function recalculateAverages() {
    const rows = document.querySelectorAll('#grades-table tbody tr');
    let unsubmittedCount = 0;

    rows.forEach(row => {
        let sum = 0;
        let count = 0;
        const grades = row.querySelectorAll('.grade');

        grades.forEach(cell => {
            const value = parseInt(cell.textContent) || 0;
            if (cell.textContent === '-' || value < 0 || value > 100) {
                unsubmittedCount++;
                cell.textContent = '-';
                cell.classList.add('unsubmitted');
            } else {
                cell.classList.remove('unsubmitted');
                sum += value;
                count++;
            }
        });

        const average = count > 0 ? Math.round(sum / count) : 0;
        const averageCell = row.querySelector('.average');
        averageCell.textContent = `${average.toFixed(2)}%`;
        averageCell.setAttribute('data', average.toFixed(2));

        // background colour of final grade control
        averageCell.textContent = average + '%';
        if (average < 60) {
            averageCell.classList.add('below-average');
        } else {
            averageCell.classList.remove('below-average');
        }
    });
    document.getElementById('unsubmitted-count').textContent = 'Unsubmitted Assignments: ' + unsubmittedCount;
}

function addRow() {
    const table = document.querySelector('#grades-table');
    const tbody = table.querySelector('tbody');
    const rowCount = tbody.rows.length;

    // Create a new row
    const row = tbody.insertRow(-1);

    // Insert cells for student name and ID
    const nameCell = row.insertCell(0);
    nameCell.textContent = 'New Student';
    nameCell.className = 'name';
    nameCell.contentEditable = 'true'; // Make the cell editable

    const idCell = row.insertCell(1);
    idCell.textContent = 'ID ' + (rowCount + 1);
    idCell.className = 'id';
    idCell.contentEditable = 'true'; // Make the cell editable

    // Determine the number of columns in the table
    const columnCount = table.rows[0].cells.length;

    // Insert cells for grades
    for (let j = 2; j < columnCount - 1; j++) {
        const cell = row.insertCell(j);
        cell.textContent = '-';
        cell.contentEditable = 'true';
        cell.className = 'grade';
        cell.onblur = recalculateAverages;
    }

    // Insert cell for average
    const averageCell = row.insertCell(columnCount - 1);
    averageCell.className = 'average';

    recalculateAverages();
}

function addAssignment() {
    const table = document.querySelector('#grades-table');
    const rows = table.rows;

    // Loop through all rows in the table
    for (let i = 0; i < rows.length; i++) {
        // position where the new column should be inserted
        // right before the "Average" column
        const insertPosition = rows[i].cells.length - 1;

        // Insert a new cell
        const newCell = rows[i].insertCell(insertPosition);

        if (i === 0) { // If the current row is the header row
            newCell.textContent = `Assignment ${insertPosition - 1}`;
            newCell.style.backgroundColor = '#333'; // Assignment Heading background colour
            newCell.style.color = '#fff';  // Assignment Heading colour
            newCell.contentEditable = 'true';
            newCell.className = 'center'; // center-align the text
        } else {
            // student rows editable and initialize with a placeholder
            newCell.textContent = '-';
            newCell.contentEditable = 'true';
            newCell.className = 'grade';
            newCell.onblur = recalculateAverages;
        }
    }
    recalculateAverages(); // Update the averages to include the new column
}

let displayMode = 'percent'; // Possible values: 'percent', 'letter', 'scale'
function conversionTable() {
    const averageCells = document.querySelectorAll('.average');
    if (displayMode === 'percent') {
        displayMode = 'letter';
    } else if (displayMode === 'letter') {
        displayMode = 'scale';
    } else {
        displayMode = 'percent';
    }

    averageCells.forEach(cell => {
        const percent = parseFloat(cell.getAttribute('data'));
        if (isNaN(percent)) return;

        if (displayMode === 'percent') {
            cell.textContent = convertToLetterGrade(percent);
        } else if (displayMode === 'letter') {
            cell.textContent = convertToScale(percent).toFixed(2);
        } else {
            cell.textContent = `${percent}%`;
        }
    });
}
function convertToLetterGrade(percent) {
    if (percent >= 93) return 'A';
    if (percent >= 90) return 'A-';
    if (percent >= 87) return 'B+';
    if (percent >= 83) return 'B';
    if (percent >= 80) return 'B-';
    if (percent >= 77) return 'C+';
    if (percent >= 73) return 'C';
    if (percent >= 70) return 'C-';
    if (percent >= 67) return 'D+';
    if (percent >= 63) return 'D';
    if (percent >= 60) return 'D-';
    return 'F';
}
function convertToScale(percent) {
    if (percent >= 93) return 4.0;
    if (percent >= 90) return 3.7;
    if (percent >= 87) return 3.3;
    if (percent >= 83) return 3.0;
    if (percent >= 80) return 2.7;
    if (percent >= 77) return 2.3;
    if (percent >= 73) return 2.0;
    if (percent >= 70) return 1.7;
    if (percent >= 67) return 1.3;
    if (percent >= 63) return 1.0;
    if (percent >= 60) return 0.7;
    return 0.0;
}