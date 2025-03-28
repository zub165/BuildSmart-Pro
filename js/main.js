// Constants and Configuration
const CONSTRUCTION_PHASES = [
    { id: 1, name: 'Planning & Design', duration: '4-6 weeks' },
    { id: 2, name: 'Foundation', duration: '2-3 weeks' },
    { id: 3, name: 'Framing', duration: '3-4 weeks' },
    { id: 4, name: 'Utilities', duration: '2-3 weeks' },
    { id: 5, name: 'Interior & Finishing', duration: '6-8 weeks' }
];

const MATERIAL_CATEGORIES = {
    foundation: ['Cement', 'Sand', 'Gravel', 'Steel Bars'],
    framing: ['Lumber', 'Steel Beams', 'Plywood', 'Roofing Materials'],
    utilities: ['Electrical Wiring', 'Plumbing Pipes', 'HVAC Components'],
    finishing: ['Drywall', 'Paint', 'Flooring', 'Fixtures']
};

const BASE_RATES = {
    residential: {
        basic: 1200,
        standard: 1500,
        premium: 1800
    },
    commercial: {
        basic: 1500,
        standard: 1800,
        premium: 2200
    }
};

const LOCATION_MULTIPLIERS = {
    urban: 1.2,
    suburban: 1.0,
    rural: 0.9
};

// Custom Construction Steps Management
const CUSTOM_STEPS_KEY = 'customConstructionSteps';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializePropertySelector();
    initializeConstructionProgress();
    initializeCostCalculator();
    initializeQualityChecklist();
    initializeNotesSection();
    initializeCustomStepsManager();
    initializeTabs();
    initializeFloorPlan();
    initializeMobileMenuToggle();
});

// Property Selection
function initializePropertySelector() {
    const propertyCards = document.querySelectorAll('.property-card');
    const unitToggle = document.querySelector('.unit-toggle');

    propertyCards.forEach(card => {
        card.addEventListener('click', () => {
            propertyCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            updateCostEstimate();
        });
    });

    if (unitToggle) {
        unitToggle.addEventListener('change', () => {
            convertUnits();
        });
    }
}

function convertUnits() {
    const isMetric = document.querySelector('#metric-toggle').checked;
    const sizeElements = document.querySelectorAll('.size-value');

    sizeElements.forEach(element => {
        const sqft = parseFloat(element.dataset.sqft);
        if (isMetric) {
            element.textContent = `${Math.round(sqft * 0.092903)} m²`;
        } else {
            element.textContent = `${sqft} sq ft`;
        }
    });
}

// Construction Progress
function initializeConstructionProgress() {
    const progressPhases = document.querySelector('.progress-phases');
    if (!progressPhases) return;

    CONSTRUCTION_PHASES.forEach(phase => {
        const phaseElement = createPhaseElement(phase);
        progressPhases.appendChild(phaseElement);
    });

    updateConstructionProgress();
}

function createPhaseElement(phase) {
    const div = document.createElement('div');
    div.className = 'phase';
    div.dataset.phaseId = phase.id;
    
    div.innerHTML = `
        <div class="phase-number">${phase.id}</div>
        <div class="phase-name">${phase.name}</div>
        <div class="phase-duration">${phase.duration}</div>
    `;

    return div;
}

function updateConstructionProgress() {
    const currentPhase = 2; // This would come from your backend
    const phases = document.querySelectorAll('.phase');

    phases.forEach(phase => {
        const phaseId = parseInt(phase.dataset.phaseId);
        if (phaseId < currentPhase) {
            phase.classList.add('active');
        } else if (phaseId === currentPhase) {
            phase.classList.add('current');
        }
    });

    updateProgressBar(currentPhase);
}

function updateProgressBar(currentPhase) {
    const progress = ((currentPhase - 1) / CONSTRUCTION_PHASES.length) * 100;
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Cost Calculator
function initializeCostCalculator() {
    const calculator = document.querySelector('.cost-calculator');
    if (!calculator) return;

    const inputs = calculator.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateCostEstimate);
    });

    updateCostEstimate();
}

function updateCostEstimate() {
    const selectedProperty = document.querySelector('.property-card.selected');
    const constructionType = document.querySelector('#construction-type').value;
    const location = document.querySelector('#location').value;
    const quality = document.querySelector('#quality').value;

    if (!selectedProperty || !constructionType || !location || !quality) return;

    const size = parseFloat(selectedProperty.dataset.size);
    const baseRate = BASE_RATES[constructionType][quality];
    const locationMultiplier = LOCATION_MULTIPLIERS[location];

    const totalCost = size * baseRate * locationMultiplier;
    updateCostBreakdown(totalCost);
    updateCostChart(totalCost);
}

