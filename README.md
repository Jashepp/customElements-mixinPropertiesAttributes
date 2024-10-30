# ce-mixinprops

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![Tests][github-tests-badge]][github-tests-url]

Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.

## What is this?

This class mixin adds functionality to your [web components (custom elements v1)](https://web.dev/custom-elements-v1/) to help javascript properties and DOM element attributes be synchronised/reflected where configured. This allows automatic data-binding for both attributes and properties for a web component.

This is written with vanilla JavaScript. No external dependencies, and no build system required.

No conflicting properties/methods are added to your class(es). The only properties/methods that are not part of the web component standards is the `static get properties()` method (can be named anything you like) used for configuring properties, and a non-enumerable `Symbol` property. This mixin makes use of the `observedAttributes` and `attributeChangedCallback` web component methods.

This JavaScript Module (ESM) exports a `mixinPropertiesAttributes(base)` method that will return a class which extends the provided `base` class.

This was designed to help your [web components](https://web.dev/custom-elements-v1/) follow the [best practices](https://web.dev/custom-elements-best-practices/) mentioned on web.dev, while avoiding huge frameworks or build systems.

## Installation / Importing

This library comes as an ES6 Module Script. It can be used within other Javascript ES6 Module Scripts, or in Classic Javascript Scripts.

**Install via NPM:** with the [NPM package][npm-url]
```
npm install ce-mixinprops
```

**Install via NPM from Github:** with a [GitHub Tag][github-tags] to specify version (specifed as #hash, must be exact)
```
npm install jashepp/customElements-mixinPropertiesAttributes#v1.11.0
```

**Use via ESM:** with a [module `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) with a local file, CDN URL, or [module name & import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). 
```html
<script type="module">
import { mixinPropertiesAttributes, propTypes } from 'ce-mixinprops'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x
// ...
</script>
```

**Use via CommonJS:** with a [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) with a local file, CDN URL, or [module name & import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).
```html
<script type="text/javascript">
(async ()=>{
	const { mixinPropertiesAttributes, propTypes } = await import('ce-mixinprops'); // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x
	// ...
})();
</script>
```

Or [download the latest release][github-releases], or [use github packages](https://github.com/Jashepp/customElements-mixinPropertiesAttributes/pkgs/npm/ce-mixinprops), or git clone the [repository on GitHub][github-url].

## Compatability

This project is written with ES6 features such as arrow functions, object destructuring and etc. If you want to use this on older browsers, you may need to use a transpiler / bundling application, along with a [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs), although they have not yet been tested with this library.

No build systems that transpile/compile files have yet been tested with this library either.

The versioning for this library tries to follow [semver](https://semver.org/) rules . So when using this library through a NPM CDN like [cdn.jsdelivr.net](https://cdn.jsdelivr.net/), specify the last major or major & minor version that works with your project. Such as `ce-mixinprops@1.x` for major v1 only with any minor & patch versions, or `ce-mixinprops@1.11.x` for v1.11 major & minor with any patch versions.

## Examples

Simple display toggle (Javascript Module).

```js
// Before running this example, install or specify the correct import paths
import { mixinPropertiesAttributes, propTypes } from 'ce-mixinprops/index.js'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x

// Define a class with the mixin on HTMLElement (or a class that extends it)
// * If you don't want the mixin within the class declaration, see below for alternate usage
export class exampleToggle extends mixinPropertiesAttributes(HTMLElement) {
	
	// Define the behaviour/options of properties
	static get properties() {
		return {
			show: {
				type: Boolean, // or propTypes.Boolean
				value: true
			},
			hide: {
				type: Boolean,
				value: false
			}
		};
	}
	
	// Toggle .style.display between none and previous value
	set show(show) {
		if(show) this.style.display = this._previousDisplay;
		else {
			this._previousDisplay = this.style.display || '';
			if(this._previousDisplay==='none') this._previousDisplay = '';
			this.style.display = 'none';
		}
		this.hide = !show;
	}
	
	set hide(hide) {
		this.show = !hide;
	}
	
	constructor() {
		super();
		this._previousDisplay = this.style.display || '';
	}
	
}

// Define a custom element name with the above class
customElements.define('example-toggle',exampleToggle);
```

HTML: (the `show` attribute will be set upon construction due to the default configured value above)
```html
Hello, <example-toggle>Beautiful</example-toggle> World!
```

Rendered Result:
```
Hello, Beautiful World!
```

Freely remove the `show` or `hide` attributes in your browser developer tools and watch the property and rendered result change. Also change the `show` and/or `hide` properties on the element object itself via your developer tools console and watch the attribute and rendered result change.

Or see the [example files](#more-examples) for interactive versions.

If you don't want the mixin within the class declaration, it can also [be applied afterwards instead](#mixin-configuration-post-declaration).

### More Examples

More examples are located within `./examples/` on the git [repository on GitHub][github-url] or locally if pulled. NPM version does **not** include the examples directory.

- Example 1 - Simple Toggle [[file]](./examples/1-simple-toggle.html) [[codepen]](https://codepen.io/Jashepp/pen/xxmXNjp)
- Example 2 - Using lit-html as the renderer [[file]](./examples/2-lit-html.html) [[codepen]](https://codepen.io/Jashepp/pen/VwqMOpx)
- Example 3 - Applying mixin on an already declared class, with mixinConfig argument [[file]](./examples/3-after-declared-arg.html) [[codepen]](https://codepen.io/Jashepp/pen/wvRPeva)
- Example 4 - Applying mixin on an already declared class, with injected mixinConfig [[file]](./examples/4-after-declared-inject.html) [[codepen]](https://codepen.io/Jashepp/pen/KKbyqpN)

## How To Use / API

### mixinPropertiesAttributes()

Usage: `mixinPropertiesAttributes(base,[propertiesName='properties'])`

Simply import this module and call the `mixinPropertiesAttributes` method while extending `HTMLElement` (or any class that already extends it).

```js
import { mixinPropertiesAttributes, propTypes } from 'ce-mixinprops/index.js'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x

class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
}
```

The first paramater of `mixinPropertiesAttributes` is the `base` class that you want to extend. If no argument is provided, it will default to extending `HTMLElement`.

The second paramater is an optional string which lets you specify the name of the `properties` static get method which is used for property & attribute configuration. This is configurable so you can have this mixin alongside other libraries.

### Property/Attribute Configuration

Property definition example:

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	static get properties() {
		return {
			// Property/Attribute Name
			propName: {
				// All options are optional
				type: String, // or propTypes.String for newer behaviour
				value: 'World',
				reflectToAttribute: true,
				reflectFromAttribute: true,
				reflectFromProperty: true,
			},
			// Additional configurations
		};
	}
	// ...
}
```

Properties **are** case sensitive, and attributes are **not** case sensitive (due to how attributes work). There cannot be duplicate properties with different cases. All options are optional. 

| Property Config Option | Description (when `true` or specified) | Default Value |
|-|-|-|
| `type` | The type of property/attribute. Either use `String`, `Number`, `Boolean` (the actual object/keyword), any type on `propTypes`, or a string with a propType name. See [Property Types](#property-types). | `undefined` |
| `attribute` | Overwrite attribute name to differ from property name. See [Alternate Attribute Name](#alternate-attribute-name) | Property Name |
| `value` | The default value of the property/attribute. See [Default Value](#default-value). | `undefined` |
| `reflectToAttribute` | `true`: Sync changes on the property to the attribute. See [Data Reflection](#data-reflection). | Automatic |
| `reflectToAttribute` | `function`: [Transform value](#data-transformation) before being set as the attribute (`type` must not be valid). See [Data Reflection](#data-reflection). | - |
| `reflectFromAttribute` | `true`: Sync changes on the attribute to the property. See [Data Reflection](#data-reflection). | Automatic |
| `reflectFromAttribute` | `function`: [Transform value](#data-transformation) after reading from the attribute (`type` must not be valid). See [Data Reflection](#data-reflection). | - |
| `reflectFromProperty` | `true`: Sync changes on from the property being set, to the property. See [Data Reflection](#data-reflection). | Automatic |
| `reflectFromProperty` | `function`: [Transform value](#data-transformation) after reading from the attribute (`type` must not be valid). See [Data Reflection](#data-reflection). | - |
| `reflectToAttributeInConstructor` | Sets attribute in constructor when differs from default value. See [Data Reflection](#data-reflection). | `true` if `reflectToAttribute` |
| `readOnly` | Prevent the property from being modified. Attribute modifications will be ignored. See [Data Reflection](#data-reflection). | `false` |
| `delayChangeInConstructor` | Delay [changes](#watching-for-changes) (set, observer, notify) in constructor. See [Configuring Value Changes](#configuring-value-changes). | `true` |
| `observer` | A class method name (String) or an actual callback (Function) which is called upon change. See [Configuring Value Changes](#configuring-value-changes). | - |
| `notify` | Emits an event on change with specified name (or *propName*`-changed` if not a string but truey). See [Configuring Value Changes](#configuring-value-changes). | `false` |
| `overrideExisting` | This mixin checks the class and the classes the base extends to make sure the property does not already exist. This will ignore that check. | `false` |
| `order` | `number`: The sorting order in which the property gets setup on the class. | - |

#### Property Types

`propTypes.Boolean`: Value is converted with [truey/falsy](https://bonsaiden.github.io/JavaScript-Garden/#types.equality) conversion via `!!value`. The property is `true` when the attribute exists, and `false` when the attribute does not exist (assuming the attribute is being reflected to/from the property).

`propTypes.StringLegacy` or `String` object/keyword: `Null` and `Undefined` are converted to an empty string `''`, and all other data types are converted by `''+value`.

`propTypes.NumberLegacy` or `Number` object/keyword: `Null` and `Undefined` are converted to the number `0`, and all other data types are converted by `Number(value)`. Failed conversions may result with `NaN`.

`propTypes.String`: Can be either `null` or `string`. If the property is set to `null` or `undefined`, or if the attribute doesn't exist, it will be set as `null`. If the property is set as anything else, or if the attribute exists, it will be transformed via `''+value`.

`propTypes.Number`: Can be either `null` or `number`. If the property is set to `null`, or if the attribute doesn't exist, it will be set as `null`. If the property is set as anything else, or if the attribute exists, it will be transformed via `Number(value)` to be either a number, or `null` (if it resulted in `NaN`).

Use the types specified on `propTypes` for future compatibility. The next major release *might* change `String` and `Number` objects/keywords to use the newer `propTypes.String` and `propTypes.Number` types.

`type` can be specified as a string with the name of the propType if you don't have access to `propTypes` at the time of class declaration.

You may also use your own type, if it has these 3 functions: `toAttribute`, `fromAttribute`, `fromProperty`. These are essentially the same as `reflectToAttribute`, `reflectFromAttribute`, and `reflectFromProperty`, respectively. See [Data Reflection](#data-reflection).

#### Alternate Attribute Name

If `attribute` is different than the property name, the property-attribute binding will use this value for the attribute name on the element. If the attribute already exists as a different property name (**or** attribute name if specified), an error will be thrown. It can be the name of an existing property if the property has an alternate attribute name.

#### Default Value

Upon construction (initialisation/upgrade of the element), if an attribute **exists** on the element, and it **differs** from the default value, it will [cause a change](#watching-for-changes). **Except** when `reflectToAttribute` is `false` (or fn results with `null`). If the attribute does **not exist** on the element, yet there is a default value, the attribute will be added to the element. **Except** for `Boolean` when `false`, when `reflectToAttribute` is `false` (or fn results with `null`), or when `reflectToAttributeInConstructor` is `false`.

The same applies if a property **exists** on the element upon construction. Where `reflectFromProperty` is used instead, and a property is set instead of an attribute.

If both an attribute and property exist on the element upon construction, see [Upgrading Web Component](#upgrading-web-component).

`reflectFromProperty` will transform the `value` option before it's set as the property's default value. If `reflectFromProperty` is `false`, no default value will be set from the `value` option.

#### Data Reflection

For data transformation, see [Data Transformation](#data-transformation).

`reflectToAttribute`, `reflectFromAttribute` and `reflectFromProperty` default to `true` on a valid `type`. If they're set as `false`, it will simply disable the respective reflect method, so data transformation will not happen, and the attribute or property will not be set/changed.

If no `type` is specified, `reflectFromProperty` will default to `true`, so setting the property can be possible.

If `readOnly` is `true`, `reflectFromAttribute` and `reflectFromProperty` will default to `false`.

If `readOnly` is `true`, and the attribute's value or property's value is **changed**, the property will **remain unchanged**, so no [changes](#watching-for-changes) will be emitted.

If `reflectToAttributeInConstructor` is `false`, the attribute will not be set during constructor. Handy for hidden attributes with default values.

#### Configuring Value Changes

The `delayChangeInConstructor` option, when `true`, delays all [changes](#watching-for-changes) (set, observer, notify) during the constructor (and current call stack), with an [event loop microtask](https://youtu.be/cCOL7MC4Pl0), via `Promise.resolve().then()`. When `false`, the changes emit during the constructor as the change is made.

For the `observer` option, the [Property Change Details Object](#property-change-details-object) will be the first argument.

All events emitted when the `notify` option is specified, will have `event.detail` set to the [Property Change Details Object](#property-change-details-object). The event will not bubble up the DOM.

It is recommended to use a `set` descriptor to listen for changes. See '[Watching For Changes](#watching-for-changes)' below.

#### Property Change Details Object

| Property | Description |
|-|-|
| `element` | The custom element itself (`this`). |
| `name` | The property/attribute name. |
| `config` | The property/attribute configuration. |
| `newValue` | The new value. |
| `oldValue` | The old value. |

#### Data Transformation

This mixin allows transform functions to determine what values get transformed to, when setting via an attribute, via a property, or when converting from property to attribute.

`reflectToAttribute` runs when an attribute is being set, and transforms the property value to an attribute value. When it results with `null`, the attribute will not exist or be removed.

`reflectFromAttribute` runs when fetching the value from the attribute or when the attribute is being set, and transforms the attribute value to a property value. When the attribute doesn't exist, or is removed, `null` is passed as the `value` argument.

`reflectFromProperty` runs when the property is being set, and transforms the setting property value to the actual property value. For example, when the default value is used, or when the property is `set` on the custom element.

If not specified, or when `true`, these options fallback to the type's `toAttribute`, `fromAttribute` and `fromProperty` transform functions, which behave the exact same way, respectively.

If any are specified as functions on the property/attribute config, they will override the type's transform functions. For example, you can use `type: mixinTypes.Boolean`, with `reflectFromAttribute: (v)=>{ return v==null||v=='off'||v=='no'||v=='false' ? false : true; },` to allow specific attribute strings to be transformed differently. If all are specified as functions, then having `type` also set is redundant.

If any are specified with no `type` set, it will treat the other options as `false`. See [Data Reflection](#data-reflection) for `true`/`false` reflect options.

The transform callbacks take one argument (the value), with the `this` keyword as the element.

Transform Example (with no `type` option):

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	static get properties() {
		return {
			propName: {
				value: 'test',
				// Remove prefixed _
				reflectFromAttribute: function(val){
					val = val===null ? '' : ''+val;
					return val.substr(0,1)==='_' ? val.substr(1) : val;
				},
				// Add _ prefix
				reflectToAttribute: function(val){
					return '_'+val;
				},
				// reflectFromProperty will simply pass through by default
			},
			// Additional properties with configs
		};
	}
	// ...
}
```

A flag is set internally during `reflectFromAttribute` so a `call stack overflow` will not happen if you `get` the same property value within the transform callback. The `get` will instead result with the *previous value* or the *default value* (if no previous value) for that property.

### Mixin Configuration

Upon construction, an optional options object can be passed to `super()` to configure this mixin - if the class extends the mixin (if not, see further below).

| Property | Description (when specified) |
|-|-|
| `protectedProperties` | An array of properties that are 'protected', meaning there can not be properties specified as such. |
| `protectedAttributes` | An array of attributes that are 'protected', meaning there can not be attributes specified as such. |
| `propertyStore` | An object which stores the values for the properties/attributes. |
| `onPropertySet` | A callback which is called on any property/attribute change. The first paramater is the [Property Change Details Object](#property-change-details-object). |
| `propertyDefaults` | An object of defaults for all properties/attributes (excluding `overrideExisting` option). |
| `superArguments` | An array of arguments/paramaters passed to the `base` class constructor. |

In addition to `superArguments`, the other arguments on `super()`, such as `super(null,'one','two')` (excluding first argument) will also passthrough to the extending class.

An example use case for `onPropertySet`, where you can do your own logic for your own property configure options:

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	static get properties() {
		return {
			propName: {
				type: Boolean,
				renderOnChange: true // own property to do logic elsewhere
				// observer: 'queueToRender' is also possible
			},
			// Additional properties with configs
		};
	}
	// ...
	constructor() {
		super({
			onPropertySet: ({ element,name,config,newValue,oldValue })=>{
				// Queue changes to render if specified in property config
				if(config.renderOnChange) element.queueToRender();
			}
		});
	}
	// ...
	queueToRender() {
		// Render code
	}
	// ...
}
```

### Mixin Configuration Post Declaration

If the class does not extend the mixin, but instead has it applied afterwards, the [mixin configuration](#mixin-configuration) can instead be set using one of the methods below.

These methods do not use `superArguments` since you can pass arguments to `super()` within the constructor directly.

**Inject Method**: Using `mixinClass.symbols.injectMixinConfig` symbol within the constructor (notice extra `mixinClass` import variable):
```js
import { mixinPropertiesAttributes, propTypes, mixinClass } from 'ce-mixinprops/index.js'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x
// Define a class without the mixin (which still extends HTMLElement)
class myCustomElement extends HTMLElement {
	// ...
	constructor(...args) {
		super(...args);
		this[mixinClass.symbols.injectMixinConfig] = {
			propertyDefaults: { reflectToAttributeInConstructor:false }
		};
	}
	// ...
}
// Define the custom element with the mixin applied after class declaration
customElements.define('my-element',mixinPropertiesAttributes(myCustomElement));
```

**Argument Method**: Using the 3rd argument to `mixinPropertiesAttributes` function:
```js
import { mixinPropertiesAttributes, propTypes } from 'ce-mixinprops/index.js'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops@1.x
// Define a class without the mixin (which still extends HTMLElement)
class myCustomElement extends HTMLElement {
	// ...
	constructor(...args) {
		super(...args);
	}
	// ...
}
// Define the custom element with the mixin applied after class declaration
customElements.define('my-element',mixinPropertiesAttributes(myCustomElement,'properties',{
	propertyDefaults: { reflectToAttributeInConstructor:false }
}));
```

### Existing Properties

An error will be thrown upon mixin construction if it detects duplicate properties, unless the `overrideExisting` option is specified.

### Watching For Changes

Changes are emitted if the property or attribute (if reflectFromAttribute is true) has been changed. It can also emit shortly after construction if there is an attribute on the element that is different than the default property value.

The recommended way to listen for changes to a property is to have a `set` descriptor (`setter`) for that specific property.

The alternative is to use the `observer` or `notify` options on the property config (they may be overridden by extended classes), or the `onPropertySet` constructor option on the mixin config.

Setter Example:

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	set myPropertyName(newValue){
		console.log('myPropertyName has changed:',newValue);
		// your logic
	}
	// ...
}
```

Changing the property (to a different value) within the `set` descriptor (`setter`) function may cause a `call stack overflow`, so be careful!

This feature only works if there is no `get` descriptor (`getter`) for that same property, unless the `overrideExisting` option is specified, which will remove the `get` descriptor.

There is no error handling or catching for functions/callbacks/events triggered by changes, so if an error occurs, it may effect the mixin's `set` code and further functions/callbacks/events (if multiple specified) will not emit.

### Extending Classes

It is possible to have properties configured on a class (like the above examples), while also having a different class extend it with it's own configured properties. This mixin will search all parent constructors/prototypes for the `static get` properties method and combine all the properties & configurations (using Object.assign). All classes along the proto tree **must** have the same `static get properties()` method name, otherwise it will be ignored.

Properties & configurations on parent classes are overridden by classes which extend them. This means that if the parent class has `observer` or `notify` options set, **they may be overridden**.

However, a `set` descriptor (`setter`) will **not** be overridden and will fire upon property change for all classes in the proto tree where it is defined. They will fire in order from the top most parent class, down to the last extended class. It is done this way so parent logic is done first before extended logic.

When extending and you want to use `observedAttributes` or `attributeChangedCallback`, be sure to use `super`. For example:

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	static get observedAttributes() {
		// Your logic
		let attributes = ['your','list','of','attributes','in','lowercase'];
		// Concat with super
		return (super.observedAttributes||[]).concat(attributes);
	}
	
	attributeChangedCallback(name,oldValue,newValue){
		// Call super method
		if(super.attributeChangedCallback) super.attributeChangedCallback(name,oldValue,newValue);
		// Your logic
	}
	// ...
}
```

### Upgrading Web Component

Web components / custom elements are designed to be lazy loaded. So attributes and/or properties can exist or be set before the web component is defined/upgraded (`customElements.define`), and can also be set after it has been defined.

When the element is first defined, this mixin will treat existing attributes and properties as changes if they differ from the default values for the configured properties.  See [Default Value](#default-value).

If both a same-named property **and** attribute exists before the element is defined, this mixin will prioritise the attribute's value. This is due to `attributeChangedCallback` receiving attribute-change notifications **after** the element has been defined. So in this case, if you want to change the value when both exist, before and during definition, then use `setAttribute`, as it will queue further changes for `attributeChangedCallback` to handle.

## Tests

Tests are located within `./tests/` on the git [repository on GitHub][github-url] or locally if pulled. NPM version does **not** include tests.

To get started with tests, enter local directory of this repository and run:
```
npm install --only=dev
```

This should install `cypress` and other dev dependencies needed to run the tests.

To run a UI interactive version of the tests using cypress, run:
```
npm run cypress+server
```

To run a CLI-only version of the tests, run:
```
npm run test
```

To continuously run tests while editing, run:
```
npm run watch:test
```

## Contributors

To submit a contribution, create issues or pull requests on the [GitHub repository][github-url].

Please be sure to run tests after any changes.

All help is appreciated. Even if it's just improvements to this readme or the tests.

## License

MIT License

Copyright (c) 2023 Jason Sheppard @ https://github.com/Jashepp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Links

Github Repository: [https://github.com/Jashepp/customElements-mixinPropertiesAttributes][github-url]

NPM Package: [https://npmjs.org/package/ce-mixinprops][npm-url]

[github-url]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes
[github-releases]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/releases
[github-tags]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/tags
[github-tests-badge]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/actions/workflows/tests-on-push.yml/badge.svg
[github-tests-url]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/actions/workflows/tests-on-push.yml
[npm-image]: https://img.shields.io/npm/v/ce-mixinprops.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ce-mixinprops
[npm-downloads]: https://img.shields.io/npm/dm/ce-mixinprops.svg?style=flat-square
