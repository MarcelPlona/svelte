<script>
        import Column from "./column.svelte";
        export let data;
        export let tech_create;
        export let person_list;
</script>

<div class="table">
    <Column
        techs={data.tech_list}
        techs_view={data.tech_list_view}
        lang={tech_create}
        which_column={"properties"}
    />
    {#each person_list as person, i (person._id)}
        <Column
            techs={data.tech_list}
            techs_view={data.tech_list_view}
            which_column={"values"}
            lang={tech_create}
            {person}
        />
    {/each}
</div>

<style>

.table {
        display: flex;
        margin-top: 20px;
    }

</style>