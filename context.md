# BuildSmart Pro - Technical Documentation

## Application Structure

### Core Components

1. **Gallery Management System**
   - Location: `js/gallery-manager.js`
   - Purpose: Manages the display and interaction with different home styles
   - Key Features:
     - Slideshow functionality
     - Edit/Replace/Delete operations
     - Style categorization
     - Image management

2. **Phase Management System**
   - Location: `js/phase-manager.js`
   - Purpose: Handles construction phases and progress tracking
   - Key Features:
     - Phase initialization
     - Progress tracking
     - Cost estimation
     - Checklist management

3. **Animation System**
   - Location: `js/animation-manager.js`
   - Purpose: Manages UI animations and transitions
   - Key Features:
     - Lottie animations
     - Transition effects
     - Interactive elements

### File Structure and Purpose

```
BuildSmart Pro/
├── assets/                 # Static assets
│   └── images/            # Image resources
├── css/                   # Styling
│   ├── floor-plan.css     # Floor plan layout styles
│   ├── gallery.css        # Gallery component styles
│   ├── guide.css          # Construction guide styles
│   ├── home.css          # Home page styles
│   ├── navigation.css    # Navigation menu styles
│   └── style.css         # Global styles
├── js/                    # JavaScript functionality
│   ├── animation-manager.js  # Animation control
│   ├── custom-steps.js      # Custom step definitions
│   ├── floor-plan.js        # Floor plan functionality
│   ├── gallery-manager.js   # Gallery management
│   ├── main.js             # Main application logic
│   ├── navigation.js       # Navigation handling
│   ├── phase-manager.js    # Phase management
│   └── tabs.js            # Tab functionality
├── pages/                 # HTML pages
└── translations/          # Localization files
```

## Key Functions Documentation

### Gallery Manager Functions

\`\`\`javascript
class GalleryManager {
    // Initializes the gallery system
    constructor()
    
    // Sets up gallery event listeners and initial state
    initializeGallery()
    
    // Creates a section for a specific architectural style
    createStyleSection(style, homes)
    
    // Creates a card for an individual home
    createHomeCard(home)
    
    // Sets up control button event listeners
    initializeControls()
    
    // Displays modal for adding new homes
    showAddHomeModal(style)
    
    // Displays modal for editing existing homes
    showEditHomeModal(id)
    
    // Handles home deletion
    deleteHome(id)
    
    // Updates gallery display
    updateGallery()
    
    // Controls slide display
    showSlide(index)
    
    // Handles slide editing
    editSlide(slide)
    
    // Handles image replacement
    replaceImage(slide)
    
    // Handles slide deletion
    deleteSlide(slide)
    
    // Controls slideshow autoplay
    startAutoplay()
    stopAutoplay()
}
\`\`\`

### Phase Manager Functions

\`\`\`javascript
class PhaseManager {
    // Initializes the phase management system
    constructor()
    
    // Shows current phase information
    showPhase(phaseId)
    
    // Updates progress tracking
    updateProgress()
    
    // Manages phase transitions
    transitionToPhase(nextPhase)
    
    // Validates phase completion
    validatePhaseCompletion()
    
    // Updates cost estimates
    updateCostEstimate()
    
    // Manages checklists
    updateChecklist()
}
\`\`\`

### Animation Manager Functions

\`\`\`javascript
class AnimationManager {
    // Initializes animation system
    constructor()
    
    // Sets up Lottie animations
    initializeAnimations()
    
    // Controls animation playback
    playAnimation(animationId)
    pauseAnimation(animationId)
    stopAnimation(animationId)
}
\`\`\`

## Workflow

1. **User Journey**
   - Home page exploration
   - Style gallery navigation
   - Construction phase management
   - Cost estimation

2. **Gallery Management**
   - Browse architectural styles
   - View detailed information
   - Edit/Replace/Delete functionality
   - Add new styles

3. **Construction Management**
   - Phase initialization
   - Progress tracking
   - Cost estimation
   - Checklist completion

4. **Animation Integration**
   - UI feedback
   - Transition effects
   - Interactive elements
   - Loading states

## Event Flow

1. **Gallery Events**
   ```
   User Action → Event Listener → Gallery Manager → DOM Update
   ```

2. **Phase Management**
   ```
   Phase Selection → Validation → Progress Update → UI Refresh
   ```

3. **Animation Sequence**
   ```
   Trigger Event → Animation Manager → Playback → Completion Handler
   ```

## State Management

- Gallery state managed through GalleryManager class
- Phase progress tracked in PhaseManager
- UI state handled by individual components
- Persistent storage through localStorage

## Error Handling

- Input validation in forms
- Image loading fallbacks
- Phase transition validation
- Network request error handling

## Performance Considerations

- Lazy loading of images
- Efficient DOM updates
- Animation optimization
- Resource caching

## Future Enhancements

1. **Gallery System**
   - Advanced filtering
   - Search functionality
   - More architectural styles
   - 3D previews

2. **Phase Management**
   - Custom phase creation
   - Timeline visualization
   - Resource allocation
   - Contractor integration

3. **Animation System**
   - More interactive elements
   - Performance optimization
   - Custom animation paths
   - Gesture controls 