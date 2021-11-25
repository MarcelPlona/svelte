import { writable,derived } from 'svelte/store';


export const data = writable([]);
export const lang_list = writable([]);
export const min_avg_f = writable(undefined);
export const max_result = writable(undefined);

//filtry

export const data_after_filtr = derived([data,lang_list,min_avg_f,max_result], ([dat,lang_lis, min_avg_,max_resul]) => {

    let persons_data = dat.slice();
    let after_filtr = persons_data.slice();

    let index_to_remove = [];

    //filtr minimalnej sredniej

    if (
        min_avg_ !== undefined &&
        min_avg_ !== null &&
        min_avg_ >= 0
    ) {
        for (let i = 0; i < after_filtr.length; i++) {
            let sum = 0;
            for (let j = 0; j < lang_lis.length; j++) {
                sum += after_filtr[i][lang_lis[j]];
            }
            console.log(sum / lang_lis.length);
            if (sum / lang_lis.length < min_avg_) {
                index_to_remove.push(i);
            }
        }

        while (index_to_remove.length) {
            after_filtr.splice(index_to_remove.pop(), 1);
        }
    }

    //filtr ilości osób

    if (
        max_resul !== null &&
        max_resul !== undefined &&
        max_resul >= 0 &&
        after_filtr.length >= max_resul
    ) {
        after_filtr.length = max_resul;
    }
    return after_filtr;
});