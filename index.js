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

const symbols = Object.freeze({
	propsConfigByAttribute: Symbol('mixinProps-propsConfigByAttribute'),
	elementProperty: Symbol('mixinProps-elementProperty'),
});

export class mixinClass {

	static get symbols(){ return symbols; }

	static getConstructorTree(topClass){
		let protoTree = [], parentClass = null;
		while(true){
			parentClass = parentClass===null ? topClass : Object.getPrototypeOf(parentClass);
			if(!parentClass || !parentClass.constructor || parentClass.constructor===HTMLElement || parentClass.constructor===Function || parentClass.constructor===Object || parentClass.constructor===parentClass.constructor.constructor) break;
			protoTree.push(parentClass);
		}
		return protoTree;
	}
	
	static getProtoTree(topClass){
		let protoTree = [], parentClass = null;
		while(true){
			parentClass = parentClass===null ? topClass : Object.getPrototypeOf(parentClass);
			if(!parentClass || parentClass===HTMLElement || parentClass===Function || parentClass===Object || parentClass===parentClass.constructor) break;
			protoTree.push(parentClass);
		}
		return protoTree;
	}
	
	static buildProtoPropsConfig(propertiesName,protoTree){
		let propsConfig = {};
		for(let parentClass of [...protoTree].reverse()){
			if(parentClass.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass[propertiesName]);
		}
		return propsConfig;
	};
	
	static buildConstructorPropsConfig(propertiesName,protoTree){
		let propsConfig = {};
		for(let parentClass of [...protoTree].reverse()){
			if(parentClass.constructor.hasOwnProperty(propertiesName)) propsConfig = Object.assign(propsConfig,parentClass.constructor[propertiesName]);
		}
		return propsConfig;
	};

	static fn(fn,proto,args){
		if(fn) return fn.prototype ? fn.apply(proto,args) : fn.call(proto,...args,proto);
	}

	static ce_observedAttributes(propertiesName){
		let propsConfig = mixinClass.buildProtoPropsConfig(propertiesName,mixinClass.getProtoTree(this));
		return Object.keys(propsConfig).filter(name=>{
			let config = propsConfig[name];
			if(config.readOnly) return false;
			if('reflectFromAttribute' in config) return !!config.reflectFromAttribute;
			let type = config.type;
			if(typeof type==='string' && type in propTypes) type = propTypes[type];
			else if(type===String || type===Number || type===Boolean) return true;
			if('fromAttribute' in Object(type)) return !!type.fromAttribute;
			return false;
		}).map(name=>{
			let config = propsConfig[name];
			return ('attribute' in config ? config.attribute+'' : name).toLowerCase();
		});
	}

	static ce_attributeChangedCallback(attribute,oldValue,newValue){
		if(oldValue===newValue) return;
		let propsConfigByAttribute = this[mixinClass.symbols.propsConfigByAttribute];
		attribute = attribute.toLowerCase();
		if(attribute in propsConfigByAttribute){
			let config = propsConfigByAttribute[attribute];
			let eProp = config[mixinClass.symbols.elementProperty];
			let setValue = true;
			if(attribute in eProp.skipNextAttribChange){
				if(eProp.skipNextAttribChange[attribute]===newValue) setValue = false;
				eProp.skipNextAttribChange[attribute] = void 0;
			}
			if(setValue) eProp.setValueViaAttribute(newValue);
		}
	}
	
