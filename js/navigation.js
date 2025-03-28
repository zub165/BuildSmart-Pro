// Navigation Management System
class NavigationManager {
    constructor() {
        this.initializeNavigation();
        this.handleMobileMenu();
        this.handleScroll();
    }

    initializeNavigation() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Determine if we're in the pages directory
        const inPagesDirectory = window.location.pathname.includes('/pages/');
        const basePath = inPagesDirectory ? '../' : '';

        navbar.innerHTML = `
            <nav class="navbar">
                <a href="${basePath}index.html" class="navbar-brand">
                    <i class="fas fa-hard-hat"></i>
                    BuildSmart Pro
                </a>

                <button class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </button>

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="${basePath}index.html" class="nav-link">
                            <i class="fas fa-home"></i>
                            Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="${basePath}pages/estimator.html" class="nav-link">
                            <i class="fas fa-calculator"></i>
                            Estimator
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="${basePath}pages/guide.html" class="nav-link">
                            <i class="fas fa-book"></i>
                            Guide
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="${basePath}pages/floor-plan.html" class="nav-link">
                            <i class="fas fa-drafting-compass"></i>
                            Floor Plan
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="${basePath}pages/reference.html" class="nav-link">
                            <i class="fas fa-bookmark"></i>
                            Reference
                        </a>
                    </li>
                    <li class="nav-item">
                        <button class="sign-in-btn">
                            <i class="fas fa-user"></i>
                            Sign In
                        </button>
                    </li>
                </ul>
            </nav>
        `;

        // Set active link based on current page
        this.setActiveLink();
    }

    handleMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navbarNav = document.querySelector('.navbar-nav');

        if (!mobileMenuBtn || !navbarNav) return;

        mobileMenuBtn.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-nav') && !e.target.closest('.mobile-menu-btn')) {
                navbarNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    handleScroll() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }

            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                // Scrolling down
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                // Scrolling up
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }

            lastScroll = currentScroll;
        });
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Extract the last part of both paths for comparison
            const currentPage = currentPath.split('/').pop();
            const linkPage = href.split('/').pop();
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize Navigation Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
}); 