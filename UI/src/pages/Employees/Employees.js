import React, { useState, useEffect } from 'react'
import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../Hooks/useTable";
import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../components/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import NotFound from '../../components/NotFound';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    },
    notFoundToolBar: {
        width: '100%'
    },
    notFoundTxt: {
        width: '100%',
        textAlign: 'center'
    }
}))


const headCells = [
    { id: 'fullName', label: 'Employee Name' },
    { id: 'email', label: 'Email Address' },
    { id: 'address', label: 'Address' },
    { id: 'phone', label: 'Phone' },
    { id: 'joiningDate', label: 'Joining Date' },    
    { id: 'actions', label: 'Actions', disableSorting: true }

]

export default function Employees() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState()
    const [networkError, setNetworkError] = useState(null)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    useEffect(() => { getEmployees() }, []);

    const getEmployees = async () => {
        const response = await employeeService.getAllEmployees();
        console.log(response);
        if (response && response.status === 200) {
            setRecords(response.data);
        }
        else {
            setNetworkError(true);
        }
        console.log(networkError);
    }
    //console.log({records});

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.fullName.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = async (employee, resetForm) => {

        if (employee.id === 0) {
            const response = await employeeService.insertEmployee(employee);
            if (response && (response.status === 201 || response.status === 200)) {
                setRecords((existingRecords) => (
                    [...existingRecords, response.data]
                ))
                resetForm();
                setRecordForEdit(null);
                setOpenPopup(false);
                setNotify({
                    isOpen: true,
                    message: 'Details of ' + employee.fullName + ' inserted Successfully',
                    type: 'success'
                });
            }
            else {
                setNotify({
                    isOpen: true,
                    message: response?.data?.message ?? 'Some error occured',
                    type: 'success'
                });
            }
        }
        else {
            const response = await employeeService.updateEmployee(employee);
            if (response && response.status === 200) {
                setRecords((existingRecords) => {
                    var tempArray = [...existingRecords]
                    var index = tempArray.findIndex(record => record.id === response.data.id);
                    if (index !== -1) {
                        tempArray.splice(index, 1, employee);
                    }
                    return tempArray;
                })
                resetForm();
                setRecordForEdit(null);
                setOpenPopup(false);
                setNotify({
                    isOpen: true,
                    message: 'Details of ' + employee.fullName + ' updated Successfully',
                    type: 'success'
                });
            }
            else {
                setNotify({
                    isOpen: true,
                    message: response?.data?.message ?? 'Some error occured',
                    type: 'error'
                });
            }
        }


    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = async (id) => {

        const response = await employeeService.deleteEmployee(id);
        if (response && response.status === 200) {
            setConfirmDialog({
                ...confirmDialog,
                isOpen: false
            })
            setRecords((existingRecords) => {
                var tempArray = [...existingRecords];
                var index = tempArray.findIndex(record => record.id === id);
                if (index !== -1) tempArray.splice(index, 1);
                return tempArray;
            })

            setNotify({
                isOpen: true,
                message: 'Deleted Successfully',
                type: 'success'
            })
        }
        else {
            setNotify({
                isOpen: true,
                message: response?.data?.message ?? 'Some error occured',
                type: 'error'
            });
        }

    }

    return (
        <>
            <PageHeader
                title="Byjus Hiring Management System"
                subTitle="View and manage the new hirings"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                {
                    records && !networkError &&
                    <>
                        <Toolbar>
                            <Controls.Input
                                label="Search Employees"
                                className={classes.searchInput}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>)
                                }}
                                onChange={handleSearch}
                            />
                            <Controls.Button
                                text="Add New"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                className={classes.newButton}
                                onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                            />
                        </Toolbar>
                        {records?.length > 0 &&
                            <>
                                <TblContainer>
                                    <TblHead />
                                    <TableBody>
                                        {
                                            recordsAfterPagingAndSorting().map(item =>
                                            (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.fullName}</TableCell>
                                                    <TableCell>{item.email}</TableCell>
                                                    <TableCell>{item.address}</TableCell>
                                                    <TableCell>{item.phone}</TableCell>
                                                    <TableCell>{new Date(item.joiningDate).toDateString()}</TableCell>
                                                    <TableCell>
                                                        <Controls.ActionButton
                                                            color="primary"
                                                            onClick={() => { openInPopup(item) }}>
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </Controls.ActionButton>
                                                        <Controls.ActionButton
                                                            color="secondary"
                                                            onClick={() => {
                                                                setConfirmDialog({
                                                                    isOpen: true,
                                                                    title: 'Are you sure to delete this record?',
                                                                    subTitle: "You can't undo this operation",
                                                                    onConfirm: () => { onDelete(item.id) }
                                                                })
                                                            }}>
                                                            <CloseIcon fontSize="small" />
                                                        </Controls.ActionButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            )
                                        }
                                    </TableBody>
                                </TblContainer>
                                <TblPagination />
                            </>
                        }
                        {records?.length <= 0 &&
                            <Toolbar>
                                <NotFound title='No employees available. Please add employees to view the data.' />
                            </Toolbar>
                        }
                    </>
                }
                {
                    networkError &&
                    <NotFound title='We are currently facing network issues. Please come back later.' />
                }

            </Paper>
            <Popup
                title="Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit} />
            </Popup>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
