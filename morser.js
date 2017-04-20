var morseLight, morsePatterns;
// morse.js must also be loaded in order to access the morsePatterns variable

async function flashIt() {
	document.getElementById("errorText").style.visibility = "hidden";
	var inputText = document.getElementById("textInput").value;
	var ditLength = document.getElementById("ditLength").value;
	var dahLength = document.getElementById("dahLength").value;
	var letterTimeout = document.getElementById("letterTimeout").value;
	var wordTimeout = document.getElementById("wordTimeout").value;
	if (isEmptyString(inputText) || isEmptyString(ditLength) || isEmptyString(dahLength) || isEmptyString(letterTimeout) || isEmptyString(wordTimeout)) {
		document.getElementById("errorText").style.visibility = "visible";
	}
	await morser(inputText, morsePatterns, ditLength, dahLength, letterTimeout, wordTimeout, morseLight);
}

async function morser(string, morsePatterns, ditLengthMs, dahLengthMs,
					  betweenLetterTimeoutMs, betweenWordTimeoutMs, light) {
	for (var i = 0, len = string.length; i < len; i++)
	{
		var patternIndex = morsePatterns.chars.indexOf(string[i].toUpperCase());
		var letterPattern = morsePatterns.patterns[patternIndex];
		if (!isNullOrUndefined(letterPattern)) {
			await flasher(letterPattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light);
		}
		await sleep(betweenWordTimeoutMs);
	}
}

async function flasher(pattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light) {
	for (var i = 0, len = pattern.length; i < len; i++) {
		if (pattern[i] === '.') {
			await flashLight(ditLengthMs, light);
		}
		else {
			await flashLight(dahLengthMs, light);
		}

		if (i < len - 1)
			await sleep(betweenLetterTimeoutMs);
	}
}

async function flashLight(timeout, light) {
	light.style.visibility = "visible";
	await sleep(timeout);
	light.style.visibility = "hidden";
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function isNullOrUndefined(variable) {
	return (variable === null) || (variable === undefined);
}

function isEmptyString(string) {
	return string === "";
}

(function() {
	morseLight = document.getElementById("light");
})();