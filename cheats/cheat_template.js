// name of your cheat here
//           |
//           |
//           V
var YourCheatName = (function(){
	var gt = GT();

	/*

	YOUR CODE CAN BE PLACED HERE

	*/

	var tests = {
		TestMyCheat: function(t) {
			var a = // YOUR CODE HERE
			var b = // YOUR CODE HERE

			var proofForth = // YOUR CODE HERE

			var v = gt.VerifyForth(a, b, proofForth);

			if (!v) {
				t.Fatal("My cheat does not work");
			}
		},
	};

	/*

	YOUR CODE CAN BE PLACED HERE

	*/

	return new Testing(tests);
})();