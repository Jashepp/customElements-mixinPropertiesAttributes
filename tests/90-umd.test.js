"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Test UMD - ./index.umd.min.js",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("example-1-simple-toggle",()=>{
		cy.visit('./90-umd.html');
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
	
});
