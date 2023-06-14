const clickme = document.getElementById("click-me"); // Haal het element op met de ID "click-me" en sla het op in de variabele clickme
const audio = document.getElementById("hello-audio"); // Haal het audio-element op met de ID "hello-audio" en sla het op in de variabele audio

clickme.addEventListener("click", () => {
  // Voeg een klikgebeurtenisluisteraar toe aan het clickme-element
  audio.play(); // Speel het audio-element af
});
