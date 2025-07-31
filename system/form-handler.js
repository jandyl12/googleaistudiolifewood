// FILE: system/form-handler.js (NEW FILE)

// Import the necessary Firebase functions from your central config file
import { db, collection, addDoc } from './firebase-config.js';

console.log("Form handler script loaded.");

// Find the form using the ID we added in index.html
const applicationForm = document.getElementById('application-form');

// Check if the form actually exists on the page before doing anything
if (applicationForm) {
    console.log("Application form found. Attaching submit listener.");
    
    applicationForm.addEventListener('submit', async (e) => {
        // This is the most important line. It stops the HTTP 405 error.
        e.preventDefault(); 
        console.log("Form submission intercepted by JavaScript.");
        
        const submitButton = applicationForm.querySelector('#submit-btn');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        try {
            // Collect all the data from the form fields
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

            // Save the collected data to your Firestore "applications" collection
            await addDoc(collection(db, "applications"), applicantData);
            
            // Set a flag in the browser's memory to show the success message
            sessionStorage.setItem('applicationSubmitted', 'true');
            
            // Reload the page. The script in index.html will see the flag and show the message.
            window.location.reload();

        } catch (error) {
            console.error("Error submitting to Firestore:", error);
            alert('An error occurred. Please see the console for details.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Application';
            }
        }
    });
} else {
    // This message helps debug if the form ID is still wrong
    console.warn("Warning: The form with id='application-form' was not found on this page.");
}