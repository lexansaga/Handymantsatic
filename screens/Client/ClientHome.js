import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";
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
import { PriceFormat } from "../Utils";
import { useNavigation } from "@react-navigation/native";
export default function ClientHome({ navigation, route, props }) {
    const useNav = useNavigation();
    const [email, setEmail, password, setPassword] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [category, setCategory] = useState({});
    const [refreshing, setRefreshing] = React.useState(false);
    // console.log(route.params.params);const [userInfo, setUserInfo] = useState({});

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    // console.log(Name);
    const [jobs, setJobs] = useState([]);
    const getCategory = async () => {
        await get(child(databaseRef, `Category/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setCategory(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

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
        getJobs();
        getCategory();
        UserInfo().then((user) => {
            setUserInfo(user);
        });
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getJobs();
        getCategory();
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
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
                <View style={styles.LandingContainer}>
                    <Text style={styles.SubHeader}>
                        Hi! <Text style={styles.Name}>{Name}</Text>
                    </Text>
                    <Text style={styles.Header}>What service do you need?</Text>
                    <Image
                        source={require("../../assets/worker.png")}
                        style={styles.LandingImage}
                    />
                </View>

                {/* Category - Start */}
                <View style={styles.Section}>
                    <TouchableOpacity
                        style={styles.btnPostAJob}
                        activeOpacity={0.7}
                        onPress={() => {
                            navigation.navigate(
                                "ServiceProviderPostAJob",
                                route
                            );
                        }}
                    >
                        <Feather
                            style={styles.btnPostAJobIcon}
                            name={"plus"}
                            size={20}
                        />
                        <Text style={styles.btnPostAJobText}>Post A Job</Text>
                    </TouchableOpacity>
                    <Text style={styles.SectionTitle}>Category</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.ScrollViewHoriizontal}
                    >
                        {Object.values(category).map((categoryItem) => {
                            return (
                                <Category
                                    image={{ uri: categoryItem.Image }}
                                    name={`${categoryItem.Name}`}
                                    onpress={() =>
                                        navigation.navigate("Feed", {
                                            Category: `${categoryItem.ID}`,
                                            ...route.params,
                                        })
                                    }
                                />
                            );
                        })}
                    </ScrollView>
                </View>
                {/* Category - End */}
                {/* ClientServiceFeed - Start */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>
                        You are looking for?
                    </Text>
                    <View style={styles.ServiceFeedWrap}>
                        {Object.values(jobs).map((job) => {
                            return (
                                <ClientServiceFeed
                                    service={job.ServiceNeed}
                                    image={{ uri: job.Profile.Profile }}
                                    name={job.Name}
                                    price={PriceFormat(job.Price)}
                                    onpress={() => {
                                        navigation.navigate(
                                            "Client Hire Form",
                                            {
                                                ...route.params,
                                                JobInfo: {
                                                    Active: job.Active,
                                                    Category: job.Category,
                                                    Description:
                                                        job.Description,
                                                    ID: job.ID,
                                                    Location: job.Location,
                                                    ClientName: job.Name,
                                                    PostedBy: job.PostedBy,
                                                    Price: job.Price,
                                                    ServiceNeed:
                                                        job.ServiceNeed,
                                                    UserID: job.UserID,
                                                    Profile:
                                                        job.Profile.Profile,
                                                },
                                            }
                                        );
                                        console.log("click");
                                    }}
                                />
                            );
                        })}
                    </View>
                </View>
                {/* ClientServiceFeed - End */}
            </ScrollView>
        </View>
    );
}
export const Category = ({ image, name, onpress }) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onpress} key={name}>
            <View style={styles.CategoryWrap}>
                <Image source={image} style={styles.CategoryImage} />
                <Text style={styles.CategoryName}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const ClientServiceFeed = ({ service, image, name, price, onpress }) => {
    const colors = [
        "#FF9D38",
        "#7EB58D",
        "#3DB6D0",
        "#FF9D38",
        "#7EB58D",
        "#3DB6D0",
        "#FF9D38",
        "#7EB58D",
        "#3DB6D0",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return (
        <TouchableOpacity
            key={service}
            activeOpacity={0.7}
            style={
                image != null
                    ? [
                          styles.ClientServiceFeedWrap,
                          {
                              backgroundColor: `${color}33`,
                          },
                      ]
                    : {
                          backgroundColor: `${color}`,
                      }
            }
            onPress={onpress}
        >
            <Image
                source={image}
                style={
                    image == null
                        ? styles.NoClientServiceImage
                        : styles.ClientServiceImage
                }
            />
            <View
                style={
                    image == null
                        ? styles.NoClientServiceInfoWrap
                        : styles.ClientServiceInfoWrap
                }
            >
                <Text
                    style={
                        image != null
                            ? styles.ClientServiceTitle
                            : [
                                  styles.ClientServiceTitle,
                                  {
                                      color: "#fff",
                                  },
                              ]
                    }
                >
                    {service}
                </Text>
                <Text style={styles.ClientServiceName}>
                    <Text
                        style={
                            image != null
                                ? {
                                      fontWeight: 400,
                                      marginRight: 8,
                                  }
                                : {
                                      fontWeight: 400,
                                      marginRight: 10,
                                      color: "#fff",
                                  }
                        }
                    >
                        by{"  "}
                    </Text>
                    <Text
                        style={
                            image != null
                                ? { fontWeight: 600, fontStyle: "italic" }
                                : [
                                      styles.ClientServiceTitle,
                                      {
                                          fontWeight: 600,
                                          fontStyle: "italic",
                                          color: "#fff",
                                      },
                                  ]
                        }
                    >
                        {name}
                    </Text>
                </Text>
                <Text
                    style={
                        image != null
                            ? styles.ClientServicePrice
                            : [
                                  styles.ClientServicePrice,
                                  {
                                      color: "#fff",
                                      fontSize: 22,
                                  },
                              ]
                    }
                >
                    {price}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    LandingContainer: {
        height: vh(30),
        minHeight: 200,
        backgroundColor: "rgba(126, 181, 141,0.1)",
        display: "flex",
        paddingHorizontal: 28,
        justifyContent: "center",
        overflow: "visible",
        marginTop: 10,
    },
    Header: {
        fontSize: 30,
        fontWeight: 700,
        maxWidth: "60%",
        fontFamily: "Roboto",
    },
    SubHeader: {
        fontWeight: 500,
        fontSize: 22,
        fontFamily: "Roboto",
    },
    Name: {
        color: "#3DB6D0",
    },
    LandingImage: {
        position: "absolute",
        right: 20,
        height: "100%",
        resizeMode: "contain",
        zIndex: 10,
    },
    Section: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 28,
        paddingHorizontal: 28,
    },
    SectionTitle: {
        fontWeight: 700,
        fontFamily: "Roboto",
        fontSize: 18,
        textTransform: "uppercase",
    },
    ScrollViewHoriizontal: {
        display: "flex",
        flexDirection: "row",
        marginTop: 18,
        gap: 8,
    },
    ServiceFeedWrap: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    CategoryWrap: {
        height: vw(27),
        width: vw(27),
        maxHeight: 120,
        maxWidth: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 8,
        backgroundColor: "#EEEEE4",
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginRight: 8,
        borderRadius: 5,
    },
    CategoryImage: {
        resizeMode: "contain",
        width: "90%",
        height: "50%",
    },
    CategoryName: {
        textTransform: "uppercase",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "Roboto",
        textAlign: "center",
    },
    ClientServiceFeedWrap: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(126, 181, 141,0.2)",
        gap: 18,
        borderRadius: 8,
        overflow: "hidden",
    },

    ClientServiceImage: {
        height: "100%",
        width: "30%",
        resizeMode: "cover",
    },
    NoClientServiceImage: {
        display: "none",
        width: "0%",
    },
    ClientServiceInfoWrap: {
        width: "70%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 2,
        minHeight: 90,
        paddingVertical: 0,
    },
    NoClientServiceInfoWrap: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 2,
        minHeight: 90,
        paddingHorizontal: 30,
    },
    ClientServiceTitle: {
        fontSize: 20,
        fontWeight: 700,
        fontFamily: "Roboto",
        textAlign: "left",
    },
    ClientServiceName: {
        fontSize: 16,
        fontWeight: 500,
        fontFamily: "Roboto",
        textAlign: "left",
        fontStyle: "italic",
    },
    ClientServicePrice: {
        position: "absolute",
        right: "13%",
        fontSize: 17,
        fontWeight: 800,
        fontFamily: "Roboto",
        textAlign: "left",
        marginTop: 4,
    },
    btnPostAJob: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#7EB58D",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 8,
        paddingVertical: 20,
        paddingHorizontal: 16,
        paddingRight: 20,
        marginBottom: 18,
        borderRadius: 5,
    },
    btnPostAJobIcon: {
        color: "#fff",
    },
    btnPostAJobText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
    },
});
