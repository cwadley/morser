/* morse.js
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

var morsePatterns = {"code":"morse", "chars":[
	"A", 
	"B", 
	"C", 
	"D", 
	"E", 
	"F", 
	"G", 
	"H", 
	"I", 
	"J", 
	"K", 
	"L", 
	"M", 
	"N", 
	"O", 
	"P", 
	"Q", 
	"R", 
	"S", 
	"T", 
	"U", 
	"V", 
	"W", 
	"X", 
	"Y", 
	"Z", 
	"0", 
	"1", 
	"2", 
	"3", 
	"4", 
	"5", 
	"6", 
	"7", 
	"8", 
	"9", 
	"Ä", 
	"Á", 
	"Å", 
	"É", 
	"Ñ", 
	"Ö", 
	"Ü", 
	".", 
	",", 
	":", 
	"?", 
	"'", 
	"-", 
	"/", 
	"(", 
	")", 
	"\"", 
	"@", 
	"=",
	"\n",
	"\u2029",
	"\u0003"
],
"patterns":[
	".-",
	"-...",
	"-.-.",
	"-..",
	".",
	"..-.",
	"--.",
	"....",
	"..",
	".---",
	"-.-",
	".-..",
	"--",
	"-.",
	"---",
	".--.",
	"--.-",
	".-.",
	"...",
	"-",
	"..-",
	"...-",
	".--",
	"-..-",
	"-.--",
	"--..",
	"-----",
	".----",
	"..---",
	"...--",
	"....-",
	".....",
	"-....",
	"--...",
	"---..",
	"----.",
	".-.-",
	".--.-",
	".--.-",
	"..-..",
	"--.--",
	"---.",
	"..--",
	".-.-.-",
	"--..--",
	"---...",
	"..--..",
	".----.",
	"-....-",
	"-..-.",
	"-.--.-",
	"-.--.-",
	".-..-.",
	".--.-.",
	"-...-",
	".-.-",
	"-...-",
	".-.-."
]};