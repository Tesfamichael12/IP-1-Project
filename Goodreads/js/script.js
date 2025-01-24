document.addEventListener("DOMContentLoaded", function () {
  // Show more button functionality
  const showMoreBtn = document.querySelector(".show-more");
  const authorBio = document.querySelector(".author-bio");

  if (showMoreBtn && authorBio) {
    showMoreBtn.addEventListener("click", function () {
      authorBio.classList.toggle("expanded");
      showMoreBtn.textContent = authorBio.classList.contains("expanded")
        ? "Show less"
        : "Show more";
    });
  }

  // Dropdown functionality
  const detailsDropdown = document.querySelector(".details-dropdown");

  if (detailsDropdown) {
    detailsDropdown.addEventListener("click", function () {
      this.classList.toggle("active");
      // Add logic here to show/hide additional details
    });
  }

  // Rating functionality
  const stars = document.querySelectorAll(".stars .star");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      stars.forEach((s, i) => {
        if (i <= index) {
          s.classList.remove("empty");
        } else {
          s.classList.add("empty");
        }
      });
      // Add logic here to submit the rating
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".book-video");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const muteBtn = document.getElementById("muteBtn");
  const progressBar = document.querySelector(".book-video-progress-bar");
  const videoOverlay = document.querySelector(".book-video-overlay");
  const timeDisplay = document.querySelector(".book-video-time");

  // Set video duration (5:10)
  video.addEventListener("loadedmetadata", function () {
    video.duration = 310; // 5 minutes and 10 seconds
  });

  // Video player controls
  playPauseBtn.addEventListener("click", togglePlayPause);
  videoOverlay.addEventListener("click", togglePlayPause);

  function togglePlayPause() {
    if (video.paused) {
      video.play();
      updatePlayPauseButton(true);
    } else {
      video.pause();
      updatePlayPauseButton(false);
    }
  }

  function updatePlayPauseButton(isPlaying) {
    playPauseBtn.innerHTML = isPlaying
      ? `
            <svg viewBox="0 0 24 24" class="book-video-control-icon">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
            </svg>
        `
      : `
            <svg viewBox="0 0 24 24" class="book-video-control-icon">
                <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
        `;
  }

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
      ? `
            <svg viewBox="0 0 24 24" class="book-video-control-icon">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
            </svg>
        `
      : `
            <svg viewBox="0 0 24 24" class="book-video-control-icon">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/>
            </svg>
        `;
  });

  // Update progress bar as video plays
  video.addEventListener("timeupdate", updateProgressAndTime);

  function updateProgressAndTime() {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
    timeDisplay.textContent = `${formatTime(video.currentTime)} / 5:10`;
  }

  // Allow seeking when clicking on the progress bar
  const progressContainer = document.querySelector(".book-video-progress");
  progressContainer.addEventListener("click", seek);

  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.pageX - rect.left) / progressContainer.offsetWidth;
    video.currentTime = pos * video.duration;
  }

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
});
