(function() {
  var DEFAULT_BRACKETS = "()[]{}''\"\"";
  var DEFAULT_EXPLODE_ON_ENTER = "[]{}";
  var SPACE_CHAR_REGEX = /\s/;

  CodeMirror.defineOption("autoCloseBrackets", false, function(cm, val, old) {
    if (old != CodeMirror.Init && old)
      cm.removeKeyMap("autoCloseBrackets");
    if (!val) return;
    var pairs = DEFAULT_BRACKETS, explode = DEFAULT_EXPLODE_ON_ENTER;
    if (typeof val == "string") pairs = val;
    else if (typeof val == "object") {
      if (val.pairs != null) pairs = val.pairs;
      if (val.explode != null) explode = val.explode;
    }
    var map = buildKeymap(pairs);
    if (explode) map.Enter = buildExplodeHandler(explode);
    cm.addKeyMap(map);
  });

  function charsAround(cm, pos) {
    var str = cm.getRange(CodeMirror.Pos(pos.line, pos.ch - 1),
                          CodeMirror.Pos(pos.line, pos.ch + 1));
    return str.length == 2 ? str : null;
  }

  function buildKeymap(pairs) {
    var map = {
      name : "autoCloseBrackets",
      Backspace: function(cm) {
        if (cm.somethingSelected() || cm.getOption("disableInput")) return CodeMirror.Pass;
        var cur = cm.getCursor(), around = charsAround(cm, cur);
        if (around && pairs.indexOf(around) % 2 == 0)
          cm.replaceRange("", CodeMirror.Pos(cur.line, cur.ch - 1), CodeMirror.Pos(cur.line, cur.ch + 1));
        else
          return CodeMirror.Pass;
      }
    };
    var closingBrackets = "";
    for (var i = 0; i < pairs.length; i += 2) (function(left, right) {
      if (left != right) closingBrackets += right;
      function surround(cm) {
        var selection = cm.getSelection();
        cm.replaceSelection(left + selection + right);
      }
      function maybeOverwrite(cm) {
        var cur = cm.getCursor(), ahead = cm.getRange(cur, CodeMirror.Pos(cur.line, cur.ch + 1));
        if (ahead != right || cm.somethingSelected()) return CodeMirror.Pass;
        else cm.execCommand("goCharRight");
      }
      map["'" + left + "'"] = function(cm) {
        if (left == "'" && cm.getTokenAt(cm.getCursor()).type == "comment" ||
            cm.getOption("disableInput"))
          return CodeMirror.Pass;
        if (cm.somethingSelected()) return surround(cm);
        if (left == right && maybeOverwrite(cm) != CodeMirror.Pass) return;
        var cur = cm.getCursor(), ahead = CodeMirror.Pos(cur.line, cur.ch + 1);
        var line = cm.getLine(cur.line), nextChar = line.charAt(cur.ch), curChar = cur.ch > 0 ? line.charAt(cur.ch - 1) : "";
        if (left == right && CodeMirror.isWordChar(curChar))
          return CodeMirror.Pass;
        if (line.length == cur.ch || closingBrackets.indexOf(nextChar) >= 0 || SPACE_CHAR_REGEX.test(nextChar))
          cm.replaceSelection(left + right, {head: ahead, anchor: ahead});
        else
          return CodeMirror.Pass;
      };
      if (left != right) map["'" + right + "'"] = maybeOverwrite;
    })(pairs.charAt(i), pairs.charAt(i + 1));
    return map;
  }

  function buildExplodeHandler(pairs) {
    return function(cm) {
      var cur = cm.getCursor(), around = charsAround(cm, cur);
      if (!around || pairs.indexOf(around) % 2 != 0 || cm.getOption("disableInput"))
        return CodeMirror.Pass;
      cm.operation(function() {
        var newPos = CodeMirror.Pos(cur.line + 1, 0);
        cm.replaceSelection("\n\n", {anchor: newPos, head: newPos}, "+input");
        cm.indentLine(cur.line + 1, null, true);
        cm.indentLine(cur.line + 2, null, true);
      });
    };
  }
})();
/**
 * Tag-closer extension for CodeMirror.
 *
 * This extension adds an "autoCloseTags" option that can be set to
 * either true to get the default behavior, or an object to further
 * configure its behavior.
 *
 * These are supported options:
 *
 * `whenClosing` (default true)
 *   Whether to autoclose when the '/' of a closing tag is typed.
 * `whenOpening` (default true)
 *   Whether to autoclose the tag when the final '>' of an opening
 *   tag is typed.
 * `dontCloseTags` (default is empty tags for HTML, none for XML)
 *   An array of tag names that should not be autoclosed.
 * `indentTags` (default is block tags for HTML, none for XML)
 *   An array of tag names that should, when opened, cause a
 *   blank line to be added inside the tag, and the blank line and
 *   closing line to be indented.
 *
 * See demos/closetag.html for a usage example.
 */

