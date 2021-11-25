<script>
    import Person from "./person.svelte";
    import Properties from "./properties.svelte";
    import Marks from "./mark.svelte";
    export let person;
    export let which_column;
    export let lang;

    let lang_names = [];

    function text(arr) {
        lang_names = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "c_sharp") {
                lang_names.push("C#");
            } else {
                lang_names.push(
                    arr[i].charAt(0).toUpperCase() + arr[i].substr(1)
                );
            }
        }
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
    {:else}
        <Person profile={person.img} />
        {#each lang as lan (lan)}
            <Marks mark={person[lan]} />
        {/each}
    {/if}
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
        margin: 0 20px;
        position: relative;
        align-items: center;
    }
</style>
