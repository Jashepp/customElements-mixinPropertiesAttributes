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

const propsConfigByAttributeSymbol = Symbol('mixinProps-propsConfigByAttribute');
const elementPropertySymbol = Symbol('mixinProps-elementProperty');

/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * @param HTMLElement base class to apply mixin to
 * @param String propertiesName Optional: 'static get' method name for configuration of properties. Default: 'properties'
 */
export const mixinPropertiesAttributes = (base,propertiesName='properties') => class mixinPropertiesAttributes extends base {
	
	static get observedAttributes() {
		let attributeArr = [], propsConfig = buildProtoPropsConfig(propertiesName,getProtoTree(this));
		return Object.keys(propsConfig).filter(name=>{
			let config = propsConfig[name];
			if(config.readOnly) return false;
			let attribute = ('attribute' in config ? config.attribute+'' : name).toLowerCase();
			let safeAttributeType = config.type===String || config.type===Number || config.type===Boolean;
			let observe = 'reflectFromAttribute' in config ? !!config.reflectFromAttribute : safeAttributeType;
			if(observe) attributeArr.push(attribute);
			return observe;
		}).concat(attributeArr,super.observedAttributes || []);
	}
	
	attributeChangedCallback(attribute,oldValue,newValue){
		if(super.attributeChangedCallback) super.attributeChangedCallback(attribute,oldValue,newValue);
		if(oldValue===newValue) return;
		let propsConfigByAttribute = this[propsConfigByAttributeSymbol];
		attribute = attribute.toLowerCase();
		if(attribute in propsConfigByAttribute){
			let config = propsConfigByAttribute[attribute];
			let eProp = config[elementPropertySymbol];
			let setValue = true;
			if(attribute in eProp.skipNextAttribChange){
				if(eProp.props.isBoolean && newValue!==null) newValue = true;
				if(eProp.skipNextAttribChange[attribute]===eProp.transformRawValue(newValue)) setValue = false;
				eProp.skipNextAttribChange[attribute] = void 0;
			} 
			if(setValue) eProp.setValueViaAttribute(newValue);
		}
	}
	
	constructor(argOptions={},...argRest) {
		let { protectedProperties=[], protectedAttributes=[], propertyStore={}, onPropertySet, superArguments=[], propertyDefaults={} } = Object(argOptions);
		super(...([].concat(superArguments,argRest)));
		let element = this;
		let protoTree = getConstructorTree(Object.getPrototypeOf(this));
		let propsConfig = buildConstructorPropsConfig(propertiesName,protoTree);
		let propsLower = Object.keys(propsConfig).map(prop=>prop.toLowerCase());
		for(let i=0,l=propsLower.length; i<l; i++){
			if(propsLower.indexOf(propsLower[i])!==i) throw new Error(`Unable to setup property/attribute '${propsLower[i]}' on ${this.constructor.name}. It is a duplicate property (not case sensitive).`);
		}
		protectedAttributes = protectedAttributes.map(a=>a.toLowerCase());
		let propsConfigByAttribute = this[propsConfigByAttributeSymbol] = {};
		let hasDefaults = Object.keys(propertyDefaults).length>0;
		Object.keys(propsConfig)
		.sort((a,b)=>{
			let ac = propsConfig[a], bc = propsConfig[b], ao = 'order' in ac, bo = 'order' in bc;
			if(ao && bo) return ac.order<bc.order ? -1 : (ac.order>bc.order ? 1 : 0);
			return ao && !bo ? -1 : (!ao && bo ? 1 : 0);
		})
		.forEach((name)=>{
			let config = propsConfig[name];
			if('attribute' in config && typeof config.attribute!='string') throw new Error(`Unable to setup property '${name}' on ${this.constructor.name}. Attribute is not a string.`);
			let attribute = ('attribute' in config ? config.attribute+'' : name).toLowerCase();
			let combinedName = name==attribute || name.toLowerCase()==attribute ? name : name+'/'+attribute;
			config.propertyName = name;
			propsConfigByAttribute[attribute] = config;
			if(protectedProperties.indexOf(name)!==-1) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. '${name}' is a protected property.`);
			if(protectedAttributes.indexOf(attribute)!==-1) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. '${attribute}' is a protected attribute.`);
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
				if(propExists) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. It already exists on ${protoPath.join('=>')}.`);
			}
			if(name!==attribute && name.toLowerCase()!==attribute){
				Object.keys(propsConfig).forEach((name2)=>{
					if(name==name2) return;
					let config2 = propsConfig[name2];
					let attribute2 = ('attribute' in config2 ? config2.attribute+'' : name2).toLowerCase();
					let combinedName2 = name2==attribute2 || name2.toLowerCase()==attribute2 ? name2 : name2+'/'+attribute2;
					if(attribute==attribute2) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. It already exists as a different property/attribute '${combinedName2}'.`);
				});
			}
			if(hasDefaults) for(let k in propertyDefaults){ if(!(k in config))config[k]=propertyDefaults[k]; }
			let hasObserver = 'observer' in config, isObserverString = hasObserver && typeof config.observer==='string';
			let isString = config.type===String, isNumber = config.type===Number, isBoolean = config.type===Boolean;
			let reflectToAttribute = 'reflectToAttribute' in config ? config.reflectToAttribute : (isString || isNumber || isBoolean);
			let reflectFromAttribute = !config.readOnly && ('reflectFromAttribute' in config ? config.reflectFromAttribute : (isString || isNumber || isBoolean));
			let transformToAttribute = typeof reflectToAttribute==='function' ? reflectToAttribute : null;
			let transformFromAttribute = typeof reflectFromAttribute==='function' ? reflectFromAttribute : null;
			if(transformToAttribute && (isString || isNumber || isBoolean)) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. reflectToAttribute callback does not work with the specified type.`);
			if(transformFromAttribute && (isString || isNumber || isBoolean)) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. reflectFromAttribute callback does not work with the specified type.`);
			reflectToAttribute = !!reflectToAttribute; reflectFromAttribute = !!reflectFromAttribute;
			let setDescriptors = [];
			for(let classObj of protoTree){
				let descriptor = Object.getOwnPropertyDescriptor(classObj,name);
				if(descriptor && descriptor.set && setDescriptors.indexOf(descriptor.set)===-1) setDescriptors.unshift(descriptor.set);
			}
			let eProp = config[elementPropertySymbol] = new elementProperty({
				propertyStore, element, name, attribute, isBoolean, isNumber, isString, config, reflectFromAttribute, reflectToAttribute, transformFromAttribute, transformToAttribute, onPropertySet, hasObserver, isObserverString, setDescriptors
			});
			let defaultValue = config.value = eProp.transformRawValue('value' in config ? config.value : void 0);
			let existingDescriptor = Object.getOwnPropertyDescriptor(element,name);
			let existingPropExists = existingDescriptor && existingDescriptor.enumerable;
			let existingPropValue = existingPropExists ? eProp.transformRawValue(existingDescriptor.get ? existingDescriptor.get() : existingDescriptor.value) : void 0;
			if(config.readOnly) Object.defineProperty(element,name,{
				enumerable: eProp.enumerable,
				configurable: eProp.configurable,
				writable: false,
				value: eProp.get()
			});
			else Object.defineProperty(element,name,eProp);
			let reflectToAttributeInConstructor = 'reflectToAttributeInConstructor' in config ? !!config.reflectToAttributeInConstructor : true;
			let delayChangeInConstructor = 'delayChangeInConstructor' in config ? !!config.delayChangeInConstructor : true;
			let attribExists = this.hasAttribute(attribute);
			let attribValue = eProp.getValueFromAttribute();
			if(attribExists) eProp.skipNextAttribChange[attribute] = attribValue;
			if(existingPropExists && attribExists) existingPropExists = false;
			if(!existingPropExists && !attribExists && reflectToAttribute && reflectToAttributeInConstructor && defaultValue!==attribValue){
				eProp.reflectValueToAttribute(defaultValue); // Set default value
			}
			if((existingPropExists && !attribExists && defaultValue!==existingPropValue) || (!existingPropExists && attribExists && defaultValue!==attribValue) || (!existingPropExists && !attribExists && defaultValue!==void 0)){
				if(!(name in propertyStore)) propertyStore[name] = defaultValue; // Set default value
			}
			if(delayChangeInConstructor){
				eProp.ignoreEmitChange = true;
				Promise.resolve().then(()=>{
					eProp.ignoreEmitChange = false;
					let nowValue = eProp.get();
					if(nowValue!==defaultValue && !eProp.firstChangeEmitted) eProp.emitChange(defaultValue,nowValue);
				});
			}
			if(!reflectToAttributeInConstructor && reflectToAttribute) eProp.props.reflectToAttribute = false;
			if(existingPropExists && !attribExists && defaultValue!==existingPropValue){
				eProp.set(existingPropValue); // Set new value
			}
			if(!existingPropExists && attribExists && reflectFromAttribute && defaultValue!==attribValue){
				eProp.setValueViaAttribute(attribValue); // Set new value
			}
			if(!reflectToAttributeInConstructor && reflectToAttribute) eProp.props.reflectToAttribute = true;
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
		this.skipNextAttribChange = {};
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
		let { element, attribute, isBoolean, isNumber, isString, transformFromAttribute, config } = this.props;
		let hasAttribute = element.hasAttribute(attribute);
		if(isBoolean) return hasAttribute;
		if(hasAttribute && (isNumber || isString)) return this.transformRawValue(element.getAttribute(attribute));
		if(!config.readOnly && transformFromAttribute){
			if(this.transformingFromAttribute) return;
			this.transformingFromAttribute = true;
			let transformedValue = transformFromAttribute.apply(element,[hasAttribute ? element.getAttribute(attribute) : null]);
			this.transformingFromAttribute = false;
			return transformedValue;
		}
		if(hasAttribute) return element.getAttribute(attribute);
	}
	
	setValueViaAttribute(newValue){
		let { element, isBoolean, transformFromAttribute, config } = this.props;
		if(isBoolean) newValue = newValue!==null;
		if(!config.readOnly && transformFromAttribute){
			this.transformingFromAttribute = true;
			newValue = transformFromAttribute.apply(element,[this.transformRawValue(newValue)]);
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
		let { element, attribute, reflectToAttribute, transformToAttribute, isBoolean } = this.props;
		if(reflectToAttribute){
			this.skipNextAttribChange[attribute] = newValue;
			if(isBoolean){
				let hasAttribute = element.hasAttribute(attribute);
				if(!newValue && hasAttribute) element.removeAttribute(attribute);
				if(newValue && !hasAttribute) element.setAttribute(attribute,'');
			}
			else if(transformToAttribute){
				let transformedValue = transformToAttribute.apply(element,[newValue]);
				this.skipNextAttribChange[attribute] = transformedValue;
				if(transformedValue===null) element.removeAttribute(attribute);
				else element.setAttribute(attribute,transformedValue);
			}
			else element.setAttribute(attribute,newValue);
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
