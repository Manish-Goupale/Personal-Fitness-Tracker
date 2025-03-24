// Initialize charts when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize charts if we're on the workout statistics page
    if (document.querySelector('.workout-stats-container') && 
        document.querySelector('.workout-stats-container').classList.contains('active')) {
        initializeCharts();
        setupHeatmap();
        setupEventListeners();
    }
});

// Initialize all charts
function initializeCharts() {
    // Performance Chart
    initializePerformanceChart();
    
    // Activity Distribution Pie Chart
    initializeActivityPieChart();
}

// Initialize Performance Chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Calories Burned',
                    data: [3200, 3600, 3400, 3800, 3500, 4200, 4100, 4300],
                    borderColor: '#6C5CE7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#6C5CE7'
                },
                {
                    label: 'Workout Duration (min)',
                    data: [320, 340, 310, 360, 340, 380, 390, 400],
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#FF9800'
                },
                {
                    label: 'Target Achievement (%)',
                    data: [75, 82, 78, 85, 82, 92, 90, 95],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#4CAF50'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (context.dataset.label === 'Target Achievement (%)') {
                                    label += '%';
                                }