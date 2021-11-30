<script>
    import Table from "./table.svelte";
    import Create from "./create.svelte";
    import Filter from "./filter.svelte";
    import TableData from "./tableData.svelte";
    import { onMount } from "svelte";
    import {
        mark_props,
        which_elem_is_editing,
        person_list_create,
        tech_list_in_use,
        tech_view,
        tech_update,
        change_value,
        tech_create,
        projects_names,
        project_data,
        after_filter,
        load,
    } from "./store.js";

    let list_of_tech = ["javascript", "java", "python", "c_sharp"];
    let list_of_tech_view = ["Javascript", "Java", "Python", "C#"];

    let person_create = [];

    let selected_project;

    let data = [];
    let load_project = false;

    let project_name = "";

    let error_message_filter = "";

    let data_start = "2021-11-01";
    let data_end = "2021-11-01";

    let which_mode = true;

    onMount(() => {
        //załadowanie tabeli do tworzenia innych tabel

        fetch("http://giereczka.pl/api/")
            .then((response) => response.json())
            .then((data_org) => {
                $load = false;
                data = data_org[0];

                data_org[0].persons.forEach(() => {
                    person_create.push(false);
                });
            });

        //załadowanie pozostałych tabel do edycji i podglądu

        fetch("http://giereczka.pl/api/projects")
            .then((response) => response.json())
            .then((data_org) => {
                $projects_names = data_org;
            });
    });

    //zmiana lub wybor tabeli z "View table"

    function change_projects(name) {
        selected_project = name;
        load_project = true;
        fetch(`http://giereczka.pl/api/projects/${selected_project}`)
            .then((response) => response.json())
            .then((data_org) => {
                load_project = false;
                $project_data = data_org[0];
                $after_filter = Object.assign({}, data_org[0]);
                $after_filter.persons = [];
                data_org[0].persons.forEach((elem) => {
                    $after_filter.persons.push(elem);
                });

                $tech_list_in_use = $project_data.tech_list;
            });
    }

    //zapisanie do bazy danych i lokalnie zmian w tabelach

    function save_changes(e) {
        error_message_filter = "";
        console.log(e.detail.data);

        //walidacja

        if (e.detail.data.err) {
            error_message_filter = e.detail.data.err;
            return;
        } else {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(e.detail.data.value),
            };

            //zapis do bazy danych zmian

            fetch(
                `http://giereczka.pl/api/${e.detail.data.url}`,
                requestOptions
            )
                .then((response) => response.json())
                .then((data_org) => {
                    if (data_org.res == "y") {
                        console.log("Działa");
                    } else {
                        console.log("Błąd!");
                    }
                });
        }

   
    }

    //filtrowanie tabel edycji i podgladu

    function filter_values(e) {
        const max_results = e.detail.max_results;
        const min_avg = e.detail.min_avg;

        //sortowanie z inputow

        if ($tech_list_in_use.length == e.detail.selected_techs.length) {
            $tech_list_in_use = e.detail.selected_techs;
        } else {
            $tech_list_in_use = e.detail.selected_techs.reverse();
        }

        $after_filter = Object.assign({}, $project_data);
        $after_filter.persons = [];
        $project_data.persons.forEach((elem) => {
            $after_filter.persons.push(elem);
        });

        //filtr minimalnej sredniej

        let index_to_remove = [];

        if (min_avg !== undefined && min_avg !== null && min_avg >= 0) {
            $after_filter.persons.forEach((element, i) => {
                let sum = 0;
                $tech_list_in_use.forEach((elem) => {
                    sum += element[elem];
                });
                if (sum / $tech_list_in_use.length < min_avg) {
                    index_to_remove.push(i);
                }
            });

            while (index_to_remove.length) {
                $after_filter.persons.splice(index_to_remove.pop(), 1);
            }
        }

        //filtr ilości osób

        if (
            max_results !== null &&
            max_results !== undefined &&
            max_results >= 0 &&
            $after_filter.persons.length >= max_results
        ) {
            $after_filter.persons.length = max_results;
        }
    }

    //zmiana z zapisywanie tabel do edycji tabel

    function toggle(value) {
        which_mode = value;
    }
