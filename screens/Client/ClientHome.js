import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";

export default function ClientHome({ navigation }) {
    const [email, setEmail, password, setPassword] = useState("");

    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.LandingContainer}>
                    <Text style={styles.SubHeader}>
                        Hi! <Text style={styles.Name}>Alex</Text>
                    </Text>
                    <Text style={styles.Header}>What service do you need?</Text>
                    <Image
                        source={require("../../assets/worker.png")}
                        style={styles.LandingImage}
                    />
                </View>

                {/* Category - Start */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>Category</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.ScrollViewHoriizontal}
                    >
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                        <Category
                            image={require("../../assets/plumbing.png")}
                            name="Plumbing"
                            onpress={() =>
                                navigation.navigate("ClientServiceFeed", {
                                    category: "plumbing",
                                })
                            }
                        />
                    </ScrollView>
                </View>
                {/* Category - End */}

                {/* ClientServiceFeed - Start */}
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>
                        You are looking for?
                    </Text>
                    <View style={styles.ServiceFeedWrap}>
                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P1000"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />

                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P10"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />

                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P10"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />

                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P10"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />

                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P10"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />

                        <ClientServiceFeed
                            service={"Plumbing"}
                            image={require("../../assets/profile.jpg")}
                            name="John Doe"
                            price="P10"
                            onpress={() => {
                                navigation.navigate("ClientHireForm");
                                console.log("click");
                            }}
                        />
                    </View>
                </View>
                {/* ClientServiceFeed - End */}
            </ScrollView>
        </View>
    );
}
export const Category = ({ image, name, onpress }) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onpress}>
            <View style={styles.CategoryWrap}>
                <Image source={image} style={styles.CategoryImage} />
                <Text style={styles.CategoryName}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const ClientServiceFeed = ({ service, image, name, price, onpress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={
                image != null
                    ? styles.ClientServiceFeedWrap
                    : {
                          backgroundColor: "#FF9D38",
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
});
