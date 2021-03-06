import { writable } from 'svelte/store';


export const change_value = writable(undefined);
export const mark_props = writable([]);
export const tech_view = writable(undefined);
export const which_elem_is_editing = writable("mark");
export const tech_update = writable(undefined);
export const data_value = writable(undefined);
export const load = writable(true);
export const tech_create = writable([]);
export const person_list_create = writable([]);
export const projects_names = writable([]);
export const project_data = writable([]);
export const after_filter = writable([]);
export const tech_list_in_use = writable([]);
export const logged = writable("yes");
export const token = writable(undefined);