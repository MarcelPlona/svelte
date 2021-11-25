<script>
    import { change_value, which_elem_is_editing } from "./store.js";
    export let data;

    let start_dom;
    let end_dom;

    function to_edit(property) {

        if(!end_dom || !start_dom){
            return;
        }
    
        if($change_value == property){
            $change_value = undefined;
        }
        else if(property){
            $change_value = property;
            $which_elem_is_editing = "date"
        }
        

        if ($change_value == "start") {
            $change_value = "start";
            start_dom.style.color = "#888";
            end_dom.style.color = "";
        } else if ($change_value == "end") {
            $change_value = "end";
            start_dom.style.color = "";
            end_dom.style.color = "#888";
        }
        else{
            start_dom.style.color = "";
            end_dom.style.color = "";
        }
    }

    $: $change_value, to_edit(false);

</script>

<div class="table_data">
    <div
        bind:this={start_dom}
        on:click={() => {
            to_edit("start", start_dom);
        }}
    >
        Starts: {data.data_start}
    </div>
    <div>Name: {data.name}</div>
    <div
        bind:this={end_dom}
        on:click={() => {
            to_edit("end", end_dom);
        }}
    >
        Ends: {data.data_end}
    </div>
</div>

<style>
    .table_data {
        width: 80vw;
        height: 100px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .table_data div {
        font-size: 30px;
        color: rgb(19, 3, 3);
        font-weight: 600;
    }
</style>
