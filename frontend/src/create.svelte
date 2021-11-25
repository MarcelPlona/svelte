<script>
    import {
        load,
        tech_create,
        person_list_create
    } from "./store.js";

    export let data;
    export let person_create;
    let which_tech_create = [false, false, false, false];

    let list_of_tech = ["javascript", "java", "python", "c_sharp"];
    let list_of_tech_view = ["Javascript", "Java", "Python", "C#"];

    let data_start = "2021-11-01";
    let data_end = "2021-11-01";
    let project_name = "";

    let error_message_create = "";

    function create() {
        //tworzenie nowych tabel

        $load = true;
        error_message_create = "";

        //walidacja danych

        if (
            !project_name ||
            !data_start ||
            !data_end ||
            !($person_list_create.length && $tech_create.length)
        ) {
            error_message_create = "select the minimum number of fields!";
            $load = false;
            return;
        }

        //tworzenie tabeli osob z wybranymi technologiami

        let person_list_to_create = $person_list_create.map((person) => {
            return (person = [...$tech_create, "img", "_id", "name"].reduce(
                (new_obj, property) => {
                    return Object.assign(new_obj, {
                        [property]: person[property],
                    });
                },
                { [$tech_create[0]]: person[$tech_create[0]] }
            ));
        });

        const obj = {
            name: project_name,
            data_start: data_start,
            data_end: data_end,
            tech_list_view: ["Javascript", "Java", "Python", "C#"],
            tech_list: $tech_create,
            persons: person_list_to_create,
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: obj }),
        };

        //dodanie nowej tabeli

        fetch("http://localhost:3000/add/", requestOptions)
            .then((response) => response.json())
            .then((data_org) => {
                if (data_org.res == "y") {
                    $load = false;
                }
            });
    }
</script>

<h3 class="error">{error_message_create}</h3>
<div class="on_inputs">
    <div>Technology:</div>
    {#each list_of_tech as tech, i (list_of_tech[i])}
        <div>
            <input
                type="checkbox"
                bind:checked={which_tech_create[i]}
                bind:group={$tech_create}
                value={tech}
            />

            {list_of_tech_view[i]}
        </div>
    {/each}
    <div>Persons:</div>
    {#each data.persons as person, i (person._id)}
        <div>
            <input
                type="checkbox"
                bind:checked={person_create[i]}
                bind:group={$person_list_create}
                value={person}
            />

            {person.name}
        </div>
    {/each}
    <input type="text" placeholder="Tabele name" bind:value={project_name} />
    <h3>Starting date:</h3>
    <input type="date" bind:value={data_start} />
    <h3>End date:</h3>
    <input type="date" bind:value={data_end} />
    <input type="submit" value="Save" on:click={create} />
</div>

<style>
    .on_inputs {
        width: 70%;
        height: auto;
        margin: 0 auto;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .on_inputs input[type="text"] {
        margin-top: 20px;
    }

    .on_inputs input[type="submit"] {
        margin-top: 20px;
    }

    .error {
        color: rgb(165, 0, 0);
        text-align: center;
        padding: 0;
        margin: 0;
        margin-top: 10px;
    }
</style>
