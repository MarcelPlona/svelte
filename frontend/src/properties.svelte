<script>
    import { change_value, tech_view,which_elem_is_editing } from "./store.js";
    export let lang;

    let dom_element;

    $: if($change_value != dom_element && dom_element != undefined){
        dom_element.style.backgroundColor = "";
    }

    //podświetlenie i dodanie wiersza do edycji

    function tech_view_edit(){
        if($change_value != dom_element){
            $tech_view = lang;
            dom_element.style.backgroundColor = "rgb(195, 50, 50)";
            $which_elem_is_editing = "properties";
            $change_value = dom_element;
        }
        else{
            dom_element.style.backgroundColor = "";
            $change_value = undefined;
        }
    }

</script>

<div on:click={tech_view_edit} bind:this={dom_element} class="properties">
    <h2 class="properties_text">{lang}</h2>
</div>

<style>
    .properties {
        padding: 0 20px;
        height: 60px;
        background-color: rgb(255, 70, 70);
        margin: 25px 0 ;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }

    .properties:first-of-type {
        margin-top:125px;
    }

    .properties_text {
        color: white;
    }
</style>
