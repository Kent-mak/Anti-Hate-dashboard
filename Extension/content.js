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
});


  // Get current URL
  var url = window.location.href;

  // Get videoID
  var videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  let videoId;
  if (videoIdMatch && videoIdMatch[1]) {
    videoId = videoIdMatch[1];
    console.log(`Current video Id: ${videoId}`);
  } else {
    console.log("Can't find video ID");
  }

  console.log('content.js loaded');
  // Listen for messages from the background script or popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message:', request);
    console.log(`video Id: ${videoId}`)
    if (request.type === 'FORM_SUBMITTED' && videoId != undefined) {
      console.log('Form submitted with slider values:', request.sliders);
      const thresholds = [
        request.sliders.slider1,
        request.sliders.slider2,
        request.sliders.slider3,
        request.sliders.slider4,
        request.sliders.slider5,
        request.sliders.slider6,
        request.sliders.slider7
      ];
      const comment_count = request.comment_count;
      console.log(`comment count: ${comment_count}`)

      const url = `http://127.0.0.1:8000/?video_ID=${videoId}&threshold=${thresholds[0]}&threshold=${thresholds[1]}&threshold=${thresholds[2]}&threshold=${thresholds[3]}&threshold=${thresholds[4]}&threshold=${thresholds[5]}&threshold=${thresholds[6]}&comment_count=${comment_count}`;
      console.log("Fetching with URL:", url);

      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(
        data =>{
          console.log('Successfully sent video ID:', data);
          chrome.storage.local.set({ commentData: data }).then(() => {
            console.log("Value is set");
            chrome.runtime.sendMessage({ type: 'showcomment', data: data }, response => {
              console.log(response);
            });
          });
        })
      .catch(error => console.error('Error sending video ID:', error));

      // Send a response back if needed
      sendResponse({status: 'Form submission received'});
    }else {
      // Handle other message types if needed
      sendResponse({status: 'Unknown request type'});
    }
  });

  console.log('content.js ended');