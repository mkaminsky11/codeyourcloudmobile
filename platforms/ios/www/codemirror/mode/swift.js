(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

var separators = [' ', '\\\+', '\\\-', '\\\(', '\\\)', '\\\*', '/', ':', '\\\?','\\\<','\\\>', ' '];
var tokens = new RegExp(separators.join('|'), 'g');
	
function getWord(string, pos){
	
	var index = -1;
	var count = 1;
	var words = string.split(tokens);
	
	for(var i = 0; i < words.length; i++){
		for(var j = 1; j <= words[i].length; j++){
			if(count === pos){
				index = i;
			}
			count++;
		}
		count++;
	}
	
	var ret = ["",""];
	
	if(pos === 0){
		ret[1] = words[0];
		ret[0] = null;
	}
	else{
		ret[1] = words[index];
		ret[0] = words[index-1];
	}
	return ret;
}

CodeMirror.defineMode("swift", function() {
	
	
	var keywords = ["class", "deinit", "enum", "extension", "func", "import", "init", "let", "protocol", "static", "struct", "subscript", "typealias", "var","as", "dynamicType", "is", "new", "super", "self", "Self", "Type", "__COLUMN__", "__FILE__", "__FUNCTION__", "__LINE__", "break", "case", "continue", "default", "do", "else", "fallthrough", "if", "in", "for", "return", "switch", "where", "while", "associativity", "didSet", "get", "infix", "inout", "left", "mutating", "none", "nonmutating", "operator", "override", "postfix", "precedence", "prefix", "right", "set", "unowned", "unowned(safe)", "unowned(unsafe)", "weak" , "willSet"];	

	var commonConstants = ["Infinity", "NaN", "undefined", "null", "true", "false", "on", "off", "yes", "no", "nil"];
	
	var types = ["String", "bool",]
	
	var numbers = ["0","1","2","3","4","5","6","7","8","9"];
	
	var operators = ["+", "-", "/", "*", "%", "=", "|", "&", "<", ">"];
	var puncuation = [";",",",".","(",")"]
	
	var delimiters = /^(?:[()\[\]{},:`=;]|\.\.?\.?)/;
	var identifiers = /^[_A-Za-z$][_A-Za-z$0-9]*/;
	var properties = /^(@|this\.)[_A-Za-z$][_A-Za-z$0-9]*/;
	var regexPrefixes = /^(\/{3}|\/)/;
	
  	return {
  	
    startState: function() {
      return {
        prev: false,
        func: false,
        op: false,
        string: false,
        escape: false,
        inner: false,
        comment: false,
        num_left: 0,
        num_right: 0,
        word: "",
        back: 0,
        back_type: false,
      };
    },
	
	token: function(stream, state) {
		
		var ch, funcName, word;
		
		if (stream.eatSpace()) {
			return null;
		}
		ch = stream.next();

		if(state.string){
			if(state.escape){
				state.escape = false;
				return "string";
			}
			else{
				if((ch === '"' || ch === "'") && !state.escape){
					state.string = false;
					return "string";
				}
				if(ch === "\\" && stream.peek() === "("){
					//stop the string, start inner
					state.inner = true;
					state.string = false;
					return "keyword";
				}
				if(ch === "\\" && stream.peek() !== "("){
					state.escape = true;
					state.string = true;
					return "string";
				}
				else{
					return "string";
				}
			}
		}
		
		else if(state.comment){
			if(ch === "*" && stream.peek() === "/"){
				state.prev = "*";
				return "comment";
			}
			if(ch === "/" && state.prev === "*"){
				state.prev = false;
				state.comment = false;
				return "comment";
			}
			return "comment";
			
		}
		
		else{
			if(ch === "/"){
				if(stream.peek() === "/"){
					//line comment
					stream.skipToEnd();
					return "comment";
				}
				if(stream.peek() === "*"){
					//block comment
					state.comment = true;
					return "comment";
				}
			}
			if(ch === "(" && state.inner){
				state.num_left++;
				return null;
			}
			if(ch === ")" && state.inner){
				state.num_right++;
				if(state.num_left === state.num_right){
					state.inner = false;
					state.string = true;
				}
				return null;
			}
			
			var ret = getWord(stream.string, stream.pos);
			var the_word = ret[1];
			var prev_word = ret[0];
			
			
			//console.log(stream.string + " " + stream.pos + " " + the_word);
			if(operators.indexOf(ch + "") !== -1){
				return "operator";
			}
			if(puncuation.indexOf(ch + "") !== -1){
				return "punctuation";
			}
			
			if(typeof the_word !== 'undefined'){
				if(the_word.charAt(0) === "#"){
					return null;
				}
				
				if(commonConstants.indexOf(the_word) !== -1){
					return "atom";
				}
				if(numbers.indexOf(the_word) !== -1){
					return "number";
				}
				if((numbers.indexOf(the_word.charAt(0) + "") !== -1 || operators.indexOf(the_word.charAt(0) + "") ) && numbers.indexOf(ch) !== -1){
					return "number";
				}
				if(keywords.indexOf(the_word) !== -1 || keywords.indexOf(the_word.split(tokens)[0]) !== -1){
					return "keyword";
				}
				if(the_word.charAt(0) === "@"){
					return "def";
				}
				if(prev_word === "var" || prev_word === "let"){
					return "def";
				}
			}

			if(ch === "'" || ch === '"'){
				state.string = true;
				return "string";
			}
			if(ch === "(" && state.inner){
				state.num_left++;
			}
			if(ch === ")" && state.inner){
				state.num_right++;
				if(state.num_left === state.num_right){
					state.inner = false;
					state.string = true;
				}
				return null;
			}
			

			// Handle number literals
		    if (stream.match(/^-?[0-9\.]/, false)) {
		      var floatLiteral = false;
		      // Floats
		      if (stream.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i)) {
		        floatLiteral = true;
		      }
		      if (stream.match(/^-?\d+\.\d*/)) {
		        floatLiteral = true;
		      }
		      if (stream.match(/^-?\.\d+/)) {
		        floatLiteral = true;
		      }
		
		      if (floatLiteral) {
		        // prevent from getting extra . on 1..
		        if (stream.peek() == "."){
		          stream.backUp(1);
		        }
		        return "number";
		      }
		      // Integers
		      var intLiteral = false;
		      // Hex
		      if (stream.match(/^-?0x[0-9a-f]+/i)) {
		        intLiteral = true;
		      }
		      // Decimal
		      if (stream.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/)) {
		        intLiteral = true;
		      }
		      // Zero by itself with no other piece of number.
		      if (stream.match(/^-?0(?![\dx])/i)) {
		        intLiteral = true;
		      }
		      if (intLiteral) {
		        return "number";
		      }
		    }
			
			if (stream.match(regexPrefixes)) {
				if (stream.current() != "/" || stream.match(/^.*\//, false)) { // prevent highlight of division
        			return "string";
				} else {
        			stream.backUp(1);
				}
	  		}
			
			if (stream.match(delimiters)) {
		    	return "punctuation";
		    }
		    if (stream.match(identifiers)) {
		    	return "variable";
		    }
		
		    if (stream.match(properties)) {
		    	return "property";
		    }
			
			
		    
		}
	}
	
	};
});

CodeMirror.defineMIME("text/swift", "swift");

});