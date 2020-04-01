import React, {Fragment, useState} from "react";
import {TextField, Button, OutlinedInput, FormHelperText, Typography} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import { useForm } from 'react-hook-form';
// import {useAuth} from "../providers/auth/auth.provider";
import axios from 'axios';
// import {fetchUserFailure, fetchUserRequest, fetchUserSuccess, setIsAuthenticated} from '../providers/auth/auth.action';


const AuthForm = (props) => {
    const { handleSubmit, register, errors } = useForm();

    const emailValidator = {
        required: 'Email is required',
        pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address"
        }
    }

    const passwordValidator = {
        required: 'Password is required',
        minLength: {
            value: 6,
            message: "Password needs 6 characters at least"
        }
    }

    return (
        <form className={'form-group'} onSubmit={handleSubmit(props.onSubmit)}>
            <Typography variant='h6'>{props.title}</Typography>

            <FormHelperText error>{props.serverResponse}</FormHelperText><br />

            <TextField name="email" variant={'outlined'} type="text" label={props.input1}
                           inputRef={register(emailValidator)}
                           error={errors.email}
                           helperText={errors.email && errors.email.message}
            /><br/><br/>

            <TextField name="password" variant={'outlined'} type="password" placeholder={props.input2}
                       inputRef={register(passwordValidator)}
                       error={errors.password}
                       helperText={errors.password && errors.password.message}
            /><br/><br/>

            <Button color={'primary'} variant={'contained'} type={'submit'}> {props.submit}</Button>
        </form>
    )
};

const RedirectDiv = (props) => (
    <div>
        <p>{props.title}</p>
        <Link to={props.link}>{props.desc}</Link>
    </div>
)

const Signup = () => {
    // const auth = useAuth();
    // const {dispatchIsAuthenticated, dispatchUser} = auth;
    const history = useHistory();

    const [serverResponse, setServerResponse] = useState('');

    //Callback for the form submission after validation
    const onSubmit = values => {
        const {email, password} = values;
        console.log(email, password);

        // dispatchIsAuthenticated(setIsAuthenticated(true));

        //Make a request to backend
        const url = '/api/v1/auth/register'
        axios.post(url, {email, password})
            .then(res => {
                //If success to create a new account, redirect to login page
                if (res.data.success){
                    history.push('/login')
                } else {
                    setServerResponse(res.data.error);
                }

            })
            .catch(error => {
                setServerResponse(error.response.data.error);
                console.log('rrrrrrrrrrrrrrrrr',error.response.data.error);
            });

    };

    return (
        <Fragment>
            <AuthForm title="Sign up to Kanban" input1="Enter email" input2="Create Password" submit="Sign up"
                      onSubmit={onSubmit}
                      serverResponse={serverResponse}/>
            <RedirectDiv title={'Already have an account?'} link={'/login'} desc={'Login'}/>
        </Fragment>
    )
}

export {
    Signup,
    AuthForm,
    RedirectDiv
};