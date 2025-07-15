document.addEventListener('DOMContentLoaded', () => {
    const numGradesSelect = document.getElementById('numGrades');
    const gradeInputsBody = document.getElementById('gradeInputs');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result'); // Still reference, but will be less used


    // Function to generate grade input fields
    function generateGradeInputs(num) {
        gradeInputsBody.innerHTML = ''; // Clear previous inputs


        // Add table header row
        const headerRow = document.createElement('tr');
        for (let i = 1; i <= num; i++) {
            const th = document.createElement('th');
            th.textContent = `Grade ${i}`;
            headerRow.appendChild(th);
        }
        const finalGradeTh = document.createElement('th');
        finalGradeTh.textContent = 'Average Grade'; // Changed header text
        headerRow.appendChild(finalGradeTh);
        gradeInputsBody.appendChild(headerRow);


        // Add input row
        const inputRow = document.createElement('tr');
        for (let i = 1; i <= num; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '100'; // Assuming grades are out of 100
            input.placeholder = `Enter grade ${i}`;
            input.classList.add('grade-input'); // Add a class for easy selection
            td.appendChild(input);
            inputRow.appendChild(td);
        }
        const finalGradeCell = document.createElement('td'); // Renamed for clarity
        finalGradeCell.classList.add('final-grade-cell'); // Add a class for styling
        finalGradeCell.textContent = '-'; // Placeholder initially
        inputRow.appendChild(finalGradeCell);
        gradeInputsBody.appendChild(inputRow);
    }


    // Initial generation of inputs (for 2 grades by default)
    generateGradeInputs(parseInt(numGradesSelect.value));


    // Event listener for dropdown change
    numGradesSelect.addEventListener('change', (event) => {
        const selectedNum = parseInt(event.target.value);
        generateGradeInputs(selectedNum);
        // We no longer need to clear resultDiv, as the table itself is reset
        // and the finalGradeCell will be reset by generateGradeInputs
    });


    // Event listener for calculate button
    calculateBtn.addEventListener('click', () => {
        const gradeInputs = document.querySelectorAll('.grade-input');
        const finalGradeCell = document.querySelector('.final-grade-cell'); // Select the final grade display cell
        let totalGrades = 0;
        let validGradesCount = 0;
        let allInputsValid = true; // Flag to track overall validity


        // Reset styling and text before recalculating
        finalGradeCell.textContent = '-';
        finalGradeCell.classList.remove('grade-fail');


        gradeInputs.forEach(input => {
            const grade = parseFloat(input.value);
            // Basic validation: ensure it's a number and within range
            if (isNaN(grade) || grade < 0 || grade > 100) {
                if (input.value !== '') { // Only alert if something was entered and it's invalid
                    alert('Please enter valid grades between 0 and 100 for all fields.');
                    allInputsValid = false; // Mark that not all inputs are valid
                    return; // Exit forEach early if an invalid input is found
                }
                // If input.value is empty, we don't alert here, but count as not valid
                allInputsValid = false;
            } else {
                totalGrades += grade;
                validGradesCount++;
            }
        });


        // Only proceed if all inputs were valid and all were filled
        if (allInputsValid && validGradesCount === gradeInputs.length && validGradesCount > 0) {
            const average = totalGrades / validGradesCount;
            finalGradeCell.textContent = average.toFixed(2); // Display average in the table cell


            const gifContainer = document.getElementById('gifContainer');


            // Apply red background if average < 6
            if (average < 6) {
                finalGradeCell.classList.add('grade-fail');
                finalGradeCell.classList.remove('grade-pass');
                gifContainer.innerHTML = "<img src='fail.gif' alt='Failed gif'>";
            } else {
                finalGradeCell.classList.add('grade-pass');
                finalGradeCell.classList.remove('grade-fail');
                gifContainer.innerHTML = "<img src='pass.gif' alt='Passed gif'>"; // Ensure it's removed if previously failed
            }
            resultDiv.textContent = ''; // Clear external result div if it was used
        } else if (validGradesCount < gradeInputs.length && allInputsValid) {
             // This case means some fields are empty but others are valid
             alert('Please enter all grades to calculate the average.');
             finalGradeCell.textContent = '-';
             resultDiv.textContent = '';
        } else {
            // If allInputsValid is false due to an invalid entry (already alerted) or no grades entered
            finalGradeCell.textContent = '-';
            resultDiv.textContent = 'Please enter your grades.'; // This might still appear depending on the flow
            gifContainer.innerHTML = '';
        }
    });
});