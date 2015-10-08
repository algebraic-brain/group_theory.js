var gt_test = (function(){
	var gt = GT();
	var testing = new function() {
		this.Fatal = function(s){
			println(s);
			throw s;
		}
	};
	
	var tests = {
		TestComposeIsNotStep: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.Compose(a, b);
			if (a.Same(c) || b.Same(c)) {
				t.Fatal("'Compose' is a step");
			}
		},

		TestCompositeCloneLiteralIsNotStep: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.Compose(a, b);
			var d = c.CloneLiteral();
			if (c.Same(d)) {
				t.Fatal("'Composite.CloneLiteral' is a step");
			}
		},

		TestAssociator: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.NewNamed("c");
			var d = gt.Compose(a, gt.Compose(b, c));
			var e = d.Associate();
			var f = e.Unassociate();

			if (!e.Same(d) || !f.Same(e)) {
				t.Fatal("Associator is not a step");
			}
		},

		TestAnnihilatorIsStep: function(t) {
			var a = gt.NewNamed("a");
			var b1 = gt.Compose(a, gt.Inverse(a));
			var b2 = b1.Annihilate();
			var b3 = b2.Unannihilate(a, false);

			if (!b2.Same(b1) || !b3.Same(b2)) {
				t.Fatal("Annihilator or Unannihilator is not a step (1)");
			}

			if (!b3.EqualLiteral(b1)) {
				t.Fatal("Annihilator and Unannihilator are not inverse of each other (1)");
			}

			var c1 = gt.Compose(gt.Inverse(a), a);
			var c2 = c1.Annihilate();
			var c3 = c2.Unannihilate(a, true);

			if (!c2.Same(c1) || !c3.Same(c2)) {
				t.Fatal("Annihilator or Unannihilator is not a step (2)");
			}

			if (!c3.EqualLiteral(c1)) {
				t.Fatal("Annihilator and Unannihilator are not inverse of each other (2)");
			}

			var e = gt.NewIdentity();
			var d1 = e.Unannihilate(a, true);
			var d2 = d1.Annihilate();

			if (!d2.EqualLiteral(e)) {
				t.Fatal("Annihilator and Unannihilator are not inverse of each other (3)");
			}

			var f1 = e.Unannihilate(a, false);
			var f2 = f1.Annihilate();

			if (!f2.EqualLiteral(e)) {
				t.Fatal("Annihilator and Unannihilator are not inverse of each other (4)");
			}
		},

		TestSimplifier: function(t) {
			var a = gt.NewNamed("a");

			var b1 = gt.Compose(a, gt.NewIdentity());
			var b2 = b1.Simplify();
			var b3 = gt.Unsimplify(b2, false);

			if (!b2.Same(b1) || !b3.Same(b2)) {
				t.Fatal("Simplifier or Unsimplifier is not a step (1)");
			}

			if (!b1.EqualLiteral(b3)) {
				t.Fatal("Simplifier and Unsimplifier are not inverse of each other (1)");
			}

			var c1 = gt.Compose(gt.NewIdentity(), a);
			var c2 = c1.Simplify();
			var c3 = gt.Unsimplify(c2, true);

			if (!c2.Same(c1) || !c3.Same(c2)) {
				t.Fatal("Simplifier or Unsimplifier is not a step (2)");
			}

			if (!c1.EqualLiteral(c3)) {
				t.Fatal("Simplifier and Unsimplifier are not inverse of each other (2)");
			}

			var d1 = gt.Unsimplify(a, true);
			var d2 = d1.Simplify();

			if (!d2.EqualLiteral(a)) {
				t.Fatal("Simplifier and Unsimplifier are not inverse of each other (3)");
			}

			var f1 = gt.Unsimplify(a, false);
			var f2 = f1.Simplify();

			if (!f2.EqualLiteral(a)) {
				t.Fatal("Simplifier and Unsimplifier are not inverse of each other (4)");
			}
		},

		TestCompositeMap: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.Compose(a, b);
			var f = function(el) { return el };
			var d = c.Map(f, f);

			if (!d.Same(c)) {
				t.Fatal("'Composite.Map' is not a step when must be");
			}

			f = function(el) {
				return gt.NewNamed("g");
			}

			var h = c.Map(f, f);

			if (h.Same(c)) {
				t.Fatal("'Composite.Map' is a step when must not be");
			}
		},

		TestLeftRightAreNotSteps: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.NewNamed("b");
			var c = gt.Compose(a, b);

			var l = c.Left();
			var r = c.Right();

			if (l.Same(c) || l.Same(a) || l.Same(b) || r.Same(c) || r.Same(a) || r.Same(b)) {
				t.Fatal("'Left' or 'Right' are steps");
			}
		},

		TestInverseIsNotStep: function(t) {
			var a = gt.NewNamed("a");
			var b = gt.Inverse(a);

			if (b.Same(a)) {
				t.Fatal("'Inverse' is a step");
			}
		},

		TestInversedCloneLiteralIsNotStep: function(t) {
			var a = gt.NewNamed("a");
			var c = gt.Inverse(a);
			var d = c.CloneLiteral();
			if (c.Same(d)) {
				t.Fatal("'Inversed.CloneLiteral' is a step");
			}
		},

		TestInversedMap: function(t) {
			var a = gt.NewNamed("a");
			var c = gt.Inverse(a);
			var f = function(el) { return el };
			var d = c.Map(f);

			if (!d.Same(c)) {
				t.Fatal("'Inversed.Map' is not a step when must be");
			}

			f = function(el) {
				return gt.NewNamed("g");
			}

			var h = c.Map(f);

			if (h.Same(c)) {
				t.Fatal("'Inversed.Map' is a step when must not be");
			}
		},

		TestNamedCloneLiteralIsNotStep: function(t) {
			var a = gt.NewNamed("a");
			var c = a.CloneLiteral();
			if (c.Same(a)) {
				t.Fatal("'Named.CloneLiteral' is a step");
			}
		},

		TestIdentityCloneLiteralIsNotStep: function(t) {
			var a = gt.NewIdentity();
			var c = a.CloneLiteral();
			if (c.Same(a)) {
				t.Fatal("'Identity.CloneLiteral' is a step");
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