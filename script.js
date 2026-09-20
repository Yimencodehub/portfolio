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
function toggleTheme() {
    const themeIcon = document.getElementById("themeIcon");
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    
    if (themeIcon) {
        themeIcon.className = isDark ? "uil uil-sun" : "uil uil-moon";
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Make toggleTheme available globally on window
window.toggleTheme = toggleTheme;

// Check and apply saved theme immediately
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        const themeIcon = document.getElementById("themeIcon");
        if (themeIcon) {
            themeIcon.className = "uil uil-sun";
        }
    }
})();

// Attach event listeners once DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.addEventListener("click", toggleTheme);
    }
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

/* ----- TYPING EFFECT ----- */
if (typeof Typed !== 'undefined') {
    new Typed(".typedText", {
        strings: ["Developer", "Designer", "Full-Stack Engineer", "Problem Solver"],
        loop: true,
        typeSpeed: 100,
        backSpeed: 80,
        backDelay: 2000
    });
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

/* ----- FILE MANAGER LOGIC (UPLOAD & DOWNLOAD) ----- */
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileCategoryInput = document.getElementById('fileCategory');
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

        // Choose Icon based on type
        let iconClass = 'uil uil-file';
        if (file.name.endsWith('.pdf')) iconClass = 'uil uil-file-pdf-land';
        else if (file.name.match(/\.(jpg|jpeg|png|gif|svg)$/i)) iconClass = 'uil uil-image';
        else if (file.name.match(/\.(zip|rar|tar)$/i)) iconClass = 'uil uil-file-archive-alt';
        else if (file.name.match(/\.(doc|docx)$/i)) iconClass = 'uil uil-file-alt';

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
                    <i class="uil uil-download-alt"></i>
                </button>
                <button class="action-btn delete-action" onclick="deleteFile('${file.id}')" title="Delete File">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </div>
        `;
        fileListContainer.appendChild(item);
    });
}

// Handle Drag and Drop
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
});

uploadBtn.addEventListener('click', () => {
    if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
    } else {
        fileInput.click();
    }
});

// Process Uploaded Files (PDF, JPG, PNG, DOCX)
function handleFiles(files) {
    const uploadError = document.getElementById('uploadError');
    if (uploadError) uploadError.style.display = 'none';

    const category = fileCategoryInput.value.trim() || 'Document';
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB Limit

    Array.from(files).forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'zip'];
        const isAllowed = allowedExts.includes(ext) || file.type.startsWith('image/') || file.type === 'application/pdf';

        if (!isAllowed) {
            const msg = `❌ አልተቀበለም! "${file.name}" የተፈቀደ ፋይል አይደለም። (PDF, JPG, PNG, DOCX ብቻ)`;
            if (uploadError) {
                uploadError.textContent = msg;
                uploadError.style.display = 'block';
            } else {
                alert(msg);
            }
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const msg = `❌ የፋይል መጠኑ ከ 10MB ይበልጣል! ("${file.name}" = ${fileSizeMB} MB)`;
            if (uploadError) {
                uploadError.textContent = msg;
                uploadError.style.display = 'block';
            } else {
                alert(msg);
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const newFile = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                category: category,
                date: new Date().toISOString().split('T')[0],
                dataUrl: e.target.result
            };
            filesArray.unshift(newFile);
            saveFiles();
            renderFiles();
            alert(`✅ "${file.name}" በተሳካ ሁኔታ ተጫነ! (Successfully uploaded)`);
        };
        reader.readAsDataURL(file);
    });
    fileCategoryInput.value = '';
    fileInput.value = '';
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

// Delete File Function
window.deleteFile = function (id) {
    if (confirm(`የተመረጠውን ፋይል ማስወገድ ይፈልጋሉ?`)) {
        filesArray = filesArray.filter(f => f.id !== id);
        saveFiles();
        renderFiles();
    }
};

// Profile Photo Upload Handler
const profileImgDisplay = document.getElementById('profileImgDisplay');
const profileImgInput = document.getElementById('profileImgInput');
const changeProfileBtn = document.getElementById('changeProfileBtn');

// Load saved profile photo if available
const savedProfilePic = localStorage.getItem('user_profile_photo');
if (savedProfilePic && profileImgDisplay) {
    profileImgDisplay.src = savedProfilePic;
}

if (changeProfileBtn && profileImgInput) {
    changeProfileBtn.addEventListener('click', () => profileImgInput.click());
    profileImgInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                profileImgDisplay.src = evt.target.result;
                try {
                    localStorage.setItem('user_profile_photo', evt.target.result);
                } catch(err) {}
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

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
            return '❌ ኢሜይል ማስገባት ግዴታ ነው!';
        }
        if (!lowerEmail.endsWith('@gmail.com')) {
            return '❌ ኢሜይል ከ @gmail.com ውጭ አይቀበልም! (Must end with @gmail.com)';
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
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="uil uil-spinner-alt"></i>';

            fetch('https://formspree.io/f/xknlqrqr', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                if (response.ok) {
                    alert(`✅ እናመሰግናለን ${nameVal}! መልእክትዎ ቀጥታ ወደ yimenanmaw711@gmail.com ተልኳል።`);
                    contactForm.reset();
                    incrementCommentCount();
                } else {
                    alert(`✅ እናመሰግናለን ${nameVal}! መልእክትዎ ተቀብለናል፤ በቅርቡ እናገኝዎታለን።`);
                    contactForm.reset();
                    incrementCommentCount();
                }
            }).catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                alert(`✅ መልእክትዎ ተመዝግቧል! እናመሰግናለን ${nameVal}!`);
                contactForm.reset();
                incrementCommentCount();
            });
        }
    });
}

/* ----- LIVE VISITOR ANALYTICS & RATING WIDGET LOGIC ----- */
let visitorAnalytics = {
    todayVisitors: 1,
    likes: 5,
    dislikes: 0,
    comments: 0,
    userRating: 5
};

const savedAnalytics = localStorage.getItem('portfolio_analytics_data');
if (savedAnalytics) {
    try {
        visitorAnalytics = JSON.parse(savedAnalytics);
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
    if (commentsEl) commentsEl.textContent = visitorAnalytics.comments;
    if (likeBtnNum) likeBtnNum.textContent = visitorAnalytics.likes;
    if (dislikeBtnNum) dislikeBtnNum.textContent = visitorAnalytics.dislikes;
}

function incrementCommentCount() {
    visitorAnalytics.comments += 1;
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

/* ----- PROFILE PHOTO PERSISTENCE & UPLOAD ----- */
const profileImgDisplay = document.getElementById('profileImgDisplay');
const profileImgInput = document.getElementById('profileImgInput');

// Load saved profile photo from localStorage if present
const savedProfilePic = localStorage.getItem('user_profile_photo');
if (savedProfilePic && profileImgDisplay) {
    profileImgDisplay.src = savedProfilePic;
}

if (profileImgInput && profileImgDisplay) {
    profileImgInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Img = event.target.result;
                profileImgDisplay.src = base64Img;
                try {
                    localStorage.setItem('user_profile_photo', base64Img);
                } catch (err) {
                    console.warn('Image too large to store in localStorage:', err);
                }
            };
            reader.readAsDataURL(file);
        }
    });
}