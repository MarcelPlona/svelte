<script>
   
    import { lang_list, min_avg_f, max_result } from "./stores.js";


    let visible = [true, true, true, true];
    let lang = ["javascript", "python", "c_sharp", "java"];
    let lang_text = ["Javascript", "Python", "C#", "Java"];
    let filtr_users_number;
    let min_avg;

    let selected = lang;

    //zapisywanie filtrów do writable

    $: max_result.set(filtr_users_number);
    $: min_avg_f.set(min_avg);
    $: lang_list.set(lang);

</script>

<header>
    <div class="checkboxes">
        {#each selected as lan, i (lan)}
            <label>
                <input
                    type="checkbox"
                    bind:group={lang}
                    bind:checked={visible[i]}
                    value={lan}
                />
                <span>{lang_text[i]}</span>
            </label>
        {/each}
    </div>
    <input placeholder="Maks wyników" bind:value={filtr_users_number} type="number" />
    <input placeholder="Min średnia" bind:value={min_avg} type="number" />
</header>

<style>
    header {
        width: 100%;
        height: 60px;
        background-color: rgb(236, 91, 38);
        left: 0;
        display: flex;
        position: fixed;
        align-items: center;
        padding-left: 30px;
    }

    .checkboxes label {
        display: inline-block;
        padding-right: 10px;
        white-space: nowrap;
        color:white;
        font-weight: 600;
        margin: 0 5px;
        font-size: 20px;
    }
    input[type=number]{
        margin:0 20px;
    }

    .checkboxes input {
        vertical-align: middle;
    }
    .checkboxes label span {
        vertical-align: middle;
    }
</style>
