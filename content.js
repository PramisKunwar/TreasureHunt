const TREASURE_WORDS = ["CODE", "WEB", "GAME", "DATA", "NODE"];

const MAX_HIGHLIGHTS = 6;

function initGame() 
{
  chrome.storage.local.get(
    ["treasureWord", "collectedLetters", "treasureCount"],
    (data) => {
      let word = data.treasureWord;
      let collected = data.collectedLetters || [];
      let count = data.treasureCount || 0;


      if (!word) {
        word = pickRandomWord();
        chrome.storage.local.set({ treasureWord: word, collectedLetters: [] });
        collected = [];
      }


      highlightLetters(word, collected);
    }
  );
}

function pickRandomWord() 
{
  const index = Math.floor(Math.random() * TREASURE_WORDS.length);
  return TREASURE_WORDS[index];
}

function highlightLetters(word, collected) 
{

  const neededLetters = word.split("").filter((l) => !collected.includes(l));

 
  if (neededLetters.length === 0) return;

  
  const textNodes = getTextNodes(document.body);


  const candidates = [];

  textNodes.forEach((node) => 
    {
    const text = node.textContent;
    for (let i = 0; i < text.length; i++) 
      {
      const char = text[i].toUpperCase();
      if (neededLetters.includes(char)) {
        candidates.push({ node, index: i, letter: char });
      }
    }
  });

  shuffleArray(candidates);

  const toHighlight = candidates.slice(0, MAX_HIGHLIGHTS);

  const grouped = new Map();
  toHighlight.forEach((item) => 
    {
    if (!grouped.has(item.node)) 
      {
      grouped.set(item.node, []);
    }
    grouped.get(item.node).push(item);
  });

  grouped.forEach((items, node) => 
    {
   
    items.sort((a, b) => b.index - a.index);

    items.forEach((item) => {
      wrapLetterWithGlow(item.node, item.index, item.letter);
    });
  });
}
function wrapLetterWithGlow(textNode, charIndex, letter) 
{
  const text = textNode.textContent;

  if (charIndex >= text.length) return;

  const before = text.substring(0, charIndex);
  const after = text.substring(charIndex + 1);

  const span = document.createElement("span");
  span.textContent = text[charIndex];
  span.className = "treasure-letter";
  span.dataset.letter = letter; 


  span.addEventListener("click", () => onLetterClick(span, letter));

  const parent = textNode.parentNode;
  if (!parent) return;

  const beforeNode = document.createTextNode(before);
  const afterNode = document.createTextNode(after);

  parent.insertBefore(beforeNode, textNode);
  parent.insertBefore(span, textNode);
  parent.insertBefore(afterNode, textNode);
  parent.removeChild(textNode);
}

function onLetterClick(span, letter) 
{
  const plainText = document.createTextNode(span.textContent);
  span.parentNode.replaceChild(plainText, span);

  chrome.storage.local.get(
    ["treasureWord", "collectedLetters", "treasureCount"],
    (data) => {
      const word = data.treasureWord || "CODE";
      const collected = data.collectedLetters || [];
      const count = data.treasureCount || 0;

      if (!collected.includes(letter)) 
    {
        collected.push(letter);
      }


      chrome.storage.local.set({ collectedLetters: collected }, () => 
        {

        const allFound = word
          .split("")
          .every((l) => collected.includes(l));

        if (allFound) {

          showTreasureMessage(word);


          const newWord = pickRandomWord();
          chrome.storage.local.set({
            treasureWord: newWord,
            collectedLetters: [],
            treasureCount: count + 1,
          });
        }
      });
    }
  );
}
function showTreasureMessage(word) 
{
  const overlay = document.createElement("div");
  overlay.className = "treasure-overlay";

  overlay.innerHTML = `
    <div class="treasure-modal">
      <p class="treasure-emoji">🎉</p>
      <h2>Treasure Found!</h2>
      <p class="treasure-word-reveal">You discovered the word:</p>
      <p class="treasure-word-value">${word}</p>
      <button class="treasure-close-btn">Continue Hunting!</button>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector(".treasure-close-btn").addEventListener("click", () => {
    overlay.remove();
  });

  setTimeout(() => 
    {
    if (overlay.parentNode) overlay.remove();
  }, 5000);
}

function getTextNodes(element) 
{
  const nodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (
          tag === "SCRIPT" ||
          tag === "STYLE" ||
          tag === "NOSCRIPT" ||
          tag === "TEXTAREA" ||
          tag === "INPUT"
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.textContent.trim().length < 2) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  return nodes;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .treasure-letter {
      background: linear-gradient(135deg, #ffe0ec, #fce4ec);
      color: #d81b60;
      padding: 2px 4px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 700;
      display: inline;
      position: relative;
      box-shadow: 0 0 8px rgba(233, 30, 99, 0.3),
                  0 0 16px rgba(233, 30, 99, 0.15);
      animation: treasure-glow 2s ease-in-out infinite alternate;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .treasure-letter:hover {
      transform: scale(1.2);
      box-shadow: 0 0 14px rgba(233, 30, 99, 0.5),
                  0 0 28px rgba(233, 30, 99, 0.25);
    }

    @keyframes treasure-glow {
      0% {
        box-shadow: 0 0 6px rgba(233, 30, 99, 0.2),
                    0 0 12px rgba(233, 30, 99, 0.1);
      }
      100% {
        box-shadow: 0 0 12px rgba(233, 30, 99, 0.45),
                    0 0 24px rgba(233, 30, 99, 0.2);
      }
    }
    .treasure-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      animation: treasure-fade-in 0.3s ease;
    }

    @keyframes treasure-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .treasure-modal {
      background: linear-gradient(135deg, #fce4ec, #e8eaf6, #e0f7fa);
      border-radius: 20px;
      padding: 40px 48px;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      max-width: 340px;
    }

    .treasure-emoji {
      font-size: 56px;
      margin-bottom: 8px;
    }

    .treasure-modal h2 {
      font-size: 24px;
      color: #7c4dff;
      margin-bottom: 8px;
    }

    .treasure-word-reveal {
      font-size: 14px;
      color: #9e9ec0;
      margin-bottom: 4px;
    }

    .treasure-word-value {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #e91e63;
      margin-bottom: 20px;
    }

    .treasure-close-btn {
      background: linear-gradient(135deg, #b388ff, #7c4dff);
      color: white;
      border: none;
      padding: 10px 28px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .treasure-close-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.4);
    }
  `;
  document.head.appendChild(style);
}

injectStyles();
initGame();
