/* morser.js
 This file is part of Morser, a visual morse code tool
 Converts standard latin text into morse code and displays it visually as a light.
 
 Copyright (C) 2017  Clint Wadley
 					 clint@clintwadley.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, version 3 of the License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var morseLight, morsePatterns;
var onColor = "yellow";
var offColor = "#636363";
// morse.js must also be loaded in order to access the morsePatterns variable

async function flashIt() {
	document.getElementById("errorText").style.visibility = "hidden";
	var inputText = document.getElementById("textInput").value;
	var ditLength = document.getElementById("ditLength").value;
	var dahLength = document.getElementById("dahLength").value;
	var letterTimeout = document.getElementById("letterTimeout").value;
	var wordTimeout = document.getElementById("wordTimeout").value;
	var nlProsign = document.getElementById("includeNewline").checked;
	var npProsign = document.getElementById("includeNewParagraph").checked;
	var eomProsign = document.getElementById("includeEndOfMessage").checked;
	var highlighting = document.getElementById("liveHighlighting").checked;
	var textToHighlight = document.getElementById("highlightText");
	if (isEmptyString(inputText) || isEmptyString(ditLength) || isEmptyString(dahLength) || isEmptyString(letterTimeout) || isEmptyString(wordTimeout)) {
		document.getElementById("errorText").style.visibility = "visible";
	}
	else {
		await morser(inputText, morsePatterns, ditLength, dahLength, letterTimeout, wordTimeout,
				 	 morseLight, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	}
}

async function morser(string, morsePatterns, ditLengthMs, dahLengthMs,
					  betweenLetterTimeoutMs, betweenWordTimeoutMs, light, 
					  nlProsign, npProsign, eomProsign, highlighting, textToHighlight) {

	textToHighlight.innerHTML = "";
	var textHead = "<h4><span class=\"textHighlighted\">";

	for (var i = 0, len = string.length; i < len; i++)
	{
		if (highlighting) {
			textToHighlight.innerHTML = textHead + string.slice(0, i + 1) + "</span>" + string.slice(i + 1) + "</h4>";
		}

		// break between words
		if (string[i] === " ") {
			await sleep(betweenWordTimeoutMs);
		}
		// see if we have a new paragraph and if so, insert the new paragraph prosign
		else if (npProsign && (string[i] === "\n" && string[i+1] === "\n")){
			var patternIndex = morsePatterns.chars.indexOf("\u2029");
			var letterPattern = morsePatterns.patterns[patternIndex];
			await flasher(letterPattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light);
			i++;
		}
		// include newline prosign
		else if (nlProsign && (string[i] === "\n")) {
			var patternIndex = morsePatterns.chars.indexOf(string[i]);
			var letterPattern = morsePatterns.patterns[patternIndex];
			await flasher(letterPattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light);
		}
		// transmit the letter
		else {
			var patternIndex = morsePatterns.chars.indexOf(string[i].toUpperCase());
			var letterPattern = morsePatterns.patterns[patternIndex];
			if (!isNullOrUndefined(letterPattern)) {
				await flasher(letterPattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light);
			}
		}
	}

	// end of message prosign
	if (eomProsign) {
		var patternIndex = morsePatterns.chars.indexOf("\u0003");
		var pattern = morsePatterns.patterns[patternIndex];
		await flasher(pattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light);
	}
}

async function flasher(pattern, ditLengthMs, dahLengthMs, betweenLetterTimeoutMs, light) {
	for (var i = 0, len = pattern.length; i < len; i++) {
		if (pattern[i] === '.') {
			await flashLight(ditLengthMs, light, onColor, offColor);
		}
		else {
			await flashLight(dahLengthMs, light, onColor, offColor);
		}
	}
	await sleep(betweenLetterTimeoutMs);
}

async function flashLight(timeout, light, onColor, offColor) {
	light.style.background = onColor;
	await sleep(timeout);
	light.style.background = offColor;
	await sleep(timeout);
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