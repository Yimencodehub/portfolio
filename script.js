/* ----- NAVIGATION BAR TOGGLE ----- */
function myMenuFunction(){
    let menuBtn = document.getElementById("myNavMenu");
    if(menuBtn.className === "nav-menu"){
      menuBtn.className += " responsive";
    } else {
      menuBtn.className = "nav-menu";
    }
}

/* ----- DARK / LIGHT THEME TOGGLE ----- */
function applyTheme(dark) {
    if (dark) {
        document.documentElement.classList.add("dark-theme");
        document.body.classList.add("dark-theme");
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.classList.remove("dark-theme");
        document.body.classList.remove("dark-theme");
        document.documentElement.setAttribute("data-theme", "light");
    }
    const iconSpan = document.getElementById("themeIcon");
    if (iconSpan) iconSpan.textContent = dark ? "☀️" : "🌙";
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    applyTheme(!isDark);
    try { localStorage.setItem("theme", !isDark ? "dark" : "light"); } catch(e) {}
}

// Make globally available (for onclick in HTML)
window.toggleTheme = toggleTheme;
window.applyTheme  = applyTheme;

// Apply theme as soon as DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    let saved = "light";
    try { saved = localStorage.getItem("theme") || "light"; } catch(e) {}
    applyTheme(saved === "dark");

    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);
});

/* ----- HEADER SHADOW ON SCROLL ----- */
window.addEventListener('scroll', () => {
    const navHeader = document.getElementById("header");
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navHeader.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
        navHeader.style.height = "70px";
    } else {
        navHeader.style.boxShadow = "none";
        navHeader.style.height = "80px";
    }
});

/* ----- TYPING EFFECT (WITH PURE JS FALLBACK) ----- */
const typeWords = ["Developer", "Full-Stack Engineer", "Designer", "Problem Solver"];
const typedTextSpan = document.querySelector(".typedText");

if (typeof Typed !== 'undefined') {
    new Typed(".typedText", {
        strings: typeWords,
        loop: true,
        typeSpeed: 100,
        backSpeed: 60,
        backDelay: 2000
    });
} else if (typedTextSpan) {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function runTypeWriter() {
        const currentWord = typeWords[wordIdx];
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIdx === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % typeWords.length;
            speed = 300;
        }

        setTimeout(runTypeWriter, speed);
    }
    runTypeWriter();
}

/* ----- SCROLL REVEAL ANIMATIONS ----- */
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 2000,
        reset: false
    });

    sr.reveal('.featured-text-card', {});
    sr.reveal('.featured-name', { delay: 100 });
    sr.reveal('.featured-text-info', { delay: 200 });
    sr.reveal('.featured-text-btn', { delay: 200 });
    sr.reveal('.social_icons', { delay: 200 });
    sr.reveal('.featured-image', { delay: 300 });

    sr.reveal('.project-card', { interval: 200 });
    sr.reveal('.top-header', {});

    const srLeft = ScrollReveal({
        origin: 'left',
        distance: '80px',
        duration: 2000,
        reset: false
    });
    srLeft.reveal('.about-info', { delay: 100 });
    srLeft.reveal('.contact-info', { delay: 100 });

    const srRight = ScrollReveal({
        origin: 'right',
        distance: '80px',
        duration: 2000,
        reset: false
    });
    srRight.reveal('.skills-box', { delay: 100 });
    srRight.reveal('.form-control', { delay: 100 });
}

/* ----- ACTIVE LINK HIGHLIGHT ON SCROLL ----- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        }
    });
});

/* ----- FILE MANAGER LOGIC (READ-ONLY VIEW & DOWNLOAD FOR VISITORS) ----- */
const fileListContainer = document.getElementById('fileList');

// Initial Sample Files
let filesArray = [
    {
        id: '1',
        name: 'Resume_Professional_CV.pdf',
        size: '1.2 MB',
        category: 'CV Document',
        date: '2026-09-14',
        type: 'pdf',
        dataUrl: null // Default downloadable CV
    },
    {
        id: '2',
        name: 'Project_Portfolio_Summary.pdf',
        size: '850 KB',
        category: 'Project Overview',
        date: '2026-09-12',
        type: 'pdf',
        dataUrl: null
    }
];

// Load saved files from localStorage
const storedFiles = localStorage.getItem('user_uploaded_files');
if (storedFiles) {
    try {
        filesArray = JSON.parse(storedFiles);
    } catch (e) {
        console.error("Failed to parse stored files", e);
    }
}

