# ce-mixinprops

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]

Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.

## What is this?

This class mixin adds functionality to your web component (custom element) to help javascript properties and DOM element attributes be synchronised where configured. This allows for data-binding from both attributes and properties for a web component.

No hidden or internal properties/methods are added to your class(es). The only property/method that is not part of the web component standards is the `static get properties()` method (can be named anything you like) used for configuring properties. This mixin makes use of the `observedAttributes` and `attributeChangedCallback` web component methods.

This JavaScript Module (ESM) exports a `mixinPropertiesAttributes(base)` method that will return a class which extends the provided `base` class.

This was designed to help your web components follow the best practices mentioned on the [Google Developers Web Fundamentals Website](https://developers.google.com/web/fundamentals/web-components/customelements#properties_and_attributes).

## Installation

Note: This project is written with new ECMAScript features such as ESM, arrow functions, object destructuring and etc. You may need to use a transpiler / bundling application to have this be compatible on older browsers.

Install via [NPM][npm-url]
```
npm install ce-mixinprops --save
```

Or use via `import` with a CDN
```js
import { mixinPropertiesAttributes } from 'https://unpkg.com/ce-mixinprops'; // or https://cdn.jsdelivr.net/npm/ce-mixinprops
```

Or [download the latest release][github-releases], or git clone the [repository on GitHub][github-branch].

## Example

Javascript Module:

Using [lit-html](https://github.com/PolymerLabs/lit-html) as the renderer.

```js
// Before running this example, install and specify the correct import paths
import { html, render as litRender } from 'lit-html/lit-html.js';
import { mixinPropertiesAttributes } from 'ce-mixinprops/index.js';

export class exampleHello extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is() { return 'example-hello'; }
	
	// Properties & Configurations
	static get properties() {
		return {
			name: {
				type: String,
				value: 'World'
			}
		};
	}
	
	// On-change listener for 'name' property
	set name(v){
		// Render element content
		this.renderNow();
	}
	
	constructor() {
		super();
		this.attachShadow({ mode:'open' });
	}
	
	// Define element content via lit-html
	render() {
		return html`
			<style type="text/css">:host { display: block; }</style>
			<span>Hello, ${this.name}!</span>
		`;
	}
	
	// Render element to DOM
	renderNow(){
		litRender(this.render(), this.shadowRoot||this);
	}
	
	// Render element upon DOM attachment
	connectedCallback() {
		this.renderNow();
	}
	
}

customElements.define(exampleHello.is,exampleHello);
```

HTML:

```html
<example-hello name="Developer"></example-hello>
```

Rendered Result:

```
Hello, Developer!
```

Freely change the `name` attribute in your browser developer tools and watch the property and rendered result change. Also change the `name` property on the element object itself via your developer tools console and watch the attribute and rendered result change.

## How To Use / API

### mixinPropertiesAttributes()

Usage: `mixinPropertiesAttributes(base,[propertiesName='properties'])`

Simply import this module and call the `mixinPropertiesAttributes` method while extending `HTMLElement` (or any class that already extends it).

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
}
```

The first paramater of `mixinPropertiesAttributes` is the `base` class that you want to extend.

The second paramater is an optional string which lets you specify the name of the `properties` static get method which is required for property & attribute configuration. This is configurable so you can have this mixin alongside other libraries which don't use `static get observedAttributes()` and `attributeChangedCallback()` class methods.

### Property/Attribute Configuration

Within your class, have the following:
```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	static get properties() {
		return {
			propName: {
				type: String,
				value: 'World',
				reflectToAttribute: true,
				reflectFromAttribute: true
			},
			// additional properties with configs
		};
	}
	// ...
}
```

Properties **are** case sensitive, and attributes are **not** case sensitive (due to how attributes work). There cannot be duplicate properties with different cases. All options are optional. 

| Property | Description (when `true` or specified) | Default Value |
|-|-|-|
| `type` | The type of property/attribute. `String`, `Number`, `Boolean` (the actual object/keyword) or undefined for any other type. | - |
| `value` | The default value of the property/attribute. | - |
| `reflectToAttribute` | `true`: Sync changes on property to the attribute. | Automatic |
| `reflectToAttribute` | `function`: Transform value before being set as the attribute (`type` must not be set or valid). | - |
| `reflectFromAttribute` | `true`: Sync changes on the attribute to the property. | Automatic |
| `reflectFromAttribute` | `function`: Transform value after reading from the attribute (`type` must not be set or valid). | - |
| `observer` | A class method name (String) or an actual callback (Function) which is fired upon change. See below for passed paramaters. | - |
| `notify` | Fires a *propName*`-changed` event on the class. See below for passed paramaters. | `false` |
| `readOnly` | Prevent the property from being modified. Attribute modifications will be ignored. | `false` |
| `overrideExisting` | This mixin checks the class and the classes the base extends to make sure the property does not already exist. This will ignore that check. | `false` |

For `String` types, the mixin tries to keep the property as a string. `Null` and `Undefined` are converted to an empty string `''`, and all other data types are converted by `''+value`.

For `Number` types, the mixin tries to keep the property as a number. `Null` and `Undefined` are converted to the number `0`, and all other data types are converted by `Number(value)`.

For `Boolean` types, the mixin tries to keep the property as a boolean. All data types are converted via [truey/falsy](https://bonsaiden.github.io/JavaScript-Garden/#types.equality) conversion via `!!value`. The property is true when the attribute exists, and false when the attribute does not exist (assuming the attribute is being reflected to/from the property).

For `String`, `Number` and `Boolean` types, the `reflectToAttribute` and `reflectFromAttribute` options will default to `true`. It will default to `false` for all other types.

If no valid `type` is specified and `reflectToAttribute` is a `function`, then the value is transformed (via the callback) before being set as the attribute. The same goes for `reflectFromAttribute` if it's a `function`; instead the value is transformed (via the callback) after being read from the attribute, before being set as the property. The transform functions take one argument (the initial value), and the `this` keyword is the element. If the returned value is undefined, the configured default value will be used. If the returned value is null, the attribute will be removed.

If the both the `readOnly` and `reflectToAttribute` options are `true`, the attribute will be set upon construction via `''+value`. The attribute may be changed, but the property will remain unchanged.

For the `observer` option, the [Property Change Details Object](#property-change-details-object) will be the first argument.

All events fired when the `notify` option is specified, will have `event.detail` set to the [Property Change Details Object](#property-change-details-object).

#### Property Change Details Object

| Property | Description |
|-|-|
| `element` | The custom element itself (`this`). |
| `name` | The property/attribute name. |
| `config` | The property/attribute configuration. |
| `newValue` | The new value. |
| `oldValue` | The old value. |

It is recommended to use a `set` descriptor to listen for changes. See 'Watching For Changes' below.

### Mixin Configuration

Upon construction, an optional options object can be passed to `super()` to configure this mixin.

| Property | Description (when specified) |
|-|-|
| `protectedProperties` | An array of properties/attributes that are 'protected', meaning there can not be properties/attributes specified as such. |
| `propertyStore` | An object which stores the values for the properties/attributes. |
| `onPropertySet` | A callback which is called on any property/attribute change. The first paramater is the [Property Change Details Object](#property-change-details-object). |
| `superArguments` | An array of arguments/paramaters passed to the `base` class constructor. |

An example use case for `onPropertySet`, where you can do your own logic for your own property configure options:

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	constructor() {
		super({
			onPropertySet: ({ element,name,config,newValue,oldValue })=>{
				if(config.renderOnChange) element.queueToRender();
			}
		});
	}
	// ...
}
```

