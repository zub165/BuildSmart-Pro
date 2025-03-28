class AnimationManager {
    constructor() {
        this.initializeAnimations();
    }

    initializeAnimations() {
        // Construction team animation
        lottie.loadAnimation({
            container: document.getElementById('construction-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_5n8yfkac.json', // Construction team animation
            name: 'construction-team'
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
}); 