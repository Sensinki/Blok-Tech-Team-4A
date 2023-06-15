/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// profielen //
const profiles = [
  {name: 'Karen', image: '/css/img/profiles/Sang.cv.jpg', game: 'Valorand'},
  {name: 'Abdel', image: '/css/img/profiles/abdel.jpeg', game: 'Minecraft'},
  {name: 'Angelo', image: '/css/img/profiles/angelo.jpeg', game: 'LOL'},

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

    const profileGame = document.querySelector('p');
    profileGame.textContent = currentProfile.game;

    const likeButton = document.querySelector('.LikeButton');

    likeButton.value = JSON.stringify(currentProfile); // Converteer het huidige profiel naar een JSON-string en stel het in als de waarde van de like-knop
  }
});

// -------------------------------------------------------- //
