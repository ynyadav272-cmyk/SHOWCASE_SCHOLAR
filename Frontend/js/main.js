// API Base URL - dynamically detect hostname for network access
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    // If accessing from localhost, use localhost for API
    // Otherwise use the same hostname (for network access)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // For network access, use the same hostname but port 3000
    return `http://${hostname}:3000/api`;
};
const API_BASE_URL = getApiBaseUrl();

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Load data based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadFeaturedStudents();
    } else if (currentPage === 'portfolio.html') {
        loadPortfolios();
        setupFilters();
        setupPortfolioForm();
        setupPortfolioModal();
        setupEditAndDeleteModals();
    } else if (currentPage === 'projects.html') {
        loadProjects();
    } else if (currentPage === 'achievements.html') {
        loadAchievements();
    } else if (currentPage === 'contact.html') {
        setupContactForm();
    }
});

// Load featured students on homepage
async function loadFeaturedStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const students = await response.json();
        
        const container = document.getElementById('students-container');
        if (!container) return;

        // Show only first 6 students
        const featuredStudents = students.slice(0, 6);
        
        container.innerHTML = featuredStudents.map(student => `
            <div class="student-card">
                <div class="student-image">${student.name.charAt(0)}</div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>${student.major}</p>
                    <p>${student.year} Year</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('students-container').innerHTML = 
            '<p>Error loading students. Please try again later.</p>';
    }
}

// Load all portfolios
async function loadPortfolios(filter = 'all') {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const students = await response.json();
        
        const container = document.getElementById('portfolio-container');
        if (!container) return;

        let filteredStudents = students;
        if (filter !== 'all') {
            filteredStudents = students.filter(student => 
                student.major.toLowerCase().includes(filter.toLowerCase())
            );
        }

        container.innerHTML = filteredStudents.map(student => {
            const skills = Array.isArray(student.skills) ? student.skills : [];
            const skillsMarkup = skills.length
                ? skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
                : '<span class="muted-text">No skills listed yet</span>';
            const headerLine = [student.major, student.year ? `${student.year} Year` : '']
                .filter(Boolean)
                .join(' • ') || 'No academic details provided';
            const contactMarkup = student.email
                ? `<a href="mailto:${student.email}">${student.email}</a>`
                : '<span class="muted-text">No contact email provided</span>';

            return `
            <div class="portfolio-card" data-student-id="${student.id}">
                <div class="portfolio-header">
                    <div>
                        <h3>${student.name}</h3>
                        <p>${headerLine}</p>
                    </div>
                    <div class="portfolio-actions">
                        <button class="btn-icon btn-edit" onclick="openEditModal(${student.id})" title="Edit student" aria-label="Edit student">
                            <span class="btn-icon-emoji">✏️</span>
                            <span class="btn-icon-text">Edit</span>
                        </button>
                        <button class="btn-icon btn-delete" onclick="confirmDeleteStudent(${student.id}, '${student.name.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" title="Delete student" aria-label="Delete student">
                            <span class="btn-icon-emoji">🗑️</span>
                            <span class="btn-icon-text">Delete</span>
                        </button>
                    </div>
                </div>
                <div class="portfolio-body">
                    <p>${student.bio || 'No bio available'}</p>
                    <div class="skills">
                        ${skillsMarkup}
                    </div>
                </div>
                <div class="portfolio-footer">
                    ${contactMarkup}
                </div>
            </div>
        `;
        }).join('');
    } catch (error) {
        console.error('Error loading portfolios:', error);
        document.getElementById('portfolio-container').innerHTML = 
            '<p>Error loading portfolios. Please try again later.</p>';
    }
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Load filtered portfolios
            loadPortfolios(btn.dataset.filter);
        });
    });
}

// Load all projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();
        
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">${project.name.charAt(0)}</div>
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span><strong>Student:</strong> ${project.studentName}</span>
                        <span><strong>Date:</strong> ${new Date(project.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = 
            '<p>Error loading projects. Please try again later.</p>';
    }
}

// Load all achievements
async function loadAchievements() {
    try {
        const response = await fetch(`${API_BASE_URL}/achievements`);
        const achievements = await response.json();
        
        const container = document.getElementById('achievements-container');
        if (!container) return;

        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-card">
                <div class="achievement-icon">🏆</div>
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
                <p class="achievement-date"><strong>Student:</strong> ${achievement.studentName}</p>
                <p class="achievement-date"><strong>Date:</strong> ${new Date(achievement.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading achievements:', error);
        document.getElementById('achievements-container').innerHTML = 
            '<p>Error loading achievements. Please try again later.</p>';
    }
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Thank you for your message! We will get back to you soon.');
                    form.reset();
                } else {
                    alert('Error sending message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error sending message. Please try again.');
            }
        });
    }
}

// Portfolio creation helpers
function setupPortfolioForm() {
    const form = document.getElementById('portfolio-form');
    if (!form) return;

    resetRepeatableGroup('projects-group', addProjectFields);
    resetRepeatableGroup('achievements-group', addAchievementFields);

    const addProjectBtn = document.getElementById('add-project-btn');
    addProjectBtn?.addEventListener('click', () => addProjectFields());

    const addAchievementBtn = document.getElementById('add-achievement-btn');
    addAchievementBtn?.addEventListener('click', () => addAchievementFields());

    setupDemoFillButton();

    const projectsContainer = document.getElementById('projects-group');
    projectsContainer?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.remove-group-btn');
        if (removeBtn) {
            event.preventDefault();
            removeBtn.closest('.group-card')?.remove();
            refreshGroupTitles(projectsContainer, 'Project');
        }
    });

    const achievementsContainer = document.getElementById('achievements-group');
    achievementsContainer?.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.remove-group-btn');
        if (removeBtn) {
            event.preventDefault();
            removeBtn.closest('.group-card')?.remove();
            refreshGroupTitles(achievementsContainer, 'Achievement');
        }
    });

    form.addEventListener('submit', (event) => handlePortfolioSubmit(event, form));
}

function setupPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    const openBtn = document.getElementById('open-portfolio-modal');
    const closeBtn = document.getElementById('close-portfolio-modal');
    const backdrop = document.getElementById('portfolio-modal-backdrop');

    if (!modal || !openBtn || !closeBtn || !backdrop) return;

    const setModalState = (isOpen) => {
        modal.classList.toggle('active', isOpen);
        modal.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('modal-open', isOpen);

        if (isOpen) {
            requestAnimationFrame(() => {
                modal.querySelector('#student-name')?.focus();
            });
        }
    };

    openBtn.addEventListener('click', () => setModalState(true));
    closeBtn.addEventListener('click', () => setModalState(false));
    backdrop.addEventListener('click', () => setModalState(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            setModalState(false);
        }
    });

    // Expose close function globally for use after form submission
    window.closePortfolioModal = () => setModalState(false);
}

function setupDemoFillButton() {
    const demoBtn = document.getElementById('demo-fill-btn');
    if (!demoBtn) return;

    demoBtn.addEventListener('click', () => {
        const demo = getDemoPortfolio();
        populateStudentFields(demo.student);
        populateProjectFields(demo.projects);
        populateAchievementFields(demo.achievements);

        const contactMessageEl = document.getElementById('contact-message');
        if (contactMessageEl) {
            contactMessageEl.value = demo.contactMessage || '';
        }

        const feedbackEl = document.getElementById('portfolio-form-feedback');
        setFormFeedback('Sample portfolio loaded. Customize anything before publishing.', 'success', feedbackEl);
    });
}

function addProjectFields() {
    const container = document.getElementById('projects-group');
    const card = cloneTemplateContent('project-card-template');
    if (!container || !card) return;

    container.appendChild(card);
    refreshGroupTitles(container, 'Project');
}

function addAchievementFields() {
    const container = document.getElementById('achievements-group');
    const card = cloneTemplateContent('achievement-card-template');
    if (!container || !card) return;

    container.appendChild(card);
    refreshGroupTitles(container, 'Achievement');
}

function cloneTemplateContent(templateId) {
    const template = document.getElementById(templateId);
    if (!template || !template.content) return null;
    const firstChild = template.content.firstElementChild;
    if (!firstChild) return null;
    return firstChild.cloneNode(true);
}

function refreshGroupTitles(container, label) {
    if (!container) return;
    Array.from(container.children).forEach((card, index) => {
        const title = card.querySelector('.group-title');
        if (title) {
            title.textContent = `${label} ${index + 1}`;
        }
        const existingRemove = card.querySelector('.remove-group-btn');
        if (index === 0) {
            existingRemove?.remove();
        } else if (!existingRemove) {
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'link-btn remove-group-btn';
            removeBtn.textContent = 'Remove';
            card.appendChild(removeBtn);
        }
    });
}

function populateStudentFields(student = {}) {
    const { name = '', email = '', major = '', year = '', bio = '', skills = [] } = student;

    const nameInput = document.getElementById('student-name');
    if (nameInput) nameInput.value = name;

    const emailInput = document.getElementById('student-email');
    if (emailInput) emailInput.value = email;

    const majorInput = document.getElementById('student-major');
    if (majorInput) majorInput.value = major;

    const yearSelect = document.getElementById('student-year');
    if (yearSelect) yearSelect.value = year;

    const bioInput = document.getElementById('student-bio');
    if (bioInput) bioInput.value = bio;

    const skillsInput = document.getElementById('student-skills');
    if (skillsInput) skillsInput.value = skills.join(', ');
}

function populateProjectFields(projects = []) {
    const container = document.getElementById('projects-group');
    if (!container) return;

    container.innerHTML = '';

    if (!projects.length) {
        addProjectFields();
        return;
    }

    projects.forEach(project => {
        addProjectFields();
        const card = container.lastElementChild;
        if (!card) return;

        const nameInput = card.querySelector('.project-name');
        if (nameInput) nameInput.value = project.name || '';

        const descriptionInput = card.querySelector('.project-description');
        if (descriptionInput) descriptionInput.value = project.description || '';

        const techInput = card.querySelector('.project-tech');
        if (techInput) {
            const techList = Array.isArray(project.technologies)
                ? project.technologies
                : splitToList(project.technologies || '');
            techInput.value = techList.join(', ');
        }

        const dateInput = card.querySelector('.project-date');
        if (dateInput) dateInput.value = project.date ? project.date.substring(0, 10) : '';
    });
}

function populateAchievementFields(achievements = []) {
    const container = document.getElementById('achievements-group');
    if (!container) return;

    container.innerHTML = '';

    if (!achievements.length) {
        addAchievementFields();
        return;
    }

    achievements.forEach(achievement => {
        addAchievementFields();
        const card = container.lastElementChild;
        if (!card) return;

        const titleInput = card.querySelector('.achievement-title');
        if (titleInput) titleInput.value = achievement.title || '';

        const descriptionInput = card.querySelector('.achievement-description');
        if (descriptionInput) descriptionInput.value = achievement.description || '';

        const dateInput = card.querySelector('.achievement-date');
        if (dateInput) dateInput.value = achievement.date ? achievement.date.substring(0, 10) : '';
    });
}

function getDemoPortfolio() {
    return {
        student: {
            name: 'Alicia Gomez',
            email: 'alicia.gomez@example.com',
            major: 'Computer Science',
            year: 'Senior',
            bio: 'Full-stack developer passionate about building inclusive products and leading peer mentorship programs.',
            skills: ['React', 'Node.js', 'TypeScript', 'UI/UX', 'Leadership']
        },
        projects: [
            {
                name: 'Smart Campus Companion',
                description: 'Mobile app that helps students find available study spaces, track events, and connect with campus services in real time.',
                technologies: ['React Native', 'Firebase', 'Figma'],
                date: '2024-05-01'
            },
            {
                name: 'Research Hub',
                description: 'Web platform that matches students with research advisors based on interests and availability.',
                technologies: ['Next.js', 'Node.js', 'PostgreSQL'],
                date: '2023-11-15'
            }
        ],
        achievements: [
            {
                title: 'Hack the Future Winner',
                description: 'Led a cross-functional team of four to build an assistive AR navigation tool for visually impaired students.',
                date: '2024-02-18'
            },
            {
                title: 'Dean’s Leadership Fellow',
                description: 'Recognized for launching a peer mentorship community that paired 120+ first-year students with upperclass mentors.',
                date: '2023-09-05'
            }
        ],
        contactMessage: 'Excited to collaborate on mission-driven internships and research. Let’s connect!'
    };
}

async function handlePortfolioSubmit(event, form) {
    event.preventDefault();
    const feedbackEl = document.getElementById('portfolio-form-feedback');
    setFormFeedback('', null, feedbackEl);

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';

    try {
        // Verify API connection
        try {
            const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
            if (!healthCheck.ok) {
                throw new Error('Backend server is not responding. Please ensure the backend is running on http://localhost:3000');
            }
        } catch (err) {
            if (err.message.includes('Backend server')) {
                throw err;
            }
            throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:3000');
        }
        const skills = splitToList(document.getElementById('student-skills')?.value || '');
        if (!skills.length) {
            throw new Error('Please add at least one skill.');
        }

        const studentPayload = {
            name: document.getElementById('student-name')?.value.trim(),
            email: document.getElementById('student-email')?.value.trim(),
            major: document.getElementById('student-major')?.value.trim(),
            year: document.getElementById('student-year')?.value,
            bio: document.getElementById('student-bio')?.value.trim(),
            skills
        };

        if (!studentPayload.name || !studentPayload.email || !studentPayload.major || !studentPayload.year || !studentPayload.bio) {
            throw new Error('Please fill in all student details.');
        }

        const projects = collectProjectPayloads();
        if (!projects.length) {
            throw new Error('Please add at least one complete project (name and description).');
        }

        const achievements = collectAchievementPayloads();
        if (!achievements.length) {
            throw new Error('Please add at least one complete achievement (title and description).');
        }

        const student = await postJSON('/students', studentPayload);

        await Promise.all(projects.map(project => 
            postJSON('/projects', { ...project, studentName: student.name })
        ));

        await Promise.all(achievements.map(achievement => 
            postJSON('/achievements', { ...achievement, studentName: student.name })
        ));

        const contactMessage = document.getElementById('contact-message')?.value.trim();
        if (contactMessage) {
            await postJSON('/contact', {
                name: student.name,
                email: student.email,
                message: contactMessage
            });
        }

        setFormFeedback('Portfolio published successfully! The new portfolio will appear below, and projects/achievements will show on their respective pages.', 'success', feedbackEl);
        
        // Reset form
        form.reset();
        resetRepeatableGroup('projects-group', addProjectFields);
        resetRepeatableGroup('achievements-group', addAchievementFields);
        
        // Refresh portfolios section (visible on this page)
        await loadPortfolios();
        
        // Refresh other sections if their containers exist (for other pages)
        const projectsContainer = document.getElementById('projects-container');
        const achievementsContainer = document.getElementById('achievements-container');
        
        if (projectsContainer) await loadProjects();
        if (achievementsContainer) await loadAchievements();
        
        // Close modal after a brief delay to show success message
        setTimeout(() => {
            if (window.closePortfolioModal) {
                window.closePortfolioModal();
            }
        }, 2000);
    } catch (error) {
        console.error('Portfolio submission error:', error);
        let errorMessage = 'Unable to publish portfolio. Please try again.';
        
        if (error.message) {
            errorMessage = error.message;
        } else if (error instanceof TypeError && error.message.includes('fetch')) {
            errorMessage = 'Network error: Cannot connect to backend server. Please ensure the backend is running on http://localhost:3000';
        }
        
        setFormFeedback(errorMessage, 'error', feedbackEl);
        
        // Scroll to feedback message
        feedbackEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Portfolio';
    }
}

function collectProjectPayloads() {
    const container = document.getElementById('projects-group');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.group-card')).map(card => {
        const name = card.querySelector('.project-name')?.value.trim();
        const description = card.querySelector('.project-description')?.value.trim();
        if (!name || !description) return null;

        const technologies = splitToList(card.querySelector('.project-tech')?.value || '');
        const dateInput = card.querySelector('.project-date')?.value;
        
        // Convert YYYY-MM-DD to ISO string if date is provided
        let date = undefined;
        if (dateInput) {
            date = new Date(dateInput + 'T00:00:00').toISOString();
        }

        return {
            name,
            description,
            technologies: technologies.length > 0 ? technologies : [],
            date
        };
    }).filter(Boolean);
}

function collectAchievementPayloads() {
    const container = document.getElementById('achievements-group');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.group-card')).map(card => {
        const title = card.querySelector('.achievement-title')?.value.trim();
        const description = card.querySelector('.achievement-description')?.value.trim();
        if (!title || !description) return null;

        const dateInput = card.querySelector('.achievement-date')?.value;
        
        // Convert YYYY-MM-DD to ISO string if date is provided
        let date = undefined;
        if (dateInput) {
            date = new Date(dateInput + 'T00:00:00').toISOString();
        }

        return {
            title,
            description,
            date
        };
    }).filter(Boolean);
}

function splitToList(value) {
    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

async function postJSON(endpoint, payload) {
    try {
        console.log(`Making POST request to: ${API_BASE_URL}${endpoint}`, payload);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log(`Response status: ${response.status} for ${endpoint}`);

        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            try {
                const error = await response.json();
                message = error.error || message;
                console.error('API Error:', error);
            } catch (e) {
                const text = await response.text();
                console.error('API Error (non-JSON):', text);
                message = text || message;
            }
            throw new Error(message);
        }

        const data = await response.json();
        console.log(`Successfully created ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`Error in postJSON for ${endpoint}:`, error);
        throw error;
    }
}

