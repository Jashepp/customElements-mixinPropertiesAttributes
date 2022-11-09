"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Data Type Defaults",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("String No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.strEmpty, 'strEmpty').to.eq('');
			});
	});
	
	it("String No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('have.attr', 'strEmpty', '');
	});
	
	it("Number No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.numEmpty, 'numEmpty').to.eq(0);
			});
	});
	
	it("Number No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('have.attr', 'numEmpty', '0');
	});
	
	it("Boolean No Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.boolEmpty, 'boolEmpty').to.eq(false);
			});
	});
	
	it("Boolean No Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('not.have.attr', 'boolEmpty', '');
	});
	
	it("String Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.str, 'str').to.eq('Default String Value');
			});
	});
	
	it("String Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('have.attr', 'str', 'Default String Value');
	});
	
	it("Number Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.num, 'num').to.eq(42);
			});
	});
	
	it("Number Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('have.attr', 'num', '42');
	});
	
	it("Boolean Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.bool, 'bool').to.eq(true);
			});
	});
	
	it("Boolean Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('have.attr', 'bool', '');
	});
	
	it("Combined Default Content",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.innerText, 'Content').to.eq('Str Default String Value, Num 42, Bool: true');
			})
	});
	
	it("Non-Implemented Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.custom, 'custom').to.eq('Custom');
			});
	});
	
	it("Non-Implemented Default Attribute (none)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.should('not.have.attr', 'custom', '');
	});
});

describe("Data Type Assigns",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});
	
	it("String Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 'New Value';
				expect(e.str, 'str').to.eq('New Value');
			})
			.should('have.attr', 'str', 'New Value');
	});
	
	it("String Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str', 'New Value');
				expect(e.str, 'str').to.eq('New Value');
			})
			.should('have.attr', 'str', 'New Value');
	});
	
	it("Number Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = 69;
				expect(e.num, 'num').to.eq(69);
			})
			.should('have.attr', 'num', '69');
	});
	
	it("Number Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('num', '69');
				expect(e.num, 'num').to.eq(69);
			})
			.should('have.attr', 'num', '69');
	});
	
	it("Boolean Change to false - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = false;
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
	});
	
	it("Boolean Change to false - via Attribute (remove)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.removeAttribute('bool');
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
	});
	
	it("Boolean Change to false then true - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = false;
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = true;
				expect(e.bool, 'bool').to.eq(true);
			})
			.should('have.attr', 'bool', '');
	});
	
	it("Boolean Change to false then true - via Attribute (remove)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.removeAttribute('bool');
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '')
			.then(([e])=>{
				e.setAttribute('bool', '');
				expect(e.bool, 'bool').to.eq(true);
			})
			.should('have.attr', 'bool', '');
	});
	
	it("Combined Changed Content - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 'New Value';
				e.num = 69;
				e.bool = false;
			})
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Str New Value, Num 69, Bool: false');
			});
	});
	
	it("Combined Changed Content - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str', 'New Value');
				e.setAttribute('num', '69');
				e.removeAttribute('bool');
			})
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Str New Value, Num 69, Bool: false');
			});
	});
	
	it("String Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = {};
				expect(e.str, 'str').to.eq('' + {});
			})
			.should('have.attr', 'str', '' + {});
	});
	
	it("String Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 42;
				expect(e.str, 'str').to.eq('42');
			})
			.should('have.attr', 'str', '42');
	});
	
	it("String Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = false;
				expect(e.str, 'str').to.eq('false');
			})
			.should('have.attr', 'str', 'false')
			.then(([e])=>{
				e.str = true;
				expect(e.str, 'str').to.eq('true');
			})
			.should('have.attr', 'str', 'true');
	});
	
	it("Number Set Property As String",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = '69';
				expect(e.num, 'num').to.eq(69);
			})
			.should('have.attr', 'num', '69');
	});
	
	it("Number Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = e;
				expect(e.num, 'num').to.satisfy(Cypress._.isNaN);
			})
			.should('have.attr', 'num', 'NaN');
	});
	
	it("Number Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = true;
				expect(e.num, 'num').to.eq(1);
			})
			.should('have.attr', 'num', '1')
			.then(([e])=>{
				e.num = false;
				expect(e.num, 'num').to.eq(0);
			})
			.should('have.attr', 'num', '0');
	});
	
	it("Boolean Set Property As String - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = '1';
				expect(e.bool, 'bool').to.eq(true);
			})
			.should('have.attr', 'bool', '')
			.then(([e])=>{
				e.bool = '';
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
	});
	
	it("Boolean Set Property As Number - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = 1;
				expect(e.bool, 'bool').to.eq(true);
			})
			.should('have.attr', 'bool', '')
			.then(([e])=>{
				e.bool = 0;
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
	});
	
	it("Boolean Set Property As Object - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = {};
				expect(e.bool, 'bool').to.eq(true);
			})
			.should('have.attr', 'bool', '')
			.then(([e])=>{
				e.bool = null;
				expect(e.bool, 'bool').to.eq(false);
			})
			.should('not.have.attr', 'bool', '');
	});
	
	it("Non-Implemented Set Property As String",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.custom = 'New Value';
				expect(e.custom, 'custom').to.eq('New Value');
			})
			.should('not.have.attr', 'custom', '');
	});
	
	it("Non-Implemented Set Attribute As String (no-op)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('custom', 'New Value');
				expect(e.custom, 'custom').to.eq('Custom');
			})
			.should('have.attr', 'custom', 'New Value');
	});
	
});
