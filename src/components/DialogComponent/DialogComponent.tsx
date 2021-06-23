import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Dialog, Paragraph, withTheme} from "react-native-paper"
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import {DialogOption} from "../../store/dialog/types"

interface DialogProperties {
    theme: Theme
    visible: boolean
    onDismiss: () => void
    title: string
    content: string[]
    actions: DialogOption[]
}

const DialogComponent: React.FC<DialogProperties> = ({
                                                         theme,
                                                         visible = false,
                                                         onDismiss, title,
                                                         content,
                                                         actions
                                                     }) => {
    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
        },
        dialog: {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.surface,
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            paddingBottom: 20,
            borderRadius: 15
        },
        action: {
            flex: 1,
            marginHorizontal: 24,
            elevation: 0
        }
    })

    return (
        <>
            {
                visible &&
                <View style={styles.container}>
                    <Dialog
                        style={styles.dialog}
                        visible={visible}
                        onDismiss={onDismiss}
                    >
                        <Dialog.Title>{title}</Dialog.Title>
                        <Dialog.Content>
                            {content.map((text, index) => <Paragraph key={index}>{text}</Paragraph>)}
                        </Dialog.Content>
                        <Dialog.Actions style={{justifyContent: "space-around"}}>
                            {actions.map((action, index) =>
                                <ButtonComponent
                                    key={index}
                                    label={action.label}
                                    onPress={action.onPress}
                                    style={{
                                        ...styles.action,
                                        backgroundColor: action.backgroundColor || theme.colors.accent
                                    }}
                                />
                            )}
                        </Dialog.Actions>
                    </Dialog>
                </View>
            }
        </>
    )
}

export default withTheme(DialogComponent)