function setFormFeedback(message, status, element) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('success', 'error');
    if (status) {
        element.classList.add(status);
    }
}

function resetRepeatableGroup(containerId, addFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    addFn();
}

// Edit and Delete Student Functions
function setupEditAndDeleteModals() {
    // Edit Student Modal
    const editModal = document.getElementById('edit-student-modal');
    const editCloseBtn = document.getElementById('close-edit-student-modal');
    const editBackdrop = document.getElementById('edit-student-modal-backdrop');
    const editForm = document.getElementById('edit-student-form');

    if (editModal && editCloseBtn && editBackdrop) {
        const setEditModalState = (isOpen) => {
            editModal.classList.toggle('active', isOpen);
            editModal.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('modal-open', isOpen);
            if (isOpen) {
                requestAnimationFrame(() => {
                    editModal.querySelector('#edit-student-name')?.focus();
                });
            }
        };

        editCloseBtn.addEventListener('click', () => setEditModalState(false));
        editBackdrop.addEventListener('click', () => setEditModalState(false));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && editModal.classList.contains('active')) {
                setEditModalState(false);
            }
        });

        window.openEditModal = (studentId) => {
            loadStudentForEdit(studentId);
            setEditModalState(true);
        };
        window.closeEditModal = () => setEditModalState(false);
    }

    // Delete Confirmation Modal
    const deleteModal = document.getElementById('delete-confirm-modal');
    const deleteBackdrop = document.getElementById('delete-confirm-modal-backdrop');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    if (deleteModal && deleteBackdrop && cancelDeleteBtn && confirmDeleteBtn) {
        let studentIdToDelete = null;

        const setDeleteModalState = (isOpen) => {
            deleteModal.classList.toggle('active', isOpen);
            deleteModal.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('modal-open', isOpen);
        };

        cancelDeleteBtn.addEventListener('click', () => {
            setDeleteModalState(false);
            studentIdToDelete = null;
        });
        deleteBackdrop.addEventListener('click', () => {
            setDeleteModalState(false);
            studentIdToDelete = null;
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && deleteModal.classList.contains('active')) {
                setDeleteModalState(false);
                studentIdToDelete = null;
            }
        });

        confirmDeleteBtn.addEventListener('click', async () => {
            if (studentIdToDelete) {
                await deleteStudent(studentIdToDelete);
                setDeleteModalState(false);
                studentIdToDelete = null;
            }
        });

        window.confirmDeleteStudent = (id, name) => {
            studentIdToDelete = id;
            const messageEl = document.getElementById('delete-confirm-message');
            if (messageEl) {
                messageEl.textContent = `Are you sure you want to delete "${name}"? This action cannot be undone.`;
            }
            setDeleteModalState(true);
        };
    }

    // Edit Form Submission
    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const studentId = document.getElementById('edit-student-id')?.value;
            if (!studentId) return;

            const feedbackEl = document.getElementById('edit-student-form-feedback');
            setFormFeedback('', null, feedbackEl);

            const submitBtn = editForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                const skills = splitToList(document.getElementById('edit-student-skills')?.value || '');
                if (!skills.length) {
                    throw new Error('Please add at least one skill.');
                }

                const studentPayload = {
                    name: document.getElementById('edit-student-name')?.value.trim(),
                    email: document.getElementById('edit-student-email')?.value.trim(),
                    major: document.getElementById('edit-student-major')?.value.trim(),
                    year: document.getElementById('edit-student-year')?.value,
                    bio: document.getElementById('edit-student-bio')?.value.trim(),
                    skills
                };

                if (!studentPayload.name || !studentPayload.email || !studentPayload.major || !studentPayload.year || !studentPayload.bio) {
                    throw new Error('Please fill in all student details.');
                }

                await updateStudent(studentId, studentPayload);
                setFormFeedback('Student updated successfully!', 'success', feedbackEl);
                
                setTimeout(() => {
                    if (window.closeEditModal) window.closeEditModal();
                    loadPortfolios();
                }, 1500);
            } catch (error) {
                console.error('Update error:', error);
                setFormFeedback(error.message || 'Unable to update student. Please try again.', 'error', feedbackEl);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Student';
            }
        });
    }
}

