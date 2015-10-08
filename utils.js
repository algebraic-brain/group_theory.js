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
