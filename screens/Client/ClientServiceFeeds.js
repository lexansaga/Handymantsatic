import React from "react";
import Header from "../../components/Header";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ClientServiceFeed } from "./ClientHome";

export default function ClientServiceFeeds({ navigation, route }) {
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView
                style={styles.CSFMainContainer}
                showsVerticalScrollIndicator={false}
            >
                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                    onpress={() => {
                        navigation.navigate();
                    }}
                />

                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                />

                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                />

                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                />

                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                />

                <Feed
                    service={"Plumbing"}
                    image={require("../../assets/profile.jpg")}
                    name={"John Doe"}
                    price={"P10"}
                    cover={
                        "With over a decade of experience in diagnosing and fixing plumbing issues, I am confident in my ability to provide comprehensive plumbing services that meet the needs of any residential or commercial client."
                    }
                />
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
