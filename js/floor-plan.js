// Floor Plan Management System
class FloorPlanManager {
    constructor() {
        this.canvas = document.getElementById('floorPlanCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.rooms = [
            {
                name: 'Living',
                dimensions: { width: 200, height: 150 },
                position: { x: 300, y: 200 },
                color: '#e2e8f0',
                furniture: [
                    { type: 'sofa', x: 320, y: 220, width: 80, height: 30 },
                    { type: 'table', x: 420, y: 250, width: 40, height: 40 }
                ]
            },
            {
                name: 'Kitchen',
                dimensions: { width: 120, height: 120 },
                position: { x: 150, y: 200 },
                color: '#dcfce7',
                furniture: [
                    { type: 'counter', x: 160, y: 210, width: 100, height: 20 },
                    { type: 'stove', x: 160, y: 270, width: 30, height: 30 }
                ]
            },
            {
                name: 'Bedroom 1',
                dimensions: { width: 150, height: 130 },
                position: { x: 150, y: 50 },
                color: '#fce7f3',
                furniture: [
                    { type: 'bed', x: 170, y: 70, width: 80, height: 50 },
                    { type: 'closet', x: 260, y: 70, width: 20, height: 60 }
                ]
            },
            {
                name: 'Bedroom 2',
                dimensions: { width: 150, height: 130 },
                position: { x: 320, y: 50 },
                color: '#fce7f3',
                furniture: [
                    { type: 'bed', x: 340, y: 70, width: 80, height: 50 },
                    { type: 'closet', x: 430, y: 70, width: 20, height: 60 }
                ]
            },
            {
                name: 'Bathroom 1',
                dimensions: { width: 80, height: 80 },
                position: { x: 50, y: 50 },
                color: '#ddd6fe',
                furniture: [
                    { type: 'toilet', x: 60, y: 60, width: 20, height: 20 },
                    { type: 'sink', x: 90, y: 60, width: 20, height: 20 }
                ]
            },
            {
                name: 'Bathroom 2',
                dimensions: { width: 80, height: 80 },
                position: { x: 500, y: 50 },
                color: '#ddd6fe',
                furniture: [
                    { type: 'toilet', x: 510, y: 60, width: 20, height: 20 },
                    { type: 'sink', x: 540, y: 60, width: 20, height: 20 }
                ]
            }
        ];
        
        this.selectedRoom = null;
        this.scale = 1;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;

        // Add layout templates
        this.layoutTemplates = {
            standard: [
                { name: 'Living Room', width: 200, height: 150, x: 300, y: 200 },
                { name: 'Kitchen', width: 120, height: 120, x: 150, y: 200 },
                { name: 'Master Bedroom', width: 180, height: 150, x: 150, y: 50 },
                { name: 'Bathroom', width: 80, height: 80, x: 50, y: 50 }
            ],
            modern: [
                { name: 'Open Living', width: 250, height: 200, x: 250, y: 150 },
                { name: 'Kitchen Island', width: 150, height: 150, x: 100, y: 150 },
                { name: 'Master Suite', width: 200, height: 180, x: 150, y: 50 },
                { name: 'Guest Bath', width: 100, height: 100, x: 50, y: 50 }
            ],
            luxury: [
                { name: 'Grand Living', width: 300, height: 250, x: 300, y: 200 },
                { name: 'Gourmet Kitchen', width: 200, height: 180, x: 150, y: 200 },
                { name: 'Master Wing', width: 250, height: 200, x: 150, y: 50 },
                { name: 'Spa Bath', width: 120, height: 120, x: 50, y: 50 }
            ]
        };

        this.furnitureTemplates = {
            bedroom: [
                { type: 'Queen Bed', width: 80, height: 60 },
                { type: 'Dresser', width: 60, height: 20 },
                { type: 'Nightstand', width: 20, height: 20 },
                { type: 'Wardrobe', width: 40, height: 24 }
            ],
            bathroom: [
                { type: 'Toilet', width: 20, height: 30 },
                { type: 'Sink', width: 24, height: 22 },
                { type: 'Shower', width: 36, height: 36 },
                { type: 'Bathtub', width: 60, height: 32 }
            ],
            kitchen: [
                { type: 'Counter', width: 120, height: 24 },
                { type: 'Island', width: 60, height: 40 },
                { type: 'Stove', width: 30, height: 30 },
                { type: 'Fridge', width: 36, height: 36 }
            ],
            living: [
                { type: 'Sofa', width: 84, height: 36 },
                { type: 'Coffee Table', width: 48, height: 24 },
                { type: 'TV Stand', width: 60, height: 20 },
                { type: 'Armchair', width: 30, height: 30 }
            ]
        };

        this.initializeCanvas();
        this.addEventListeners();
        this.draw();

        this.initializeLayoutButtons();
        this.initializeRoomTypeButtons();
        this.initializeFurnitureButtons();
        this.initializeSaveExport();
    }

    initializeCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Set initial transformation
        this.ctx.translate(50, 50);
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));

        // Add toolbar event listeners
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.1));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.9));
        document.getElementById('resetView')?.addEventListener('click', () => this.resetView());
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale;
        const y = (e.clientY - rect.top) / this.scale;

        this.isDragging = true;
        this.lastX = x;
        this.lastY = y;

        // Check if a room was clicked
        this.selectedRoom = this.rooms.find(room => {
            return x >= room.position.x && x <= room.position.x + room.dimensions.width &&
                   y >= room.position.y && y <= room.position.y + room.dimensions.height;
        });

        this.draw();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale;
        const y = (e.clientY - rect.top) / this.scale;

        const dx = x - this.lastX;
        const dy = y - this.lastY;

        if (this.selectedRoom) {
            // Move selected room
            this.selectedRoom.position.x += dx;
            this.selectedRoom.position.y += dy;
            
            // Update furniture positions
            this.selectedRoom.furniture.forEach(item => {
                item.x += dx;
                item.y += dy;
            });
        } else {
            // Pan view
            this.ctx.translate(dx, dy);
        }

        this.lastX = x;
        this.lastY = y;
        this.draw();
    }

    handleMouseUp() {
        this.isDragging = false;
        this.selectedRoom = null;
    }

    handleWheel(e) {
        e.preventDefault();
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(scaleFactor);
    }

    zoom(factor) {
        this.scale *= factor;
        this.ctx.scale(factor, factor);
        this.draw();
    }

    resetView() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(50, 50);
        this.scale = 1;
        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        // Draw grid
        this.drawGrid();

        // Draw rooms
        this.rooms.forEach(room => {
            this.drawRoom(room);
        });

        // Draw measurements
        this.drawMeasurements();
    }

    drawGrid() {
        const gridSize = 20;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < w; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
            this.ctx.stroke();
        }

        for (let y = 0; y < h; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
            this.ctx.stroke();
        }
    }

    drawRoom(room) {
        // Draw room background
        this.ctx.fillStyle = room.color;
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(room.position.x, room.position.y, room.dimensions.width, room.dimensions.height);
        this.ctx.strokeRect(room.position.x, room.position.y, room.dimensions.width, room.dimensions.height);

        // Draw room name
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = '14px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(room.name, 
            room.position.x + room.dimensions.width / 2,
            room.position.y + room.dimensions.height / 2);

        // Draw furniture
        room.furniture.forEach(item => {
            this.drawFurniture(item);
        });
    }

    drawFurniture(item) {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(item.x, item.y, item.width, item.height);
        
        // Draw furniture label
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = '10px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.type,
            item.x + item.width / 2,
            item.y + item.height / 2);
    }

    drawMeasurements() {
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '12px Poppins';
        
        this.rooms.forEach(room => {
            // Draw width measurement
            this.ctx.fillText(`${room.dimensions.width}cm`,
                room.position.x + room.dimensions.width / 2,
                room.position.y - 5);
            
            // Draw height measurement
            this.ctx.fillText(`${room.dimensions.height}cm`,
                room.position.x - 5,
                room.position.y + room.dimensions.height / 2);
        });
    }

    addRoom(name, width, height, x, y) {
        const room = {
            name,
            dimensions: { width, height },
            position: { x, y },
            color: '#e2e8f0',
            furniture: []
        };
        this.rooms.push(room);
        this.draw();
    }

    addFurniture(roomName, type, x, y, width, height) {
        const room = this.rooms.find(r => r.name === roomName);
        if (room) {
            room.furniture.push({ type, x, y, width, height });
            this.draw();
        }
    }

    initializeLayoutButtons() {
        const layoutTypes = ['standard', 'modern', 'luxury', 'custom'];
        layoutTypes.forEach(type => {
            const button = document.querySelector(`[data-layout="${type}"]`);
            if (button) {
                button.addEventListener('click', () => this.selectLayout(type));
            }
        });
    }

    selectLayout(type) {
        if (type === 'custom') {
            this.clearCanvas();
            return;
        }

        const template = this.layoutTemplates[type];
        if (template) {
            this.clearCanvas();
            template.forEach(room => {
                this.addRoom(room.name, room.width, room.height, room.x, room.y);
            });
        }
    }

    initializeRoomTypeButtons() {
        const roomTypes = ['bedroom', 'bathroom', 'kitchen', 'living'];
        roomTypes.forEach(type => {
            const button = document.querySelector(`[data-room-type="${type}"]`);
            if (button) {
                button.addEventListener('click', () => this.setActiveRoomType(type));
            }
        });
    }

    setActiveRoomType(type) {
        this.activeRoomType = type;
        // Update UI to show selected room type
        document.querySelectorAll('[data-room-type]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-room-type="${type}"]`)?.classList.add('active');
    }

    initializeFurnitureButtons() {
        Object.keys(this.furnitureTemplates).forEach(roomType => {
            this.furnitureTemplates[roomType].forEach(furniture => {
                const button = document.createElement('button');
                button.className = 'furniture-btn';
                button.setAttribute('data-furniture-type', furniture.type);
                button.innerHTML = `<i class="fas fa-couch"></i> ${furniture.type}`;
                button.addEventListener('click', () => this.addFurnitureToSelectedRoom(furniture));
                document.querySelector('.furniture-options')?.appendChild(button);
            });
        });
    }

    addFurnitureToSelectedRoom(furniture) {
        if (!this.selectedRoom) return;
        
        const room = this.selectedRoom;
        const x = room.position.x + 20;
        const y = room.position.y + 20;
        
        this.addFurniture(room.name, furniture.type, x, y, furniture.width, furniture.height);
    }

    initializeSaveExport() {
        document.getElementById('saveDraft')?.addEventListener('click', () => this.saveDraft());
        document.getElementById('sharePlan')?.addEventListener('click', () => this.sharePlan());
        document.getElementById('exportPlan')?.addEventListener('click', () => this.exportPlan());
    }

    saveDraft() {
        const floorPlanData = {
            rooms: this.rooms,
            scale: this.scale,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('floorPlanDraft', JSON.stringify(floorPlanData));
        this.showNotification('Draft saved successfully!');
    }

    sharePlan() {
        const shareData = {
            title: 'Floor Plan',
            text: 'Check out my floor plan design!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => this.showNotification('Plan shared successfully!'))
                .catch(error => console.error('Error sharing:', error));
        } else {
            this.showNotification('Sharing is not supported on this device');
        }
    }

    exportPlan() {
        const dataUrl = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'floor-plan.png';
        link.href = dataUrl;
        link.click();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    clearCanvas() {
        this.rooms = [];
        this.selectedRoom = null;
        this.draw();
    }

    updateDimensions(width, length) {
        if (!this.selectedRoom) return;
        
        this.selectedRoom.dimensions.width = parseInt(width) || this.selectedRoom.dimensions.width;
        this.selectedRoom.dimensions.height = parseInt(length) || this.selectedRoom.dimensions.height;
        this.draw();
        this.updateAreaCalculation();
    }

    updateAreaCalculation() {
        const areaInput = document.querySelector('input[name="area"]');
        if (!this.selectedRoom || !areaInput) return;
        
        const area = this.selectedRoom.dimensions.width * this.selectedRoom.dimensions.height;
        areaInput.value = area.toFixed(2);
    }
}

// Initialize Floor Plan Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.floorPlanManager = new FloorPlanManager();
}); 