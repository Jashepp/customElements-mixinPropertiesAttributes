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

	it("propTypes.StringLegacy - No Value - Property=''",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('strEmpty','');
			});
	});
	
	it("propTypes.StringLegacy - No Value - Attribute=''",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('strEmpty','');
			});
	});
	
	it("propTypes.String - No Value - Property=null",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str2Empty',null);
			});
	});
	
	it("propTypes.String - No Value - No Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('str2Empty');
			});
	});
	
	it("propTypes.NumberLegacy - No Value - Property=0",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('numEmpty',0);
			});
	});
	
	it("propTypes.NumberLegacy - No Value - Attribute=0",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('numEmpty','0');
			});
	});
	
	it("propTypes.Number - No Value - Property=null",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num2Empty',null);
			});
	});
	
	it("propTypes.Number - No Value - No Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('num2Empty');
			});
	});
	
	it("propTypes.Boolean - No Value - Property=false",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('boolEmpty',false);
			});
	});
	
	it("propTypes.Boolean - No Value - No Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('boolEmpty');
			});
	});
	
	it("propTypes.StringLegacy - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default String Value');
			});
	});
	
	it("propTypes.StringLegacy - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('str','Default String Value');
			});
	});
	
	it("propTypes.String - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str2','Default String Value');
			});
	});
	
	it("propTypes.String - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('str2','Default String Value');
			});
	});

	it("propTypes.NumberLegacy - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
			});
	});
	
	it("propTypes.NumberLegacy - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.Number - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num2',42);
			});
	});
	
	it("propTypes.Number - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('num2','42');
			});
	});
	
	it("propTypes.Boolean - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('bool',true);
			});
	});
	
	it("propTypes.Boolean - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("Combined Default Content",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check innerText Content').to.have.property('innerText','Str Default String Value, Num 42, Bool: true');
			});
	});
	
	it("No-Type - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('custom','Custom');
			});
	});
	
	it("No-Type - Default Attribute (No Attribute)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('custom');
			});
	});
});

