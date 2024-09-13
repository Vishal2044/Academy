
  // YouTube API configuration
  const API_KEY = 'AIzaSyBEPYaUg14NqWhYZkfL81BTOQJwUe7xDBw'; // Replace with your YouTube Data API key
  const CHANNEL_ID = 'UCjssiqm_0SGBdqIcLm604MA'; // Replace with your channel ID
  const videoId = 'xjyp1j0L7MI'; // Replace with your YouTube video ID

  // DOM elements
  const commentsContainer = document.getElementById('comments-container');
  const videoGrid = document.getElementById('video-grid');
  let nextPageToken = ''; // For handling pagination
  let loadedComments = 0; // Track how many comments are loaded
  let showingAllComments = false; // Track if all comments are shown

  // Fetch YouTube comments using the YouTube Data API
  async function fetchYouTubeComments(pageToken = '') {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&pageToken=${pageToken}&maxResults=100`
      );
      const data = await response.json();
      displayComments(data.items);

      // Check if there's a next page of comments
      if (data.nextPageToken) {
        nextPageToken = data.nextPageToken;
      }
    } catch (error) {
      console.error('Error fetching YouTube comments:', error);
    }
  }

  // Function to filter and display thankful comments
  function displayComments(comments) {
    comments.forEach((comment) => {
      const commentText =
        comment.snippet.topLevelComment.snippet.textDisplay.toLowerCase();
      const authorName =
        comment.snippet.topLevelComment.snippet.authorDisplayName;
      const authorProfileImage =
        comment.snippet.topLevelComment.snippet.authorProfileImageUrl;

      // Define "thankful" keywords to filter comments
      const thankfulKeywords = [
        'thank',
        'thanks',
        'thank you',
        'grateful',
        'appreciate',
        'થેંક્સ',
        'આભાર',
        'mast',
        'moj',
      ];

      // Check if the comment contains any of the thankful keywords
      const isThankful = thankfulKeywords.some((keyword) =>
        commentText.includes(keyword)
      );

      if (isThankful) {
        const commentHTML = `
          <div class="comment-card">
              <img src="${authorProfileImage}" alt="${authorName}" class="comment-author-image">
              <div class="comment-content">
                  <h4 class="comment-author">${authorName}</h4>
                  <p class="comment-text">${comment.snippet.topLevelComment.snippet.textDisplay}</p>
              </div>
          </div>
        `;
        commentsContainer.insertAdjacentHTML('beforeend', commentHTML);
        loadedComments++;

        // Hide comments after the first 3
        if (loadedComments > 3) {
          const commentCards = commentsContainer.querySelectorAll('.comment-card');
          commentCards.forEach((card, index) => {
            if (index >= 3 && !showingAllComments) {
              card.style.display = 'none';
            }
          });
        }
      }
    });

    // Update the button text based on whether all comments are shown
    updateShowMoreButton();
  }

  // Function to update the button text
  function updateShowMoreButton() {
    const button = document.getElementById('show-more');
    if (showingAllComments) {
      button.textContent = 'Show Less Comments';
    } else {
      button.textContent = 'Show More Comments';
    }
  }

  // Function to show more or fewer comments on button click
  function toggleComments() {
    const commentCards = commentsContainer.querySelectorAll('.comment-card');
    showingAllComments = !showingAllComments;

    commentCards.forEach((card, index) => {
      if (showingAllComments || index < 3) {
        card.style.display = 'flex'; // Show all comments or first 3 comments
      } else {
        card.style.display = 'none'; // Hide comments beyond the first 3
      }
    });

    updateShowMoreButton(); // Update button text based on current state
  }

  // Fetch the latest YouTube videos
  function fetchLatestVideos() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=3`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        videoGrid.innerHTML = ''; // Clear existing videos

        data.items.forEach(item => {
          if (item.id.kind === 'youtube#video') {
            const videoId = item.id.videoId;
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/${videoId}?si=LsFrdeMKeqh-w_4M"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            `;
            videoGrid.appendChild(videoCard);
          }
        });
      })
      .catch(error => console.error('Error fetching YouTube videos:', error));
  }

  // Initialize the fetch operations
  document.addEventListener('DOMContentLoaded', () => {
    fetchLatestVideos();
    fetchYouTubeComments();
  });

  // Event listener for "Show More" / "Show Less" button
  document.getElementById('show-more').addEventListener('click', toggleComments);

  // NAVBAR JS
  // JavaScript for the hamburger menu functionality
  const hamburger = document.getElementById('hamburger');
  const navlinks = document.getElementById('navlinks');

  hamburger.addEventListener('click', () => {
    // Toggle active class for hamburger and navlinks
    hamburger.classList.toggle('active');
    navlinks.classList.toggle('active');
  });

  // JavaScript to detect scroll and change class
  window.addEventListener('scroll', function () {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });