"use strict";

const PromiseTransformStream = require("./library/PromiseTransformStream");

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

	toArray() {
		return new Promise((resolve) => {
			const stream = this.pipes[this.pipes.length - 1];
			const chunks = [];

			stream.on("data", (chunk) => chunks.push(JSON.parse(chunk.toString())));
			this.pipes[this.pipes.length - 1].on("end", () => resolve(chunks));
			this.pipes[0].end();
		});
	}
}

module.exports = {
	Stream
};