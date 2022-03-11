
import { mixinPropertiesAttributes } from '../../index.js';

class under extends HTMLElement {
	
	static get properties() {
		return {
			prop2: {
				type: String,
				value: 'prop2'
			}
		};
	}
	
	constructor(v) {
		super();
		this.underTest = v;
	}

}

export const cElement = class testElementConstructor extends mixinPropertiesAttributes(under) {
	
	static get is(){ return 'test-element-constructor'; }
	
	static get properties() {
		return {
			prop1: {
				type: String,
				value: 'prop1'
			}
		};
	}
	
	constructor() {
		super({ protectedProperties:['propThatDoesntExist'] },'valueFromMain3');
	}

	set prop1(v){ this.render(); }
	connectedCallback(){ this.render(); }
	render() { this.innerText = `Element Content ${this.prop1}`; }

}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
