// Kawaii Blushing Bubble SVG for fallback custom options
const FALLBACK_BUBBLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%234ade80" stroke="%23000000" stroke-width="4"/><circle cx="40" cy="42" r="5" fill="%23000000"/><circle cx="60" cy="42" r="5" fill="%23000000"/><ellipse cx="32" cy="50" rx="6" ry="4" fill="%23fb7185"/><ellipse cx="68" cy="50" rx="6" ry="4" fill="%23fb7185"/><path d="M 44 56 Q 50 62 56 56" stroke="%23000000" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;

const NEON_COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#14b8a6'];

class LavaSelectorApp {
    constructor() {
        this.items = [];
        this.history = [];
        
        // Dom Elements
        this.itemInput = document.getElementById('itemInput');
        this.itemTypeInput = document.getElementById('itemTypeInput');
        this.addItemBtn = document.getElementById('addItemBtn');
        this.itemList = document.getElementById('itemList');
        this.itemCount = document.getElementById('itemCount');
        this.spinBtn = document.getElementById('spinBtn');
        this.soundSwitch = document.getElementById('soundSwitch');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.speedSlider = document.getElementById('speedSlider');
        this.historyList = document.getElementById('historyList');
        
        // Collapsible Sidebar Elements
        this.sidebar = document.getElementById('sidebar');
        this.drawerToggleTab = document.getElementById('drawerToggleTab');
        this.toggleArrow = document.getElementById('toggleArrow');
        
        // Modal Overlay Elements
        this.resultOverlay = document.getElementById('resultOverlay');
        this.winnerText = document.getElementById('winnerText');
        this.winnerTraitImage = document.getElementById('winnerTraitImage');
        this.closeResultBtn = document.getElementById('closeResultBtn');
        this.baseGlow = document.getElementById('baseGlow');
        
        // Confetti Properties
        this.confettiCanvas = document.getElementById('confettiCanvas');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        this.confettiParticles = [];
        this.confettiActive = false;
        
        this.lamp = null;
        
        this.init();
    }

    init() {
        this.loadState();
        
        // Initialize Lava Lamp physics engine
        this.lamp = new LavaLamp('lampCanvas', 'waxCanvas', (winner) => this.handleWinner(winner));
        this.lamp.setItems(this.items);
        this.lamp.startLoop();
        
        this.applySettings();
        this.bindEvents();
        
        this.renderItems();
        this.renderHistory();
        
        // Check window viewport size to start collapsed on mobile, open on desktop
        if (window.innerWidth <= 1024) {
            this.setSidebarCollapsed(true);
        }
    }

    loadState() {
        // Load options
        const storedItems = localStorage.getItem('lava_selector_traits_v3');
        if (storedItems) {
            try {
                this.items = JSON.parse(storedItems).map(item => {
                    const val = item.value || item.text || '';
                    return {
                        id: item.id || (Date.now().toString() + Math.random().toString(36).substr(2, 5)),
                        value: String(val).trim(),
                        color: item.color || '#38bdf8',
                        image: item.image || '',
                        trait_type: item.trait_type || 'Helmets',
                        active: item.active !== false
                    };
                }).filter(item => item.value && item.value !== 'undefined' && item.value !== 'null');
                
                if (this.items.length === 0) {
                    this.items = JSON.parse(JSON.stringify(PRESETS.char_traits));
                }
            } catch (e) {
                this.items = JSON.parse(JSON.stringify(PRESETS.char_traits));
            }
        } else {
            // Load default traits
            this.items = JSON.parse(JSON.stringify(PRESETS.char_traits));
        }

        // Load History
        const storedHistory = localStorage.getItem('lava_selector_trait_history_v3');
        if (storedHistory) {
            try {
                this.history = JSON.parse(storedHistory);
            } catch (e) {
                this.history = [];
            }
        }

        // Settings config
        const storedSound = localStorage.getItem('lava_selector_sound');
        if (storedSound !== null) {
            this.soundSwitch.checked = storedSound === 'true';
        }
        
        const storedVol = localStorage.getItem('lava_selector_volume');
        if (storedVol !== null) {
            this.volumeSlider.value = storedVol;
        }

        const storedSpeed = localStorage.getItem('lava_selector_speed');
        if (storedSpeed !== null) {
            this.speedSlider.value = storedSpeed;
        }

        const storedWebhook = localStorage.getItem('lava_selector_webhook_url');
        const webhookUrlInput = document.getElementById('webhookUrlInput');
        if (storedWebhook !== null && webhookUrlInput) {
            webhookUrlInput.value = storedWebhook;
        }
    }

