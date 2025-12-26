// ========================================
// ASSISTANT TED - Logic & Scenarios
// Chatbot guidé sans LLM
// ========================================

class TEDAssistant {
    constructor() {
        this.isOpen = false;
        this.currentScenario = null;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.greetUser();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'ted-widget';
        widget.innerHTML = `
            <button class="ted-button" id="ted-toggle" aria-label="Ouvrir l'assistant TED">
                <img src="assets/images/logos/Logo TEDSAI.jpeg" alt="TED">
            </button>

            <div class="ted-chat-window" id="ted-chat">
                <div class="ted-chat-header">
                    <div class="ted-chat-header-info">
                        <img src="assets/images/logos/Logo TEDSAI.jpeg" alt="TED">
                        <div>
                            <h3>TED Assistant</h3>
                            <p class="ted-status">En ligne</p>
                        </div>
                    </div>
                    <button class="ted-close-btn" id="ted-close" aria-label="Fermer">×</button>
                </div>

                <div class="ted-chat-body" id="ted-messages">
                    <!-- Messages will be inserted here -->
                </div>

                <div class="ted-chat-footer">
                    <input type="text" class="ted-input" id="ted-input" 
                           placeholder="Tapez votre message...">
                    <button class="ted-send-btn" id="ted-send">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    attachEventListeners() {
        document.getElementById('ted-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('ted-close').addEventListener('click', () => this.toggleChat());

        // Input handling for custom scenarios
        const input = document.getElementById('ted-input');
        const sendBtn = document.getElementById('ted-send');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.addMessage('user', text);
                input.value = '';
                this.handleUserInput(text);
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('ted-chat');
        chatWindow.classList.toggle('active');

        if (this.isOpen && this.conversationHistory.length === 0) {
            this.greetUser();
        }
    }

    greetUser() {
        const greeting = "Bonjour ! Je suis TED. Je peux vous orienter vers nos pôles : IA, Agriculture, Élevage, Restauration ou Épicerie.";
        const scenarios = [
            { icon: 'fa-utensils', text: 'Réserver chez viTEDia', action: 'restaurant_flow' },
            { icon: 'fa-leaf', text: 'Produits Frais & Épicerie', action: 'epicerie_link' },
            { icon: 'fa-brain', text: 'Solutions IA (Entreprises)', action: 'b2b_link' },
            { icon: 'fa-question-circle', text: 'Qui sommes-nous ?', action: 'faq' }
        ];

        this.addMessage('ted', greeting);
        this.showScenarios(scenarios);
    }

    // --- Core Chat UI ---

    addMessage(sender, content, isHTML = false) {
        const messagesContainer = document.getElementById('ted-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ted-message ${sender}`;

        if (sender === 'ted') {
            messageDiv.innerHTML = `
                <img src="assets/images/logos/Logo TEDSAI.jpeg" alt="TED" class="ted-message-avatar">
                <div class="ted-message-content">${isHTML ? content : this.escapeHtml(content)}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ted-message-content">${this.escapeHtml(content)}</div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.conversationHistory.push({ sender, content, timestamp: new Date() });
    }

    showScenarios(scenarios) {
        const scenariosHTML = `
            <div class="ted-scenarios">
                ${scenarios.map(s => `
                    <button class="ted-scenario-btn" data-action="${s.action}">
                        <i class="fa-solid ${s.icon}"></i>
                        ${s.text}
                    </button>
                `).join('')}
            </div>
        `;
        this.addMessage('ted', scenariosHTML, true);

        setTimeout(() => {
            const btns = document.querySelectorAll('.ted-scenario-btn');
            btns.forEach(btn => {
                // Remove old listeners to avoid dupes if re-rendered (simple approach)
                btn.replaceWith(btn.cloneNode(true));
            });
            // Re-select and attach
            document.querySelectorAll('.ted-scenario-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.dataset.action;
                    this.handleAction(action);
                });
            });
        }, 100);
    }

    enableInput(placeholder = "Tapez votre réponse...") {
        const input = document.getElementById('ted-input');
        input.placeholder = placeholder;
        input.focus();
    }

    disableInput() {
        const input = document.getElementById('ted-input');
        input.placeholder = "Sélectionnez une option...";
    }

    // --- Logic & Data Handling ---

    handleAction(action) {
        this.currentScenario = action;

        if (action === 'restaurant_flow') {
            this.startBookingFlow();
        } else if (action === 'epicerie_link') {
            this.simpleRedirect('Produits frais', "Je vous emmène au jardin !", 'pages/garden.html');
        } else if (action === 'b2b_link') {
            this.simpleRedirect('Solutions IA', "Découvrez nos offres pour entreprises.", 'pages/solutions-ia.html');
        } else if (action === 'faq') {
            this.showFAQ();
        } else if (action === 'home') {
            this.greetUser(); // Reset loop
        }
    }

    simpleRedirect(userText, botText, url) {
        this.addMessage('user', userText);
        this.addMessage('ted', botText);
        setTimeout(() => window.location.href = url, 1500);
    }

    // --- Booking Flow (Conversational Form) ---

    startBookingFlow() {
        this.addMessage('user', 'Je veux réserver une table');
        this.addMessage('ted', "C'est noté ! Pour combien de personnes ?");
        this.bookingData = { step: 'people' }; // Set state
        this.enableInput("Ex: 2, 4...");
    }

    finalizeBooking() {
        const { people, date, time, name } = this.bookingData;
        const confirmation = `Merci ${name} ! Votre réservation pour ${people} personnes le ${date} à ${time} est en cours de traitement. Un email de confirmation vous sera envoyé.`;
        this.addMessage('ted', confirmation);
        this.bookingData = {}; // Reset booking data
        this.addMessage('ted', "Y a-t-il autre chose que je puisse faire pour vous ?");
        this.greetUser(); // Offer main options again
    }

    handleUserInput(text) {
        // 0. Sécurité : Rate Limiting (Anti-Spam)
        const now = Date.now();
        if (!this.messageHistory) this.messageHistory = [];
        this.messageHistory = this.messageHistory.filter(t => now - t < 60000);

        if (this.messageHistory.length >= 8) {
            this.addMessage('ted', "Oups, vous allez un peu trop vite ! Laissez-moi respirer quelques secondes. 🤖💨");
            return;
        }
        this.messageHistory.push(now);

        // 1. Check active flow
        if (this.bookingData && this.bookingData.step) {
            if (text.toLowerCase() === 'annuler') {
                this.bookingData = {};
                this.addMessage('ted', "Réservation annulée. Que souhaitez-vous faire d'autre ?");
                this.greetUser();
                return;
            }

            const step = this.bookingData.step;
            if (step === 'people') {
                if (isNaN(parseInt(text))) {
                    this.addMessage('ted', "Veuillez entrer un nombre valide (ex: 2).");
                    return;
                }
                this.bookingData.people = text;
                this.bookingData.step = 'date';
                this.addMessage('ted', "Très bien. Pour quelle date ? (JJ/MM)");
                this.enableInput("Ex: 12/03 ou Demain");
            } else if (step === 'date') {
                this.bookingData.date = text;
                this.bookingData.step = 'time';
                this.addMessage('ted', "À quelle heure ?");
                this.enableInput("Ex: 19h30, 20h00");
            } else if (step === 'time') {
                this.bookingData.time = text;
                this.bookingData.step = 'name';
                this.addMessage('ted', "Et à quel nom je note cela ?");
                this.enableInput("Votre nom complet");
            } else if (step === 'name') {
                this.bookingData.name = text;
                this.bookingData.step = null;
                this.finalizeBooking();
            }
            return;
        }

        // 2. Fallback / Free chat (pseudo-intelligence)
        const lower = text.toLowerCase();

        // Salutations
        if (['bonjour', 'hello', 'salut', 'hi'].some(w => lower.includes(w))) {
            this.addMessage('ted', "Bonjour ! Je suis TED, votre assistant. Comment puis-je vous aider ?");
            this.greetUser();

        } else if (['prix', 'coût', 'tarif', 'menu', 'carte'].some(w => lower.includes(w))) {
            this.addMessage('ted', "Nos plats varient entre 8 000 et 15 000 FCFA. Voici nos options :");
            this.showScenarios([
                { icon: 'fa-utensils', text: 'Voir le Menu', action: 'link:pages/vitedia.html' },
                { icon: 'fa-calendar-check', text: 'Réserver une table', action: 'restaurant_flow' }
            ]);

        } else if (['ia', 'business', 'conseil', 'audit'].some(w => lower.includes(w))) {
            this.addMessage('ted', "Nos solutions IA pour entreprises commencent par un audit.");
            this.showScenarios([
                { icon: 'fa-brain', text: 'Solutions IA', action: 'link:pages/solutions-ia.html' },
                { icon: 'fa-envelope', text: 'Demander un devis', action: 'contact_flow' }
            ]);

        } else {
            this.addMessage('ted', "Je ne suis pas sûr de comprendre. Souhaitez-vous parler à un expert humain ?");
            this.showScenarios([
                { icon: 'fa-envelope', text: 'Laisser un message', action: 'contact_flow' },
                { icon: 'fa-rotate-right', text: 'Retour au début', action: 'restart' }
            ]);
        }
    }

    finalizeBooking() {
        const { people, date, time, name } = this.bookingData;
        const confirmation = `Merci ${name} ! Votre réservation pour ${people} personnes le ${date} à ${time} est notée.`;
        this.addMessage('ted', confirmation);

        // Save to Backend
        if (window.TEDBackend && window.TEDBackend.reservations) {
            window.TEDBackend.reservations.add({ name, date, time, people, source: 'chat_ted' });
        }

        this.bookingData = {};
        setTimeout(() => {
            this.addMessage('ted', "Puis-je faire autre chose pour vous ?");
            this.greetUser();
        }, 2000);
    }

    showFAQ() {
        const faqs = [
            { q: "Qu'est-ce que TEDSAI ?", a: "TEDSAI est un écosystème intelligent : IA, Agriculture, Restaurant." },
            { q: "Où êtes-vous situés ?", a: "Nous sommes basés à Yaoundé, Cameroun." },
            { q: "Comment réserver ?", a: "Via cet assistant ou la page Restaurant." },
            { q: "Vos produits sont-ils bio ?", a: "Oui, 100% bio et locaux." }
        ];

        this.addMessage('user', 'Questions fréquentes');
        const faqHTML = `
            <div style="margin-top:0.5rem;">
                ${faqs.map(f => `
                    <details style="margin-bottom:0.5rem; background:#f9f9f9; padding:0.5rem; border-radius:6px;">
                        <summary style="cursor:pointer; font-weight:600;">${f.q}</summary>
                        <p style="margin:0.5rem 0 0;">${f.a}</p>
                    </details>
                `).join('')}
            </div>
        `;
        this.addMessage('ted', faqHTML, true);
    }

    escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

// Initialize TED when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tedAssistant = new TEDAssistant();
    });
} else {
    window.tedAssistant = new TEDAssistant();
}
