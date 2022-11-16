"use strict";

let ignoreUncaughtErrors = false, lastUncaughtError = null;
Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	lastUncaughtError = err;
	return !ignoreUncaughtErrors;
});

describe("Property Options",()=>{
	beforeEach(()=>{
		ignoreUncaughtErrors = false;
		lastUncaughtError = null;
	});

	it("attribute: different than property name",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','attrDiffAttribute','foo')
			.should('not.have.attr','attrDiffProp','')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp','foo');
				expect(e).to.not.have.property('attrDiffAttribute');
				e.attrDiffProp = 'bar';
			})
			.should('have.attr','attrDiffAttribute','bar')
			.should('not.have.attr','attrDiffProp','')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp','bar');
				expect(e).to.not.have.property('attrDiffAttribute');
				e.setAttribute('attrDiffAttribute','foobar');
			})
			.should('have.attr','attrDiffAttribute','foobar')
			.should('not.have.attr','attrDiffProp','')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp','foobar');
				expect(e).to.not.have.property('attrDiffAttribute');
				e.attrDiffAttribute = 'not-change';
				e.setAttribute('attrDiffProp','not-change');
			})
			.should('have.attr','attrDiffAttribute','foobar')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp','foobar');
			});
	});

	it("attribute: name swapped with different property/attribute",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','attrDiffProp2','foo3')
			.should('have.attr','attrDiffProp3','foo2')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp2','foo2');
				expect(e).to.have.property('attrDiffProp3','foo3');
				e.attrDiffProp2 = 'bar2';
				e.attrDiffProp3 = 'bar3';
			})
			.should('have.attr','attrDiffProp2','bar3')
			.should('have.attr','attrDiffProp3','bar2')
			.then(([e])=>{
				expect(e).to.have.property('attrDiffProp2','bar2');
				expect(e).to.have.property('attrDiffProp3','bar3');
			});
	});

	it("attribute: existing attrib name - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-basic/3-attribute-conflictAttribName.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'attrDiffProp/attrdiffattribute' on testElementOptions. It already exists as a different property/attribute 'attrDiffPropConflict/attrdiffattribute'.`);
				expect(e).to.not.have.property('attrDiffPropConflict');
			})
			.should('not.have.attr','attrDiffPropConflict','');
	});

	it("attribute: existing attrib name (using prop name) - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-basic/3-attribute-existingPropName.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'attrDiffPropConflict/attrdiffprop' on testElementOptions. It already exists as a different property/attribute 'attrDiffProp'.`);
				expect(e).to.not.have.property('attrDiffPropConflict');
			})
			.should('not.have.attr','attrDiffPropConflict','');
	});

	it("reflectFromAttribute: false - no type",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','reflect1','reflect1')
			.then(([e])=>{
				expect(e.reflect1,'Init Prop Value').to.eq('reflect1');
				e.setAttribute('reflect1','ChangedViaAttrib');
				expect(e.reflect1,'After Attrib Change - Prop').to.eq('reflect1');
			})
			.should('have.attr','reflect1','ChangedViaAttrib')
			.then(([e])=>{
				e.reflect1 = 'ChangedViaProp';
				expect(e.reflect1,'After Prop Change - Prop').to.eq('ChangedViaProp');
			})
			.should('have.attr','reflect1','ChangedViaProp');
	});

	it("reflectToAttribute: false - no type",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','reflect2','')
			.then(([e])=>{
				expect(e.reflect2,'Init Prop Value').to.eq('reflect2');
				e.reflect2 = 'ChangedViaProp';
				expect(e.reflect2,'After Prop Change - Prop').to.eq('ChangedViaProp');
			})
			.should('not.have.attr','reflect2','')
			.then(([e])=>{
				e.setAttribute('reflect2','ChangedViaAttrib');
				expect(e.reflect2,'After Attrib Change - Prop').to.eq('ChangedViaAttrib');
			})
			.should('have.attr','reflect2','ChangedViaAttrib');
	});

	it("reflectFromAttribute: callback - with type - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-basic/2-reflectFrom.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'reflectFrom' on testElementOptions. reflectFromAttribute callback does not work with the specified type.`);
				expect(e).to.not.have.property('reflectFrom');
			})
			.should('not.have.attr','reflectFrom','');
	});

	it("reflectToAttribute: callback - with type - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-basic/2-reflectTo.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'reflectTo' on testElementOptions. reflectToAttribute callback does not work with the specified type.`);
				expect(e).to.not.have.property('reflectTo');
			})
			.should('not.have.attr','reflectTo','');
	});

	it("reflectToAttributeInConstructor: true",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.reflect3,'Init Prop Value').to.eq('reflect3');
				expect(e.reflect3HasAtribOnConstruct,'Had Attribute on Construct').to.eq(true);
				expect(e.reflect3HasAtribOnConnect,'Had Attribute on Connect').to.eq(true);
			})
			.should('have.attr','reflect3','reflect3');
	});

	it("reflectToAttributeInConstructor: false",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.reflect4,'Init Prop Value').to.eq('reflect4');
				expect(e.reflect4HasAtribOnConstruct,'Had Attribute on Construct').to.eq(false);
				expect(e.reflect4HasAtribOnConnect,'Had Attribute on Connect').to.eq(false);
			})
			.should('not.have.attr','reflect4','')
			.then(([e])=>{
				e.reflect4 = 'Changed';
				expect(e.reflect4,'After Prop Change').to.eq('Changed');
			})
			.should('have.attr','reflect4','Changed');
	});

	it("Watch for changes via set",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','watchViaSet','watchViaSet')
			.then(([e])=>{
				expect(e.watchViaSet,'Init Prop Value').to.eq('watchViaSet');
				expect(e.watchViaSetTriggered).to.eq(null);
				e.watchViaSet = 'Changed';
				expect(e.watchViaSet,'Init Prop Value').to.eq('Changed');
				expect(e.watchViaSetTriggered).to.eq('Changed');
			})
			.should('have.attr','watchViaSet','Changed');
	});

	it("Watch for changes via set - reflectToAttributeInConstructor: false",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','watchViaSet2','')
			.then(([e])=>{
				expect(e.watchViaSet2,'Init Prop Value').to.eq('watchViaSet2');
				expect(e.watchViaSet2Triggered).to.eq(null);
				e.watchViaSet2 = 'Changed';
				expect(e.watchViaSet2,'Changed Prop Value').to.eq('Changed');
				expect(e.watchViaSet2Triggered).to.eq('Changed');
			})
			.should('have.attr','watchViaSet2','Changed');
	});

	it("delayChangeInConstructor: true - with type - pre-set via Attribute",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','delay1','SetViaAttribute')
			.then(([e])=>{
				expect(e.delay1,'Init Prop Value').to.eq('SetViaAttribute');
				expect(e.delay1Triggered).to.eq('SetViaAttribute');
				expect(e.delay1TriggeredInConstructor,'delay1TriggeredInConstructor').to.eq(false);
				e.delay1 = 'Changed';
				expect(e.delay1,'Changed Prop Value').to.eq('Changed');
				expect(e.delay1Triggered).to.eq('Changed');
			})
			.should('have.attr','delay1','Changed');
	});

	it("delayChangeInConstructor: false - with type - pre-set via Attribute",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','delay2','SetViaAttribute')
			.then(([e])=>{
				expect(e.delay2,'Init Prop Value').to.eq('SetViaAttribute');
				expect(e.delay2Triggered).to.eq('SetViaAttribute');
				expect(e.delay2TriggeredInConstructor,'delay2TriggeredInConstructor').to.eq(true);
				e.delay2 = 'Changed';
				expect(e.delay2,'Changed Prop Value').to.eq('Changed');
				expect(e.delay2Triggered).to.eq('Changed');
			})
			.should('have.attr','delay2','Changed');
	});

	it("delayChangeInConstructor: true - with type - set in constructor via property",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','delay3','ChangedInConstructor')
			.then(([e])=>{
				expect(e.delay3,'Init Prop Value').to.eq('ChangedInConstructor');
				expect(e.delay3Triggered).to.eq('ChangedInConstructor');
				expect(e.delay3TriggeredInConstructor,'delay3TriggeredInConstructor').to.eq(false);
				e.delay3 = 'Changed';
				expect(e.delay3,'Changed Prop Value').to.eq('Changed');
				expect(e.delay3Triggered).to.eq('Changed');
			})
			.should('have.attr','delay3','Changed');
	});

	it("delayChangeInConstructor: false - with type - set in constructor via property",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','delay4','ChangedInConstructor')
			.then(([e])=>{
				expect(e.delay4,'Init Prop Value').to.eq('ChangedInConstructor');
				expect(e.delay4Triggered).to.eq('ChangedInConstructor');
				expect(e.delay4TriggeredInConstructor,'delay4TriggeredInConstructor').to.eq(true);
				e.delay4 = 'Changed';
				expect(e.delay4,'Changed Prop Value').to.eq('Changed');
				expect(e.delay4Triggered).to.eq('Changed');
			})
			.should('have.attr','delay4','Changed');
	});

	it("delayChangeInConstructor: true - with no type - default value",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','delay5','')
			.then(([e])=>{
				expect(e.delay5,'Init Prop Value').to.eq('delay5');
				expect(e.delay5Triggered).to.eq(null);
				expect(e.delay5TriggeredInConstructor,'delay5TriggeredInConstructor').to.eq(false);
				e.delay5 = 'Changed';
				expect(e.delay5,'Changed Prop Value').to.eq('Changed');
				expect(e.delay5Triggered).to.eq('Changed');
			})
			.should('not.have.attr','delay5','');
	});

	it("delayChangeInConstructor: false - with no type - default value",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','delay6','')
			.then(([e])=>{
				expect(e.delay6,'Init Prop Value').to.eq('delay6');
				expect(e.delay6Triggered).to.eq(null);
				expect(e.delay6TriggeredInConstructor,'delay6TriggeredInConstructor').to.eq(false);
				e.delay6 = 'Changed';
				expect(e.delay6,'Changed Prop Value').to.eq('Changed');
				expect(e.delay6Triggered).to.eq('Changed');
			})
			.should('not.have.attr','delay6','');
	});

	it("delayChangeInConstructor: true - with no type - set in constructor via property",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','delay7','')
			.then(([e])=>{
				expect(e.delay7,'Init Prop Value').to.eq('ChangedInConstructor');
				expect(e.delay7Triggered).to.eq('ChangedInConstructor');
				expect(e.delay7TriggeredInConstructor,'delay7TriggeredInConstructor').to.eq(false);
				e.delay7 = 'Changed';
				expect(e.delay7,'Changed Prop Value').to.eq('Changed');
				expect(e.delay7Triggered).to.eq('Changed');
			})
			.should('not.have.attr','delay7','');
	});

	it("delayChangeInConstructor: false - with no type - set in constructor via property",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','delay8','')
			.then(([e])=>{
				expect(e.delay8,'Init Prop Value').to.eq('ChangedInConstructor');
				expect(e.delay8Triggered).to.eq('ChangedInConstructor');
				expect(e.delay8TriggeredInConstructor,'delay8TriggeredInConstructor').to.eq(true);
				e.delay8 = 'Changed';
				expect(e.delay8,'Changed Prop Value').to.eq('Changed');
				expect(e.delay8Triggered).to.eq('Changed');
			})
			.should('not.have.attr','delay8','');
	});

	it("Attribute Transformation - Change Value",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.reflectfnchangeval,'Init Prop Value').to.eq('reflectfnchangeval');
			})
			.should('have.attr','reflectfnchangeval','_reflectfnchangeval')
			.then(([e])=>{
				e.reflectfnchangeval = 'Changed';
				expect(e.reflectfnchangeval,'After Prop Change').to.eq('Changed');
			})
			.should('have.attr','reflectfnchangeval','_Changed');
	});

	it("Attribute Transformation - reflectToAttribute only",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','reflectfnattribtransform1','')
			.then(([e])=>{
				expect(e.reflectfnattribtransform1,'Init Prop Value').to.eq(void 0);
				e.reflectfnattribtransform1 = 'Changed';
			})
			.should('have.attr','reflectfnattribtransform1','Changed')
			.then(([e])=>{
				e.reflectfnattribtransform1 = 'null';
			})
			.should('not.have.attr','reflectfnattribtransform1','');
	});

	it("Attribute Transformation - reflectFromAttribute only",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','reflectfnattribtransform2','')
			.then(([e])=>{
				expect(e.reflectfnattribtransform2,'Init Transformed Prop Value').to.eq('noAttribute');
				e.setAttribute('reflectfnattribtransform2','undefined');
				expect(e.reflectfnattribtransform2,'check undefined').to.eq(void 0);
				e.setAttribute('reflectfnattribtransform2','this');
				expect(e.reflectfnattribtransform2,'this keyword').to.eq('hasThis');
				e.setAttribute('reflectfnattribtransform2', void 0);
				expect(e.reflectfnattribtransform2,'Default Value').to.eq(void 0);
				e.removeAttribute('reflectfnattribtransform2');
				expect(e.reflectfnattribtransform2,'Remove Attribute').to.eq('noAttribute');
				e.setAttribute('reflectfnattribtransform2','Something');
				e.setAttribute('reflectfnattribtransform2','previous');
				expect(e.reflectfnattribtransform2,'Previous Value').to.eq('Something');
			});
	});

	it("Attribute Transformation - reflectToAttribute and reflectFromAttribute",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','reflectfnattribtransform3','_undefined2')
			.then(([e])=>{
				expect(e.reflectfnattribtransform3,'Init Transformed Prop Value').to.eq('_undefined2');
				e.setAttribute('reflectfnattribtransform3','Test1');
				expect(e.reflectfnattribtransform3,'Normal transform from attribute').to.eq('Test1');
				e.reflectfnattribtransform3 = 'Test2';
			})
			.should('have.attr','reflectfnattribtransform3','Test2')
			.then(([e])=>{
				e.setAttribute('reflectfnattribtransform3','undefined');
				expect(e.reflectfnattribtransform3,'check undefined').to.eq('_undefined2');
				e.setAttribute('reflectfnattribtransform3','this');
				expect(e.reflectfnattribtransform3,'this keyword').to.eq('hasThis');
				e.setAttribute('reflectfnattribtransform3', void 0);
				expect(e.reflectfnattribtransform3,'Default Value').to.eq('_undefined2');
				e.removeAttribute('reflectfnattribtransform3');
				expect(e.reflectfnattribtransform3,'Remove Attribute').to.eq('noAttribute');
				e.setAttribute('reflectfnattribtransform3','Something');
				e.setAttribute('reflectfnattribtransform3','previous');
				expect(e.reflectfnattribtransform3,'Previous Value').to.eq('Something');
				e.reflectfnattribtransform3 = 'null';
			})
			.should('have.attr','reflectfnattribtransform3','noAttribute')
			.then(([e])=>{
				e.reflectfnattribtransform3 = void 0;
			})
			.should('have.attr','reflectfnattribtransform3','_undefined2');
	});

	it("Read Only - String type with reflectToAttribute: false",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','readonly1','')
			.then(([e])=>{
				expect(e.readonly1,'Init Prop Value').to.eq('readonly1');
				try {
					e.readonly1 = 'Changed';
				} catch (err) {}
				expect(e.readonly1,'Remain Unchanged').to.eq('readonly1');
			})
			.should('not.have.attr','readonly1','')
			.then(([e])=>{
				e.setAttribute('readonly1','ChangedViaAttrib');
				expect(e.readonly1,'Remain Unchanged').to.eq('readonly1');
			})
			.should('have.attr','readonly1','ChangedViaAttrib');
	});

	it("Read Only - String type with reflectToAttribute: true",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','readonly2','readonly2')
			.then(([e])=>{
				expect(e.readonly2,'Init Prop Value').to.eq('readonly2');
				try {
					e.readonly2 = 'Changed';
				} catch (err) {}
				expect(e.readonly2,'Remain Unchanged').to.eq('readonly2');
			})
			.should('have.attr','readonly2','readonly2')
			.then(([e])=>{
				e.setAttribute('readonly2','ChangedViaAttrib');
				expect(e.readonly2,'Remain Unchanged').to.eq('readonly2');
			})
			.should('have.attr','readonly2','ChangedViaAttrib');
	});

	it("Read Only - No type with reflectToAttribute: false",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('not.have.attr','readonly3','')
			.then(([e])=>{
				expect(e.readonly3,'Init Prop Value').to.eq('readonly3');
				try {
					e.readonly3 = 'Changed';
				} catch (err) {}
				expect(e.readonly3,'Remain Unchanged').to.eq('readonly3');
			})
			.should('not.have.attr','readonly3','')
			.then(([e])=>{
				e.setAttribute('readonly3','ChangedViaAttrib');
				expect(e.readonly3,'Remain Unchanged').to.eq('readonly3');
			})
			.should('have.attr','readonly3','ChangedViaAttrib');
	});

	it("Read Only - No type with reflectToAttribute: true",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','readonly4','readonly4')
			.then(([e])=>{
				expect(e.readonly4,'Init Prop Value').to.eq('readonly4');
				try {
					e.readonly4 = 'Changed';
				} catch (err) {}
				expect(e.readonly4,'Remain Unchanged').to.eq('readonly4');
			})
			.should('have.attr','readonly4','readonly4')
			.then(([e])=>{
				e.setAttribute('readonly4','ChangedViaAttrib');
				expect(e.readonly4,'Remain Unchanged').to.eq('readonly4');
			})
			.should('have.attr','readonly4','ChangedViaAttrib');
	});

	it("observer: as String",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','observer1','observer1')
			.then(([e])=>{
				expect(e.observer1,'Init Prop Value').to.eq('observer1');
				expect(e.previousOnObserver1).to.eq(null);
				e.previousOnObserver1 = null;
				e.observer1 = 'Changed';
				expect(e.observer1,'Changed Value').to.eq('Changed');
				expect(e.previousOnObserver1).to.not.eq(null);
				expect(e.previousOnObserver1).to.have.property('element', e);
				expect(e.previousOnObserver1).to.have.property('name','observer1');
				expect(e.previousOnObserver1).to.have.property('config');
				assert.isObject(e.previousOnObserver1.config,'config is an object');
				expect(e.previousOnObserver1).to.have.property('newValue','Changed');
				expect(e.previousOnObserver1).to.have.property('oldValue','observer1');
			});
	});

	it("observer: as Function Callback",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','observer2','observer2')
			.then(([e])=>{
				expect(e.observer2,'Init Prop Value').to.eq('observer2');
				expect(e.previousOnObserver2).to.eq(null);
				e.previousOnObserver2 = null;
				e.observer2 = 'Changed';
				expect(e.observer2,'Changed Value').to.eq('Changed');
				expect(e.previousOnObserver2).to.not.eq(null);
				assert.isObject(e.previousOnObserver2,'Observer argument is an object');
				expect(e.previousOnObserver2).to.have.property('element', e);
				expect(e.previousOnObserver2).to.have.property('name','observer2');
				expect(e.previousOnObserver2).to.have.property('config');
				assert.isObject(e.previousOnObserver2.config,'config is an object');
				expect(e.previousOnObserver2).to.have.property('newValue','Changed');
				expect(e.previousOnObserver2).to.have.property('oldValue','observer2');
			});
	});

	it("notify1: true",()=>{
		cy.visit('/options-basic/index.html');
		let changedViaEvent = false, lastEvent = null;
		cy.get('#testElement')
			.should('have.attr','notify1','notify1')
			.then(([e])=>{
				expect(e.notify1,'Init Prop Value').to.eq('notify1');
				e.addEventListener('notify1-changed', function onNotify1Change(event) {
					changedViaEvent = true;
					lastEvent = event;
				});
				expect(changedViaEvent,'changedViaEvent').to.eq(false);
				e.notify1 = 'Changed1';
				expect(e.notify1,'Changed Value').to.eq('Changed1');
				expect(changedViaEvent,'changedViaEvent').to.eq(true);
				changedViaEvent = false;
				e.setAttribute('notify1','Changed2');
				expect(e.notify1,'Changed Value').to.eq('Changed2');
				expect(changedViaEvent).to.eq(true);
			})
			.should('have.attr','notify1','Changed2')
			.then(([e])=>{
				assert.isObject(lastEvent.detail,'event.detail is an object');
				expect(lastEvent.detail).to.have.property('element', e);
				expect(lastEvent.detail).to.have.property('name','notify1');
				expect(lastEvent.detail).to.have.property('config');
				assert.isObject(lastEvent.detail.config,'config is an object');
				expect(lastEvent.detail).to.have.property('newValue','Changed2');
				expect(lastEvent.detail).to.have.property('oldValue','Changed1');
			});
	});

	it("Order option",()=>{
		cy.visit('/options-basic/index.html');
		cy.get('#testElement')
			.should('have.attr','order0','order0')
			.should('have.attr','order1','order1')
			.should('have.attr','order2','order2')
			.should('have.attr','order3','order3')
			.then(([e])=>{
				let outer = e.outerHTML;
				let pos0 = outer.indexOf('order0');
				let pos1 = outer.indexOf('order1');
				let pos2 = outer.indexOf('order2');
				let pos3 = outer.indexOf('order3');
				expect(pos0,'Attribute: order0 should be last').to.be.gte(pos1).and.be.gte(pos2).and.be.gte(pos3);
				expect(pos2,'Attribute: order2 should be first').to.be.lte(pos1).and.be.lte(pos3).and.be.lte(pos0);
				expect(pos3,'Attribute: order3 should be after order2').to.be.lte(pos1).and.be.gte(pos2).and.be.lte(pos0);
				expect(pos1,'Attribute: order1 should be after order3').to.be.gte(pos3).and.be.gte(pos2).and.be.lte(pos0);
			})
			.then(([e])=>{
				let keys = Object.keys(e);
				let pos0 = keys.indexOf('order0');
				let pos1 = keys.indexOf('order1');
				let pos2 = keys.indexOf('order2');
				let pos3 = keys.indexOf('order3');
				expect(pos0,'Attribute: order0 should be last').to.be.gte(pos1).and.be.gte(pos2).and.be.gte(pos3);
				expect(pos2,'Attribute: order2 should be first').to.be.lte(pos1).and.be.lte(pos3).and.be.lte(pos0);
				expect(pos3,'Attribute: order3 should be after order2').to.be.lte(pos1).and.be.gte(pos2).and.be.lte(pos0);
				expect(pos1,'Attribute: order1 should be after order3').to.be.gte(pos3).and.be.gte(pos2).and.be.lte(pos0);
		});
	});

	it("Emit Change Order",()=>{
		cy.visit('/options-constructor/1.html');
		cy.get('#testElement')
			.should('have.attr','prop','prop1')
			.should('have.attr','prop2','')
			.should('have.attr','prop3','prop3')
			.then(([e])=>{
				let list = e.onPropSetOrder;
				let prop = list.indexOf('prop');
				let prop2 = list.indexOf('prop2');
				let prop3 = list.indexOf('prop3');
				expect(prop,'prop first').to.be.lt(prop2).and.be.lt(prop3);
				expect(prop2,'prop2 second').to.be.gt(prop).and.be.lt(prop3);
				expect(prop3,'prop3 third').to.be.gt(prop).and.be.gt(prop2);
			});
	});

	it("Custom config properties",()=>{
		cy.visit('/options-constructor/1.html');
		cy.get('#testElement')
			.should('have.attr','prop3','prop3')
			.then(([e])=>{
				assert.isObject(e.lastOnPropertySet,'onPropertySet argument is an object');
				expect(e.lastOnPropertySet).to.have.property('name','prop3');
				expect(e.lastOnPropertySet).to.have.property('config');
				assert.isObject(e.lastOnPropertySet.config,'config is an object');
				expect(e.lastOnPropertySet.config).to.have.property('customPropOpt','foobar');
				expect(e.lastOnPropertySet.config).to.have.property('type');
			});
	});

});