	static ce_mixinConstructor(argOptions,propertiesName){
		let { protectedProperties=[], protectedAttributes=[], propertyStore={}, onPropertySet, propertyDefaults={} } = Object(argOptions);
		let element = this;
		let protoTree = mixinClass.getConstructorTree(Object.getPrototypeOf(this));
		let propsConfig = mixinClass.buildConstructorPropsConfig(propertiesName,protoTree);
		let propsLower = Object.keys(propsConfig).map(prop=>prop.toLowerCase());
		for(let i=0,l=propsLower.length; i<l; i++){
			if(propsLower.indexOf(propsLower[i])!==i) throw new Error(`Unable to setup property/attribute '${propsLower[i]}' on ${this.constructor.name}. It is a duplicate property (not case sensitive).`);
		}
		protectedAttributes = protectedAttributes.map(a=>a.toLowerCase());
		let propsConfigByAttribute = this[mixinClass.symbols.propsConfigByAttribute] = {};
		let hasConfigDefaults = Object.keys(propertyDefaults).length>0;
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
			if(hasConfigDefaults) for(let k in propertyDefaults){ if(!(k in config))config[k]=propertyDefaults[k]; }
			let hasObserver = 'observer' in config && (typeof config.observer==='function' || typeof config.observer==='string');
			let isObserverString = hasObserver && typeof config.observer==='string';
			let eventName = typeof config.notify==='string' ? config.notify : (config.notify ? name+'-changed' : null);
			if(typeof config.type==='string'){
				if(config.type in propTypes) config.type = propTypes[config.type];
				else throw new Error("'"+config.type+"' is not a valid propType");
			}
			else if(config.type===String) config.type = propTypes.StringLegacy;
			else if(config.type===Number) config.type = propTypes.NumberLegacy;
			else if(config.type===Boolean) config.type = propTypes.Boolean;
			let reflectToAttribute = false, reflectFromAttribute = false, reflectFromProperty = false;
			let transformToAttribute = null, transformFromAttribute = null, transformFromProperty = null;
			if(config.type){
				if(!config.type.toAttribute || !(typeof config.type.toAttribute==='function') || !config.type.fromAttribute || !(typeof config.type.fromAttribute==='function') || !config.type.fromProperty || !(typeof config.type.fromProperty==='function')) throw new Error(`Unable to setup property/attribute '${combinedName}' on ${this.constructor.name}. Type has missing or invalid toAttribute, fromAttribute or fromProperty transform functions.`);
				transformToAttribute = config.type.toAttribute;
				transformFromAttribute = config.type.fromAttribute;
				transformFromProperty = config.type.fromProperty;
				reflectToAttribute = reflectFromAttribute = reflectFromProperty = true;
			}
			if('reflectToAttribute' in config){
				reflectToAttribute = !!config.reflectToAttribute;
				if(typeof config.reflectToAttribute==='function') transformToAttribute = config.reflectToAttribute;
				else if(!config.reflectToAttribute) transformToAttribute = null;
			}
			if(config.readOnly){ reflectFromAttribute = false; transformFromAttribute = null; }
			else if('reflectFromAttribute' in config){
				reflectFromAttribute = !!config.reflectFromAttribute;
				if(typeof config.reflectFromAttribute==='function') transformFromAttribute = config.reflectFromAttribute;
				else if(!config.reflectFromAttribute) transformFromAttribute = null;
			}
			if(config.readOnly){ reflectFromProperty = false; transformFromProperty = null; }
			else if('reflectFromProperty' in config){
				reflectFromProperty = !!config.reflectFromProperty;
				if(typeof config.reflectFromProperty==='function') transformFromProperty = config.reflectFromProperty;
				else if(!config.reflectFromProperty) transformFromProperty = null;
			}
			else if(!config.type && !reflectFromProperty) reflectFromProperty = true; // Backwards compatibility & default behavior
			let setDescriptors = [];
			for(let classObj of protoTree){
				let descriptor = Object.getOwnPropertyDescriptor(classObj,name);
				if(descriptor && descriptor.set && setDescriptors.indexOf(descriptor.set)===-1) setDescriptors.unshift(descriptor.set);
			}
			let eProp = config[mixinClass.symbols.elementProperty] = new elementProperty({
				propertyStore, element, name, attribute, config, reflectToAttribute, reflectFromAttribute, reflectFromProperty, transformToAttribute, transformFromAttribute, transformFromProperty, onPropertySet, hasObserver, isObserverString, eventName, setDescriptors
			});
			if(transformFromProperty){
				config.value = mixinClass.fn(transformFromProperty,element,['value' in config ? config.value : void 0]);
			}
			let defaultValue = config.value;
			let existingDescriptor = Object.getOwnPropertyDescriptor(element,name);
			let existingPropExists = existingDescriptor && existingDescriptor.enumerable;
			let existingPropValue = existingPropExists ? (existingDescriptor.get ? existingDescriptor.get() : existingDescriptor.value) : void 0;
			if(existingPropExists && transformFromProperty) existingPropValue = mixinClass.fn(transformFromProperty,element,[existingPropValue]);
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
			if(!existingPropExists && !attribExists && reflectToAttribute && reflectToAttributeInConstructor && defaultValue!==null){
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
			if(existingPropExists && !attribExists && reflectFromProperty && defaultValue!==existingPropValue){
				eProp.set(existingPropValue); // Set new value
			}
			if(!existingPropExists && attribExists && reflectFromAttribute && defaultValue!==attribValue){
				eProp.setValueViaAttribute(attribValue); // Set new value
			}
			if(!reflectToAttributeInConstructor && reflectToAttribute) eProp.props.reflectToAttribute = true;
			Object.freeze(config);
		});
	}

	static applyCEMixin(base,propertiesName='properties',mixinConfig={}){
		return class mixinPropertiesAttributes extends (base||HTMLElement) {
	
			static get observedAttributes() {
				return (super.observedAttributes||[]).concat(mixinClass.ce_observedAttributes.apply(this,[propertiesName]));
			}
			
			attributeChangedCallback(attribute,oldValue,newValue){
				if(super.attributeChangedCallback) super.attributeChangedCallback(attribute,oldValue,newValue);
				return mixinClass.ce_attributeChangedCallback.apply(this,[attribute,oldValue,newValue]);
			}
			
			constructor(argOptions={},...argRest) {
				argOptions = Object.assign({},Object(mixinConfig),Object(argOptions));
				super(...(Object(argOptions).superArguments||[]),...argRest);
				mixinClass.ce_mixinConstructor.apply(this,[argOptions,propertiesName]);
			}
			
		};
	}
	
}
Object.freeze(mixinClass);

