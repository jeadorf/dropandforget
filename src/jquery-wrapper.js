/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var $;

if (typeof window === "undefined") {
    $ = require("jquery");
} else {
    $ = require("jquery-browserify");
}

module.exports = $;
