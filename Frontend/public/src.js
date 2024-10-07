document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supportForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = 'Sending...';
        messageDiv.style.display = 'block';

        const email = document.getElementById('email').value;
        const issue = document.getElementById('issue').value;

        try {
            const response = await fetch('https://ooyelabs-privacy-page.onrender.com/submit-issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, issue }),
            });

            const result = await response.json();
            console.log('Server response:', result);

            messageDiv.textContent = result.message;
            if (result.error) {
                messageDiv.textContent += ` Error details: ${result.error}`;
                messageDiv.style.color = 'red';
            } else {
                messageDiv.style.color = 'green';
                form.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.style.color = 'red';
        }
    });
});