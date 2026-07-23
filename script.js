// Step Management Variables
let currentStep = 1;
let uploadedFiles = {
    id: null,
    statement: null
};

// Step Navigation Functions
function nextStep() {
    if (currentStep === 1) {
        // Validate step 1 - just proceed
        currentStep = 2;
        updateProgress();
        showStep();
    } else if (currentStep === 2) {
        // Validate step 2
        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const signature = document.getElementById('signatureInput').value.trim();
        const agreed = document.getElementById('contractCheckbox').checked;

        if (!name || !email || !signature || !agreed) {
            alert('Please complete all fields and agree to the contract terms.');
            return;
        }

        currentStep = 3;
        updateProgress();
        showStep();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
        showStep();
    }
}

function updateProgress() {
    const progressPercentages = {
        1: '25%',
        2: '50%',
        3: '75%',
        4: '100%'
    };

    const stepLabels = {
        1: 'Step 1: Amount',
        2: 'Step 2: Details',
        3: 'Step 3: Documents',
        4: 'Step 4: Complete'
    };

    document.getElementById('progressBar').style.width = progressPercentages[currentStep];
    document.getElementById('progressText').innerText = progressPercentages[currentStep];
    document.getElementById('stepLabel').innerText = stepLabels[currentStep];
}

function showStep() {
    // Hide all steps
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.add('hidden');

    // Show current step
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
}

function resetApplication() {
    currentStep = 1;
    uploadedFiles = { id: null, statement: null };
    document.getElementById('nameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('signatureInput').value = '';
    document.getElementById('contractCheckbox').checked = false;
    document.getElementById('idInput').value = '';
    document.getElementById('statementInput').value = '';
    document.getElementById('idPreview').innerHTML = '';
    document.getElementById('statementPreview').innerHTML = '';
    updateProgress();
    showStep();
}

// Loan Range Calculator
const range = document.getElementById('loanRange');
const display = document.getElementById('displayAmount');

if (range && display) {
    range.addEventListener('input', (e) => {
        const borrowedAmount = parseInt(e.target.value);
        const interestAmount = borrowedAmount * 0.4;
        const totalRepayment = borrowedAmount + interestAmount;
        const terminationFee = 50;

        document.getElementById('displayAmount').innerText = 'R' + borrowedAmount.toLocaleString();
        document.getElementById('repaymentAmount').innerText = 'R' + totalRepayment.toLocaleString();
        document.getElementById('interestSummary').innerText = '40% interest added: R' + interestAmount.toLocaleString();
        document.getElementById('terminationSummary').innerText = 'Termination fee: R' + terminationFee.toLocaleString();
    });
}

// File Upload Handling
function initializeFileUpload(uploadAreaId, inputId, previewId, fileType) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0], fileType, preview, uploadArea);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0], fileType, preview, uploadArea);
        }
    });
}

function handleFile(file, fileType, preview, uploadArea) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
        showPreview(preview, `❌ Invalid file type. Please upload PNG, JPG, or PDF.`, true);
        return;
    }

    if (file.size > maxSize) {
        showPreview(preview, `❌ File too large. Maximum size is 5MB.`, true);
        return;
    }

    // Store file reference
    uploadedFiles[fileType] = file;

    // Show success preview
    showPreview(preview, `✅ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`, false);

    // Check if both files are uploaded
    checkUploadStatus();
}

function showPreview(previewElement, message, isError) {
    previewElement.innerHTML = `<div class="file-preview ${isError ? 'error' : ''}">
        <span>${message}</span>
        ${!isError ? '<span class="remove-file" onclick="removeFile(this)">✕ Remove</span>' : ''}
    </div>`;
}

function removeFile(element) {
    element.closest('.file-preview').remove();
    document.getElementById('idInput').value = '';
    document.getElementById('statementInput').value = '';
    uploadedFiles = { id: null, statement: null };
    checkUploadStatus();
}

function checkUploadStatus() {
    const submitBtn = document.getElementById('submitBtn');
    if (uploadedFiles.id && uploadedFiles.statement) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize file uploads
    initializeFileUpload('idUploadArea', 'idInput', 'idPreview', 'id');
    initializeFileUpload('statementUploadArea', 'statementInput', 'statementPreview', 'statement');

    // Submit button handler
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            submitApplication();
        });
    }

    // Mobile menu toggle - FIXED
    const mobileBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        // Toggle menu on button click
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('hidden');
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                mobileBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when any link inside it is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
});

function submitApplication() {
    if (!uploadedFiles.id || !uploadedFiles.statement) {
        alert('Please upload both your ID and account statement.');
        return;
    }

    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();

    // Simulate file upload (in production, this would send to a backend)
    console.log('Application Submission:', {
        name: name,
        email: email,
        idFile: uploadedFiles.id.name,
        statementFile: uploadedFiles.statement.name,
        loanAmount: document.getElementById('loanRange').value
    });

    // Move to success step
    currentStep = 4;
    updateProgress();
    showStep();

    // Note: In a real application, you would send this data to a backend server
    // using FormData and fetch/axios to handle the file uploads
}

// Agent Chatbot
const agentToggle = document.getElementById('agentToggle');
const agentPanel = document.getElementById('agentPanel');
const agentForm = document.getElementById('agentForm');
const agentInput = document.getElementById('agentInput');
const agentMessages = document.getElementById('agentMessages');

function addAgentMessage(text, sender = 'agent') {
    const bubble = document.createElement('div');
    bubble.className = sender === 'user'
        ? 'ml-auto max-w-[80%] rounded-2xl bg-amber-500 text-white p-3 text-sm'
        : 'max-w-[80%] rounded-2xl bg-slate-100 text-slate-700 p-3 text-sm';
    bubble.textContent = text;
    agentMessages.appendChild(bubble);
    agentMessages.scrollTop = agentMessages.scrollHeight;
}

function getAgentReply(message) {
    const text = message.toLowerCase();

    if (text.includes('hour') || text.includes('open') || text.includes('when')) {
        return 'We are open Monday to Friday from 8:00 AM to 5:00 PM. We are closed on weekends.';
    }

    if (text.includes('interest') || text.includes('repay') || text.includes('pay') || text.includes('amount')) {
        return 'Our loans include a 40% interest charge on the borrowed amount. For example, borrowing R100 means a total repayment of R140.';
    }

    if (text.includes('document') || text.includes('upload') || text.includes('statement') || text.includes('id')) {
        return 'You\'ll need to upload a copy of your ID and a recent account statement after registering. This helps us verify your information quickly.';
    }

    if (text.includes('available') || text.includes('offline') || text.includes('not available')) {
        return 'We are currently offline, but our team will respond as soon as possible. Please call us during office hours for urgent support.';
    }

    return 'Thanks for reaching out. I can help with office hours, repayment interest, required documents, or availability.';
}

if (agentToggle && agentPanel && agentForm && agentInput && agentMessages) {
    agentToggle.addEventListener('click', () => {
        agentPanel.classList.toggle('hidden');
    });

    agentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = agentInput.value.trim();
        if (!value) return;

        addAgentMessage(value, 'user');
        agentInput.value = '';
        setTimeout(() => addAgentMessage(getAgentReply(value)), 300);
    });

    addAgentMessage('Hello! I can help with our opening hours, repayment interest, required documents, and availability.');
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Message sent! Thanks for reaching out.");
        e.target.reset();
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
