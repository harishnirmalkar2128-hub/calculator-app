// ========== 1. PARTICLES BACKGROUND ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initParticles();
animateParticles();

// ========== 2. THEME TOGGLE ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (!themeToggle) return;

    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

initTheme();

// ========== 3. TYPEWRITER EFFECT ==========
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const phrases = [
        'AI ML Engineer 🤖',
        'Python Developer 🐍',
        'MCA Student 🎓',
        'Tech Enthusiast 🚀',
        'Problem Solver 💡'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        typewriterElement.textContent = currentText;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

initTypewriter();

// ========== 4. STATS COUNTER ==========
function initStatsCounter() {
    const projectsElement = document.getElementById('projectsCount');
    const experienceElement = document.getElementById('experienceCount');
    const clientsElement = document.getElementById('clientsCount');

    if (!projectsElement || !experienceElement || !clientsElement) return;

    const counters = [
        { element: projectsElement, target: 5, current: 0, suffix: '+' },
        { element: experienceElement, target: 1, current: 0, suffix: '' },
        { element: clientsElement, target: 8, current: 0, suffix: '+' }
    ];

    function animateCounters() {
        counters.forEach(counter => {
            if (counter.current < counter.target) {
                counter.current += Math.ceil(counter.target / 30);
                if (counter.current > counter.target) counter.current = counter.target;
                counter.element.textContent = counter.current + counter.suffix;
            }
        });
        requestAnimationFrame(animateCounters);
    }

    animateCounters();
}

initStatsCounter();

// ========== 5. SKILLS DATA ==========
const skillsData = [
    { name: 'Python', icon: '🐍', level: 80, category: 'programming' },
    { name: 'Data Structures', icon: '📊', level: 70, category: 'programming' },
    { name: 'Machine Learning', icon: '🤖', level: 60, category: 'ml' },
    { name: 'Deep Learning', icon: '🧠', level: 50, category: 'ml' },
    { name: 'HTML5', icon: '🌐', level: 75, category: 'web' },
    { name: 'CSS3', icon: '🎨', level: 70, category: 'web' },
    { name: 'JavaScript', icon: '⚡', level: 65, category: 'web' },
    { name: 'SQL', icon: '🗄️', level: 70, category: 'database' }
];

function loadSkills(filter = 'all') {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.category === filter);
    
    grid.innerHTML = filtered.map((skill, index) => `
        <div class="skill-card" style="animation-delay: ${index * 0.1}s">
            <div class="skill-icon">${skill.icon}</div>
            <h3>${skill.name}</h3>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
            <span class="skill-percent">${skill.level}%</span>
        </div>
    `).join('');
}

// ========== 6. PROJECTS DATA ==========
const projectsData = [
    {
        icon: '🧮',
        title: 'Ultimate Calculator',
        description: 'Feature-rich calculator with scientific mode and memory functions.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        demo: '#',
        code: '#'
    },
    {
        icon: '📋',
        title: 'Smart Task Manager',
        description: 'Task management app with categories and local storage.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        demo: '#',
        code: '#'
    },
    {
        icon: '🎙️',
        title: 'Voice to Text Converter',
        description: 'Convert speech to text in real-time with Hindi/English support.',
        tech: ['Python', 'SpeechRecognition', 'Tkinter'],
        demo: '#',
        code: '#'
    }
];

function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = projectsData.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <div class="project-icon">${project.icon}</div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.demo}" class="project-link" target="_blank">Live Demo →</a>
                <a href="${project.code}" class="project-link" target="_blank">GitHub →</a>
            </div>
        </div>
    `).join('');
}

// ========== 7. FILTERS ==========
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            loadSkills(filter);
        });
    });
}

loadSkills('all');
loadProjects();
initFilters();

// ========== 8. MOBILE MENU ==========
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

initMobileMenu();

// ========== 9. BACK TO TOP ==========
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

initBackToTop();

// ========== 10. CHAT SUPPORT ==========
function initChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatToggle || !chatBox || !closeChat || !sendMessage || !chatInput || !chatMessages) return;

    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('show');
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('show');
    });

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        setTimeout(() => {
            const responses = [
                "Thanks for reaching out! I'll get back to you soon.",
                "Great question! Let's connect on LinkedIn.",
                "You can email me at harishnirmalkar2128@gmail.com",
                "I'm always excited to chat about AI/ML!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse);
        }, 1000);
    }

    sendMessage.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
}

initChat();

// ========== 11. CONTACT FORM ==========
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for reaching out! I\'ll get back to you soon.');
        form.reset();
    });
}

initForm();

// ========== 12. VISITOR COUNTER ==========
function updateVisitorCounter() {
    const counter = document.getElementById('visitorCount');
    if (!counter) return;

    let count = localStorage.getItem('visitorCount');
    
    if (!count) {
        count = Math.floor(Math.random() * 900) + 1000;
    } else {
        count = parseInt(count) + 1;
    }
    
    localStorage.setItem('visitorCount', count);
    counter.textContent = count.toLocaleString();
}

updateVisitorCounter();

// ========== 13. SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== 14. ACTIVE LINK HIGHLIGHT ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
