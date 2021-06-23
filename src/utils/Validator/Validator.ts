import React from "react"
import UserService from "../../services/User"
import {
    EMAIL,
    MAX_LENGTH,
    MIN_LENGTH,
    PASSWORD_COMPLEXITY,
    PASSWORD_REPEAT,
    REQUIRED,
} from './types'

class Validator {
    userService = new UserService()
    errors: any
    setErrors: React.Dispatch<React.SetStateAction<any>>

    constructor(
        pErrors: any,
        pSetErrors: React.Dispatch<React.SetStateAction<any>>
    ) {
        this.errors = pErrors
        this.setErrors = pSetErrors
    }

    public validateForm(form: any): boolean {
        const data: any = {...this.errors}

        let errorsByElement: any = {}

        for (const key in this.errors) {
            data[key].validations.forEach(async (validation: any) => {
                if (!errorsByElement[key]) {
                    errorsByElement[key] = 0
                }

                if (validation.key === REQUIRED && form[key]?.length === 0) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        `Please enter your ${data[key].label}`
                    )
                } else if (
                    validation.key === MIN_LENGTH &&
                    form[key]?.length < validation.value
                ) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        `${data[key].label} should be at least ${validation.value} characters`
                    )
                } else if (
                    validation.key === MAX_LENGTH &&
                    form[key]?.length > validation.value
                ) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        `${data[key].label} cannot be longer than ${validation.value} characters`
                    )
                } else if (
                    validation.key === EMAIL &&
                    !/\S+@\S+\.\S+/.test(form[key])
                ) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        'Please enter your email address in format:\nyourname@example.com'
                    )
                } else if (
                    validation.key === PASSWORD_COMPLEXITY &&
                    !this.isPasswordStrong(form[key])
                ) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        `${data[key].label} is not strong`
                    )
                } else if (
                    validation.key === PASSWORD_REPEAT &&
                    form[validation.fields[0]] !== form[validation.fields[1]]
                ) {
                    this.setError(
                        errorsByElement,
                        key,
                        data,
                        `The passwords do not match`
                    )
                }

                if (
                    errorsByElement[key] === 0 &&
                    !data[key].message.includes('already exists')
                ) {
                    data[key].message = ''
                }
            })
        }

        this.setErrors(data)
        const values: number[] = Object.values(errorsByElement)
        return values.reduce((t, n) => t + n) === 0
    }

    isPasswordStrong(password: string) {
        let strength = 0

        strength += /[A-Z]+/.test(password) ? 1 : 0
        strength += /[a-z]+/.test(password) ? 1 : 0
        strength += /[0-9]+/.test(password) ? 1 : 0
        strength += /[\W]+/.test(password) ? 1 : 0

        return strength >= 3
    }

    setError(errorsByElement: any, key: any, data: any, message: any) {
        errorsByElement[key]++
        data[key].message = message
    }
}

export default Validator
