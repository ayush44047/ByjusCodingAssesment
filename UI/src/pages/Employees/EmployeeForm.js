import React, { useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../Hooks/useForm';

const initialFValues = {
    id: 0,
    fullName: '',
    email: '',    
    address: '',    
    joiningDate: new Date()    
}

export default function EmployeeForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "This field is required."
        if ('address' in fieldValues)
            temp.address = fieldValues.address ? "" : "This field is required."        
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="fullName"
                        label="Full Name"
                        value={values.fullName}
                        onChange={handleInputChange}
                        error={errors.fullName}
                    />
                    <Controls.Input
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />   
                </Grid>
                <Grid item xs={6}>                    
                    
                    <Controls.DatePicker
                        name="joiningDate"
                        label="Joining Date"
                        value={values.joiningDate}
                        onChange={handleInputChange}
                    />   
                    <Controls.Input
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleInputChange}
                    />  
                    <div>
                        <Controls.Button
                            type="submit"
                            text="Submit" />
                        <Controls.Button
                            text="Reset"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
