// Function to set Doge Numbers
function setDoge() {
  const dogeNumber = document.querySelector("#dogeNumber")?.value;
  if (!dogeNumber) {
      alert("Please enter a valid Doge Number!");
      return;
  }
  
  chrome.storage.local.get("DogeNumbers", function(result) {
      let dogeNumbers = result.DogeNumbers || [];
      if (!dogeNumbers.includes(dogeNumber)) {
          dogeNumbers.push(dogeNumber);
          chrome.storage.local.set({ "DogeNumbers": dogeNumbers }, () => {
              alert("Doge set!");
          });
      } else {
          alert("Doge already exists!");
      }
  });
}

// Functions for username flag
function setUsernameset() {
  chrome.storage.sync.set({ 'usernameset': 1 }, () => {
      console.log('Username flag set to 1');
      alert("Reply With Username ON!");
  });
}

function deleteUsernameset() {
  chrome.storage.sync.remove('usernameset', () => {
      console.log('Username flag removed');
      alert("Reply With Username OFF!");
  });
}

// Function to reset Doge Numbers
function resetDoge() {
  chrome.storage.local.remove("DogeNumbers", () => {
      console.log("All DogeNumbers removed");
      alert("Doge reset!");
  });
}

// Event listeners for popup buttons
document.addEventListener("DOMContentLoaded", function() {
  const setDogeButton = document.querySelector("#setDogeButton");
  const resetDogeButton = document.querySelector("#resetDogeButton");
  const setUsernameButton = document.querySelector("#setUsernameButton");
  const offusernamebutton = document.querySelector("#offusernamebutton");

  setDogeButton?.addEventListener("click", setDoge);
  resetDogeButton?.addEventListener("click", resetDoge);
  setUsernameButton?.addEventListener("click", setUsernameset);
  offusernamebutton?.addEventListener("click", deleteUsernameset);
});

// Function to add GM/GN buttons to tweets
function addButtonToTweet(tweet) {
  const likeButton = tweet.querySelector('[data-testid="like"]') || 
                    tweet.querySelector('button[aria-label*="Like"]') ||
                    tweet.querySelector('.css-1dbjc4n.r-1iusvr4.r-46vdb2');
  if (!likeButton) return;

  const parentContainer = likeButton.closest('div[role="group"]') || likeButton.parentNode;

  // GM Button
  if (!tweet.querySelector(".gm-button")) {
      const newButton1 = document.createElement("button");
      newButton1.innerHTML = "GM";
      newButton1.classList.add("gm-button", "my-button");
      Object.assign(newButton1.style, {
          background: "linear-gradient(135deg, #A5BAFF 0%, #7289DA 100%)",
          color: "white",
          padding: "0.5em 1em",
          borderRadius: "25px",
          fontSize: "0.9em",
          fontWeight: "600",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          margin: "0 0.5em",
          height: "2.2em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
      });
      newButton1.addEventListener("mouseover", () => {
          newButton1.style.transform = "scale(1.05)";
          newButton1.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      });
      newButton1.addEventListener("mouseout", () => {
          newButton1.style.transform = "scale(1)";
          newButton1.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
      });
      newButton1.addEventListener("click", () => handleButtonClick(tweet, "gm"));
      insertButton(parentContainer, newButton1, likeButton);
  }

  // GN Button
  const retweetButton = tweet.querySelector('[data-testid="retweet"]') || 
                       tweet.querySelector('button[aria-label*="Retweet"]');
  if (!retweetButton || tweet.querySelector(".gn-button")) return;

  const newButton2 = document.createElement("button");
  newButton2.innerHTML = "GN";
  newButton2.classList.add("gn-button", "my-button");
  Object.assign(newButton2.style, {
      background: "linear-gradient(135deg, #FFA5BD 0%, #FF69B4 100%)",
      color: "white",
      padding: "0.5em 1em",
      borderRadius: "25px",
      fontSize: "0.9em",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      margin: "0 0.5em",
      height: "2.2em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
  });
  newButton2.addEventListener("mouseover", () => {
      newButton2.style.transform = "scale(1.05)";
      newButton2.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  });
  newButton2.addEventListener("mouseout", () => {
      newButton2.style.transform = "scale(1)";
      newButton2.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  });
  newButton2.addEventListener("click", () => handleButtonClick(tweet, "gn"));
  insertButton(parentContainer, newButton2, retweetButton);
}

