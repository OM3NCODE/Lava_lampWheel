class LavaLamp {
    constructor(lampCanvasId, waxCanvasId, onWinnerSelected) {
        this.canvas = document.getElementById(lampCanvasId);
        this.ctx = this.canvas.getContext('2d');
        this.waxCanvas = document.getElementById(waxCanvasId);
        this.waxCtx = this.waxCanvas.getContext('2d');
        this.onWinnerSelected = onWinnerSelected;
        
        // Configuration
        this.baseWidth = 320;
        this.height = 520;
        
        // Balanced physics constants for slow, organic bubble floating
        this.gravity = 0.12;
        this.baseBuoyancy = 0.26;
        this.drag = 0.98;
        this.elasticity = 0.5; 
        this.overlapDampening = 0.05; 
        
        this.bubbles = [];
        this.waxBlobs = []; // background green wax blobs
        this.particles = []; // tiny background rising particles
        
        this.state = 'idle'; // 'idle', 'shaking', 'selecting', 'showcase'
        this.winnerBubble = null;
        this.shakeTimer = 0;
        this.shakeDuration = 3000;
        
        this.lastTime = 0;
        this.animationFrameId = null;
        this.heatIndex = 1.0; 
        
        this.initCanvas();
        this.initParticles();
        this.initWaxBlobs();
    }

    initCanvas() {
        const dpr = window.devicePixelRatio || 1;
        
        // Scale both canvases for high DPI sharpness
        this.canvas.width = this.baseWidth * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = `${this.baseWidth}px`;
        this.canvas.style.height = `${this.height}px`;

        this.waxCanvas.width = this.baseWidth * dpr;
        this.waxCanvas.height = this.height * dpr;
        this.waxCtx.scale(dpr, dpr);
        this.waxCanvas.style.width = `${this.baseWidth}px`;
        this.waxCanvas.style.height = `${this.height}px`;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: 80 + Math.random() * (this.baseWidth - 160),
                y: 100 + Math.random() * 280,
                radius: 2 + Math.random() * 3,
                speed: 0.8 + Math.random() * 1.0, // faster particles
                opacity: 0.4 + Math.random() * 0.4
            });
        }
    }

    initWaxBlobs() {
        this.waxBlobs = [];
        // 7 background wax blobs that merge to form wax currents
        for (let i = 0; i < 7; i++) {
            const r = 35 + Math.random() * 25;
            const spawnY = 100 + Math.random() * 260;
            const bounds = this.getBoundaries(spawnY);
            const spawnX = bounds.left + r + Math.random() * (bounds.right - bounds.left - r * 2);
            
            this.waxBlobs.push({
                x: isNaN(spawnX) ? this.baseWidth / 2 : spawnX,
                y: spawnY,
                vx: (Math.random() - 0.5) * 1.8,
                vy: (Math.random() - 0.5) * 1.8,
                radius: r,
                temperature: Math.random() * 0.8 + 0.1,
                opacity: 1.0
            });
        }
    }

    getWidthAtY(y) {
        const topY = 60;
        const bottomY = 420;
        const t = Math.max(0, Math.min(1, (y - topY) / (bottomY - topY)));
        const topWidth = 88;
        const bottomWidth = 196;
        return topWidth + (bottomWidth - topWidth) * t;
    }

    getBoundaries(y) {
        const width = this.getWidthAtY(y);
        const center = this.baseWidth / 2;
        return {
            left: center - width / 2,
            right: center + width / 2
        };
    }

    setItems(items) {
        const activeItems = items.filter(item => item.active);
        const newBubbles = [];
        
        activeItems.forEach(item => {
            const existing = this.bubbles.find(b => b.id === item.id);
            const itemVal = item.value || item.text || '';
            if (existing) {
                existing.label = itemVal;
                existing.image = item.image;
                existing.color = item.color || '#38bdf8';
                existing.trait_type = item.trait_type || 'Helmets';
                newBubbles.push(existing);
            } else {
                const radius = this.calculateBubbleRadius(itemVal);
                const spawnY = 410 - radius - Math.random() * 40;
                const bounds = this.getBoundaries(spawnY);
                const spawnX = bounds.left + radius + Math.random() * (bounds.right - bounds.left - radius * 2);
                
                newBubbles.push({
                    id: item.id,
                    label: itemVal,
                    image: item.image,
                    color: item.color || '#38bdf8',
                    trait_type: item.trait_type || 'Helmets',
                    x: isNaN(spawnX) ? this.baseWidth / 2 : spawnX,
                    y: spawnY,
                    vx: (Math.random() - 0.5) * 2.5, // Faster spawn speed
                    vy: (Math.random() - 0.5) * 2.5,
                    radius: radius,
                    temperature: 0.3 + Math.random() * 0.5,
                    scale: 1.0,
                    opacity: 1.0,
                    isWinner: false
                });
            }
        });
        
        this.bubbles = newBubbles;
    }

    calculateBubbleRadius(text) {
        const baseRad = 12; // Much smaller bubbles (10px to 15px radius)
        const textLen = text.length;
        if (textLen <= 4) return baseRad - 2;
        if (textLen <= 8) return baseRad;
        if (textLen <= 14) return baseRad + 2;
        return baseRad + 3;
    }

    startSpin() {
        if (this.bubbles.length === 0) return;
        if (this.state !== 'idle') return;
        
        this.state = 'shaking';
        this.shakeTimer = Date.now();
        this.heatIndex = 4.5; // Max thermal speed
        
        const container = this.canvas.parentElement;
        if (container) {
            container.classList.add('shake-lamp');
        }
        
        if (window.LavaAudio) {
            window.LavaAudio.startSimmer();
        }
    }

    update(dt) {
        this.updateParticles();
        this.updateWaxBlobs(dt);

        if (this.state === 'shaking') {
            const elapsed = Date.now() - this.shakeTimer;
            if (elapsed >= this.shakeDuration) {
                this.state = 'selecting';
                this.heatIndex = 1.0;
                
                const container = this.canvas.parentElement;
                if (container) {
                    container.classList.remove('shake-lamp');
                }
                
                if (window.LavaAudio) {
                    window.LavaAudio.stopSimmer();
                }

                // Pick winner
                const randomIndex = Math.floor(Math.random() * this.bubbles.length);
                this.winnerBubble = this.bubbles[randomIndex];
                this.winnerBubble.isWinner = true;
            } else {
                // High agitation speeds
                this.bubbles.forEach(b => {
                    b.vx += (Math.random() - 0.5) * 2.8;
                    b.vy += (Math.random() - 0.5) * 2.8 - 0.5;
                    b.temperature = Math.min(1.4, b.temperature + 0.15);
                });
                this.waxBlobs.forEach(wb => {
                    wb.vx += (Math.random() - 0.5) * 2.2;
                    wb.vy += (Math.random() - 0.5) * 2.2 - 0.4;
                    wb.temperature = Math.min(1.4, wb.temperature + 0.15);
                });
            }
        }

        // 1. Foreground Bubbles - Buoyancy & Physics
        this.bubbles.forEach(b => {
            const bottomThreshold = 420 - 50;
            const topThreshold = 60 + 35;

            if (this.state === 'selecting' && b === this.winnerBubble) {
                b.temperature = Math.min(1.6, b.temperature + 0.12);
                const targetX = this.baseWidth / 2;
                b.vx += (targetX - b.x) * 0.045; // steer faster
                b.vy -= 0.32; // float up faster
                
                if (b.y - b.radius <= 70) {
                    this.state = 'showcase';
                    b.vx = 0;
                    b.vy = 0;
                    this.triggerWinnerShowcase();
                }
            } else if (this.state === 'selecting' && b !== this.winnerBubble) {
                b.temperature = Math.max(0.0, b.temperature - 0.05);
            } else if (this.state === 'showcase') {
                if (b !== this.winnerBubble) {
                    b.temperature = Math.max(0.0, b.temperature - 0.03);
                }
            } else {
                if (b.y > bottomThreshold) {
                    b.temperature += (1.0 - b.temperature) * 0.035 * this.heatIndex;
                } else if (b.y < topThreshold) {
                    b.temperature += (0.0 - b.temperature) * 0.035 * this.heatIndex;
                } else {
                    b.temperature -= 0.002 * this.heatIndex;
                }
            }
            
            b.temperature = Math.max(0, Math.min(1.6, b.temperature));

            const forceY = (this.baseBuoyancy * b.temperature) - this.gravity;
            b.vy -= forceY;
            
            if (this.state === 'idle') {
                b.vx += (Math.random() - 0.5) * 0.16;
                b.vy += (Math.random() - 0.5) * 0.16;
            }

            b.vx *= this.drag;
            b.vy *= this.drag;
            b.x += b.vx;
            b.y += b.vy;
        });

        // 2. Bubble-to-Boundary Collisions
        this.bubbles.forEach(b => {
            const bounds = this.getBoundaries(b.y);
            const r = b.radius;
            
            if (this.state === 'showcase' && b === this.winnerBubble) {
                b.y -= 2.8; // rise faster
                return;
            }

            if (b.x - r < bounds.left) {
                b.x = bounds.left + r;
                b.vx = -b.vx * this.elasticity;
            } else if (b.x + r > bounds.right) {
                b.x = bounds.right - r;
                b.vx = -b.vx * this.elasticity;
            }

            const topBoundary = 60;
            if (b.y - r < topBoundary) {
                b.y = topBoundary + r;
                b.vy = -b.vy * this.elasticity;
            }

            const bottomBoundary = 415;
            if (b.y + r > bottomBoundary) {
                b.y = bottomBoundary - r;
                b.vy = -b.vy * this.elasticity;
                if (Math.abs(b.vx) < 0.1) {
                    b.vx += (Math.random() - 0.5) * 0.5;
                }
            }
        });

        // 3. Bubble-to-Bubble Collisions (bouncy glass marbles)
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = i + 1; j < this.bubbles.length; j++) {
                const b1 = this.bubbles[i];
                const b2 = this.bubbles[j];

                if (this.state === 'selecting' && (b1.isWinner || b2.isWinner)) {
                    continue; 
                }

                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const minDistance = (b1.radius + b2.radius) * (1 - this.overlapDampening);

                if (dist < minDistance && dist > 0) {
                    const overlap = minDistance - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    const m1 = b1.radius * b1.radius;
                    const m2 = b2.radius * b2.radius;
                    const totalMass = m1 + m2;

                    b1.x -= nx * overlap * (m2 / totalMass);
                    b1.y -= ny * overlap * (m2 / totalMass);
                    b2.x += nx * overlap * (m1 / totalMass);
                    b2.y += ny * overlap * (m1 / totalMass);

                    const kx = b1.vx - b2.vx;
                    const ky = b1.vy - b2.vy;
                    const vn = kx * nx + ky * ny;

                    if (vn > 0) {
                        const impulse = (1 + this.elasticity) * vn / (1/m1 + 1/m2);
                        b1.vx -= (impulse / m1) * nx;
                        b1.vy -= (impulse / m1) * ny;
                        b2.vx += (impulse / m2) * nx;
                        b2.vy += (impulse / m2) * ny;
                    }
                }
            }
        }
    }

    updateWaxBlobs(dt) {
        this.waxBlobs.forEach(wb => {
            const bottomThreshold = 420 - 70;
            const topThreshold = 60 + 50;

            if (wb.y > bottomThreshold) {
                wb.temperature += (1.0 - wb.temperature) * 0.02 * this.heatIndex;
            } else if (wb.y < topThreshold) {
                wb.temperature += (0.0 - wb.temperature) * 0.025 * this.heatIndex;
            } else {
                wb.temperature -= 0.0015 * this.heatIndex;
            }

            wb.temperature = Math.max(0, Math.min(1.4, wb.temperature));

            const forceY = (this.baseBuoyancy * wb.temperature) - this.gravity;
            wb.vy -= forceY;
            wb.vx += (Math.random() - 0.5) * 0.05;

            wb.vx *= this.drag;
            wb.vy *= this.drag;
            wb.x += wb.vx;
            wb.y += wb.vy;

            const bounds = this.getBoundaries(wb.y);
            const r = wb.radius;

            if (wb.x - r < bounds.left) {
                wb.x = bounds.left + r;
                wb.vx = -wb.vx * 0.3;
            } else if (wb.x + r > bounds.right) {
                wb.x = bounds.right - r;
                wb.vx = -wb.vx * 0.3;
            }

            const topBoundary = 60;
            if (wb.y - r < topBoundary) {
                wb.y = topBoundary + r;
                wb.vy = -wb.vy * 0.3;
            }

            const bottomBoundary = 415;
            if (wb.y + r > bottomBoundary) {
                wb.y = bottomBoundary - r;
                wb.vy = -wb.vy * 0.3;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.y -= p.speed;
            p.x += Math.sin(p.y * 0.05) * 0.25;
            if (p.y < 60) {
                p.y = 415;
                p.x = 80 + Math.random() * (this.baseWidth - 160);
            }
        });
    }

    triggerWinnerShowcase() {
        let duration = 800;
        let start = Date.now();
        
        const fade = () => {
            const progress = (Date.now() - start) / duration;
            if (progress < 1) {
                this.bubbles.forEach(b => {
                    if (b !== this.winnerBubble) {
                        b.opacity = 1 - progress;
                    }
                });
                requestAnimationFrame(fade);
            } else {
                this.bubbles.forEach(b => {
                    if (b !== this.winnerBubble) b.opacity = 0;
                });
                
                if (this.onWinnerSelected && this.winnerBubble) {
                    this.onWinnerSelected({
                        value: this.winnerBubble.label,
                        text: this.winnerBubble.label,
                        image: this.winnerBubble.image,
                        trait_type: this.winnerBubble.trait_type || 'Helmets'
                    });
                }
            }
        };
        fade();
    }

    reset() {
        this.state = 'idle';
        if (this.winnerBubble) {
            this.winnerBubble.isWinner = false;
            this.winnerBubble = null;
        }
        this.heatIndex = 1.0;
        
        const container = this.canvas.parentElement;
        if (container) {
            container.classList.remove('shake-lamp');
        }
        
        if (window.LavaAudio) {
            window.LavaAudio.stopSimmer();
        }
        
        this.bubbles.forEach(b => {
            b.opacity = 1.0;
            b.scale = 1.0;
            b.temperature = 0.2 + Math.random() * 0.6;
            b.y = 410 - b.radius - Math.random() * 100;
            const bounds = this.getBoundaries(b.y);
            b.x = bounds.left + b.radius + Math.random() * (bounds.right - bounds.left - b.radius * 2);
            b.vx = (Math.random() - 0.5) * 1.5;
            b.vy = (Math.random() - 0.5) * 1.5;
        });
    }

    drawGlassPath(ctx) {
        ctx.beginPath();
        ctx.moveTo(116, 60);
        ctx.lineTo(204, 60);
        ctx.quadraticCurveTo(238, 240, 260, 420);
        ctx.lineTo(60, 420);
        ctx.quadraticCurveTo(82, 240, 116, 60);
        ctx.closePath();
    }

    drawCap(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(116, 60);
        ctx.lineTo(127, 15);
        ctx.lineTo(193, 15);
        ctx.lineTo(204, 60);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8'; 
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
    }

    drawBase(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(60, 420);
        ctx.bezierCurveTo(80, 452, 60, 485, 50, 515);
        ctx.lineTo(270, 515);
        ctx.bezierCurveTo(260, 485, 240, 452, 260, 420);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8'; 
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
    }

    drawKawaiiFace(ctx) {
        ctx.save();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(134, 452, 5.5, 0, Math.PI * 2);
        ctx.arc(186, 452, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.ellipse(116, 459, 8, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(204, 459, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(160, 448, 7.5, 0, Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        ctx.restore();
    }

    draw() {
        // Clear foreground canvas
        this.ctx.clearRect(0, 0, this.baseWidth, this.height);

        // Draw background wax on waxCanvas (Hardware blurred & contrasted in CSS)
        this.drawBackgroundWaxLayer();

        // Draw foreground elements on main canvas (sharp cap, base, face, and bubbles)
        this.ctx.save();
        this.drawGlassPath(this.ctx);
        this.ctx.clip();
        this.drawForegroundBubbles();
        this.drawBubbleLabels();
        this.ctx.restore();

        // Draw Cap (Blue trapezoid on top)
        this.drawCap(this.ctx);

        // Draw Base (Blue hourglass on bottom)
        this.drawBase(this.ctx);
        
        // Draw Kawaii Face on Base
        this.drawKawaiiFace(this.ctx);

        // Draw Glass Outer black border
        this.ctx.save();
        this.drawGlassPath(this.ctx);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 5;
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        this.ctx.restore();

        // Draw Glass specular highlights overlay
        this.ctx.save();
        this.drawGlassPath(this.ctx);
        this.ctx.clip();
        this.drawGlassRefractions();
        this.ctx.restore();
    }

    drawBackgroundWaxLayer() {
        // Clear wax canvas
        this.waxCtx.clearRect(0, 0, this.baseWidth, this.height);
        
        // Clip background wax to the glass path
        this.waxCtx.save();
        this.drawGlassPath(this.waxCtx);
        this.waxCtx.clip();
        
        // Fill pink fluid background
        this.waxCtx.fillStyle = '#ec4899'; 
        this.waxCtx.fillRect(0, 50, this.baseWidth, this.height - 130);

        // Draw tiny background rising particles
        this.waxCtx.fillStyle = 'rgba(74, 222, 128, 0.7)'; // solid green wax particles
        this.particles.forEach(p => {
            this.waxCtx.beginPath();
            this.waxCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.waxCtx.fill();
        });

        // Draw organic green wax blobs
        this.waxCtx.fillStyle = '#4ade80'; // Lime green solid wax blobs
        this.waxBlobs.forEach(wb => {
            this.waxCtx.beginPath();
            this.waxCtx.arc(wb.x, wb.y, wb.radius, 0, Math.PI * 2);
            this.waxCtx.fill();
        });

        this.waxCtx.restore();
    }

    drawForegroundBubbles() {
        this.bubbles.forEach(b => {
            if (b.opacity <= 0) return;
            
            this.ctx.save();
            this.ctx.globalAlpha = b.opacity;

            const x = b.x;
            const y = b.y;
            const r = b.radius * b.scale;

            // DRAW SOLID COLOR BUBBLE
            this.ctx.fillStyle = b.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fill();

            // Cartoon black outline
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3.0;
            this.ctx.stroke();

            // Shiny white crescent mark (cartoon highlight overlay)
            this.ctx.beginPath();
            this.ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.3, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawBubbleLabels() {
        this.ctx.save();
        this.ctx.fillStyle = '#000000'; // Black cartoon text label
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Solid white offset shadow for readability on solid dark bubbles
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 1.2;
        this.ctx.shadowOffsetY = 1.2;
        
        this.bubbles.forEach(b => {
            if (b.opacity <= 0) return;
            
            this.ctx.save();
            this.ctx.globalAlpha = b.opacity;

            // Compact font scaling for tiny bubbles
            let fontSize = Math.floor(b.radius * 0.38);
            fontSize = Math.max(9, Math.min(11, fontSize));
            this.ctx.font = `bold ${fontSize}px var(--font-rounded)`;

            const maxTextWidth = b.radius * 1.5;
            const textMetric = this.ctx.measureText(b.label);
            
            if (textMetric.width > maxTextWidth) {
                let truncated = b.label;
                while (this.ctx.measureText(truncated + '...').width > maxTextWidth && truncated.length > 0) {
                    truncated = truncated.slice(0, -1);
                }
                this.ctx.fillText(truncated + '...', b.x, b.y);
            } else {
                this.ctx.fillText(b.label, b.x, b.y);
            }
            
            this.ctx.restore();
        });
        
        this.ctx.restore();
    }

    drawGlassRefractions() {
        this.ctx.save();
        
        const reflectGrad = this.ctx.createLinearGradient(0, 0, this.baseWidth, 0);
        reflectGrad.addColorStop(0.08, 'rgba(255, 255, 255, 0.15)');
        reflectGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.28)');
        reflectGrad.addColorStop(0.16, 'rgba(255, 255, 255, 0.05)');
        reflectGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
        reflectGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.05)');
        reflectGrad.addColorStop(0.93, 'rgba(255, 255, 255, 0.12)');
        reflectGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.01)');
        
        this.ctx.fillStyle = reflectGrad;
        this.ctx.fillRect(0, 50, this.baseWidth, this.height - 130);

        this.ctx.restore();
    }

    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    startLoop() {
        this.lastTime = performance.now();
        const loop = (timestamp) => {
            let dt = (timestamp - this.lastTime) / 16.666;
            dt = Math.min(2.5, dt); 
            this.lastTime = timestamp;

            this.update(dt);
            this.draw();

            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    stopLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

window.LavaLamp = LavaLamp;
