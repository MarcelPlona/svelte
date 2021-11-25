<script>
    import Column from "./column.svelte";
    import { lang_list, data_after_filtr, data } from "./stores.js";
    import { onMount } from "svelte";

    let after_filtr = [];
    let load = true;
    let lang = [];

    onMount(() => {
        fetch("http://giereczka.pl/api")
            .then((response) => response.json())
            .then((data2) => {
                data.set(data2);
                load = false;
                console.log("Fetch");
            });
    });

    $: lang = $lang_list;
    $: after_filtr = $data_after_filtr;

</script>

<div class="grid">
    {#if lang !== undefined && after_filtr !== undefined}
        {#if after_filtr.length > 0 && lang.length > 0}
            <Column which_column={"properties"} {lang} />
            {#each after_filtr as person (person._id)}
                <Column which_column={"values"} {lang} {person} />
            {/each}
        {:else if load == true}
            <p class="loading">Loading...</p>
        {:else}
            <p class="loading">No results...</p>
        {/if}
    {/if}
</div>

<style>
    .grid {
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
        margin-top: 100px;
        margin-right: 50px;
    }

    .loading {
        color: black;
        font-size: 40px;
        font-weight: 600;
        position: fixed;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -150%);
    }
</style>
