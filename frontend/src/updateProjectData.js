
export const updateProjectData = (val,which_elem,name,change_value,tech_view,mark_props) => {
    let err;
    if(which_elem == "mark"){

        if (val < 0 || val > 5 || !val) {
            err = "Value must be between 0 and 5";
            return {value: {}, url:'change-mark/', err: err};
        }

        return {value: {value: val,person_id: mark_props[0], tech: mark_props[1],name:name}, url:'change-mark/', err: ''};
    }
    else if(which_elem == "properties"){

        if (!val) {
            err = "Value can't be empty";
            return {value:{},url:'change-tech-view/', err: err};
        }

        return {value:{value: val,old_value: tech_view,name:name}, url:'change-tech-view/', err: ''};
    }
    else if(which_elem == "date"){

        if (!val) {
            err = "Value can't be empty";
            return {value: {}, url:'change-tech-view/', err: err};
        }

        return {value: {value: val, end_or_start:change_value,name:name},url:'change-tech-view/', err: ''};
    }
    else{
        console.log("not valid value");
    }
    
}