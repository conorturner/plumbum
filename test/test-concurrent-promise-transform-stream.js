"use strict";

const {should} = require("chai");
should();

const ConcurrentPromiseTransformStream = require("../library/ConcurrentPromiseTransformStream");

describe("Test", () => {

	it("Basic Test", (done) => {

		const { Readable } = require('stream');

		class MockReadable extends Readable {
			_read(size) {
				this.counter = this.counter || 0;
				this.counter++;
				// console.log("being read")
				if(this.counter < 10 + 1) this.push("500");
			}
		}

		const mockReadable = new MockReadable();

		const transform = (item) => new Promise((resolve) => setTimeout(() => resolve(item), item));
		const pStream = new ConcurrentPromiseTransformStream({concurrency: 3}, {transform});


		pStream.on("data", (chunk) => console.log(chunk.toString()));
		pStream.on("end", (err) => done(err));

		mockReadable.pipe(pStream);

		setTimeout(done, 5000);

	}).timeout(10000);

});