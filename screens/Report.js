import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
} from "react-native";
import ShowToast from "../components/Toast";
import axios from "axios";
import Header from "../components/Header";
import Input from "../components/Input";
import style from "../styles/style";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    orderBy,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
    set,
    firebaseBaseUrl,
} from "../config/firebase.config";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../components/PrimaryButton";

import StarRating from "../components/StarRating";
import { DefaultProfile, IsNullOrEmpty } from "./Utils";
export default function Report({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Contact, Password, Profile, Type, UID } = userInfo;
    const [refreshing, setRefreshing] = React.useState(false);
    const ServiceProviderID = route.params.ID;
    const [reportTitle, setReportTitle] = useState("");
    const [reportReason, setReportReason] = useState("");

    const [serviceProviderInfo, setServiceProviderInfo] = useState({});
    const getToReviewInfo = async () => {
        const url = `${firebaseBaseUrl}/Users/${ServiceProviderID}.json`;
        const response = await axios.get(url);
        return response.data;
    };
    useEffect(() => {
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        // console.log(userInfo);
    }, []);
    useEffect(() => {
        getToReviewInfo().then((data) => {
            console.log(data);
            setServiceProviderInfo(data);
        });

        // onRefresh();
    }, []);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        getToReviewInfo().then((data) => {
            console.log(data);
            setServiceProviderInfo(data);
        });

        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={styles.MainWrap}>
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Image
                    source={{
                        uri: IsNullOrEmpty(serviceProviderInfo.Profile)
                            ? DefaultProfile
                            : serviceProviderInfo.Profile,
                    }}
                    style={styles.CoverImage}
                />
                <View style={style.Section}>
                    <Text style={style.SectionTitle}>
                        We Value Your Opinion!
                    </Text>
                    <Text style={styles.SectionSubTitle}>
                        Please use the form below to submit a report of this{" "}
                        {Type}. ​​​​​​​ We value your feedback and would
                        appreciate hearing about your experience along with{" "}
                        <Text style={{ fontWeight: 700, fontStyle: "italic" }}>
                            {serviceProviderInfo.Name}
                        </Text>
                    </Text>
                    <View style={styles.InputGroup}>
                        <Text style={styles.InputLabel}>
                            We're taking action, please elaborate the situation.{" "}
                        </Text>
                        <View style={{ marginLeft: -12 }}>
                            <Input
                                style={styles.Input}
                                placeholder={"Report Title"}
                                value={reportTitle}
                                onChangeText={setReportTitle}
                                icon="edit-2"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>
                        <View style={{ marginLeft: -12 }}>
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"What would be the reason?"}
                                value={reportReason}
                                onChangeText={setReportReason}
                                icon="edit-2"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>

                        <Text></Text>
                        <PrimaryButton
                            title={"Submit"}
                            onPress={() => {
                                push(
                                    ref(
                                        database,
                                        `Reports/${ServiceProviderID}/`
                                    ),
                                    {
                                        ReporterID: UID,
                                        ToWho: serviceProviderInfo.UID,
                                        Name: Name,
                                        ReportTitle: reportTitle,
                                        ReportReason: reportReason,
                                        ReporterName: Name,
                                    }
                                );
                                ShowToast("Review submitted sucessfully!");
                                setReportTitle("");
                                setReportReason("");
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    CoverImage: {
        width: "100%",
        resizeMode: "cover",
        height: vh(25),
        marginTop: 20,
    },
    SectionSubTitle: {
        fontSize: 18,
        lineHeight: 25,
        color: "#333",
    },
    InputLabel: {
        fontSize: 20,
        lineHeight: 25,
        color: "#333",
    },

    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 28,
    },
    Input: {
        marginLeft: -12,
    },
    StarRate: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
        marginBottom: 12,
    },
});
