
import { mixinPropertiesAttributes, propTypes } from '../../../index.js';

export const cElement = class testElementTypes extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-types'; }
	
	static get properties() {
		return {
			str: {
				type: 'String',
				value: 'Default',
			},
			num: {
				type: 'Number',
				value: 42,
			},
			bool: {
				type: 'Boolean',
				value: false,
			},
		};
	}
	
	constructor() {
		super();
	}

}

customElements.define(cElement.is,cElement);
