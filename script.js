<script>
    // 1. Navigation: Step Transition Logic
    function nextStep() {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const progressBar = document.getElementById('progressBar');
        const stepLabel = document.getElementById('stepLabel');
        const progressText = document.getElementById('progressText');

        // Hide step 1, show step 2
        if (step1 && step2) {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            
            // Update progress UI
            progressBar.style.width = '100%';
            stepLabel.innerText = 'Step 2: Details';
            progressText.innerText = '100%';
        }
    }

    // 2. Calculator Logic: Update the display in real-time
    const range = document.getElementById('loanRange');
    const display = document.getElementById('displayAmount');
    
    if (range && display) {
        range.addEventListener('input', () => {
            const value = parseInt(range.value);
            display.innerText = 'R' + value.toLocaleString();
        });
    }

    // 3. Form Submission: Handle the final button
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page refresh
            
            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();

            if (name && email) {
                // Currently triggering an alert; this is where you later connect to a backend
                alert('Thank you, ' + name + '! Your application has been received. Our team will contact you at ' + email + ' shortly.');
                
                // Reset form after submission
                this.reset();
            } else {
                alert('Please fill in all details before submitting.');
            }
        });
    }
</script>
