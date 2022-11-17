"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Web Component Lifecyle",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("Not defined -> Upgrade -> Defined with properties/attributes",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.should('not.have.attr','prop1','')
			.should('not.have.attr','prop2','')
			.then(([e])=>{
				expect(e).to.not.have.property('prop1');
				expect(e).to.not.have.property('prop2');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Wait for variable window.tests_customElement to exist
		cy.window().should('have.property','tests_customElement')
			.then((e)=>{
				expect(e).to.have.property('is','test-element-lifecycle');
			});
		// Upgrade element & wait for it to be defined
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check defined/upgraded element
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','')
			.then(([e])=>{
				expect(e).to.have.property('prop1','prop1');
				expect(e).to.have.property('prop2','');
				expect(e).to.have.property('innerText','Element Content prop1');
			});
	});

	it("Not defined with attributes -> Upgrade -> Defined with changes - delayChangeInConstructor:true",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('prop1','foo');
				expect(e).to.not.have.property('prop1');
				e.setAttribute('prop2','bar');
				expect(e).to.not.have.property('prop1');
				expect(e).to.not.have.property('log');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.should(([e])=>{ // Use 'should' to wait for changes to emit during/after upgrade
				expect(e).to.have.attr('prop1','foo');
				expect(e).to.have.attr('prop2','bar');
				expect(e).to.have.property('prop1','foo');
				expect(e).to.have.property('prop2','bar');
				expect(e.log,'Log').to.deep.eq([ 'cElement-constructor-end', 'prop1:prop1:foo', 'prop2::bar' ]);
				expect(e).to.have.property('innerText','Element Content foo bar');
			});
	});

	it("Not defined with properties -> Upgrade -> Defined with changes - delayChangeInConstructor:true",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.prop1 = 'foo';
				expect(e).to.not.have.attr('prop1');
				e.prop2 = 'bar';
				expect(e).to.not.have.attr('prop1');
				expect(e).to.not.have.property('log');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.should(([e])=>{ // Use 'should' to wait for changes to emit during/after upgrade
				expect(e).to.have.attr('prop1','foo');
				expect(e).to.have.attr('prop2','bar');
				expect(e).to.have.property('prop1','foo');
				expect(e).to.have.property('prop2','bar');
				expect(e.log,'Log').to.deep.eq([ 'cElement-constructor-end', 'prop1:prop1:foo', 'prop2::bar' ]);
				expect(e).to.have.property('innerText','Element Content foo bar');
			});
	});

	it("Not defined with attributes -> Upgrade -> Defined with changes - delayChangeInConstructor:false",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('prop1','foo');
				expect(e).to.not.have.property('prop1');
				e.setAttribute('prop2','bar');
				expect(e).to.not.have.property('prop1');
				expect(e).to.not.have.property('log');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Override some property configs
		cy.window().should('have.property','tests_customElement')
		.then((cElement)=>{
			cElement.propertiesHook = (config)=>{
				config.prop1.delayChangeInConstructor = false;
				config.prop2.delayChangeInConstructor = false;
				return config;
			};
		});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.then(([e])=>{ // Use 'then' to run straight after upgrade, before delayed changes emit
				expect(e).to.have.attr('prop1','foo');
				expect(e).to.have.attr('prop2','bar');
				expect(e).to.have.property('prop1','foo');
				expect(e).to.have.property('prop2','bar');
				expect(e.log,'Log').to.deep.eq([ 'within-mixin-constructor', 'prop1:prop1:foo', 'prop2::bar', 'cElement-constructor-end' ]);
				expect(e).to.have.property('innerText','Element Content foo bar');
			});
	});

	it("Not defined with properties -> Upgrade -> Defined with changes - delayChangeInConstructor:false",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.prop1 = 'foo';
				expect(e).to.not.have.attr('prop1');
				e.prop2 = 'bar';
				expect(e).to.not.have.attr('prop1');
				expect(e).to.not.have.property('log');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Override some property configs
		cy.window().should('have.property','tests_customElement')
			.then((cElement)=>{
				cElement.propertiesHook = (config)=>{
					config.prop1.delayChangeInConstructor = false;
					config.prop2.delayChangeInConstructor = false;
					return config;
				};
			});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.then(([e])=>{ // Use 'then' to run straight after upgrade, before delayed changes emit
				expect(e).to.have.attr('prop1','foo');
				expect(e).to.have.attr('prop2','bar');
				expect(e).to.have.property('prop1','foo');
				expect(e).to.have.property('prop2','bar');
				expect(e.log,'Log').to.deep.eq([ 'within-mixin-constructor', 'prop1:prop1:foo', 'prop2::bar', 'cElement-constructor-end' ]);
				expect(e).to.have.property('innerText','Element Content foo bar');
			});
	});

	it("Not defined with same-named attribute & property -> Upgrade -> Defined with only attribute's value - delayChangeInConstructor:true",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('prop1','fooAttr');
				e.prop1 = 'fooProp';
				e.prop2 = 'barProp';
				e.setAttribute('prop2','barAttr');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.should(([e])=>{ // Use 'should' to wait for changes to emit during/after upgrade
				expect(e,'prop1 attribute').to.have.attr('prop1','fooAttr');
				expect(e,'prop2 attribute').to.have.attr('prop2','barAttr');
				expect(e,'prop1 property').to.have.property('prop1','fooAttr');
				expect(e,'prop2 property').to.have.property('prop2','barAttr');
				expect(e.log,'Log').to.deep.eq([ 'cElement-constructor-end', 'prop1:prop1:fooAttr', 'prop2::barAttr' ]);
				expect(e).to.have.property('innerText','Element Content fooAttr barAttr');
			});
	});

	it("Not defined with same-named attribute & property -> Upgrade -> Defined with only attribute's value - delayChangeInConstructor:false",()=>{
		cy.visit('/wc-lifecycle/1/');
		// Check undefined element
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('prop1','fooAttr');
				e.prop1 = 'fooProp';
				e.prop2 = 'barProp';
				e.setAttribute('prop2','barAttr');
				expect(e).to.have.property('innerText','Init Content');
			});
		// Override some property configs
		cy.window().should('have.property','tests_customElement')
			.then((cElement)=>{
				cElement.propertiesHook = (config)=>{
					config.prop1.delayChangeInConstructor = false;
					config.prop2.delayChangeInConstructor = false;
					return config;
				};
			});
		// Upgrade element
		cy.window().should('have.property','tests_customElement_define')
			.then((fn)=>fn());
		// Check upgraded/defined element
		cy.get('#testElement')
			.then(([e])=>{ // Use 'then' to run straight after upgrade, before delayed changes emit
				expect(e,'prop1 attribute').to.have.attr('prop1','fooAttr');
				expect(e,'prop2 attribute').to.have.attr('prop2','barAttr');
				expect(e,'prop1 property').to.have.property('prop1','fooAttr');
				expect(e,'prop2 property').to.have.property('prop2','barAttr');
				expect(e.log,'Log').to.deep.eq([ 'within-mixin-constructor', 'prop1:prop1:fooAttr', 'prop2::barAttr', 'cElement-constructor-end' ]);
				expect(e).to.have.property('innerText','Element Content fooAttr barAttr');
			});
	});

});
