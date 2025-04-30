document.addEventListener('DOMContentLoaded', function() {
    // Update year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Check online status and update indicator
    function updateOnlineStatus() {
        const statusElement = document.getElementById('connection-text');
        const statusIcon = document.querySelector('.connection-status i');
        
        if (navigator.onLine) {
            statusElement.textContent = 'Online';
            statusIcon.className = 'fas fa-wifi';
            statusIcon.style.color = 'var(--success)';
        } else {
            statusElement.textContent = 'Offline';
            statusIcon.className = 'fas fa-wifi-slash';
            statusIcon.style.color = 'var(--danger)';
        }
    }
    
    // Initial check
    updateOnlineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Simulate content data
    let userData = {
        offlineItems: 0,
        quizzes: {
            total: 0,
            completed: 0
        },
        downloadedContent: []
    };
    
    // Check if user data exists in localStorage
    if (localStorage.getItem('ruralLearnUserData')) {
        userData = JSON.parse(localStorage.getItem('ruralLearnUserData'));
        updateUIWithUserData();
    }
    
    function updateUIWithUserData() {
        document.getElementById('offline-count').textContent = userData.offlineItems;
        document.getElementById('quiz-completed').textContent = userData.quizzes.completed;
        document.getElementById('quiz-total').textContent = userData.quizzes.total;
    }
    
    // Mock content library
    const contentLibrary = [
        { id: 1, title: 'Basic Mathematics', size: '15MB', lessons: 12 },
        { id: 2, title: 'Introduction to Science', size: '22MB', lessons: 8 },
        { id: 3, title: 'History Fundamentals', size: '18MB', lessons: 10 },
        { id: 4, title: 'English Literature', size: '25MB', lessons: 15 },
        { id: 5, title: 'Computer Basics', size: '30MB', lessons: 20 }
    ];
    
    // Event listeners for buttons
    document.getElementById('download-btn').addEventListener('click', function() {
        if (navigator.onLine) {
            openContentLibrary();
        } else {
            showNotification('You are offline. Please connect to the internet to download content.', 'error');
        }
    });
    
    document.getElementById('browse-library-btn').addEventListener('click', openContentLibrary);
    
    document.getElementById('take-quizzes-btn').addEventListener('click', function() {
        if (userData.offlineItems > 0) {
            showNotification('Opening quizzes...', 'success');
            // In a real app, this would navigate to quizzes page
        } else {
            showNotification('Please download content first to access quizzes.', 'warning');
        }
    });
    
    document.getElementById('check-progress-btn').addEventListener('click', function() {
        if (userData.quizzes.completed > 0) {
            showNotification('Opening progress dashboard...', 'success');
            // In a real app, this would navigate to progress dashboard
        } else {
            showNotification('Complete some quizzes to view your progress.', 'info');
        }
    });
    
    function openContentLibrary() {
        // In a real app, this would open a content library modal or page
        // For this demo, we'll simulate downloading content
        showNotification('Opening content library...', 'info');
        simulateContentDownload();
    }
    
    function simulateContentDownload() {
        // Simulate downloading a random content item
        if (userData.downloadedContent.length < contentLibrary.length) {
            const availableContent = contentLibrary.filter(item => 
                !userData.downloadedContent.some(downloaded => downloaded.id === item.id)
            );
            
            const randomIndex = Math.floor(Math.random() * availableContent.length);
            const contentToDownload = availableContent[randomIndex];
            
            // Simulate download time
            showNotification(`Downloading ${contentToDownload.title}...`, 'info');
            
            setTimeout(() => {
                userData.downloadedContent.push(contentToDownload);
                userData.offlineItems = userData.downloadedContent.length;
                userData.quizzes.total += Math.floor(contentToDownload.lessons / 3);
                
                // Save to localStorage
                localStorage.setItem('ruralLearnUserData', JSON.stringify(userData));
                
                updateUIWithUserData();
                showNotification(`${contentToDownload.title} downloaded successfully!`, 'success');
            }, 2000);
        } else {
            showNotification('You have downloaded all available content.', 'info');
        }
    }
    
    // Notification system
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-btn">&times;</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Set up close button
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Add notification styles dynamically
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            background-color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 350px;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            margin-left: 15px;
            color: #555;
        }
        
        .notification.success {
            border-left: 4px solid var(--success);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger);
        }
        
        .notification.warning {
            border-left: 4px solid var(--warning);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary);
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);

    const modal = document.getElementById('content-library-modal');
    const closeModalBtn = modal.querySelector('.close-btn');
    const contentList = document.getElementById('content-list');

    // Open modal and populate content
    document.getElementById('browse-library-btn').addEventListener('click', function() {
        contentList.innerHTML = ''; // Clear previous content
        contentLibrary.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.title} - ${item.size}, ${item.lessons} lessons`;
            contentList.appendChild(listItem);
        });
        modal.style.display = 'flex';
    });

    // Close modal
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add event listeners for footer login and signup buttons
    document.getElementById('footer-login-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (isLoggedIn) {
            profileModal.style.display = 'flex';
        } else {
            loginModal.style.display = 'flex';
        }
    });

    document.getElementById('footer-signup-trigger').addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
        activateTab('signup');
    });
});
