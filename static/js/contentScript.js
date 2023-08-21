//function to set Doge Numbers where dogeNumber is inputed from the tab
function setDoge()
{
	var dogeNumbers;
	var dogeNumber = document.querySelector("#dogeNumber").value;
	chrome.storage.local.get("DogeNumbers", function (result)
	{
		if (result.DogeNumbers)
		{
			dogeNumbers = result.DogeNumbers;
		}
		else
		{
			dogeNumbers = [];
		}

		if (dogeNumber && !dogeNumbers.includes(dogeNumber))
		{
			dogeNumbers.push(dogeNumber);
			chrome.storage.local.set(
			{
				"DogeNumbers": dogeNumbers
			});
		}
	});
	alert("Doge set!");
}

//function to flag set to 1 
function setUsernameset()
{
	chrome.storage.sync.set(
	{
		'usernameset': 1
	}, function ()
	{
		console.log('Value is set to 1 turn on Username');
	});
	alert("Reply With Username ON!");
}
//function to delete the flag to undefine

function deleteUsernameset()
{
	chrome.storage.sync.remove('usernameset', function ()
	{
		console.log('Value of usernameset is deleted');
	});
	alert("Reply With Username OFF!");
}

//function to delete the resource of any variable / simply to delete the doge number from chrome storage api

function resetDoge()
{
	chrome.storage.local.remove("DogeNumbers", function ()
	{
		console.log("All DogeNumbers have been removed from the Chrome Storage API.");
	});
	alert("Doge reset!");
}

//event listener to check for any clicks on the buttons existing on the tab

document.addEventListener("DOMContentLoaded", function ()
{
	var setDogeButton = document.querySelector("#setDogeButton");
	var resetDogeButton = document.querySelector("#resetDogeButton");


	if (setDogeButton !== null)
	{
		setDogeButton.addEventListener("click", setDoge);
	}

	if (resetDogeButton !== null)
	{
		resetDogeButton.addEventListener("click", resetDoge);
	}
	if (setUsernameButton != null)
	{
		setUsernameButton.addEventListener("click", setUsernameset);
	}
	if (offusernamebutton !== null)
	{
		offusernamebutton.addEventListener("click", deleteUsernameset);
	}

});

