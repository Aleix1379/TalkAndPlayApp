import React, {useState} from 'react'
import {ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import TextInputComponent from "../../components/TextInputComponent"
import {ErrorType} from "../../utils/Validator/types"
import Validator from "../../utils/Validator/Validator"
import ButtonComponent from "../../components/ButtonComponent"
import ReportService from "../../services/ReportService"

interface ReportProperties {
    navigation: any
    theme: Theme
}

interface Errors {
    report: ErrorType
}

interface ReportForm {
    report: string
}

const ReportScreen: React.FC<ReportProperties> = ({theme, navigation}) => {
    const {type, id} = navigation.state.params
    const [untouched, setUntouched] = useState(true)
    const [form, setForm] = useState<ReportForm>({report: ''})
    const reportService = new ReportService()
    const styles = StyleSheet.create({
        report: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 8,
        },
        input: {
            marginTop: 32,
        }
    })

    const [errors, setFormErrors] = useState<Errors>({
        report: {
            message: '',
            touched: false,
            label: 'Details',
            validations: [
                {
                    key: 'REQUIRED'
                },
                {
                    key: 'MAX_LENGTH',
                    value: 2000
                }
            ]
        }
    })

    const validator = new Validator(errors, setFormErrors)

    const update = (id: string, value: string): void => {
        let data: ReportForm

        if (untouched) {
            setUntouched(false)
        }

        data = {...form}
        // @ts-ignore
        data[id] = value
        setForm(data)
        validator.validateForm({...data})

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
        setFormErrors({...errors, ...err})
    }

    const sendReport = (): void => {
        reportService.create({
            itemId: id,
            type,
            text: form.report
        })
            .then(() => navigation.goBack())
            .catch(err => {
                console.log('Error sending report')
                console.log(err)
            })
    }

    return (
        <>
            <HeaderComponent
                title={'Report'}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.report}>
                <ScrollView>
                    <TextInputComponent
                        id='report'
                        label='Details about the reason for the report'
                        value={form.report}
                        onChange={update}
                        multiLine={true}
                        style={styles.input}
                        error={errors.report}
                    />
                </ScrollView>
                <ButtonComponent
                    label='Send report'
                    icon='alert-octagon'
                    onPress={() => sendReport()}
                    disabled={untouched || !!errors.report.message}
                    style={{
                        marginTop: 8,
                        marginBottom: 8
                    }}
                />
            </View>
        </>
    )
}

export default withTheme(ReportScreen)
