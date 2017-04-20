function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function loadMorsePatterns(patternJSON) {
	return JSON.parse(patternJSON);
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

function isNullOrUndefined(variable) {
	return (variable === null) || (variable === undefined);
}