/* eslint-disable indent */
const games = [
    {
        name: "Valorant",
        image: "https://images.wallpapersden.com/image/download/jett-in-valorant_a25pZWmUmZqaraWkpJRqZWWtamVl.jpg",
        liked: true,
    },
    {
        name: "Minecraft",
        image: "https://evanston.libnet.info/images/events/evanston/MINECRAFT.jpg",
        liked: true,
    },
    {
        name: "Super Mario Bros",
        image: "https://i1.sndcdn.com/artworks-zSZrnz6h449ayVc2-tVdK5A-t500x500.jpg",
        liked: true,
    },
    {
        name: "League of Legends",
        image: "https://i1.sndcdn.com/artworks-F8nb7TbuyzzUwhlI-ywW1eg-t500x500.jpg",
        liked: true,
    },
    {
        name: "Call of Duty",
        image: "https://i1.sndcdn.com/artworks-000609642196-ream62-t500x500.jpg",
        liked: false,
    },
    {
        name: "PlayerUnknown's Battlegrounds",
        image: "https://scale.coolshop-cdn.com/product-media.coolshop-cdn.com/AJ6QG7/a3f252a232904af2809b67eb08f59648.jpg/f/playerunknowns-battlegrounds-pubg.jpg",
        liked: false,
    },
    {
        name: "Overwatch 2",
        image: "https://cdn.dekudeals.com/images/27789a9a4c52400fbcd16cdb7b81eddfd6d0110d/w500.jpg",
        liked: false,
    },
    {
        name: "Counter-Strike: Global Offensive",
        image: "https://cdn.bynogame.com/games/1621692784950.jpeg",
        liked: false,
    },
    {
        name: "Rocket League",
        image: "https://i1.sndcdn.com/avatars-000601873275-fswppx-t500x500.jpg",
        liked: false,
    },
    {
        name: "Roblox",
        image: "https://cdns-images.dzcdn.net/images/cover/61911224b124fbba1e7a38957908d923/500x500.jpg",
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
