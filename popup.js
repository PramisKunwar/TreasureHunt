//This is popup.js
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    ["treasureWord", "collectedLetters", "treasureCount"],
    (data) => {
      const word = data.treasureWord || "CODE";

      const collected = data.collectedLetters || [];

      const count = data.treasureCount || 0;

      const wordDisplay = document.getElementById("treasure-word");

      const displayChars = word.split("").map((letter) => {

        if (collected.includes(letter)) 
          {
          return letter;
        }
        return "_";
      });

             wordDisplay.textContent = displayChars.join(" ");


      const collectedDisplay = document.getElementById("collected-letters");
      if (collected.length > 0) {
        collectedDisplay.textContent = collected.join(" ");
      } else {
        collectedDisplay.textContent = "—";
      }


      document.getElementById("treasure-count").textContent = count;
    }
  );
});