
export const mixinPropertiesAttributes = (base,propertiesName='properties') => class mixinPropertiesAttributes extends base {
	
	static get observedAttributes() {
		let propsLower = [];
		return this[propertiesName] ? Object.keys(this[propertiesName]).filter(prop=>{
			if(this[propertiesName][prop].readOnly) return false;
			let type = this[propertiesName][prop].type;
			let safeAttributeType = type===String || type===Number || type===Boolean;
			let observe = 'reflectFromAttribute' in this[propertiesName][prop] ? this[propertiesName][prop].reflectFromAttribute : safeAttributeType;
			if(observe){
				let propLower = prop.toLowerCase();
				if(propLower!==prop) propsLower.push(propLower);
			}
			return observe;
		}).concat(propsLower) : [];
	}
	
	attributeChangedCallback(name,oldValue,newValue){
		if(oldValue===newValue) return;
		if(!(name in this.constructor[propertiesName])){
			let props = Object.keys(this.constructor[propertiesName]);
			for(let i=0,l=props.length; i<l; i++){
				if(props[i].toLowerCase()===name){
					name = props[i];
					break;
				}
			}
		}
		if(name in this.constructor[propertiesName]){
			let type = this.constructor[propertiesName][name].type;
			if(type===Boolean) newValue = (newValue!==null);
			else if(type===Number) newValue = Number(newValue);
			this[name] = newValue;
		}
	}
	
	constructor({ protectedProperties=[], propertyStore={}, onPropertySet, superArguments=[] }={}) {
		super(...superArguments);
		let element = this, propsConfig = element.constructor[propertiesName] || {};
		let propsLower = Object.keys(propsConfig).map(prop=>prop.toLowerCase());
		for(let i=0,l=propsLower.length; i<l; i++){
			if(propsLower.indexOf(propsLower[i])!==i) throw new Error(`Unable to setup property/attribute '${propsLower[i]}' on ${this.constructor.name}. It is a duplicate property (not case sensitive).`);
		}
		let protoTree = [], checkObj = null;
		while(true){
			checkObj = Object.getPrototypeOf(checkObj===null?element:checkObj);
			if(!checkObj || !checkObj.constructor || checkObj.constructor===HTMLElement || checkObj.constructor===Function || checkObj.constructor===Object || checkObj.constructor===checkObj.constructor.constructor) break;
			protoTree.push(checkObj);
		}
		Object.freeze(propsConfig);
		for(let name in propsConfig){
			if(protectedProperties.indexOf(name)!==-1) throw new Error(`Unable to setup property/attribute '${name}' on ${this.constructor.name}. It is a protected property.`);
			let config = Object.freeze(propsConfig[name]);
			if(config.overrideExisting!==true){
				let propExists = false, protoPath = [];
				for(checkObj of protoTree){
					if(checkObj.constructor) protoPath.push(checkObj.constructor.name);
					if(checkObj.hasOwnProperty(name)){
						let descriptor = Object.getOwnPropertyDescriptor(checkObj,name);
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
			}
			else {
				let hasObserver = 'observer' in config, isObserverString = hasObserver && typeof config.observer==='string';
				let isString = config.type===String, isNumber = config.type===Number, isBoolean = config.type===Boolean;
				let reflectToAttribute = 'reflectToAttribute' in config ? config.reflectToAttribute : (isString || isNumber || isBoolean);
				let reflectFromAttribute = 'reflectFromAttribute' in config ? config.reflectFromAttribute : (isString || isNumber || isBoolean);
				let descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element),name);
				Object.defineProperty(element,name,new mixinPropsElementSyncer({
					propertyStore, element, name, isBoolean, isNumber, isString, config, reflectFromAttribute, reflectToAttribute, onPropertySet, hasObserver, isObserverString, descriptor
				}));
			}
		}
	}
	
};

class mixinPropsElementSyncer {
	
	constructor(props){
		this.enumerable = true;
		this.configurable = true;
		this.props = Object.assign({},props);
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
	}
	
	get(){
		let { propertyStore, element, name, config, reflectFromAttribute, isBoolean, isNumber, descriptor } = this.props;
		if(propertyStore.hasOwnProperty(name)) return propertyStore[name];
		if(reflectFromAttribute){
			let hasAttribute = element.hasAttribute(name);
			if(isBoolean) return propertyStore[name] = hasAttribute;
			if(hasAttribute && isNumber) return propertyStore[name] = Number(element.getAttribute(name));
			if(hasAttribute) return propertyStore[name] = element.getAttribute(name);
		}
		return config.value;
	}
	
	set(newValue){
		let { propertyStore, element, name, config, reflectToAttribute, isBoolean, isNumber, isString, onPropertySet, hasObserver, isObserverString, descriptor } = this.props;
		if(isBoolean) newValue = !!newValue;
		else if(isNumber) newValue = newValue===null || newValue===void 0 ? 0 : Number(newValue);
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
			else element.setAttribute(name,newValue);
		}
		if(onPropertySet || hasObserver || config.notify){
			let detailObj = new mixinPropsSetDetails(element,name,config,newValue,oldValue);
			if(onPropertySet) onPropertySet.apply(element,[detailObj]);
			if(hasObserver && isObserverString) element[config.observer].apply(element,[detailObj]);
			else if(hasObserver) config.observer.apply(element,[detailObj]);
			if(config.notify) element.dispatchEvent(new CustomEvent(name+'-changed',{ detail:detailObj }));
		}
		if(descriptor && descriptor.set) descriptor.set.apply(element,[newValue]);
	}
	
}

class mixinPropsSetDetails {
	
	constructor(element,name,config,newValue,oldValue){
		this.element = element;
		this.name = name;
		this.config = config;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
	
}