// Helper function to insert buttons with better alignment
function insertButton(parentContainer, newButton, referenceButton) {
  if (parentContainer.style.display !== "flex") {
      parentContainer.style.display = "flex";
      parentContainer.style.alignItems = "center";
  }
  parentContainer.insertBefore(newButton, referenceButton.nextSibling || null);
}

// Handle GM/GN button clicks
async function handleButtonClick(tweet, type) {
  const replyButton = tweet.querySelector('[data-testid="reply"]') || 
                     tweet.querySelector('button[aria-label*="Reply"]');
  if (!replyButton) return;

  replyButton.click();
  await new Promise(resolve => setTimeout(resolve, 500));

  const tweetArea = document.querySelector('[data-testid="tweetTextarea_0"]') || 
                   document.querySelector('div[role="textbox"][contenteditable="true"]');
  if (!tweetArea) {
      console.error('Tweet area not found on x.com');
      return;
  }

  const messages = type === "gm" ? gmMessages : gnMessages;
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];
  
  const displayNameElement = tweet.querySelector('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0') || 
                            tweet.querySelector('span[class*="username"]') ||
                            tweet.querySelector('a[role="link"] span');
  const displayName = displayNameElement ? displayNameElement.innerText.split(' ')[0] : '';

  chrome.storage.sync.get("usernameset", function(result) {
      const pasteText = result.usernameset === 1 ? `${message} ${displayName}!` : `${message}!`;
      
      chrome.storage.local.get("DogeNumbers", async function(result) {
          const dogeNumber = result.DogeNumbers?.slice(-1)[0];
          if (!dogeNumber) {
              console.error('No DogeNumbers found');
              return;
          }

          const url = `https://d3cvnrw4bpahxk.cloudfront.net/thedogepound/${type}/${dogeNumber}.png`;
          try {
              const response = await fetch(url);
              if (!response.ok) throw new Error('Image fetch failed');
              const blob = await response.blob();
              const dataTransfer = new DataTransfer();
              dataTransfer.setData("text/plain", pasteText);
              dataTransfer.items.add(new File([blob], "image.png", { type: "image/png" }));
              
              const pasteEvent = new ClipboardEvent("paste", { clipboardData: dataTransfer, bubbles: true });
              tweetArea.dispatchEvent(pasteEvent);
          } catch (error) {
              console.error(`Error fetching ${type} image from ${url}:`, error);
          }
      });
  });
}

const gmMessages = [
  "GM", "gm", "Gm gm", "Good Morning!", "GM frens!", "Rise and grind!"
];
const gnMessages = [
  "GN", "gn", "Gn gn", "Good Night!", "Sweet dreams!", "GN fam!"
];

// Main function to handle new tweets and toolbars
function handleNewTweets() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]') || 
                document.querySelectorAll('article[role="article"]');
  tweets.forEach(tweet => {
      const buttons = tweet.querySelectorAll(".my-button");
      if (buttons.length < 2) {
          addButtonToTweet(tweet);
      }
  });

  const toolbars = document.querySelectorAll('[data-testid="toolBar"]') || 
                  document.querySelectorAll('div[role="toolbar"]');
  toolbars.forEach(toolbar => {
      if (toolbar.querySelectorAll(".my-button").length < 3) {
          addToolbarButtons(toolbar);
      }
  });
}

