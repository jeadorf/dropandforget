/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var $ = require("./jquery-wrapper");

function ListView() {
    this._actions = [];
}

ListView.prototype._init_container = function () {
    if (this._list && this._container) {
        this._container.empty();
        var that = this;
        $.each(this._list.get_items(), function (idx, item) {
            that._insert_li(item);
        });
    }
};

ListView.prototype.set_container = function (container) {
    this._container = container;
    this._init_container();
};

ListView.prototype.get_container = function () {
    return this._container;
};

ListView.prototype.set_list = function (list) {
    this._list = list;
    var that = this;
    this._list.add_listener(function (evt) {
        if (that._container) {
            if (evt.type === "item_added") {
                that._insert_li(evt.item);
            } else if (evt.type === "item_removed") {
                that._remove_li(evt.item);
            }
        }
    });
    this._init_container();
};

ListView.prototype.get_list = function () {
    return this._list;
};

ListView.prototype._insert_li = function (item) {
    var li = $(document.createElement("li"));
    li.addClass("item" + item.get_id());

    li.attr("draggable", true);
    li.get()[0].addEventListener("dragstart", function(e){
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.get_id());
    }, false);

    li.append(this._action_box(item));
    li.append("<span class='name'>" + item.get_name() + "</span>");
    li.hide();
    this._container.append(li);
    li.slideDown(200);
};

ListView.prototype._remove_li = function (item) {
    var that = this;
    this._container.children(".item" + item.get_id()).slideUp(200, function () {
        that._container.children(".item" + item.get_id()).remove();
    });
};

ListView.prototype.add_action = function (action) {
    this._actions.push(action);
    this._init_container();
};

ListView.prototype._action_box = function (item) {
    var box = $(document.createElement("span"));
    box.addClass("actions");
    $.each(this._actions, function (idx, action) {
        var link = $(document.createElement("a"));
        link.append(action.name);
        link.attr("href", "#");
        link.click(function () {
            action.effect(item);
        });
        box.append(link);
    });
    return box;
};

module.exports = ListView;
