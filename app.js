// Language translations
const translations = {
    ru: {
        title: 'Введите PIN-код для просмотра документа',
        openBtn: 'Открыть',
        helpText: 'PIN-код размещается рядом с QR-кодом документа',
        flag: `<rect width="24" height="6" fill="#ffffff"/>
               <rect y="6" width="24" height="6" fill="#0039A6"/>
               <rect y="12" width="24" height="6" fill="#D52B1E"/>`,
        loading: 'Загрузка...',
        success: 'Документ успешно открыт!',
        error: 'Неверный PIN-код. Попробуйте еще раз.'
    },
    uz: {
        title: 'Hujjatni ko\'rish uchun PIN-kodni kiriting',
        openBtn: 'Ochish',
        helpText: 'PIN-kod hujjatdagi QR-kod yonida joylashgan',
        flag: `<image href="images.png" width="24" height="18"/>`,
        loading: 'Yuklanmoqda...',
        success: 'Hujjat muvaffaqiyatli ochildi!',
        error: 'Noto\'g\'ri PIN-kod. Qaytadan urinib ko\'ring.'
    },
    en: {
        title: 'Enter PIN code to view document',
        openBtn: 'Open',
        helpText: 'PIN code is located next to the QR code of the document',
        flag: `<rect width="24" height="18" fill="#012169"/>
               <path d="M0 0l24 18M24 0L0 18" stroke="#ffffff" stroke-width="2"/>
               <path d="M0 0l24 18M24 0L0 18" stroke="#c8102e" stroke-width="1"/>
               <rect x="10" y="0" width="4" height="18" fill="#ffffff"/>
               <rect x="0" y="7" width="24" height="4" fill="#ffffff"/>
               <rect x="11" y="0" width="2" height="18" fill="#c8102e"/>
               <rect x="0" y="8" width="24" height="2" fill="#c8102e"/>`,
        loading: 'Loading...',
        success: 'Document opened successfully!',
        error: 'Invalid PIN code. Please try again.'
    }
};

let currentLanguage = 'ru';