//function to add tweets (the GM and GN button next to the like (where like is the testid))
function addButtonToTweet(tweet)
{
	const likeButton = tweet.querySelector('[data-testid="like"]');
	if (!likeButton)
	{
		return;
	}
	const newButton1 = document.createElement("button");
	newButton1.innerHTML = "GM";
	newButton1.style.backgroundColor = "#A5BAFF";
	newButton1.style.color = "white"
	newButton1.classList.add("my-button");
	newButton1.style.padding = "8px";
	newButton1.style.width = "80px";
	newButton1.style.borderRadius = "35px";
	newButton1.style.fontSize = "14px";
	//gmMessages all messages that has to be pre-populated on the text-area
	const gmMessages = [
		"GM",
		"GM",
		"gm",
		"GM",
		"Gm gm",
		"Gm gm"
	];

	newButton1.addEventListener("click", async () =>
	{
		const replyButton = tweet.querySelector('[data-testid="reply"]');

		if (replyButton)
		{
			replyButton.click();

			setTimeout(() =>
			{
				const tweetArea = document.querySelector('[data-testid="tweetTextarea_0"]');

				if (tweetArea)
				{
					try
					{
						const randomIndex = Math.floor(Math.random() * gmMessages.length);
						const gmMessage = gmMessages[randomIndex];

						var displayNameElement = tweet.querySelector('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
						var displayName = displayNameElement ? displayNameElement.innerText.split(' ')[0] : '';

						// Check for usernameset on chrome storage local api
						chrome.storage.sync.get("usernameset", function (result)
						{
							let pasteText;

							if (result.usernameset && result.usernameset === 1)
							{
								pasteText = `${gmMessage} ${displayName}!`;
							}
							else
							{
								pasteText = `${gmMessage}!`;
							}

							chrome.storage.local.get("DogeNumbers", function (result)
							{
								let dogeNumber;

								if (result.DogeNumbers && result.DogeNumbers.length > 0)
								{
									dogeNumber = result.DogeNumbers[result.DogeNumbers.length - 1];
								}
								else
								{
									console.error('No DogeNumbers found in storage');
									return;
								}

								const url = "https://d3cvnrw4bpahxk.cloudfront.net/thedogepound/gm/" + dogeNumber + ".png";

								const dataTransfer = new DataTransfer();
								dataTransfer.setData("text/plain", pasteText);

								fetch(url)
									.then(response => response.blob())
									.then(blob =>
									{
										dataTransfer.items.add(new File([blob], "image.png",
										{
											type: "image/png"
										}));

										const pasteEvent = new ClipboardEvent("paste",
										{
											clipboardData: dataTransfer,
											bubbles: true
										});

										tweetArea.dispatchEvent(pasteEvent);
									})
									.catch(error => console.error(error));
							});
						});
					}
					catch (err)
					{
						console.error(err);
					}
				}
				else
				{
					console.error('Tweet area not found');
				}
			}, 500);
		}
	});

	likeButton.parentNode.insertBefore(newButton1, likeButton.nextSibling);
	const retweetButton = tweet.querySelector('[data-testid="retweet"]');
	if (!retweetButton)
	{
		return;
	}
	const newButton2 = document.createElement("button");
	newButton2.innerHTML = "GN";
	newButton2.style.backgroundColor = "#FFA5BD";
	newButton2.style.color = "white"
	newButton2.classList.add("my-button");
	newButton2.style.padding = "8px";
	newButton2.style.width = "80px";
	newButton2.style.borderRadius = "35px";
	newButton2.style.fontSize = "14px";
	const gnMessages = [
		"GN gn",
		" GN ",
		" Gn ",
		" gN ",
		"Gn ",
		"gn ",
		" Gn ",
		" GN ",
	];

	if (likeButton.nextSibling)
	{
		likeButton.parentNode.insertBefore(newButton2, likeButton.nextSibling.nextSibling);
	}
	else
	{
		likeButton.parentNode.appendChild(newButton2);
	}

	newButton2.addEventListener("click", async () =>
	{
		const replyButton = tweet.querySelector('[data-testid="reply"]');
		if (replyButton)
		{
			replyButton.click();
			setTimeout(() =>
			{
				const tweetArea = document.querySelector('[data-testid="tweetTextarea_0"]');
				if (tweetArea)
				{
					try
					{
						const randomIndex = Math.floor(Math.random() * gnMessages.length);
						const gnMessage = gnMessages[randomIndex];
						var displayNameElement = tweet.querySelector('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
						//here to only extract the first name of the twitter user
						var displayName = displayNameElement ? displayNameElement.innerText.split(' ')[0] : '';

						// Check for usernameset on chrome storage local api
						chrome.storage.sync.get("usernameset", function (result)
						{
							let pasteText;
							if (result.usernameset && result.usernameset === 1)
							{ // Display displayName only if usernameset is set to 1
								pasteText = `${gnMessage}${displayName ? ' ' + displayName + '!' : ''}`;
							}
							else
							{ // Otherwise, do not display displayName
								pasteText = `${gnMessage}`;
							}

							chrome.storage.local.get("DogeNumbers", function (result)
							{
								let dogeNumber;
								if (result.DogeNumbers && result.DogeNumbers.length > 0)
								{
									dogeNumber = result.DogeNumbers[result.DogeNumbers.length - 1];
								}
								else
								{
									console.error('No DogeNumbers found in storage');
									return;
								}
								const url = "https://d3cvnrw4bpahxk.cloudfront.net/thedogepound/gn/" + dogeNumber + ".png";

								const dataTransfer = new DataTransfer();
								dataTransfer.setData("text/plain", pasteText);
								fetch(url)
									.then(response => response.blob())
									.then(blob =>
									{
										dataTransfer.items.add(new File([blob], "image.png",
										{
											type: "image/png"
										}));
										const pasteEvent = new ClipboardEvent("paste",
										{
											clipboardData: dataTransfer,
											bubbles: true
										});
										tweetArea.dispatchEvent(pasteEvent);
									})
									.catch(error => console.error(error));
							});
						});
					}
					catch (err)
					{
						console.error(err);
					}
				}
				else
				{
					console.error('Tweet area not found');
				}
			}, 500);
		}
	});
}

function handleNewTweets()
{
	const existingTweets = document.querySelectorAll('[data-testid="tweet"]');
	existingTweets.forEach((tweet) =>
	{
		const buttonsAdded = tweet.querySelectorAll(".my-button");
		if (buttonsAdded.length < 2)
		{
			addButtonToTweet(tweet);
		}
	});
	// for the meme section to enable drag down menu 
	const toolbars = document.querySelectorAll('[data-testid="toolBar"]');
	if (!toolbars)
	{
		return;
	}
	toolbars.forEach((toolbar) =>
	{
		const buttonsAdded = toolbar.querySelectorAll(".my-button");
		if (buttonsAdded.length < 2)
		{
			const dogeMemeBtn = document.createElement("button");
			dogeMemeBtn.innerHTML = "";
			dogeMemeBtn.style.backgroundColor = "#A5BAFF";
			dogeMemeBtn.style.color = "white"
			dogeMemeBtn.classList.add("my-button");
			dogeMemeBtn.style.padding = "5px 7px";
			dogeMemeBtn.style.width = "80px";
			dogeMemeBtn.style.borderRadius = "25px";
			dogeMemeBtn.style.fontSize = "14px";
			dogeMemeBtn.style.marginRight = "-1%";

			const dropdownMenu = document.createElement("select");
			dropdownMenu.style.marginRight = "2%";
			dropdownMenu.style.color = "white";
			dropdownMenu.style.width = "60px";
			dropdownMenu.style.borderRadius = "20px";
			dropdownMenu.style.backgroundColor = "#A5BAFF";

			const selectOption1 = document.createElement("option");
			selectOption1.innerText = "Memes";
			selectOption1.value = "";
			dropdownMenu.appendChild(selectOption1);

			const selectOption2 = document.createElement("option");
			selectOption2.innerText = "Adopt a Doge";
			selectOption2.value = "signadoptadoge/";
			dropdownMenu.appendChild(selectOption2);

			const selectOption3 = document.createElement("option");
			selectOption3.innerText = "I don't Bite";
			selectOption3.value = "signidontbite/";
			dropdownMenu.appendChild(selectOption3);
			const selectOption4 = document.createElement("option");
			selectOption4.innerText = "Join Us";
			selectOption4.value = "signjoinus/";
			dropdownMenu.appendChild(selectOption4);
			const selectOption5 = document.createElement("option");
			selectOption5.innerText = "Mostly Harmless";
			selectOption5.value = "signmostlyharmless/";
			dropdownMenu.appendChild(selectOption5);
			const selectOption6 = document.createElement("option");
			selectOption6.innerText = "NFA";
			selectOption6.value = "signnfa/"
			dropdownMenu.appendChild(selectOption6);
			const selectOption7 = document.createElement("option");
			selectOption7.innerText = "Verified";
			selectOption7.value = "signverified/";
			dropdownMenu.appendChild(selectOption7);
			const selectOption8 = document.createElement("option");
			selectOption8.innerText = "Yump";
			selectOption8.value = "signyump/";
			dropdownMenu.appendChild(selectOption8);
			const selectOption9 = document.createElement("option");
			selectOption9.innerText = "Angry";
			selectOption9.value = "angry/";
			dropdownMenu.appendChild(selectOption9);
			const selectOption10 = document.createElement("option");
			selectOption10.innerText = "Blush";
			selectOption10.value = "blush/";
			dropdownMenu.appendChild(selectOption10);
			const selectOption11 = document.createElement("option");
			selectOption11.innerText = "Crying";
			selectOption11.value = "crying/";
			dropdownMenu.appendChild(selectOption11);
			const selectOption12 = document.createElement("option");
			selectOption12.innerText = "Cute -Uwu-";
			selectOption12.value = "cute/";
			dropdownMenu.appendChild(selectOption12);
			const selectOption13 = document.createElement("option");
			selectOption13.innerText = "The Finger";
			selectOption13.value = "flipping/";
			dropdownMenu.appendChild(selectOption13);
			const selectOption14 = document.createElement("option");
			selectOption14.innerText = "Pie";
			selectOption14.value = "pie/";
			dropdownMenu.appendChild(selectOption14);
			const selectOption15 = document.createElement("option");
			selectOption15.innerText = "Strong";
			selectOption15.value = "strong/";
			dropdownMenu.appendChild(selectOption15);
			const selectOption16 = document.createElement("option");
			selectOption16.innerText = "Thumbs Up";
			selectOption16.value = "thumbsup/";
			dropdownMenu.appendChild(selectOption16);
			const selectOption17 = document.createElement("option");
			selectOption17.innerText = "Bonk";
			selectOption17.value = "bonk/";
			dropdownMenu.appendChild(selectOption17);
			const selectOption18 = document.createElement("option");
			selectOption18.innerText = "Breast Cancer Dress";
			selectOption18.value = "breastcancerdress/";
			const selectOption19 = document.createElement("option");
			selectOption19.innerText = "Breast Cancer Suit";
			selectOption19.value = "breastcancersuit/";
			dropdownMenu.appendChild(selectOption19);
			const selectOption20 = document.createElement("option");
			selectOption20.innerText = "Chonks Shirt";
			selectOption20.value = "chonks/";
			dropdownMenu.appendChild(selectOption20);
			const selectOption21 = document.createElement("option");
			selectOption21.innerText = "Chonks Shirtless";
			selectOption21.value = "chonksshhirtless/";
			dropdownMenu.appendChild(selectOption21);
			const selectOption22 = document.createElement("option");
			selectOption22.innerText = "McWoof's";
			selectOption22.value = "mcwoofs/";
			dropdownMenu.appendChild(selectOption22);
			dropdownMenu.addEventListener("change", function ()
			{
				const tweetArea = document.querySelector("[data-testid='tweetTextarea_0']");
				if (tweetArea)
				{
					const selectOptionValue = dropdownMenu.value;
					chrome.storage.local.get("DogeNumbers", function (result)
					{
						let dogeNumber;
						if (result.DogeNumbers && result.DogeNumbers.length > 0)
						{
							dogeNumber = result.DogeNumbers[result.DogeNumbers.length - 1];
						}
						else
						{
							console.error('No DogeNumbers found in storage');
							return;
						}
						const imageUrl =
							`https://d3cvnrw4bpahxk.cloudfront.net/thedogepound/${selectOptionValue}${dogeNumber}.png`;

						fetch(imageUrl)
							.then(response => response.blob())
							.then(blob =>
							{
								const dataTransfer = new DataTransfer();
								dataTransfer.setData("text/plain", "");
								dataTransfer.items.add(new File([blob], "image.png",
								{
									type: "image/png"
								}));

								const pasteEvent = new ClipboardEvent("paste",
								{
									clipboardData: dataTransfer,
									bubbles: true
								});
								tweetArea.dispatchEvent(pasteEvent);
							})
							.catch(error => console.error(error));
					});
				}
				else
				{
					console.error("Tweet area not found");
				}
			});

			//caption button is here
			document.body.appendChild(dropdownMenu);
			dogeMemeBtn.appendChild(dropdownMenu);
			const refreshBtn = document.createElement("button");
			refreshBtn.innerHTML = "New Caption";
			refreshBtn.style.backgroundColor = "#FFA5A5";
			refreshBtn.style.color = "white";
			refreshBtn.style.fontSize = "13px";
			refreshBtn.style.width = "100px";
			refreshBtn.style.padding = "6px 3px";
			refreshBtn.style.marginRight = "0%";
			refreshBtn.style.borderRadius = "20px";
			refreshBtn.classList.add("my-button");

			//caption button is here

			const GPTBtn = document.createElement("button");
			GPTBtn.innerHTML = "ReplyGPT🐶";
			GPTBtn.style.backgroundColor = "#00acee";
			GPTBtn.style.color = "white";
			GPTBtn.style.fontSize = "13px";
			GPTBtn.style.width = "100px";
			GPTBtn.style.padding = "6px 3px";
			GPTBtn.style.marginRight = "0%";
			GPTBtn.style.borderRadius = "20px";
			GPTBtn.classList.add("my-button");

			GPTBtn.addEventListener("click", async function ()
			{
				const tweetTextElement = document.querySelector('[data-testid="tweetText"]');
				let tweetText = tweetTextElement.innerText;

				// Remove the link
				const linkRegex = /https?:\/\/\S+/gi;
				tweetText = tweetText.replace(linkRegex, "");

				const response = await fetch('https://test-43cp.onrender.com/usegpt',
				{
					method: 'POST',
					headers:
					{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(
					{
						prompt: tweetText.trim()
					})
				});

				if (response.ok)
				{
					const data = await response.json();

					// Copy data to clipboard and paste it on the tweet area after delay of 2 seconds
					navigator.clipboard.writeText(data.data).then(() =>
					{
						setTimeout(() =>
						{
							const tweetArea = document.querySelector('[data-testid="tweetTextarea_0"]');
							tweetArea.focus();
							navigator.clipboard.readText().then((text) =>
							{
								document.execCommand('insertHTML', false, text);
							});
						}, 2000);
					}).catch((err) => console.error('Failed to copy text: ', err));

				}
				else
				{
					console.error('Something went wrong');
				}
			});

			// Sample texts to paste
			//bunch of text for captions
			const sampleTexts = [
				"yo morning!",
				"GM frens, let's crush it!🌞",
				"Good morning everyone, happy day!🥰",
				"Web3 Legends, GM and prosper.✨",
				"GM degens, enjoy your day!😊",
				"Twitter fam, GM and thrive.🐦",
				"GN all, sweet dreams!🌙",
				"To the GM gang, rise up!🍵",
				"GM to all the people!🫶",
				"GM Web3 OGs, innovate on!🔥",
				"GM Kings & Queens, rule today!😀",
				"GM fam, happy day ahead.🩵",
				"Goodnight fam, rest well.😴",
				"To the night owls, GN and prosper!🦉",
				"GN everyone, see you in the morning.🌄",
				"Sleep tight, GN and recharge!💤",
				"Sweet dreams, GN and be blessed.🙏",
				"Gn 🌃🌠",
				"gn 🌜🌟",
				" Gn 🌌💭",
				" GN 🙏🏼💤",


			];

			function getRandomText()
			{
				return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
			}

			refreshBtn.addEventListener("click", function ()
			{
				setTimeout(function ()
				{
					const tweetArea = document.querySelector("[data-testid='tweetTextarea_0']");
					if (tweetArea)
					{
						// Paste random text into the textarea
						const dataTransfer = new DataTransfer();
						const randomText = getRandomText();
						dataTransfer.setData("text/plain", randomText);

						const pasteEvent = new ClipboardEvent("paste",
						{
							clipboardData: dataTransfer,
							bubbles: true
						});
						tweetArea.dispatchEvent(pasteEvent);

						// Select all text in the textarea
						const range = document.createRange();
						range.selectNodeContents(tweetArea);
						const selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);

					}
					else
					{
						console.error("Tweet area not found");
					}
				}, 50); // Wait for 5 seconds before executing this code
			});

			toolbar.appendChild(dogeMemeBtn);
			toolbar.appendChild(refreshBtn);
			toolbar.appendChild(GPTBtn);
		}
	});
}
handleNewTweets();
const observer = new MutationObserver(handleNewTweets);
observer.observe(document.body,
{
	childList: true,
	subtree: true
});