<script>
    import {
        logged,
        token,
        person_list_create,
        tech_list_in_use,
        tech_create,
        projects_names,
        project_data,
        after_filter,
        load,
        change_value,
        tech_update,
        tech_view,
        which_elem_is_editing,
        mark_props,
        data_value
    } from "./store";

    function logout() {
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $logged = "login";
        $token = undefined;
        $change_value = undefined;
        $mark_props = [];
        $tech_view = undefined;
        $which_elem_is_editing = "mark";
        $tech_update = undefined;
        $data_value = undefined;
        $load = true;
        $tech_create = [];
        $person_list_create = [];
        $projects_names = [];
        $project_data = [];
        $after_filter = [];
        $tech_list_in_use = [];
    }
</script>

<div class="logout" on:click={logout}>
    <p>Logout</p>
</div>

<style>
    .logout {
        width: 120px;
        height: 30px;
        padding: 10px;
        border-radius: 10px;
        font-size: 25px;
        text-align: center;
        color: white;
        background-color: rgb(224, 47, 47);
        position: fixed;
        right: 20px;
        bottom: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 4;
    }
</style>
