// WhatsApp Configuration
const WHATSAPP_NUMBER = '6281235825391'; // Ganti dengan nomor WhatsApp bisnis Anda

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    initializeAllComponents();
});

// Initialize All Components
function initializeAllComponents() {
    initializeLoadingScreen();
    initializeNavigation();
    initializeCounters();
    initializeWhatsApp();
    initializeServiceBooking();
    initializeContactForm();
    initializeBookingForm();
    initializeFileUpload();
}

// Loading Screen - FIXED
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Remove loading screen after page fully loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 800);
            }, 1500); // Reduced from 2000 to 1500
        });

        // Fallback: remove loading screen after 5 seconds max
        setTimeout(function() {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 800);
            }
        }, 5000);
    }
}

// Navigation
function initializeNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                header.style.padding = '0.8rem 0';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                header.style.padding = '1.2rem 0';
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle internal page anchors, not external links
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Counter Animation
function initializeCounters() {
    function animateCounter(element, target, duration) {
        if (!duration) duration = 2000;
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(function() {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }

    // Initialize counter animation when stats are in view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const stats = document.querySelectorAll('.stat h3');
                stats.forEach(function(stat) {
                    const target = parseInt(stat.getAttribute('data-count'));
                    if (target && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe hero stats section
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

// WhatsApp Features
function initializeWhatsApp() {
    // Floating WhatsApp Click
    const floatingWhatsApp = document.getElementById('floatingWhatsApp');
    if (floatingWhatsApp) {
        floatingWhatsApp.addEventListener('click', function() {
            sendWhatsAppMessage('Halo PowerWork, saya ingin bertanya tentang jasa tenaga harian yang tersedia.');
        });
    }
}

// Service Booking
function initializeServiceBooking() {
    // Service card WhatsApp buttons
    document.querySelectorAll('.btn-service[data-service]').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            const priceElement = this.closest('.service-card').querySelector('.price');
            const price = priceElement ? priceElement.textContent : 'Rp 0';

            showServiceModal(service, price);
        });
    });
}

// Service Booking Modal
function showServiceModal(service, price) {
    const modal = document.getElementById('whatsappModal');
    const orderDetails = document.getElementById('orderDetails');

    if (modal && orderDetails) {
        orderDetails.innerHTML = `
            <div class="order-detail">
                <strong>Layanan:</strong> ${service}
            </div>
            <div class="order-detail">
                <strong>Harga:</strong> ${price}/hari
            </div>
            <div class="order-detail">
                <strong>Status:</strong> Tersedia
            </div>
        `;

        modal.classList.add('active');

        // Confirm WhatsApp
        const confirmBtn = document.getElementById('confirmWhatsApp');
        if (confirmBtn) {
            confirmBtn.onclick = function() {
                sendServiceInquiry(service, price);
                modal.classList.remove('active');
            };
        }

        // Cancel
        const cancelBtn = document.getElementById('cancelOrder');
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                modal.classList.remove('active');
            };
        }

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.classList.remove('active');
            };
        }

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Send Service Inquiry to WhatsApp
function sendServiceInquiry(service, price) {
    const message = `Halo AltheraWork, saya tertarik dengan layanan ${service} dengan harga ${price}/hari. Bisa info lebih lanjut?`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    showNotification('Membuka WhatsApp... Silakan lanjutkan percakapan dengan tim kami.', 'success');
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name') ? document.getElementById('name').value : '';
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
            const service = document.getElementById('service') ? document.getElementById('service').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';

            if (!name || !email || !phone || !service || !message) {
                showNotification('Harap lengkapi semua field yang wajib diisi.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Format email tidak valid.', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Format nomor telepon tidak valid.', 'error');
                return;
            }

            sendContactToWhatsApp(name, email, phone, service, message);
        });
    }
}