### Existing Properties

An error will be thrown upon mixin construction if it detects duplicate properties, unless the `overrideExisting` option is specified.

### Watching For Changes

Changes are emitted if the property or attribute (if reflectFromAttribute is true) has been changed. It can also emit shortly after construction if there is an attribute on the element that is different than the default property value.

The recommended way to listen for changes to a property is to have a `set` descriptor (`setter`) for that specific property.

The alternative is to use the `observer` or `notify` options on the property config (they may be overridden by extended classes), or the `onPropertySet` constructor option on the mixin config.

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
	set myPropertyName(newValue){
		console.log('myPropertyName has changed:',newValue);
	}
	// ...
}
```

Changing the property within the `set` descriptor (`setter`) function may cause a call stack overflow, so be careful!

This feature only works if there is no `get` descriptor (`getter`) for that same property, unless the `overrideExisting` option is specified, which will remove the `get` descriptor.

There is no error handling or catching for functions/callbacks/events triggered by changes, so if an error occurs, it may effect the mixin's `set` code and further functions/callbacks/events (if multiple specified) will not fire.

### Extending Classes

It is possible to have properties configured on a class (like the above examples), while also having a different class extend it with it's own configured properties. This mixin will search all parent constructors/prototypes for the `static get` properties method and combine all the properties & configurations (using Object.assign). All classes along the proto tree **must** have the same `static get properties()` method name.

Properties & configurations on parent classes are overridden by classes which extend them. This means that if the parent class has `observer` or `notify` options set, **they may be overridden**.

However, a `set` descriptor (`setter`) will **not** be overridden and will fire upon property change for all classes in the proto tree where it is defined. They will fire in order from the top most parent class, down to the last extended class. It is done this way so parent logic is done first before extended logic.

## Contributors

Create issues or pull requests on the GitHub project.

All the help is appreciated.

## License

MIT License

Copyright (c) 2018 Jason Sheppard @ https://github.com/Jashepp

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
[github-branch]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/tree/master
[github-releases]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/releases
[github-tags]: https://github.com/Jashepp/customElements-mixinPropertiesAttributes/tags
[npm-image]: https://img.shields.io/npm/v/ce-mixinprops.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ce-mixinprops
[npm-downloads]: https://img.shields.io/npm/dm/ce-mixinprops.svg?style=flat-square
