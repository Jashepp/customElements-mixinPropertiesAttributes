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

	it("propTypes.String - No Value - Property=null",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('strEmpty',null);
			});
	});
	
	it("propTypes.String - No Value - No Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('strEmpty');
			});
	});
	
	it("propTypes.StringLegacy - No Value - Property=''",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('legacyStrEmpty','');
			});
	});
	
	it("propTypes.StringLegacy - No Value - Attribute=''",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('legacyStrEmpty','');
			});
	});
	
	it("propTypes.Number - No Value - Property=null",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('numEmpty',null);
			});
	});
	
	it("propTypes.Number - No Value - No Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.not.have.attr('numEmpty');
			});
	});
	
	it("propTypes.NumberLegacy - No Value - Property=0",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('legacyNumEmpty',0);
			});
	});
	
	it("propTypes.NumberLegacy - No Value - Attribute=0",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('legacyNumEmpty','0');
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
	
	it("propTypes.String - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default String Value');
			});
	});
	
	it("propTypes.String - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('str','Default String Value');
			});
	});

	it("propTypes.StringLegacy - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('legacyStr','Default String Value');
			});
	});
	
	it("propTypes.StringLegacy - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('legacyStr','Default String Value');
			});
	});
	
	it("propTypes.Number - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
			});
	});
	
	it("propTypes.Number - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.NumberLegacy - Default Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('legacyNum',42);
			});
	});
	
	it("propTypes.NumberLegacy - Default Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check attribute').to.have.attr('legacyNum','42');
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
	
	it("propTypes.String - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 'New Value';
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
			});
	});
	
	it("propTypes.String - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('str', 'New Value');
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
			});
	});
	
	it("propTypes.StringLegacy - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyStr = 'New Value';
				expect(e,'instant-check property').to.have.property('legacyStr','New Value');
				expect(e,'instant-check attribute').to.have.attr('legacyStr','New Value');
			});
	});
	
	it("propTypes.StringLegacy - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('legacyStr', 'New Value');
				expect(e,'instant-check property').to.have.property('legacyStr','New Value');
				expect(e,'instant-check attribute').to.have.attr('legacyStr','New Value');
			});
	});
	
	it("propTypes.Number - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = 42;
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.Number - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('num', '42');
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.NumberLegacy - Change - via Property",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = 42;
				expect(e,'instant-check property').to.have.property('legacyNum',42);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','42');
			});
	});
	
	it("propTypes.NumberLegacy - Change - via Attribute",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.setAttribute('legacyNum', '42');
				expect(e,'instant-check property').to.have.property('legacyNum',42);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','42');
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
	
	it("propTypes.String - Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = {};
				expect(e,'instant-check property').to.have.property('str',''+{});
				expect(e,'instant-check attribute').to.have.attr('str',''+{});
			});
	});
	
	it("propTypes.String - Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.str = 42;
				expect(e,'instant-check property').to.have.property('str','42');
				expect(e,'instant-check attribute').to.have.attr('str','42');
			});
	});
	
	it("propTypes.String - Set Property As Boolean",()=>{
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
	
	it("propTypes.StringLegacy - Set As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyStr = {};
				expect(e,'instant-check property').to.have.property('legacyStr',''+{});
				expect(e,'instant-check attribute').to.have.attr('legacyStr',''+{});
			});
	});
	
	it("propTypes.StringLegacy - Set Property As Number",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyStr = 42;
				expect(e,'instant-check property').to.have.property('legacyStr','42');
				expect(e,'instant-check attribute').to.have.attr('legacyStr','42');
			});
	});
	
	it("propTypes.StringLegacy - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyStr = false;
				expect(e,'instant-check property').to.have.property('legacyStr','false');
				expect(e,'instant-check attribute').to.have.attr('legacyStr','false');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyStr = true;
				expect(e,'instant-check property').to.have.property('legacyStr','true');
				expect(e,'instant-check attribute').to.have.attr('legacyStr','true');
			});
	});
	
	it("propTypes.Number - Set Property As String 'abc'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = 'abc';
				expect(e,'instant-check property').to.have.property('num',null);
				expect(e,'instant-check attribute').to.not.have.attr('num');
			});
	});
	
	it("propTypes.Number - Set Property As String '42'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = '42';
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
			});
	});
	
	it("propTypes.Number - Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.num = {};
				expect(e,'instant-check property').to.have.property('num',null);
				expect(e,'instant-check attribute').to.not.have.attr('num');
			});
	});
	
	it("propTypes.Number - Set Property As Boolean",()=>{
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
	
	it("propTypes.NumberLegacy - Set Property As String 'abc'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = 'abc';
				expect(e.legacyNum,'instant-check property').to.satisfy(Cypress._.isNaN);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','NaN');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As String '42'",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = '42';
				expect(e,'instant-check property').to.have.property('legacyNum',42);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','42');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As Object",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = {};
				expect(e.legacyNum,'instant-check property').to.satisfy(Cypress._.isNaN);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','NaN');
			});
	});
	
	it("propTypes.NumberLegacy - Set Property As Boolean",()=>{
		cy.visit('/types/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = true;
				expect(e,'instant-check property').to.have.property('legacyNum',1);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','1');
			});
		cy.get('#testElement')
			.then(([e])=>{
				e.legacyNum = false;
				expect(e,'instant-check property').to.have.property('legacyNum',0);
				expect(e,'instant-check attribute').to.have.attr('legacyNum','0');
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

describe("Data Type Usage",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});
	
	it("type as classic object/keyword - String",()=>{
		cy.visit('/types/usage-classic/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default');
				expect(e,'instant-check attribute').to.have.attr('str','Default');
				e.setAttribute('str', 'New Value');
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
				e.str = 'New Value 2';
				expect(e,'instant-check property').to.have.property('str','New Value 2');
				expect(e,'instant-check attribute').to.have.attr('str','New Value 2');
			});
	});
	
	it("type as classic object/keyword - Number",()=>{
		cy.visit('/types/usage-classic/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
				e.setAttribute('num', 43);
				expect(e,'instant-check property').to.have.property('num',43);
				expect(e,'instant-check attribute').to.have.attr('num','43');
				e.num = 44;
				expect(e,'instant-check property').to.have.property('num',44);
				expect(e,'instant-check attribute').to.have.attr('num','44');
			});
	});
	
	it("type as classic object/keyword - Boolean",()=>{
		cy.visit('/types/usage-classic/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.setAttribute('bool','');
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.removeAttribute('bool');
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.bool = true;
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.bool = false;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
	});
	
	it("type as propType.type - String",()=>{
		cy.visit('/types/usage-propType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default');
				expect(e,'instant-check attribute').to.have.attr('str','Default');
				e.setAttribute('str', 'New Value');
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
				e.str = 'New Value 2';
				expect(e,'instant-check property').to.have.property('str','New Value 2');
				expect(e,'instant-check attribute').to.have.attr('str','New Value 2');
			});
	});
	
	it("type as propType.type - Number",()=>{
		cy.visit('/types/usage-propType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
				e.setAttribute('num', 43);
				expect(e,'instant-check property').to.have.property('num',43);
				expect(e,'instant-check attribute').to.have.attr('num','43');
				e.num = 44;
				expect(e,'instant-check property').to.have.property('num',44);
				expect(e,'instant-check attribute').to.have.attr('num','44');
			});
	});
	
	it("type as propType.type - Boolean",()=>{
		cy.visit('/types/usage-propType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.setAttribute('bool','');
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.removeAttribute('bool');
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.bool = true;
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.bool = false;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
	});
	
	it("type as string - String",()=>{
		cy.visit('/types/usage-propType-string/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default');
				expect(e,'instant-check attribute').to.have.attr('str','Default');
				e.setAttribute('str', 'New Value');
				expect(e,'instant-check property').to.have.property('str','New Value');
				expect(e,'instant-check attribute').to.have.attr('str','New Value');
				e.str = 'New Value 2';
				expect(e,'instant-check property').to.have.property('str','New Value 2');
				expect(e,'instant-check attribute').to.have.attr('str','New Value 2');
			});
	});
	
	it("type as string - Number",()=>{
		cy.visit('/types/usage-propType-string/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
				e.setAttribute('num', 43);
				expect(e,'instant-check property').to.have.property('num',43);
				expect(e,'instant-check attribute').to.have.attr('num','43');
				e.num = 44;
				expect(e,'instant-check property').to.have.property('num',44);
				expect(e,'instant-check attribute').to.have.attr('num','44');
			});
	});
	
	it("type as string - Boolean",()=>{
		cy.visit('/types/usage-propType-string/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.setAttribute('bool','');
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.removeAttribute('bool');
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.bool = true;
				expect(e,'instant-check property').to.have.property('bool',true);
				expect(e,'instant-check attribute').to.have.attr('bool','');
				e.bool = false;
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
			});
	});
	
	it("custom type - customTypes.typeUppercaseWords",()=>{
		cy.visit('/types/usage-customType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('str','Default');
				expect(e,'instant-check attribute').to.have.attr('str','Default');
				e.setAttribute('str', 'foobar abc');
				expect(e,'some words - property').to.have.property('str','Foobar Abc');
				expect(e,'some words - attribute').to.have.attr('str','foobar abc');
				e.str = 'barfoo a defg';
				expect(e,'some words - property').to.have.property('str','Barfoo A Defg');
				expect(e,'some words - attribute').to.have.attr('str','Barfoo A Defg');
			});
	});
	
	it("custom type - customTypes.typeNumberRange",()=>{
		cy.visit('/types/usage-customType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('num',42);
				expect(e,'instant-check attribute').to.have.attr('num','42');
				e.setAttribute('num', 43);
				expect(e,'instant-check property').to.have.property('num',43);
				expect(e,'instant-check attribute').to.have.attr('num','43');
				e.num = 44;
				expect(e,'within-range property').to.have.property('num',44);
				expect(e,'within-range attribute').to.have.attr('num','44');
				e.setAttribute('num', 120);
				expect(e,'over-max property').to.have.property('num',50);
				expect(e,'over-max attribute').to.have.attr('num','120');
				e.num = 140;
				expect(e,'over-max property').to.have.property('num',50);
				expect(e,'over-max attribute').to.have.attr('num','50');
				e.setAttribute('num', 7);
				expect(e,'under-min property').to.have.property('num',10);
				expect(e,'under-min attribute').to.have.attr('num','7');
				e.num = 8;
				expect(e,'under-min property').to.have.property('num',10);
				expect(e,'under-min attribute').to.have.attr('num','10');
			});
	});
	
	it("custom type - customTypes.typeBoolSwitch",()=>{
		cy.visit('/types/usage-customType/');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e,'instant-check property').to.have.property('bool',false);
				expect(e,'instant-check attribute').to.not.have.attr('bool');
				e.setAttribute('bool','');
				expect(e,'empty-attr property').to.have.property('bool',null);
				expect(e,'empty-attr attribute').to.have.attr('bool','');
				e.removeAttribute('bool');
				expect(e,'no-attr property').to.have.property('bool',false);
				expect(e,'no-attr attribute').to.not.have.attr('bool');
				e.bool = true;
				expect(e,'prop-true property').to.have.property('bool',true);
				expect(e,'prop-true attribute').to.have.attr('bool','');
				e.bool = false;
				expect(e,'prop-false property').to.have.property('bool',false);
				expect(e,'prop-false attribute').to.not.have.attr('bool');
				e.setAttribute('bool','on');
				expect(e,'empty-on property').to.have.property('bool',true);
				expect(e,'empty-on attribute').to.have.attr('bool','on');
				e.setAttribute('bool','off');
				expect(e,'empty-off property').to.have.property('bool',false);
				expect(e,'empty-off attribute').to.have.attr('bool','off');
				e.bool = 'no';
				expect(e,'prop-no property').to.have.property('bool',false);
				expect(e,'prop-no attribute').to.not.have.attr('bool');
				e.bool = 'yes';
				expect(e,'prop-yes property').to.have.property('bool',true);
				expect(e,'prop-yes attribute').to.have.attr('bool','');
				e.bool = 'foobar';
				expect(e,'prop-yes property').to.have.property('bool',null);
				expect(e,'prop-yes attribute').to.not.have.attr('bool');
			});
	});
	
});
