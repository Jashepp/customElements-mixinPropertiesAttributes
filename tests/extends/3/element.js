
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElementBase = class testElementExtendsBase extends mixinPropertiesAttributes(HTMLElement) {
	
	constructor() {
		super();
	}

	connectedCallback(){
		this.render();
	}
	
	render() {
		this.innerText = `Base Class Content`;
	}

}

export const cElement = class testElementExtends extends mixinPropertiesAttributes(cElementBase) {
	
	static get is(){ return 'test-element-extends'; }
	
	static get properties() {
		return {
			prop1: {
				type: String,
				value: 'prop1',
			},
			prop2: {
				type: String,
			}
		};
	}
	
	constructor() {
		super();
	}

	render() {
		this.innerText = `Extended Class Content Prop1:${this.prop1} Prop2:${this.prop2}`;
	}

}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
