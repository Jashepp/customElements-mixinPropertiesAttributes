"use strict";

describe("Data Type Defaults",()=>{
	it("String No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.strEmpty, 'strEmpty').to.eq('');
		});
	});
	
	it("String No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.attr', 'strEmpty', '');
	});
	
	it("Number No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.numEmpty, 'numEmpty').to.eq(0);
		});
	});
	
	it("Number No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.attr', 'numEmpty', '0');
	});
	
	it("Boolean No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.boolEmpty, 'boolEmpty').to.eq(false);
		});
	});
	
	it("Boolean No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('not.have.attr', 'boolEmpty');
	});
	
	it("String Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.str, 'str').to.eq('Default String Value');
		});
	});
	
	it("String Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.attr', 'str', 'Default String Value');
	});
	
	it("Number Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.num, 'num').to.eq(42);
		});
	});
	
	it("Number Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.attr', 'num', '42');
	});
	
	it("Boolean Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.bool, 'bool').to.eq(true);
		});
	});
	
	it("Boolean Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.attr', 'bool', '');
	});
	
	it("Combined Default Content",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('have.text', 'Str Default String Value, Num 42, Bool: true');
	});
	
	it("Non-Implemented Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.custom, 'custom').to.eq('Custom');
		});
	});
	
	it("Non-Implemented Default Attribute (none)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').should('not.have.attr', 'custom');
	});
});

describe("Data Type Assigns",()=>{
	//beforeEach(()=>{ cy.visit('/1.html'); });
	
	it("String Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = 'New Value';
			expect(e.str, 'str').to.eq('New Value');
		});
		cy.get('#testElement').should('have.attr', 'str', 'New Value');
	});
	
	it("String Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('str', 'New Value');
			expect(e.str, 'str').to.eq('New Value');
		});
		cy.get('#testElement').should('have.attr', 'str', 'New Value');
	});
	
	it("Number Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.num = 69;
			expect(e.num, 'num').to.eq(69);
		});
		cy.get('#testElement').should('have.attr', 'num', '69');
	});
	
	it("Number Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('num', '69');
			expect(e.num, 'num').to.eq(69);
		});
		cy.get('#testElement').should('have.attr', 'num', '69');
	});
	
	it("Boolean Change to false - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = false;
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
	});
	
	it("Boolean Change to false - via Attribute (remove)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.removeAttribute('bool');
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
	});
	
	it("Boolean Change to false then true - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = false;
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = true;
			expect(e.bool, 'bool').to.eq(true);
		});
		cy.get('#testElement').should('have.attr', 'bool', '');
	});
	
	it("Boolean Change to false then true - via Attribute (remove)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.removeAttribute('bool');
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('bool', '');
			expect(e.bool, 'bool').to.eq(true);
		});
		cy.get('#testElement').should('have.attr', 'bool', '');
	});
	
	it("Combined Changed Content - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = 'New Value';
			e.num = 69;
			e.bool = false;
		});
		cy.get('#testElement').should('have.text', 'Str New Value, Num 69, Bool: false');
	});
	
	it("Combined Changed Content - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('str', 'New Value');
			e.setAttribute('num', '69');
			e.removeAttribute('bool');
		});
		cy.get('#testElement').should('have.text', 'Str New Value, Num 69, Bool: false');
	});
	
	it("String Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = {};
			expect(e.str, 'str').to.eq('' + {});
		});
		cy.get('#testElement').should('have.attr', 'str', '' + {});
	});
	
	it("String Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = 42;
			expect(e.str, 'str').to.eq('42');
		});
		cy.get('#testElement').should('have.attr', 'str', '42');
	});
	
	it("String Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = false;
			expect(e.str, 'str').to.eq('false');
		});
		cy.get('#testElement').should('have.attr', 'str', 'false');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.str = true;
			expect(e.str, 'str').to.eq('true');
		});
		cy.get('#testElement').should('have.attr', 'str', 'true');
	});
	
	it("Number Set Property As String",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.num = '69';
			expect(e.num, 'num').to.eq(69);
		});
		cy.get('#testElement').should('have.attr', 'num', '69');
	});
	
	it("Number Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.num = e;
			expect(e.num, 'num').to.satisfy(Cypress._.isNaN);
		});
		cy.get('#testElement').should('have.attr', 'num', 'NaN');
	});
	
	it("Number Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.num = true;
			expect(e.num, 'num').to.eq(1);
		});
		cy.get('#testElement').should('have.attr', 'num', '1');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.num = false;
			expect(e.num, 'num').to.eq(0);
		});
		cy.get('#testElement').should('have.attr', 'num', '0');
	});
	
	it("Boolean Set Property As String - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = '1';
			expect(e.bool, 'bool').to.eq(true);
		});
		cy.get('#testElement').should('have.attr', 'bool', '');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = '';
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
	});
	
	it("Boolean Set Property As Number - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = 1;
			expect(e.bool, 'bool').to.eq(true);
		});
		cy.get('#testElement').should('have.attr', 'bool', '');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = 0;
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
	});
	
	it("Boolean Set Property As Object - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = {};
			expect(e.bool, 'bool').to.eq(true);
		});
		cy.get('#testElement').should('have.attr', 'bool', '');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.bool = null;
			expect(e.bool, 'bool').to.eq(false);
		});
		cy.get('#testElement').should('not.have.attr', 'bool');
	});
	
	it("Non-Implemented Set Property As String",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.custom = 'New Value';
			expect(e.custom, 'custom').to.eq('New Value');
		});
		cy.get('#testElement').should('not.have.attr', 'custom');
	});
	
	it("Non-Implemented Set Attribute As String (no-op)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('custom', 'New Value');
			expect(e.custom, 'custom').to.eq('Custom');
		});
		cy.get('#testElement').should('have.attr', 'custom', 'New Value');
	});
	
});
