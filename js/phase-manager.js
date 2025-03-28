// Phase Management System
class PhaseManager {
    constructor() {
        this.phases = {
            planning: {
                title: 'Planning Phase',
                steps: [
                    {
                        title: 'Site Analysis',
                        description: 'Evaluate site conditions and feasibility',
                        duration: '1-2 weeks',
                        cost: '$2,000-4,000',
                        checklist: [
                            'Soil testing and analysis',
                            'Topographical survey',
                            'Environmental assessment',
                            'Utilities availability check',
                            'Zoning verification'
                        ],
                        materials: []
                    },
                    {
                        title: 'Design Development',
                        description: 'Create detailed architectural plans',
                        duration: '3-4 weeks',
                        cost: '$5,000-10,000',
                        checklist: [
                            'Floor plan design',
                            'Elevation drawings',
                            'Structural calculations',
                            'Material specifications',
                            'Energy efficiency planning'
                        ],
                        materials: []
                    },
                    {
                        title: 'Permits and Approvals',
                        description: 'Obtain necessary building permits',
                        duration: '2-4 weeks',
                        cost: '$1,500-3,000',
                        checklist: [
                            'Building permit application',
                            'Zoning approval',
                            'Environmental permits',
                            'Utility permits',
                            'HOA approval (if applicable)'
                        ],
                        materials: []
                    }
                ]
            },
            foundation: {
                title: 'Foundation Phase',
                steps: [
                    {
                        title: 'Site Preparation',
                        description: 'Clear and prepare the construction site',
                        duration: '1-2 weeks',
                        cost: '$3,000-6,000',
                        checklist: [
                            'Site clearing and grading',
                            'Excavation for foundation',
                            'Installation of erosion control',
                            'Utilities marking',
                            'Drainage system setup'
                        ],
                        materials: [
                            { name: 'Gravel', quantity: '20 tons', cost: 1000 },
                            { name: 'Erosion Control Materials', quantity: '1 set', cost: 500 }
                        ]
                    },
                    {
                        title: 'Foundation Construction',
                        description: 'Build the foundation structure',
                        duration: '2-3 weeks',
                        cost: '$15,000-25,000',
                        checklist: [
                            'Footing installation',
                            'Waterproofing application',
                            'Reinforcement placement',
                            'Concrete pouring',
                            'Curing process'
                        ],
                        materials: [
                            { name: 'Concrete', quantity: '30 cubic yards', cost: 4500 },
                            { name: 'Rebar', quantity: '2 tons', cost: 2000 },
                            { name: 'Waterproofing', quantity: '500 sq ft', cost: 1500 }
                        ]
                    }
                ]
            },
            structure: {
                title: 'Structure Phase',
                steps: [
                    {
                        title: 'Framing',
                        description: 'Construct the building frame',
                        duration: '3-4 weeks',
                        cost: '$20,000-30,000',
                        checklist: [
                            'Wall framing',
                            'Roof trusses installation',
                            'Sheathing application',
                            'Window and door framing',
                            'Quality inspection'
                        ],
                        materials: [
                            { name: 'Lumber', quantity: '5000 board feet', cost: 7500 },
                            { name: 'Trusses', quantity: '24 pieces', cost: 6000 },
                            { name: 'Sheathing', quantity: '100 sheets', cost: 3000 }
                        ]
                    }
                ]
            },
            utilities: {
                title: 'Utilities Phase',
                steps: [
                    {
                        title: 'Electrical Installation',
                        description: 'Install electrical systems',
                        duration: '2-3 weeks',
                        cost: '$8,000-12,000',
                        checklist: [
                            'Main panel installation',
                            'Wiring throughout structure',
                            'Fixture installation',
                            'Safety checks',
                            'Inspection preparation'
                        ],
                        materials: [
                            { name: 'Electrical Panel', quantity: '1 unit', cost: 1000 },
                            { name: 'Wiring', quantity: '1000 feet', cost: 2000 },
                            { name: 'Fixtures', quantity: '20 units', cost: 2000 }
                        ]
                    },
                    {
                        title: 'Plumbing Installation',
                        description: 'Install plumbing systems',
                        duration: '2-3 weeks',
                        cost: '$10,000-15,000',
                        checklist: [
                            'Water line installation',
                            'Drain line installation',
                            'Fixture rough-in',
                            'Water heater installation',
                            'Pressure testing'
                        ],
                        materials: [
                            { name: 'Pipes', quantity: '500 feet', cost: 2500 },
                            { name: 'Fixtures', quantity: '10 units', cost: 3000 },
                            { name: 'Water Heater', quantity: '1 unit', cost: 1000 }
                        ]
                    }
                ]
            },
            finishing: {
                title: 'Finishing Phase',
                steps: [
                    {
                        title: 'Interior Finishing',
                        description: 'Complete interior work',
                        duration: '4-6 weeks',
                        cost: '$25,000-35,000',
                        checklist: [
                            'Drywall installation',
                            'Painting',
                            'Flooring installation',
                            'Cabinet installation',
                            'Trim work'
                        ],
                        materials: [
                            { name: 'Drywall', quantity: '200 sheets', cost: 4000 },
                            { name: 'Paint', quantity: '30 gallons', cost: 1000 },
                            { name: 'Flooring', quantity: '1500 sq ft', cost: 7500 }
                        ]
                    }
                ]
            }
        };

        this.initializePhases();
    }

