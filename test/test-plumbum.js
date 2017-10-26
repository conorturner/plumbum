"use strict";

const {should} = require("chai");
should();

const {Stream} = require("../index");

describe("Test", () => {

	it("toArray", (done) => {

		const stream = new Stream();

		stream
			.write([1, 2, 3, 4, 5])
			.map((item) => Promise.resolve(item + 1))
			.toArray()
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));
	});

	it("Old School", (done) => {

		const stream = new Stream();

		stream
			.write([1, 2, 3, 4, 5])
			.map((item) => Promise.resolve(item + 1))
			.forEach((item) => console.log(item))
			.onEnd()
			.then(() => done());
	});

	it("Async Mapping (Destroys order)", (done) => {

		const stream = new Stream();

		let counter = 0;
		stream
			.write([1, 2, 3, 4, 5])
			.asyncMap(5, (item) => new Promise((resolve) => setTimeout(() => resolve(item), 50 - item*3)))
			.forEach((item) => {
				console.log(item);
				counter++;
				if(counter === 5) done();
			});
	});

});