    saveState() {
        localStorage.setItem('lava_selector_traits_v3', JSON.stringify(this.items));
        localStorage.setItem('lava_selector_trait_history_v3', JSON.stringify(this.history));
    }

    bindEvents() {
        // Collapsible Sidebar Drawer Trigger
        this.drawerToggleTab.addEventListener('click', () => {
            window.LavaAudio.playClick();
            const isCollapsed = !this.sidebar.classList.contains('collapsed');
            this.setSidebarCollapsed(isCollapsed);
        });

        // Add Option trigger
        this.addItemBtn.addEventListener('click', () => this.addItem());
        this.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        if (this.itemTypeInput) {
            this.itemTypeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addItem();
            });
        }
        
        // Sound and volume controls
        this.soundSwitch.addEventListener('change', (e) => {
            window.LavaAudio.setEnabled(e.target.checked);
            localStorage.setItem('lava_selector_sound', e.target.checked);
            window.LavaAudio.playClick();
        });

        this.volumeSlider.addEventListener('input', (e) => {
            window.LavaAudio.setVolume(parseFloat(e.target.value));
            localStorage.setItem('lava_selector_volume', e.target.value);
        });
        this.volumeSlider.addEventListener('change', () => {
            window.LavaAudio.playClick();
        });

        this.speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.lamp.drag = 0.99 - (0.01 * speed);
            this.lamp.baseBuoyancy = 0.12 + (0.14 * speed);
            localStorage.setItem('lava_selector_speed', e.target.value);
        });

        const webhookUrlInput = document.getElementById('webhookUrlInput');
        if (webhookUrlInput) {
            webhookUrlInput.addEventListener('input', (e) => {
                localStorage.setItem('lava_selector_webhook_url', e.target.value.trim());
            });
        }

        // Agitate/Spin Button
        this.spinBtn.addEventListener('click', () => {
            const tokenAmountInput = document.getElementById('tokenAmountInput');
            const tokenAmountVal = tokenAmountInput ? tokenAmountInput.value.trim() : '';
            if (!tokenAmountVal || isNaN(tokenAmountVal) || parseInt(tokenAmountVal) <= 0) {
                alert("Please enter a valid giveaway prize token amount (> 0) before agitating the lamp!");
                if (tokenAmountInput) tokenAmountInput.focus();
                return;
            }
            
            const activeCount = this.items.filter(item => item.active).length;
            if (activeCount < 1) {
                alert("Please enable at least 1 trait to agitate the lamp!");
                return;
            }
            
            this.currentPrizeTokens = parseInt(tokenAmountVal);
            
            window.LavaAudio.playClick();
            
            this.spinBtn.disabled = true;
            this.disableItemListActions(true);
            this.lamp.startSpin();
        });

        // Presets cards
        document.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', (e) => {
                window.LavaAudio.playClick();
                const presetKey = e.currentTarget.getAttribute('data-preset');
                if (PRESETS[presetKey]) {
                    this.items = JSON.parse(JSON.stringify(PRESETS[presetKey]));
                    this.saveState();
                    this.renderItems();
                    this.lamp.setItems(this.items);
                }
            });
        });

        // Close Result Modal
        this.closeResultBtn.addEventListener('click', () => {
            window.LavaAudio.playClick();
            
            // Webhook dispatch logic
            const webhookUrl = localStorage.getItem('lava_selector_webhook_url');
            if (webhookUrl && webhookUrl.trim() !== '') {
                 const payload = {
                    value: this.winnerText.textContent,
                    trait_type: this.lastWinnerTraitType || 'Helmets',
                    amount: this.currentPrizeTokens || 0
                 };
                
                console.log('Sending webhook trigger to:', webhookUrl);
                console.log('Webhook Payload:', JSON.stringify(payload, null, 2));
                
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => {
                    console.log('Webhook dispatch response status:', res.status);
                })
                .catch(err => {
                    console.error('Webhook dispatch failed:', err);
                });
            } else {
                console.log('No Webhook URL configured. Skipping webhook dispatch.');
            }

            this.resultOverlay.classList.remove('active');
            this.confettiActive = false;
            this.lamp.reset();
            
            this.spinBtn.disabled = false;
            this.disableItemListActions(false);
        });

        // Resize handler for Confetti
        window.addEventListener('resize', () => {
            if (this.confettiActive) {
                this.resizeConfettiCanvas();
            }
        });
    }

    setSidebarCollapsed(collapsed) {
        const appContainer = document.querySelector('.app-container');
        if (collapsed) {
            this.sidebar.classList.add('collapsed');
            this.toggleArrow.style.transform = 'rotate(180deg)';
            appContainer.classList.add('sidebar-collapsed-state');
        } else {
            this.sidebar.classList.remove('collapsed');
            this.toggleArrow.style.transform = 'rotate(0deg)';
            appContainer.classList.remove('sidebar-collapsed-state');
        }
    }

    applySettings() {
        window.LavaAudio.setEnabled(this.soundSwitch.checked);
        window.LavaAudio.setVolume(parseFloat(this.volumeSlider.value));

        const speed = parseFloat(this.speedSlider.value);
        this.lamp.drag = 0.99 - (0.01 * speed);
        this.lamp.baseBuoyancy = 0.12 + (0.14 * speed);
    }

    addItem() {
        const text = this.itemInput.value.trim();
        if (!text) return;

        const typeInput = this.itemTypeInput;
        const traitType = typeInput ? typeInput.value.trim() || 'Helmets' : 'Helmets';

        window.LavaAudio.playClick();
        
        const newItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            value: text,
            color: '#4ade80', // always green wax
            image: '', // custom text item has no custom asset image
            trait_type: traitType,
            active: true
        };

        this.items.push(newItem);
        this.saveState();
        this.renderItems();
        this.lamp.setItems(this.items);
        
        this.itemInput.value = '';
        if (typeInput) typeInput.value = '';
        this.itemInput.focus();
    }

    deleteItem(id) {
        window.LavaAudio.playClick();
        this.items = this.items.filter(item => item.id !== id);
        this.saveState();
        this.renderItems();
        this.lamp.setItems(this.items);
    }

    toggleItemActive(id) {
        window.LavaAudio.playClick();
        this.items = this.items.map(item => {
            if (item.id === id) {
                return { ...item, active: !item.active };
            }
            return item;
        });
        this.saveState();
        this.renderItems();
        this.lamp.setItems(this.items);
    }

    disableItemListActions(disabled) {
        const actionButtons = this.itemList.querySelectorAll('.action-btn, input[type="checkbox"]');
        actionButtons.forEach(btn => btn.disabled = disabled);
        this.addItemBtn.disabled = disabled;
        this.itemInput.disabled = disabled;
        if (this.itemTypeInput) this.itemTypeInput.disabled = disabled;
        
        this.itemList.style.opacity = disabled ? '0.5' : '1.0';
        this.itemList.style.pointerEvents = disabled ? 'none' : 'auto';
    }

    renderItems() {
        this.itemList.innerHTML = '';
        this.itemCount.textContent = this.items.length;

        if (this.items.length === 0) {
            this.itemList.innerHTML = `
                <div class="history-item" style="color: var(--text-muted); justify-content: center; border: none; background: none; text-align: center; padding: 20px 0;">
                    No traits active. Select a preset below!
                </div>
            `;
            return;
        }

        this.items.forEach(item => {
            const row = document.createElement('div');
            row.className = `item-row ${!item.active ? 'inactive' : ''}`;

            const typeText = item.trait_type ? ` <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-left: 4px;">(${item.trait_type})</span>` : '';
            row.innerHTML = `
                <input type="checkbox" ${item.active ? 'checked' : ''} style="cursor: pointer; accent-color: var(--lamp-blue);" title="Toggle active status">
                <span class="item-color-dot" style="background-color: var(--lamp-wax);"></span>
                <span class="item-text" title="${item.value}">${item.value}${typeText}</span>
                <div class="item-actions">
                    <button class="action-btn delete-btn" title="Delete Trait">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            row.querySelector('input[type="checkbox"]').addEventListener('change', () => this.toggleItemActive(item.id));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deleteItem(item.id));

            this.itemList.appendChild(row);
        });
    }

    renderHistory() {
        this.historyList.innerHTML = '';

        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="history-item" style="color: var(--text-muted); justify-content: center; border: none; background: none;">
                    No selections recorded yet
                </div>
            `;
            return;
        }

        const sliced = this.history.slice(-5).reverse();
        sliced.forEach(record => {
            const date = new Date(record.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const tokenText = record.tokens ? ` (+${record.tokens} Tokens)` : '';
            
            const nameText = record.value || record.text || '';
            const row = document.createElement('div');
            row.className = 'history-item';
            row.style.borderLeft = `4px solid var(--lamp-blue)`;
            
            row.innerHTML = `
                <div class="history-item-left">
                    <span class="item-color-dot" style="background-color: var(--lamp-wax); width: 8px; height: 8px;"></span>
                    <span class="history-name" style="font-weight: 600;">${nameText}${tokenText}</span>
                </div>
                <span class="history-time">${timeStr}</span>
            `;
            
            this.historyList.appendChild(row);
        });
    }

    handleWinner(winner) {
        this.lastWinnerTraitType = winner.trait_type || 'Helmets';
        const winnerValue = winner.value || winner.text || '';
        const record = {
            value: winnerValue,
            tokens: this.currentPrizeTokens || 0,
            timestamp: Date.now()
        };
        this.history.push(record);
        this.saveState();
        
        this.renderHistory();
        
        // Render victory display content
        this.winnerText.textContent = winnerValue;
        
        const subtext = document.getElementById('winnerSubtext');
        if (subtext) {
            subtext.textContent = `Equipped: ${winnerValue} + Received ${this.currentPrizeTokens || 0} Tokens!`;
        }
        
        if (winner.image) {
            this.winnerTraitImage.src = winner.image;
        } else {
            // Render custom kawaii bubble fallback
            this.winnerTraitImage.src = FALLBACK_BUBBLE_SVG;
        }
        
        // Trigger result modal
        this.resultOverlay.classList.add('active');
        
        window.LavaAudio.playChime();
        this.initConfetti();
    }

    /* CONFETTI CELEBRATION SYSTEM */
    initConfetti() {
        this.confettiActive = true;
        this.resizeConfettiCanvas();
        this.confettiParticles = [];

        for (let i = 0; i < 110; i++) {
            this.confettiParticles.push(this.createConfettiParticle());
        }

        this.animateConfetti();
    }

    resizeConfettiCanvas() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
    }

    createConfettiParticle() {
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
        const y = window.innerHeight / 2 - 20;
        const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        
        return {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5,
            color: color,
            width: 8 + Math.random() * 8,
            height: 10 + Math.random() * 10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.16,
            drag: 0.975,
            opacity: 1.0
        };
    }

    animateConfetti() {
        if (!this.confettiActive) return;

        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        
        let alive = false;
        
        this.confettiParticles.forEach(p => {
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            
            p.x += p.vx;
            p.y += p.vy;
            
            p.rotation += p.rotationSpeed;
            
            if (p.y > window.innerHeight * 0.7) {
                p.opacity -= 0.018;
            }
            
            if (p.opacity > 0 && p.y < window.innerHeight) {
                alive = true;
                
                this.confettiCtx.save();
                this.confettiCtx.globalAlpha = p.opacity;
                this.confettiCtx.translate(p.x, p.y);
                this.confettiCtx.rotate(p.rotation * Math.PI / 180);
                this.confettiCtx.fillStyle = p.color;
                
                this.confettiCtx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                this.confettiCtx.restore();
            }
        });

        if (alive) {
            requestAnimationFrame(() => this.animateConfetti());
        }
    }
}

// Instantiate on window load
window.addEventListener('DOMContentLoaded', () => {
    window.App = new LavaSelectorApp();
});
