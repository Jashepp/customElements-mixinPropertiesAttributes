
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElement = class testElementSimple extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-simple'; }
	
	static get properties() {
		return {
			name: {
				type: String,
				value: 'Default',
			},
			mixedCaseProp: {
				type: String,
				value: 'mixedCaseProp',
			}
		};
	}
	
	constructor() {
		super();
		//this.attachShadow({ mode:'open' });
	}

	connectedCallback(){
		this.render();
	}
	
	set name(v){
		this.render();
	}
	
	render() {
		this.innerText = `Hello, ${this.name}`;
	}
	
}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
