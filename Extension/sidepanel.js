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