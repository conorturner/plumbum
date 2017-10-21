"use strict";

class Grapple {

	constructor(){
		this.request = require("request-promise-native");
	}

	get(url) {
		return this.request(url);
	}

}

module.exports = {
	Grapple
};