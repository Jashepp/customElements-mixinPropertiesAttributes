
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElement = class testElementBlank extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-blank'; }
	
	static get properties() {
		return {};
	}
	
	constructor() {
		super();
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
