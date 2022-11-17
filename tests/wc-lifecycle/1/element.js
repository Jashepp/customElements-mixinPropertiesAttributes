
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElement = class testElementLifecycle extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-lifecycle'; }
	
	static get properties() {
		return (cElement.propertiesHook||(_=>_))({
			prop1: {
				type: String,
				value: 'prop1',
			},
			prop2: {
				type: String,
			}
		});
	}

	set prop2(v){}

	constructor() {
		super({
			onPropertySet: ({element,name,config,newValue,oldValue})=>{
				if(!('log' in element)) element.log = ['within-mixin-constructor'];
				element.log.push(name+':'+oldValue+':'+newValue);
			}
		});
		if(!('log' in this)) this.log = [];
		this.log.push('cElement-constructor-end');
	}

	connectedCallback(){
		this.render();
	}
	
	render() {
		this.innerText = `Element Content ${this.prop1} ${this.prop2}`;
	}

}

window.tests_customElement = cElement;

window.tests_customElement_define = ()=>customElements.define(cElement.is,cElement),customElements.whenDefined(cElement.is);
