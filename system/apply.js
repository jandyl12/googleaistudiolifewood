import { db, collection, addDoc } from './firebase-config.js';

console.log("apply.js script has been loaded."); // You should see this in the console

const applicationForm = document.getElementById('application-form');
const submitButton = document.getElementById('submit-btn');

// This check prevents crashes if the HTML is wrong
if (applicationForm && submitButton) {
    console.log("Form and button found. Attaching event listener.");

    applicationForm.addEventListener('submit', async (e) => {
        // This line is ESSENTIAL to prevent the HTTP 405 error.
        e.preventDefault(); 
        console.log("Form submission default action prevented.");

        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const applicantData = {
                firstName: applicationForm.firstName.value,
                lastName: applicationForm.lastName.value,
                email: applicationForm.email.value,
                age: parseInt(applicationForm.age.value),
                degree: applicationForm.degree.value,
                project: applicationForm.project.value,
                experience: applicationForm.experience.value,
                resumeLink: applicationForm.resumeLink.value,
                startTime: applicationForm.startTime.value,
                endTime: applicationForm.endTime.value,
                submissionDate: new Date()
            };

            console.log("Submitting data to Firestore:", applicantData);
            await addDoc(collection(db, "applications"), applicantData);
            
            console.log("Data successfully saved. Setting success flag and redirecting.");
            sessionStorage.setItem('applicationSubmitted', 'true');
            window.location.href = 'index.html';

        } catch (error) {
            console.error("Error submitting to Firestore:", error);
            alert('An error occurred. Please see the console for details.');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Application';
        }
    });
} else {
    // This message will appear in the console if the HTML IDs are wrong.
    console.error("Critical Error: Could not find the application form or the submit button. Check the IDs in apply.html.");
}