function updateCostBreakdown(totalCost) {
    const breakdown = {
        materials: 0.4,
        labor: 0.35,
        permits: 0.1,
        overhead: 0.15
    };

    const breakdownList = document.querySelector('#cost-breakdown-list');
    if (!breakdownList) return;

    breakdownList.innerHTML = '';
    Object.entries(breakdown).forEach(([category, percentage]) => {
        const cost = totalCost * percentage;
        const li = document.createElement('div');
        li.className = 'breakdown-item';
        li.innerHTML = `
            <span class="category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            <span class="amount">$${formatNumber(cost)}</span>
        `;
        breakdownList.appendChild(li);
    });

    // Add total
    const total = document.createElement('div');
    total.className = 'breakdown-item total';
    total.innerHTML = `
        <span>Total Estimated Cost</span>
        <span>$${formatNumber(totalCost)}</span>
    `;
    breakdownList.appendChild(total);
}

function updateCostChart(totalCost) {
    const ctx = document.querySelector('#cost-chart');
    if (!ctx) return;

    if (window.costChart) {
        window.costChart.destroy();
    }

    const data = {
        labels: ['Materials', 'Labor', 'Permits', 'Overhead'],
        datasets: [{
            data: [
                totalCost * 0.4,
                totalCost * 0.35,
                totalCost * 0.1,
                totalCost * 0.15
            ],
            backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444'
            ]
        }]
    };

    window.costChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Quality Checklist
function initializeQualityChecklist() {
    const checklist = document.querySelector('.checklist');
    if (!checklist) return;

    checklist.addEventListener('click', (e) => {
        const item = e.target.closest('li');
        if (item) {
            item.classList.toggle('checked');
            updateQualityScore();
        }
    });
}

function updateQualityScore() {
    const checklist = document.querySelector('.checklist');
    const total = checklist.querySelectorAll('li').length;
    const checked = checklist.querySelectorAll('li.checked').length;
    const score = Math.round((checked / total) * 100);

    const scoreElement = document.querySelector('.quality-score');
    if (scoreElement) {
        scoreElement.textContent = `${score}%`;
    }
}

