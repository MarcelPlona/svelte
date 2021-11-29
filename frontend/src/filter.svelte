<script>
    import { which_elem_is_editing, tech_update } from "./store.js";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let to_edit;
    export let error = "";
    export let which_mode;
    export let techs = [];
    export let techs_view = [];

    let tech_in_use = [];

    let selected_techs = [...techs];
    let last = techs;

    let min_avg;
    let max_results;

    function update_values(techs_val) {
        if (last != techs_val) {
            tech_in_use = [];
            tech_in_use = techs_val.map(() => {
                return true;
            });
            selected_techs = [...techs_val];
            $tech_update = [...techs_val];
        }
        last = techs_val;
    }

    $: update_values(techs);

    function edit_and_save() {
        dispatch("edit", {
            value: to_edit,
        });
    }

    function filter_values() {
        dispatch("filter", {
            max_results: max_results,
            min_avg,
            min_avg,
            selected_techs,
            selected_techs,
        });
    }
</script>

<header>
    {#if !which_mode}
        {#each techs as tech, i (tech)}
            <input
                type="checkbox"
                bind:checked={tech_in_use[i]}
                bind:group={selected_techs}
                value={tech}
            />
        <div>{techs_view[i]}</div>
        {/each}
        <input
            type="number"
            placeholder="Max results"
            bind:value={max_results}
        />
        <input type="number" placeholder="Min average" bind:value={min_avg} />
        <input type="submit" on:click={filter_values} value="filter" />
        {#if $which_elem_is_editing == "properties"}
            <input type="text" placeholder="new value" bind:value={to_edit} />
        {:else if $which_elem_is_editing == "mark"}
            <input type="number" placeholder="new value" bind:value={to_edit} />
        {:else if $which_elem_is_editing == "date"}
            <input type="date" placeholder="new value" bind:value={to_edit} />
        {/if}
        <input type="submit" on:click={edit_and_save} value="edit" />
        <h3 class="error">{error}</h3>
    {:else}
        <h3 class="info">Select view tables to see filters</h3>
    {/if}
</header>

<style>
    header {
        min-width: 100vw;
        height: 60px;
        background-color: rgb(236, 91, 38);
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2;
    }

    header input[type="number"] {
        width: 130px;
        height: 20px;
    }

    header input {
        margin-left: 40px;
    }

    header input[type="submit"] {
        width: 80px;
        height: 25px;
    }
    .error {
        color: rgb(165, 0, 0);
        padding: 0;
        margin: 0;
        margin-left: 20px;
    }
    .info {
        margin: 0 auto;
    }

    @media only screen and (max-width: 1200px) {
        header input[type="number"] {
            width: 80px;
            height: 16px;
            font-size: 10px;
        }

        header input[type="text"] {
            width: 80px;
            height: 16px;
            font-size: 10px;
        }

        header input[type="date"] {
            width: 80px;
            height: 16px;
            font-size: 10px;
        }

        header input {
            margin-left: 10px;
            font-size: 10px;
        }

        header div{
            font-size: 10px;
        }

        header input[type="checkbox"] {
            transform: scale(0.5);
        }

        header input[type="submit"] {
            width: 50px;
            height: 20px;
            font-size: 10px;
        }
        .error {
            font-size:15px;
            margin-left: 10px;
        }
    }


    @media only screen and (min-width: 2000px) {
        header input[type="number"] {
            width: 200px;
            height: 35px;
            font-size: 20px;
        }

        header input[type="text"] {
            width: 200px;
            height: 35px;
            font-size: 20px;
        }

        header input[type="date"] {
            width: 200px;
            height: 35px;
            font-size: 20px;
        }

        header input {
            margin-left: 20px;
            font-size: 20px;
        }

        header div{
            font-size: 20px;
        }

        header input[type="checkbox"] {
            transform: scale(1.5);
        }

        header input[type="submit"] {
            width: 150px;
            height: 40px;
            font-size: 20px;
        }
        .error {

            font-size:25px;
            margin-left: 20px;
        }
    }
</style>
