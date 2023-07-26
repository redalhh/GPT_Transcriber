// ==UserScript==
// @name        GPT Trascriber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       Rεδα
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  let rec; // Declare the recognition variable outside the function
  let isRec = false; // Flag to keep track of whether recognition is on

  function handleVoiceInput() {
    if (!rec) {
      // Create a new SpeechRecognition instance if it doesn't exist
      rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      rec.lang = 'en-US';
      rec.lang = 'ar-AR';
      rec.lang = 'fr-FR';
      rec.lang = 'ar-MA ';
      rec.continuous = true; // Set continuous to true for continuous speech recognition

      // When speech recognition results are available
      rec.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript;

        // Do something with the recognized speech (e.g., insert it into the text area)
        const chatTextField = getChatTextField();
        if (chatTextField) {
          chatTextField.value += transcript.trim() + ' ' ;
        }
      };

      // If speech recognition encounters an error
      rec.onerror = function(event) {
        console.error('error:', event.error);
        stopRec();
      };
    }

    if (!isRec) {
      // If recognition is not running, start it
      rec.start();
      isRec = true;
    }
  }

  function stopRec() {
    if (isRec) {
      // If recognition is running, stop it
      rec.stop();
      isRec = false;
    }
  }

  function getChatTextField() {
    // Get the chat text field element (update the selector if needed)
    return document.querySelector('#prompt-textarea');
  }

  function createMicrophoneIcon() {
    // Create the microphone icon as an SVG element
    const MicIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    MicIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    MicIcon.setAttribute('width', '16');
    MicIcon.setAttribute('height', '16');
    MicIcon.setAttribute('viewBox', '0 0 24 24');
    MicIcon.style.fill = 'rgba(107, 108, 123, 1)';

    // Insert the provided SVG content
    MicIcon.innerHTML = `
      <path d="M12 16c2.206 0 4-1.794 4-4V6c0-2.217-1.785-4.021-3.979-4.021a.933.933 0 0 0-.209.025A4.006 4.006 0 0 0 8 6v6c0 2.206 1.794 4 4 4z"></path>
      <path d="M11 19.931V22h2v-2.069c3.939-.495 7-3.858 7-7.931h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6H4c0 4.072 3.061 7.436 7 7.931z"></path>
    `;

    // Style the microphone icon (optional)
    MicIcon.style.cursor = 'pointer';
    MicIcon.style.marginLeft = '5px';

    return MicIcon;
  }

  function addMicrophoneIcon() {
    const chatTextField = getChatTextField();
    if (chatTextField) {
      // Add the microphone icon next to the chat text field
      const MicIcon = createMicrophoneIcon();
      MicIcon.onmousedown = handleVoiceInput;
      MicIcon.onmouseup = stopRec;
      MicIcon.ontouchstart = handleVoiceInput;
      MicIcon.ontouchend = stopRec;

      chatTextField.parentNode.appendChild(MicIcon);
    }
  }

  // Call the functions to add the icons once the page has loaded
  window.addEventListener('load', addMicrophoneIcon);
})();

