import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Text, RefreshControl } from "react-native";
import { IDFormat, PriceFormat, DefaultProfile, IsNullOrEmpty } from "../Utils";
import Header from "../../components/Header";
import {
    database,
    databaseRef,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
} from "../../config/firebase.config";

import { ClientFeed } from "../ServiceProvider/ServiceProviderHome";
import { ScrollView } from "react-native-gesture-handler";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { useIsFocused } from "@react-navigation/native";

export default function TaskActive({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const [JobOrder, setJobOrder] = useState([]);
    let count = 0;
    const [refreshing, setRefreshing] = useState(false);
    let forView = true;
    let status = route.params.status;
    const isFocused = useIsFocused();
    const getJobOrder = async () => {
        await get(child(databaseRef, `JobOrder/`))
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const snap = snapshot.val();

                    var JobOrders = [];
                    Object.values(snap).map(async (jobOrder) => {
                        const jobOrderID = jobOrder.ID;
                        const jobID = jobOrder.JobID;
                        const userID = jobOrder.UserID;
                        const status = jobOrder.Status;
                        await get(child(databaseRef, `Jobs/${jobID}`)).then(
                            async (job) => {
                                const snapJob = job.val();
                                const jobUserID = snapJob.UserID;
                                await get(
                                    child(databaseRef, `Users/${jobUserID}/`)
                                ).then(async (user) => {
                                    const snapUser = user.val();
                                    JobOrders.push({
                                        [`${jobOrderID}`]: {
                                            status,
                                            JobOrderID: jobOrderID,
                                            ...snapUser,
                                            ...snapJob,
                                        },
                                    });
                                    setJobOrder(JobOrders);

                                    //     console.log(JobOrders);
                                });
                            }
                        );
                    });
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const initialized = useRef(false);
    useEffect(() => {
        if (isFocused) {
            onRefresh();
            console.log("Focused");
            UserInfo().then((user) => {
                setUserInfo(user);
            });
        }
    }, [isFocused]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getJobOrder();
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={style.MainWrapper}>
            <Header profile={Profile} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={style.LandingContainer}>
                    {JobOrder &&
                        JobOrder.map((obj, index) => {
                            const key = Object.keys(obj)[0]; // Extract the key
                            const data = obj[key];
                            console.log(`${UID} : ${data.UID}`);
                            if (
                                !data.status
                                    .toLowerCase()
                                    .includes(
                                        status.toLowerCase() ||
                                            UID.includes(data.UID)
                                    )
                            ) {
                                return;
                            }
                            return (
                                <View style={style.taskItem}>
                                    <Text style={style.taskID}>
                                        {IDFormat(data.JobOrderID)}
                                    </Text>
                                    <ClientFeed
                                        name={data.Name}
                                        whatlooking={data.ServiceNeed}
                                        description={data.Description}
                                        price={PriceFormat(data.Price)}
                                        image={{
                                            uri: data.Profile
                                                ? data.Profile
                                                : DefaultProfile,
                                        }}
                                        onpress={() => {}}
                                    />
                                    <View
                                        style={
                                            status
                                                .toLowerCase()
                                                .includes("active")
                                                ? style.btnActionWrap
                                                : style.forViewBtnActionWrap
                                        }
                                    >
                                        <PrimaryButton
                                            title={"Finish Contract"}
                                            onPress={() => {
                                                update(
                                                    ref(
                                                        database,
                                                        `JobOrder/${data.JobOrderID}/`
                                                    ),
                                                    {
                                                        Status: `Completed`,
                                                    }
                                                );
                                                onRefresh();
                                            }}
                                        />
                                        <SecondaryButton
                                            title={"Cancel Contract"}
                                            onPress={() => {
                                                update(
                                                    ref(
                                                        database,
                                                        `JobOrder/${data.JobOrderID}/`
                                                    ),
                                                    {
                                                        Status: `Cancelled`,
                                                    }
                                                );
                                                update(
                                                    ref(
                                                        database,
                                                        `Jobs/${data.ID}/`
                                                    ),
                                                    {
                                                        Active: true,
                                                    }
                                                );

                                                onRefresh();
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                </View>
            </ScrollView>
        </View>
    );
}
// // let Count = 0;
// function TaskItem({ data, forView, refresh }) {
//     //     console.log(data);
//     return (

//     );
// }

const style = StyleSheet.create({
    LandingContainer: {
        minHeight: 200,
        display: "flex",
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 20,
        paddingBottom: 120,
        justifyContent: "center",
        overflow: "visible",
        marginTop: 8,
    },
    taskItem: {
        backgroundColor: "#EEEEE4",
        borderRadius: 8,
    },
    taskID: {
        paddingVertical: 8,

        paddingHorizontal: 8,
        fontWeight: 500,
        textTransform: "uppercase",
        fontSize: 18,
        textAlign: "center",
        backgroundColor: "#7EB58D",
        color: "#fff",
        borderRadius: 8,
        marginBottom: 0,
    },
    btnActionWrap: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 15,
        paddingBottom: 18,
        paddingHorizontal: 18,
    },
    forViewBtnActionWrap: {
        display: "none",
    },
});
