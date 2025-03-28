// Custom Steps Management
class CustomStepsManager {
    constructor() {
        this.steps = JSON.parse(localStorage.getItem('customSteps')) || [];
        this.container = document.getElementById('custom-steps-list');
        this.addButton = document.getElementById('add-custom-step');
        
        this.initializeEventListeners();
        this.renderSteps();
        this.updateSummary();
    }

    initializeEventListeners() {
        this.addButton.addEventListener('click', () => this.addNewStep());
    }

    addNewStep() {
        const newStep = {
            id: Date.now(),
            title: 'New Step',
            duration: 1,
            materials: [],
            labor: [],
            notes: ''
        };

        this.steps.push(newStep);
        this.saveSteps();
        this.renderSteps();
        this.updateSummary();
    }

    deleteStep(stepId) {
        this.steps = this.steps.filter(step => step.id !== stepId);
        this.saveSteps();
        this.renderSteps();
        this.updateSummary();
    }

    updateStep(stepId, updates) {
        const stepIndex = this.steps.findIndex(step => step.id === stepId);
        if (stepIndex !== -1) {
            this.steps[stepIndex] = { ...this.steps[stepIndex], ...updates };
            this.saveSteps();
            this.updateSummary();
        }
    }

    addMaterial(stepId) {
        const step = this.steps.find(step => step.id === stepId);
        if (step) {
            step.materials.push({
                id: Date.now(),
                name: 'New Material',
                quantity: 1,
                unitPrice: 0
            });
            this.saveSteps();
            this.renderSteps();
            this.updateSummary();
        }
    }

    addLabor(stepId) {
        const step = this.steps.find(step => step.id === stepId);
        if (step) {
            step.labor.push({
                id: Date.now(),
                type: 'New Labor',
                days: 1,
                ratePerDay: 0
            });
            this.saveSteps();
            this.renderSteps();
            this.updateSummary();
        }
    }

    deleteItem(stepId, type, itemId) {
        const step = this.steps.find(step => step.id === stepId);
        if (step) {
            step[type] = step[type].filter(item => item.id !== itemId);
            this.saveSteps();
            this.renderSteps();
            this.updateSummary();
        }
    }

    saveSteps() {
        localStorage.setItem('customSteps', JSON.stringify(this.steps));
    }

    calculateStepCosts(step) {
        const materialCost = step.materials.reduce((total, material) => {
            return total + (material.quantity * material.unitPrice);
        }, 0);

        const laborCost = step.labor.reduce((total, labor) => {
            return total + (labor.days * labor.ratePerDay);
        }, 0);

        return { materialCost, laborCost };
    }

    updateSummary() {
        const totalSteps = this.steps.length;
        const totalDuration = this.steps.reduce((total, step) => total + step.duration, 0);
        const totalCosts = this.steps.reduce((totals, step) => {
            const { materialCost, laborCost } = this.calculateStepCosts(step);
            return {
                materialCost: totals.materialCost + materialCost,
                laborCost: totals.laborCost + laborCost
            };
        }, { materialCost: 0, laborCost: 0 });

        document.getElementById('total-steps').textContent = totalSteps;
        document.getElementById('total-duration').textContent = `${totalDuration} days`;
        document.getElementById('total-material-cost').textContent = `$${totalCosts.materialCost.toLocaleString()}`;
        document.getElementById('total-labor-cost').textContent = `$${totalCosts.laborCost.toLocaleString()}`;
    }

    renderSteps() {
        this.container.innerHTML = this.steps.map(step => `
            <div class="custom-step" data-step-id="${step.id}">
                <div class="custom-step-header">
                    <input type="text" class="custom-step-title" value="${step.title}" 
                           onchange="customStepsManager.updateStep(${step.id}, { title: this.value })">
                    <div class="custom-step-duration">
                        <input type="number" value="${step.duration}" min="1" 
                               onchange="customStepsManager.updateStep(${step.id}, { duration: parseInt(this.value) })">
                        <span>days</span>
                    </div>
                </div>

                <div class="custom-step-content">
                    <div class="materials-list">
                        <div class="list-header">
                            <span class="list-title">Materials</span>
                            <button class="btn-outline" onclick="customStepsManager.addMaterial(${step.id})">
                                <i class="fas fa-plus"></i> Add Material
                            </button>
                        </div>
                        <div class="list-items">
                            ${step.materials.map(material => `
                                <div class="list-item">
                                    <input type="text" value="${material.name}" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               materials: step.materials.map(m => 
                                                   m.id === ${material.id} ? { ...m, name: this.value } : m
                                               )
                                           })">
                                    <input type="number" value="${material.quantity}" min="1" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               materials: step.materials.map(m => 
                                                   m.id === ${material.id} ? { ...m, quantity: parseInt(this.value) } : m
                                               )
                                           })">
                                    <input type="number" value="${material.unitPrice}" min="0" step="0.01" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               materials: step.materials.map(m => 
                                                   m.id === ${material.id} ? { ...m, unitPrice: parseFloat(this.value) } : m
                                               )
                                           })">
                                    <span class="cost">$${(material.quantity * material.unitPrice).toLocaleString()}</span>
                                    <button class="btn-icon" onclick="customStepsManager.deleteItem(${step.id}, 'materials', ${material.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="labor-list">
                        <div class="list-header">
                            <span class="list-title">Labor</span>
                            <button class="btn-outline" onclick="customStepsManager.addLabor(${step.id})">
                                <i class="fas fa-plus"></i> Add Labor
                            </button>
                        </div>
                        <div class="list-items">
                            ${step.labor.map(labor => `
                                <div class="list-item">
                                    <input type="text" value="${labor.type}" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               labor: step.labor.map(l => 
                                                   l.id === ${labor.id} ? { ...l, type: this.value } : l
                                               )
                                           })">
                                    <input type="number" value="${labor.days}" min="1" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               labor: step.labor.map(l => 
                                                   l.id === ${labor.id} ? { ...l, days: parseInt(this.value) } : l
                                               )
                                           })">
                                    <input type="number" value="${labor.ratePerDay}" min="0" step="0.01" 
                                           onchange="customStepsManager.updateStep(${step.id}, {
                                               labor: step.labor.map(l => 
                                                   l.id === ${labor.id} ? { ...l, ratePerDay: parseFloat(this.value) } : l
                                               )
                                           })">
                                    <span class="cost">$${(labor.days * labor.ratePerDay).toLocaleString()}</span>
                                    <button class="btn-icon" onclick="customStepsManager.deleteItem(${step.id}, 'labor', ${labor.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="custom-step-notes">
                        <textarea placeholder="Add notes for this step..." 
                                  onchange="customStepsManager.updateStep(${step.id}, { notes: this.value })">${step.notes}</textarea>
                    </div>
                </div>

                <div class="custom-step-actions">
                    <button class="btn-secondary" onclick="customStepsManager.deleteStep(${step.id})">
                        <i class="fas fa-trash"></i> Delete Step
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the custom steps manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.customStepsManager = new CustomStepsManager();
}); 