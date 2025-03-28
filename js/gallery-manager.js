// Gallery Management System
class GalleryManager {
    constructor() {
        this.styles = {
            spanish: [
                {
                    id: 'spanish-1',
                    title: 'Mediterranean Villa',
                    description: 'Classic Spanish colonial architecture with terracotta roof',
                    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Terracotta Roof', 'White Stucco Walls', 'Arched Windows', 'Interior Courtyard']
                },
                {
                    id: 'spanish-2',
                    title: 'Modern Spanish Home',
                    description: 'Contemporary take on traditional Spanish architecture',
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Flat Roof', 'Large Windows', 'Open Floor Plan', 'Indoor-Outdoor Living']
                }
            ],
            american: [
                {
                    id: 'american-1',
                    title: 'Colonial Estate',
                    description: 'Traditional American colonial architecture',
                    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Symmetrical Design', 'Multi-pane Windows', 'Central Door', 'Multiple Chimneys']
                },
                {
                    id: 'american-2',
                    title: 'Modern Farmhouse',
                    description: 'Contemporary American farmhouse style',
                    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Metal Roof', 'Board and Batten', 'Large Porch', 'Open Concept']
                }
            ],
            turkish: [
                {
                    id: 'turkish-1',
                    title: 'Ottoman Villa',
                    description: 'Traditional Turkish architecture with modern amenities',
                    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Ornate Details', 'Central Courtyard', 'Domed Roof', 'Marble Features']
                },
                {
                    id: 'turkish-2',
                    title: 'Modern Turkish Home',
                    description: 'Contemporary Turkish architectural design',
                    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Clean Lines', 'Large Windows', 'Natural Materials', 'Indoor Garden']
                }
            ],
            iranian: [
                {
                    id: 'iranian-1',
                    title: 'Persian Palace',
                    description: 'Traditional Iranian architecture with courtyard',
                    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Central Garden', 'Geometric Patterns', 'High Ceilings', 'Ornate Details']
                },
                {
                    id: 'iranian-2',
                    title: 'Modern Iranian Home',
                    description: 'Contemporary take on Persian architecture',
                    image: 'https://images.unsplash.com/photo-1600566752355-35792b6eb300?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
                    features: ['Minimalist Design', 'Traditional Elements', 'Natural Light', 'Private Courtyard']
                }
            ]
        };

        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.style-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevButton = document.querySelector('.nav-button.prev');
        this.nextButton = document.querySelector('.nav-button.next');
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;

        this.initializeGallery();
        this.initializeControls();
    }

    initializeGallery() {
        if (this.slides.length === 0) return;

        // Show first slide
        this.showSlide(0);

        // Add event listeners to navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.stopAutoplay();
                this.showSlide(this.currentSlide - 1);
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.stopAutoplay();
                this.showSlide(this.currentSlide + 1);
            });
        }

        // Add event listeners to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoplay();
                this.showSlide(index);
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stopAutoplay();
                this.showSlide(this.currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                this.stopAutoplay();
                this.showSlide(this.currentSlide + 1);
            }
        });

        // Start autoplay
        this.startAutoplay();

        // Pause autoplay on hover
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (slidesWrapper) {
            slidesWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            slidesWrapper.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }

    createStyleSection(style, homes) {
        const section = document.createElement('div');
        section.className = 'style-section';
        section.innerHTML = `
            <h2 class="style-title">${style.charAt(0).toUpperCase() + style.slice(1)} Style</h2>
            <div class="style-grid">
                ${homes.map(home => this.createHomeCard(home)).join('')}
                <div class="add-card" data-style="${style}">
                    <button class="add-home-btn">
                        <i class="fas fa-plus"></i>
                        <span>Add New Home</span>
                    </button>
                </div>
            </div>
        `;
        return section;
    }

    createHomeCard(home) {
        return `
            <div class="home-card" id="${home.id}">
                <div class="card-image">
                    <img src="${home.image}" alt="${home.title}">
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${home.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${home.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${home.title}</h3>
                    <p>${home.description}</p>
                    <div class="features-list">
                        ${home.features.map(feature => `
                            <span class="feature-tag">${feature}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    initializeControls() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-home-btn')) {
                const style = e.target.closest('.add-card').dataset.style;
                this.showAddHomeModal(style);
            }
            if (e.target.closest('.edit-btn')) {
                const id = e.target.closest('.edit-btn').dataset.id;
                this.showEditHomeModal(id);
            }
            if (e.target.closest('.delete-btn')) {
                const id = e.target.closest('.delete-btn').dataset.id;
                this.deleteHome(id);
            }
        });
    }

    showAddHomeModal(style) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New ${style.charAt(0).toUpperCase() + style.slice(1)} Style Home</h2>
                <form id="addHomeForm">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" required>
                    </div>
                    <div class="form-group">
                        <label>Features (comma-separated)</label>
                        <input type="text" name="features" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#addHomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newHome = {
                id: `${style}-${Date.now()}`,
                title: formData.get('title'),
                description: formData.get('description'),
                image: formData.get('image'),
                features: formData.get('features').split(',').map(f => f.trim())
            };

            this.styles[style].push(newHome);
            this.updateGallery();
            modal.remove();
        });
    }

    showEditHomeModal(id) {
        const style = id.split('-')[0];
        const home = this.styles[style].find(h => h.id === id);
        if (!home) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Home</h2>
                <form id="editHomeForm">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value="${home.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required>${home.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image" value="${home.image}" required>
                    </div>
                    <div class="form-group">
                        <label>Features (comma-separated)</label>
                        <input type="text" name="features" value="${home.features.join(', ')}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#editHomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedHome = {
                ...home,
                title: formData.get('title'),
                description: formData.get('description'),
                image: formData.get('image'),
                features: formData.get('features').split(',').map(f => f.trim())
            };

            const index = this.styles[style].findIndex(h => h.id === id);
            this.styles[style][index] = updatedHome;
            this.updateGallery();
            modal.remove();
        });
    }

    deleteHome(id) {
        if (!confirm('Are you sure you want to delete this home?')) return;

        const style = id.split('-')[0];
        this.styles[style] = this.styles[style].filter(home => home.id !== id);
        this.updateGallery();
    }

    updateGallery() {
        const container = document.querySelector('.style-gallery');
        if (!container) return;

        container.innerHTML = '';
        Object.entries(this.styles).forEach(([style, homes]) => {
            const section = this.createStyleSection(style, homes);
            container.appendChild(section);
        });
    }

    showSlide(index) {
        // Handle wrapping
        if (index >= this.totalSlides) {
            index = 0;
        } else if (index < 0) {
            index = this.totalSlides - 1;
        }

        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.remove('active');
        }

        // Add active class to new slide and dot
        this.slides[index].classList.add('active');
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        // Update current slide index
        this.currentSlide = index;
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => {
            this.showSlide(this.currentSlide + 1);
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize Gallery Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
}); 