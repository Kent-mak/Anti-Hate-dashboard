// Waiting for loading complete
window.addEventListener('load', function() {
  // Use MutationObserver to observe the change of DOM
  const observer = new MutationObserver(hideComments);
  observer.observe(document.body, { childList: true, subtree: true });

  // Define the function of hiding comments
  function hideComments() {
    const commentSection = document.getElementById('comments');
    if (commentSection) {
      commentSection.style.display = 'none';
    }
  }

  // Hide the comments
  hideComments();

  // Get current URL
  var url = window.location.href;

  // Get videoID
  var videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  
  //var threashold = [0.5, 0.05, 0.1, 0.1, 0.1, 0.5];
  // Check
  if (videoIdMatch && videoIdMatch[1]) {
      var videoId = videoIdMatch[1];
      console.log("Current videoID is " + videoId);
      fetch('http://127.0.0.1:8000/?video_ID=' + videoId + '&threshold=0.5&threshold=0.05&threshold=0.1&threshold=0.1&threshold=0.1&threshold=0.1&threshold=0.5'+'comment_amount=50', {
          method: 'GET',
          // mode: 'no-cors',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => console.log('Successfully sent video ID:', data))
      .catch(error => console.error('Error sending video ID:', error));
  } else {
      console.log("Can't find video ID");
  }
});
