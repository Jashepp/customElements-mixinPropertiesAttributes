"use strict";

describe("Basic Features",()=>{
	//beforeEach(()=>{ cy.visit('/1.html'); });

	it("Blank Element",()=>{
		cy.visit('/simple/blank.html');
		cy.get('#testElement').should('be.visible');
		cy.get('#testElement').should('have.text', 'Element Content');
	});

	it("Simple Element",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement').should('be.visible');
		cy.get('#testElement').should('have.text', 'Hello, Test');
	});

	it("Simple Property & Attribute - Attribute defined in html",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement').should('have.attr', 'name', 'Test');
		cy.get('#testElement').should('have.text', 'Hello, Test');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.exist;
			expect(e.name, 'name').to.eq('Test');
		});
	});

	it("Default Property & Attribute",()=>{
		cy.visit('/simple/noAttrib.html');
		cy.get('#testElement').should('have.attr', 'name', 'Default');
		cy.get('#testElement').should('have.text', 'Hello, Default');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.exist;
			expect(e.name, 'name').to.eq('Default');
		});
	});

	it("Change Property",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.eq('Test');
			e.name = 'Changed';
		});
		cy.get('#testElement').should('have.attr', 'name', 'Changed');
		cy.get('#testElement').should('have.text', 'Hello, Changed');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.eq('Changed');
		});
	});

	it("Change Attribute",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.eq('Test');
			e.setAttribute('name', 'Changed');
		});
		cy.get('#testElement').should('have.attr', 'name', 'Changed');
		cy.get('#testElement').should('have.text', 'Hello, Changed');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			expect(e.name, 'name').to.eq('Changed');
		});
	});

	it("Property & Attribute with mixed case",()=>{
		cy.visit('/simple/index.html');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.mixedCaseProp = 'Changed';
			expect(e.mixedCaseProp, 'Change Value via Property').to.eq('Changed');
			e.setAttribute('mixedCaseProp', 'Changed2');
			expect(e.mixedCaseProp, 'Change Value via Attribute as mixed case').to.eq('Changed2');
		});
		cy.get('#testElement').should('have.attr', 'mixedCaseProp', 'Changed2');
		cy.get('#testElement').should('have.attr', 'mixedcaseprop', 'Changed2');
		cy.get('#testElement').should('have.attr', 'MIXEDcasePROP', 'Changed2');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('mixedcaseprop', 'Changed3');
			expect(e.mixedCaseProp, 'Change Value via Attribute as lowercase').to.eq('Changed3');
		});
		cy.get('#testElement').should('have.attr', 'mixedCaseProp', 'Changed3');
		cy.get('#testElement').should('have.attr', 'mixedcaseprop', 'Changed3');
		cy.get('#testElement').should('have.attr', 'MIXEDcasePROP', 'Changed3');
		cy.get('#testElement').then($e=>{
			let e = $e[0];
			e.setAttribute('MIXEDcasePROP', 'Changed4');
			expect(e.mixedCaseProp, 'Change Value via Attribute as mixed case').to.eq('Changed4');
		});
		cy.get('#testElement').should('have.attr', 'mixedCaseProp', 'Changed4');
		cy.get('#testElement').should('have.attr', 'mixedcaseprop', 'Changed4');
		cy.get('#testElement').should('have.attr', 'MIXEDcasePROP', 'Changed4');
	});

});