async function loadStudentForEdit(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
        if (!response.ok) throw new Error('Failed to load student data');
        
        const student = await response.json();
        
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-name').value = student.name || '';
        document.getElementById('edit-student-email').value = student.email || '';
        document.getElementById('edit-student-major').value = student.major || '';
        document.getElementById('edit-student-year').value = student.year || '';
        document.getElementById('edit-student-bio').value = student.bio || '';
        
        const skills = Array.isArray(student.skills) ? student.skills : [];
        document.getElementById('edit-student-skills').value = skills.join(', ');
    } catch (error) {
        console.error('Error loading student for edit:', error);
        alert('Failed to load student data. Please try again.');
    }
}

async function updateStudent(studentId, payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            try {
                const error = await response.json();
                message = error.error || message;
            } catch (e) {
                const text = await response.text();
                message = text || message;
            }
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            try {
                const error = await response.json();
                message = error.error || message;
            } catch (e) {
                const text = await response.text();
                message = text || message;
            }
            throw new Error(message);
        }

        // Reload portfolios to reflect deletion
        await loadPortfolios();
        
        // Show success message
        const feedbackEl = document.getElementById('portfolio-form-feedback');
        if (feedbackEl) {
            setFormFeedback('Student deleted successfully!', 'success', feedbackEl);
            setTimeout(() => {
                setFormFeedback('', null, feedbackEl);
            }, 3000);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert(error.message || 'Failed to delete student. Please try again.');
    }
}