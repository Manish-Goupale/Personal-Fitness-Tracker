// Toggle menu for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Toggle menu for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.menu').classList.toggle('active');
        });
    }

    // Tab switching
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't apply to logout button
            if (this.classList.contains('logout-btn')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target content section
            const targetSection = this.getAttribute('data-target');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Initialize workout chart
    const workoutCtx = document.getElementById('workoutChart')?.getContext('2d');
    if (workoutCtx) {
        const workoutChart = new Chart(workoutCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Workouts',
                    data: [60, 75, 45, 90, 60, 80, 65],
                    fill: true,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Initialize activities chart
    const activitiesCtx = document.getElementById('activitiesChart')?.getContext('2d');
    if (activitiesCtx) {
        const activitiesChart = new Chart(activitiesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Running', 'Weight Training', 'Cycling', 'Yoga', 'Swimming'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(230, 126, 34, 0.8)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(241, 196, 15, 1)',
                        'rgba(230, 126, 34, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize progression chart
    const progressionCtx = document.getElementById('progressionChart')?.getContext('2d');
    if (progressionCtx) {
        const progressionChart = new Chart(progressionCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Workouts Completed',
                    data: [3, 5, 4, 7],
                    backgroundColor: 'rgba(52, 152, 219, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7
                    }
                }
            }
        });
    }

    // Initialize water chart
    const waterCtx = document.getElementById('waterChart')?.getContext('2d');
    if (waterCtx) {
        const waterChart = new Chart(waterCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Glasses of Water',
                    data: [6, 8, 7, 5, 8, 6, 4],
                    backgroundColor: 'rgba(52, 152, 219, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    // Initialize strength chart
    const strengthCtx = document.getElementById('strengthChart')?.getContext('2d');
    if (strengthCtx) {
        const strengthChart = new Chart(strengthCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Bench Press (kg)',
                    data: [50, 55, 55, 60],
                    borderColor: 'rgba(52, 152, 219, 1)'
                }, {
                    label: 'Squat (kg)',
                    data: [70, 75, 80, 85],
                    borderColor: 'rgba(46, 204, 113, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize cardio chart
    const cardioCtx = document.getElementById('cardioChart')?.getContext('2d');
    if (cardioCtx) {
        const cardioChart = new Chart(cardioCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: '5k Time (min)',
                    data: [30, 29, 28, 26],
                    borderColor: 'rgba(231, 76, 60, 1)',
                    yAxisID: 'y'
                }, {
                    label: 'Resting Heart Rate',
                    data: [72, 70, 69, 68],
                    borderColor: 'rgba(155, 89, 182, 1)',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Water tracker functionality
    const waterBtns = document.querySelectorAll('.water-btn');
    if (waterBtns.length) {
        let waterCount = 4;
        const waterFill = document.querySelector('.water-fill');
        const waterText = document.querySelector('.water-tracker p:nth-of-type(1)');
        
        waterBtns[0].addEventListener('click', function() {
            if (waterCount > 0) {
                waterCount--;
                updateWaterTracker();
            }
        });
        
        waterBtns[1].addEventListener('click', function() {
            if (waterCount < 8) {
                waterCount++;
                updateWaterTracker();
            }
        });
        
        function updateWaterTracker() {
            waterText.textContent = waterCount + ' / 8';
            waterFill.style.height = (waterCount / 8 * 100) + '%';
        }
    }

    // Day selector for workout plan
    const dayBtns = document.querySelectorAll('.days-selector .btn');
    if (dayBtns.length) {
        dayBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('btn-primary');
                if (this.classList.contains('btn-primary')) {
                    this.style.background = '#3498db';
                    this.style.color = 'white';
                } else {
                    this.style.background = '#f0f4f8';
                    this.style.color = '#333';
                }
            });
        });
    }

    // Profile dropdown functionality
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            this.querySelector('.profile-dropdown-content').classList.toggle('show');
            e.stopPropagation();
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function() {
            const dropdownContent = document.querySelector('.profile-dropdown-content');
            if (dropdownContent && dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // Logout confirmation
    const logoutLinks = document.querySelectorAll('.logout-link, .logout-btn');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    });

    // Workout Plan form submission
    const createPlanBtn = document.querySelector('#workout-plan-section .btn-primary');
    if (createPlanBtn) {
        createPlanBtn.addEventListener('click', function() {
            const name = document.getElementById('plan-name').value;
            const description = document.getElementById('plan-description').value;
            const duration = document.getElementById('plan-duration').value;
            
            if (!name) {
                alert('Please enter a plan name');
                return;
            }
            
            // Here you would normally send this data to the server
            // For now, we'll just show a success message
            alert('Workout plan created successfully!');
            
            // Clear the form
            document.getElementById('plan-name').value = '';
            document.getElementById('plan-description').value = '';
            document.getElementById('plan-duration').value = '8';
            
            // Reset day buttons
            document.querySelectorAll('.days-selector .btn').forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.style.background = '#f0f4f8';
                btn.style.color = '#333';
            });
        });
    }
});