import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    TouchableWithoutFeedback,
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";
import { Category } from "../Client/ClientHome";
import PrimaryButton from "../../components/PrimaryButton";
import { Feather } from "@expo/vector-icons";
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
    update,
    set,
} from "../../config/firebase.config";
import { PriceFormat, DefaultProfile } from "../Utils";
import ShowToast from "../../components/Toast";
import { useIsFocused } from "@react-navigation/native";
export default function ServiceProviderHome({ navigation, route }) {
    const [email, setEmail, password, setPassword] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [category, setCategory] = useState({});
    const [jobs, setJobs] = useState({});
    const [refreshing, setRefreshing] = React.useState(false);
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;

    const getCategory = async () => {
        // var categoryData = [];
        await get(child(databaseRef, `Category/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // console.log(snapshot.val());

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
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            onRefresh();
        }
        // getJobs();
        // getCategory();
        // console.log(userInfo);
        UserInfo().then((user) => {
            setUserInfo(user);
        });
    }, [isFocused]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getJobs();
        getCategory();
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
                    <Text style={styles.Header}>Welcome Back!</Text>
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
                                            Category: `${categoryItem.Name}`,
                                            params: route.params,
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
                    <Text style={styles.SectionTitle}>Feed</Text>
                    <View style={styles.ServiceFeedWrap}>
                        {Object.values(jobs).map((job) => {
                            // console.log(job.Profile.Profile);
                            if (
                                job.PostedBy.includes(Email) ||
                                job.Active == false
                            ) {
                                // Prevent the current User see his / her own name at the feed.
                                return;
                            }
                            return (
                                <ClientFeed
                                    ClientID={UID}
                                    JobID={job.ID}
                                    name={job.Name}
                                    image={{
                                        uri: job.Profile.Profile
                                            ? job.Profile.Profile
                                            : DefaultProfile,
                                    }}
                                    price={PriceFormat(job.Price)}
                                    whatlooking={job.ServiceNeed}
                                    description={job.Description}
                                    onpress={() => {
                                        console.log(`From feed:${job.ID}`);
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
                </View>
                {/* ClientServiceFeed - End */}
            </ScrollView>
        </View>
    );
}

export const ClientFeed = ({
    ClientID,
    JobID,
    name,
    image,
    whatlooking,
    price,
    description,
    onpress,
}) => {
    const [favorite, setFavorite] = useState(false);

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
    //  console.log(favorite);
    // console.log(image);
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.ClientFeedWrap,
                {
                    backgroundColor: `${color}33`,
                },
            ]}
            onPress={onpress}
        >
            <View style={styles.ClientImageWrap}>
                <View style={styles.ClientInfoWrap}>
                    <Image source={image} style={styles.ClientImage} />
                    <View>
                        <Text style={styles.ClientName}>{name}</Text>
                        <Text style={styles.ClientWhatLooking}>
                            {whatlooking}
                        </Text>
                        <Text style={styles.ClientDescription}>{price}</Text>
                    </View>
                </View>

                <Text style={styles.ClientDescription}>{description}</Text>
                <TouchableWithoutFeedback>
                    <TouchableOpacity
                        style={styles.FavoriteButton}
                        onPress={() => {
                            console.log("Favorite!");
                            update(ref(database, `Favorites/${ClientID}/`), {
                                [`${JobID}`]: !favorite,
                            });

                            setFavorite(!favorite);
                        }}
                    >
                        <Feather
                            name={"heart"}
                            size={20}
                            color={favorite ? `${"#FF9D38"}` : `${"#000"}`}
                        />
                    </TouchableOpacity>
                </TouchableWithoutFeedback>
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
    btnPostAJob: {
        display: "none",
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

    ClientFeedWrap: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 12,
        overflow: "hidden",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    ClientImageWrap: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    ClientImage: {
        height: 80,
        width: 80,
        borderRadius: 8,
    },
    ClientInfoWrap: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 15,
    },
    ClientName: {
        fontSize: 20,
        fontWeight: 600,
    },
    ClientWhatLooking: {
        fontSize: 16,
        fontWeight: 400,
        fontStyle: "italic",
    },
    ClientDescription: {
        fontSize: 16,
        fontWeight: 400,
        maxWidth: "100%",
        marginTop: 0,
    },
    FavoriteButton: {
        position: "absolute",
        right: 0,
        top: 0,
        alignItems: "flex-end",
        zIndex: 999999,
    },
});
