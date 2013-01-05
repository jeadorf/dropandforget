/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var $ = require("./jquery-wrapper");

function List() {
    this._listeners = [];
    this._items = [];
}

// ----- list operations -----

List.prototype.add_item = function (item) {
    this._items.push(item);
    this._fire_item_added(item);
};

List.prototype.remove_item = function (item) {
    var that = this;
    $.each(this._items, function (idx, elem) {
        if (elem === item) {
            that._items.splice(idx, 1);
            that._fire_item_removed(item);
        }
    });
};

List.prototype.get_item = function (idx) {
    return this._items[idx];
};

List.prototype.get_items = function () {
    return this._items;
};

List.prototype.size = function (idx) {
    return this._items.length;
};

// ----- event handling -----

List.prototype.add_listener = function (listener) {
    this._listeners.push(listener);
};

List.prototype._fire_event = function (evt) {
    $.each(this._listeners, function (idx, listener) {
        listener(evt);
    });
};

List.prototype._fire_item_added = function (item) {
    this._fire_event({
        type: "item_added",
        item: item,
        list: this
    });
};

List.prototype._fire_item_removed = function (item) {
    this._fire_event({
        type: "item_removed",
        item: item,
        list: this
    });
};

// ----- module exports -----

module.exports = List;