// PIN Input Functionality
document.addEventListener('DOMContentLoaded', function() {
    const pinInputs = document.querySelectorAll('.pin-input');
    const openBtn = document.getElementById('openBtn');
    const pinForm = document.getElementById('pinForm');
    const languageSelector = document.getElementById('languageSelector');

    // Auto-focus and navigation between PIN inputs
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }

            // Move to next input if current is filled
            if (value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }

            // Check if all inputs are filled
            checkPinComplete();
        });

        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace') {
                if (!input.value && index > 0) {
                    pinInputs[index - 1].focus();
                    pinInputs[index - 1].value = '';
                }
            }
            
            // Handle arrow keys
            if (e.key === 'ArrowLeft' && index > 0) {
                pinInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/\D/g, '').slice(0, 4);
            
            digits.split('').forEach((digit, i) => {
                if (pinInputs[i]) {
                    pinInputs[i].value = digit;
                }
            });
            
            checkPinComplete();
        });

        // Select all text on focus
        input.addEventListener('focus', function() {
            this.select();
        });
    });

    // Check if PIN is complete
    function checkPinComplete() {
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        
        if (pin.length === 4) {
            openBtn.disabled = false;
            openBtn.style.background = '#3b82f6';
            openBtn.style.color = 'white';
            openBtn.style.cursor = 'pointer';
        } else {
            openBtn.disabled = true;
            openBtn.style.background = '#e2e8f0';
            openBtn.style.color = '#94a3b8';
            openBtn.style.cursor = 'not-allowed';
        }
    }

    // Handle form submission
    pinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        
        if (pin.length === 4) {
            // Add loading state
            const translation = translations[currentLanguage];
            openBtn.textContent = translation.loading;
            openBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                 if (pin === '6784') {
                    // Open PDF document
                    showMessage(translation.success, 'success');
                    setTimeout(() => {
                        openPDF();
                    }, 1000);
                } else {
                    // Error
                    showMessage(translation.error, 'error');
                    clearPin();
                }
                
                openBtn.textContent = translation.openBtn;
                checkPinComplete();
            }, 1500);
        }
    });

    // Clear PIN inputs
    function clearPin() {
        pinInputs.forEach(input => {
            input.value = '';
        });
        pinInputs[0].focus();
    }

    // Show message
    function showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        
        // Style the message
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideDown 0.3s ease-out;
            ${type === 'success' 
                ? 'background: #10b981; color: white;' 
                : 'background: #ef4444; color: white;'
            }
        `;

        document.body.appendChild(message);

        // Remove message after 3 seconds
        setTimeout(() => {
            message.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Add CSS animations for messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);

    // Focus first input on load
    pinInputs[0].focus();

    // Build dropdown menu
    const langLabels = { ru: 'Русский', uz: "O'zbek", en: 'English' };
    const langFlags = {
        ru: `<rect width="24" height="6" fill="#ffffff"/><rect y="6" width="24" height="6" fill="#0039A6"/><rect y="12" width="24" height="6" fill="#D52B1E"/>`,
        uz: `<image href="images.png" width="24" height="18"/>`,
        en: `<rect width="24" height="18" fill="#012169"/><path d="M0 0l24 18M24 0L0 18" stroke="#ffffff" stroke-width="2"/><path d="M0 0l24 18M24 0L0 18" stroke="#c8102e" stroke-width="1"/><rect x="10" y="0" width="4" height="18" fill="#ffffff"/><rect x="0" y="7" width="24" height="4" fill="#ffffff"/><rect x="11" y="0" width="2" height="18" fill="#c8102e"/><rect x="0" y="8" width="24" height="2" fill="#c8102e"/>`
    };

    const dropdown = document.createElement('div');
    dropdown.id = 'langDropdown';
    dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        z-index: 999;
        min-width: 150px;
        overflow: hidden;
    `;

    ['ru', 'uz', 'en'].forEach(lang => {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #334155;
            transition: background 0.15s;
        `;
        item.innerHTML = `
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">${langFlags[lang]}</svg>
            <span>${langLabels[lang]}</span>
        `;
        item.addEventListener('mouseenter', () => item.style.background = '#f1f5f9');
        item.addEventListener('mouseleave', () => item.style.background = 'white');
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLanguage = lang;
            updateLanguage();
            dropdown.style.display = 'none';
        });
        dropdown.appendChild(item);
    });

    languageSelector.style.position = 'relative';
    languageSelector.appendChild(dropdown);

    // Toggle dropdown on click
    languageSelector.addEventListener('click', function(e) {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageSelector.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Update language function
    function updateLanguage() {
        const translation = translations[currentLanguage];
        
        // Update page text
        document.getElementById('mainTitle').textContent = translation.title;
        document.getElementById('openBtn').textContent = translation.openBtn;
        
        // Update selector button: flag + label
        document.getElementById('flagIcon').innerHTML = `
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                ${langFlags[currentLanguage]}
            </svg>
        `;
        const langTextEl = document.getElementById('languageText');
        if (langTextEl) langTextEl.textContent = langLabels[currentLanguage];
        
        document.documentElement.lang = currentLanguage;
    }

    // Set default language to Russian on load
    updateLanguage();

    // Open PDF function
    function openPDF() {
        // Try to open PDF in new tab
        const pdfWindow = window.open('Hakimov_Xojiakbar.pdf', '_blank');
        
        // If popup blocked, provide download link
        if (!pdfWindow || pdfWindow.closed || typeof pdfWindow.closed == 'undefined') {
            // Create download link
            const link = document.createElement('a');
            link.href = 'Hakimov_Xojiakbar.pdf';
            link.download = 'Hakimov_Xojiakbar.pdf';
            link.target = '_blank';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show message about download
            const translation = translations[currentLanguage];
            const downloadMessage = {
                ru: 'PDF документ загружается...',
                uz: 'PDF hujjat yuklanmoqda...',
                en: 'PDF document is downloading...'
            };
            showMessage(downloadMessage[currentLanguage], 'success');
        }
    }



    console.log('DMED Documents PIN interface loaded successfully! 🔐');
});