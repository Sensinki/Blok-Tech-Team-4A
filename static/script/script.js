/* eslint-disable require-jsdoc */
const profiles = [
    { name: 'Karen', image: '/Blok-Tech-Team-4A/static/css/img/profiles/Sang.cv.jpg' },
    { name: 'Abdel', image: '/Blok-Tech-Team-4A/static/css/img/profiles/abdel.jpeg' },
    { name: 'angelo', image: '/Blok-Tech-Team-4A/static/css/img/profiles/angelo.jpeg' },
    // Voeg hier meer profielen toe
  ];
  
  let currentProfileIndex = 0;
  
  document.addEventListener('DOMContentLoaded', () => {
    const dislikeButton = document.querySelector('.DisLikeButton');
    
    dislikeButton.addEventListener('click', loadNextProfile);
    
    function loadNextProfile() {
      currentProfileIndex++;
      if (currentProfileIndex >= profiles.length) {
        currentProfileIndex = 0;
      }
    
      const currentProfile = profiles[currentProfileIndex];
    
      const profileImage = document.querySelector('.userimg');
      profileImage.style.backgroundImage = `url(${currentProfile.image})`;
    
      const profileName = document.querySelector('h3');
      profileName.textContent = currentProfile.name;
    }
  });
  
  