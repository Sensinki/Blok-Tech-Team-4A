const games = [
  {
    name: "hoi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_chinese-speaking_countries_and_territories.svg",
    liked: false,
  },
  {
    name: "Minecraft",
    image:
      "https://plainlanguagenetwork.org/wp-content/uploads/2017/05/banderashispanas-200.jpg",
    liked: false,
  },
  {
    name: "Super Mario Bros",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Greece_and_Cyprus.svg",
    liked: false,
  },
  {
    name: "League of Legends",
    image: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
    liked: false,
  },
  {
    name: "Call of Duty",
    image:
      "https://cdn-eu.purposegames.com/images/game/bg/96/ZYdKhTOijhE.png?s=1400",
    liked: false,
  },
  {
    name: "PlayerUnknown's Battlegrounds",
    image:
      "https://plainlanguagenetwork.org/wp-content/uploads/2017/07/Portuguese_Speaking_Country_Flags.png",
    liked: false,
  },
  {
    name: "Overwatch 2",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Bhutan.svg",
    liked: false,
  },
  {
    name: "Counter-Strike: Global Offensive",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
  {
    name: "Rocket League",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
  {
    name: "Roblox",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
];
const likedGames = games.filter((game) => game.liked);

const chats = likedGames.map((game) => {
  return {
    chatName: game.name,
    profilePicture: game.image,
    newMessageCount: 0,
    lastMessage: "",
  };
});

module.exports = chats;
