<script>
    import { change_value, mark_props,which_elem_is_editing } from "./store.js";
    export let mark;
    export let tech;
    export let person_id;
    let bg_color;

    $: if (mark <= 1) {
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

    let dom_element;

    let color_table = [
        ["hsl(0, 100%, ", "hsl(0, 100%, "],
        ["hsl(17, 100%, ", "hsl(19, 100%, "],
        ["hsl(51, 100%, ", "hsl(59, 91%, "],
        ["hsl(86, 100%, ", "hsl(91, 100%, "],
        ["hsl(125, 100%, ", "hsl(120, 100%, "],
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
            dom_element.style.backgroundColor = "";
            dom_element.style.borderColor = "";
            return;
        }

        //animacja

        dom_element.style.backgroundColor =
            color_table[color_in_hsl_index][0] + lightness[0].toString() + "%)";
        dom_element.style.borderColor =
            color_table[color_in_hsl_index][1] + lightness[1].toString() + "%)";

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
            dom_element.style.backgroundColor = "";
            dom_element.style.borderColor = "";
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
            $change_value = dom_element;
            $mark_props = [person_id, tech];
            $which_elem_is_editing = "mark";
        } else {
            $change_value = undefined;
            $mark_props = [];
        }
    }
</script>

<div on:click={edit} bind:this={dom_element} class="mark_box {bg_color}">
    <p>{mark.toFixed(1)}</p>
</div>

<style>
    .mark_box {
        width: 90px;
        height: 90px;
        color: rgb(255, 255, 255);
        font-weight: 700;
        font-size: 36px;
        border-radius: 20px;
        box-sizing: border-box;
        border: solid 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin: 10px 0;
    }

    .verylow {
        background-color: hsl(0, 100%, 63%);
        border-color: hsl(0, 100%, 70%);
    }

    .low {
        background-color: hsl(17, 100%, 63%);
        border-color: hsl(19, 100%, 70%);
    }

    .medium {
        background-color: hsl(51, 100%, 63%);
        border-color: hsl(59, 91%, 68%);
    }

    .high {
        background-color: hsl(86, 100%, 65%);
        border-color: hsl(91, 100%, 79%);
    }

    .veryhigh {
        background-color: hsl(125, 100%, 63%);
        border-color: hsl(120, 100%, 73%);
    }
</style>
