// Tab Management System
class TabManager {
    constructor() {
        this.currentTab = 'planning';
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.currentTheme = localStorage.getItem('preferredTheme') || 'light';
        this.translations = {};
        
        this.initializeTabs();
        this.initializeThemeToggle();
        this.initializeLanguageSelector();
        this.loadTranslations();
    }

    initializeTabs() {
        const tabs = document.querySelectorAll('.phase-btn');
        const tabContents = document.querySelectorAll('.phase');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const phase = tab.getAttribute('data-phase');
                this.switchTab(phase, tabs, tabContents);
            });
        });

        // Initialize first tab
        this.switchTab('planning', tabs, tabContents);
    }

    async switchTab(phase, tabs, tabContents) {
        // Remove active class from all tabs and contents
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-phase="${phase}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Show loading state
        const phaseContent = document.querySelector('.phase-content');
        phaseContent.innerHTML = '<div class="loading">Loading...</div>';

        try {
            // Fetch phase content
            const content = await this.fetchPhaseContent(phase);
            
            // Update content with animation
            phaseContent.style.opacity = '0';
            setTimeout(() => {
                phaseContent.innerHTML = content;
                phaseContent.style.opacity = '1';
                
                // Initialize phase-specific features
                this.initializePhaseFeatures(phase);
            }, 300);

            // Update URL without page reload
            history.pushState({phase}, '', `#${phase}`);
            
            // Update progress tracker
            this.updateProgressTracker(phase);
            
            this.currentTab = phase;
        } catch (error) {
            console.error('Error loading tab content:', error);
            phaseContent.innerHTML = '<div class="error">Error loading content. Please try again.</div>';
        }
    }

    async fetchPhaseContent(phase) {
        // Simulate API call - replace with actual API endpoint
        const phaseContent = {
            planning: {
                title: this.translate('phases.planning.title'),
                steps: [
                    {
                        title: this.translate('phases.planning.steps.siteAnalysis'),
                        duration: '1-2 weeks',
                        cost: '$500-1,000'
                    },
                    // ... more steps
                ]
            },
            foundation: {
                title: this.translate('phases.foundation.title'),
                steps: [
                    {
                        title: this.translate('phases.foundation.steps.soilTesting'),
                        duration: '1 week',
                        cost: '$1,000-2,000'
                    },
                    // ... more steps
                ]
            }
            // ... other phases
        };

        return this.generatePhaseHTML(phaseContent[phase]);
    }

    generatePhaseHTML(phaseData) {
        return `
            <div class="phase active">
                <h2>${phaseData.title}</h2>
                <div class="phase-grid">
                    <div class="phase-steps">
                        <h3>${this.translate('common.essentialSteps')}</h3>
                        <ol class="steps-list">
                            ${phaseData.steps.map(step => `
                                <li>
                                    <h4>${step.title}</h4>
                                    <div class="step-details">
                                        <span class="duration">
                                            <i class="far fa-clock"></i> ${step.duration}
                                        </span>
                                        <span class="cost-range">
                                            <i class="fas fa-dollar-sign"></i> ${step.cost}
                                        </span>
                                    </div>
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                    ${this.generateResourcesSection(phaseData)}
                </div>
            </div>
        `;
    }

    generateResourcesSection(phaseData) {
        return `
            <div class="phase-resources">
                <h3>${this.translate('common.resourcesAndTips')}</h3>
                <div class="resources-list">
                    <!-- Resources content -->
                </div>
            </div>
        `;
    }

    initializePhaseFeatures(phase) {
        switch (phase) {
            case 'planning':
                this.initializePlanningTools(phase);
                break;
            case 'foundation':
                this.initializeFoundationCalculator();
                break;
            // ... other phase-specific initializations
        }
    }

    initializePlanningTools(phase) {
        // Initialize planning phase specific tools
        const planningTools = document.querySelector('.planning-tools');
        if (!planningTools) return;

        // Initialize site analysis tool
        const siteAnalysis = planningTools.querySelector('.site-analysis');
        if (siteAnalysis) {
            // Add event listeners for site analysis tools
            const analyzeBtn = siteAnalysis.querySelector('.analyze-btn');
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', this.handleSiteAnalysis.bind(this));
            }
        }

        // Initialize permit checker
        const permitChecker = planningTools.querySelector('.permit-checker');
        if (permitChecker) {
            // Add event listeners for permit checker
            const checkBtn = permitChecker.querySelector('.check-btn');
            if (checkBtn) {
                checkBtn.addEventListener('click', this.handlePermitCheck.bind(this));
            }
        }
    }

    handleSiteAnalysis() {
        // Implement site analysis logic
        console.log('Site analysis started');
    }

    handlePermitCheck() {
        // Implement permit checking logic
        console.log('Permit check started');
    }

    // Theme Management
    initializeThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <button class="theme-btn" data-theme="light">
                <i class="fas fa-sun"></i>
            </button>
            <button class="theme-btn" data-theme="dark">
                <i class="fas fa-moon"></i>
            </button>
            <button class="theme-btn" data-theme="system">
                <i class="fas fa-desktop"></i>
            </button>
        `;

        document.querySelector('.navbar .container').appendChild(themeToggle);

        themeToggle.addEventListener('click', (e) => {
            const theme = e.target.closest('.theme-btn')?.dataset.theme;
            if (theme) {
                this.setTheme(theme);
            }
        });

        // Apply saved theme
        this.setTheme(this.currentTheme);
    }

    setTheme(theme) {
        const root = document.documentElement;
        const isDark = theme === 'dark' || 
                      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('preferredTheme', theme);
        this.currentTheme = theme;

        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    // Language Support
    initializeLanguageSelector() {
        const langSelector = document.createElement('div');
        langSelector.className = 'lang-selector';
        langSelector.innerHTML = `
            <select>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
            </select>
        `;

        document.querySelector('.navbar .container').appendChild(langSelector);

        langSelector.querySelector('select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Set initial language
        langSelector.querySelector('select').value = this.currentLang;
    }

    async loadTranslations() {
        try {
            const response = await fetch(`/translations/${this.currentLang}.json`);
            this.translations = await response.json();
            this.updatePageTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    translate(key) {
        return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
    }

    async setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        await this.loadTranslations();
        
        // Reload current tab content
        const tabs = document.querySelectorAll('.phase-btn');
        const tabContents = document.querySelectorAll('.phase');
        this.switchTab(this.currentTab, tabs, tabContents);
    }

    updatePageTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
    }

    // Progress Tracking
    updateProgressTracker(currentPhase) {
        // Get the progress tracker element
        const progressTracker = document.querySelector('.progress-tracker');
        if (!progressTracker) return; // Exit if element doesn't exist

        // Define the phases in order
        const phases = ['planning', 'foundation', 'structure', 'utilities', 'finishing'];
        const currentIndex = phases.indexOf(currentPhase);

        // Update progress percentage
        const progress = ((currentIndex + 1) / phases.length) * 100;
        
        // Update progress bar if it exists
        const progressBar = progressTracker.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update current phase text if it exists
        const phaseText = progressTracker.querySelector('.current-phase');
        if (phaseText) {
            phaseText.textContent = `Current Phase: ${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}`;
        }

        // Update phase indicators
        phases.forEach((phase, index) => {
            const indicator = progressTracker.querySelector(`[data-phase="${phase}"]`);
            if (indicator) {
                if (index < currentIndex) {
                    indicator.classList.add('completed');
                    indicator.classList.remove('active');
                } else if (index === currentIndex) {
                    indicator.classList.add('active');
                    indicator.classList.remove('completed');
                } else {
                    indicator.classList.remove('completed', 'active');
                }
            }
        });
    }
}

// Initialize Tab Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tabManager = new TabManager();
}); 