/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var $ = require("./jquery-wrapper");
var Item = require("./item");
var List = require("./list");
var ListView = require("./list-view");
var Storage = require("./storage");
var tag = require("./tag");

function update_when_tagged(list, tag) {
    return function (evt) {
        if (evt.type === "tag_added" && evt.tag === tag) {
            list.add_item(evt.item);
        } else if (evt.type === "tag_removed" && evt.tag === tag) {
            list.remove_item(evt.item);
        }
    };
}

function move_to_box(box) {
    return function (item) {
        $.each(item.get_tags(), function (idx, tag) {
            if (tag[0] === "#") {
                item.remove_tag(tag);
            }
        });
        item.add_tag(box);
    };
}

var storage = new Storage();

function trash_updater(evt) {
    if (evt.type === "tag_added" && evt.tag === tag.TRASH) {
        storage.remove_item(evt.item);
    }
}

var auto_saver = function () {
    storage.save();
};

function focus_input() {
    // Using a timeout is a workaround.
    setTimeout(function() {
        $("#name").focus();
    }, 20);
}

var inbox = new List();
var next = new List();
var wait = new List();
var project = new List();
var someday = new List();

var storage = new Storage();

var list_updaters = [
    update_when_tagged(inbox, tag.INBOX),
    update_when_tagged(next, tag.NEXT),
    update_when_tagged(wait, tag.WAIT),
    update_when_tagged(project, tag.PROJECT),
    update_when_tagged(someday, tag.SOMEDAY),
    trash_updater,
    auto_saver,
    focus_input
];

var inbox_view = new ListView();
var next_view = new ListView();
var wait_view = new ListView();
var project_view = new ListView();
var someday_view = new ListView();

inbox_view.set_list(inbox);
next_view.set_list(next);
wait_view.set_list(wait);
project_view.set_list(project);
someday_view.set_list(someday);

var next_action = {
    name: "next",
    effect: move_to_box(tag.NEXT)
};

var wait_action = {
    name: "wait",
    effect: move_to_box(tag.WAIT)
};

var project_action = {
    name: "project",
    effect: move_to_box(tag.PROJECT)
};

var someday_action = {
    name: "someday",
    effect: move_to_box(tag.SOMEDAY)
};

var done_action = {
    name: "done",
    effect: move_to_box(tag.TRASH)
};

var drop_action = {
    name: "drop",
    effect: move_to_box(tag.TRASH)
};

inbox_view.add_action(next_action);
inbox_view.add_action(wait_action);
inbox_view.add_action(someday_action);
inbox_view.add_action(project_action);
inbox_view.add_action(drop_action);
next_view.add_action(done_action);
wait_view.add_action(done_action);
wait_view.add_action(next_action);
project_view.add_action(done_action);
someday_view.add_action(next_action);
someday_view.add_action(drop_action);

function create_observed_item(name) {
    var item = new Item(name);
    $.each(list_updaters, function (idx, upd) {
        item.add_listener(upd);
    });
    return item;
}

storage.set_factory(create_observed_item);

function new_item() {
    var item, name = $("#name").val();
    if (name !== "") {
        item = storage.new_item(name);
        item.add_tag(tag.INBOX);
        $("#name").val("");
        storage.save();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(box) {
    return function (e) {
        if (e.originalEvent.dataTransfer){
            e.preventDefault();
            var id = e.originalEvent.dataTransfer.getData("Text");
            $.each(storage.get_items(), function (idx, elem) {
                if (elem.get_id() == id && !elem.has_tag(box)) {
                    move_to_box(box)(elem);
                }
            });
            if (!$.isNumeric(id)) {
                var item = storage.new_item(id);
                item.add_tag(box);
                storage.save();
            }
        }
    };
}

function drop_enable(tag) {
    $(tag).parent().on("dragover", allowDrop);
    $(tag).parent().on("drop", drop(tag));
}

$().ready(function () {
    inbox_view.set_container($(tag.INBOX));
    next_view.set_container($(tag.NEXT));
    wait_view.set_container($(tag.WAIT));
    project_view.set_container($(tag.PROJECT));
    someday_view.set_container($(tag.SOMEDAY));
    $("#new_item").click(new_item);
    $("#save").click(function () { storage.save(); });
    storage.load();

    drop_enable(tag.INBOX);
    drop_enable(tag.NEXT);
    drop_enable(tag.WAIT);
    drop_enable(tag.PROJECT);
    drop_enable(tag.SOMEDAY);
});
