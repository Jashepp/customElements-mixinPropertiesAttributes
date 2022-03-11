
import { mixinPropertiesAttributes } from '../../index.js';

export const cElement = class testElementOptions extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is(){ return 'test-element-options'; }
	
	static get properties() {
		return {
			reflect1: {
				type: String,
				value: 'reflect1',
				reflectToAttribute: true,
				reflectFromAttribute: false
			},
			reflect2: {
				type: String,
				value: 'reflect2',
				reflectToAttribute: false,
				reflectFromAttribute: true
			},
			reflect3: {
				type: String,
				value: 'reflect3',
				reflectToAttribute: true,
				reflectFromAttribute: true,
				reflectToAttributeInConstructor: true
			},
			reflect4: {
				type: String,
				value: 'reflect4',
				reflectToAttribute: true,
				reflectFromAttribute: true,
				reflectToAttributeInConstructor: false
			},
			reflectfnchangeval: {
				value: 'reflectfnchangeval',
				reflectFromAttribute: function(val){
					val = val===null ? '' : ''+val;
					return val.substr(0,1)==='_' ? val.substr(1) : val;
				},
				reflectToAttribute: function(val){
					return '_'+val;
				}
			},
			reflectfnattribtransform1: {
				reflectToAttribute: function(val){
					if(val==='null') return null;
					if(val===void 0) return "_undefined2";
					return val;
				}
			},
			reflectfnattribtransform2: {
				reflectFromAttribute: function(val){
					if(val==='previous') return this?.reflectfnattribtransform2;
					if(val==='undefined') return void 0;
					if(val===null) return 'noAttribute';
					if(val==='this') return this?.render?'hasThis':'noThis';
					return val;
				}
			},
			reflectfnattribtransform3: {
				reflectFromAttribute: function(val){
					if(val==='previous') return this?.reflectfnattribtransform3;
					if(val==='undefined') return void 0;
					if(val===null) return 'noAttribute';
					if(val==='this') return this?.render?'hasThis':'noThis';
					return val;
				},
				reflectToAttribute: function(val){
					if(val==='null') return null;
					if(val===void 0) return "_undefined2";
					return val;
				}
			},
			readonly1: {
				type: String,
				readOnly: true,
				reflectToAttribute: false,
				value: 'readonly1'
			},
			readonly2: {
				type: String,
				readOnly: true,
				reflectToAttribute: true,
				value: 'readonly2'
			},
			readonly3: {
				readOnly: true,
				reflectToAttribute: false,
				value: 'readonly3'
			},
			readonly4: {
				readOnly: true,
				reflectToAttribute: true,
				value: 'readonly4'
			},
			observer1: {
				type: String,
				value: 'observer1',
				observer: 'onObserver1'
			},
			observer2: {
				type: String,
				value: 'observer2',
				observer: function onObserver2(eventDetails){
					this.previousOnObserver2 = eventDetails;
				}
			},
			notify1: {
				type: String,
				value: 'notify1',
				notify: true
			},
			watchViaSet: {
				type: String,
				value: 'watchViaSet'
			},
			watchViaSet2: {
				type: String,
				value: 'watchViaSet2',
				reflectToAttributeInConstructor: false
			},
			delay1: {
				type: String,
				value: 'delay1',
				delayChangeInConstructor: true
			},
			delay2: {
				type: String,
				value: 'delay2',
				delayChangeInConstructor: false
			},
			delay3: {
				type: String,
				value: 'delay3',
				delayChangeInConstructor: true
			},
			delay4: {
				type: String,
				value: 'delay4',
				delayChangeInConstructor: false
			},
			delay5: {
				value: 'delay5',
				delayChangeInConstructor: true
			},
			delay6: {
				value: 'delay6',
				delayChangeInConstructor: false
			},
			delay7: {
				value: 'delay7',
				delayChangeInConstructor: true
			},
			delay8: {
				value: 'delay8',
				delayChangeInConstructor: false
			},
			order0: { type: String, value:'order0' },
			order1: { order:40, type: String, value:'order1' },
			order2: { order:20, type: String, value:'order2' },
			order3: { order:30, type: String, value:'order3' },
		};
	}
	
	constructor() {
		super();
		this.reflect3HasAtribOnConstruct = this.hasAttribute('reflect3');
		this.reflect4HasAtribOnConstruct = this.hasAttribute('reflect4');
		this.previousOnObserver1 = null;
		this.previousOnObserver2 = null;
		this.watchViaSetTriggered = null;
		this.watchViaSet2Triggered = null;
		this.delay1TriggeredInConstructor = ('delay1Triggered' in this);
		this.delay2TriggeredInConstructor = ('delay2Triggered' in this);
		if(!('delay1Triggered' in this)) this.delay1Triggered = null;
		if(!('delay2Triggered' in this)) this.delay2Triggered = null;
		this.delay3 = 'ChangedInConstructor';
		this.delay4 = 'ChangedInConstructor';
		this.delay3TriggeredInConstructor = ('delay3Triggered' in this);
		this.delay4TriggeredInConstructor = ('delay4Triggered' in this);
		if(!('delay3Triggered' in this)) this.delay3Triggered = null;
		if(!('delay4Triggered' in this)) this.delay4Triggered = null;
		this.delay5TriggeredInConstructor = ('delay5Triggered' in this);
		this.delay6TriggeredInConstructor = ('delay6Triggered' in this);
		if(!('delay5Triggered' in this)) this.delay5Triggered = null;
		if(!('delay6Triggered' in this)) this.delay6Triggered = null;
		this.delay7 = 'ChangedInConstructor';
		this.delay8 = 'ChangedInConstructor';
		this.delay7TriggeredInConstructor = ('delay7Triggered' in this);
		this.delay8TriggeredInConstructor = ('delay8Triggered' in this);
		if(!('delay7Triggered' in this)) this.delay7Triggered = null;
		if(!('delay8Triggered' in this)) this.delay8Triggered = null;
	}

	connectedCallback(){
		this.render();
		this.reflect3HasAtribOnConnect = this.hasAttribute('reflect3');
		this.reflect4HasAtribOnConnect = this.hasAttribute('reflect4');
	}
	
	render() {
		this.innerText = `Element Content`;
	}

	onObserver1(eventDetails){
		this.previousOnObserver1 = eventDetails;
	}
	
	set watchViaSet(v){
		this.watchViaSetTriggered = v;
	}

	set watchViaSet2(v){
		this.watchViaSet2Triggered = v;
	}

	set delay1(v){
		this.delay1Triggered = v;
	}

	set delay2(v){
		this.delay2Triggered = v;
	}

	set delay3(v){
		this.delay3Triggered = v;
	}

	set delay4(v){
		this.delay4Triggered = v;
	}

	set delay5(v){
		this.delay5Triggered = v;
	}

	set delay6(v){
		this.delay6Triggered = v;
	}

	set delay7(v){
		this.delay7Triggered = v;
	}

	set delay8(v){
		this.delay8Triggered = v;
	}

}

function defineElement(elementClass,...args){
	var tagName = elementClass.is;
	if(tagName===void 0 && 'name' in elementClass) tagName = elementClass.name.replace(/([A-Z])/g,(g)=>`-${g[0].toLowerCase()}`);
	customElements.define(tagName,elementClass,...args);
};
defineElement(cElement);
