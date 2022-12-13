
import { mixinPropertiesAttributes, propTypes } from '../../../index.js';

export const cElement = class testElementTypes extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-types'; }
	
	static get properties() {
		return {
			str: {
				type: propTypes.String,
				value: 'Default',
			},
			num: {
				type: propTypes.Number,
				value: 42,
			},
			bool: {
				type: propTypes.Boolean,
				value: false,
			},
		};
	}
	
	constructor() {
		super();
	}

}

customElements.define(cElement.is,cElement);
