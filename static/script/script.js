/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

// profielen //
const profiles = [
  {name: 'Valorant', image: '/css/img/profiles/valorant.jpeg', game: 'Valorant'},
  {name: 'Minecraft', image: '/css/img/profiles/minecraft.jpeg', game: 'Minecraft'},
  {name: 'League of Legend', image: '/css/img/profiles/lol.jpeg', game: 'LOL'},
];

// const profiles = require('./script/profiles');
// const profiles = require('./static/script/profiles.');
// console.log('niet verbonden bitch.');


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
