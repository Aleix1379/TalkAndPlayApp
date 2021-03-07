import React, {useEffect, useState} from 'react';
import {Appbar, FAB} from 'react-native-paper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {Theme} from 'react-native-paper/lib/typescript/types';
import PostsService from '../../services/Posts';
import {PostsResponse} from '../../types/PostsTypes';
import PostComponent from "../../components/PostComponent";
import {UserState} from "../../store/user/types";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";

interface PostListProperties {
    navigation: any,
    theme: Theme;
}

const PostListScreen: React.FC<PostListProperties> = ({navigation, theme}) => {

        const styles = StyleSheet.create({
            postList: {
                flex: 1,
                backgroundColor: theme.colors.background
            },
            title: {
                textAlign: 'center',
                fontFamily: 'Ranchers-Regular',
                letterSpacing: 3,
                fontSize: 25,
            },
            fab: {
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 0,
            }
        });

        const [data, setData] = useState<PostsResponse>();
        const postService = new PostsService();

        const user: UserState = useSelector((state: ApplicationState) => {
            return state.user
        }, shallowEqual)

        useEffect(() => {
            postService.get().then((response: PostsResponse) => {
                setData(response);
            });
        }, []);

        const goToDetail = (id: number, title: string) => {
            navigation.navigate('Detail', {title, id});
        }

        return (
            <>
                <Appbar>
                    <Appbar.Action color={theme.colors.primary} icon="magnify" style={{marginLeft: 16}}/>
                    <Appbar.Content title="Talk and play" titleStyle={styles.title}/>
                    <Appbar.Action
                        color={theme.colors.accent}
                        icon="magnify"
                        style={{marginRight: 16}}
                        onPress={() => {
                        }}
                    />
                </Appbar>

                <View style={styles.postList}>
                    <ScrollView>
                        {data?.content.map((post, index) =>
                            <View key={post.id}
                                  style={{
                                      marginTop: index === 0 ? 10 : 8,
                                      marginBottom: index === data?.content.length - 1 ? 10 : 2
                                  }}>
                                <PostComponent key={post.id} post={post} theme={theme} onClick={goToDetail}/>
                            </View>)}
                    </ScrollView>

                    {user.id >= 0 && <FAB
                        style={styles.fab}
                        small
                        icon="plus"
                        onPress={() => navigation.navigate('PostCreate')}
                    />}
                </View>
            </>
        );
    }
;

export default withTheme(PostListScreen);
