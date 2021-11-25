<script>
    import Column from "./column.svelte";
    import { loading, lang_list, data_after_filtr } from "./stores.js";

    let after_filtr = [];
    let load = true;
    let lang = [];

    loading.subscribe((_loading) => {
        load = _loading;
    });

    lang_list.subscribe((_lang_list) => {
        lang = _lang_list;
    });

    data_after_filtr.subscribe((_data_after_filtr) => {
        after_filtr =  _data_after_filtr;
    });

    console.log(lang);

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
