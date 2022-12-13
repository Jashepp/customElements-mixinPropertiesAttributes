
import { mixinPropertiesAttributes, propTypes } from '../../../index.js';

const customTypes = {
	_strUppercaseWords: (str)=>str.split(' ').map((s)=>s.substr(0,1).toUpperCase()+s.substr(1)).join(' '),
	typeUppercaseWords: {
		toAttribute: (v)=>{ return v===null || v==='' ? null : ''+v; },
		fromAttribute: (v)=>{ return v==null ? null : customTypes._strUppercaseWords(''+v); },
		fromProperty: (v)=>{ return v===null || v===void 0 ? null : customTypes._strUppercaseWords(''+v); },
	},
	typeNumberRange: (min,max)=>{
		let limit = (n)=>n<min?min:(n>max?max:n);
		return {
			toAttribute: (v)=>{ return v===null ? null : ''+v; },
			fromAttribute: (v)=>{ let n = Number(v); return v===null ? null : (Number.isNaN(n) ? null : limit(n)); },
			fromProperty: (v)=>{ let n = Number(v); return v===null ? null : (Number.isNaN(n) ? null : limit(n)); },
		};
	},
	typeBoolSwitch: (arrFalse,arrTrue,boolDefault=false)=>{ // ['off','no','false']
		return {
			toAttribute: (v)=>{ return v ? '' : null; },
			fromAttribute: (v)=>{ return v===null || arrFalse.includes((''+v).toLowerCase()) ? false : (boolDefault || arrTrue.includes((''+v).toLowerCase()) ? true : boolDefault); },
			fromProperty: (v)=>{ return v===false || v===null || arrFalse.includes((''+v).toLowerCase()) ? false : boolDefault || v===true || (arrTrue.includes((''+v).toLowerCase()) ? true : boolDefault); },
		};
	}
};

export const cElement = class testElementTypes extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-types'; }
	
	static get properties() {
		return {
			str: {
				type: customTypes.typeUppercaseWords,
				value: 'default',
			},
			num: {
				type: customTypes.typeNumberRange(10,50),
				value: 42,
			},
			bool: {
				type: customTypes.typeBoolSwitch(['off','no','false'],['on','yes','true'],null),
				value: false,
			},
		};
	}
	
	constructor() {
		super();
	}

}

customElements.define(cElement.is,cElement);
