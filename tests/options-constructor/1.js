
import { mixinPropertiesAttributes } from '../../index.js';

export const cElement = class testElementOptions extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-options'; }
	
	static get properties() {
		return {
			prop: {
				type: String,
				value: 'prop',
			},
			prop2: {
				type: String,
			},
			prop3: {
				type: String,
				customPropOpt: 'foobar'
			}
		};
	}
	
	constructor() {
		let propStore = { prop2:'prop2viaPropStore' };
		let onPropSetOrder = [];
		super({
			propertyStore: propStore,
			onPropertySet: (obj)=>{
				let { element,name,config,newValue,oldValue } = obj;
				this.lastOnPropertySet = obj;
				onPropSetOrder.push(name);
			}
		});
		this.lastOnPropertySet = null;
		this.propStore = propStore;
		this.onPropSetOrder = onPropSetOrder;
		this.prop = 'prop1';
		this.prop3 = 'prop3';
	}

	connectedCallback(){
		this.render();
	}
	
	render() {
		this.innerText = `Element Content`;
	}

}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
