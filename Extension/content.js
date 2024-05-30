// Waiting for loading complete
window.addEventListener('load', function() {
    // Use MutationObserver to observe the change of DOM
    const observer = new MutationObserver(hideComments);
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Define the function of hidding comments
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

    // Check
    if (videoIdMatch && videoIdMatch[1]) {
        var videoId = videoIdMatch[1];
        console.log("Current videoID is " + videoId);
    } else {
        console.log("Can't fine videoID");
    }
  });
  