
import { mixinPropertiesAttributes } from '../../index.js';

class under extends HTMLElement {
	
	static get is(){ return 'test-element-constructor'; }
	
	get prop1(){ return 'prop1Under'; }
	set prop1(v){}
	
	constructor() {
		super({
			propertyDefaults: { value:'defaultValue' }
		});
	}

}

export const cElement = class testElementConstructor extends mixinPropertiesAttributes(under) {
	
	static get is(){ return 'test-element-constructor'; }
	
	static get properties() {
		return {
			prop1: {
				type: String,
				value: 'prop1',
			},
		};
	}
	
	constructor() {
		super({
			propertyDefaults: { value:'defaultValue' }
		});
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
