"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Class Extends",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("Simple - mixin on base",()=>{
		cy.visit('/extends/1/');
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','')
			.then(([e])=>{
				expect(e).to.have.property('prop1','prop1');
				expect(e).to.have.property('prop2','');
			});
	});

	it("Simple - mixin on top",()=>{
		cy.visit('/extends/2/');
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','')
			.then(([e])=>{
				expect(e).to.have.property('prop1','prop1');
				expect(e).to.have.property('prop2','');
			});
	});

	it("Multiple mixins",()=>{
		cy.visit('/extends/3/');
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','')
			.then(([e])=>{
				expect(e).to.have.property('prop1','prop1');
				expect(e).to.have.property('prop2','');
				expect(e.innerText,'Content').to.eq('Extended Class Content Prop1:prop1 Prop2:');
			});
	});

	it("Multiple mixins - Combined & Overwritten static properties",()=>{
		cy.visit('/extends/4/');
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','')
			.should('have.attr','prop3','prop3-overwritten')
			.then(([e])=>{
				expect(e).to.have.property('prop1','prop1');
				expect(e).to.have.property('prop2','');
				expect(e).to.have.property('prop3','prop3-overwritten');
				expect(e.innerText,'Content').to.eq('Extended Class Content Prop1:prop1 Prop2: Prop3:prop3-overwritten');
			});
	});

	it("Multiple mixins - Multiple set listeners",()=>{
		cy.visit('/extends/5/');
		cy.get('#testElement')
			.should('have.attr','prop','default2')
			.should('have.text','Extended Class Content Prop:default2') // Queued Render
			.then(([e])=>{
				expect(e).to.have.property('prop','default2');
				expect(e.innerText,'Content').to.eq('Extended Class Content Prop:default2');
				expect(e.setLog).to.deep.eq([]);
				e.prop = 'FooBar';
				expect(e.innerText,'Content - Not yet re-rendered').to.eq('Extended Class Content Prop:default2');
			});
		cy.get('#testElement') // Start new chain to allow retries (for queued render of innerText)
			.should('have.attr','prop','FooBar')
			.should('have.text','Extended Class Content Prop:FooBar') // Queued Render
			.then(([e])=>{
				expect(e).to.have.property('prop','FooBar');
				expect(e.innerText,'Content').to.eq('Extended Class Content Prop:FooBar');
				expect(e.setLog).to.deep.eq(['base-set-prop:FooBar','extended-set-prop:FooBar']);
				expect(e.setLog.indexOf('base-set-prop:FooBar'),'set order').to.be.lt(e.setLog.indexOf('extended-set-prop:FooBar'));
				e.setAttribute('prop','BarFoo');
				expect(e.innerText,'Content - Not yet re-rendered').to.eq('Extended Class Content Prop:FooBar');
			});
		cy.get('#testElement') // Start new chain to allow retries (for queued render of innerText)
			.should('have.attr','prop','BarFoo')
			.should('have.text','Extended Class Content Prop:BarFoo') // Queued Render
			.then(([e])=>{
				expect(e).to.have.property('prop','BarFoo');
				expect(e.innerText,'Content').to.eq('Extended Class Content Prop:BarFoo');
				expect(e.setLog).to.deep.eq(['base-set-prop:FooBar','extended-set-prop:FooBar','base-set-prop:BarFoo','extended-set-prop:BarFoo']);
				expect(e.setLog.indexOf('base-set-prop:FooBar'),'set order').to.be.lt(e.setLog.indexOf('extended-set-prop:FooBar'));
				expect(e.setLog.indexOf('extended-set-prop:FooBar'),'set order').to.be.lt(e.setLog.indexOf('base-set-prop:BarFoo'));
				expect(e.setLog.indexOf('base-set-prop:BarFoo'),'set order').to.be.lt(e.setLog.indexOf('extended-set-prop:BarFoo'));
			});
	});

});
