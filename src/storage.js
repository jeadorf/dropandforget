/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var Item = require("./item");
var $ = require("./jquery-wrapper");

function Storage(factory) {
    this._items = [];
    this._factory = factory || function (name) {
        return new Item(name);
    };
}

Storage.prototype.set_factory = function (factory) {
    this._factory = factory;
};

Storage.prototype.new_item = function (name) {
    var item = this._factory(name);
    this._items.push(item);
    return item;
};

Storage.prototype.get_items = function () {
    return this._items;
};

Storage.prototype.remove_item = function (item) {
    var that = this;
    $.each(this._items, function (idx, elem) {
        if (elem === item) {
            that._items.splice(idx, 1);
        }
    });
};

Storage.prototype.save = function () {
    localStorage.data = JSON.stringify(this._items);
};

Storage.prototype.load = function () {
    this._items.splice(0, this._items.length);
    if (localStorage.data) {
        var p, that = this;
        try {
            p = JSON.parse(localStorage.data);
        } catch (e) {
            console.warn("Could not parse local storage.");
            localStorage.data = "[]";
            return;
        }
        $.each(p, function (idx, elem) {
            var item = that.new_item(elem.name);
            $.each(elem.tags, function (idx, tag) {
                item.add_tag(tag);
            });
        });
    }
};

module.exports = Storage;