// Send Contact Form to WhatsApp
function sendContactToWhatsApp(name, email, phone, service, message) {
    const whatsappMessage = `Halo AltheraWork, saya ${name} ingin konsultasi mengenai layanan:

📋 *DATA KONTAK*
• Nama: ${name}
• Email: ${email}
• Telepon: ${phone}
• Layanan: ${service}

💬 *PESAN*
${message}

Mohon info lebih lanjut dan penawaran harganya. Terima kasih.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    showNotification('Form berhasil dikirim! Membuka WhatsApp...', 'success');

    // Reset form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }
}

// Booking Form
function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Initialize from URL parameters
        initializeFromURL();

        // Real-time form validation and summary update
        bookingForm.addEventListener('input', updateBookingSummary);
        bookingForm.addEventListener('change', updateBookingSummary);

        // Form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateBookingForm()) {
                const formData = getFormData();
                showBookingModal(formData);
            }
        });
    }
}

// Initialize from URL parameters
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');

    if (service) {
        const serviceMap = {
            'rumah-tangga': 'Pekerjaan Rumah Tangga - Rp 150.000/hari',
            'pindahan': 'Pindahan & Pengangkutan - Rp 200.000/hari',
            'konstruksi': 'Konstruksi Ringan - Rp 250.000/hari',
            'bongkar-pasang': 'Bongkar Pasang - Rp 175.000/hari',
            'landscaping': 'Landscaping - Rp 180.000/hari',
            'khusus': 'Layanan Khusus - Rp 160.000/hari'
        };

        const serviceType = document.getElementById('serviceType');
        if (serviceType && serviceMap[service]) {
            serviceType.value = serviceMap[service];
            updateBookingSummary();
        }
    }
}

// Update Booking Summary
function updateBookingSummary() {
    const serviceType = document.getElementById('serviceType');
    const workDuration = document.getElementById('workDuration');
    const workDate = document.getElementById('workDate');
    const workTime = document.getElementById('workTime');

    // Update summary elements
    const summaryService = document.getElementById('summaryService');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryPrice = document.getElementById('summaryPrice');
    const summaryTotal = document.getElementById('summaryTotal');

    if (summaryService) {
        if (serviceType && serviceType.options[serviceType.selectedIndex]) {
            summaryService.textContent = serviceType.options[serviceType.selectedIndex].text.split(' - ')[0] || '-';
        } else {
            summaryService.textContent = '-';
        }
    }

    if (summaryDuration) summaryDuration.textContent = workDuration ? `${workDuration.value} Hari` : '-';
    if (summaryDate) summaryDate.textContent = workDate ? formatDate(workDate.value) : '-';

    if (summaryTime && workTime) {
        const timeText = workTime.options[workTime.selectedIndex] ? workTime.options[workTime.selectedIndex].text : '-';
        summaryTime.textContent = timeText;
    }

    // Calculate price and total
    const price = getServicePrice(serviceType ? serviceType.value : '');
    const total = price * parseInt(workDuration ? workDuration.value : 0);

    if (summaryPrice) summaryPrice.textContent = price ? `Rp ${price.toLocaleString('id-ID')}` : '-';
    if (summaryTotal) summaryTotal.textContent = total ? `Rp ${total.toLocaleString('id-ID')}` : 'Rp 0';
}

// Get Service Price from selection
function getServicePrice(serviceType) {
    const prices = {
        'Pekerjaan Rumah Tangga - Rp 150.000/hari': 150000,
        'Pindahan & Pengangkutan - Rp 200.000/hari': 200000,
        'Konstruksi Ringan - Rp 250.000/hari': 250000,
        'Bongkar Pasang - Rp 175.000/hari': 175000,
        'Landscaping - Rp 180.000/hari': 180000,
        'Layanan Khusus - Rp 160.000/hari': 160000
    };
    return prices[serviceType] || 0;
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
        return '-';
    }
}

// Validate Booking Form
function validateBookingForm() {
    const requiredFields = [
        'fullName', 'phone', 'identityType', 'identityNumber',
        'address', 'serviceType', 'workDate', 'workDuration', 'workAddress'
    ];

    for (const fieldName of requiredFields) {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            const label = field && field.labels && field.labels[0] ? field.labels[0].textContent : fieldName;
            showNotification(`Harap lengkapi field ${label}`, 'error');
            if (field) field.focus();
            return false;
        }
    }

    // Validate phone number
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Format nomor telepon tidak valid.', 'error');
        return false;
    }

    // Validate identity number
    const identityNumber = document.getElementById('identityNumber').value;
    if (identityNumber.length < 5) {
        showNotification('Nomor identitas terlalu pendek.', 'error');
        return false;
    }

    // Check agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms || !agreeTerms.checked) {
        showNotification('Harap menyetujui syarat dan ketentuan.', 'error');
        return false;
    }

    const agreeData = document.getElementById('agreeData');
    if (agreeData && !agreeData.checked) {
        showNotification('Harap menyetujui pengolahan data pribadi.', 'error');
        return false;
    }

    return true;
}

// Get Form Data
function getFormData() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);

    return {
        fullName: formData.get('fullName') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        identityType: formData.get('identityType') || '',
        identityNumber: formData.get('identityNumber') || '',
        address: formData.get('address') || '',
        serviceType: formData.get('serviceType') || '',
        workDate: formData.get('workDate') || '',
        workDuration: formData.get('workDuration') || '',
        workTime: formData.get('workTime') || '',
        workAddress: formData.get('workAddress') || '',
        specialRequest: formData.get('specialRequest') || ''
    };
}

// Show Booking Modal
function showBookingModal(formData) {
    const modal = document.getElementById('whatsappModal');
    const orderDetails = document.getElementById('orderDetails');

    if (modal && orderDetails) {
        const totalPrice = getServicePrice(formData.serviceType) * parseInt(formData.workDuration);

        orderDetails.innerHTML = `
            <div class="order-detail">
                <strong>Nama:</strong> ${formData.fullName}
            </div>
            <div class="order-detail">
                <strong>Telepon:</strong> ${formData.phone}
            </div>
            <div class="order-detail">
                <strong>Identitas:</strong> ${formData.identityType} - ${formData.identityNumber}
            </div>
            <div class="order-detail">
                <strong>Layanan:</strong> ${formData.serviceType.split(' - ')[0]}
            </div>
            <div class="order-detail">
                <strong>Tanggal:</strong> ${formatDate(formData.workDate)}
            </div>
            <div class="order-detail">
                <strong>Durasi:</strong> ${formData.workDuration} Hari
            </div>
            <div class="order-detail">
                <strong>Waktu:</strong> ${formData.workTime || 'Akan dikonfirmasi'}
            </div>
            <div class="order-detail">
                <strong>Lokasi:</strong> ${formData.workAddress}
            </div>
            <div class="order-detail">
                <strong>Total Biaya:</strong> Rp ${totalPrice.toLocaleString('id-ID')}
            </div>
            ${formData.specialRequest ? `
            <div class="order-detail">
                <strong>Permintaan Khusus:</strong> ${formData.specialRequest}
            </div>
            ` : ''}
        `;

        modal.classList.add('active');

        // Confirm WhatsApp
        const confirmBtn = document.getElementById('confirmWhatsApp');
        if (confirmBtn) {
            confirmBtn.onclick = function() {
                sendBookingToWhatsApp(formData, totalPrice);
                modal.classList.remove('active');
            };
        }

        // Cancel
        const cancelBtn = document.getElementById('cancelOrder');
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                modal.classList.remove('active');
            };
        }

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.classList.remove('active');
            };
        }

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Send Booking to WhatsApp
function sendBookingToWhatsApp(formData, totalPrice) {
    const message = `Halo AltheraWork, saya ingin memesan layanan dengan detail berikut:

📋 *DATA PEMESANAN*
• Nama: ${formData.fullName}
• Telepon: ${formData.phone}
${formData.email ? `• Email: ${formData.email}\n` : ''}
• Jenis Identitas: ${formData.identityType}
• Nomor Identitas: ${formData.identityNumber}
• Alamat: ${formData.address}

🛠️ *DETAIL LAYANAN*
• Layanan: ${formData.serviceType.split(' - ')[0]}
• Tanggal: ${formatDate(formData.workDate)}
• Durasi: ${formData.workDuration} Hari
${formData.workTime ? `• Waktu: ${formData.workTime}\n` : ''}
• Lokasi: ${formData.workAddress}
${formData.specialRequest ? `• Permintaan Khusus: ${formData.specialRequest}\n` : ''}
💵 *RINCIAN BIAYA*
• Total Biaya: Rp ${totalPrice.toLocaleString('id-ID')}

Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku. Terima kasih.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    showNotification('Pesanan berhasil! Silakan lanjutkan konfirmasi via WhatsApp.', 'success');

    // Reset form after successful submission
    setTimeout(function() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.reset();
            updateBookingSummary();
        }
    }, 2000);
}

// File Upload
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const identityFile = document.getElementById('identityFile');
    const uploadPreview = document.getElementById('uploadPreview');

    if (uploadArea && identityFile) {
        // Click to upload
        uploadArea.addEventListener('click', function() {
            identityFile.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#3498db';
            uploadArea.style.background = 'rgba(52, 152, 219, 0.1)';
        });

        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });

        // File input change
        identityFile.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileSelection(e.target.files[0]);
            }
        });
    }
}

// Handle File Selection
function handleFileSelection(file) {
    if (file && file.type.startsWith('image/')) {
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File terlalu besar. Maksimal 2MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadPreview = document.getElementById('uploadPreview');
            if (uploadPreview) {
                uploadPreview.innerHTML = `
                    <div class="file-preview">
                        <img src="${e.target.result}" alt="Preview Identitas">
                        <button type="button" class="btn-remove-file">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                uploadPreview.style.display = 'block';

                // Add remove file functionality
                const removeBtn = uploadPreview.querySelector('.btn-remove-file');
                removeBtn.addEventListener('click', function() {
                    uploadPreview.innerHTML = '';
                    uploadPreview.style.display = 'none';
                    const identityFile = document.getElementById('identityFile');
                    if (identityFile) {
                        identityFile.value = '';
                    }
                });
            }
        };
        reader.readAsDataURL(file);
    } else {
        showNotification('Harap pilih file gambar (JPG/PNG).', 'error');
    }
}

// General WhatsApp Message
function sendWhatsAppMessage(message) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Notification System
function showNotification(message, type) {
    if (!type) type = 'info';
    
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles for notification if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 1.2rem 1.8rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideInRight 0.4s ease;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                font-size: 1.1rem;
                transition: transform 0.3s ease;
            }
            
            .notification-close:hover {
                transform: rotate(90deg);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Add notification to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        clearTimeout(autoRemove);
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Service Selection from Homepage
function initializeServiceSelection() {
    const serviceButtons = document.querySelectorAll('.btn-service[data-service]');
    serviceButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            window.location.href = `booking.html?service=${service}`;
        });
    });
}

// Initialize service selection when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PowerWork Website Loaded Successfully');

    // Add subtle animation to all interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .service-card, .testimonial-card, .contact-item, .social-icons a, .feature-card');
    interactiveElements.forEach(function(el) {
        el.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Initialize service selection
    initializeServiceSelection();

    // ============================================
// TAMBAHAN UNTUK ALTHERAWORK
// Tambahkan kode ini di BAWAH kode JavaScript yang sudah ada
// ============================================

// Update WhatsApp Configuration untuk AltheraWork
const ALTHERA_WHATSAPP_NUMBER = '628123582539'; // Ganti dengan nomor WhatsApp bisnis Anda

// Update semua referensi PowerWork menjadi AltheraWork
function updateBrandReferences() {
    // Update judul halaman
    if (document.title.includes('AltheraWork')) {
        document.title = document.title.replace('AltheraWork', 'AltheraWork');
    }
    
    // Update teks di WhatsApp messages
    const originalSendWhatsAppMessage = window.sendWhatsAppMessage;
    window.sendWhatsAppMessage = function(message) {
        message = message.replace(/AltheraWork/g, 'AltheraWork');
        const whatsappUrl = `https://wa.me/${ALTHERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    // Update fungsi lainnya yang menggunakan PowerWork
    const originalSendServiceInquiry = window.sendServiceInquiry;
    if (originalSendServiceInquiry) {
        window.sendServiceInquiry = function(service, price) {
            const message = `Halo AltheraWork, saya tertarik dengan layanan ${service} dengan harga ${price}/hari. Bisa info lebih lanjut?`;
            const whatsappUrl = `https://wa.me/${ALTHERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('Membuka WhatsApp... Silakan lanjutkan percakapan dengan tim kami.', 'success');
        };
    }
    
    // Update contact form message
    const originalSendContactToWhatsApp = window.sendContactToWhatsApp;
    if (originalSendContactToWhatsApp) {
        window.sendContactToWhatsApp = function(name, email, phone, service, message) {
            const whatsappMessage = `Halo AltheraWork, saya ${name} ingin konsultasi mengenai layanan:

📋 *DATA KONTAK*
• Nama: ${name}
• Email: ${email}
• Telepon: ${phone}
• Layanan: ${service}

💬 *PESAN*
${message}

Mohon info lebih lanjut dan penawaran harganya. Terima kasih.`;

            const whatsappUrl = `https://wa.me/${ALTHERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('Form berhasil dikirim! Membuka WhatsApp...', 'success');

            // Reset form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.reset();
            }
        };
    }
    
    // Update booking form message
    const originalSendBookingToWhatsApp = window.sendBookingToWhatsApp;
    if (originalSendBookingToWhatsApp) {
        window.sendBookingToWhatsApp = function(formData, totalPrice) {
            const message = `Halo AltheraWork, saya ingin memesan layanan dengan detail berikut:

📋 *DATA PEMESANAN*
• Nama: ${formData.fullName}
• Telepon: ${formData.phone}
${formData.email ? `• Email: ${formData.email}\n` : ''}
• Jenis Identitas: ${formData.identityType}
• Nomor Identitas: ${formData.identityNumber}
• Alamat: ${formData.address}

🛠️ *DETAIL LAYANAN*
• Layanan: ${formData.serviceType.split(' - ')[0]}
• Tanggal: ${formatDate(formData.workDate)}
• Durasi: ${formData.workDuration} Hari
${formData.workTime ? `• Waktu: ${formData.workTime}\n` : ''}
• Lokasi: ${formData.workAddress}
${formData.specialRequest ? `• Permintaan Khusus: ${formData.specialRequest}\n` : ''}
💵 *RINCIAN BIAYA*
• Total Biaya: Rp ${totalPrice.toLocaleString('id-ID')}

Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku. Terima kasih.`;

            const whatsappUrl = `https://wa.me/${ALTHERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('Pesanan berhasil! Silakan lanjutkan konfirmasi via WhatsApp.', 'success');

            // Reset form after successful submission
            setTimeout(function() {
                const bookingForm = document.getElementById('bookingForm');
                if (bookingForm) {
                    bookingForm.reset();
                    updateBookingSummary();
                }
            }, 2000);
        };
    }
}

// Login System untuk AltheraWork
function initializeLoginSystem() {
    // Login Modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form-content');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
        });
    }
    
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    // Tab switching
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Update active tab
            loginTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            loginForms.forEach(form => {
                form.style.display = 'none';
            });
            document.getElementById(`${target}Form`).style.display = 'block';
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            if (validateLoginForm(email, password)) {
                loginUser(email, password, rememberMe);
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('registerAgree').checked;
            
            if (validateRegisterForm(name, email, phone, password, confirmPassword, agreeTerms)) {
                registerUser(name, email, phone, password);
            }
        });
    }
    
    // User menu toggle
    const userAvatar = document.querySelector('.user-avatar');
    const userMenu = document.querySelector('.user-menu');
    
    if (userAvatar && userMenu) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Close user menu when clicking elsewhere
        document.addEventListener('click', function() {
            userMenu.classList.remove('active');
        });
    }
}

// Validate Login Form
function validateLoginForm(email, password) {
    if (!email || !password) {
        showNotification('Harap lengkapi semua field.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Format email tidak valid.', 'error');
        return false;
    }
    
    return true;
}

// Validate Register Form
function validateRegisterForm(name, email, phone, password, confirmPassword, agreeTerms) {
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Harap lengkapi semua field.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Format email tidak valid.', 'error');
        return false;
    }
    
    if (!isValidPhone(phone)) {
        showNotification('Format nomor telepon tidak valid.', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Password minimal 6 karakter.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showNotification('Konfirmasi password tidak cocok.', 'error');
        return false;
    }
    
    if (!agreeTerms) {
        showNotification('Harap menyetujui syarat dan ketentuan.', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
}

// Login User
function loginUser(email, password, rememberMe) {
    // In a real application, this would be an API call to your backend
    // For demo purposes, we'll simulate a successful login
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('altherawork_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            loginTime: new Date().getTime()
        };
        
        if (rememberMe) {
            localStorage.setItem('altherawork_session', JSON.stringify(session));
        } else {
            sessionStorage.setItem('altherawork_session', JSON.stringify(session));
        }
        
        showNotification('Login berhasil!', 'success');
        document.getElementById('loginModal').classList.remove('active');
        
        // Update UI
        updateUIAfterLogin(user);
        
        // Redirect to dashboard if on booking page
        if (window.location.pathname.includes('booking.html')) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    } else {
        showNotification('Email atau password salah.', 'error');
    }
}

// Register User
function registerUser(name, email, phone, password) {
    // In a real application, this would be an API call to your backend
    // For demo purposes, we'll store in localStorage
    
    const users = JSON.parse(localStorage.getItem('altherawork_users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email sudah terdaftar.', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('altherawork_users', JSON.stringify(users));
    
    showNotification('Pendaftaran berhasil! Silakan login.', 'success');
    
    // Switch to login tab
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === 'login') {
            tab.classList.add('active');
        }
    });
    
    document.querySelectorAll('.login-form-content').forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById('loginForm').style.display = 'block';
}

// Generate User ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Check Login Status
function checkLoginStatus() {
    const session = JSON.parse(localStorage.getItem('altherawork_session') || 
                              sessionStorage.getItem('altherawork_session'));
    
    if (session) {
        updateUIAfterLogin(session);
    }
}

// Update UI After Login
function updateUIAfterLogin(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.querySelector('.user-profile');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) {
        userProfile.style.display = 'flex';
        const avatar = userProfile.querySelector('.user-avatar');
        if (avatar) {
            avatar.textContent = user.name.charAt(0).toUpperCase();
        }
        
        const userName = userProfile.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name;
        }
    }
}

// Logout User
function logoutUser() {
    localStorage.removeItem('altherawork_session');
    sessionStorage.removeItem('altherawork_session');
    
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.querySelector('.user-profile');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    
    showNotification('Anda telah logout.', 'info');
    
    // Redirect to home if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Update initializeAllComponents function untuk include fitur baru
const originalInitializeAllComponents = window.initializeAllComponents;
window.initializeAllComponents = function() {
    if (originalInitializeAllComponents) {
        originalInitializeAllComponents();
    }
    
    // Initialize new features
    updateBrandReferences();
    initializeLoginSystem();
    checkLoginStatus();
};

// Update DOMContentLoaded untuk include inisialisasi baru
document.addEventListener('DOMContentLoaded', function() {
    console.log('AltheraWork Website Loaded Successfully');
    
    // Update brand references
    updateBrandReferences();
    
    // Add subtle animation to all interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .service-card, .testimonial-card, .contact-item, .social-icons a, .feature-card');
    interactiveElements.forEach(function(el) {
        el.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});
});