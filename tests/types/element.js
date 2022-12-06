
import { mixinPropertiesAttributes, propTypes } from '../../../index.js';

export const cElement = class testElementTypes extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-types'; }
	
	static get properties() {
		return {
			boolEmpty: {
				type: propTypes.Boolean,
			},
			str: {
				type: propTypes.String,
				value: 'Default String Value',
			},
			num: {
				type: propTypes.Number,
				value: 42,
			},
			strEmpty: {
				type: propTypes.String,
			},
			numEmpty: {
				type: propTypes.Number,
			},
			bool: {
				type: propTypes.Boolean,
				value: true,
			},
			custom: {
				type: void 0,
				value: 'Custom',
			},
			legacyStr: {
				type: propTypes.StringLegacy,
				value: 'Default String Value',
			},
			legacyNum: {
				type: propTypes.NumberLegacy,
				value: 42,
			},
			legacyStrEmpty: {
				type: propTypes.StringLegacy,
			},
			legacyNumEmpty: {
				type: propTypes.NumberLegacy,
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
