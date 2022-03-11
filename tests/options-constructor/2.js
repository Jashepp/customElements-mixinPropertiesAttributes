
import { mixinPropertiesAttributes } from '../../index.js';

export const cElement = class testElementConstructor extends mixinPropertiesAttributes(HTMLElement,'myProps') {
	
	static get is(){ return 'test-element-constructor'; }
	
	static get myProps() {
		return {
			prop1: {
				type: String,
				value: 'prop1'
			}
		};
	}
	
	constructor() {
		try{
			super();
		}catch(err){
			this.constructorError1 = err;
			console.warn(err);
		}
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
