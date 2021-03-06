function cprint() {
	console.log.apply(console, arguments);
}

function println() {
	var x = '';
	for (var i in arguments) {
		if (x.length > 0) x += ' ';
		x += arguments[i];
	}
	$('#print_here').append($('<p>'+x+'</p>')).append($('<hr></hr>'));
	return x;
}

function clear() {
	$('#print_here').html('');
	return '';
}

function element() {
	var els = [];
	for (var i in arguments) {
		var el = $(arguments[i]);
		$('#print_here').append(el);
		els.push(el);
	}
	$('#print_here').append($('<hr></hr>'))
	if (els.length == 1) return els[0];
	return els;
}

function Testing(tests) {
	this.Fatal = function(s){
		cprint(s);
		throw s;
	}
	this.run = function() {
		var fail = false;
		for (var testName in tests) {
			var f = tests[testName];
			try {
				cprint("===RUN " + testName);
				f(this);
				cprint("---PASS: " + testName);
			}
			catch(e) {
				fail = true;
				cprint("---FAIL: " + testName + " : " + e);
			}
		}
		if (fail) cprint("FAIL");
		else cprint("PASS");
	}
};

function loadJS(path) {
	$('body').append($('<script src="'+path+'" type="text/javascript"></script>'));
}
