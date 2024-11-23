document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme icon
        const themeIcon = themeToggle.querySelector('.material-icons');
        themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
    });

    // Video Modal Functionality
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.querySelector('.modal-video-title');
    const closeModal = document.querySelector('.close-modal');

    // Handle video card clicks
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoUrl = card.dataset.videoUrl;
            const title = card.querySelector('.video-title').textContent;
            
            // Set video source and title
            if (videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com')) {
                // Extract YouTube video ID
                const videoId = videoUrl.split('/').pop().split('?')[0];
                // Create embedded YouTube player
                videoPlayer.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>`;
            } else {
                // For direct video files
                videoPlayer.innerHTML = `
                    <video controls autoplay width="100%" height="100%">
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
            }
            
            modalTitle.textContent = title;
            modal.style.display = 'block';
        });
    });

    // Close modal
    closeModal?.addEventListener('click', () => {
        modal.style.display = 'none';
        videoPlayer.innerHTML = ''; // Clear video player content
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            videoPlayer.innerHTML = ''; // Clear video player content
        }
    });

    // Channel navigation
    document.querySelectorAll('.channel-link, .profile-button').forEach(link => {
        link.addEventListener('click', (e) => {
            // Handle channel navigation
            if (link.classList.contains('profile-button')) {
                window.location.href = 'channel.html';
            }
        });
    });

    // Back button functionality
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const body = document.body;
    let isSidebarCollapsed = false;

    menuIcon?.addEventListener('click', () => {
        isSidebarCollapsed = !isSidebarCollapsed;
        body.style.paddingLeft = isSidebarCollapsed ? '72px' : '240px';
        document.querySelector('.sidebar').style.width = isSidebarCollapsed ? '72px' : '240px';
        
        // Hide text in sidebar items when collapsed
        document.querySelectorAll('.sidebar-item span:not(.material-icons)').forEach(span => {
            span.style.display = isSidebarCollapsed ? 'none' : 'block';
        });
    });

    // Liked videos functionality
    function handleLikeVideo() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isLiked = btn.classList.contains('liked');
                if (isLiked) {
                    btn.classList.remove('liked');
                    btn.querySelector('span:last-child').textContent = 'Like';
                } else {
                    btn.classList.add('liked');
                    btn.querySelector('span:last-child').textContent = 'Liked';
                }
            });
        });
    }

    // Initialize like functionality
    handleLikeVideo();

    // Category chips scroll
    const categoryChips = document.querySelector('.category-chips');
    if (categoryChips) {
        let isScrolling = false;

        categoryChips.addEventListener('wheel', (e) => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    categoryChips.scrollLeft += e.deltaY;
                    isScrolling = false;
                });
            }
            e.preventDefault();
        });
    }

    // Add hover effects to video cards
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const thumbnail = card.querySelector('.thumbnail');
            if (thumbnail) {
                thumbnail.style.transform = 'scale(1.05)';
                thumbnail.style.transition = 'transform 0.2s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const thumbnail = card.querySelector('.thumbnail');
            if (thumbnail) {
                thumbnail.style.transform = 'scale(1)';
            }
        });
    });

    // Handle window resize for responsive layout
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth < 1200 && !isSidebarCollapsed) {
                menuIcon?.click();
            }
        }, 250);
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC key to close modal
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            videoPlayer.innerHTML = '';
        }
        
        // Space bar to play/pause video
        if (e.code === 'Space' && modal.style.display === 'block') {
            e.preventDefault();
            const video = videoPlayer.querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    });
});
