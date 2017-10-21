"use strict";

const {should} = require("chai");
should();

const PromiseTransformStream = require("../library/PromiseTransformStream");

describe("Test", () => {

	it("Basic Test", (done) => {

		const transform = (item) => Promise.resolve(item);
		const pStream = new PromiseTransformStream({transform});

		const testData = JSON.stringify({data: "123"});

		pStream.on("data", (chunk) => chunk.toString().should.equal(testData));
		pStream.on("end", (err) => done(err));
		pStream.write(testData);
		pStream.end();
	});

});