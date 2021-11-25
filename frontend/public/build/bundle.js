
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
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    const file$8 = "src\\person.svelte";

    function create_fragment$9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/" + /*profile*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "person svelte-1acswsa");
    			attr_dev(img, "alt", "can't find image");
    			add_location(img, file$8, 5, 0, 95);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { profile: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Person",
    			options,
    			id: create_fragment$9.name
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

    const subscriber_queue = [];
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

    const change_value = writable(undefined);
    const mark_props = writable([]);
    const tech_view = writable(undefined);
    const which_elem_is_editing = writable("mark");
    const tech_update = writable(undefined);
    const load = writable(true);
    const tech_create = writable([]);
    const person_list_create = writable([]);
    const projects_names = writable([]);

    /* src\properties.svelte generated by Svelte v3.44.1 */
    const file$7 = "src\\properties.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let h2;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t = text(/*lang*/ ctx[0]);
    			attr_dev(h2, "class", "properties_text svelte-14t67xd");
    			add_location(h2, file$7, 28, 4, 820);
    			attr_dev(div, "class", "properties svelte-14t67xd");
    			add_location(div, file$7, 27, 0, 740);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t);
    			/*div_binding*/ ctx[4](div);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*tech_view_edit*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lang*/ 1) set_data_dev(t, /*lang*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $change_value;
    	let $which_elem_is_editing;
    	let $tech_view;
    	validate_store(change_value, 'change_value');
    	component_subscribe($$self, change_value, $$value => $$invalidate(3, $change_value = $$value));
    	validate_store(which_elem_is_editing, 'which_elem_is_editing');
    	component_subscribe($$self, which_elem_is_editing, $$value => $$invalidate(5, $which_elem_is_editing = $$value));
    	validate_store(tech_view, 'tech_view');
    	component_subscribe($$self, tech_view, $$value => $$invalidate(6, $tech_view = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Properties', slots, []);
    	let { lang } = $$props;
    	let dom_element;

    	//podświetlenie i dodanie wiersza do edycji
    	function tech_view_edit() {
    		if ($change_value != dom_element) {
    			set_store_value(tech_view, $tech_view = lang, $tech_view);
    			$$invalidate(1, dom_element.style.backgroundColor = "rgb(195, 50, 50)", dom_element);
    			set_store_value(which_elem_is_editing, $which_elem_is_editing = "properties", $which_elem_is_editing);
    			set_store_value(change_value, $change_value = dom_element, $change_value);
    		} else {
    			$$invalidate(1, dom_element.style.backgroundColor = "", dom_element);
    			set_store_value(change_value, $change_value = undefined, $change_value);
    		}
    	}

    	const writable_props = ['lang'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Properties> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dom_element = $$value;
    			($$invalidate(1, dom_element), $$invalidate(3, $change_value));
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({
    		change_value,
    		tech_view,
    		which_elem_is_editing,
    		lang,
    		dom_element,
    		tech_view_edit,
    		$change_value,
    		$which_elem_is_editing,
    		$tech_view
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('dom_element' in $$props) $$invalidate(1, dom_element = $$props.dom_element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$change_value, dom_element*/ 10) {
    			if ($change_value != dom_element && dom_element != undefined) {
    				$$invalidate(1, dom_element.style.backgroundColor = "", dom_element);
    			}
    		}
    	};

    	return [lang, dom_element, tech_view_edit, $change_value, div_binding];
    }

    class Properties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { lang: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Properties",
    			options,
    			id: create_fragment$8.name
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
    const file$6 = "src\\mark.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let p;
    	let t_value = /*mark*/ ctx[0].toFixed(1) + "";
    	let t;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$6, 100, 4, 2907);
    			attr_dev(div, "class", div_class_value = "mark_box " + /*bg_color*/ ctx[1] + " svelte-10nfodf");
    			add_location(div, file$6, 99, 0, 2828);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t);
    			/*div_binding*/ ctx[6](div);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*edit*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*mark*/ 1 && t_value !== (t_value = /*mark*/ ctx[0].toFixed(1) + "")) set_data_dev(t, t_value);

    			if (dirty & /*bg_color*/ 2 && div_class_value !== (div_class_value = "mark_box " + /*bg_color*/ ctx[1] + " svelte-10nfodf")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $mark_props;
    	let $change_value;
    	let $which_elem_is_editing;
    	validate_store(mark_props, 'mark_props');
    	component_subscribe($$self, mark_props, $$value => $$invalidate(11, $mark_props = $$value));
    	validate_store(change_value, 'change_value');
    	component_subscribe($$self, change_value, $$value => $$invalidate(12, $change_value = $$value));
    	validate_store(which_elem_is_editing, 'which_elem_is_editing');
    	component_subscribe($$self, which_elem_is_editing, $$value => $$invalidate(13, $which_elem_is_editing = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mark', slots, []);
    	let { mark } = $$props;
    	let { tech } = $$props;
    	let { person_id } = $$props;
    	let bg_color;
    	let dom_element;

    	let color_table = [
    		["hsl(0, 100%, ", "hsl(0, 100%, "],
    		["hsl(17, 100%, ", "hsl(19, 100%, "],
    		["hsl(51, 100%, ", "hsl(59, 91%, "],
    		["hsl(86, 100%, ", "hsl(91, 100%, "],
    		["hsl(125, 100%, ", "hsl(120, 100%, "]
    	];

    	let lightness = [63, 72];
    	let delta = 0.5;
    	let delta_counter = 1;
    	let chn = true;

    	function color_change() {
    		//nadanie koloru do animacji według oceny
    		let color_in_hsl_index;

    		if (mark <= 1 && mark >= 0) {
    			color_in_hsl_index = 0;
    		} else if (mark <= 2) {
    			color_in_hsl_index = 1;
    		} else if (mark <= 3) {
    			color_in_hsl_index = 2;
    		} else if (mark <= 4) {
    			color_in_hsl_index = 3;
    		} else if (mark <= 5) {
    			color_in_hsl_index = 4;
    		} else {
    			$$invalidate(2, dom_element.style.backgroundColor = "", dom_element);
    			$$invalidate(2, dom_element.style.borderColor = "", dom_element);
    			return;
    		}

    		//animacja
    		$$invalidate(2, dom_element.style.backgroundColor = color_table[color_in_hsl_index][0] + lightness[0].toString() + "%)", dom_element);

    		$$invalidate(2, dom_element.style.borderColor = color_table[color_in_hsl_index][1] + lightness[1].toString() + "%)", dom_element);

    		if (delta_counter > 20 && chn) {
    			delta *= -1;
    			chn = false;
    		} else if (delta_counter < -13 && !chn) {
    			delta *= -1;
    			chn = true;
    		}

    		delta_counter += delta;
    		lightness[0] += delta;
    		lightness[1] += delta;

    		if ($change_value == dom_element) {
    			setTimeout(color_change, 16);
    		} else {
    			$$invalidate(2, dom_element.style.backgroundColor = "", dom_element);
    			$$invalidate(2, dom_element.style.borderColor = "", dom_element);
    		}
    	}

    	//animacja i dodanie wiersza do edycji
    	function edit() {
    		if ($change_value != dom_element) {
    			lightness = [63, 72];
    			delta_counter = 1;
    			delta = 0.5;
    			chn = true;
    			setTimeout(color_change, 16);
    			set_store_value(change_value, $change_value = dom_element, $change_value);
    			set_store_value(mark_props, $mark_props = [person_id, tech], $mark_props);
    			set_store_value(which_elem_is_editing, $which_elem_is_editing = "mark", $which_elem_is_editing);
    		} else {
    			set_store_value(change_value, $change_value = undefined, $change_value);
    			set_store_value(mark_props, $mark_props = [], $mark_props);
    		}
    	}

    	const writable_props = ['mark', 'tech', 'person_id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mark> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dom_element = $$value;
    			$$invalidate(2, dom_element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('mark' in $$props) $$invalidate(0, mark = $$props.mark);
    		if ('tech' in $$props) $$invalidate(4, tech = $$props.tech);
    		if ('person_id' in $$props) $$invalidate(5, person_id = $$props.person_id);
    	};

    	$$self.$capture_state = () => ({
    		change_value,
    		mark_props,
    		which_elem_is_editing,
    		mark,
    		tech,
    		person_id,
    		bg_color,
    		dom_element,
    		color_table,
    		lightness,
    		delta,
    		delta_counter,
    		chn,
    		color_change,
    		edit,
    		$mark_props,
    		$change_value,
    		$which_elem_is_editing
    	});

    	$$self.$inject_state = $$props => {
    		if ('mark' in $$props) $$invalidate(0, mark = $$props.mark);
    		if ('tech' in $$props) $$invalidate(4, tech = $$props.tech);
    		if ('person_id' in $$props) $$invalidate(5, person_id = $$props.person_id);
    		if ('bg_color' in $$props) $$invalidate(1, bg_color = $$props.bg_color);
    		if ('dom_element' in $$props) $$invalidate(2, dom_element = $$props.dom_element);
    		if ('color_table' in $$props) color_table = $$props.color_table;
    		if ('lightness' in $$props) lightness = $$props.lightness;
    		if ('delta' in $$props) delta = $$props.delta;
    		if ('delta_counter' in $$props) delta_counter = $$props.delta_counter;
    		if ('chn' in $$props) chn = $$props.chn;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mark*/ 1) {
    			if (mark <= 1) {
    				$$invalidate(1, bg_color = "verylow");
    			} else if (mark <= 2) {
    				$$invalidate(1, bg_color = "low");
    			} else if (mark <= 3) {
    				$$invalidate(1, bg_color = "medium");
    			} else if (mark <= 4) {
    				$$invalidate(1, bg_color = "high");
    			} else {
    				$$invalidate(1, bg_color = "veryhigh");
    			}
    		}
    	};

    	return [mark, bg_color, dom_element, edit, tech, person_id, div_binding];
    }

    class Mark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { mark: 0, tech: 4, person_id: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mark",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mark*/ ctx[0] === undefined && !('mark' in props)) {
    			console.warn("<Mark> was created without expected prop 'mark'");
    		}

    		if (/*tech*/ ctx[4] === undefined && !('tech' in props)) {
    			console.warn("<Mark> was created without expected prop 'tech'");
    		}

    		if (/*person_id*/ ctx[5] === undefined && !('person_id' in props)) {
    			console.warn("<Mark> was created without expected prop 'person_id'");
    		}
    	}

    	get mark() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mark(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tech() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tech(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get person_id() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set person_id(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\column.svelte generated by Svelte v3.44.1 */
    const file$5 = "src\\column.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (32:26) 
    function create_if_block_1$2(ctx) {
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
    	const get_key = ctx => /*lan*/ ctx[7];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
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

    			if (dirty & /*lang, person*/ 5) {
    				each_value_1 = /*lang*/ ctx[2];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1$1, each_1_anchor, get_each_context_1$1);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(32:26) ",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if which_column === "properties"}
    function create_if_block$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*lang_names*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*lan*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
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
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(28:4) {#if which_column === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#each lang as lan, i (lan)}
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let marks;
    	let current;

    	marks = new Mark({
    			props: {
    				tech: /*lan*/ ctx[7],
    				person_id: /*person*/ ctx[0]._id,
    				mark: /*person*/ ctx[0][/*lan*/ ctx[7]]
    			},
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
    			if (dirty & /*lang*/ 4) marks_changes.tech = /*lan*/ ctx[7];
    			if (dirty & /*person*/ 1) marks_changes.person_id = /*person*/ ctx[0]._id;
    			if (dirty & /*person, lang*/ 5) marks_changes.mark = /*person*/ ctx[0][/*lan*/ ctx[7]];
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(34:8) {#each lang as lan, i (lan)}",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#each lang_names as lan (lan)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let properties;
    	let current;

    	properties = new Properties({
    			props: { lang: /*lan*/ ctx[7] },
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
    			if (dirty & /*lang_names*/ 8) properties_changes.lang = /*lan*/ ctx[7];
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(29:8) {#each lang_names as lan (lan)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*which_column*/ ctx[1] === "properties") return 0;
    		if (/*lang*/ ctx[2].length) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "column svelte-1gjfuoy");
    			add_location(div, file$5, 26, 0, 561);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
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
    	validate_slots('Column', slots, []);
    	let { person } = $$props;
    	let { which_column } = $$props;
    	let { lang } = $$props;
    	let { techs_view } = $$props;
    	let { techs } = $$props;
    	let lang_names = [];

    	//wyświetlania nazw wierszy
    	function text(arr) {
    		$$invalidate(3, lang_names = []);

    		arr.forEach(element => {
    			lang_names.push(techs_view[techs.indexOf(element)]);
    		});
    	}

    	const writable_props = ['person', 'which_column', 'lang', 'techs_view', 'techs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Column> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('person' in $$props) $$invalidate(0, person = $$props.person);
    		if ('which_column' in $$props) $$invalidate(1, which_column = $$props.which_column);
    		if ('lang' in $$props) $$invalidate(2, lang = $$props.lang);
    		if ('techs_view' in $$props) $$invalidate(4, techs_view = $$props.techs_view);
    		if ('techs' in $$props) $$invalidate(5, techs = $$props.techs);
    	};

    	$$self.$capture_state = () => ({
    		Person,
    		Properties,
    		Marks: Mark,
    		person,
    		which_column,
    		lang,
    		techs_view,
    		techs,
    		lang_names,
    		text
    	});

    	$$self.$inject_state = $$props => {
    		if ('person' in $$props) $$invalidate(0, person = $$props.person);
    		if ('which_column' in $$props) $$invalidate(1, which_column = $$props.which_column);
    		if ('lang' in $$props) $$invalidate(2, lang = $$props.lang);
    		if ('techs_view' in $$props) $$invalidate(4, techs_view = $$props.techs_view);
    		if ('techs' in $$props) $$invalidate(5, techs = $$props.techs);
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

    	return [person, which_column, lang, lang_names, techs_view, techs];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			person: 0,
    			which_column: 1,
    			lang: 2,
    			techs_view: 4,
    			techs: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$6.name
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

    		if (/*techs_view*/ ctx[4] === undefined && !('techs_view' in props)) {
    			console.warn("<Column> was created without expected prop 'techs_view'");
    		}

    		if (/*techs*/ ctx[5] === undefined && !('techs' in props)) {
    			console.warn("<Column> was created without expected prop 'techs'");
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

    	get techs_view() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set techs_view(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get techs() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set techs(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\table.svelte generated by Svelte v3.44.1 */
    const file$4 = "src\\table.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (15:4) {#each person_list as person, i (person._id)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let column;
    	let current;

    	column = new Column({
    			props: {
    				techs: /*data*/ ctx[0].tech_list,
    				techs_view: /*data*/ ctx[0].tech_list_view,
    				which_column: "values",
    				lang: /*tech_create*/ ctx[1],
    				person: /*person*/ ctx[3]
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
    			if (dirty & /*data*/ 1) column_changes.techs = /*data*/ ctx[0].tech_list;
    			if (dirty & /*data*/ 1) column_changes.techs_view = /*data*/ ctx[0].tech_list_view;
    			if (dirty & /*tech_create*/ 2) column_changes.lang = /*tech_create*/ ctx[1];
    			if (dirty & /*person_list*/ 4) column_changes.person = /*person*/ ctx[3];
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(15:4) {#each person_list as person, i (person._id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let column;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;

    	column = new Column({
    			props: {
    				techs: /*data*/ ctx[0].tech_list,
    				techs_view: /*data*/ ctx[0].tech_list_view,
    				lang: /*tech_create*/ ctx[1],
    				which_column: "properties"
    			},
    			$$inline: true
    		});

    	let each_value = /*person_list*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*person*/ ctx[3]._id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(column.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "table svelte-mvv5k8");
    			add_location(div, file$4, 7, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(column, div, null);
    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const column_changes = {};
    			if (dirty & /*data*/ 1) column_changes.techs = /*data*/ ctx[0].tech_list;
    			if (dirty & /*data*/ 1) column_changes.techs_view = /*data*/ ctx[0].tech_list_view;
    			if (dirty & /*tech_create*/ 2) column_changes.lang = /*tech_create*/ ctx[1];
    			column.$set(column_changes);

    			if (dirty & /*data, tech_create, person_list*/ 7) {
    				each_value = /*person_list*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
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
    			if (detaching) detach_dev(div);
    			destroy_component(column);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
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
    	validate_slots('Table', slots, []);
    	let { data } = $$props;
    	let { tech_create } = $$props;
    	let { person_list } = $$props;
    	const writable_props = ['data', 'tech_create', 'person_list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('tech_create' in $$props) $$invalidate(1, tech_create = $$props.tech_create);
    		if ('person_list' in $$props) $$invalidate(2, person_list = $$props.person_list);
    	};

    	$$self.$capture_state = () => ({ Column, data, tech_create, person_list });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('tech_create' in $$props) $$invalidate(1, tech_create = $$props.tech_create);
    		if ('person_list' in $$props) $$invalidate(2, person_list = $$props.person_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, tech_create, person_list];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { data: 0, tech_create: 1, person_list: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<Table> was created without expected prop 'data'");
    		}

    		if (/*tech_create*/ ctx[1] === undefined && !('tech_create' in props)) {
    			console.warn("<Table> was created without expected prop 'tech_create'");
    		}

    		if (/*person_list*/ ctx[2] === undefined && !('person_list' in props)) {
    			console.warn("<Table> was created without expected prop 'person_list'");
    		}
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tech_create() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tech_create(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get person_list() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set person_list(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\create.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\create.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[20] = list;
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[23] = list;
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (83:4) {#each list_of_tech as tech, i (list_of_tech[i])}
    function create_each_block_1(key_1, ctx) {
    	let div;
    	let input;
    	let t0;
    	let t1_value = /*list_of_tech_view*/ ctx[10][/*i*/ ctx[21]] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[12].call(input, /*i*/ ctx[21]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*tech*/ ctx[22];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[13][1].push(input);
    			add_location(input, file$3, 84, 12, 2460);
    			add_location(div, file$3, 83, 8, 2441);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*which_tech_create*/ ctx[2][/*i*/ ctx[21]];
    			input.checked = ~/*$tech_create*/ ctx[7].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*which_tech_create, list_of_tech*/ 516) {
    				input.checked = /*which_tech_create*/ ctx[2][/*i*/ ctx[21]];
    			}

    			if (dirty & /*$tech_create*/ 128) {
    				input.checked = ~/*$tech_create*/ ctx[7].indexOf(input.__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[13][1].splice(/*$$binding_groups*/ ctx[13][1].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(83:4) {#each list_of_tech as tech, i (list_of_tech[i])}",
    		ctx
    	});

    	return block;
    }

    // (96:4) {#each data.persons as person, i (person._id)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let input;
    	let input_value_value;
    	let t0;
    	let t1_value = /*person*/ ctx[19].name + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_change_handler_1() {
    		/*input_change_handler_1*/ ctx[14].call(input, /*i*/ ctx[21]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			input.__value = input_value_value = /*person*/ ctx[19];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[13][0].push(input);
    			add_location(input, file$3, 97, 12, 2814);
    			add_location(div, file$3, 96, 8, 2795);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*person_create*/ ctx[0][/*i*/ ctx[21]];
    			input.checked = ~/*$person_list_create*/ ctx[8].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 2 && input_value_value !== (input_value_value = /*person*/ ctx[19])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*person_create, data*/ 3) {
    				input.checked = /*person_create*/ ctx[0][/*i*/ ctx[21]];
    			}

    			if (dirty & /*$person_list_create*/ 256) {
    				input.checked = ~/*$person_list_create*/ ctx[8].indexOf(input.__value);
    			}

    			if (dirty & /*data*/ 2 && t1_value !== (t1_value = /*person*/ ctx[19].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(96:4) {#each data.persons as person, i (person._id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h30;
    	let t0;
    	let t1;
    	let div2;
    	let div0;
    	let t3;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t4;
    	let div1;
    	let t6;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t7;
    	let input0;
    	let t8;
    	let h31;
    	let t10;
    	let input1;
    	let t11;
    	let h32;
    	let t13;
    	let input2;
    	let t14;
    	let input3;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*list_of_tech*/ ctx[9];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*list_of_tech*/ ctx[9][/*i*/ ctx[21]];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*data*/ ctx[1].persons;
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*person*/ ctx[19]._id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			h30 = element("h3");
    			t0 = text(/*error_message_create*/ ctx[6]);
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Technology:";
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "Persons:";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			h31 = element("h3");
    			h31.textContent = "Starting date:";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			h32 = element("h3");
    			h32.textContent = "End date:";
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			input3 = element("input");
    			attr_dev(h30, "class", "error svelte-pusvjr");
    			add_location(h30, file$3, 79, 0, 2278);
    			add_location(div0, file$3, 81, 4, 2354);
    			add_location(div1, file$3, 94, 4, 2714);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Tabele name");
    			attr_dev(input0, "class", "svelte-pusvjr");
    			add_location(input0, file$3, 107, 4, 3064);
    			add_location(h31, file$3, 108, 4, 3143);
    			attr_dev(input1, "type", "date");
    			add_location(input1, file$3, 109, 4, 3172);
    			add_location(h32, file$3, 110, 4, 3223);
    			attr_dev(input2, "type", "date");
    			add_location(input2, file$3, 111, 4, 3247);
    			attr_dev(input3, "type", "submit");
    			input3.value = "Save";
    			attr_dev(input3, "class", "svelte-pusvjr");
    			add_location(input3, file$3, 112, 4, 3296);
    			attr_dev(div2, "class", "on_inputs svelte-pusvjr");
    			add_location(div2, file$3, 80, 0, 2325);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h30, anchor);
    			append_dev(h30, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div2, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t7);
    			append_dev(div2, input0);
    			set_input_value(input0, /*project_name*/ ctx[5]);
    			append_dev(div2, t8);
    			append_dev(div2, h31);
    			append_dev(div2, t10);
    			append_dev(div2, input1);
    			set_input_value(input1, /*data_start*/ ctx[3]);
    			append_dev(div2, t11);
    			append_dev(div2, h32);
    			append_dev(div2, t13);
    			append_dev(div2, input2);
    			set_input_value(input2, /*data_end*/ ctx[4]);
    			append_dev(div2, t14);
    			append_dev(div2, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(input3, "click", /*create*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*error_message_create*/ 64) set_data_dev(t0, /*error_message_create*/ ctx[6]);

    			if (dirty & /*list_of_tech_view, list_of_tech, which_tech_create, $tech_create*/ 1668) {
    				each_value_1 = /*list_of_tech*/ ctx[9];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div2, destroy_block, create_each_block_1, t4, get_each_context_1);
    			}

    			if (dirty & /*data, person_create, $person_list_create*/ 259) {
    				each_value = /*data*/ ctx[1].persons;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, div2, destroy_block, create_each_block$2, t7, get_each_context$2);
    			}

    			if (dirty & /*project_name*/ 32 && input0.value !== /*project_name*/ ctx[5]) {
    				set_input_value(input0, /*project_name*/ ctx[5]);
    			}

    			if (dirty & /*data_start*/ 8) {
    				set_input_value(input1, /*data_start*/ ctx[3]);
    			}

    			if (dirty & /*data_end*/ 16) {
    				set_input_value(input2, /*data_end*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
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
    	let $load;
    	let $tech_create;
    	let $person_list_create;
    	validate_store(load, 'load');
    	component_subscribe($$self, load, $$value => $$invalidate(18, $load = $$value));
    	validate_store(tech_create, 'tech_create');
    	component_subscribe($$self, tech_create, $$value => $$invalidate(7, $tech_create = $$value));
    	validate_store(person_list_create, 'person_list_create');
    	component_subscribe($$self, person_list_create, $$value => $$invalidate(8, $person_list_create = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create', slots, []);
    	let { data } = $$props;
    	let { person_create } = $$props;
    	let which_tech_create = [false, false, false, false];
    	let list_of_tech = ["javascript", "java", "python", "c_sharp"];
    	let list_of_tech_view = ["Javascript", "Java", "Python", "C#"];
    	let data_start = "2021-11-01";
    	let data_end = "2021-11-01";
    	let project_name = "";
    	let error_message_create = "";

    	function create() {
    		//tworzenie nowych tabel
    		set_store_value(load, $load = true, $load);

    		$$invalidate(6, error_message_create = "");

    		//walidacja danych
    		if (!project_name || !data_start || !data_end || !($person_list_create.length && $tech_create.length)) {
    			$$invalidate(6, error_message_create = "select the minimum number of fields!");
    			set_store_value(load, $load = false, $load);
    			return;
    		}

    		//tworzenie tabeli osob z wybranymi technologiami
    		let person_list_to_create = $person_list_create.map(person => {
    			return person = [...$tech_create, "img", "_id", "name"].reduce(
    				(new_obj, property) => {
    					return Object.assign(new_obj, { [property]: person[property] });
    				},
    				{
    					[$tech_create[0]]: person[$tech_create[0]]
    				}
    			);
    		});

    		const obj = {
    			name: project_name,
    			data_start,
    			data_end,
    			tech_list_view: ["Javascript", "Java", "Python", "C#"],
    			tech_list: $tech_create,
    			persons: person_list_to_create
    		};

    		const requestOptions = {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ data: obj })
    		};

    		//dodanie nowej tabeli
    		fetch("http://localhost:3000/add/", requestOptions).then(response => response.json()).then(data_org => {
    			if (data_org.res == "y") {
    				set_store_value(load, $load = false, $load);
    			}
    		});
    	}

    	const writable_props = ['data', 'person_create'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function input_change_handler(i) {
    		which_tech_create[i] = this.checked;
    		$tech_create = get_binding_group_value($$binding_groups[1], this.__value, this.checked);
    		tech_create.set($tech_create);
    		$$invalidate(2, which_tech_create);
    		$$invalidate(9, list_of_tech);
    	}

    	function input_change_handler_1(i) {
    		person_create[i] = this.checked;
    		$person_list_create = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		person_list_create.set($person_list_create);
    		$$invalidate(0, person_create);
    		$$invalidate(1, data);
    	}

    	function input0_input_handler() {
    		project_name = this.value;
    		$$invalidate(5, project_name);
    	}

    	function input1_input_handler() {
    		data_start = this.value;
    		$$invalidate(3, data_start);
    	}

    	function input2_input_handler() {
    		data_end = this.value;
    		$$invalidate(4, data_end);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('person_create' in $$props) $$invalidate(0, person_create = $$props.person_create);
    	};

    	$$self.$capture_state = () => ({
    		load,
    		tech_create,
    		person_list_create,
    		data,
    		person_create,
    		which_tech_create,
    		list_of_tech,
    		list_of_tech_view,
    		data_start,
    		data_end,
    		project_name,
    		error_message_create,
    		create,
    		$load,
    		$tech_create,
    		$person_list_create
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('person_create' in $$props) $$invalidate(0, person_create = $$props.person_create);
    		if ('which_tech_create' in $$props) $$invalidate(2, which_tech_create = $$props.which_tech_create);
    		if ('list_of_tech' in $$props) $$invalidate(9, list_of_tech = $$props.list_of_tech);
    		if ('list_of_tech_view' in $$props) $$invalidate(10, list_of_tech_view = $$props.list_of_tech_view);
    		if ('data_start' in $$props) $$invalidate(3, data_start = $$props.data_start);
    		if ('data_end' in $$props) $$invalidate(4, data_end = $$props.data_end);
    		if ('project_name' in $$props) $$invalidate(5, project_name = $$props.project_name);
    		if ('error_message_create' in $$props) $$invalidate(6, error_message_create = $$props.error_message_create);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		person_create,
    		data,
    		which_tech_create,
    		data_start,
    		data_end,
    		project_name,
    		error_message_create,
    		$tech_create,
    		$person_list_create,
    		list_of_tech,
    		list_of_tech_view,
    		create,
    		input_change_handler,
    		$$binding_groups,
    		input_change_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Create extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { data: 1, person_create: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
    			console.warn("<Create> was created without expected prop 'data'");
    		}

    		if (/*person_create*/ ctx[0] === undefined && !('person_create' in props)) {
    			console.warn("<Create> was created without expected prop 'person_create'");
    		}
    	}

    	get data() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get person_create() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set person_create(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\filter.svelte generated by Svelte v3.44.1 */
    const file$2 = "src\\filter.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[24] = list;
    	child_ctx[25] = i;
    	return child_ctx;
    }

    // (76:4) {:else}
    function create_else_block$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Select view tables to see filters";
    			attr_dev(h3, "class", "info svelte-1atyykp");
    			add_location(h3, file$2, 76, 4, 2072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(76:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if !which_mode}
    function create_if_block$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let input0;
    	let t1;
    	let input1;
    	let t2;
    	let input2;
    	let t3;
    	let t4;
    	let input3;
    	let t5;
    	let h3;
    	let t6;
    	let mounted;
    	let dispose;
    	let each_value = /*techs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tech*/ ctx[23];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*$which_elem_is_editing*/ ctx[9] == "properties") return create_if_block_1$1;
    		if (/*$which_elem_is_editing*/ ctx[9] == "mark") return create_if_block_2$1;
    		if (/*$which_elem_is_editing*/ ctx[9] == "date") return create_if_block_3$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			input2 = element("input");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			input3 = element("input");
    			t5 = space();
    			h3 = element("h3");
    			t6 = text(/*error*/ ctx[0]);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "class", "svelte-1atyykp");
    			add_location(input0, file$2, 63, 4, 1465);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-1atyykp");
    			add_location(input1, file$2, 64, 4, 1519);
    			attr_dev(input2, "type", "submit");
    			input2.value = "filter";
    			attr_dev(input2, "class", "svelte-1atyykp");
    			add_location(input2, file$2, 65, 4, 1569);
    			attr_dev(input3, "type", "submit");
    			input3.value = "edit";
    			attr_dev(input3, "class", "svelte-1atyykp");
    			add_location(input3, file$2, 73, 4, 1956);
    			attr_dev(h3, "class", "error svelte-1atyykp");
    			add_location(h3, file$2, 74, 4, 2023);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*max_results*/ ctx[8]);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*min_avg*/ ctx[7]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input2, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input3, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "click", /*filter_values*/ ctx[11], false, false, false),
    					listen_dev(input3, "click", /*edit_and_save*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*techs_view, techs, tech_in_use, selected_techs*/ 108) {
    				each_value = /*techs*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, destroy_block, create_each_block$1, t0, get_each_context$1);
    			}

    			if (dirty & /*max_results*/ 256 && to_number(input0.value) !== /*max_results*/ ctx[8]) {
    				set_input_value(input0, /*max_results*/ ctx[8]);
    			}

    			if (dirty & /*min_avg*/ 128 && to_number(input1.value) !== /*min_avg*/ ctx[7]) {
    				set_input_value(input1, /*min_avg*/ ctx[7]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t4.parentNode, t4);
    				}
    			}

    			if (dirty & /*error*/ 1) set_data_dev(t6, /*error*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t3);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(54:4) {#if !which_mode}",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#each techs as tech, i (tech)}
    function create_each_block$1(key_1, ctx) {
    	let input;
    	let input_value_value;
    	let t0;
    	let t1_value = /*techs_view*/ ctx[3][/*i*/ ctx[25]] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[12].call(input, /*i*/ ctx[25]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			input.__value = input_value_value = /*tech*/ ctx[23];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-1atyykp");
    			/*$$binding_groups*/ ctx[13][0].push(input);
    			add_location(input, file$2, 55, 8, 1264);
    			this.first = input;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*tech_in_use*/ ctx[5][/*i*/ ctx[25]];
    			input.checked = ~/*selected_techs*/ ctx[6].indexOf(input.__value);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*techs*/ 4 && input_value_value !== (input_value_value = /*tech*/ ctx[23])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*tech_in_use, techs*/ 36) {
    				input.checked = /*tech_in_use*/ ctx[5][/*i*/ ctx[25]];
    			}

    			if (dirty & /*selected_techs*/ 64) {
    				input.checked = ~/*selected_techs*/ ctx[6].indexOf(input.__value);
    			}

    			if (dirty & /*techs_view, techs*/ 12 && t1_value !== (t1_value = /*techs_view*/ ctx[3][/*i*/ ctx[25]] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[13][0].splice(/*$$binding_groups*/ ctx[13][0].indexOf(input), 1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(55:4) {#each techs as tech, i (tech)}",
    		ctx
    	});

    	return block;
    }

    // (71:48) 
    function create_if_block_3$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "date");
    			attr_dev(input, "class", "svelte-1atyykp");
    			add_location(input, file$2, 71, 8, 1897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*to_edit*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*to_edit*/ 16) {
    				set_input_value(input, /*to_edit*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(71:48) ",
    		ctx
    	});

    	return block;
    }

    // (69:47) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1atyykp");
    			add_location(input, file$2, 69, 8, 1793);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*to_edit*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*to_edit*/ 16 && to_number(input.value) !== /*to_edit*/ ctx[4]) {
    				set_input_value(input, /*to_edit*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(69:47) ",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#if $which_elem_is_editing == "properties"}
    function create_if_block_1$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1atyykp");
    			add_location(input, file$2, 67, 8, 1692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*to_edit*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[16]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*to_edit*/ 16 && input.value !== /*to_edit*/ ctx[4]) {
    				set_input_value(input, /*to_edit*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(67:4) {#if $which_elem_is_editing == \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let header;

    	function select_block_type(ctx, dirty) {
    		if (!/*which_mode*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if_block.c();
    			attr_dev(header, "class", "svelte-1atyykp");
    			add_location(header, file$2, 52, 0, 1186);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			if_block.m(header, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(header, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if_block.d();
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
    	let $tech_update;
    	let $which_elem_is_editing;
    	validate_store(tech_update, 'tech_update');
    	component_subscribe($$self, tech_update, $$value => $$invalidate(20, $tech_update = $$value));
    	validate_store(which_elem_is_editing, 'which_elem_is_editing');
    	component_subscribe($$self, which_elem_is_editing, $$value => $$invalidate(9, $which_elem_is_editing = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter', slots, []);
    	const dispatch = createEventDispatcher();
    	let to_edit = 0;
    	let { error = "" } = $$props;
    	let { which_mode } = $$props;
    	let { techs = [] } = $$props;
    	let { techs_view = [] } = $$props;
    	let tech_in_use = [];
    	let selected_techs = [...techs];
    	let last = techs;
    	let min_avg;
    	let max_results;

    	function update_values(techs_val) {
    		if (last != techs_val) {
    			$$invalidate(5, tech_in_use = []);

    			$$invalidate(5, tech_in_use = techs_val.map(() => {
    				return true;
    			}));

    			$$invalidate(6, selected_techs = [...techs_val]);
    			set_store_value(tech_update, $tech_update = [...techs_val], $tech_update);
    		}

    		last = techs_val;
    	}

    	function edit_and_save() {
    		dispatch("edit", { value: to_edit });
    	}

    	function filter_values() {
    		dispatch("filter", {
    			max_results,
    			min_avg,
    			min_avg,
    			selected_techs,
    			selected_techs
    		});
    	}

    	const writable_props = ['error', 'which_mode', 'techs', 'techs_view'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler(i) {
    		tech_in_use[i] = this.checked;
    		selected_techs = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(5, tech_in_use);
    		$$invalidate(2, techs);
    		$$invalidate(6, selected_techs);
    	}

    	function input0_input_handler() {
    		max_results = to_number(this.value);
    		$$invalidate(8, max_results);
    	}

    	function input1_input_handler() {
    		min_avg = to_number(this.value);
    		$$invalidate(7, min_avg);
    	}

    	function input_input_handler() {
    		to_edit = this.value;
    		$$invalidate(4, to_edit);
    	}

    	function input_input_handler_1() {
    		to_edit = to_number(this.value);
    		$$invalidate(4, to_edit);
    	}

    	function input_input_handler_2() {
    		to_edit = this.value;
    		$$invalidate(4, to_edit);
    	}

    	$$self.$$set = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    		if ('which_mode' in $$props) $$invalidate(1, which_mode = $$props.which_mode);
    		if ('techs' in $$props) $$invalidate(2, techs = $$props.techs);
    		if ('techs_view' in $$props) $$invalidate(3, techs_view = $$props.techs_view);
    	};

    	$$self.$capture_state = () => ({
    		which_elem_is_editing,
    		tech_update,
    		createEventDispatcher,
    		dispatch,
    		to_edit,
    		error,
    		which_mode,
    		techs,
    		techs_view,
    		tech_in_use,
    		selected_techs,
    		last,
    		min_avg,
    		max_results,
    		update_values,
    		edit_and_save,
    		filter_values,
    		$tech_update,
    		$which_elem_is_editing
    	});

    	$$self.$inject_state = $$props => {
    		if ('to_edit' in $$props) $$invalidate(4, to_edit = $$props.to_edit);
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    		if ('which_mode' in $$props) $$invalidate(1, which_mode = $$props.which_mode);
    		if ('techs' in $$props) $$invalidate(2, techs = $$props.techs);
    		if ('techs_view' in $$props) $$invalidate(3, techs_view = $$props.techs_view);
    		if ('tech_in_use' in $$props) $$invalidate(5, tech_in_use = $$props.tech_in_use);
    		if ('selected_techs' in $$props) $$invalidate(6, selected_techs = $$props.selected_techs);
    		if ('last' in $$props) last = $$props.last;
    		if ('min_avg' in $$props) $$invalidate(7, min_avg = $$props.min_avg);
    		if ('max_results' in $$props) $$invalidate(8, max_results = $$props.max_results);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*techs*/ 4) {
    			update_values(techs);
    		}
    	};

    	return [
    		error,
    		which_mode,
    		techs,
    		techs_view,
    		to_edit,
    		tech_in_use,
    		selected_techs,
    		min_avg,
    		max_results,
    		$which_elem_is_editing,
    		edit_and_save,
    		filter_values,
    		input_change_handler,
    		$$binding_groups,
    		input0_input_handler,
    		input1_input_handler,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2
    	];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			error: 0,
    			which_mode: 1,
    			techs: 2,
    			techs_view: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*which_mode*/ ctx[1] === undefined && !('which_mode' in props)) {
    			console.warn("<Filter> was created without expected prop 'which_mode'");
    		}
    	}

    	get error() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get which_mode() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set which_mode(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get techs() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set techs(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get techs_view() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set techs_view(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\tableData.svelte generated by Svelte v3.44.1 */
    const file$1 = "src\\tableData.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let t1_value = /*data*/ ctx[0].data_start + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4_value = /*data*/ ctx[0].name + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let t7_value = /*data*/ ctx[0].data_end + "";
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text("Starts: ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Name: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text("Ends: ");
    			t7 = text(t7_value);
    			attr_dev(div0, "class", "svelte-13indzo");
    			add_location(div0, file$1, 42, 4, 1021);
    			attr_dev(div1, "class", "svelte-13indzo");
    			add_location(div1, file$1, 50, 4, 1197);
    			attr_dev(div2, "class", "svelte-13indzo");
    			add_location(div2, file$1, 51, 4, 1231);
    			attr_dev(div3, "class", "table_data svelte-13indzo");
    			add_location(div3, file$1, 41, 0, 991);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			/*div0_binding*/ ctx[5](div0);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, t6);
    			append_dev(div2, t7);
    			/*div2_binding*/ ctx[7](div2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t1_value !== (t1_value = /*data*/ ctx[0].data_start + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*data*/ 1 && t4_value !== (t4_value = /*data*/ ctx[0].name + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*data*/ 1 && t7_value !== (t7_value = /*data*/ ctx[0].data_end + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*div0_binding*/ ctx[5](null);
    			/*div2_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
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
    	let $change_value;
    	let $which_elem_is_editing;
    	validate_store(change_value, 'change_value');
    	component_subscribe($$self, change_value, $$value => $$invalidate(4, $change_value = $$value));
    	validate_store(which_elem_is_editing, 'which_elem_is_editing');
    	component_subscribe($$self, which_elem_is_editing, $$value => $$invalidate(9, $which_elem_is_editing = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableData', slots, []);
    	let { data } = $$props;
    	let start_dom;
    	let end_dom;

    	function to_edit(property) {
    		if (!end_dom || !start_dom) {
    			return;
    		}

    		if ($change_value == property) {
    			set_store_value(change_value, $change_value = undefined, $change_value);
    		} else if (property) {
    			set_store_value(change_value, $change_value = property, $change_value);
    			set_store_value(which_elem_is_editing, $which_elem_is_editing = "date", $which_elem_is_editing);
    		}

    		if ($change_value == "start") {
    			set_store_value(change_value, $change_value = "start", $change_value);
    			$$invalidate(1, start_dom.style.color = "#888", start_dom);
    			$$invalidate(2, end_dom.style.color = "", end_dom);
    		} else if ($change_value == "end") {
    			set_store_value(change_value, $change_value = "end", $change_value);
    			$$invalidate(1, start_dom.style.color = "", start_dom);
    			$$invalidate(2, end_dom.style.color = "#888", end_dom);
    		} else {
    			$$invalidate(1, start_dom.style.color = "", start_dom);
    			$$invalidate(2, end_dom.style.color = "", end_dom);
    		}
    	}

    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableData> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			start_dom = $$value;
    			$$invalidate(1, start_dom);
    		});
    	}

    	const click_handler = () => {
    		to_edit("start");
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			end_dom = $$value;
    			$$invalidate(2, end_dom);
    		});
    	}

    	const click_handler_1 = () => {
    		to_edit("end");
    	};

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		change_value,
    		which_elem_is_editing,
    		data,
    		start_dom,
    		end_dom,
    		to_edit,
    		$change_value,
    		$which_elem_is_editing
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('start_dom' in $$props) $$invalidate(1, start_dom = $$props.start_dom);
    		if ('end_dom' in $$props) $$invalidate(2, end_dom = $$props.end_dom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$change_value*/ 16) {
    			(to_edit(false));
    		}
    	};

    	return [
    		data,
    		start_dom,
    		end_dom,
    		to_edit,
    		$change_value,
    		div0_binding,
    		click_handler,
    		div2_binding,
    		click_handler_1
    	];
    }

    class TableData extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableData",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<TableData> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<TableData>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<TableData>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\grid.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;

    const file = "src\\grid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (328:20) 
    function create_if_block_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "loading...";
    			attr_dev(div, "class", "loading svelte-s1w15e");
    			add_location(div, file, 328, 8, 10050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(328:20) ",
    		ctx
    	});

    	return block;
    }

    // (290:4) {#if !$load}
    function create_if_block_5(ctx) {
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let div1;
    	let p1;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_6, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*which_mode*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Create table";
    			t1 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "View tables";
    			t3 = space();
    			if_block.c();
    			attr_dev(p0, "class", "svelte-s1w15e");
    			add_location(p0, file, 299, 16, 9203);
    			attr_dev(div0, "class", "options svelte-s1w15e");
    			add_location(div0, file, 293, 12, 9043);
    			attr_dev(p1, "class", "svelte-s1w15e");
    			add_location(p1, file, 307, 16, 9417);
    			attr_dev(div1, "class", "options svelte-s1w15e");
    			add_location(div1, file, 301, 12, 9256);
    			attr_dev(div2, "class", "create_table svelte-s1w15e");
    			add_location(div2, file, 290, 8, 8941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div2, t3);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

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
    				if_block.m(div2, null);
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
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(290:4) {#if !$load}",
    		ctx
    	});

    	return block;
    }

    // (317:12) {:else}
    function create_else_block_2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*$projects_names*/ ctx[8];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*name*/ ctx[30]._id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Select:";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-s1w15e");
    			add_location(div0, file, 318, 20, 9697);
    			attr_dev(div1, "class", "on_tables svelte-s1w15e");
    			add_location(div1, file, 317, 16, 9652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*change_projects, $projects_names*/ 8448) {
    				each_value = /*$projects_names*/ ctx[8];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(317:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (310:12) {#if which_mode}
    function create_if_block_6(ctx) {
    	let create;
    	let current;

    	create = new Create({
    			props: {
    				data: /*data*/ ctx[3],
    				person_create: /*person_create*/ ctx[12]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create$1() {
    			create_component(create.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(create, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const create_changes = {};
    			if (dirty[0] & /*data*/ 8) create_changes.data = /*data*/ ctx[3];
    			create.$set(create_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(create.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(create.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(create, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(310:12) {#if which_mode}",
    		ctx
    	});

    	return block;
    }

    // (320:20) {#each $projects_names as name, i (name._id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let t0_value = /*name*/ ctx[30].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[19](/*name*/ ctx[30]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-s1w15e");
    			add_location(div, file, 320, 24, 9808);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$projects_names*/ 256 && t0_value !== (t0_value = /*name*/ ctx[30].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(320:20) {#each $projects_names as name, i (name._id)}",
    		ctx
    	});

    	return block;
    }

    // (349:49) 
    function create_if_block_3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_4(ctx, dirty) {
    		if (/*$tech_create*/ ctx[10].length && /*$person_list_create*/ ctx[11].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_4(ctx);
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
    			current_block_type_index = select_block_type_4(ctx);

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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(349:49) ",
    		ctx
    	});

    	return block;
    }

    // (346:50) 
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "loading...";
    			attr_dev(div, "class", "loading svelte-s1w15e");
    			add_location(div, file, 346, 12, 10772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(346:50) ",
    		ctx
    	});

    	return block;
    }

    // (332:8) {#if selected_project && !load_project && !which_mode}
    function create_if_block(ctx) {
    	let tabledata;
    	let t;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	tabledata = new TableData({
    			props: { data: /*after_filter*/ ctx[2] },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*tech_list_in_use*/ ctx[6].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tabledata.$$.fragment);
    			t = space();
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "table");
    			add_location(div, file, 334, 12, 10300);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabledata, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabledata_changes = {};
    			if (dirty[0] & /*after_filter*/ 4) tabledata_changes.data = /*after_filter*/ ctx[2];
    			tabledata.$set(tabledata_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

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
    			transition_in(tabledata.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabledata.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabledata, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(332:8) {#if selected_project && !load_project && !which_mode}",
    		ctx
    	});

    	return block;
    }

    // (352:12) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Select technologies and people";
    			attr_dev(div, "class", "loading svelte-s1w15e");
    			add_location(div, file, 352, 16, 11116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(352:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (350:12) {#if $tech_create.length && $person_list_create.length}
    function create_if_block_4(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				data: /*data*/ ctx[3],
    				tech_create: /*$tech_create*/ ctx[10],
    				person_list: /*$person_list_create*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty[0] & /*data*/ 8) table_changes.data = /*data*/ ctx[3];
    			if (dirty[0] & /*$tech_create*/ 1024) table_changes.tech_create = /*$tech_create*/ ctx[10];
    			if (dirty[0] & /*$person_list_create*/ 2048) table_changes.person_list = /*$person_list_create*/ ctx[11];
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(350:12) {#if $tech_create.length && $person_list_create.length}",
    		ctx
    	});

    	return block;
    }

    // (342:16) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No results";
    			attr_dev(div, "class", "loading svelte-s1w15e");
    			add_location(div, file, 342, 20, 10626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(342:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (336:16) {#if tech_list_in_use.length}
    function create_if_block_1(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				data: /*project_data*/ ctx[1],
    				tech_create: /*tech_list_in_use*/ ctx[6],
    				person_list: /*after_filter*/ ctx[2].persons
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty[0] & /*project_data*/ 2) table_changes.data = /*project_data*/ ctx[1];
    			if (dirty[0] & /*tech_list_in_use*/ 64) table_changes.tech_create = /*tech_list_in_use*/ ctx[6];
    			if (dirty[0] & /*after_filter*/ 4) table_changes.person_list = /*after_filter*/ ctx[2].persons;
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(336:16) {#if tech_list_in_use.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let filter;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let div0;
    	let show_if;
    	let current_block_type_index_1;
    	let if_block1;
    	let current;

    	filter = new Filter({
    			props: {
    				which_mode: /*which_mode*/ ctx[7],
    				error: /*error_message_filter*/ ctx[5],
    				techs_view: /*project_data*/ ctx[1].tech_list_view,
    				techs: /*project_data*/ ctx[1].tech_list
    			},
    			$$inline: true
    		});

    	filter.$on("edit", /*save_changes*/ ctx[14]);
    	filter.$on("filter", /*filter_values*/ ctx[15]);
    	const if_block_creators = [create_if_block_5, create_if_block_7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$load*/ ctx[9]) return 0;
    		if (/*$load*/ ctx[9]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const if_block_creators_1 = [create_if_block, create_if_block_2, create_if_block_3];
    	const if_blocks_1 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*selected_project*/ ctx[0] && !/*load_project*/ ctx[4] && !/*which_mode*/ ctx[7]) return 0;
    		if (/*selected_project*/ ctx[0] && !/*which_mode*/ ctx[7]) return 1;
    		if (show_if == null || dirty[0] & /*data*/ 8) show_if = !!/*data*/ ctx[3].hasOwnProperty("persons");
    		if (show_if) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index_1 = select_block_type_2(ctx, [-1, -1]))) {
    		if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(filter.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "flexbox svelte-s1w15e");
    			add_location(div0, file, 330, 4, 10104);
    			attr_dev(div1, "class", "on_content svelte-s1w15e");
    			add_location(div1, file, 288, 0, 8889);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(filter, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (~current_block_type_index_1) {
    				if_blocks_1[current_block_type_index_1].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filter_changes = {};
    			if (dirty[0] & /*which_mode*/ 128) filter_changes.which_mode = /*which_mode*/ ctx[7];
    			if (dirty[0] & /*error_message_filter*/ 32) filter_changes.error = /*error_message_filter*/ ctx[5];
    			if (dirty[0] & /*project_data*/ 2) filter_changes.techs_view = /*project_data*/ ctx[1].tech_list_view;
    			if (dirty[0] & /*project_data*/ 2) filter_changes.techs = /*project_data*/ ctx[1].tech_list;
    			filter.$set(filter_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div1, t1);
    				} else {
    					if_block0 = null;
    				}
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_2(ctx, dirty);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if (~current_block_type_index_1) {
    					if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    						if_blocks_1[previous_block_index_1] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index_1) {
    					if_block1 = if_blocks_1[current_block_type_index_1];

    					if (!if_block1) {
    						if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filter.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filter.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filter, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (~current_block_type_index_1) {
    				if_blocks_1[current_block_type_index_1].d();
    			}
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
    	let $change_value;
    	let $which_elem_is_editing;
    	let $tech_update;
    	let $tech_view;
    	let $mark_props;
    	let $projects_names;
    	let $load;
    	let $tech_create;
    	let $person_list_create;
    	validate_store(change_value, 'change_value');
    	component_subscribe($$self, change_value, $$value => $$invalidate(20, $change_value = $$value));
    	validate_store(which_elem_is_editing, 'which_elem_is_editing');
    	component_subscribe($$self, which_elem_is_editing, $$value => $$invalidate(21, $which_elem_is_editing = $$value));
    	validate_store(tech_update, 'tech_update');
    	component_subscribe($$self, tech_update, $$value => $$invalidate(22, $tech_update = $$value));
    	validate_store(tech_view, 'tech_view');
    	component_subscribe($$self, tech_view, $$value => $$invalidate(23, $tech_view = $$value));
    	validate_store(mark_props, 'mark_props');
    	component_subscribe($$self, mark_props, $$value => $$invalidate(24, $mark_props = $$value));
    	validate_store(projects_names, 'projects_names');
    	component_subscribe($$self, projects_names, $$value => $$invalidate(8, $projects_names = $$value));
    	validate_store(load, 'load');
    	component_subscribe($$self, load, $$value => $$invalidate(9, $load = $$value));
    	validate_store(tech_create, 'tech_create');
    	component_subscribe($$self, tech_create, $$value => $$invalidate(10, $tech_create = $$value));
    	validate_store(person_list_create, 'person_list_create');
    	component_subscribe($$self, person_list_create, $$value => $$invalidate(11, $person_list_create = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let list_of_tech = ["javascript", "java", "python", "c_sharp"];
    	let list_of_tech_view = ["Javascript", "Java", "Python", "C#"];
    	let person_create = [];
    	let selected_project;
    	let project_data = [];
    	let after_filter = [];
    	let data = [];
    	let load_project = false;
    	let project_name = "";
    	let error_message_filter = "";
    	let data_start = "2021-11-01";
    	let data_end = "2021-11-01";
    	let tech_list_in_use = [];
    	let which_mode = true;

    	onMount(() => {
    		//załadowanie tabeli do tworzenia innych tabel
    		fetch("http://localhost:3000/").then(response => response.json()).then(data_org => {
    			set_store_value(load, $load = false, $load);
    			$$invalidate(3, data = data_org[0]);

    			data_org[0].persons.forEach(() => {
    				person_create.push(false);
    			});
    		});

    		//załadowanie pozostałych tabel do edycji i podglądu
    		fetch("http://localhost:3000/projects").then(response => response.json()).then(data_org => {
    			set_store_value(projects_names, $projects_names = data_org, $projects_names);
    		});
    	});

    	//zmiana lub wybor tabeli z "View table"
    	function change_projects(name) {
    		$$invalidate(0, selected_project = name);
    		$$invalidate(4, load_project = true);

    		fetch(`http://localhost:3000/projects/${selected_project}`).then(response => response.json()).then(data_org => {
    			$$invalidate(4, load_project = false);
    			$$invalidate(1, project_data = data_org[0]);
    			$$invalidate(2, after_filter = JSON.parse(JSON.stringify(project_data)));
    			$$invalidate(6, tech_list_in_use = project_data.tech_list);
    		});
    	}

    	//zapisanie do bazy danych i lokalnie zmian w tabelach
    	function save_changes(e) {
    		$$invalidate(5, error_message_filter = "");

    		if ($which_elem_is_editing == "mark") {
    			//walidacja ocen
    			if (e.detail.value < 0 || e.detail.value > 5 || !e.detail.value) {
    				$$invalidate(5, error_message_filter = "Value must be between 0 and 5");
    				return;
    			}

    			let value_index = project_data.persons.map(e => e._id).indexOf($mark_props[0].toString());

    			//zmiana w lokalnych zmiennych
    			$$invalidate(1, project_data.persons[value_index][$mark_props[1]] = e.detail.value, project_data);

    			$$invalidate(2, after_filter.persons[value_index][$mark_props[1]] = e.detail.value, after_filter);

    			const requestOptions = {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({
    					value: e.detail.value,
    					person_id: $mark_props[0],
    					tech: $mark_props[1],
    					name: project_data.name
    				})
    			};

    			//zapis do bazy danych zmian
    			fetch("http://localhost:3000/change-mark/", requestOptions).then(response => response.json()).then(data_org => {
    				if (data_org.res == "y") {
    					console.log("Działa");
    				} else {
    					console.log("Błąd!");
    				}
    			});
    		} else if ($which_elem_is_editing == "properties") {
    			//walidacja wierszy
    			if (!e.detail.value) {
    				$$invalidate(5, error_message_filter = "Value can't be empty");
    				return;
    			}

    			if (project_data.tech_list_view.indexOf(e.detail.value) != -1) {
    				$$invalidate(5, error_message_filter = "Value cannot be repeated");
    				return;
    			}

    			let old_value = $tech_view;

    			//zmiana w lokalnych zmiennych
    			$$invalidate(1, project_data.tech_list_view[project_data.tech_list_view.indexOf($tech_view)] = e.detail.value, project_data);

    			$$invalidate(2, after_filter.tech_list_view[after_filter.tech_list_view.indexOf($tech_view)] = e.detail.value, after_filter);

    			tech_list_in_use.forEach((value, i) => {
    				$tech_update.forEach(new_value => {
    					if (tech_list_in_use[i] == new_value) {
    						$$invalidate(6, tech_list_in_use[i] = new_value, tech_list_in_use);
    					}
    				});
    			});

    			$$invalidate(6, tech_list_in_use);

    			const requestOptions = {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({
    					value: e.detail.value,
    					old_value,
    					name: project_data.name
    				})
    			};

    			//zapis do bazy danych zmian
    			fetch("http://localhost:3000/change-tech-view/", requestOptions).then(response => response.json()).then(data_org => {
    				if (data_org.res == "y") {
    					console.log("Działa");
    				} else {
    					console.log("Błąd!");
    				}
    			});
    		} else if ($which_elem_is_editing == "date") {
    			//walidacja daty zaczęcia i końca
    			if (!e.detail.value) {
    				$$invalidate(5, error_message_filter = "Value can't be empty");
    				return;
    			}

    			//zmiana w lokalnych zmiennych
    			if ($change_value == "start") {
    				$$invalidate(2, after_filter.data_start = e.detail.value, after_filter);
    			} else if ($change_value == "end") {
    				$$invalidate(2, after_filter.data_end = e.detail.value, after_filter);
    			}

    			const requestOptions = {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({
    					value: e.detail.value,
    					end_or_start: $change_value,
    					name: project_data.name
    				})
    			};

    			//zapis do bazy danych zmian
    			fetch("http://localhost:3000/change-tech-view/", requestOptions).then(response => response.json()).then(data_org => {
    				if (data_org.res == "y") {
    					console.log("Działa");
    				} else {
    					console.log("Błąd!");
    				}
    			});
    		}
    	}

    	//filtrowanie tabel edycji i podgladu
    	function filter_values(e) {
    		const max_results = e.detail.max_results;
    		const min_avg = e.detail.min_avg;

    		//sortowanie z inputow
    		if (tech_list_in_use.length == e.detail.selected_techs.length) {
    			$$invalidate(6, tech_list_in_use = e.detail.selected_techs);
    		} else {
    			$$invalidate(6, tech_list_in_use = e.detail.selected_techs.reverse());
    		}

    		$$invalidate(2, after_filter = JSON.parse(JSON.stringify(project_data)));

    		//filtr minimalnej sredniej
    		let index_to_remove = [];

    		if (min_avg !== undefined && min_avg !== null && min_avg >= 0) {
    			after_filter.persons.forEach((element, i) => {
    				let sum = 0;

    				tech_list_in_use.forEach(elem => {
    					sum += element[elem];
    				});

    				if (sum / tech_list_in_use.length < min_avg) {
    					index_to_remove.push(i);
    				}
    			});

    			while (index_to_remove.length) {
    				after_filter.persons.splice(index_to_remove.pop(), 1);
    			}
    		}

    		//filtr ilości osób
    		if (max_results !== null && max_results !== undefined && max_results >= 0 && after_filter.persons.length >= max_results) {
    			$$invalidate(2, after_filter.persons.length = max_results, after_filter);
    		}
    	}

    	//zmiana z zapisywanie tabel do edycji tabel
    	function toggle(value) {
    		$$invalidate(7, which_mode = value);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		toggle(true);
    	};

    	const click_handler_1 = () => {
    		toggle(false);
    	};

    	const click_handler_2 = name => change_projects(name.name);

    	$$self.$capture_state = () => ({
    		Table,
    		Create,
    		Filter,
    		TableData,
    		onMount,
    		mark_props,
    		which_elem_is_editing,
    		person_list_create,
    		tech_view,
    		tech_update,
    		change_value,
    		tech_create,
    		projects_names,
    		load,
    		list_of_tech,
    		list_of_tech_view,
    		person_create,
    		selected_project,
    		project_data,
    		after_filter,
    		data,
    		load_project,
    		project_name,
    		error_message_filter,
    		data_start,
    		data_end,
    		tech_list_in_use,
    		which_mode,
    		change_projects,
    		save_changes,
    		filter_values,
    		toggle,
    		$change_value,
    		$which_elem_is_editing,
    		$tech_update,
    		$tech_view,
    		$mark_props,
    		$projects_names,
    		$load,
    		$tech_create,
    		$person_list_create
    	});

    	$$self.$inject_state = $$props => {
    		if ('list_of_tech' in $$props) list_of_tech = $$props.list_of_tech;
    		if ('list_of_tech_view' in $$props) list_of_tech_view = $$props.list_of_tech_view;
    		if ('person_create' in $$props) $$invalidate(12, person_create = $$props.person_create);
    		if ('selected_project' in $$props) $$invalidate(0, selected_project = $$props.selected_project);
    		if ('project_data' in $$props) $$invalidate(1, project_data = $$props.project_data);
    		if ('after_filter' in $$props) $$invalidate(2, after_filter = $$props.after_filter);
    		if ('data' in $$props) $$invalidate(3, data = $$props.data);
    		if ('load_project' in $$props) $$invalidate(4, load_project = $$props.load_project);
    		if ('project_name' in $$props) project_name = $$props.project_name;
    		if ('error_message_filter' in $$props) $$invalidate(5, error_message_filter = $$props.error_message_filter);
    		if ('data_start' in $$props) data_start = $$props.data_start;
    		if ('data_end' in $$props) data_end = $$props.data_end;
    		if ('tech_list_in_use' in $$props) $$invalidate(6, tech_list_in_use = $$props.tech_list_in_use);
    		if ('which_mode' in $$props) $$invalidate(7, which_mode = $$props.which_mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected_project,
    		project_data,
    		after_filter,
    		data,
    		load_project,
    		error_message_filter,
    		tech_list_in_use,
    		which_mode,
    		$projects_names,
    		$load,
    		$tech_create,
    		$person_list_create,
    		person_create,
    		change_projects,
    		save_changes,
    		filter_values,
    		toggle,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.1 */

    function create_fragment(ctx) {
    	let grid;
    	let current;
    	grid = new Grid({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
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

    	$$self.$capture_state = () => ({ Grid });
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
