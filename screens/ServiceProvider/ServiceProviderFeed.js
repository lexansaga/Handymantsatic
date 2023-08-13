import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
} from "react-native";
import Header from "../../components/Header";
import { ClientFeed } from "../ServiceProvider/ServiceProviderHome";
import styles from "../../styles/style";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    ref,
    child,
    get,
    UserInfo,
} from "../../config/firebase.config";
import { IsNullOrEmpty } from "../Utils";
export default function ServiceProviderFeeds({ navigation, route }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [jobs, setJobs] = useState({});
    const [refreshing, setRefreshing] = React.useState(false);
    const [userInfo, setUserInfo] = useState({});
    const { Category } = route.params;
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    // console.log(Category);
    const getJobs = async () => {
        let profiles = {};
        await get(child(databaseRef, `Jobs/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const snap = snapshot.val();
                    // console.log(snap);
                    Object.values(snap).map(async (job) => {
                        var uid = job.UserID;
                        // console.log(uid);
                        await get(child(databaseRef, `Users/${uid}`)).then(
                            (Profile) => {
                                profiles[`${job.ID}`] = {
                                    ...job,
                                    Profile,
                                };
                                const mergedDataString = JSON.stringify(
                                    profiles,
                                    null,
                                    2
                                );
                                // console.log(mergedDataString);

                                setJobs(JSON.parse(mergedDataString));
                            }
                        );
                    });

                    // setJobs(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        // console.log(category);
        getJobs();
        UserInfo().then((user) => {
            setUserInfo(user);
        });
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getJobs();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={style.ServiceFeedWrap}>
                    {Object.values(jobs).map((job) => {
                        // console.log(job.Category.toLowerCase());
                        if (
                            !IsNullOrEmpty(job.Category) &&
                            (job.PostedBy.includes(Email) ||
                                !job.Category.toLowerCase().includes(Category))
                        ) {
                            // Prevent the current User see his / her own name at the feed and Only see specified Category.
                            return;
                        }

                        // console.log(job.ID);

                        console.log(`From Feed:`);
                        // console.log(job);
                        return (
                            <ClientFeed
                                name={job.Name}
                                whatlooking={job.ServiceNeed}
                                description={job.Description}
                                image={{ uri: job.Profile.Profile }}
                                onpress={() => {
                                    navigation.navigate(
                                        "ServiceProviderPostView",
                                        {
                                            JobID: job.ID,
                                        }
                                    );
                                }}
                            />
                        );
                    })}
                </View>
                {/* ClientServiceFeed - End */}
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    ServiceFeedWrap: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "92%",
        alignSelf: "center",
    },
});