describe("Constructor Options",()=>{

	it("onPropertySet",()=>{
		cy.visit('/options-constructor/1.html');
		cy.get('#testElement')
			.should('have.attr','prop','prop1')
			.then(([e])=>{
				assert.isObject(e.lastOnPropertySet,'onPropertySet argument is an object');
				expect(e.lastOnPropertySet).to.have.property('element', e);
				expect(e.lastOnPropertySet).to.have.property('name','prop3');
				expect(e.lastOnPropertySet).to.have.property('config');
				expect(e.lastOnPropertySet).to.have.property('newValue','prop3');
				expect(e.lastOnPropertySet).to.have.property('oldValue','');
				expect(e.prop,'Init Prop Value').to.eq('prop1');
				e.prop = 'Changed';
				expect(e.prop,'Change Value').to.eq('Changed');
				assert.isObject(e.lastOnPropertySet,'onPropertySet argument is an object');
				expect(e.lastOnPropertySet).to.have.property('element', e);
				expect(e.lastOnPropertySet).to.have.property('name','prop');
				expect(e.lastOnPropertySet).to.have.property('config');
				expect(e.lastOnPropertySet).to.have.property('newValue','Changed');
				expect(e.lastOnPropertySet).to.have.property('oldValue','prop1');
				assert.isObject(e.lastOnPropertySet.config,'config is an object');
				expect(e.lastOnPropertySet.config).to.have.property('value','prop');
			});
	});

	it("propertyStore",()=>{
		cy.visit('/options-constructor/1.html');
		cy.get('#testElement')
			.should('have.attr','prop2','')
			.then(([e])=>{
				expect(e.prop2,'Init Prop Value').to.eq('prop2viaPropStore');
				e.propStore.prop2 = 'SecretlyChanged';
				expect(e.prop2,'Changed directly in prop store').to.eq('SecretlyChanged');
			})
			.should('have.attr','prop2','')
			.then(([e])=>{
				e.prop2 = 'Changed';
				expect(e.prop2,'Change normally').to.eq('Changed');
				expect(e.propStore.prop2,'Changed in prop store').to.eq('Changed');
			})
			.should('have.attr','prop2','Changed')
			.then(([e])=>{
				e.propStore.prop2 = 'SecretlyChanged2';
				expect(e.prop2,'Changed directly in prop store').to.eq('SecretlyChanged2');
			})
			.should('have.attr','prop2','Changed')
			.then(([e])=>{
				delete e.propStore.prop2;
				expect(e.prop2,'Deleted from prop store (reads from attribute)').to.eq('Changed');
			})
			.should('have.attr','prop2','Changed');
	});

	it("propertiesName",()=>{
		cy.visit('/options-constructor/2-propertiesName.html');
		cy.get('#testElement')
			.should('have.attr','prop1','prop1')
			.then(([e])=>{
				e.prop1 = 'Changed';
				expect(e.prop1,'Change').to.eq('Changed');
			})
			.should('have.attr','prop1','Changed')
			.then(([e])=>{
				expect(e.innerText,'Changed Content').to.eq('Element Content Changed');
			});
	});

	it("superArguments option",()=>{
		cy.visit('/options-constructor/3-super1.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.constructorError1,'Check constructorError1').to.eq(null);
				expect(e.underTest,'Check underTest').to.eq('valueFromMain1');
			})
			.should('have.attr','prop1','prop1');
	});

	it("superArguments as rest arguments",()=>{
		cy.visit('/options-constructor/3-super2.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.constructorError1,'Check constructorError1').to.eq(null);
				expect(e.underTest,'Check underTest').to.eq('valueFromMain2');
			})
			.should('have.attr','prop1','prop1');
	});

	it("propertyDefaults",()=>{
		cy.visit('/options-constructor/5.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(e.prop1,'Check prop1').to.eq('prop1');
				expect(e.prop2,'Check prop2').to.eq('defaultValue');
			})
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','defaultValue');
	});

	it("protectedProperties - free property",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-constructor/4-protected1.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError,'Check lastUncaughtError').to.eq(null);
				expect(e.underTest,'Check underTest').to.eq('valueFromMain3');
			})
			.should('have.attr','prop1','prop1')
			.should('have.attr','prop2','prop2');
	});

	it("protectedProperties - in-use property - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-constructor/4-protected2.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'prop2' on testElementConstructor. 'prop2' is a protected property.`);
				expect(e.underTest,'Check underTest').to.eq('valueFromMain3');
			})
			.should('not.have.attr','prop1','')
			.should('not.have.attr','prop2','');
	});

	it("protectedAttributes - in-use attribute - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-constructor/4-protected3.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'prop2' on testElementConstructor. 'prop2' is a protected attribute.`);
				expect(e.underTest,'Check underTest').to.eq('valueFromMain3');
			})
			.should('not.have.attr','prop1','')
			.should('not.have.attr','prop2','');
	});

	it("duplicate properties with different case - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-constructor/6-1.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'prop1' on testElementConstructor. It is a duplicate property (not case sensitive).`);
				expect(e).to.not.have.property('prop1');
				expect(e).to.not.have.property('ProP1');
			})
			.should('not.have.attr','prop1','');
	});

	it("existing properties - catch error",()=>{
		ignoreUncaughtErrors = true;
		cy.visit('/options-constructor/6-2.html');
		cy.get('#testElement')
			.then(([e])=>{
				expect(lastUncaughtError+'','Check lastUncaughtError').to.contain(`Unable to setup property/attribute 'prop1' on testElementConstructor. It already exists on testElementConstructor=>mixinPropertiesAttributes=>under.`);
				expect(e).to.have.property('prop1','prop1Under');
			})
			.should('not.have.attr','prop1','');
	});

});
