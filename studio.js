// Theme Switching
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.material-icons');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? 'dark_mode' : 'light_mode';

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
});

// Video Upload Functionality
const uploadButtons = document.querySelectorAll('.upload-button');
const uploadModal = document.getElementById('studio-upload-modal');
const closeModalButton = document.getElementById('close-studio-upload-modal');
const uploadArea = document.getElementById('studio-upload-area');
const fileInput = document.getElementById('studio-file-input');
const uploadDetails = document.querySelector('.upload-details');
const thumbnailInput = document.getElementById('thumbnail-input');
const thumbnailPreview = document.getElementById('thumbnail-preview');
const thumbnailUploadButton = document.getElementById('thumbnail-upload-button');
const publishButton = document.getElementById('publish-button');

// Show upload modal
document.querySelectorAll('#studio-upload-button, #table-upload-button').forEach(button => {
    button.addEventListener('click', () => {
        uploadModal.style.display = 'block';
        uploadDetails.style.display = 'none';
        uploadArea.style.display = 'block';
        resetForm();
    });
});

// Close modal
closeModalButton.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.style.display = 'none';
    }
});

// Upload area click handler
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File drag and drop handlers
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('highlight');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('highlight');
    });
});

// Handle file selection
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('drop', handleDrop);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            uploadArea.style.display = 'none';
            uploadDetails.style.display = 'block';
            document.getElementById('video-title').value = file.name.replace(/\.[^/.]+$/, "");
        } else {
            showNotification('Proszę wybrać plik wideo', 'error');
        }
    }
}

// Thumbnail upload handler
thumbnailUploadButton.addEventListener('click', () => {
    thumbnailInput.click();
});

thumbnailInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbnailPreview.src = e.target.result;
                thumbnailPreview.style.display = 'block';
                thumbnailUploadButton.innerHTML = '<span class="material-icons">image</span>Zmień miniaturę';
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Proszę wybrać plik obrazu', 'error');
        }
    }
});

// Video data store
let videoData = {
    videos: [],
    totalViews: 0,
    totalSubscribers: 0,
    watchTimeHours: 0
};

// Load data from localStorage
function loadVideoData() {
    const savedData = localStorage.getItem('youtubeStudioData');
    if (savedData) {
        videoData = JSON.parse(savedData);
        updateDashboard();
    }
}

// Save data to localStorage
function saveVideoData() {
    localStorage.setItem('youtubeStudioData', JSON.stringify(videoData));
}

// Update dashboard
function updateDashboard() {
    const videosTable = document.querySelector('.videos-table');
    const noContent = document.querySelector('.no-content');
    
    if (videoData.videos.length > 0) {
        if (noContent) {
            noContent.remove();
        }
        // Clear existing rows except header
        const existingRows = videosTable.querySelectorAll('.video-row');
        existingRows.forEach(row => row.remove());
        
        // Add video rows
        videoData.videos.forEach(video => {
            const videoRow = createVideoRow(video);
            videosTable.appendChild(videoRow);
        });
    }
}

// Create video row
function createVideoRow(video) {
    const row = document.createElement('div');
    row.className = 'video-row';
    row.innerHTML = `
        <div class="col video-info">
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
            <div class="video-details">
                <h3>${video.title}</h3>
                <p>${video.description.substring(0, 100)}${video.description.length > 100 ? '...' : ''}</p>
            </div>
        </div>
        <div class="col">${video.visibility}</div>
        <div class="col">${new Date(video.uploadDate).toLocaleDateString()}</div>
        <div class="col">${video.views}</div>
        <div class="col">${video.comments}</div>
        <div class="col">${video.likes}</div>
    `;
    return row;
}

// Publish video handler
publishButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    
    if (!title) {
        showNotification('Proszę podać tytuł filmu', 'error');
        return;
    }
    
    if (!thumbnailPreview.src || thumbnailPreview.src === '#') {
        showNotification('Proszę dodać miniaturę', 'error');
        return;
    }

    const newVideo = {
        title: title,
        description: description,
        thumbnail: thumbnailPreview.src,
        visibility: document.querySelector('input[name="visibility"]:checked').value,
        uploadDate: new Date().toISOString(),
        views: 0,
        comments: 0,
        likes: 0
    };

    videoData.videos.unshift(newVideo);
    saveVideoData();
    updateDashboard();
    uploadModal.style.display = 'none';
    
    showNotification('Film został pomyślnie opublikowany!', 'success');
});

// Reset form
function resetForm() {
    document.getElementById('video-title').value = '';
    document.getElementById('video-description').value = '';
    thumbnailPreview.src = '#';
    thumbnailPreview.style.display = 'none';
    thumbnailUploadButton.innerHTML = '<span class="material-icons">image</span>Prześlij miniaturę';
    document.querySelector('input[name="visibility"][value="public"]').checked = true;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadVideoData);