/**
 * Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.
 * @param HTMLElement base class to apply mixin to
 * @param String propertiesName Optional: 'static get' method name for configuration of properties. Default: 'properties'
 */
export const mixinPropertiesAttributes = mixinClass.applyCEMixin;

export const propTypes = {
	Boolean: {
		toAttribute: (v)=>{ return v ? '' : null; },
		fromAttribute: (v)=>{ return v===null ? false : true; },
		fromProperty: (v)=>{ return !!v; },
	},
	String: {
		toAttribute: (v)=>{ return v===null || v==='' ? null : ''+v; },
		fromAttribute: (v)=>{ return v==null ? null : ''+v; },
		fromProperty: (v)=>{ return v===null || v===void 0 ? null : ''+v; },
	},
	StringLegacy: {
		toAttribute: (v)=>{ return v===null ? '' : ''+v; },
		fromAttribute: (v)=>{ return v==null ? '' : ''+v; },
		fromProperty: (v)=>{ return v===null || v===void 0 ? '' : ''+v; },
	},
	Number: {
		toAttribute: (v)=>{ return v===null ? null : ''+v; },
		fromAttribute: (v)=>{ let n = Number(v); return v===null ? null : (Number.isNaN(n) ? null : n); },
		fromProperty: (v)=>{ let n = Number(v); return v===null ? null : (Number.isNaN(n) ? null : n); },
	},
	NumberLegacy: {
		toAttribute: (v)=>{ return Number(v); },
		fromAttribute: (v)=>{ return Number(v); },
		fromProperty: (v)=>{ return v===void 0 ? 0 : Number(v); },
	},
};
Object.freeze(propTypes);

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
		this.settingViaAttribute = false;
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
		let { element, attribute, transformFromAttribute, config } = this.props;
		if(config.readOnly) return;
		if(transformFromAttribute){
			if(this.transformingFromAttribute) return;
			this.transformingFromAttribute = true;
			let transformedValue = mixinClass.fn(transformFromAttribute,element,[element.getAttribute(attribute)]);
			this.transformingFromAttribute = false;
			return transformedValue;
		}
		if(element.hasAttribute(attribute)) return element.getAttribute(attribute);
	}
	
	setValueViaAttribute(newValue){
		let { element, transformFromAttribute, config } = this.props;
		if(config.readOnly) return;
		if(transformFromAttribute){
			this.transformingFromAttribute = true;
			newValue = mixinClass.fn(transformFromAttribute,element,[newValue]);
			this.transformingFromAttribute = false;
		}
		this.settingViaAttribute = true;
		this.set(newValue);
	}
	
	reflectValueToAttribute(newValue){
		let { element, attribute, reflectToAttribute, transformToAttribute } = this.props;
		if(reflectToAttribute){
			let currentValue = element.getAttribute(attribute);
			if(transformToAttribute) newValue = mixinClass.fn(transformToAttribute,element,[newValue]);
			if(currentValue!==newValue){
				this.skipNextAttribChange[attribute] = newValue===null ? null : ''+newValue;
				if(newValue===null) element.removeAttribute(attribute);
				else element.setAttribute(attribute,newValue);
			}
		}
	}
	
	set(newValue){
		let { propertyStore, element, name, reflectToAttribute, reflectFromProperty, transformFromProperty } = this.props;
		let settingViaAttribute = this.settingViaAttribute;
		this.settingViaAttribute = false;
		if(!settingViaAttribute && !reflectFromProperty) return;
		if(!settingViaAttribute && transformFromProperty){
			newValue = mixinClass.fn(transformFromProperty,element,[newValue]);
		}
		let inPropStore = propertyStore.hasOwnProperty(name);
		let oldValue = this.get();
		if(!inPropStore || oldValue!==newValue) propertyStore[name] = newValue;
		if(!settingViaAttribute && reflectToAttribute) this.reflectValueToAttribute(newValue);
		if(!inPropStore || oldValue!==newValue) this.emitChange(oldValue,newValue);
	}
	
	emitChange(oldValue,newValue){
		let { element, name, config, onPropertySet, hasObserver, isObserverString, eventName, setDescriptors } = this.props;
		if(this.ignoreEmitChange) return;
		if(!this.firstChangeEmitted) this.firstChangeEmitted = true;
		if(onPropertySet || hasObserver || eventName!==null){
			let detailObj = new propertyChangeDetails({ element,name,config,newValue,oldValue });
			if(onPropertySet) mixinClass.fn(onPropertySet,element,[detailObj]);
			if(hasObserver && isObserverString) mixinClass.fn(element[config.observer],element,[detailObj]);
			else if(hasObserver) mixinClass.fn(config.observer,element,[detailObj]);
			if(eventName!==null) element.dispatchEvent(new CustomEvent(eventName,{ detail:detailObj, bubbles:false }));
		}
		for(let i=0,l=setDescriptors.length; i<l; i++) setDescriptors[i].apply(element,[newValue]);
	}
	
}

class propertyChangeDetails { constructor(obj){ Object.assign(this,obj); } }
