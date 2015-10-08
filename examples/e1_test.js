var e1_test = (function(){
	var gt = GT();
	var testing = new function() {
		this.Fatal = function(s){
			println(s);
			throw s;
		}
	};
	
	var tests = {
		Test1: function(t) {
			//Test $a \cdot b \cdot b^{-1} \cdot c = a\cdot c$
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.NewNamed("c");
			var d = gt.Compose(a, gt.Compose(b, gt.Compose(gt.Inverse(b), c)));
			var h = gt.Compose(a, c);

			var id = function(a) { return a }

			var proofForth = function(x) {
				return x.ToComposite().Map(id, function(el) {
					var y = el.ToComposite().Associate();
					return y.Map(function(el) {
						return el.ToComposite().Annihilate();
					}, id).Simplify();
				});
			};

			var v = gt.VerifyForth(d, h, proofForth);

			if (!v) {
				t.Fatal("proofForth is not verified");
			}
		},

		Test2: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var d = gt.Compose(a, b);

			//Try to cheat verifier:
			var proofForth = function(x) {
				return x.ToComposite().Left()
			}

			var v = gt.VerifyForth(d, a, proofForth);

			if (v) {
				t.Fatal("proofForth is verified although it is not a proof");
			}
		},
	};

	return new function() {
		this.run = function() {
			var fail = false;
			for (var testName in tests) {
				var f = tests[testName];
				try {
					println("===RUN " + testName);
					f(testing);
					println("---PASS: " + testName);
				}
				catch(e) {
					fail = true;
					println("---FAIL: " + testName + " : " + e);
				}
			}
			if (fail) println("FAIL");
			else println("PASS");
		}
	}
})();