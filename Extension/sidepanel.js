const buttonElement = document.getElementById('btn');
buttonElement.addEventListener('click', () => {
  // Get the active tab and send a message to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const btnInfoDiv = document.getElementById('button-info');
    const commentInfoDiv = document.getElementById('comment-info');
    const activeTab = tabs[0];

    // Collect current slider values
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');
    let sliderValues = [];
    sliderWrappers.forEach((wrapper) => {
    const valueDisplay = wrapper.querySelector('.value-display');
    sliderValues.push(parseFloat(valueDisplay.textContent));
    });

    chrome.tabs.sendMessage(activeTab.id, { type: 'logToConsole', data: 'Button clicked!', sliders: sliderValues }, (response) => {
      if (response && response.success) {
        console.log('Message logged to console.');
        btnInfoDiv.innerHTML = '';
        commentInfoDiv.innerHTML = 'Loading...';
      } else {
        console.error('Failed to log message to console.');
      }
    })
  })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'showcomment'){
      console.log('check');
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

  const sliderWrappers = document.querySelectorAll('.slider-wrapper');

  sliderWrappers.forEach((wrapper, index) => {
    const slider = wrapper.querySelector('.slider');
    const progressBar = slider.querySelector('.progress-bar');
    const progressKnob = slider.querySelector('.progress-knob');
    const progressContainer = slider.querySelector('.progress-container');
    const valueDisplay = slider.querySelector('.value-display');
  
    const stepSize = 0.01;
    
    const valueMapping = {
      0: 0.6,
      1: 0.1,
      2: 0.8
    };
    let currentValue = valueMapping[index] !== undefined ? valueMapping[index] : index * 0.25;
  
    let isDragging = false;
  
    function updateProgress(value) {
      value = Math.max(0, Math.min(value, 1));
      currentValue = Math.round(value / stepSize) * stepSize;
      const progressPercentage = currentValue * 100;
      progressBar.style.width = `${progressPercentage}%`;
      progressKnob.style.left = `calc(${progressPercentage}% - 10px)`;
      valueDisplay.textContent = currentValue.toFixed(2);
    }
  
    updateProgress(currentValue); // Initialize the slider with the initial value
  
    progressKnob.addEventListener('mousedown', () => {
      isDragging = true;
    });
  
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const containerRect = progressContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const progressPercentage = Math.max(0, Math.min((e.clientX - containerRect.left) / containerWidth, 1));
        updateProgress(progressPercentage);
      }
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });