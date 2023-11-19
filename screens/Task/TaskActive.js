import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Text, RefreshControl } from "react-native";
import {
    IDFormat,
    PriceFormat,
    DefaultProfile,
    IsNullOrEmpty,
    IsNullOrEmptyFallback,
    PushNotification,
} from "../Utils";
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

import { Feather } from "@expo/vector-icons";
export default function TaskActive({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const [JobOrder, setJobOrder] = useState([]);
    let count = 0;
    const [refreshing, setRefreshing] = useState(false);
    let forView = true;
    let status = route.params.status;
    let isServiceProvider = IsNullOrEmpty(Type)
        ? false
        : Type.includes("ServiceProvider");
    let isCLient = IsNullOrEmpty(Type) ? false : Type.includes("Client");
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
                                const jobClientID = snapJob.ClientID;
                                const jobServiceProviderID =
                                    snapJob.ServiceProviderID;
                                await get(
                                    child(databaseRef, `Users/${jobClientID}/`)
                                ).then(async (client) => {
                                    const snapClient = client.val();

                                    await get(
                                        child(
                                            databaseRef,
                                            `Users/${jobServiceProviderID}/`
                                        )
                                    ).then(async (serviceProvider) => {
                                        const snapServiceProvider =
                                            serviceProvider.val();

                                        JobOrders.push({
                                            [`${jobOrderID}`]: {
                                                JobOrder: {
                                                    JobOrderID: jobOrderID,
                                                    Status: status,
                                                    JobID: jobID,
                                                },
                                                ServiceProvider:
                                                    snapServiceProvider,
                                                Client: snapClient,
                                                Job: snapJob,
                                            },
                                        });
                                        const mergedDataString = JSON.stringify(
                                            JobOrders,
                                            null,
                                            2
                                        );
                                        // console.log(mergedDataString);
                                        setJobOrder(
                                            JSON.parse(mergedDataString)
                                        );
                                    });
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
            UserInfo()
                .then((user) => {
                    setUserInfo(user);
                    // console.log(userInfo);
                })
                .catch((error) => {
                    console.log(error);
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
                            // console.log(obj);
                            const key = Object.keys(obj)[0]; // Extract the key
                            const data = obj[key];
                            // console.log(data);
                            // console.log(`${UID} : ${data.Client.UID}`);

                            let {
                                iUID,
                                iName,
                                iProfile,
                                iWhatIsLooking,
                                iType,
                            } = "";
                            if (isServiceProvider) {
                                if (!IsNullOrEmpty(data.Client)) {
                                    iUID = data.Client.UID;
                                    iName = data.Client.Name;
                                    iProfile = data.Client.Profile;
                                    iWhatIsLooking = "Client";
                                    iType = data.Client.Type;
                                }
                            } else {
                                if (!IsNullOrEmpty(data.ServiceProvider)) {
                                    iUID = data.ServiceProvider.UID;
                                    iName = data.ServiceProvider.Name;
                                    iProfile = data.ServiceProvider.Profile;
                                    iWhatIsLooking =
                                        data.ServiceProvider.ServiceOffered;
                                    iType = data.ServiceProvider.Type;
                                }
                            }
                            if (
                                !status
                                    .toLowerCase()
                                    .includes(
                                        data.JobOrder.Status.toLowerCase()
                                    )
                            ) {
                                return;
                            }
                            return (
                                <View style={style.taskItem}>
                                    <Text style={style.taskID}>
                                        {IDFormat(data.JobOrder.JobID)}
                                    </Text>
                                    <ClientFeed
                                        name={iName}
                                        whatlooking={iWhatIsLooking}
                                        description={data.Job.Description}
                                        price={PriceFormat(data.Job.Price)}
                                        image={{
                                            uri: iProfile
                                                ? iProfile
                                                : DefaultProfile,
                                        }}
                                        hasFavorite={false}
                                        onpress={() => {}}
                                    />
                                    {status.toLowerCase().includes("active") ||
                                    status
                                        .toLowerCase()
                                        .includes("proposed") ? (
                                        <View style={style.btnActionWrap}>
                                            <PrimaryButton
                                                title={
                                                    status
                                                        .toLowerCase()
                                                        .includes("active")
                                                        ? "Finish Contract"
                                                        : "Accept Offer"
                                                }
                                                onPress={() => {
                                                    update(
                                                        ref(
                                                            database,
                                                            `JobOrder/${data.JobOrder.JobOrderID}/`
                                                        ),
                                                        {
                                                            Status: status
                                                                .toLowerCase()
                                                                .includes(
                                                                    "active"
                                                                )
                                                                ? `Completed`
                                                                : `Active`,
                                                        }
                                                    );
                                                    var thisStatus = status
                                                        .toLowerCase()
                                                        .includes("active")
                                                        ? "Finish the Contract"
                                                        : "Accepted the Offer";

                                                    PushNotification(
                                                        `${thisStatus}`,
                                                        `${Name} just ${thisStatus}`,
                                                        IsNullOrEmptyFallback(
                                                            iUID,
                                                            "No ID"
                                                        ),
                                                        {
                                                            JobID: data.Job.ID,
                                                        }
                                                    );
                                                    onRefresh();
                                                }}
                                            />
                                            <SecondaryButton
                                                title={
                                                    status
                                                        .toLowerCase()
                                                        .includes("proposed")
                                                        ? "Decline Offer"
                                                        : "Cancel Contract"
                                                }
                                                onPress={() => {
                                                    update(
                                                        ref(
                                                            database,
                                                            `JobOrder/${data.JobOrder.JobOrderID}/`
                                                        ),
                                                        {
                                                            Status: `Cancelled`,
                                                        }
                                                    );
                                                    update(
                                                        ref(
                                                            database,
                                                            `Jobs/${data.Job.ID}/`
                                                        ),
                                                        {
                                                            Active: true,
                                                        }
                                                    );

                                                    onRefresh();
                                                    console.log(status);
                                                    var thisStatus = status
                                                        .toLowerCase()
                                                        .includes("proposed")
                                                        ? "Decline the Offer"
                                                        : "Cancel the Contract";

                                                    PushNotification(
                                                        `${thisStatus}`,
                                                        `${Name} just ${thisStatus}`,
                                                        IsNullOrEmptyFallback(
                                                            iUID,
                                                            "No ID"
                                                        ),
                                                        {
                                                            JobID: data.Job.ID,
                                                        }
                                                    );
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={style.btnActionWrap}>
                                            <PrimaryButton
                                                title={"Add Review"}
                                                onPress={() => {
                                                    navigation.navigate(
                                                        "Review",
                                                        {
                                                            ID: iUID,
                                                            Type: iType,
                                                        }
                                                    );

                                                    PushNotification(
                                                        `Review`,
                                                        `${Name} just added a review! Check your review profile!`,
                                                        IsNullOrEmptyFallback(
                                                            iUID,
                                                            "No ID"
                                                        ),
                                                        {
                                                            JobID: data.Job.ID,
                                                        }
                                                    );
                                                }}
                                            />
                                            <SecondaryButton
                                                title={"Report"}
                                                onPress={() => {
                                                    navigation.navigate(
                                                        "Report",
                                                        {
                                                            ID: iUID,
                                                        }
                                                    );

                                                    console.log(status);
                                                    var thisStatus = status
                                                        .toLowerCase()
                                                        .includes("proposed")
                                                        ? "Decline the Offer"
                                                        : "Cancel the Contract";

                                                    PushNotification(
                                                        `Report`,
                                                        `${Name} just added a report on you!`,
                                                        IsNullOrEmptyFallback(
                                                            iUID,
                                                            "No ID"
                                                        ),
                                                        {
                                                            JobID: data.Job.ID,
                                                        }
                                                    );
                                                }}
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                </View>
            </ScrollView>
        </View>
    );
}

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
        borderRadius: 0,
        marginBottom: -8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        zIndex: 2,
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
