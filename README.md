# ce-mixinprops

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]

Mixin for Custom Elements (Web Components) to handle/sync properties and attributes.

## What is this?

This JavaScript Module (ESM) exports a `mixinPropertiesAttributes(base)` method that will return a class which extends the provided `base` class.

The mixin adds functionality to your web component to help javascript properties and DOM element attributes be synchronised where configured.

This was designed to help your web components follow the best practices mentioned on the [Google Developers Web Fundamentals Website](https://developers.google.com/web/fundamentals/web-components/customelements#properties_and_attributes). It is greatly inspired by Polymer's method of doing so.

## Installation

Note: This project is written with new ECMAScript features such as ESM, arrow functions, object destructuring and etc. You may need to use a transpiler / bundling application to have this be compatible on older browsers.

Install  via [NPM][npm-url]
```
npm install ce-mixinprops --save
```
Or [download the latest release][github-releases], or git clone the [repository on GitHub][github-branch].

## How To Use / API

Simply import this module and call the `mixinPropertiesAttributes` method while extending `HTMLElement` (or any class that already extends it).

```js
class myCustomElement extends mixinPropertiesAttributes(HTMLElement) {
	// ...
}
```

The first paramater of `mixinPropertiesAttributes` is the base class that you want to extend.

The second paramater is an optional string which lets you specify the name of the `properties` static get method which is required for property & attribute configuration. This is configurable so you can have this mixin alongside Polymer and other libraries. It defaults to `'properties'` (which is what Polymer uses).

Within your class, have the following:
```js
static get properties() {
	return {
		propName: {
			type: String,
			value: 'World',
			reflectToAttribute: true,
			reflectFromAttribute: true
		}
	};
}
```

All property/attribute names are case sensitive. All options are optional.

Property/Attribute Configuration Options:

| Property | Description (when `true` or specified) | Default Value |
|-|-|-|
| `type` | The type of property/attribute. `String`, `Number`, `Boolean` (the actual object/keyword) or undefined for any other type. | - |
| `value` | The default value of the property/attribute. | - |
| `reflectToAttribute` | Sync changes on property to the attribute. | Automatic |
| `reflectFromAttribute` | Sync changes on the attribute to the property. | Automatic |
| `observer` | A class method name (String) or an actual callback (Function) which is fired upon change. See below for passed paramaters. | - |
| `notify` | Fires a *propName*`-changed` event on the class. See below for passed paramaters. | `false` |
| `readOnly` | Prevent the property from being modified. Attribute modifications will be ignored. | `false` |
| `overrideExisting` | This mixin checks the class and the classes the base extends to make sure the property does not already exist. This will ignore that check. | `false` |

For `String` types, the mixin tries to keep the property as a string. `Null` and `Undefined` is converted to an empty string `''`, and all other data types are converted by `''+value`.

For `Number` types, the mixin tries to keep the property as a number. `Null` and `Undefined` is converted to the number `0`, and all other data types are converted by `Number(value)`.

For `Boolean` types, the mixin tries to keep the property as a boolean. All data types are converted via [truey/falsy](https://bonsaiden.github.io/JavaScript-Garden/#types.equality) conversion via `!!value`. The property is true when the attribute exists, and false when the attribute does not exist (assuming the attribute is being reflected to/from the property).

For the `observer` option, one paramater/argument is provided which has the following properties:

| Property | Description |
|-|-|
| `element` | The custom element itself (`this`). |
| `name` | The property/attribute name. |
| `config` | The property/attribute configuration. |
| `newValue` | The new value. |
| `oldValue` | The old value. |

All events fired when the `notify` option is specified, will have the above properties set on the event.`detail` object.

Upon construction, an optional options object can be passed to `super()` to configure this mixin.

| Property | Description (when specified) |
|-|-|-|
| `protectedProperties` | An array of properties/attributes that are 'protected', meaning there can not be properties/attributes specified as such. |
| `propertyStore` | An object which stores the values for the properties/attributes. |
| `onPropertySet` | A callback which is called on any property/attribute change. The first/only paramater is the same as the above `observer` property configure option.` |
| `superArguments` | An array of arguments/paramaters passed to the `base` constructor. |

An example use case for `onPropertySet`, where you can do your own logic for your own property configure options:

```js
constructor() {
	super({
		onPropertySet: ({ element,name,config,newValue,oldValue })=>{
			if(config.renderOnChange) element.queueToRender();
		}
	});
}
```

## Examples

Javascript Module:

Using [lit-html](https://github.com/PolymerLabs/lit-html) as the renderer.

```js
// Before running this example, install and specify the correct import paths
import { html, render as litRender } from 'lit-html/lit-html.js';
import { mixinPropertiesAttributes } from 'ce-mixinprops/index.js';

export class exampleHello extends mixinPropertiesAttributes(HTMLElement) {
	
	static get is() { return 'example-hello'; }
	
	static get properties() {
		return {
			name: {
				type: String,
				value: 'World',
				renderOnChange: true // Re-render when property or attribute is changed (logic is below in constructor)
			}
		};
	}
	
	render() {
		return html`
			<style> :host { display: block; } </style>
			<span>Hello, ${this.name}!</span>
		`;
	}
	
	constructor() {
		super({
			protectedProperties: ['_invalidated','_firstConnectedCallback'],
			onPropertySet: ({ element,name,config,newValue,oldValue })=>{
				if(config.renderOnChange) element.invalidate();
			}
		});
		this.attachShadow({ mode:'open' });
	}
	
	connectedCallback() {
		if(!this._firstConnectedCallback){
			this.invalidate();
			this._firstConnectedCallback = true;
		}
	}
	
	renderNow(){
		litRender(this.render(), this.shadowRoot||this);
	}
	
	async invalidate() {
		if (!this._invalidated) {
			this._invalidated = true;
			await 0;
			this._invalidated = false;
			this.renderNow();
		}
	}
	
}
customElements.define(exampleHello.is,exampleHello);
```

HTML:

```html
<example-hello name="Developer"></example-hello>
```

## Contributors

Create issues or pull requests on the GitHub project.

All the help is appreciated.

## License

MIT License

Copyright (c) 2017 Jason Sheppard @ https://github.com/Unchosen

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

Github Repository: [https://github.com/Unchosen/customElements-mixinPropertiesAttributes][github-url]

NPM Package: [https://npmjs.org/package/ce-mixinprops][npm-url]

[github-url]: https://github.com/Unchosen/customElements-mixinPropertiesAttributes
[github-branch]: https://github.com/Unchosen/customElements-mixinPropertiesAttributes/tree/master
[github-releases]: https://github.com/Unchosen/customElements-mixinPropertiesAttributes/releases
[github-tags]: https://github.com/Unchosen/customElements-mixinPropertiesAttributes/tags
[npm-image]: https://img.shields.io/npm/v/ce-mixinprops.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ce-mixinprops
[npm-downloads]: https://img.shields.io/npm/dm/ce-mixinprops.svg?style=flat-square
