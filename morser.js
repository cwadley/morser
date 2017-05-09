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
	var currentTab = $("#tabs li.active a").text();
	var nlProsign = document.getElementById("includeNewline").checked;
	var npProsign = document.getElementById("includeNewParagraph").checked;
	var eomProsign = document.getElementById("includeEndOfMessage").checked;
	var highlighting = document.getElementById("liveHighlighting").checked;
	var farnsworth = document.getElementById("farnsworth").checked;
	var textToHighlight = document.getElementById("highlightText");

	if (currentTab === "Simple" && farnsworth)
		await flashSimpleFarnsworth(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	else if (currentTab === "Simple")
		await flashSimpleStandard(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	else if (currentTab === "Advanced")
		await flashAdvanced(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	else
		await flashManual(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
}

async function flashSimpleStandard(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight) {
	var wpm = document.getElementById("wpm").value;

	if (!isEmptyString(inputText) && !isEmptyString(wpm)) {
		// using unit calculation from ARRL Morse Transmission Timing Standard
		// http://www.arrl.org/files/file/Technology/x9004008.pdf
		var msPerUnit = 1200 / wpm;
		var timing = {};
		timing.ditLength = msPerUnit;
		timing.dahLength = msPerUnit * 3;
		timing.elementTimeout = msPerUnit;
		timing.letterTimeout = msPerUnit * 3;
		timing.wordTimeout = msPerUnit * 7;		

		await morser(inputText, morsePatterns, timing, morseLight, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	}
	else {
		document.getElementById("errorText").style.visibility = "visible";
	}
}

async function flashSimpleFarnsworth(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight) {
	var wpm = document.getElementById("wpm").value;

	if (!isEmptyString(inputText) && !isEmptyString(wpm)) {
		// using unit calculation from ARRL Morse Transmission Timing Standard
		// http://www.arrl.org/files/file/Technology/x9004008.pdf
		var charWPM = 18;
		var msPerUnit = 1200 / charWPM;
		var totalDelay = ((60000 * charWPM) - (37200 * wpm)) / (wpm * charWPM);
		var timing = {};
		timing.ditLength = msPerUnit;
		timing.dahLength = msPerUnit * 3;
		timing.elementTimeout = msPerUnit;
		timing.letterTimeout = (3 * totalDelay) / 19;
		timing.wordTimeout = (7 * totalDelay) / 19;

		await morser(inputText, morsePatterns, timing, morseLight, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	}
	else{
		document.getElementById("errorText").style.visibility = "visible";
	}
}

async function flashAdvanced(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight) {
	var unitLengthMs = document.getElementById("unitLength").value;
	var unitsPerDit = document.getElementById("unitsPerDit").value;
	var unitsPerDah = document.getElementById("unitsPerDah").value;
	var unitsBetweenElements = document.getElementById("unitsBetweenElements").value;
	var unitsBetweenLetters = document.getElementById("unitsBetweenLetters").value;
	var unitsBetweenWords = document.getElementById("unitsBetweenWords").value;

	if (!isEmptyString(inputText) && !isEmptyString(unitLengthMs) && !isEmptyString(unitsPerDit) && !isEmptyString(unitsPerDah)
		&& !isEmptyString(unitsBetweenElements) && !isEmptyString(unitsBetweenLetters) && !isEmptyString(unitsBetweenWords)) {

		var timing = {};
		timing.ditLength = unitsPerDit * unitLengthMs;
		timing.dahLength = unitsPerDah * unitLengthMs;
		timing.elementTimeout = unitsBetweenElements * unitLengthMs;
		timing.letterTimeout = unitsBetweenLetters * unitLengthMs;
		timing.wordTimeout = unitsBetweenWords * unitLengthMs;
		
		await morser(inputText, morsePatterns, timing, morseLight, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);
	}
	else {
		document.getElementById("errorText").style.visibility = "visible";
	}
}

async function flashManual(inputText, nlProsign, npProsign, eomProsign, highlighting, textToHighlight) {
	var timing = {};
	timing.ditLength = document.getElementById("ditLength").value;
	timing.dahLength = document.getElementById("dahLength").value;
	timing.elementTimeout = document.getElementById("elementTimeout").value;
	timing.letterTimeout = document.getElementById("letterTimeout").value;
	timing.wordTimeout = document.getElementById("wordTimeout").value;

	if (!isEmptyString(inputText) && !isEmptyString(ditLength) && !isEmptyString(dahLength) && !isEmptyString(elementTimeout)
		&& !isEmptyString(letterTimeout) && !isEmptyString(wordTimeout)) {
		
		await morser(inputText, morsePatterns, timing, morseLight, nlProsign, npProsign, eomProsign, highlighting, textToHighlight);	
	}
	else {
		document.getElementById("errorText").style.visibility = "visible";
	}
}

async function morser(string, morsePatterns, timing, light, nlProsign,
					  npProsign, eomProsign, highlighting, textToHighlight) {

	textToHighlight.innerHTML = "";
	var textHead = "<h4><span class=\"textHighlighted\">";

	for (var i = 0, len = string.length; i < len; i++)
	{
		if (highlighting) {
			textToHighlight.innerHTML = textHead + string.slice(0, i + 1) + "</span>" + string.slice(i + 1) + "</h4>";
		}

		// break between words
		if (string[i] === " ") {
			await sleep(timing.wordTimeout);
		}
		// see if we have a new paragraph and if so, insert the new paragraph prosign
		else if (npProsign && (string[i] === "\n" && string[i+1] === "\n")){
			var patternIndex = morsePatterns.chars.indexOf("\u2029");
			var letterPattern = morsePatterns.patterns[patternIndex];
			await flasher(letterPattern, timing.ditLength, timing.dahLength, timing.elementTimeout, timing.letterTimeout, light);
			i++;
		}
		// include newline prosign
		else if (nlProsign && (string[i] === "\n")) {
			var patternIndex = morsePatterns.chars.indexOf(string[i]);
			var letterPattern = morsePatterns.patterns[patternIndex];
			await flasher(letterPattern, timing.ditLength, timing.dahLength, timing.elementTimeout, timing.letterTimeout, light);
		}
		// transmit the letter
		else if (string[i] !== "\n") {
			var patternIndex = morsePatterns.chars.indexOf(string[i].toUpperCase());
			var letterPattern = morsePatterns.patterns[patternIndex];
			if (!isNullOrUndefined(letterPattern)) {
				await flasher(letterPattern, timing.ditLength, timing.dahLength, timing.elementTimeout, timing.letterTimeout, light);
			}
		}
	}

	// end of message prosign
	if (eomProsign) {
		var patternIndex = morsePatterns.chars.indexOf("\u0003");
		var pattern = morsePatterns.patterns[patternIndex];
		await flasher(pattern, timing.ditLength, timing.dahLength, timing.elementTimeout, timing.letterTimeout, light);
	}
}

async function flasher(pattern, ditLengthMs, dahLengthMs, betweenElementTimeout, betweenLetterTimeoutMs, light) {
	for (var i = 0, len = pattern.length; i < len; i++) {
		if (pattern[i] === '.') {
			await flashLight(ditLengthMs, betweenElementTimeout, light, onColor, offColor);
		}
		else {
			await flashLight(dahLengthMs, betweenElementTimeout, light, onColor, offColor);
		}
	}
	await sleep(betweenLetterTimeoutMs);
}

async function flashLight(elementTimeout, betweenElementTimeout, light, onColor, offColor) {
	light.style.background = onColor;
	await sleep(elementTimeout);
	light.style.background = offColor;
	await sleep(betweenElementTimeout);
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
    $('#farnsworthTooltip').popover({
        placement : 'top',
        trigger : 'click'
    });
})();

