function GT() {
	var lastToken = 1;
	var hiddenTab = {};

	function panic(msg) { throw msg; }

	function hide(v) {
		for (var t in hiddenTab) {
			var h = hiddenTab[t];
			if (h.view() === v) return h;
		}
		panic("It is not a gt.Element");
	}

	function step(x, y) {
		y.token = x.token;
		return y;
	}

	function same(x, y) {
		return x.token == y.token;
	}

	return new function() {

		//Composite:
		function compose(a, b) {
			var token = lastToken++;
			var left = a.cloneLiteral();
			var right = b.cloneLiteral();
			var hidden = new function () {
				this.typ = 'Composite';
				this.left = left;
				this.right = right;
				this.token = token;
				this.cloneLiteral = function() {
					return compose(left, right);
				};
				this.equalLiteral = function(other) {
					return other.typ === 'Composite' && left.equalLiteral(other.left) && right.equalLiteral(other.right);
				};
				this.associate = function() {
					if (right.typ !== 'Composite')
						panic("Associator requires $a\\cdot (b\\cdot c)$ type arguments");
					return step(this, compose(compose(left, right.left), right.right));
				};
				this.unassociate = function() {
					if (left.typ !== 'Composite')
						panic("Unassociator requires $a\\cdot (b\\cdot c)$ type arguments");
					return step(this, compose(left.left, compose(left.right, right)));
				};
				this.annihilate = function() {
					if (left.typ === 'Inversed') {
						if (left.operand.equalLiteral(right)) {
							return step(this, newIdentity());
						}
					} else if (right.typ === 'Inversed') {
						if (right.operand.equalLiteral(left)) {
							return step(this, newIdentity());
						}
					}
					panic("Annihilator requires $a\\cdot (a^{-1})$ type arguments");
				};
				this.simplify = function() {
					if (left.typ === 'Identity') {
						return step(this, right);
					} else if (right.typ === 'Identity') {
						return step(this, left);
					}
					panic("Annihilator requires $a\\cdot (a^{-1})$ type arguments");
				}
				this.map = function(fl, fr) {
					var l = hide(fl(left.view()));
					var r = hide(fr(right.view()));
					var c = compose(l, r);
					if (same(l, left) && same(r, right)) {
						return step(this, c).view();
					}
					return c.view();
				}
				this.getLeft = function() {
					return left.cloneLiteral();
				}
				this.getRight = function() {
					return right.cloneLiteral();
				}
				this.len = function() {
					return left.len()+right.len()+1;
				}
				
				function View(h){
					h.visible = this;
					this.Same = function(other) {
						return same(h, hide(other));
					}
					this.CloneLiteral = function() {
						return h.cloneLiteral().view();
					}
					this.EqualLiteral = function(other) {
						return h.equalLiteral(hide(other));
					}
					this.Associate = function() {
						return h.associate().view();
					}
					this.Unassociate = function() {
						return h.unassociate().view();
					}
					this.Annihilate = function() {
						return h.annihilate().view();
					}
					this.Simplify = function() {
						return h.simplify().view();
					}
					this.Map = function(fl, fr) {
						return h.map(fl, fr);
					}
					this.Left = function() {
						return h.getLeft().view();
					}
					this.Right = function() {
						return h.getRight().view();
					}
					this.Html = function() {
						return '<span>(' + this.Left().Html() + '&sdot;' + this.Right().Html() + ')</span>';
					}
					this.Show = function() { element(this.Html()); };
					this.ToComposite = function() { return this; }
					this.ToInversed = function() { panic("It's not Inversed"); }
					this.ToNamed = function() { panic("It's not Named"); }
					this.ToIdentity = function() { panic("It's not Identity"); }
				}
				
				this.view = function() {
					if ('visible' in this) return this.visible;
					else return new View(this);
				}
			};
			
			hiddenTab[token] = hidden;			
			return hidden;
		}
		
		this.Compose = function(left, right) {
			return compose(hide(left), hide(right)).view();
		}
		
		this.Unsimplify = function(el, left) {
			var hel = hide(el);
			if (left) {
				return step(hel, compose(newIdentity(), hel)).view();
			} else {
				return step(hel, compose(hel, newIdentity())).view();
			}
		}

		//Inversed:
		function inverse(a) {
			var token = lastToken++;
			var operand = a.cloneLiteral();
			var hidden = new function () {
				this.typ = 'Inversed';
				this.operand = operand;
				this.token = token;
				this.cloneLiteral = function() {
					return inverse(operand);
				};
				this.equalLiteral = function(other) {
					return other.typ === 'Inversed' && operand.equalLiteral(other.operand);
				};
				this.map = function(f) {
					var op = hide(f(operand.view()));
					var c = inverse(op);
					if (same(op, operand)) {
						return step(this, c).view();
					}
					return c.view();
				}
				this.len = function() {
					return operand.len()+1;
				}
				
				function View(h){
					h.visible = this;
					this.Same = function(other) {
						return same(h, hide(other));
					}
					this.CloneLiteral = function() {
						return h.cloneLiteral().view();
					}
					this.EqualLiteral = function(other) {
						return h.equalLiteral(hide(other));
					}
					this.Map = function(f) {
						return h.map(f);
					}
					this.Html = function() {
						var op = operand.view().Html()
						if (operand.len() == 1) {
							return operand.view().Html() + '<sup>-1</sup>';
						} else {
							return '<span>(' + operand.view().Html() + ')</span>' + '<sup>-1</sup>';
						}
					}
					this.Show = function() { element(this.Html()); };
					this.ToComposite = function() { panic("It's not Composite"); }
					this.ToInversed = function() { return this; }
					this.ToNamed = function() { panic("It's not Named"); }
					this.ToIdentity = function() { panic("It's not Identity"); }
				}
				
				this.view = function() {
					if ('visible' in this) return this.visible;
					else return new View(this);
				}
			};
			
			hiddenTab[token] = hidden;			
			return hidden;
		}
		
		this.Inverse = function(op) {
			return inverse(hide(op)).view();
		}

		//Named:
		function newNamed(name) {
			var token = lastToken++;
			var hidden = new function () {
				this.typ = 'Named';
				this.name = name;
				this.token = token;
				this.cloneLiteral = function() {
					return newNamed(name);
				};
				this.equalLiteral = function(other) {
					return other.typ === 'Named' && name === other.name;
				};
				this.len = function() {
					return 1;
				}
				
				function View(h){
					h.visible = this;
					this.Same = function(other) {
						return same(h, hide(other));
					}
					this.CloneLiteral = function() {
						return h.cloneLiteral().view();
					}
					this.EqualLiteral = function(other) {
						return h.equalLiteral(hide(other));
					}
					this.Map = function(f) {
						return h.map(f);
					}
					this.Html = function() {
						if (name === 'e') throw "'e' reserved for identity";
						return '<i>'+name+'</i>';
					}
					this.Show = function() { element(this.Html()); };
					this.ToComposite = function() { panic("It's not Composite"); }
					this.ToInversed = function() { panic("It's not Inversed"); }
					this.ToNamed = function() { return this; }
					this.ToIdentity = function() { panic("It's not Identity"); }
				}
				
				this.view = function() {
					if ('visible' in this) return this.visible;
					else return new View(this);
				}
			};
			
			hiddenTab[token] = hidden;			
			return hidden;
		}
		
		this.NewNamed = function(name) {
			return newNamed(name).view();
		}
		
		//Identity:
		function newIdentity() {
			var token = lastToken++;
			var hidden = new function () {
				this.typ = 'Identity';
				this.token = token;
				this.cloneLiteral = function() {
					return newIdentity();
				};
				this.equalLiteral = function(other) {
					return other.typ === 'Identity';
				};				
				this.unannihilate = function(el, left) {
					if (left) {
						var n = compose(inverse(el), el)
						return step(this, n);
					} else {
						var n = compose(el, inverse(el))
						return step(this, n);
					}
				}
				this.len = function() {
					return 1;
				}
				function View(h){
					h.visible = this;
					this.Same = function(other) {
						return same(h, hide(other));
					}
					this.CloneLiteral = function() {
						return h.cloneLiteral().view();
					}
					this.EqualLiteral = function(other) {
						return h.equalLiteral(hide(other));
					}
					this.Unannihilate = function(el, left) {
						return h.unannihilate(hide(el), left).view();
					}
					this.Html = function() {
						return '<i>e</i>';
					}
					this.Show = function() { element(this.Html()); };
					this.ToComposite = function() { panic("It's not Composite"); }
					this.ToInversed = function() { panic("It's not Inversed"); }
					this.ToNamed = function() { panic("It's not Named"); }
					this.ToIdentity = function() { return this; }
				}
				
				this.view = function() {
					if ('visible' in this) return this.visible;
					else return new View(this);
				}
			};
			
			hiddenTab[token] = hidden;			
			return hidden;
		}
		
		this.NewIdentity = function() {
			return newIdentity().view();
		}
		this.Verify = function(left, right, forth, back) {
			var l = left.CloneLiteral();
			var r = right.CloneLiteral();

			var lr = forth(l);
			var rl = back(r);

			var backIsStep = same(hide(r), hide(rl));
			var forthIsStep = same(hide(l), hide(lr));

			return forthIsStep && backIsStep && lr.EqualLiteral(r) && rl.EqualLiteral(l);
		}

		this.VerifyForth = function(left, right, forth) {
			var l = left.CloneLiteral();
			var r = right.CloneLiteral();

			var lr = forth(l);
			var forthIsStep = same(hide(l), hide(lr));

			if (!forthIsStep) {
				console.log("VerifyForth: 'forth' is not step");
			}

			var lrEq = lr.EqualLiteral(r);

			if (!lrEq) {
				console.log("VerifyForth: 'forth(left) != right'");
			}
			return forthIsStep && lrEq;
		}
	}();
}

var gt = GT();