    initializePhases() {
        const phaseButtons = document.querySelectorAll('.phase-btn');
        phaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const phase = button.getAttribute('data-phase');
                this.showPhase(phase);
            });
        });

        // Initialize with first phase
        this.showPhase('planning');
    }

    showPhase(phaseName) {
        const phase = this.phases[phaseName];
        if (!phase) return;

        const content = document.querySelector('.phase-content');
        if (!content) return;

        content.innerHTML = this.generatePhaseHTML(phaseName, phase);
        this.initializePhaseFeatures(phaseName);
        this.updateProgressTracker(phaseName);
    }

    generatePhaseHTML(phaseName, phase) {
        return `
            <div class="phase-details">
                <h2>${phase.title}</h2>
                <div class="phase-grid">
                    <div class="steps-section">
                        <h3>Essential Steps</h3>
                        ${phase.steps.map(step => this.generateStepHTML(step)).join('')}
                    </div>
                    <div class="tools-section">
                        ${this.generateToolsHTML(phaseName)}
                    </div>
                </div>
            </div>
        `;
    }

    generateStepHTML(step) {
        return `
            <div class="step-card">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
                <div class="step-details">
                    <span class="duration"><i class="far fa-clock"></i> ${step.duration}</span>
                    <span class="cost"><i class="fas fa-dollar-sign"></i> ${step.cost}</span>
                </div>
                <div class="checklist">
                    <h5>Checklist</h5>
                    <ul>
                        ${step.checklist.map(item => `
                            <li>
                                <label>
                                    <input type="checkbox" class="checklist-item">
                                    <span>${item}</span>
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ${step.materials.length > 0 ? `
                    <div class="materials">
                        <h5>Required Materials</h5>
                        <ul>
                            ${step.materials.map(material => `
                                <li>
                                    ${material.name}: ${material.quantity} - $${material.cost}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateToolsHTML(phaseName) {
        const toolsContent = {
            planning: `
                <div class="planning-tools">
                    <h3>Planning Tools</h3>
                    <div class="tool-card">
                        <h4>Cost Calculator</h4>
                        <div class="calculator-form">
                            <input type="number" id="squareFootage" placeholder="Square Footage">
                            <select id="constructionType">
                                <option value="basic">Basic</option>
                                <option value="standard">Standard</option>
                                <option value="premium">Premium</option>
                            </select>
                            <button onclick="calculateCost()">Calculate</button>
                        </div>
                    </div>
                </div>
            `,
            foundation: `
                <div class="foundation-tools">
                    <h3>Foundation Tools</h3>
                    <div class="tool-card">
                        <h4>Foundation Calculator</h4>
                        <div class="calculator-form">
                            <input type="number" id="foundationDepth" placeholder="Foundation Depth (ft)">
                            <input type="number" id="foundationWidth" placeholder="Foundation Width (ft)">
                            <button onclick="calculateFoundation()">Calculate</button>
                        </div>
                    </div>
                </div>
            `
            // Add more phase-specific tools as needed
        };

        return toolsContent[phaseName] || '';
    }

    initializePhaseFeatures(phaseName) {
        // Initialize phase-specific features
        switch (phaseName) {
            case 'planning':
                this.initializePlanningTools();
                break;
            case 'foundation':
                this.initializeFoundationTools();
                break;
            // Add more cases as needed
        }
    }

    initializePlanningTools() {
        const calculator = document.getElementById('squareFootage');
        if (calculator) {
            calculator.addEventListener('input', this.updatePlanningCalculations);
        }
    }

    initializeFoundationTools() {
        const calculator = document.getElementById('foundationDepth');
        if (calculator) {
            calculator.addEventListener('input', this.updateFoundationCalculations);
        }
    }

    updateProgressTracker(currentPhase) {
        const phases = ['planning', 'foundation', 'structure', 'utilities', 'finishing'];
        const currentIndex = phases.indexOf(currentPhase);
        
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((currentIndex + 1) / phases.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update phase indicators
        phases.forEach((phase, index) => {
            const indicator = document.querySelector(`[data-phase="${phase}"]`);
            if (indicator) {
                indicator.classList.toggle('completed', index < currentIndex);
                indicator.classList.toggle('active', index === currentIndex);
            }
        });

        // Update current phase text
        const currentPhaseText = document.querySelector('.current-phase');
        if (currentPhaseText) {
            currentPhaseText.textContent = `Current Phase: ${this.phases[currentPhase].title}`;
        }
    }
}

// Initialize Phase Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.phaseManager = new PhaseManager();
});