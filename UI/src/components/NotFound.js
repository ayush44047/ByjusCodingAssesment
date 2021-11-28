import React from 'react'

import { Grid, makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({    
    textGrid: {
        display:'flex',
        width:'100%',
        alignItems :'center',
        justifyContent:'left'
    },
    imageGrid: {
        display:'flex',
        width:'100%',
        alignItems :'center',
        justifyContent:'center'
    },
    text: {
        textAlign:'center',
        width:'100%'  ,
        fontSize:'16px'      
    }
}))

export default function NotFound(props) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid className={classes.imageGrid} item xs={6}>
                <img src={process.env.PUBLIC_URL + './Assets/img/NotFound.jpg'} alt='Not found' />
            </Grid>
            <Grid className={classes.textGrid} item xs={6} >
                <div className={classes.text} >
                    <span>{props.title}</span>
                </div>
            </Grid>
        </Grid>
    )
}
