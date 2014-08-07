var open_open = 1;
var levels_above_root = 0;
/*
when switching from sharing->mydrive and mydrive->sharing, reset this
also, sharing->mydrive should not start off at last point, but
at root
*/

var my_root_folder = "";
var current_folder_open = "";
var my_mail = "";
var my_name = "";
var my_photo = "";
var my_user_id = "";

var file_open = false;
var waiting = false; //if waiting for something to open
var next_open = "still";

var auth_url = "https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.install + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=%2Fprofile&redirect_uri=https%3A%2F%2Fcodeyourcloud.com&response_type=token&client_id=953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com";

var editor;
var current = "";
var the_title = "";
var modes = [
  ["Text","text","txt"],
	["Javascript","text/javascript","js"],
	["APL","text/apl","apl"],
	["Asterisk","text/x-asterisk",""],
	["C","text/x-csrc","c"],
	["C++","text/x-c++src","cpp|cc|cxx|h|hh|hpp"],
	["C#","text/x-csharp","cs"],
	["Java","text/x-java","java|ino|pde"],
	["Clojure","text/x-clojure","clj"],
	["Cobol","cobol","CBL|COB|cob|cbl"],
	["CoffeeScript","text/x-coffeescript","coffee|cf|cson|Cakefile"],
	["Common Lisp","text/x-common-lisp","cl|lisp|l|lsp"],
	["CSS","text/css","css"],
	["SCSS","text/x-scss","scss"],
	["LESS","text/x-less","less"],
	["Cypher","application/x-cypher-query","cql|cypher"],
	["Python","text/x-python","py"],
	["Cython","text/x-cython","pyx|pyd"],
	["D","text/x-d","d|di"],
	["Django","text/x-django",""],
	["Diff","text/x-diff","diff"],
	["DTD","application/xml-dtd","dtd"],
	["Dylan","text/x-dylan","dylan"],
	["ECL","text/x-ecl","ecl"],
	["Eiffel","text/x-eiffel","eiffel"],
	["Erlang","text/x-erlang","erl|hrl"],
	["Fortan","text/x-Fortran","f90|f95|f03|f|for"],
	["OCaml","text/x-ocaml","ml|mli"],
	["F#","text/x-fsharp","fs|fsi"],
	["Gas","text/x-gas","gas"],
	["Gherkin","text/x-feature","feature"],
	["Go","text/x-go","go"],
	["Groovy","text/x-groovy","groovy"],
	["HAML","text/x-haml","haml"],
	["Haskell","text/x-haskell","hs"],
	["Haxe","text/x-haxe","hx"],
	["JSP","application/x-jsp","jsp"],
	["EJS","application/x-ejs","ejs"],
	["ASP.NET","application/x-aspx","asp"],
	["HTML","text/html","html|svg"],
	["HTTP","message/http",""],
	["Jade","text/x-jade","jade"],
	["JSON","application/json","json"],
	["TypeScript","ts|typescript|str","application/typescript"],
	["Julia","text/x-julia","jl"],
	["LiveScript","text/x-livescript","ls"],
	["Lua","text/x-lua","lua"],
	["Markdown","text/x-markdown","md|markdown"],
	["Github Markdown","gfm",""],
	["mIRC","text/mirc","mrc"],
	["nginx","text/nginx","conf"],
	["NTriples","text/n-triples","nt"],
	["Octave","text/x-octave","matlab"],
	["Pascal","text/x-pascal","pas|p"],
	["Perl","text/x-perl","pl|pm"],
	["PHP","text/x-php","php"],
	["PHP/HTML","application/x-httpd-php","phtml"],
	["Pig Latin","text/x-pig","pig"],
	["Properties","text/x-properties","properties"],
	["Puppet","text/x-puppet","pp"],
	["Q","text/x-q","q"],
	["R","text/x-rsrc","r"],
	["Ruby","text/x-ruby","rb|ru|gemspec|rake|Guardfile|Rakefile|Gemfile"],
	["Rust","text/x-rustsrc","rs"],
	["Sass","text/x-sass","sass"],
	["Scala","text/x-scala","scala"],
	["Shell","text/x-sh","sh|bash|bashrc"],
	["Scheme","text/x-scheme","scm|rkt"],
	["Sieve","application/sieve","sieve"],
	["Smalltalk","text/x-stsrc",""],
	["Smarty","text/x-smarty","smarty|tpl"],
	["Solr","text/x-solr","solr"],
	["SQL","text/x-sql","sql|pls|plb"],
	["mySQL","text/x-mysql","mysql"],
	["sText","text/x-stex",""],
	["TCL","text/x-tcl","tcl"],
	["LaTex","text/x-stex","tex"],
	["Tiki","tiki","tiki"],
	["Toml","text/x-toml","toml"],
	["Turtle","text/turtle",""],
	["VB.NET","text/x-vb",""],
	["VBScript","text/vbscript","vbs"],
	["Velocity","text/velocity","vm"],
	["Verilog","text/x-verilog","v|vh|sv|svh"],
	["XML","text/html","xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
	["XQuery","application/xquery","xq"],
	["Swift","swift","swift"]
];

var themes = [
	"Code Your Cloud",
	"3024 Day",
	"3024 Night",
	"Ambiance Mobile",
	"Ambiance",
	"Base16 Light",
	"Base16 Dark",
	"Blackboard",
	"Cobalt",
	"Eclipse",
	"Elegant",
	"Erlang Dark",
	"Lesser Dark",
	"Mbo",
	"Mdn Like",
	"Midnight",
	"Monokai",
	"Neat",
	"Night",
	"Paraiso Dark",
	"Paraiso Light",
	"Pastel On Dark",
	"RubyBlue",
	"Solarized",
	"The Matrix",
	"Tomorrow Night Eighties",
	"Twilight",
	"Vibrant Ink",
	"Xq light",
	"Xq dark",
	"Neo"
];

var local_load_nums = false;
var local_load_wrap = false;
var local_load_font = false;

var ignore = false;