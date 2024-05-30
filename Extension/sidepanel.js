chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'showcomment'){
      chrome.storage.local.get('commentData', (result) => {
        const commentData = result.commentData;
        const commentInfoDiv = document.getElementById('comment-info');
        if (commentData) {
          commentInfoDiv.innerHTML = `<pre>${JSON.stringify(commentData, null, 2)}</pre>`;
        } else {
          commentInfoDiv.textContent = 'No comment data available.';
        }
      });
    }
  });