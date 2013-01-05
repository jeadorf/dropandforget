/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var $ = require("./jquery-wrapper");

var next_id = 0;

function Item(name) {
    this._id = next_id++;
    this._name = name;
    this._tags = [];
    this._listeners = [];
}

// ----- accessors / mutators -----

Item.prototype.get_id = function () {
    return this._id;
};

Item.prototype.get_name = function () {
    return this._name;
};

Item.prototype.add_tag = function (tag) {
    if (!this.has_tag(tag)) {
        this._tags.push(tag);
        this._fire_tag_added(tag);
    }
};

Item.prototype.has_tag = function (tag) {
    return $.inArray(tag, this._tags) !== -1;
};

Item.prototype.get_tags = function () {
    return this._tags;
};

Item.prototype.get_tag = function (idx) {
    return this._tags[idx];
};

Item.prototype.remove_tag = function (tag) {
    var that = this;
    $.each(this._tags, function (idx, elem) {
        if (elem === tag) {
            that._tags.splice(idx, 1);
            that._fire_tag_removed(tag);
        }
    });
};

Item.prototype.toJSON = function () {
    return {
        "name": this._name,
        "tags": this._tags
    };
};

// ----- event handling -----

Item.prototype.add_listener = function (listener) {
    this._listeners.push(listener);
};

Item.prototype._fire_event = function (evt) {
    $.each(this._listeners, function (idx, listener) {
        listener(evt);
    });
};

Item.prototype._fire_tag_added = function (tag) {
    this._fire_event({
        type: "tag_added",
        tag: tag,
        item: this
    });
};

Item.prototype._fire_tag_removed = function (tag) {
    this._fire_event({
        type: "tag_removed",
        tag: tag,
        item: this
    });
};

// ----- module exports -----

module.exports = Item;
