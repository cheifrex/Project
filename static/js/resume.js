// Add new Work Experience field
function addNewWEField() {
    const newNode = document.createElement('textarea');
    newNode.classList.add('form-control', 'weField', 'mt-2');
    newNode.setAttribute('rows', 2);
    newNode.setAttribute('placeholder', 'Enter here');

    const weOb = document.getElementById('we');
    const weAddButtonOb = document.getElementById('weAddButton');
    weOb.insertBefore(newNode, weAddButtonOb);
}

// Add new Education Qualification field
function addNewEQField() {
    const newNode = document.createElement('textarea');
    newNode.classList.add('form-control', 'eqField', 'mt-2');
    newNode.setAttribute('rows', 2);
    newNode.setAttribute('placeholder', 'Enter here');

    const eqOb = document.getElementById('eq');
    const eqAddButtonOb = document.getElementById('eqAddButton');
    eqOb.insertBefore(newNode, eqAddButtonOb);
}

// Add new Interest/Hobby field
function addNewIHField() {
    const newNode = document.createElement('textarea');
    newNode.classList.add('form-control', 'ihField', 'mt-2');
    newNode.setAttribute('rows', 2);
    newNode.setAttribute('placeholder', 'Enter here');

    const ihOb = document.getElementById('ih');
    const ihAddButtonOb = document.getElementById('ihAddButton');
    ihOb.insertBefore(newNode, ihAddButtonOb);
}

// Toggle visibility of elements
function toggleVisibility(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

// Generate resume
async function generateresume() {
    // Collect user inputs
    const userInputs = {
        name: document.getElementById('nameField').value,
        contact: document.getElementById('contactField').value,
        address: document.getElementById('addressField').value,
        objective: document.getElementById('objectiveField').value,
        workExperience: Array.from(document.getElementsByClassName('weField')).map(field => field.value),
        education: Array.from(document.getElementsByClassName('eqField')).map(field => field.value),
        hobbies: Array.from(document.getElementsByClassName('ihField')).map(field => field.value),
    };

    // Prepare resume text
    const text = `
    Name: ${userInputs.name}
    Contact: ${userInputs.contact}
    Address: ${userInputs.address}
    Objective: ${userInputs.objective}
    Work Experience: ${userInputs.workExperience.join(', ')}
    Education: ${userInputs.education.join(', ')}
    Hobbies: ${userInputs.hobbies.join(', ')}
    `;

    try {
        // Fetch generated resume from backend
        const response = await fetch('http://127.0.0.1:5500/api/generate-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInputs),
        });
        

        if (!response.ok) {
            throw new Error('Failed to generate resume. Please try again.');
        }

        const data = await response.json();

        // Populate the template with backend data
        document.getElementById('nameT1').innerText = userInputs.name;
        document.getElementById('nameT2').innerText = userInputs.name;
        document.getElementById('contactT').innerText = userInputs.contact;
        document.getElementById('addressT').innerText = userInputs.address;
        document.getElementById('objectiveT').innerText = data.generated_resume;

        // Populate lists
        document.getElementById('weT').innerHTML = userInputs.workExperience.map(item => `<li>${item}</li>`).join('');
        document.getElementById('eqT').innerHTML = userInputs.education.map(item => `<li>${item}</li>`).join('');
        document.getElementById('ihT').innerHTML = userInputs.hobbies.map(item => `<li>${item}</li>`).join('');

        // Handle image upload
        const file = document.getElementById('imgField').files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById('imgTemplate').src = reader.result;
            };
            reader.readAsDataURL(file);
        }

        // Show resume template
        toggleVisibility('cv-form', 'cv-template');
    } catch (error) {
        console.error('Error generating resume:', error);
        alert(error.message);
    }
}

// Print resume
function printresume() {
    window.print();
}
