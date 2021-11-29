<script>
    import Person from "./person.svelte";
    import Properties from "./properties.svelte";
    import Marks from "./mark.svelte";
    export let person;
    export let which_column;
    export let lang;
    export let techs_view;
    export let techs;

    let lang_names = [];
    
    //wyświetlania nazw wierszy

    function text(arr) {
        lang_names = [];
        arr.forEach((element) => {
          lang_names.push(techs_view[techs.indexOf(element)]);
        });
    }

    $: {
        text(lang);
    }
</script>

<div class="column">
    {#if which_column === "properties"}
        {#each lang_names as lan (lan)}
            <Properties lang={lan} />
        {/each}
    {:else if lang.length}
        <Person profile={person.img} />
        {#each lang as lan, i (lan)}
            <Marks tech={lan} person_id={person._id} mark={person[lan]} />
        {/each}
    {/if}
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
        margin: 0 1vw;
        position: relative;
        align-items: center;
        margin-top: 20px;
    }

    .column:last-of-type{
        margin-right: 20px;
    }
</style>
