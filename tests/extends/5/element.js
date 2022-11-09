
import { mixinPropertiesAttributes } from '../../../index.js';

export const cElementBase = class testElementExtendsBase extends mixinPropertiesAttributes(HTMLElement) {
	
	static get properties() {
		return {
			prop: {
				type: String,
				value: 'default1',
			}
		};
	}

	set prop(str){
		this.setLog.push('base-set-prop:'+str);
		this.queueRender();
	}
	
	constructor() {
		super();
		this.setLog = [];
		this.renderQueued = null;
	}

	connectedCallback(){
		this.queueRender();
	}
	
	render() {
		this.innerText = `Base Class Content`;
	}
	
	queueRender(){
		if(this.renderQueued) return;
		// In real-world, use requestAnimationFrame, but we use Promise to speed up tests
		this.renderQueued = Promise.resolve().then(()=>{
			this.render();
			this.renderQueued = null;
		});
	}

}

export const cElement = class testElementExtends extends mixinPropertiesAttributes(cElementBase) {
	
	static get is(){ return 'test-element-extends'; }
	
	static get properties() {
		return {
			prop: {
				type: String,
				value: 'default2',
			}
		};
	}
	
	set prop(str){
		this.setLog.push('extended-set-prop:'+str);
		this.queueRender();
	}
	
	constructor() {
		super();
	}

	render() {
		this.innerText = `Extended Class Content Prop:${this.prop}`;
	}

}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