// Function to add toolbar buttons (Memes, Caption, ReplyGPT)
function addToolbarButtons(toolbar) {
  // Ensure toolbar is flex for proper alignment
  toolbar.style.display = "flex";
  toolbar.style.alignItems = "center";
  toolbar.style.gap = "0.5em";

  // Meme Button with Dropdown
  const dogeMemeBtn = document.createElement("button");
  dogeMemeBtn.innerHTML = "Memes";
  Object.assign(dogeMemeBtn.style, {
      background: "linear-gradient(135deg, #A5BAFF 0%, #7289DA 100%)",
      color: "white",
      padding: "0.4em 0.8em",
      borderRadius: "20px",
      fontSize: "0.85em",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "2em",
      display: "flex",
      alignItems: "center"
  });
  dogeMemeBtn.classList.add("my-button");
  dogeMemeBtn.addEventListener("mouseover", () => {
      dogeMemeBtn.style.transform = "scale(1.05)";
      dogeMemeBtn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  });
  dogeMemeBtn.addEventListener("mouseout", () => {
      dogeMemeBtn.style.transform = "scale(1)";
      dogeMemeBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  });

  const dropdownMenu = document.createElement("select");
  Object.assign(dropdownMenu.style, {
      background: "#A5BAFF",
      color: "white",
      padding: "0.3em",
      borderRadius: "15px",
      fontSize: "0.85em",
      border: "none",
      cursor: "pointer",
      height: "2em",
      marginLeft: "0.3em"
  });

  const memeOptions = [
      { text: "Memes", value: "" },
      { text: "Adopt a Doge", value: "signadoptadoge/" },
      { text: "I don't Bite", value: "signidontbite/" },
      { text: "Join Us", value: "signjoinus/" },
      { text: "Mostly Harmless", value: "signmostlyharmless/" },
      { text: "NFA", value: "signnfa/" },
      { text: "Verified", value: "signverified/" },
      { text: "Yump", value: "signyump/" },
      { text: "Angry", value: "angry/" },
      { text: "Blush", value: "blush/" },
      { text: "Crying", value: "crying/" },
      { text: "Cute -Uwu-", value: "cute/" },
      { text: "The Finger", value: "flipping/" },
      { text: "Pie", value: "pie/" },
      { text: "Strong", value: "strong/" },
      { text: "Thumbs Up", value: "thumbsup/" },
      { text: "Bonk", value: "bonk/" }
  ];

  memeOptions.forEach(opt => {
      const option = document.createElement("option");
      option.innerText = opt.text;
      option.value = opt.value;
      dropdownMenu.appendChild(option);
  });

  dropdownMenu.addEventListener("change", async () => {
      const tweetArea = document.querySelector("[data-testid='tweetTextarea_0']") || 
                       document.querySelector('div[role="textbox"][contenteditable="true"]');
      if (!tweetArea || !dropdownMenu.value) return;

      chrome.storage.local.get("DogeNumbers", async result => {
          const dogeNumber = result.DogeNumbers?.slice(-1)[0];
          if (!dogeNumber) {
              console.error('No DogeNumbers found');
              return;
          }

          const imageUrl = `https://d3cvnrw4bpahxk.cloudfront.net/thedogepound/${dropdownMenu.value}${dogeNumber}.png`;
          try {
              const response = await fetch(imageUrl);
              if (!response.ok) throw new Error('Image fetch failed');
              const blob = await response.blob();
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(new File([blob], "image.png", { type: "image/png" }));
              const pasteEvent = new ClipboardEvent("paste", { clipboardData: dataTransfer, bubbles: true });
              tweetArea.dispatchEvent(pasteEvent);
          } catch (error) {
              console.error("Error fetching meme image from x.com:", error);
          }
      });
  });

  dogeMemeBtn.appendChild(dropdownMenu);

  // Refresh Caption Button
  const refreshBtn = document.createElement("button");
  refreshBtn.innerHTML = "New Caption";
  Object.assign(refreshBtn.style, {
      background: "linear-gradient(135deg, #FFA5A5 0%, #FF6347 100%)",
      color: "white",
      padding: "0.4em 0.8em",
      borderRadius: "20px",
      fontSize: "0.85em",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "2em",
      display: "flex",
      alignItems: "center"
  });
  refreshBtn.classList.add("my-button");
  refreshBtn.addEventListener("mouseover", () => {
      refreshBtn.style.transform = "scale(1.05)";
      refreshBtn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  });
  refreshBtn.addEventListener("mouseout", () => {
      refreshBtn.style.transform = "scale(1)";
      refreshBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  });

  const sampleTexts = [
      "yo morning!", "GM frens, let's crush it!🌞", "Good morning everyone, happy day!🥰",
      "Web3 Legends, GM and prosper.✨", "GM degens, enjoy your day!😊", "X fam, GM and thrive.🐦",
      "GN all, sweet dreams!🌙", "To the GM gang, rise up!🍵", "GM to all the people!🫶",
      "GM Web3 OGs, innovate on!🔥", "GM Kings & Queens, rule today!😀", "GM fam, happy day ahead.🩵",
      "Goodnight fam, rest well.😴", "To the night owls, GN and prosper!🦉", "GN everyone, see you in the morning.🌄",
      "Sleep tight, GN and recharge!💤", "Sweet dreams, GN and be blessed.🙏", "Gn 🌃🌠", "gn 🌜🌟",
      "Gn 🌌💭", "GN 🙏🏼💤"
  ];

  function getRandomText() {
      return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  }

  refreshBtn.addEventListener("click", () => {
      setTimeout(() => {
          const tweetArea = document.querySelector("[data-testid='tweetTextarea_0']") || 
                          document.querySelector('div[role="textbox"][contenteditable="true"]');
          if (tweetArea) {
              const dataTransfer = new DataTransfer();
              dataTransfer.setData("text/plain", getRandomText());
              const pasteEvent = new ClipboardEvent("paste", { clipboardData: dataTransfer, bubbles: true });
              tweetArea.dispatchEvent(pasteEvent);
          } else {
              console.error("Tweet area not found on x.com");
          }
      }, 50);
  });

  // ReplyGPT Button
  const GPTBtn = document.createElement("button");
  GPTBtn.innerHTML = "ReplyGPT🐶";
  Object.assign(GPTBtn.style, {
      background: "linear-gradient(135deg, #00acee 0%, #1DA1F2 100%)",
      color: "white",
      padding: "0.4em 0.8em",
      borderRadius: "20px",
      fontSize: "0.85em",
      fontWeight: "600",
      border: "none",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "2em",
      display: "flex",
      alignItems: "center"
  });
  GPTBtn.classList.add("my-button");
  GPTBtn.addEventListener("mouseover", () => {
      GPTBtn.style.transform = "scale(1.05)";
      GPTBtn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  });
  GPTBtn.addEventListener("mouseout", () => {
      GPTBtn.style.transform = "scale(1)";
      GPTBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  });

  GPTBtn.addEventListener("click", async () => {
      const tweetTextElement = document.querySelector('[data-testid="tweetText"]') || 
                              document.querySelector('div[data-testid="tweet"] span') ||
                              document.querySelector('article span');
      if (!tweetTextElement) return;

      let tweetText = tweetTextElement.innerText.replace(/https?:\/\/\S+/gi, "").trim();
      try {
          const response = await fetch('https://test-43cp.onrender.com/usegpt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: tweetText })
          });

          if (response.ok) {
              const { data } = await response.json();
              navigator.clipboard.writeText(data).then(() => {
                  setTimeout(() => {
                      const tweetArea = document.querySelector('[data-testid="tweetTextarea_0"]') || 
                                       document.querySelector('div[role="textbox"][contenteditable="true"]');
                      if (tweetArea) {
                          tweetArea.focus();
                          document.execCommand('insertHTML', false, data);
                      } else {
                          console.error("Tweet area not found for ReplyGPT on x.com");
                      }
                  }, 2000);
              });
          } else {
              console.error('GPT request failed:', response.status);
          }
      } catch (error) {
          console.error('Error with ReplyGPT on x.com:', error);
      }
  });

  // Append buttons to toolbar
  toolbar.appendChild(dogeMemeBtn);
  toolbar.appendChild(refreshBtn);
  toolbar.appendChild(GPTBtn);
}

// Start observing x.com DOM
handleNewTweets();
const observer = new MutationObserver(handleNewTweets);
observer.observe(document.body, { childList: true, subtree: true });
