
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElement = class testElementTypes extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-types'; }
	
	static get properties() {
		return {
			str: {
				type: String,
				value: 'Default String Value',
			},
			num: {
				type: Number,
				value: 42,
			},
			bool: {
				type: Boolean,
				value: true,
			},
			custom: {
				type: void 0,
				value: 'Custom',
			},
			strEmpty: {
				type: String,
			},
			numEmpty: {
				type: Number,
			},
			boolEmpty: {
				type: Boolean,
			},
		};
	}
	
	constructor() {
		super();
	}

	connectedCallback(){
		this.render();
	}
	
	set str(v){ this.render(); }
	set num(v){ this.render(); }
	set bool(v){ this.render(); }
	
	render() {
		this.innerText = `Str ${this.str}, Num ${this.num}, Bool: ${this.bool?'true':'false'}`;
	}
	
}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