(function() {
  CodeMirror.defineOption("autoCloseTags", false, function(cm, val, old) {
    if (old != CodeMirror.Init && old)
      cm.removeKeyMap("autoCloseTags");
    if (!val) return;
    var map = {name: "autoCloseTags"};
    if (typeof val != "object" || val.whenClosing)
      map["'/'"] = function(cm) { return autoCloseSlash(cm); };
    if (typeof val != "object" || val.whenOpening)
      map["'>'"] = function(cm) { return autoCloseGT(cm); };
    cm.addKeyMap(map);
  });

  var htmlDontClose = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param",
                       "source", "track", "wbr"];
  var htmlIndent = ["applet", "blockquote", "body", "button", "div", "dl", "fieldset", "form", "frameset", "h1", "h2", "h3", "h4",
                    "h5", "h6", "head", "html", "iframe", "layer", "legend", "object", "ol", "p", "select", "table", "ul"];

  function autoCloseGT(cm) {
    var pos = cm.getCursor(), tok = cm.getTokenAt(pos);
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state), state = inner.state;
    if (inner.mode.name != "xml" || !state.tagName || cm.getOption("disableInput")) return CodeMirror.Pass;

    var opt = cm.getOption("autoCloseTags"), html = inner.mode.configuration == "html";
    var dontCloseTags = (typeof opt == "object" && opt.dontCloseTags) || (html && htmlDontClose);
    var indentTags = (typeof opt == "object" && opt.indentTags) || (html && htmlIndent);

    var tagName = state.tagName;
    if (tok.end > pos.ch) tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
    var lowerTagName = tagName.toLowerCase();
    // Don't process the '>' at the end of an end-tag or self-closing tag
    if (!tagName ||
        tok.type == "string" && (tok.end != pos.ch || !/[\"\']/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1) ||
        tok.type == "tag" && state.type == "closeTag" ||
        tok.string.indexOf("/") == (tok.string.length - 1) || // match something like <someTagName />
        dontCloseTags && indexOf(dontCloseTags, lowerTagName) > -1 ||
        CodeMirror.scanForClosingTag && CodeMirror.scanForClosingTag(cm, pos, tagName,
                                                                     Math.min(cm.lastLine() + 1, pos.line + 50)))
      return CodeMirror.Pass;

    var doIndent = indentTags && indexOf(indentTags, lowerTagName) > -1;
    var curPos = doIndent ? CodeMirror.Pos(pos.line + 1, 0) : CodeMirror.Pos(pos.line, pos.ch + 1);
    cm.replaceSelection(">" + (doIndent ? "\n\n" : "") + "</" + tagName + ">",
                        {head: curPos, anchor: curPos});
    if (doIndent) {
      cm.indentLine(pos.line + 1, null, true);
      cm.indentLine(pos.line + 2, null);
    }
  }

  function autoCloseSlash(cm) {
    var pos = cm.getCursor(), tok = cm.getTokenAt(pos);
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state), state = inner.state;
    if (tok.type == "string" || tok.string.charAt(0) != "<" ||
        tok.start != pos.ch - 1 || inner.mode.name != "xml" ||
        cm.getOption("disableInput"))
      return CodeMirror.Pass;

    var tagName = state.context && state.context.tagName;
    if (tagName) cm.replaceSelection("/" + tagName + ">", "end");
    else return CodeMirror.Pass;
  }

  function indexOf(collection, elt) {
    if (collection.indexOf) return collection.indexOf(elt);
    for (var i = 0, e = collection.length; i < e; ++i)
      if (collection[i] == elt) return i;
    return -1;
  }
})();
(function() {
  'use strict';

  var listRE = /^(\s*)([*+-]|(\d+)\.)(\s*)/,
      unorderedBullets = '*+-';

  CodeMirror.commands.newlineAndIndentContinueMarkdownList = function(cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;

    var pos = cm.getCursor(),
        inList = cm.getStateAfter(pos.line).list !== false,
        match;

    if (!inList || !(match = cm.getLine(pos.line).match(listRE))) {
      cm.execCommand('newlineAndIndent');
      return;
    }

    var indent = match[1], after = match[4];
    var bullet = unorderedBullets.indexOf(match[2]) >= 0
      ? match[2]
      : (parseInt(match[3], 10) + 1) + '.';

    cm.replaceSelection('\n' + indent + bullet + after, 'end');
  };

}());
(function() {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
    (document.documentMode == null || document.documentMode < 8);

  var Pos = CodeMirror.Pos;

  var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};
  function findMatchingBracket(cm, where, strict) {
    var state = cm.state.matchBrackets;
    var maxScanLen = (state && state.maxScanLineLength) || 10000;
    var maxScanLines = (state && state.maxScanLines) || 100;

    var cur = where || cm.getCursor(), line = cm.getLineHandle(cur.line), pos = cur.ch - 1;
    var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
    if (!match) return null;
    var forward = match.charAt(1) == ">", d = forward ? 1 : -1;
    if (strict && forward != (pos == cur.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(cur.line, pos + 1));

    var stack = [line.text.charAt(pos)], re = /[(){}[\]]/;
    function scan(line, lineNo, start) {
      if (!line.text) return;
      var pos = forward ? 0 : line.text.length - 1, end = forward ? line.text.length : -1;
      if (line.text.length > maxScanLen) return null;
      if (start != null) pos = start + d;
      for (; pos != end; pos += d) {
        var ch = line.text.charAt(pos);
        if (re.test(ch) && cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style) {
          var match = matching[ch];
          if (match.charAt(1) == ">" == forward) stack.push(ch);
          else if (stack.pop() != match.charAt(0)) return {pos: pos, match: false};
          else if (!stack.length) return {pos: pos, match: true};
        }
      }
    }
    for (var i = cur.line, found, e = forward ? Math.min(i + maxScanLines, cm.lineCount()) : Math.max(-1, i - maxScanLines); i != e; i+=d) {
      if (i == cur.line) found = scan(line, i, pos);
      else found = scan(cm.getLineHandle(i), i);
      if (found) break;
    }
    return {from: Pos(cur.line, pos), to: found && Pos(i, found.pos),
            match: found && found.match, forward: forward};
  }

  function matchBrackets(cm, autoclear) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
    var found = findMatchingBracket(cm);
    if (!found || cm.getLine(found.from.line).length > maxHighlightLen ||
       found.to && cm.getLine(found.to.line).length > maxHighlightLen)
      return;

    var style = found.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
    var one = cm.markText(found.from, Pos(found.from.line, found.from.ch + 1), {className: style});
    var two = found.to && cm.markText(found.to, Pos(found.to.line, found.to.ch + 1), {className: style});
    // Kludge to work around the IE bug from issue #1193, where text
    // input stops going to the textarea whenever this fires.
    if (ie_lt8 && cm.state.focused) cm.display.input.focus();
    var clear = function() {
      cm.operation(function() { one.clear(); two && two.clear(); });
    };
    if (autoclear) setTimeout(clear, 800);
    else return clear;
  }

  var currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(function() {
      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
      if (!cm.somethingSelected()) currentlyHighlighted = matchBrackets(cm, false);
    });
  }

  CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init)
      cm.off("cursorActivity", doMatchBrackets);
    if (val) {
      cm.state.matchBrackets = typeof val == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
    }
  });

  CodeMirror.defineExtension("matchBrackets", function() {matchBrackets(this, true);});
  CodeMirror.defineExtension("findMatchingBracket", function(pos, strict){
    return findMatchingBracket(this, pos, strict);
  });
})();
(function() {
  "use strict";

  CodeMirror.defineOption("matchTags", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.off("cursorActivity", doMatchTags);
      cm.off("viewportChange", maybeUpdateMatch);
      clear(cm);
    }
    if (val) {
      cm.state.matchBothTags = typeof val == "object" && val.bothTags;
      cm.on("cursorActivity", doMatchTags);
      cm.on("viewportChange", maybeUpdateMatch);
      doMatchTags(cm);
    }
  });

  function clear(cm) {
    if (cm.state.tagHit) cm.state.tagHit.clear();
    if (cm.state.tagOther) cm.state.tagOther.clear();
    cm.state.tagHit = cm.state.tagOther = null;
  }

  function doMatchTags(cm) {
    cm.state.failedTagMatch = false;
    cm.operation(function() {
      clear(cm);
      if (cm.somethingSelected()) return;
      var cur = cm.getCursor(), range = cm.getViewport();
      range.from = Math.min(range.from, cur.line); range.to = Math.max(cur.line + 1, range.to);
      var match = CodeMirror.findMatchingTag(cm, cur, range);
      if (!match) return;
      if (cm.state.matchBothTags) {
        var hit = match.at == "open" ? match.open : match.close;
        if (hit) cm.state.tagHit = cm.markText(hit.from, hit.to, {className: "CodeMirror-matchingtag"});
      }
      var other = match.at == "close" ? match.open : match.close;
      if (other)
        cm.state.tagOther = cm.markText(other.from, other.to, {className: "CodeMirror-matchingtag"});
      else
        cm.state.failedTagMatch = true;
    });
  }

  function maybeUpdateMatch(cm) {
    if (cm.state.failedTagMatch) doMatchTags(cm);
  }

  CodeMirror.commands.toMatchingTag = function(cm) {
    var found = CodeMirror.findMatchingTag(cm, cm.getCursor());
    if (found) {
      var other = found.at == "close" ? found.open : found.close;
      if (other) cm.setSelection(other.to, other.from);
    }
  };
})();
CodeMirror.defineOption("showTrailingSpace", false, function(cm, val, prev) {
  if (prev == CodeMirror.Init) prev = false;
  if (prev && !val)
    cm.removeOverlay("trailingspace");
  else if (!prev && val)
    cm.addOverlay({
      token: function(stream) {
        for (var l = stream.string.length, i = l; i && /\s/.test(stream.string.charAt(i - 1)); --i) {}
        if (i > stream.pos) { stream.pos = i; return null; }
        stream.pos = l;
        return "trailingspace";
      },
      name: "trailingspace"
    });
});
