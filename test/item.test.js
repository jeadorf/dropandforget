/**
 * Copyright (c) 2013 Julius Adorf
 *
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

"use strict";

var Item = require("../src/item");
var assert = require("assert");

/* test_new_item */
{
    var it = new Item("Buy milk");
    assert.equal(0, it.get_id());
}

/* test_id */
{
    it = new Item("Buy milk");
    assert.equal(1, it.get_id());
}

/* test_name */
{
    var n = "Buy milk";
    it = new Item(n);
    assert.equal(n, it.get_name());
}

/* test_add_listener */
{
    it = new Item("Buy milk");
    it.add_listener(function(evt) {
        /* nop */
    });
}

/* test_tag_added */
{
    it = new Item("Buy milk");
    var fired = false;
    it.add_listener(function(evt) {
        fired = true;
        assert.equal("tag_added", evt.type);
    });
    assert.ok(!fired);
    it.add_tag("#next");
    assert.ok(fired);
}

/* test_tag_removed */
{
    it = new Item("Buy milk");
    fired = false;
    it.add_listener(function(evt) {
        fired = true;
    });
    assert.ok(!fired);
    it.add_tag("#next");
    assert.ok(fired);
    fired = false;
    assert.ok(!fired);
    it.remove_tag("#next");
    assert.ok(fired);
}

/* test_add_tag */
{
    it = new Item("Buy milk");
    it.add_tag("@phone");
    assert.equal("@phone", it.get_tag(0));
}

/* test_remove_tag */
{
    it = new Item("Buy milk");
    it.add_tag("@phone");
    it.add_tag("@online");
    it.remove_tag("@phone");
    assert.equal("@online", it.get_tag(0));
}

