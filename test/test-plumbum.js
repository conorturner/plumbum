"use strict";

const {should} = require("chai");
should();

const {Stream} = require("../index");

describe("Test", () => {

	it("Basic Test", (done) => {

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

});