"use strict";

const PromiseTransformStream = require("./library/PromiseTransformStream");
const ConcurrentPromiseTransformStream = require("./library/ConcurrentPromiseTransformStream");

class Stream {
	constructor() {
		this.pipes = [new PromiseTransformStream({transform: (item) => Promise.resolve(item)})];
	}

	write(array) {
		array.forEach(item => this.push(item));
		return this;
	}

	push(item) {
		this.pipes[0].push(JSON.stringify(item));
		return this;
	}

	map(transform) {
		this.pipes.push(new PromiseTransformStream({transform}));
		this.pipes[0].pipe(this.pipes[this.pipes.length - 1]);
		return this;
	}

	asyncMap(concurrency, transform) {
		this.pipes.push(new ConcurrentPromiseTransformStream(concurrency, {transform}));
		this.pipes[0].pipe(this.pipes[this.pipes.length - 1]);
		return this;
	}

	forEach(functor) {
		this.pipes[this.pipes.length - 1].on("data", (chunk) => functor(JSON.parse(chunk.toString())));
		return this;
	}

	toArray() {
		return new Promise((resolve) => {
			const stream = this.pipes[this.pipes.length - 1];
			const chunks = [];

			stream.on("data", (chunk) => chunks.push(JSON.parse(chunk.toString())));
			this.pipes[this.pipes.length - 1].on("end", () => resolve(chunks));
			this.pipes[0].end();
		});
	}

	onEnd () {
		return new Promise((resolve) => this.pipes[this.pipes.length - 1].on("end", () => resolve(0)));
	}

}

module.exports = {
	Stream,
	PromiseTransformStream,
	ConcurrentPromiseTransformStream
};