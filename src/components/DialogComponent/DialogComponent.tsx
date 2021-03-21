import React from 'react';
import {StyleSheet} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Dialog, Paragraph, withTheme} from "react-native-paper";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

interface DialogAction {
    label: string
    onPress: () => void
    backgroundColor?: string
}

interface DialogProperties {
    theme: Theme
    visible: boolean
    onDismiss: () => void
    title: string
    content: string[]
    actions: DialogAction[]
}

const DialogComponent: React.FC<DialogProperties> = ({
                                                         theme,
                                                         visible = false,
                                                         onDismiss, title,
                                                         content,
                                                         actions
                                                     }) => {
    const styles = StyleSheet.create({
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
    });

    return (
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
                        style={{...styles.action, backgroundColor: action.backgroundColor || theme.colors.accent}}
                    />
                )}
            </Dialog.Actions>
        </Dialog>
    )
}

export default withTheme(DialogComponent)