describe("Data Type Assigns",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});
	
	it("propTypes.StringLegacy - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 'New Value';
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
			});
	});
	
	it("propTypes.StringLegacy - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str', 'New Value');
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
			});
	});
	
	it("propTypes.String - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str2 = 'New Value';
				expect(e,'instant-check property').to.have.property('str2','New Value');
				expect(e,'instant-check attribute').to.have.attr('str2','New Value');
			});
	});
	
	it("propTypes.String - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str2', 'New Value');
				expect(e,'instant-check property').to.have.property('str2','New Value');
				expect(e,'instant-check attribute').to.have.attr('str2','New Value');
			});
	});
	
	it("propTypes.NumberLegacy - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = 42;
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.NumberLegacy - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('num', '42');
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.Number - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = 42;
				expect(e,'instant-check property').to.have.property('num2',42);
				expect(e,'instant-check attribute').to.have.attr('num2','42');
			});
	});
	
	it("propTypes.Number - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('num2', '42');
				expect(e,'instant-check property').to.have.property('num2',42);
				expect(e,'instant-check attribute').to.have.attr('num2','42');
			});
	});
	
	it("propTypes.Boolean - Change to false - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = false;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
	});
	
	it("propTypes.Boolean - Change to false - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.removeAttribute('bool');
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
	});
	
	it("propTypes.Boolean - Change to false then true - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = false;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = true;
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("propTypes.Boolean - Change to false then true - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.removeAttribute('bool');
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('bool','');
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("Combined Changed Content - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 'New Value';
				e.num = 42;
				e.bool = false;
			})
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Str New Value, Num 42, Bool: false');
			});
	});
	
	it("Combined Changed Content - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str', 'New Value');
				e.setAttribute('num', '42');
				e.removeAttribute('bool');
			})
			.then(([e])=>{
				expect(e.innerText, 'Changed Content').to.eq('Str New Value, Num 42, Bool: false');
			});
	});
	
	it("propTypes.StringLegacy - Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = {};
				expect(e,'instant-check property').to.have.property('str',''+{});
				expect(e,'instant-check attribute').to.have.attr('str',''+{});
			});
	});
	
	it("propTypes.StringLegacy - Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 42;
				expect(e,'instant-check property').to.have.property('str','42');
				expect(e,'instant-check attribute').to.have.attr('str','42');
			});
	});
	
	it("propTypes.StringLegacy - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = false;
				expect(e,'instant-check property').to.have.property('str','false');
				expect(e,'instant-check attribute').to.have.attr('str','false');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.str = true;
				expect(e,'instant-check property').to.have.property('str','true');
				expect(e,'instant-check attribute').to.have.attr('str','true');
			});
	});
	
	it("propTypes.String - Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str2 = {};
				expect(e,'instant-check property').to.have.property('str2',''+{});
				expect(e,'instant-check attribute').to.have.attr('str2',''+{});
			});
	});
	
	it("propTypes.String - Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str2 = 42;
				expect(e,'instant-check property').to.have.property('str2','42');
				expect(e,'instant-check attribute').to.have.attr('str2','42');
			});
	});
	
	it("propTypes.String - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str2 = false;
				expect(e,'instant-check property').to.have.property('str2','false');
				expect(e,'instant-check attribute').to.have.attr('str2','false');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.str2 = true;
				expect(e,'instant-check property').to.have.property('str2','true');
				expect(e,'instant-check attribute').to.have.attr('str2','true');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As String 'abc'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = 'abc';
				expect(e.num,'instant-check property').to.satisfy(Cypress._.isNaN);
				expect(e,'instant-check attribute').to.have.attr('num','NaN');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As String '42'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = '42';
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = {};
				expect(e.num,'instant-check property').to.satisfy(Cypress._.isNaN);
				expect(e,'instant-check attribute').to.have.attr('num','NaN');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = true;
				expect(e,'instant-check property').to.have.property('num',1);
				expect(e,'instant-check attribute').to.have.attr('num','1');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.num = false;
				expect(e,'instant-check property').to.have.property('num',0);
				expect(e,'instant-check attribute').to.have.attr('num','0');
			});
	});
	
	it("propTypes.Number - Set Property As String 'abc'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = 'abc';
				expect(e,'instant-check property').to.have.property('num2',null);
				expect(e,'instant-check attribute').to.not.have.attr('num2');
			});
	});
	
	it("propTypes.Number - Set Property As String '42'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = '42';
				expect(e,'instant-check property').to.have.property('num2',42);
				expect(e,'instant-check attribute').to.have.attr('num2','42');
			});
	});
	
	it("propTypes.Number - Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = {};
				expect(e,'instant-check property').to.have.property('num2',null);
				expect(e,'instant-check attribute').to.not.have.attr('num2');
			});
	});
	
	it("propTypes.Number - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = true;
				expect(e,'instant-check property').to.have.property('num2',1);
				expect(e,'instant-check attribute').to.have.attr('num2','1');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.num2 = false;
				expect(e,'instant-check property').to.have.property('num2',0);
				expect(e,'instant-check attribute').to.have.attr('num2','0');
			});
	});
	
	it("propTypes.Boolean - Set Property As String - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = '';
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = '1';
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("propTypes.Boolean - Set Property As Number - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = 0;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = 1;
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("propTypes.Boolean - Set Property As Object - truey/falsy",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = null;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.bool = {};
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
			});
	});
	
	it("No-Type - Set Property As String",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.custom = 'New Value';
				expect(e,'instant-check property').to.have.property('custom','New Value');
				expect(e,'instant-check attribute').to.not.have.attr('custom');
			});
	});
	
	it("No-Type - Set Attribute As String (no-op)",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('custom', 'New Value');
				expect(e,'instant-check property').to.have.property('custom','Custom');
				expect(e,'instant-check attribute').to.have.attr('custom','New Value');
			});
	});
	
});
