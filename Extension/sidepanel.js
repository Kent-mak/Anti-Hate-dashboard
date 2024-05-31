document.addEventListener('DOMContentLoaded', function() {
    const slider1 = document.getElementById('slider1');
    const slider1Value = document.getElementById('slider1Value');
    const slider2 = document.getElementById('slider2');
    const slider2Value = document.getElementById('slider2Value');
    const slider3 = document.getElementById('slider3');
    const slider3Value = document.getElementById('slider3Value');
    const slider4 = document.getElementById('slider4');
    const slider4Value = document.getElementById('slider4Value');
    const slider5 = document.getElementById('slider5');
    const slider5Value = document.getElementById('slider5Value');
    const slider6 = document.getElementById('slider6');
    const slider6Value = document.getElementById('slider6Value');
    const slider7 = document.getElementById('slider7');
    const slider7Value = document.getElementById('slider7Value');
    const comment_count = document.getElementById('max_comment');
    const submitButton = document.getElementById('submitButton');
    const inputForm = document.getElementById('inputForm');
    const commentsection = document.getElementById('comment-info');
    const container = document.getElementsByClassName('container mt-3');

    // Load saved values from chrome.storage
    chrome.storage.local.get(['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6', 'slider7', 'comment_count'], function(result) {
        if (result.slider1 !== undefined) {
            slider1.value = result.slider1;
            slider1Value.textContent = result.slider1;
        }
        if (result.slider2 !== undefined) {
            slider2.value = result.slider2;
            slider2Value.textContent = result.slider2;
        }
        if (result.slider3 !== undefined) {
            slider3.value = result.slider3;
            slider3Value.textContent = result.slider3;
        }
        if (result.slider4 !== undefined) {
            slider3.value = result.slider3;
            slider3Value.textContent = result.slider3;
        }
        if (result.slider5 !== undefined) {
            slider3.value = result.slider3;
            slider3Value.textContent = result.slider3;
        }
        if (result.slider6 !== undefined) {
            slider3.value = result.slider3;
            slider3Value.textContent = result.slider3;
        }
        if (result.slider7 !== undefined) {
            slider3.value = result.slider3;
            slider3Value.textContent = result.slider3;
        }
        if (result.comment_count !== undefined) {
            comment_count.value = result.comment_count;
        }
    });

    // Update displayed value as the slider moves
    slider1.addEventListener('input', ()=>{
        slider1Value.textContent = slider1.value;
        chrome.storage.local.set({slider1: slider1.value});
    });

    slider2.addEventListener('input', ()=>{
        slider2Value.textContent = slider2.value;
        chrome.storage.local.set({slider2: slider2.value});
    });

    slider3.addEventListener('input', ()=>{
        slider3Value.textContent = slider3.value;
        chrome.storage.local.set({slider3: slider3.value});
    });

    slider4.addEventListener('input', ()=>{
        slider4Value.textContent = slider4.value;
        chrome.storage.local.set({slider4: slider4.value});
    });

    slider5.addEventListener('input', ()=>{
        slider5Value.textContent = slider5.value;
        chrome.storage.local.set({slider5: slider5.value});
    });

    slider6.addEventListener('input', ()=>{
        slider6Value.textContent = slider6.value;
        chrome.storage.local.set({slider6: slider6.value});
    });

    slider7.addEventListener('input', ()=>{
        slider7Value.textContent = slider7.value;
        chrome.storage.local.set({slider7: slider7.value});
    });

    comment_count.addEventListener('input', ()=>{
        chrome.storage.local.set({comment_count: comment_count.value});
    });


    // Handle form submission
    submitButton.addEventListener('click', function() {
        // const slider1CurrentValue = slider1.value;
        // const slider2CurrentValue = slider2.value;
        // const slider3CurrentValue = slider3.value;
        commentsection.innerHTML = 'Loading...';
        for (let i=0; i<container.length; i++){
            container[i].style.display = 'none';
        }

        console.log('Slider 1 Value:', slider1.value);
        console.log('Slider 2 Value:', slider2.value);
        console.log('Slider 3 Value:', slider3.value);
        console.log('Slider 4 Value:', slider4.value);
        console.log('Slider 5 Value:', slider5.value);
        console.log('Slider 6 Value:', slider6.value);
        console.log('Slider 7 Value:', slider7.value);

        // Save the slider values to chrome.storage
        chrome.storage.local.set({
            slider1: slider1.value,
            slider2: slider2.value,
            slider3: slider3.value,
            slider4: slider4.value,
            slider5: slider5.value,
            slider6: slider6.value,
            slider7: slider7.value,
            comment_count: comment_count.value,
        }, function() {
            console.log('Values saved');
            console.log(`comment count: ${comment_count.value}`);
        });


        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError);
                return;
            }
        
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'FORM_SUBMITTED',
                    sliders: {
                        slider1: slider1.value,
                        slider2: slider2.value,
                        slider3: slider3.value,
                        slider4: slider4.value,
                        slider5: slider5.value,
                        slider6: slider6.value,
                        slider7: slider7.value,
                    },
                    comment_count: comment_count.value
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                    } else {
                        console.log('Response from content.js:', response);
                    }
                });
            }
        });

    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.type === 'showcomment'){
            commentsection.innerHTML = '';
            chrome.storage.local.get('commentData', (result) => {
            const commentData = result.commentData;
            const commentInfoDiv = document.getElementById('comment-info');
            
            if (commentData) {
                commentData.forEach(comment => {
                    // const tempDiv = document.createElement('div');
                    // tempDiv.innerHTML = comment;
                    // const cleanedComment = tempDiv.textContent || tempDiv.innerText || "";
                    // console.log(cleanedComment);

                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    const commentText = document.createElement('p');
                    // Set the text content of the paragraph element to the comment
                    commentText.textContent = cleanedComment;
                    // Append the comment element to the container
                    commentInfoDiv.appendChild(commentElement);
                }); 
                for (let i=0; i<container.length; i++){
                    container[i].style.display = '';
                }
            } else {
                commentInfoDiv.textContent = 'No comment available.';
            }
            });
        }
    });

    // // Function to apply the theme based on the user's preference
    // console.log("initial theme");
    // function applyTheme(theme) {
    //     if (theme === 'dark') {
    //         document.body.classList.add('dark-theme');
    //         document.body.classList.remove('light-theme');
    //         console.log("theme dark");
    //     } else {
    //         document.body.classList.add('light-theme');
    //         document.body.classList.remove('dark-theme');
    //         console.log("theme light");
    //     }
    // }

    // // Detect the preferred color scheme
    // const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // // Apply the preferred theme on initial load
    // applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');

    // // Listen for changes in the preferred color scheme
    // prefersDarkScheme.addEventListener('change', (event) => {
    //     applyTheme(event.matches ? 'dark' : 'light');
    // });
});

