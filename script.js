document.addEventListener('DOMContentLoaded', () => {

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question span');
                if (btn) btn.textContent = '+';
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const btn = question.querySelector('span');
                if (btn) btn.textContent = '−';
            }
        });
    });

    // Simple scroll reveal effect (Fade in up)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .section-title, .faq-item, .reflection-card, .review-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Github Release Fetcher
    const REPO_OWNER = 'senneb2002'; // Updated to correct owner
    const REPO_NAME = 'ovelo';  // Replace with actual repo name
    const downloadBtn = document.getElementById('download-btn');
    const downloadBtn2 = document.getElementById('download-btn-2');
    const navDownloadBtn = document.querySelector('.btn-nav[href="#download"]');
    const versionText = document.querySelector('.download-note');

    // Download Modal Elements
    const downloadModal = document.getElementById('download-modal');
    const closeDownloadModal = document.getElementById('close-download-modal');
    const cancelDownloadBtn = document.getElementById('cancel-download-btn');
    const confirmDownloadBtn = document.getElementById('confirm-download-btn');

    // Store download URL for modal confirmation
    let currentDownloadUrl = 'https://github.com/senneb2002/ovelo/releases';

    const updateDownloadButtons = (url, version) => {
        currentDownloadUrl = url; // Store for modal
        if (downloadBtn) {
            downloadBtn.dataset.downloadUrl = url;
            const textSpan = downloadBtn.querySelector('.download-text');
            if (textSpan) textSpan.textContent = `Download ${version}`;
        }
        if (downloadBtn2) {
            downloadBtn2.dataset.downloadUrl = url;
            const textSpan2 = downloadBtn2.querySelector('.download-text');
            if (textSpan2) textSpan2.textContent = `Download ${version}`;
        }
        if (confirmDownloadBtn) {
            confirmDownloadBtn.href = url;
        }
        if (versionText) {
            versionText.textContent = `${version} • Windows 10/11 • macOS coming soon`;
        }
    };

    // Show download modal instead of direct download
    const showDownloadModal = (e) => {
        e.preventDefault();
        if (downloadModal) {
            downloadModal.classList.add('active');
        }
    };

    // Attach click handlers to download buttons
    if (downloadBtn) {
        downloadBtn.addEventListener('click', showDownloadModal);
    }
    if (downloadBtn2) {
        downloadBtn2.addEventListener('click', showDownloadModal);
    }

    // Close download modal handlers
    if (closeDownloadModal && downloadModal) {
        closeDownloadModal.addEventListener('click', () => {
            downloadModal.classList.remove('active');
        });
    }

    if (cancelDownloadBtn && downloadModal) {
        cancelDownloadBtn.addEventListener('click', () => {
            downloadModal.classList.remove('active');
        });
    }

    // Close on outside click
    if (downloadModal) {
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                downloadModal.classList.remove('active');
            }
        });
    }

    // Confirm download button - just let it follow the href
    if (confirmDownloadBtn) {
        confirmDownloadBtn.addEventListener('click', () => {
            // Close modal after a brief delay to allow download to start
            setTimeout(() => {
                if (downloadModal) downloadModal.classList.remove('active');
            }, 100);
        });
    }

    if (downloadBtn || downloadBtn2) {
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
            .then(response => {
                if (!response.ok) throw new Error('Repo not found');
                return response.json();
            })
            .then(data => {
                // Find asset ending in .exe or .msi for windows
                const windowsAsset = data.assets.find(asset =>
                    asset.name.endsWith('.exe') || asset.name.endsWith('.msi')
                );

                if (windowsAsset) {
                    updateDownloadButtons(windowsAsset.browser_download_url, data.tag_name);
                }
            })
            .catch(err => {
                console.log('Could not fetch latest release, using default link.', err);
            });
    }

    // Review Modal
    const reviewModal = document.getElementById('review-modal');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const closeReviewModal = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');

    if (writeReviewBtn && reviewModal) {
        writeReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
        });
    }

    if (closeReviewModal && reviewModal) {
        closeReviewModal.addEventListener('click', () => {
            reviewModal.classList.remove('active');
        });

        // Close on outside click
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.classList.remove('active');
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show thank you message
            const modalContent = reviewForm.closest('.modal-content');
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                    <h3>Thank You!</h3>
                    <p style="color: var(--text-secondary); margin-top: 1rem;">Your review has been submitted. We appreciate your feedback!</p>
                    <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="document.getElementById('review-modal').classList.remove('active')">Close</button>
                </div>
            `;
        });
    }

    // Reflection Mode Toggle
    const modeToggle = document.querySelectorAll('input[name="reflection-mode"]');
    const reflectionCards = document.querySelectorAll('.reflection-content');

    // Default to roast
    document.getElementById('mode-roast').checked = true;

    modeToggle.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value; // 'roast' or 'calm'

            // Hide all lists, show target
            reflectionCards.forEach(card => {
                if (card.dataset.mode === mode) {
                    card.style.display = 'block';
                    // Trigger reflow for animation if needed, or just let CSS handle fade
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300); // Wait for fade out
                }
            });
        });
    });

});
