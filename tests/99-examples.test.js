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

	it("2-lit-html",()=>{
		cy.visit('../examples/2-lit-html.html');
		cy.get('example-hello')
			.should(([e])=>{ // use 'should' to wait for queued render
				expect(e.innerText,'.innerText').to.eq('');
				expect(e.shadowRoot).to.exist;
				let span = e.shadowRoot.querySelector('span');
				expect(span.innerText,'.shadowRoot -> span.innerText').to.eq('Hello, Developer!');
			})
			.then(([e])=>{
				e.name = "Foo Bar Prop"
			});
		cy.get('example-hello')
			.should(([e])=>{ // use 'should' to wait for queued render
				let span = e.shadowRoot.querySelector('span');
				expect(span.innerText,'.shadowRoot -> span.innerText').to.eq('Hello, Foo Bar Prop!');
			})
			.then(([e])=>{
				e.setAttribute('name',"Foo Bar Attrib");
			});
		cy.get('example-hello')
			.should(([e])=>{ // use 'should' to wait for queued render
				let span = e.shadowRoot.querySelector('span');
				expect(span.innerText,'.shadowRoot -> span.innerText').to.eq('Hello, Foo Bar Attrib!');
			})
	});

});