// Notes Section
function initializeNotesSection() {
    const notesTextarea = document.querySelector('.notes-section textarea');
    if (!notesTextarea) return;

    notesTextarea.addEventListener('input', () => {
        localStorage.setItem('constructionNotes', notesTextarea.value);
    });

    // Load saved notes
    const savedNotes = localStorage.getItem('constructionNotes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }
}

// Custom Construction Steps Management
function initializeCustomStepsManager() {
    const customSteps = loadCustomSteps();
    renderCustomSteps(customSteps);
    setupCustomStepListeners();
}

function loadCustomSteps() {
    const savedSteps = localStorage.getItem(CUSTOM_STEPS_KEY);
    return savedSteps ? JSON.parse(savedSteps) : [];
}

function saveCustomSteps(steps) {
    localStorage.setItem(CUSTOM_STEPS_KEY, JSON.stringify(steps));
}

function renderCustomSteps(steps) {
    const customStepsContainer = document.querySelector('.custom-steps');
    if (!customStepsContainer) return;

    customStepsContainer.innerHTML = `
        <h4>Custom Construction Steps</h4>
        <div class="custom-steps-list">
            ${steps.map((step, index) => createCustomStepHTML(step, index)).join('')}
        </div>
        <button class="btn-secondary" id="add-custom-step">Add New Step</button>
    `;
}

function createCustomStepHTML(step, index) {
    return `
        <div class="custom-step" data-index="${index}">
            <div class="step-header">
                <h5>
                    <span class="step-name" contenteditable="true">${step.name}</span>
                    <span class="completion-time">${step.duration} days</span>
                </h5>
                <div class="step-actions">
                    <button class="btn-edit edit-step"><i class="fas fa-edit"></i></button>
                    <button class="btn-edit delete-step"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="step-details">
                <div class="materials-list">
                    <h6>Materials Required:</h6>
                    <ul>
                        ${step.materials.map(material => `
                            <li>
                                <span class="material-name" contenteditable="true">${material.name}</span>
                                <span class="material-quantity" contenteditable="true">${material.quantity}</span>
                                <span class="material-cost" contenteditable="true">$${material.cost}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn-secondary add-material">Add Material</button>
                </div>
                <div class="labor-list">
                    <h6>Labor Required:</h6>
                    <ul>
                        ${step.labor.map(labor => `
                            <li>
                                <span class="labor-type" contenteditable="true">${labor.type}</span>
                                <span class="labor-days" contenteditable="true">${labor.days} days</span>
                                <span class="labor-cost" contenteditable="true">$${labor.cost}/day</span>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn-secondary add-labor">Add Labor</button>
                </div>
                <div class="step-notes">
                    <h6>Notes:</h6>
                    <textarea>${step.notes || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

function setupCustomStepListeners() {
    const container = document.querySelector('.custom-steps');
    if (!container) return;

    // Add new step
    container.querySelector('#add-custom-step')?.addEventListener('click', () => {
        const steps = loadCustomSteps();
        steps.push({
            name: 'New Step',
            duration: 0,
            materials: [],
            labor: [],
            notes: ''
        });
        saveCustomSteps(steps);
        renderCustomSteps(steps);
    });

    // Edit and delete steps
    container.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const stepElement = e.target.closest('.custom-step');
        if (!stepElement) return;

        const index = parseInt(stepElement.dataset.index);
        const steps = loadCustomSteps();

        if (target.classList.contains('delete-step')) {
            steps.splice(index, 1);
            saveCustomSteps(steps);
            renderCustomSteps(steps);
        } else if (target.classList.contains('add-material')) {
            steps[index].materials.push({
                name: 'New Material',
                quantity: '0',
                cost: '0'
            });
            saveCustomSteps(steps);
            renderCustomSteps(steps);
        } else if (target.classList.contains('add-labor')) {
            steps[index].labor.push({
                type: 'New Labor',
                days: '0',
                cost: '0'
            });
            saveCustomSteps(steps);
            renderCustomSteps(steps);
        }
    });

    // Save changes on edit
    container.addEventListener('blur', (e) => {
        if (e.target.matches('[contenteditable]') || e.target.matches('textarea')) {
            const stepElement = e.target.closest('.custom-step');
            if (!stepElement) return;

            const index = parseInt(stepElement.dataset.index);
            const steps = loadCustomSteps();
            const step = steps[index];

            if (e.target.classList.contains('step-name')) {
                step.name = e.target.textContent;
            } else if (e.target.classList.contains('completion-time')) {
                step.duration = parseInt(e.target.textContent) || 0;
            } else if (e.target.closest('.materials-list')) {
                const materialItem = e.target.closest('li');
                const materialIndex = Array.from(materialItem.parentElement.children).indexOf(materialItem);
                const material = step.materials[materialIndex];

                if (e.target.classList.contains('material-name')) {
                    material.name = e.target.textContent;
                } else if (e.target.classList.contains('material-quantity')) {
                    material.quantity = e.target.textContent;
                } else if (e.target.classList.contains('material-cost')) {
                    material.cost = parseFloat(e.target.textContent.replace('$', '')) || 0;
                }
            } else if (e.target.closest('.labor-list')) {
                const laborItem = e.target.closest('li');
                const laborIndex = Array.from(laborItem.parentElement.children).indexOf(laborItem);
                const labor = step.labor[laborIndex];

                if (e.target.classList.contains('labor-type')) {
                    labor.type = e.target.textContent;
                } else if (e.target.classList.contains('labor-days')) {
                    labor.days = parseInt(e.target.textContent) || 0;
                } else if (e.target.classList.contains('labor-cost')) {
                    labor.cost = parseFloat(e.target.textContent.replace('$', '')) || 0;
                }
            } else if (e.target.matches('textarea')) {
                step.notes = e.target.value;
            }

            saveCustomSteps(steps);
            updateCustomStepsCost();
        }
    });
}

function updateCustomStepsCost() {
    const steps = loadCustomSteps();
    let totalMaterialCost = 0;
    let totalLaborCost = 0;
    let totalDuration = 0;

    steps.forEach(step => {
        // Calculate materials cost
        step.materials.forEach(material => {
            totalMaterialCost += (parseFloat(material.cost) || 0) * (parseFloat(material.quantity) || 0);
        });

        // Calculate labor cost
        step.labor.forEach(labor => {
            totalLaborCost += (parseFloat(labor.cost) || 0) * (parseInt(labor.days) || 0);
        });

        // Sum up duration
        totalDuration += parseInt(step.duration) || 0;
    });

    const totalCost = totalMaterialCost + totalLaborCost;

    // Update the custom steps summary if it exists
    const summaryElement = document.querySelector('.custom-steps-summary');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-item">
                <span>Total Duration:</span>
                <span>${totalDuration} days</span>
            </div>
            <div class="summary-item">
                <span>Materials Cost:</span>
                <span>$${formatNumber(totalMaterialCost)}</span>
            </div>
            <div class="summary-item">
                <span>Labor Cost:</span>
                <span>$${formatNumber(totalLaborCost)}</span>
            </div>
            <div class="summary-item total">
                <span>Total Cost:</span>
                <span>$${formatNumber(totalCost)}</span>
            </div>
        `;
    }
}

// Utility Functions
function formatNumber(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // You could add user-friendly error notifications here
});

// Tab Functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const targetId = tab.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Floor Plan Functionality
function initializeFloorPlan() {
    const planTypes = document.querySelectorAll('.plan-type');
    planTypes.forEach(plan => {
        plan.addEventListener('click', () => {
            planTypes.forEach(p => p.classList.remove('active'));
            plan.classList.add('active');
            updateFloorPlanDetails(plan.dataset.type);
        });
    });

    // Initialize room highlighting
    initializeRoomHighlighting();
}

function updateFloorPlanDetails(planType) {
    const floorPlans = {
        'standard': {
            rooms: [
                { name: 'Living Room', area: '20\' x 15\'', features: ['Large windows', 'Open concept'] },
                { name: 'Kitchen', area: '12\' x 12\'', features: ['Modern layout', 'Island counter'] },
                { name: 'Master Bedroom', area: '15\' x 12\'', features: ['En-suite bathroom', 'Walk-in closet'] },
                { name: 'Bedroom 2', area: '12\' x 10\'', features: ['Built-in wardrobe', 'Large window'] },
                { name: 'Bathrooms', area: '8\' x 6\'', features: ['Modern fixtures', 'Tiled walls'] }
            ],
            dimensions: {
                width: '40 feet',
                length: '50 feet',
                totalArea: '2000 sq ft'
            }
        },
        'luxury': {
            rooms: [
                { name: 'Grand Living Room', area: '25\' x 20\'', features: ['Double-height ceiling', 'Fireplace'] },
                { name: 'Gourmet Kitchen', area: '15\' x 15\'', features: ['Premium appliances', 'Butler\'s pantry'] },
                { name: 'Master Suite', area: '20\' x 15\'', features: ['Spa bathroom', 'Dual walk-in closets'] },
                { name: 'Bedroom 2', area: '15\' x 12\'', features: ['En-suite bathroom', 'Balcony'] },
                { name: 'Bedroom 3', area: '15\' x 12\'', features: ['En-suite bathroom', 'Study area'] }
            ],
            dimensions: {
                width: '50 feet',
                length: '60 feet',
                totalArea: '3000 sq ft'
            }
        }
    };

    const plan = floorPlans[planType];
    if (!plan) return;

    // Update room information
    const roomList = document.querySelector('.room-info ul');
    if (roomList) {
        roomList.innerHTML = plan.rooms.map(room => `
            <li>
                <span class="room-type">${room.name}</span>
                <span class="room-area">${room.area}</span>
                <span class="room-features">${room.features.join(', ')}</span>
            </li>
        `).join('');
    }

    // Update dimensions
    const dimensionsInfo = document.querySelector('.dimensions-info');
    if (dimensionsInfo) {
        dimensionsInfo.innerHTML = `
            <h4>Plot Dimensions</h4>
            <div class="dimension-details">
                <p><span>Width:</span> <span>${plan.dimensions.width}</span></p>
                <p><span>Length:</span> <span>${plan.dimensions.length}</span></p>
                <p><span>Total Area:</span> <span>${plan.dimensions.totalArea}</span></p>
            </div>
        `;
    }

    // Update floor plan image
    const planImage = document.querySelector('.plan-image img');
    if (planImage) {
        planImage.src = `images/floor-plan-${planType}.png`;
        planImage.alt = `${planType.charAt(0).toUpperCase() + planType.slice(1)} Floor Plan`;
    }
}

function initializeRoomHighlighting() {
    const rooms = document.querySelectorAll('.room-info li');
    const planOverlay = document.querySelector('.plan-overlay');

    rooms.forEach(room => {
        room.addEventListener('mouseenter', () => {
            const roomType = room.querySelector('.room-type').textContent.toLowerCase().replace(' ', '-');
            highlightRoom(roomType);
        });

        room.addEventListener('mouseleave', () => {
            clearHighlight();
        });
    });
}

function highlightRoom(roomType) {
    const overlay = document.querySelector('.plan-overlay');
    if (!overlay) return;

    // Add highlighting effect for the specific room
    // This would typically involve adding a semi-transparent overlay
    // on top of the floor plan image, highlighting the specific room
    overlay.innerHTML = `<div class="room-highlight ${roomType}"></div>`;
}

function clearHighlight() {
    const overlay = document.querySelector('.plan-overlay');
    if (overlay) {
        overlay.innerHTML = '';
    }
}

// Mobile Menu Toggle
function initializeMobileMenuToggle() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    if (mobileMenuToggle && navbarLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
            const isExpanded = navbarLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.navbar-links') && 
                !event.target.closest('.mobile-menu-toggle') && 
                navbarLinks.classList.contains('active')) {
                navbarLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', false);
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navbarLinks.classList.contains('active')) {
                navbarLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', false);
            }
        });
    }
} 