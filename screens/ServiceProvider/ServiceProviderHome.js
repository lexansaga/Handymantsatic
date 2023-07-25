import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
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
} from "../../config/firebase.config";
export default function ServiceProviderHome({ navigation }) {
    const [email, setEmail, password, setPassword] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [category, setCategory] = useState({});
    const [jobs, setJobs] = useState({});

    useEffect(() => {
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
            // var categoryData = [];
            await get(child(databaseRef, `Jobs/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        // console.log(snapshot.val());

                        setJobs(snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        const getCurrentUsername = async () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth.user
                    const uid = user.uid;
                    console.log(uid);
                    get(child(databaseRef, `Users/${uid}/Name`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(snapshot.val());
                                setCurrentUserName(snapshot.val());
                            } else {
                                console.log("No data available");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    // User is signed out
                    // ...
                }
            });
        };

        // console.log(category);
        getCurrentUsername();
        getJobs();
        getCategory();

        // const interval = setInterval(() => {
        //     getJobs();
        //     getCategory();
        //     console.log("Refresh");
        // }, 10000);

        // return () => clearInterval(interval);
    }, []);
    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.LandingContainer}>
                    <Text style={styles.SubHeader}>
                        Hi! <Text style={styles.Name}>{currentUserName}</Text>
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
                            navigation.navigate("ServiceProviderPostAJob", {
                                key: "value",
                            });
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
                                        navigation.navigate(
                                            "ClientServiceFeed",
                                            {
                                                category: `${categoryItem.ID}`,
                                            }
                                        )
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
                            return (
                                <ClientFeed
                                    name={job.Name}
                                    whatlooking={job.ServiceNeed}
                                    description={job.Description}
                                    onpress={() => {
                                        navigation.navigate(
                                            "ServiceProviderPostView",
                                            {
                                                key: job.ID,
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

export const ClientFeed = ({ name, whatlooking, description, onpress }) => {
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
    // console.log(color);
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
            <Text style={styles.ClientName}>{name}</Text>
            <Text style={styles.ClientWhatLooking}>{whatlooking}</Text>
            <Text style={styles.ClientDescription}>{description}</Text>

            <TouchableOpacity
                style={styles.FavoriteButton}
                onpress={() => {
                    console.log("Favorite!");
                    setFavorite(!favorite);
                }}
            >
                <Feather
                    name={"heart"}
                    size={20}
                    color={favorite ? `${"#FF9D38"}` : `${"#000"}`}
                />
            </TouchableOpacity>
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
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
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
        maxWidth: "85%",
        marginTop: 8,
    },
    FavoriteButton: {
        position: "absolute",
        left: 0,
        right: 20,
        top: "50%",
        alignItems: "flex-end",
        zIndex: 99,
    },
});
