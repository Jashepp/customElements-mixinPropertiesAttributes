/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * 
 * MIT License
 * Copyright (c) 2022 Jason Sheppard
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

const buildProtoPropsConfig = (propertiesName,protoTree)=>{
	let propsConfig = {};
	for(let parentClass of [...protoTree].reverse()){
		if(parentClass.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass[propertiesName]);
	}
	return propsConfig;
};

const buildConstructorPropsConfig = (propertiesName,protoTree)=>{
	let propsConfig = {};
	for(let parentClass of [...protoTree].reverse()){
		if(parentClass.constructor.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass.constructor[propertiesName]);
	}
	return propsConfig;
};

const propsConfigSymbol = Symbol('mixinProps-propsConfig');
const elementPropertySymbol = Symbol('mixinProps-elementProperty');

/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * @param HTMLElement base class to apply mixin to
 * @param String propertiesName Optional: 'static get' method name for configuration of properties. Default: 'properties'
 */
export const mixinPropertiesAttributes = (base,propertiesName='properties') => class mixinPropertiesAttributes extends base {
	
	static get observedAttributes() {
		let propsLower = [], propsConfig = buildProtoPropsConfig(propertiesName,getProtoTree(this));
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
		let propsConfig = this[propsConfigSymbol];
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
			let config = propsConfig[name];
			let eProp = config[elementPropertySymbol];
			eProp.setValueViaAttribute(newValue);
		}
	}
	
	constructor({ protectedProperties=[], propertyStore={}, onPropertySet, superArguments=[] }={}) {
		super(...superArguments);
		let element = this;
		let protoTree = getConstructorTree(Object.getPrototypeOf(this));
		let propsConfig = buildConstructorPropsConfig(propertiesName,protoTree);
		this[propsConfigSymbol] = propsConfig;
		let propsLower = Object.keys(propsConfig).map(prop=>prop.toLowerCase());
		for(let i=0,l=propsLower.length; i<l; i++){
			if(propsLower.indexOf(propsLower[i])!==i) throw new Error(`Unable to setup property/attribute '${propsLower[i]}' on ${this.constructor.name}. It is a duplicate property (not case sensitive).`);
		}
		Object.keys(propsConfig)
		.sort((a,b)=>{
			let ac = propsConfig[a], bc = propsConfig[b], ao = 'order' in ac, bo = 'order' in bc;
			if(ao && bo) return ac.order<bc.order ? -1 : (ac.order>bc.order ? 1 : 0);
			return ao && !bo ? -1 : (!ao && bo ? 1 : 0);
		})
		.forEach((name)=>{
			if(protectedProperties.indexOf(name)!==-1) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. It is a protected property.`);
			let config = propsConfig[name];
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
			let hasObserver = 'observer' in config, isObserverString = hasObserver && typeof config.observer==='string';
			let isString = config.type===String, isNumber = config.type===Number, isBoolean = config.type===Boolean;
			let reflectToAttribute = 'reflectToAttribute' in config ? config.reflectToAttribute : (isString || isNumber || isBoolean);
			let reflectFromAttribute = !config.readOnly && ('reflectFromAttribute' in config ? config.reflectFromAttribute : (isString || isNumber || isBoolean));
			let transformToAttribute = typeof reflectToAttribute==='function' ? reflectToAttribute : null;
			let transformFromAttribute = typeof reflectFromAttribute==='function' ? reflectFromAttribute : null;
			if(transformToAttribute && (isString || isNumber || isBoolean)) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. reflectToAttribute callback does not work with the specified type.`);
			if(transformFromAttribute && (isString || isNumber || isBoolean)) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. reflectFromAttribute callback does not work with the specified type.`);
			reflectToAttribute = !!reflectToAttribute; reflectFromAttribute = !!reflectFromAttribute;
			let setDescriptors = [];
			for(let classObj of protoTree){
				let descriptor = Object.getOwnPropertyDescriptor(classObj,name);
				if(descriptor && descriptor.set && setDescriptors.indexOf(descriptor.set)===-1) setDescriptors.unshift(descriptor.set);
			}
			let eProp = new elementProperty({
				propertyStore, element, name, isBoolean, isNumber, isString, config, reflectFromAttribute, reflectToAttribute, transformFromAttribute, transformToAttribute, onPropertySet, hasObserver, isObserverString, setDescriptors
			});
			config.value = eProp.transformRawValue(config.value);
			config[elementPropertySymbol] = eProp;
			if(config.readOnly) Object.defineProperty(element,name,{
				enumerable: eProp.enumerable,
				configurable: eProp.configurable,
				writable: false,
				value: eProp.get()
			});
			else Object.defineProperty(element,name,eProp);
			let attribExists = this.hasAttribute(name);
			let attribValue = eProp.getValueFromAttribute();
			let reflectToAttributeInConstructor = 'reflectToAttributeInConstructor' in config ? !!config.reflectToAttributeInConstructor : true;
			if(reflectToAttribute && reflectToAttributeInConstructor && !attribExists && config.value!==attribValue){
				eProp.reflectValueToAttribute(config.value);
			}
			let delayChangeInConstructor = 'delayChangeInConstructor' in config ? !!config.delayChangeInConstructor : true;
			if(delayChangeInConstructor){
				let initValue = config.value;
				eProp.ignoreEmitChange = true;
				Promise.resolve().then(()=>{
					eProp.ignoreEmitChange = false;
					let nowValue = eProp.get();
					if(nowValue!==initValue && !eProp.firstChangeEmitted) eProp.emitChange(initValue,nowValue);
				});
			}
			if(reflectFromAttribute && attribExists && config.value!==attribValue){
				eProp.setValueViaAttribute(attribValue);
			}
			Object.freeze(config);
		});
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
		this.ignoreEmitChange = false;
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
		let { element, name, isBoolean, isNumber, isString, transformFromAttribute, config } = this.props;
		let hasAttribute = element.hasAttribute(name);
		if(isBoolean) return hasAttribute;
		if(hasAttribute && (isNumber || isString)) return this.transformRawValue(element.getAttribute(name));
		if(!config.readOnly && transformFromAttribute){
			if(this.transformingFromAttribute) return;
			this.transformingFromAttribute = true;
			let transformedValue = transformFromAttribute.apply(element,[hasAttribute ? element.getAttribute(name) : null]);
			this.transformingFromAttribute = false;
			return transformedValue;
		}
		if(hasAttribute) return element.getAttribute(name);
	}
	
	setValueViaAttribute(newValue){
		let { element, isBoolean, transformFromAttribute, config } = this.props;
		if(isBoolean) newValue = newValue!==null;
		newValue = this.transformRawValue(newValue);
		if(!config.readOnly && transformFromAttribute){
			this.transformingFromAttribute = true;
			newValue = transformFromAttribute.apply(element,[newValue]);
			this.transformingFromAttribute = false;
		}
		this.set(newValue);
	}
	
	transformRawValue(value){
		let { isBoolean, isNumber, isString } = this.props;
		if(isBoolean) value = !!value;
		else if(isNumber) value = value===void 0 ? 0 : Number(value);
		else if(isString) value = value===null || value===void 0 ? '' : ''+value;
		return value;
	}
	
	reflectValueToAttribute(newValue){
		let { element, name, reflectToAttribute, transformToAttribute, isBoolean } = this.props;
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
	}
	
	set(newValue){
		let { propertyStore, element, name, reflectToAttribute } = this.props;
		newValue = this.transformRawValue(newValue);
		let inPropStore = propertyStore.hasOwnProperty(name);
		let oldValue = element[name];
		if(oldValue===newValue && inPropStore) return;
		propertyStore[name] = newValue;
		if(reflectToAttribute) this.reflectValueToAttribute(newValue);
		this.emitChange(oldValue,newValue);
	}
	
	emitChange(oldValue,newValue){
		let { element, name, config, onPropertySet, hasObserver, isObserverString, setDescriptors } = this.props;
		if(this.ignoreEmitChange) return;
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
