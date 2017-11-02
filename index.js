
export const mixinPropertiesAttributes = (base,propertiesName='properties') => class mixinPropertiesAttributes extends base {
	
	static get observedAttributes() {
		return this[propertiesName] ? Object.keys(this[propertiesName]).filter(prop=>{
			if(this[propertiesName][prop].readOnly) return false;
			let type = this[propertiesName][prop].type;
			let safeAttributeType = type===String || type===Number || type===Boolean;
			return 'reflectFromAttribute' in this[propertiesName][prop] ? this[propertiesName][prop].reflectFromAttribute : safeAttributeType;
		}) : [];
	}
	
	attributeChangedCallback(name,oldValue,newValue){
		if(oldValue===newValue) return;
		if(name in this.constructor[propertiesName]){
			let type = this.constructor[propertiesName][name].type;
			if(type===Boolean) newValue = (newValue!==null);
			else if(type===Number) newValue = Number(newValue);
		} 
		this[name] = newValue;
	}
	
	constructor({ protectedProperties=[], propertyStore={}, onPropertySet, superArguments=[] }={}) {
		super(...superArguments);
		let element = this;
		let propsConfig = element.constructor[propertiesName] || {};
		let protoTree = [], checkObj = null;
		while(true){
			checkObj = Object.getPrototypeOf(checkObj===null?element:checkObj);
			if(!checkObj || !checkObj.constructor || checkObj.constructor===HTMLElement || checkObj.constructor===Function || checkObj.constructor===checkObj.constructor.constructor) break;
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
					if(checkObj.hasOwnProperty(name)){ propExists = true; break; }
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
				let hasObserver = 'observer' in config;
				let isObserverString = hasObserver && typeof config.observer==='string';
				let safeAttributeType = config.type===String || config.type===Number || config.type===Boolean;
				let reflectToAttribute = 'reflectToAttribute' in config ? config.reflectToAttribute : safeAttributeType;
				let reflectFromAttribute = 'reflectFromAttribute' in config ? config.reflectFromAttribute : safeAttributeType;
				Object.defineProperty(element,name,{
					enumerable: true,
					configurable: true,
					get(){
						if(propertyStore.hasOwnProperty(name)) return propertyStore[name];
						if(reflectFromAttribute){
							let hasAttribute = element.hasAttribute(name);
							if(config.type===Boolean) return propertyStore[name] = hasAttribute;
							if(hasAttribute && config.type===Number) return propertyStore[name] = Number(element.getAttribute(name));
							if(hasAttribute) return propertyStore[name] = element.getAttribute(name);
						}
						return config.value;
					},
					set(newValue){
						if(config.type===Boolean) newValue = !!newValue;
						else if(config.type===Number) newValue = newValue===null || newValue===void 0 ? 0 : Number(newValue);
						else if(config.type===String) newValue = newValue===null || newValue===void 0 ? '' : ''+newValue;
						let oldValue = element[name];
						if(oldValue===newValue) return;
						if(hasObserver || onPropertySet || config.notify) var detailObj = { element,name,config,newValue,oldValue };
						propertyStore[name] = newValue;
						if(reflectToAttribute){
							if(config.type===Boolean){
								let hasAttribute = element.hasAttribute(name);
								if(!newValue && hasAttribute) element.removeAttribute(name);
								if(newValue && !hasAttribute) element.setAttribute(name,'');
							}
							else element.setAttribute(name,newValue);
						}
						if(onPropertySet) onPropertySet(detailObj);
						if(hasObserver && isObserverString) element[config.observer](detailObj);
						else if(hasObserver) config.observer(detailObj);
						if(config.notify) element.dispatchEvent(new CustomEvent(name+'-changed',{ detail:detailObj }));
					}
				});
			}
		}
	}
	
};
