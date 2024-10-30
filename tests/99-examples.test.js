"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Examples",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("1-simple-toggle",()=>{
		cy.visit('../examples/1-simple-toggle.html');
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			})
			.click()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, World!');
			})
			.click()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			});
	});
	
	it("3-after-declared-arg",()=>{
		cy.visit('../examples/3-after-declared-arg.html');
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			})
			.click();
		cy.get('example-toggle')
			.should(([e])=>{
				expect(e).to.have.property('counter',2);
			});
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, World!');
			})
			.click();
		cy.get('example-toggle')
			.should(([e])=>{
				expect(e).to.have.property('counter',4);
			});
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			})
			.click();
	});

	it("4-after-declared-inject",()=>{
		cy.visit('../examples/4-after-declared-inject.html');
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			})
			.click();
		cy.get('example-toggle')
			.should(([e])=>{
				expect(e).to.have.property('counter',2);
			});
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, World!');
			})
			.click();
		cy.get('example-toggle')
			.should(([e])=>{
				expect(e).to.have.property('counter',4);
			});
		cy.get('example-toggle').parent()
			.should(([e])=>{
				expect(e.innerText,'.innerText').to.eq('Hello, Beautiful World!');
			})
			.click();
	});

});
