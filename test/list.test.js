/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var Item = require("../src/item");
var List = require("../src/list");
var assert = require("assert");

/* test_new_list */
{
    var list = new List();
}

/* test_add_listener */
{
    list = new List();
    list.add_listener(function(evt) {
        /* nop */
    });
}

/* test_item_added */
{
    list = new List();
    var fired = false;
    list.add_listener(function(evt) {
        fired = true;
        assert.equal("item_added", evt.type);
    });
    assert.ok(!fired);
    list.add_item(new Item("Buy milk"));
    assert.ok(fired);
}

/* test_item_removed */
{
    list = new List();
    fired = false;
    list.add_listener(function(evt) {
        fired = true;
    });
    assert.ok(!fired);
    var it = new Item("Buy milk");
    list.add_item(it);
    assert.ok(fired);
    fired = false;
    assert.ok(!fired);
    list.remove_item(it);
    assert.ok(fired);
}

/* test_add_item */
{
    list = new List();
    it = new Item("Buy milk");
    assert.equal(0, list.size());
    list.add_item(it);
    assert.equal(1, list.size());
}

/* test_remove_item */
{
    list = new List();
    it = new Item("Buy milk");
    assert.equal(0, list.size());
    list.add_item(it);
    assert.equal(1, list.size());
    list.remove_item(it);
    assert.equal(0, list.size());
}

