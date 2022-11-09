"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Basic Features",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("Blank Element",()=>{
		cy.visit('/simple/blank.html');
		cy.get('#testElement')
			.should('be.visible')
			.then(([e])=>{
				expect(e.innerText, 'Content').to.eq('Element Content');
			});
	});

	it("Simple Element",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement')
			.should('be.visible')
			.then(([e])=>{
				expect(e.innerText, 'Content').to.eq('Hello, Test');
			});
	});

	it("Simple Property & Attribute - Attribute defined in html",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement')
			.should('have.attr', 'name', 'Test')
			.then(([e])=>{
				expect(e.innerText, 'Content').to.eq('Hello, Test');
				expect(e.name, 'name').to.exist;
				expect(e.name, 'name').to.eq('Test');
			});
	});

	it("Default Property & Attribute",()=>{
		cy.visit('/simple/noAttrib.html');
		cy.get('#testElement')
			.should('have.attr', 'name', 'Default')
			.then(([e])=>{
				expect(e.innerText, 'Content').to.eq('Hello, Default');
				expect(e.name, 'name').to.exist;
				expect(e.name, 'name').to.eq('Default');
			});
	});

	it("Change Property",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.name, 'name').to.eq('Test');
				e.name = 'Changed';
			})
			.should('have.attr', 'name', 'Changed')
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Hello, Changed');
				expect(e.name, 'name').to.eq('Changed');
			});
	});

	it("Change Attribute",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.name, 'name').to.eq('Test');
				e.setAttribute('name', 'Changed');
			})
			.should('have.attr', 'name', 'Changed')
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Hello, Changed');
				expect(e.name, 'name').to.eq('Changed');
			});
	});

	it("Property & Attribute with mixed case",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.mixedCaseProp = 'Changed';
				expect(e.mixedCaseProp, 'Change Value via Property').to.eq('Changed');
				e.setAttribute('mixedCaseProp', 'Changed2');
				expect(e.mixedCaseProp, 'Change Value via Attribute as mixed case').to.eq('Changed2');
			})
			.should('have.attr', 'mixedCaseProp', 'Changed2')
			.should('have.attr', 'mixedcaseprop', 'Changed2')
			.should('have.attr', 'MIXEDcasePROP', 'Changed2')
			.then(([e])=>{
				e.setAttribute('mixedcaseprop', 'Changed3');
				expect(e.mixedCaseProp, 'Change Value via Attribute as lowercase').to.eq('Changed3');
			})
			.should('have.attr', 'mixedCaseProp', 'Changed3')
			.should('have.attr', 'mixedcaseprop', 'Changed3')
			.should('have.attr', 'MIXEDcasePROP', 'Changed3')
			.then(([e])=>{
				e.setAttribute('MIXEDcasePROP', 'Changed4');
				expect(e.mixedCaseProp, 'Change Value via Attribute as mixed case').to.eq('Changed4');
			})
			.should('have.attr', 'mixedCaseProp', 'Changed4')
			.should('have.attr', 'mixedcaseprop', 'Changed4')
			.should('have.attr', 'MIXEDcasePROP', 'Changed4');
	});

});