</script>

<Filter
    name={$project_data.name}
    {which_mode}
    error={error_message_filter}
    techs_view={$project_data.tech_list_view}
    techs={$project_data.tech_list}
    on:edit={save_changes}
    on:filter={filter_values}
/>

<div class="on_content">
    {#if !$load}
        <div class="create_table">
            <!-- Zmiana pomiędzy edycja a zapisywaniem -->
            <div
                class="options"
                on:click={() => {
                    toggle(true);
                }}
            >
                <p>Create table</p>
            </div>
            <div
                class="options"
                on:click={() => {
                    toggle(false);
                }}
            >
                <p>View tables</p>
            </div>
            {#if which_mode}
                <!-- formularz do tworzenia tabel -->

                <Create {data} {person_create} />
            {:else}
                <div class="on_tables">
                    <div>Select:</div>
                    {#each $projects_names as name, i (name._id)}
                        <div on:click={() => change_projects(name.name)}>
                            {name.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {:else if $load}
        <div class="loading">loading...</div>
    {/if}
</div>

{#if selected_project && !load_project && !which_mode}
    <div class="flexbox">
        <!-- Tabela do edycji i podglądu -->
        <TableData data={$after_filter} />
        {#if $tech_list_in_use.length && $after_filter.persons.length}
            <Table
                data={$project_data}
                tech_create={$tech_list_in_use}
                person_list={$after_filter.persons}
            />
        {:else}
            <div class="loading select_check">No results</div>
        {/if}
    </div>
{:else if selected_project && !which_mode}
    <div class="flexbox">
        <div class="loading ">loading...</div>
        <!-- Tabela podglądu do zapisawania -->
    </div>
{:else if data.hasOwnProperty("persons")}
    <div class="flexbox view">
        {#if $tech_create.length && $person_list_create.length}
            <Table
                {data}
                tech_create={$tech_create}
                person_list={$person_list_create}
            />
        {:else}
            <div class="loading select_check">
                Select technologies and people
            </div>
        {/if}
    </div>
{/if}

<style>
    .create_table {
        width: 200px;
        height: calc(100vh - 60px);
        background-color: chocolate;
        overflow-y: auto;
        position: fixed;
        top: 60px;
        left: 0;
    }

    .on_content {
        display: flex;
    }

    .options {
        width: 100%;
        background-color: white;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(228, 46, 0);
    }
    .options p {
        display: block;
        margin: 0;
        font-size: 18px;
    }

    .options:hover {
        background-color: rgb(223, 223, 223);
        color: rgb(255, 53, 2);
    }

    .options:first-of-type {
        border-bottom: 2px solid rgb(202, 202, 202);
    }

    .on_tables {
        width: 70%;
        height: auto;
        margin: 0 auto;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .on_tables div {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 600;
    }

    .flexbox {
        display: flex;
        position: fixed;
        top: calc(60px + 3vw);
        left: 200px;
        height: calc(100vh - 60px - 3vw);
        width: calc(100vw - 200px);
        overflow-x: auto;
    }

    .loading {
        margin: 0 auto;
        margin-top: 50vh;
        transform: translate(0, -50%);
        text-align: center;
        font-size: 3vw;
        font-weight: 700;
        z-index: 3;
    }

    .select_check {
        margin-top: calc(50vh - 60px);
        transform: translate(0, -50%);
        transform: none;
    }

    .view {
        top: 60px;
    }

    @media only screen and (max-width: 800px) {
        .create_table {
            width: 150px;
        }

        .on_tables div {
            margin-top: 3px;
            font-size: 15px;
            font-weight: 600;
        }

        .on_tables {
            margin-top: 10px;
        }

        .options p {
            font-size: 12px;
        }

        .options {
            height: 30px;
        }

        .flexbox {
            left: 150px;
            width: calc(100vw - 150px);
        }
    }
</style>
