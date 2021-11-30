<script>
    import { change_value, which_elem_is_editing } from "./store.js";
    export let data;

    let start_dom;
    let end_dom;

    let color_change = ['',''];

    function to_edit(property) {
        if (!end_dom || !start_dom) {
            return;
        }

        if ($change_value == property) {
            $change_value = undefined;
        } else if (property) {
            $change_value = property;
            $which_elem_is_editing = "date";
        }

        if ($change_value == "start") {
            color_change[0] = 'isActive';
            color_change[1] = '';
        } else if ($change_value == "end") {
            color_change[0] = '';
            color_change[1] = 'isActive';
        } else {
            color_change[0] = '';
            color_change[1] = '';
        }

    }

    $: $change_value, to_edit(false);
</script>

<div class="table_data">
    <div
        class="click {color_change[0]}"
        bind:this={start_dom}
        on:click={() => {
            to_edit("start", start_dom);
        }}
    >
        Starts: {data.data_start}
    </div>
    <div>Name: {data.name}</div>
    <div
        class="click {color_change[1]}"
        bind:this={end_dom}
        on:click={() => {
            to_edit("end", end_dom);
        }}
    >
        Ends: {data.data_end}
    </div>
</div>

<style>

    .isActive{
        color: #888;
    }

    .table_data {
        width:calc(100vw - 200px);
        margin: 0 auto;
        height: 3vw;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: fixed;
        top:60px;
        left:200px;
        background-color: rgb(255, 227, 168);
    }

    .click {
        cursor: pointer;
    }

    .table_data {
        font-size: 1.5vw;
        color: rgb(19, 3, 3);
        font-weight: 600;
    }
    @media only screen and (max-width: 800px) {

        .table_data{
            left:150px;
            width:calc(100vw - 150px);
        }
    }
</style>
