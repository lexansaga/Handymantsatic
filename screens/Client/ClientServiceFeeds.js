import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ClientServiceFeed } from "./ClientHome";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    ref,
    child,
    get,
    onValue,
    getDataOnce,
    UserInfo,
} from "../../config/firebase.config";
import { DefaultProfile, IsNullOrEmpty } from "../Utils";
import { PriceFormat } from "../Utils";
export default function ClientServiceFeeds({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Category } = route.params;
    console.log(Category);
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const [jobs, setJobs] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    // const [profile, setProfile] = useState("");
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
        // setJobs(JSON.stringify(jobs));
        getJobs();
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        // console.log(jobs);
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getJobs();
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView
                style={styles.CSFMainContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {Object.values(jobs).map((job) => {
                    // console.log(jobs);
                    // console.log(getProfile(job.UserID));
                    // console.log(
                    //     `${job.Category.toLowerCase().trim()} :  ${Category.toLowerCase().trim()}`
                    // );
                    console.log(IsNullOrEmpty(job));
                    if (!IsNullOrEmpty(job));
                    {
                        if (
                            job.PostedBy.includes(Email) ||
                            !job.Category.toLowerCase().includes(
                                Category.toLowerCase()
                            )
                        ) {
                            return;
                        }
                        return (
                            <Feed
                                service={job.Category}
                                image={{
                                    uri: job.Profile.Profile,
                                }}
                                name={job.Name}
                                price={PriceFormat(job.Price)}
                                cover={job.Description}
                                onpress={() => {
                                    navigation.navigate("Client Hire Form", {
                                        ...route.params,
                                        JobInfo: {
                                            Active: job.Active,
                                            Category: job.Category,
                                            Description: job.Description,
                                            ID: job.ID,
                                            Location: job.Location,
                                            ClientName: job.Name,
                                            PostedBy: job.PostedBy,
                                            Price: job.Price,
                                            ServiceNeed: job.ServiceNeed,
                                            UserID: job.UserID,
                                            Profile: job.Profile.Profile,
                                        },
                                    });
                                    // console.log("click");
                                }}
                            />
                        );
                    }
                })}
            </ScrollView>
        </View>
    );
}

function Feed({ service, image, name, price, cover, onpress }) {
    return (
        <View style={styles.FeedContainer}>
            <ClientServiceFeed
                service={service}
                image={image}
                name={name}
                price={price}
            />
            <Text style={styles.CoverLetter}>{cover}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.FeedButton}
                onPress={onpress}
            >
                <Feather
                    name="activity"
                    size={20}
                    color="#000"
                    style={[styles.FeedButtonIcon]}
                />
                <Text style={styles.FeedButtonText}>Hires Me!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    CSFMainContainer: {
        paddingTop: 18,
        maxWidth: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingBottom: 250,
    },
    FeedContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginBottom: 16,
    },
    CoverLetter: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        textAlign: "left",
        width: "100%",
    },
    FeedButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF9425",
        width: "100%",
        paddingVertical: 14,
        gap: 12,
    },
    FeedButtonIcon: {
        color: "#ffffff",
    },
    FeedButtonText: {
        fontWeight: 700,
        color: "#fff",
    },
});
