/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * 
 * MIT License
 * Copyright (c) 2018 Jason Sheppard
 * 
 * See README.md for more information.
 * NPM: https://npmjs.org/package/ce-mixinprops
 * Github: https://github.com/Jashepp/customElements-mixinPropertiesAttributes
 */

const getConstructorTree = (topClass)=>{
	let protoTree = [], parentClass = null;
	while(true){
		parentClass = parentClass===null ? topClass : Object.getPrototypeOf(parentClass);
		if(!parentClass || !parentClass.constructor || parentClass.constructor===HTMLElement || parentClass.constructor===Function || parentClass.constructor===Object || parentClass.constructor===parentClass.constructor.constructor) break;
		protoTree.push(parentClass);
	}
	return protoTree;
}

const getProtoTree = (topClass)=>{
	let protoTree = [], parentClass = null;
	while(true){
		parentClass = parentClass===null ? topClass : Object.getPrototypeOf(parentClass);
		if(!parentClass || parentClass===HTMLElement || parentClass===Function || parentClass===Object || parentClass===parentClass.constructor) break;
		protoTree.push(parentClass);
	}
	return protoTree;
}

const buildProtoPropsConfig = (topClass,propertiesName,protoTree)=>{
	let propsConfig = {};
	for(let parentClass of [...protoTree].reverse()){
		if(parentClass.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass[propertiesName]);
	}
	return propsConfig;
};

const buildConstructorPropsConfig = (topClass,propertiesName,protoTree)=>{
	let propsConfig = {};
	for(let parentClass of [...protoTree].reverse()){
		if(parentClass.constructor.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass.constructor[propertiesName]);
	}
	return propsConfig;
};

const propsConfigWeakMap = WeakMap && new WeakMap();

/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * @param HTMLElement base class to apply mixin to
 * @param String propertiesName Optional: 'static get' method name for configuration of properties. Default: 'properties'
 */
export const mixinPropertiesAttributes = (base,propertiesName='properties') => class mixinPropertiesAttributes extends base {
	
	static get observedAttributes() {
		let propsLower = [], propsConfig = buildProtoPropsConfig(this,propertiesName,getProtoTree(this));
		return Object.keys(propsConfig).filter(prop=>{
			if(propsConfig[prop].readOnly) return false;
			let type = propsConfig[prop].type;
			let safeAttributeType = type===String || type===Number || type===Boolean;
			let observe = 'reflectFromAttribute' in propsConfig[prop] ? !!propsConfig[prop].reflectFromAttribute : safeAttributeType;
			if(observe){
				let propLower = prop.toLowerCase();
				if(propLower!==prop) propsLower.push(propLower);
			}
			return observe;
		}).concat(propsLower,super.observedAttributes || []);
	}
	
	attributeChangedCallback(name,oldValue,newValue){
		if(super.attributeChangedCallback) super.attributeChangedCallback(name,oldValue,newValue);
		if(oldValue===newValue) return;
		let propsConfig = (propsConfigWeakMap && propsConfigWeakMap.get(this)) || buildConstructorPropsConfig(this,propertiesName,getConstructorTree(this));
		if(!(name in propsConfig)){
			let props = Object.keys(propsConfig);
			for(let i=0,l=props.length; i<l; i++){
				if(props[i].toLowerCase()===name){
					name = props[i];
					break;
				}
			}
		}
		if(name in propsConfig){
			let config = propsConfig[name], type = config.type;
			if(type===Boolean) newValue = newValue!==null;
			else if(type===Number) newValue = Number(newValue);
			else if(type===String) newValue = newValue===null ? '' : ''+newValue;
			else if('reflectFromAttribute' in config && typeof config.reflectFromAttribute==='function') newValue = config.reflectFromAttribute.apply(this,[newValue]);
			this[name] = newValue;
		}
	}
	
	constructor({ protectedProperties=[], propertyStore={}, onPropertySet, superArguments=[] }={}) {
		super(...superArguments);
		let element = this, topClass = Object.getPrototypeOf(this);
		let protoTree = getConstructorTree(topClass);
		let propsConfig = buildConstructorPropsConfig(topClass,propertiesName,protoTree);
		if(propsConfigWeakMap) propsConfigWeakMap.set(this,propsConfig);
		let propsLower = Object.keys(propsConfig).map(prop=>prop.toLowerCase());
		for(let i=0,l=propsLower.length; i<l; i++){
			if(propsLower.indexOf(propsLower[i])!==i) throw new Error(`Unable to setup property/attribute '${propsLower[i]}' on ${this.constructor.name}. It is a duplicate property (not case sensitive).`);
		}
		for(let name in propsConfig){
			if(protectedProperties.indexOf(name)!==-1) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. It is a protected property.`);
			let config = Object.freeze(propsConfig[name]);
			if(config.overrideExisting!==true){
				let propExists = false, protoPath = [];
				for(let parentClass of protoTree){
					if(parentClass.constructor) protoPath.push(parentClass.constructor.name);
					if(parentClass.hasOwnProperty(name)){
						let descriptor = Object.getOwnPropertyDescriptor(parentClass,name);
						if(!descriptor || !descriptor.set || !descriptor.configurable || descriptor.get){
							propExists = true;
							break;
						}
					}
				}
				if(propExists) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. It already exists on ${protoPath.join('=>')}.`);
			}
			if(config.readOnly){
				Object.defineProperty(element,name,{
					enumerable: true,
					configurable: true,
					writable: false,
					value: config.value
				});
				let reflectToAttribute = 'reflectToAttribute' in config && config.reflectToAttribute;
				if(reflectToAttribute && (!element.hasAttribute(name) || element.getAttribute(name)+''!==''+config.value)) element.setAttribute(name,''+config.value);
			}
			else {
				let hasObserver = 'observer' in config, isObserverString = hasObserver && typeof config.observer==='string';
				let isString = config.type===String, isNumber = config.type===Number, isBoolean = config.type===Boolean;
				let reflectToAttribute = 'reflectToAttribute' in config ? config.reflectToAttribute : (isString || isNumber || isBoolean);
				let reflectFromAttribute = 'reflectFromAttribute' in config ? config.reflectFromAttribute : (isString || isNumber || isBoolean);
				let transformToAttribute = !isString && !isNumber && !isBoolean && typeof reflectToAttribute==='function' ? reflectToAttribute : null;
				let transformFromAttribute = !isString && !isNumber && !isBoolean && typeof reflectFromAttribute==='function' ? reflectFromAttribute : null;
				reflectToAttribute = !!reflectToAttribute; reflectFromAttribute = !!reflectFromAttribute;
				let setDescriptors = [];
				for(let classObj of protoTree){
					let descriptor = Object.getOwnPropertyDescriptor(classObj,name);
					if(descriptor && descriptor.set && setDescriptors.indexOf(descriptor.set)===-1) setDescriptors.unshift(descriptor.set);
				}
				if(reflectToAttribute && reflectFromAttribute){
					if(isBoolean && config.value && !element.hasAttribute(name)) element.setAttribute(name,'');
					if(isString && config.value!==void 0 && !element.hasAttribute(name)) element.setAttribute(name,''+config.value);
					if(isNumber && config.value!==void 0 && config.value!==null && !element.hasAttribute(name)) element.setAttribute(name,Number(config.value));
					if(transformToAttribute){
						let transformedValue = transformToAttribute.apply(element,[config.value]);
						if(transformedValue===null) element.removeAttribute(name);
						else element.setAttribute(name,transformedValue);
					}
				}
				let eProp = new elementProperty({
					propertyStore, element, name, isBoolean, isNumber, isString, config, reflectFromAttribute, reflectToAttribute, transformFromAttribute, transformToAttribute, onPropertySet, hasObserver, isObserverString, setDescriptors
				});
				Object.defineProperty(element,name,eProp);
				if(reflectFromAttribute && config.value!==eProp.getValueFromAttribute()){
					Promise.resolve().then(()=>{
						if(!eProp.firstChangeEmitted) eProp.emitChange(config.value,eProp.get());
					});
				}
			}
		}
	}
	
};

