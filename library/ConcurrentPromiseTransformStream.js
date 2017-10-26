"use strict";

const {Transform} = require("stream");

class ConcurrentPromiseTransformStream extends Transform {

	constructor({concurrency, highWaterMark}, {transform}) {
		super({highWaterMark});
		this.transform = transform;
		this.slots = new Array(concurrency).fill(null);
		this.candidate = null;
		this.eof = false;
	}

	_transform(chunk, enc, next) {
		// console.log(chunk.toString())
		this.takeSlot(chunk, next);
	}

	_flush () {
		this.eof = true;
	}

	freeSlot(index) {
		this.slots[index] = null;

		if(this.candidate){
			const {chunk, next} = this.candidate;
			this.candidate = null;
			this.takeSlot(chunk, next);
		}
	}

	takeSlot (chunk, next) {
		const freeSlots = this.slots
			.map((slot, index) => ({slot, index}))
			.filter(({slot}) => slot === null);

		if(freeSlots.length === 0) {
			this.candidate = {chunk, next};
		}
		else {
			const [{index}] = freeSlots;
			this.slots[index] = this.process(chunk).then(() => this.freeSlot(index));
			next();
		}
	}

	process (chunk) {
		return this.transform(JSON.parse(chunk.toString()))
			.then(result => result ? this.push(JSON.stringify(result)) : null) //TODO: this doesn't implement back pressure
	}

}

module.exports = ConcurrentPromiseTransformStream;