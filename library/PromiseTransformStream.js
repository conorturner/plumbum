"use strict";

const {Transform} = require("stream");

class PromiseTransformStream extends Transform {

	constructor({transform}) {
		super();
		this.transform = transform;
	}

	_transform(chunk, enc, next) {
		this.transform(JSON.parse(chunk.toString()))
			.then(result => {
				this.push(JSON.stringify(result));
				next();
			})
			.catch(error => {
				throw error;
			});
	}

}

module.exports = PromiseTransformStream;