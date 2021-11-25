
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\person.svelte generated by Svelte v3.44.1 */

    const file$5 = "src\\person.svelte";

    function create_fragment$6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/" + /*profile*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "person svelte-1acswsa");
    			attr_dev(img, "alt", "can't find image");
    			add_location(img, file$5, 5, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*profile*/ 1 && !src_url_equal(img.src, img_src_value = "images/" + /*profile*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Person', slots, []);
    	let { profile } = $$props;
    	const writable_props = ['profile'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Person> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('profile' in $$props) $$invalidate(0, profile = $$props.profile);
    	};

    	$$self.$capture_state = () => ({ profile });

    	$$self.$inject_state = $$props => {
    		if ('profile' in $$props) $$invalidate(0, profile = $$props.profile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [profile];
    }

    class Person extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { profile: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Person",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*profile*/ ctx[0] === undefined && !('profile' in props)) {
    			console.warn("<Person> was created without expected prop 'profile'");
    		}
    	}

    	get profile() {
    		throw new Error("<Person>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set profile(value) {
    		throw new Error("<Person>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\properties.svelte generated by Svelte v3.44.1 */

    const file$4 = "src\\properties.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t = text(/*lang*/ ctx[0]);
    			attr_dev(h2, "class", "properties_text svelte-14t67xd");
    			add_location(h2, file$4, 5, 4, 75);
    			attr_dev(div, "class", "properties svelte-14t67xd");
    			add_location(div, file$4, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lang*/ 1) set_data_dev(t, /*lang*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Properties', slots, []);
    	let { lang } = $$props;
    	const writable_props = ['lang'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Properties> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({ lang });

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang];
    }

    class Properties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { lang: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Properties",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lang*/ ctx[0] === undefined && !('lang' in props)) {
    			console.warn("<Properties> was created without expected prop 'lang'");
    		}
    	}

    	get lang() {
    		throw new Error("<Properties>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Properties>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\mark.svelte generated by Svelte v3.44.1 */

    const file$3 = "src\\mark.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let p;
    	let t_value = /*mark*/ ctx[0].toFixed(1) + "";
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$3, 17, 4, 381);
    			attr_dev(div, "class", div_class_value = "mark_box " + /*bg_color*/ ctx[1] + " svelte-1glw438");
    			add_location(div, file$3, 16, 0, 342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*mark*/ 1 && t_value !== (t_value = /*mark*/ ctx[0].toFixed(1) + "")) set_data_dev(t, t_value);

    			if (dirty & /*bg_color*/ 2 && div_class_value !== (div_class_value = "mark_box " + /*bg_color*/ ctx[1] + " svelte-1glw438")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mark', slots, []);
    	let { mark } = $$props;
    	let bg_color;

    	if (mark <= 1) {
    		bg_color = "verylow";
    	} else if (mark <= 2) {
    		bg_color = "low";
    	} else if (mark <= 3) {
    		bg_color = "medium";
    	} else if (mark <= 4) {
    		bg_color = "high";
    	} else {
    		bg_color = "veryhigh";
    	}

    	const writable_props = ['mark'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mark> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('mark' in $$props) $$invalidate(0, mark = $$props.mark);
    	};

    	$$self.$capture_state = () => ({ mark, bg_color });

    	$$self.$inject_state = $$props => {
    		if ('mark' in $$props) $$invalidate(0, mark = $$props.mark);
    		if ('bg_color' in $$props) $$invalidate(1, bg_color = $$props.bg_color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mark, bg_color];
    }

    class Mark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { mark: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mark",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mark*/ ctx[0] === undefined && !('mark' in props)) {
    			console.warn("<Mark> was created without expected prop 'mark'");
    		}
    	}

    	get mark() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mark(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\column.svelte generated by Svelte v3.44.1 */
    const file$2 = "src\\column.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (35:4) {:else}
    function create_else_block$1(ctx) {
    	let person_1;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;

    	person_1 = new Person({
    			props: { profile: /*person*/ ctx[0].img },
    			$$inline: true
    		});

    	let each_value_1 = /*lang*/ ctx[2];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*lan*/ ctx[5];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			create_component(person_1.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(person_1, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const person_1_changes = {};
    			if (dirty & /*person*/ 1) person_1_changes.profile = /*person*/ ctx[0].img;
    			person_1.$set(person_1_changes);

    			if (dirty & /*person, lang*/ 5) {
    				each_value_1 = /*lang*/ ctx[2];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(person_1.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(person_1.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(person_1, detaching);
    			if (detaching) detach_dev(t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(35:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if which_column === "properties"}
    function create_if_block$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*lang_names*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*lan*/ ctx[5];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lang_names*/ 8) {
    				each_value = /*lang_names*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:4) {#if which_column === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#each lang as lan (lan)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let marks;
    	let current;

    	marks = new Mark({
    			props: { mark: /*person*/ ctx[0][/*lan*/ ctx[5]] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(marks.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(marks, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const marks_changes = {};
    			if (dirty & /*person, lang*/ 5) marks_changes.mark = /*person*/ ctx[0][/*lan*/ ctx[5]];
    			marks.$set(marks_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(marks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(37:8) {#each lang as lan (lan)}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#each lang_names as lan (lan)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let properties;
    	let current;

    	properties = new Properties({
    			props: { lang: /*lan*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(properties.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(properties, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const properties_changes = {};
    			if (dirty & /*lang_names*/ 8) properties_changes.lang = /*lan*/ ctx[5];
    			properties.$set(properties_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(properties.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(properties.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(properties, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(32:8) {#each lang_names as lan (lan)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*which_column*/ ctx[1] === "properties") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "column svelte-1gjfuoy");
    			add_location(div, file$2, 29, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Column', slots, []);
    	let { person } = $$props;
    	let { which_column } = $$props;
    	let { lang } = $$props;
    	let lang_names = [];

    	function text(arr) {
    		$$invalidate(3, lang_names = []);

    		for (let i = 0; i < arr.length; i++) {
    			if (arr[i] == "c_sharp") {
    				lang_names.push("C#");
    			} else {
    				lang_names.push(arr[i].charAt(0).toUpperCase() + arr[i].substr(1));
    			}
    		}
    	}

    	const writable_props = ['person', 'which_column', 'lang'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Column> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('person' in $$props) $$invalidate(0, person = $$props.person);
    		if ('which_column' in $$props) $$invalidate(1, which_column = $$props.which_column);
    		if ('lang' in $$props) $$invalidate(2, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({
    		Person,
    		Properties,
    		Marks: Mark,
    		person,
    		which_column,
    		lang,
    		lang_names,
    		text
    	});

    	$$self.$inject_state = $$props => {
    		if ('person' in $$props) $$invalidate(0, person = $$props.person);
    		if ('which_column' in $$props) $$invalidate(1, which_column = $$props.which_column);
    		if ('lang' in $$props) $$invalidate(2, lang = $$props.lang);
    		if ('lang_names' in $$props) $$invalidate(3, lang_names = $$props.lang_names);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lang*/ 4) {
    			{
    				text(lang);
    			}
    		}
    	};

    	return [person, which_column, lang, lang_names];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { person: 0, which_column: 1, lang: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*person*/ ctx[0] === undefined && !('person' in props)) {
    			console.warn("<Column> was created without expected prop 'person'");
    		}

    		if (/*which_column*/ ctx[1] === undefined && !('which_column' in props)) {
    			console.warn("<Column> was created without expected prop 'which_column'");
    		}

    		if (/*lang*/ ctx[2] === undefined && !('lang' in props)) {
    			console.warn("<Column> was created without expected prop 'lang'");
    		}
    	}

    	get person() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set person(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get which_column() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set which_column(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lang() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const data = writable([]);
    const lang_list = writable([]);
    const min_avg_f = writable(undefined);
    const max_result = writable(undefined);

    //filtry

    const data_after_filtr = derived([data,lang_list,min_avg_f,max_result], ([dat,lang_lis, min_avg_,max_resul]) => {

        let persons_data = dat.slice();
        let after_filtr = persons_data.slice();

        let index_to_remove = [];

        //filtr minimalnej sredniej

        if (
            min_avg_ !== undefined &&
            min_avg_ !== null &&
            min_avg_ >= 0
        ) {
            for (let i = 0; i < after_filtr.length; i++) {
                let sum = 0;
                for (let j = 0; j < lang_lis.length; j++) {
                    sum += after_filtr[i][lang_lis[j]];
                }
                console.log(sum / lang_lis.length);
                if (sum / lang_lis.length < min_avg_) {
                    index_to_remove.push(i);
                }
            }

            while (index_to_remove.length) {
                after_filtr.splice(index_to_remove.pop(), 1);
            }
        }

        //filtr ilości osób

        if (
            max_resul !== null &&
            max_resul !== undefined &&
            max_resul >= 0 &&
            after_filtr.length >= max_resul
        ) {
            after_filtr.length = max_resul;
        }
        return after_filtr;
    });

    /* src\grid.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\grid.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (26:4) {#if lang !== undefined && after_filtr !== undefined}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*after_filtr*/ ctx[0].length > 0 && /*lang*/ ctx[2].length > 0) return 0;
    		if (/*load*/ ctx[1] == true) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(26:4) {#if lang !== undefined && after_filtr !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No results...";
    			attr_dev(p, "class", "loading svelte-1jv0jta");
    			add_location(p, file$1, 34, 12, 1044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:31) 
    function create_if_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			attr_dev(p, "class", "loading svelte-1jv0jta");
    			add_location(p, file$1, 32, 12, 980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(32:31) ",
    		ctx
    	});

    	return block;
    }

    // (27:8) {#if after_filtr.length > 0 && lang.length > 0}
    function create_if_block_1(ctx) {
    	let column;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;

    	column = new Column({
    			props: {
    				which_column: "properties",
    				lang: /*lang*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let each_value = /*after_filtr*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*person*/ ctx[5]._id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};
    			if (dirty & /*lang*/ 4) column_changes.lang = /*lang*/ ctx[2];
    			column.$set(column_changes);

    			if (dirty & /*lang, after_filtr*/ 5) {
    				each_value = /*after_filtr*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    			if (detaching) detach_dev(t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(27:8) {#if after_filtr.length > 0 && lang.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#each after_filtr as person (person._id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let column;
    	let current;

    	column = new Column({
    			props: {
    				which_column: "values",
    				lang: /*lang*/ ctx[2],
    				person: /*person*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(column.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const column_changes = {};
    			if (dirty & /*lang*/ 4) column_changes.lang = /*lang*/ ctx[2];
    			if (dirty & /*after_filtr*/ 1) column_changes.person = /*person*/ ctx[5];
    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(29:12) {#each after_filtr as person (person._id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	let if_block = /*lang*/ ctx[2] !== undefined && /*after_filtr*/ ctx[0] !== undefined && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "grid svelte-1jv0jta");
    			add_location(div, file$1, 24, 0, 595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*lang*/ ctx[2] !== undefined && /*after_filtr*/ ctx[0] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*lang, after_filtr*/ 5) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $data_after_filtr;
    	let $lang_list;
    	validate_store(data_after_filtr, 'data_after_filtr');
    	component_subscribe($$self, data_after_filtr, $$value => $$invalidate(3, $data_after_filtr = $$value));
    	validate_store(lang_list, 'lang_list');
    	component_subscribe($$self, lang_list, $$value => $$invalidate(4, $lang_list = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let after_filtr = [];
    	let load = true;
    	let lang = [];

    	onMount(() => {
    		fetch("http://giereczka.pl/api").then(response => response.json()).then(data2 => {
    			data.set(data2);
    			$$invalidate(1, load = false);
    			console.log("Fetch");
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Column,
    		lang_list,
    		data_after_filtr,
    		data,
    		onMount,
    		after_filtr,
    		load,
    		lang,
    		$data_after_filtr,
    		$lang_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('after_filtr' in $$props) $$invalidate(0, after_filtr = $$props.after_filtr);
    		if ('load' in $$props) $$invalidate(1, load = $$props.load);
    		if ('lang' in $$props) $$invalidate(2, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$lang_list*/ 16) {
    			$$invalidate(2, lang = $lang_list);
    		}

    		if ($$self.$$.dirty & /*$data_after_filtr*/ 8) {
    			$$invalidate(0, after_filtr = $data_after_filtr);
    		}
    	};

    	return [after_filtr, load, lang, $data_after_filtr, $lang_list];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\filter.svelte generated by Svelte v3.44.1 */
    const file = "src\\filter.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[11] = list;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (24:8) {#each selected as lan, i (lan)}
    function create_each_block(key_1, ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1_value = /*lang_text*/ ctx[4][/*i*/ ctx[12]] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[6].call(input, /*i*/ ctx[12]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*lan*/ ctx[10];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-307a49");
    			/*$$binding_groups*/ ctx[7][0].push(input);
    			add_location(input, file, 25, 16, 612);
    			attr_dev(span, "class", "svelte-307a49");
    			add_location(span, file, 31, 16, 812);
    			attr_dev(label, "class", "svelte-307a49");
    			add_location(label, file, 24, 12, 587);
    			this.first = label;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = ~/*lang*/ ctx[0].indexOf(input.__value);
    			input.checked = /*visible*/ ctx[3][/*i*/ ctx[12]];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*lang*/ 1) {
    				input.checked = ~/*lang*/ ctx[0].indexOf(input.__value);
    			}

    			if (dirty & /*visible, selected*/ 40) {
    				input.checked = /*visible*/ ctx[3][/*i*/ ctx[12]];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:8) {#each selected as lan, i (lan)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let header;
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let input0;
    	let t1;
    	let input1;
    	let mounted;
    	let dispose;
    	let each_value = /*selected*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*lan*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			attr_dev(div, "class", "checkboxes svelte-307a49");
    			add_location(div, file, 22, 4, 507);
    			attr_dev(input0, "placeholder", "Maks wyników");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "class", "svelte-307a49");
    			add_location(input0, file, 35, 4, 896);
    			attr_dev(input1, "placeholder", "Min średnia");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-307a49");
    			add_location(input1, file, 36, 4, 984);
    			attr_dev(header, "class", "svelte-307a49");
    			add_location(header, file, 21, 0, 493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(header, t0);
    			append_dev(header, input0);
    			set_input_value(input0, /*filtr_users_number*/ ctx[1]);
    			append_dev(header, t1);
    			append_dev(header, input1);
    			set_input_value(input1, /*min_avg*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lang_text, selected, lang, visible*/ 57) {
    				each_value = /*selected*/ ctx[5];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
    			}

    			if (dirty & /*filtr_users_number*/ 2 && to_number(input0.value) !== /*filtr_users_number*/ ctx[1]) {
    				set_input_value(input0, /*filtr_users_number*/ ctx[1]);
    			}

    			if (dirty & /*min_avg*/ 4 && to_number(input1.value) !== /*min_avg*/ ctx[2]) {
    				set_input_value(input1, /*min_avg*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter', slots, []);
    	let visible = [true, true, true, true];
    	let lang = ["javascript", "python", "c_sharp", "java"];
    	let lang_text = ["Javascript", "Python", "C#", "Java"];
    	let filtr_users_number;
    	let min_avg;
    	let selected = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler(i) {
    		lang = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		visible[i] = this.checked;
    		$$invalidate(0, lang);
    		$$invalidate(3, visible);
    		$$invalidate(5, selected);
    	}

    	function input0_input_handler() {
    		filtr_users_number = to_number(this.value);
    		$$invalidate(1, filtr_users_number);
    	}

    	function input1_input_handler() {
    		min_avg = to_number(this.value);
    		$$invalidate(2, min_avg);
    	}

    	$$self.$capture_state = () => ({
    		lang_list,
    		min_avg_f,
    		max_result,
    		visible,
    		lang,
    		lang_text,
    		filtr_users_number,
    		min_avg,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(3, visible = $$props.visible);
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('lang_text' in $$props) $$invalidate(4, lang_text = $$props.lang_text);
    		if ('filtr_users_number' in $$props) $$invalidate(1, filtr_users_number = $$props.filtr_users_number);
    		if ('min_avg' in $$props) $$invalidate(2, min_avg = $$props.min_avg);
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filtr_users_number*/ 2) {
    			//zapisywanie filtrów do writable
    			max_result.set(filtr_users_number);
    		}

    		if ($$self.$$.dirty & /*min_avg*/ 4) {
    			min_avg_f.set(min_avg);
    		}

    		if ($$self.$$.dirty & /*lang*/ 1) {
    			lang_list.set(lang);
    		}
    	};

    	return [
    		lang,
    		filtr_users_number,
    		min_avg,
    		visible,
    		lang_text,
    		selected,
    		input_change_handler,
    		$$binding_groups,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.1 */

    function create_fragment(ctx) {
    	let filter;
    	let t;
    	let grid;
    	let current;
    	filter = new Filter({ $$inline: true });
    	grid = new Grid({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filter.$$.fragment);
    			t = space();
    			create_component(grid.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(filter, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filter.$$.fragment, local);
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filter.$$.fragment, local);
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filter, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Grid, Filter });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
