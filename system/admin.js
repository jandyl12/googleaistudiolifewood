import { db, collection, getDocs, doc, updateDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const tableBody = document.getElementById('applications-tbody');
    const searchInput = document.getElementById('search-input');
    const filterProject = document.getElementById('filter-project');
    const dashboardNav = document.getElementById('nav-dashboard');
    const applicationsNav = document.getElementById('nav-applications');
    // NEW: Get reference to the new main scheduled nav item
    const scheduledNav = document.getElementById('nav-scheduled');

    const dashboardSummarySection = document.getElementById('dashboard-summary-section');
    const applicationsContent = document.getElementById('applications-content');
    const viewHiredLink = document.getElementById('view-hired-link');
    const viewRejectedLink = document.getElementById('view-rejected-link');
    
    const badgeTotal = document.getElementById('badge-total');
    const badgeAccepted = document.getElementById('badge-accepted');
    const badgeRejected = document.getElementById('badge-rejected');
    const badgeScheduled = document.getElementById('badge-scheduled'); 
    const cardTotal = document.getElementById('card-total-applicants');
    const cardAccepted = document.getElementById('card-accepted-applicants');
    const cardRejected = document.getElementById('card-rejected-applicants');
    const cardScheduled = document.getElementById('card-scheduled-interview'); 
    const panelTitle = document.getElementById('panel-title');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    let allApplicants = []; 
    let currentView = 'pending';

    // --- Core Functions ---
    const displayApplicants = (applicantList) => {
        tableBody.innerHTML = '';
        if (applicantList.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">No applications found.</td></tr>`;
            return;
        }
        applicantList.forEach(applicant => {
            const row = document.createElement('tr');
            row.setAttribute('data-row-id', applicant.id);
            const experienceSnippet = applicant.experience.length > 40 ? applicant.experience.substring(0, 40) + '...' : applicant.experience;
            const actionContent = !applicant.status 
                ? `<button class="action-btn accept-btn" data-id="${applicant.id}">Accept</button>
                   <button class="action-btn reject-btn" data-id="${applicant.id}">Reject</button>`
                : `<span style="font-weight: bold;">${applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}</span>`;
            row.innerHTML = `
                <td data-label="Applicant Name">${applicant.firstName} ${applicant.lastName}</td>
                <td data-label="Email">${applicant.email}</td>
                <td data-label="Age">${applicant.age}</td>
                <td data-label="Degree">${applicant.degree}</td>
                <td data-label="Project Applied for">${applicant.project}</td>
                <td data-label="Relevant Job Experience">${experienceSnippet}</td>
                <td data-label="Resume Link"><a href="${applicant.resumeLink}" target="_blank" class="resume-link">View Link</a></td>
                <td data-label="Start Time">${applicant.startTime}</td>
                <td data-label="End Time">${applicant.endTime}</td>
                <td data-label="Actions">${actionContent}</td>
            `;
            tableBody.appendChild(row);
        });
    };
    
    const updateDashboardCounts = () => {
        const pendingCount = allApplicants.filter(app => !app.status).length;
        const acceptedCount = allApplicants.filter(app => app.status === 'accepted').length;
        const rejectedCount = allApplicants.filter(app => app.status === 'rejected').length;
        const scheduledCount = allApplicants.filter(app => !!app.interviewDate).length; 
        badgeTotal.textContent = pendingCount;
        badgeAccepted.textContent = acceptedCount;
        badgeRejected.textContent = rejectedCount;
        badgeScheduled.textContent = scheduledCount; 
    };
    
    const filterAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedProject = filterProject.value;
        let viewableApplicants = [];
        if (currentView === 'pending') {
            panelTitle.textContent = "Job Applications";
            viewableApplicants = allApplicants.filter(app => !app.status);
        } else if (currentView === 'accepted') {
            panelTitle.textContent = "Accepted Applicants";
            viewableApplicants = allApplicants.filter(app => app.status === 'accepted');
        } else if (currentView === 'rejected') {
            panelTitle.textContent = "Rejected Applicants";
            viewableApplicants = allApplicants.filter(app => app.status === 'rejected');
        } else if (currentView === 'scheduled') {
            panelTitle.textContent = "Scheduled Interviews";
            viewableApplicants = allApplicants.filter(app => !!app.interviewDate);
        }
        const filteredList = viewableApplicants.filter(applicant => {
            const name = `${applicant.firstName} ${applicant.lastName}`.toLowerCase();
            const email = applicant.email.toLowerCase();
            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            const matchesProject = selectedProject === 'all' || applicant.project === selectedProject;
            return matchesSearch && matchesProject;
        });
        displayApplicants(filteredList);
    };

    async function fetchAndDisplayApplicants() {
        try {
            const querySnapshot = await getDocs(collection(db, "applications"));
            allApplicants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateDashboardCounts();
            switchToDashboardView();
        } catch (error) {
            console.error("Error fetching applications:", error);
            // Changed this to show a content panel on error
            showContentPanel();
            tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:red;">Failed to load data.</td></tr>`;
        }
    }

    async function updateApplicantStatus(docId, newStatus) {
        try {
            const docRef = doc(db, "applications", docId);
            await updateDoc(docRef, { status: newStatus });
            const applicantIndex = allApplicants.findIndex(a => a.id === docId);
            if (applicantIndex !== -1) {
                allApplicants[applicantIndex].status = newStatus;
            }
            updateDashboardCounts();
            filterAndRender();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update the applicant's status.");
        }
    }

    // --- View Switching Logic ---
    const setActiveNav = (activeElement) => {
        // Remove active class from all main navigation items
        dashboardNav.classList.remove('active');
        applicationsNav.classList.remove('active');
        scheduledNav.classList.remove('active');
        // Add active class to the correct one
        activeElement.classList.add('active');
    };

    const showDashboard = () => {
        dashboardSummarySection.style.display = 'grid';
        applicationsContent.style.display = 'none';
        setActiveNav(dashboardNav);
        applicationsNav.classList.remove('open'); // Close dropdown
        closeMobileSidebar();
    };

    const showContentPanel = () => {
        dashboardSummarySection.style.display = 'none';
        applicationsContent.style.display = 'block';
        closeMobileSidebar();
    };

    const setView = (viewName) => {
        currentView = viewName;
        showContentPanel();
        
        // Handle which sidebar item is active
        if (viewName === 'scheduled') {
            setActiveNav(scheduledNav);
            applicationsNav.classList.remove('open'); // Close dropdown
        } else {
            // All other application views belong to the 'Applications' nav item
            setActiveNav(applicationsNav);
        }
        
        filterAndRender();
    };
    
    const openMobileSidebar = () => {
        sidebar.classList.add('is-open');
        sidebarOverlay.classList.add('is-visible');
    };

    const closeMobileSidebar = () => {
        sidebar.classList.remove('is-open');
        sidebarOverlay.classList.remove('is-visible');
    };

    // --- Event Listeners ---
    tableBody.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('accept-btn')) {
            await updateApplicantStatus(target.dataset.id, 'accepted');
        }
        if (target.classList.contains('reject-btn')) {
            if (confirm('Are you sure you want to reject this application?')) {
                await updateApplicantStatus(target.dataset.id, 'rejected');
            }
        }
    });
    
    dashboardNav.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboard();
    });

    applicationsNav.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        if (window.innerWidth > 992) {
            setView('pending');
        }
        applicationsNav.classList.toggle('open');
    });
    
    // NEW: Event listener for the main scheduled nav item
    scheduledNav.addEventListener('click', (e) => {
        e.preventDefault();
        setView('scheduled');
    });

    cardTotal.addEventListener('click', () => setView('pending'));
    cardAccepted.addEventListener('click', () => setView('accepted'));
    cardRejected.addEventListener('click', () => setView('rejected'));
    cardScheduled.addEventListener('click', () => setView('scheduled')); 

    viewHiredLink.addEventListener('click', (e) => { e.preventDefault(); setView('accepted'); });
    viewRejectedLink.addEventListener('click', (e) => { e.preventDefault(); setView('rejected'); });

    searchInput.addEventListener('input', filterAndRender);
    filterProject.addEventListener('change', filterAndRender);

    hamburgerMenu.addEventListener('click', openMobileSidebar);
    sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // --- Initial Load ---
    fetchAndDisplayApplicants();
});