class elementProperty {
	
	constructor(props){
		this.enumerable = true;
		this.configurable = true;
		this.props = props;
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
		this.firstChangeEmitted = false;
		this.transformingFromAttribute = false;
	}
	
	get(){
		let { propertyStore, name, config, reflectFromAttribute } = this.props;
		if(propertyStore.hasOwnProperty(name)) return propertyStore[name];
		if(reflectFromAttribute){
			let value = this.getValueFromAttribute();
			if(value!==void 0) return propertyStore[name] = value;
		}
		return config.value;
	}
	
	getValueFromAttribute(){
		let { element, name, isBoolean, isNumber, transformFromAttribute } = this.props;
		let hasAttribute = element.hasAttribute(name);
		if(isBoolean) return hasAttribute;
		if(hasAttribute && isNumber) return Number(element.getAttribute(name));
		if(transformFromAttribute){
			if(this.transformingFromAttribute) return;
			this.transformingFromAttribute = true;
			let transformedValue = transformFromAttribute.apply(element,[hasAttribute ? element.getAttribute(name) : null]);
			this.transformingFromAttribute = false;
			return transformedValue;
		}
		if(hasAttribute) return element.getAttribute(name);
	}
	
	set(newValue){
		let { propertyStore, element, name, reflectToAttribute, transformToAttribute, isBoolean, isNumber, isString } = this.props;
		if(isBoolean) newValue = !!newValue;
		else if(isNumber) newValue = newValue===void 0 ? 0 : Number(newValue);
		else if(isString) newValue = newValue===null || newValue===void 0 ? '' : ''+newValue;
		let oldValue = element[name];
		if(oldValue===newValue) return;
		propertyStore[name] = newValue;
		if(reflectToAttribute){
			if(isBoolean){
				let hasAttribute = element.hasAttribute(name);
				if(!newValue && hasAttribute) element.removeAttribute(name);
				if(newValue && !hasAttribute) element.setAttribute(name,'');
			}
			else if(transformToAttribute){
				let transformedValue = transformToAttribute.apply(element,[newValue]);
				if(transformedValue===null) element.removeAttribute(name);
				else element.setAttribute(name,transformedValue);
			}
			else element.setAttribute(name,newValue);
		}
		this.emitChange(oldValue,newValue);
	}
	
	emitChange(oldValue,newValue){
		let { element, name, config, onPropertySet, hasObserver, isObserverString, setDescriptors } = this.props;
		if(!this.firstChangeEmitted) this.firstChangeEmitted = true;
		if(onPropertySet || hasObserver || config.notify){
			let detailObj = new propertyChangeDetails(element,name,config,newValue,oldValue);
			if(onPropertySet) onPropertySet.apply(element,[detailObj]);
			if(hasObserver && isObserverString) element[config.observer].apply(element,[detailObj]);
			else if(hasObserver) config.observer.apply(element,[detailObj]);
			if(config.notify) element.dispatchEvent(new CustomEvent(name+'-changed',{ detail:detailObj, bubbles:false }));
		}
		for(let i=0,l=setDescriptors.length; i<l; i++) setDescriptors[i].apply(element,[newValue]);
	}
	
}

class propertyChangeDetails {
	
	constructor(element,name,config,newValue,oldValue){
		this.element = element;
		this.name = name;
		this.config = config;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
	
}