// Save files to localStorage
function saveFiles() {
    try {
        localStorage.setItem('user_uploaded_files', JSON.stringify(filesArray));
    } catch (e) {
        alert('Storage limit reached! Larger files can be connected to Firebase/Supabase Backend.');
    }
}

// Render File Items
function renderFiles() {
    fileListContainer.innerHTML = '';
    if (filesArray.length === 0) {
        fileListContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-color-second); padding: 30px 0;">
                <i class="uil uil-folder-open" style="font-size: 40px;"></i>
                <p style="margin-top: 10px;">No files uploaded yet.</p>
            </div>
        `;
        return;
    }

    filesArray.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item';

        // Choose Icon based on file extension
        let iconClass = 'uil uil-file';
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext))                          iconClass = 'uil uil-file-pdf-land';
        else if (['jpg','jpeg','png','gif','svg','webp','bmp'].includes(ext)) iconClass = 'uil uil-image';
        else if (['mp4','mkv','avi','mov','webm'].includes(ext))              iconClass = 'uil uil-video';
        else if (['mp3','wav','aac','ogg','flac'].includes(ext))              iconClass = 'uil uil-music';
        else if (['zip','rar','tar','gz','7z'].includes(ext))                 iconClass = 'uil uil-file-archive-alt';
        else if (['doc','docx','odt'].includes(ext))                          iconClass = 'uil uil-file-alt';
        else if (['xls','xlsx','csv'].includes(ext))                          iconClass = 'uil uil-table';
        else if (['ppt','pptx'].includes(ext))                                iconClass = 'uil uil-presentation';
        else if (['js','ts','py','java','c','cpp','html','css','json'].includes(ext)) iconClass = 'uil uil-brackets-curly';
        else if (['txt','md'].includes(ext))                                  iconClass = 'uil uil-document-layout-left';

        item.innerHTML = `
            <div class="file-info">
                <i class="${iconClass}"></i>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-meta">${file.size} • ${file.category || 'General'} • ${file.date}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="action-btn download-action" onclick="downloadFile('${file.id}')" title="Download File">
                    <i class="uil uil-download-alt"></i> Download
                </button>
            </div>
        `;
        fileListContainer.appendChild(item);
    });
}

// Download File Function
window.downloadFile = function (id) {
    const file = filesArray.find(f => f.id === id);
    if (!file) return;

    if (file.dataUrl) {
        const a = document.createElement('a');
        a.href = file.dataUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        downloadDefaultCV();
    }
};

// Profile Photo Display
const profileImgDisplay = document.getElementById('profileImgDisplay');

// Download Default CV Function
function downloadDefaultCV() {
    const cvText = `=====================================================
                 YIMEN ANMAW - FULL STACK DEVELOPER
=====================================================
Email: yimenanmaw711@gmail.com
Phone: +251 92735242
Telegram: @yimen27
GitHub: https://github.com/Yimencodehub

ABOUT ME:
Experienced full-stack developer passionate about creating 
visually stunning, highly performant, and user-friendly 
web applications.

TECHNICAL SKILLS:
- Languages & Frameworks: HTML5, CSS3, JavaScript (ES6+), React, PHP
- Tools: Git, GitHub, Vercel, Firebase, MySQL
- Specializations: Responsive Design, Full-Stack Web Architecture

FEATURED PROJECTS:
1. Hotel Management System (PHP, MySQL, JS, HTML/CSS)
2. Library Management System (PHP, JS, HTML/CSS)
3. Course Management System (React, Firebase)
4. Calculator & Weather Web Applications
5. Voice to Text Converter

=====================================================
Portfolio CV - Yimen Anmaw
=====================================================`;

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Yimen_Anmaw_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// CV Download Button Event Handlers
const cvButtons = ['navCvBtn', 'heroCvBtn', 'aboutCvBtn'];
cvButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            const cvFile = filesArray.find(f => 
                f.name.toLowerCase().includes('cv') || 
                f.name.toLowerCase().includes('resume') || 
                (f.category && f.category.toLowerCase().includes('cv'))
            );

            if (cvFile) {
                downloadFile(cvFile.id);
            } else if (filesArray.length > 0) {
                downloadFile(filesArray[0].id);
            } else {
                downloadDefaultCV();
            }
        });
    }
});

// Contact Form Real-Time Validation Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const messageInput = document.getElementById('messageInput');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Real-time Name Validation: Prevent typing numbers
    nameInput.addEventListener('input', (e) => {
        // Remove any digits entered
        if (/\d/.test(e.target.value)) {
            e.target.value = e.target.value.replace(/\d/g, '');
            nameError.textContent = '❌ ስም ቁጥር መያዝ አይችልም! (Numbers are not allowed in Name)';
            nameError.style.display = 'block';
        } else {
            nameError.style.display = 'none';
        }
    });

    // Email Validation helper
    function validateEmail(email) {
        const lowerEmail = email.trim().toLowerCase();
        if (!lowerEmail) {
            return '❌ እባክዎን ኢሜይልዎን ያስገቡ!';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lowerEmail)) {
            return '❌ እባክዎን ትክክለኛ የኢሜይል አድራሻ ያስገቡ! (e.g. user@gmail.com)';
        }
        return '';
    }

    // Submission Handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const messageVal = messageInput.value.trim();

        // Validate Name
        if (!nameVal) {
            nameError.textContent = '❌ እባክዎን ስምዎን ያስገቡ!';
            nameError.style.display = 'block';
            isValid = false;
        } else if (/\d/.test(nameVal)) {
            nameError.textContent = '❌ ስም ቁጥር መያዝ አይችልም!';
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        // Validate Email
        const emailErr = validateEmail(emailVal);
        if (emailErr) {
            emailError.textContent = emailErr;
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Validate Message
        if (!messageVal || messageVal.length < 5) {
            messageError.textContent = '❌ እባክዎን ቢያንስ 5 ፊደላት ያለው መልእክት ያስገቡ!';
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }

        if (isValid) {
            addComment(nameVal, messageVal);

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending to yimenanmaw711@gmail.com... <i class="uil uil-spinner-alt"></i>';

            fetch('https://formsubmit.co/ajax/yimenanmaw711@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                alert(`✅ እናመሰግናለን ${nameVal}! መልእክትዎና ኮሜንትዎ ቀጥታ ወደ yimenanmaw711@gmail.com ተልኳል።`);
                contactForm.reset();
            }).catch(error => {
                // Fallback to Formspree if FormSubmit is blocked
                fetch('https://formspree.io/f/xknlqrqr', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                }).finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    alert(`✅ እናመሰግናለን ${nameVal}! መልእክትዎና ኮሜንትዎ በተሳካ ሁኔታ ተመዝግቧል።`);
                    contactForm.reset();
                });
            });
        }
    });
}

/* ----- LIVE VISITOR COMMENTS & FEEDBACK BOARD ----- */
let commentsList = [
    {
        id: '1',
        name: 'Abebe Kebede',
        message: 'Great portfolio design! Very smooth animations and responsive layout.',
        date: '2026-09-18 10:30 AM'
    },
    {
        id: '2',
        name: 'Sara Tadesse',
        message: 'Impressive full-stack projects! Keep up the great work.',
        date: '2026-09-19 02:15 PM'
    }
];

const savedComments = localStorage.getItem('portfolio_visitor_comments');
if (savedComments) {
    try {
        commentsList = JSON.parse(savedComments);
    } catch(e) {}
}

function saveComments() {
    try {
        localStorage.setItem('portfolio_visitor_comments', JSON.stringify(commentsList));
    } catch(e) {}
    renderComments();
}

window.openFeedbackModal = function() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'flex';
        renderComments();
    }
};

window.closeFeedbackModal = function() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

function renderComments() {
    const container = document.getElementById('commentsListContainer');
    const modalContainer = document.getElementById('modalCommentsList');
    const badge = document.getElementById('liveCommentsBadge');
    const navBadge = document.getElementById('feedbackBadge');
    
    if (badge) {
        badge.textContent = `${commentsList.length} Comment${commentsList.length !== 1 ? 's' : ''}`;
    }
    if (navBadge) {
        navBadge.textContent = commentsList.length;
    }

    if (typeof visitorAnalytics !== 'undefined' && visitorAnalytics) {
        visitorAnalytics.comments = commentsList.length;
        if (typeof updateAnalyticsUI === 'function') updateAnalyticsUI();
    }

    const htmlContent = commentsList.length === 0 ? `
        <div style="text-align: center; color: var(--text-color-second); padding: 25px 15px; font-size: 13px;">
            <i class="uil uil-comment-alt-slash" style="font-size: 28px;"></i>
            <p style="margin-top: 6px;">No comments yet. Be the first to leave feedback!</p>
        </div>
    ` : commentsList.map(c => `
        <div class="comment-item" style="background: var(--body-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 14px; display: flex; gap: 12px; align-items: flex-start; text-align: left;">
            <div style="background: var(--first-color); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
                ${c.name ? c.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style="flex: 1; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 600; font-size: 14px; color: var(--text-color);">${c.name}</span>
                    <span style="font-size: 11px; color: var(--text-color-second);">${c.date}</span>
                </div>
                <p style="font-size: 13px; color: var(--text-color-second); line-height: 1.4; margin: 0;">${c.message}</p>
            </div>
        </div>
    `).join('');

    if (container) container.innerHTML = htmlContent;
    if (modalContainer) modalContainer.innerHTML = htmlContent;
}

function addComment(name, message) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newComment = {
        id: Date.now().toString(),
        name: name,
        message: message,
        date: formattedDate
    };
    commentsList.unshift(newComment);
    saveComments();
}

/* ----- LIVE VISITOR ANALYTICS & RATING WIDGET LOGIC ----- */
let visitorAnalytics = {
    todayVisitors: 1,
    likes: 5,
    dislikes: 0,
    comments: commentsList.length,
    userRating: 5
};

const savedAnalytics = localStorage.getItem('portfolio_analytics_data');
if (savedAnalytics) {
    try {
        visitorAnalytics = JSON.parse(savedAnalytics);
        visitorAnalytics.comments = commentsList.length;
    } catch (e) {}
}

// Track Today Visitors
const lastVisitDate = localStorage.getItem('last_visit_date');
const todayStr = new Date().toISOString().split('T')[0];
if (lastVisitDate !== todayStr) {
    visitorAnalytics.todayVisitors += 1;
    localStorage.setItem('last_visit_date', todayStr);
}

function saveAnalytics() {
    localStorage.setItem('portfolio_analytics_data', JSON.stringify(visitorAnalytics));
    updateAnalyticsUI();
}

function updateAnalyticsUI() {
    const todayVisitorsEl = document.getElementById('todayVisitorsCount');
    const likesEl = document.getElementById('likesCount');
    const dislikesEl = document.getElementById('dislikesCount');
    const commentsEl = document.getElementById('commentsCount');
    const likeBtnNum = document.getElementById('likeBtnNum');
    const dislikeBtnNum = document.getElementById('dislikeBtnNum');

    if (todayVisitorsEl) todayVisitorsEl.textContent = visitorAnalytics.todayVisitors;
    if (likesEl) likesEl.textContent = visitorAnalytics.likes;
    if (dislikesEl) dislikesEl.textContent = visitorAnalytics.dislikes;
    if (commentsEl) commentsEl.textContent = commentsList.length;
    if (likeBtnNum) likeBtnNum.textContent = visitorAnalytics.likes;
    if (dislikeBtnNum) dislikeBtnNum.textContent = visitorAnalytics.dislikes;
}

function incrementCommentCount() {
    saveAnalytics();
}

// Like and Dislike Button Listeners
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');

if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        visitorAnalytics.likes += 1;
        saveAnalytics();
        alert('❤️ እናመሰግናለን! ፖርትፎሊዮውን ወደዱት። (Liked)');
    });
}

if (dislikeBtn) {
    dislikeBtn.addEventListener('click', () => {
        visitorAnalytics.dislikes += 1;
        saveAnalytics();
        alert('👍 አስተያየትዎ ተመዝግቧል። ለወደፊቱ ይበልጥ እናሻሽለዋለን!');
    });
}

// Star Rating Listener
const starRatingContainer = document.getElementById('starRatingContainer');
const ratingScoreText = document.getElementById('ratingScoreText');

if (starRatingContainer) {
    const stars = starRatingContainer.querySelectorAll('i');
    
    function highlightStars(rating) {
        stars.forEach(star => {
            const r = parseInt(star.getAttribute('data-rating'));
            if (r <= rating) {
                star.className = 'uil uil-star';
                star.style.color = '#f59e0b';
            } else {
                star.className = 'uil uil-star';
                star.style.color = '#d1d5db';
            }
        });
        if (ratingScoreText) ratingScoreText.textContent = `(${rating}.0 ⭐)`;
    }

    highlightStars(visitorAnalytics.userRating);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const selectedRating = parseInt(star.getAttribute('data-rating'));
            visitorAnalytics.userRating = selectedRating;
            highlightStars(selectedRating);
            saveAnalytics();
            alert(`🌟 እናመሰግናለን! ለፖርትፎሊዮው ${selectedRating} ኮከብ (Star) ሰጡት።`);
        });
    });
}

// Initial UI Render
updateAnalyticsUI();
renderFiles();
renderComments();