"use strict";

const {Transform} = require("stream");

class ConcurrentPromiseTransformStream extends Transform {

	constructor(concurrency, {transform}) {
		super();
		this.transform = transform;
		this.slots = new Array(concurrency);
		this.candidate = null;
	}

	_transform(chunk, enc, next) {
		this.takeSlot(chunk, next);
	}

	freeSlot(index, next) {
		delete this.slots[index];

		if(this.candidate){
			this.takeSlot(this.candidate);
			this.candidate = null;
			next();
		}
		else{
			next();
		}
	}

	takeSlot (chunk, next) {
		const freeSlots = this.slots
			.map((slot, index) => ({slot, index}))
			.filter(({slot}) => slot === undefined);

		if(freeSlots.length === 0) {
			this.candidate = chunk;
		}
		else {
			const [{index}] = freeSlots;

			this.slots[index] = this.process(chunk).then(() => this.freeSlot(index, next));

			next();
		}
	}

	process (chunk) {
		return this.transform(JSON.parse(chunk.toString()))
			.then(result => this.push(JSON.stringify(result)))
	}

}

module.exports = ConcurrentPromiseTransformStream;