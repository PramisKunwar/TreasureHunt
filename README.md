# 🌸 Hidden Words Treasure Hunt — Chrome Extension

A simple Chrome Extension that turns normal browsing into a treasure hunt! Random letters on webpages glow softly — click them to collect letters and discover hidden words.

---

## ✨ How It Works

1. **Visit any webpage** — the extension scans the page text.
2. **Glowing letters appear** — a few letters softly glow in pastel pink. These match the current hidden treasure word.
3. **Click to collect** — clicking a glowing letter adds it to your collection.
4. **Complete the word** — once all letters are found, a celebration overlay appears! 🎉
5. **Keep hunting** — a new word is chosen and the game continues.

## 🎯 Treasure Words

The extension picks from these words: `CODE`, `WEB`, `GAME`, `DATA`, `NODE`.

## 📦 Files

```
extension/
├── manifest.json    
├── popup.html       
├── popup.css        
├── popup.js         
├── content.js       
└── icon.png         
```

## 🚀 How to Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from this project
5. The extension icon will appear in your toolbar — you're ready to hunt!

## 🧪 How to Test

1. After loading the extension, visit any text-heavy webpage (e.g., Wikipedia, a blog).
2. Look for **softly glowing pink letters** on the page.
3. Click them to collect letters.
4. Click the extension icon to see your progress — the hidden word shows as underscores, revealed as you collect.
5. Once all letters are found, a pastel celebration overlay appears!

## 🛠 Tech Details

- **Manifest V3** Chrome Extension
- **No external dependencies** — pure HTML, CSS, and vanilla JavaScript
- **chrome.storage.local** for persisting game state
- Everything runs 100% locally in the browser

## 🎨 Design

- Cute pastel gradient theme (pink, lavender, mint)
- Soft glow animation on treasure letters
- Clean, rounded popup UI
- Celebration overlay with confetti emoji

---

Made with 💖 for Hack club.