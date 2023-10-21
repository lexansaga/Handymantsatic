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
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";
import { Feather } from "@expo/vector-icons";
import styles from "../../styles/style";
import { AppTitle } from "../../components/General";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    ref,
    child,
    get,
    push,
    update,
    UserInfo,
} from "../../config/firebase.config";
import { PriceFormat } from "../Utils";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { render } from "react-native-web";
import ShowToast from "../../components/Toast";
export default function ServiceProviderPostView({ navigation, route }) {
    const [email, setEmail, password, setPassword] = useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;

    const [job, setJob] = useState([]);

    const { JobID } = route.params;
    console.log(`${JobID} Loaded`);
    const getJobs = async () => {
        await get(child(databaseRef, `Jobs/${JobID}`))
            .then((snapshot) => {
                console.log(snapshot.val());
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setJob(snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const isFocused = useIsFocused();
    // console.log(job);
    useEffect(() => {
        if (isFocused == true) {
            getJobs();
            UserInfo().then((user) => {
                setUserInfo(user);
            });
            console.log("Job");
            console.log(job);
        }
    }, [isFocused]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log("Refresh");
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
                <AppTitle
                    title={job.Name}
                    hasContact={true}
                    dialNo={12345678901}
                />

                <View style={styles.Section}>
                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Is Looking For?</Text>
                        <Text style={style.Answer}>{job.ServiceNeed}</Text>
                    </View>
                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>TASK</Text>
                        <Text style={style.Answer}>{job.Description}</Text>
                    </View>

                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Est. Budget</Text>
                        <Text style={style.Answer}>
                            {PriceFormat(job.Price)}
                        </Text>
                    </View>

                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Location</Text>
                        <Text style={style.Answer}>{job.Location}</Text>
                    </View>

                    <PrimaryButton
                        title={"Take Job"}
                        style={style.BtnTakeJob}
                        onPress={() => {
                            TakeJob(
                                JobID,
                                UID,
                                job.ClientID,
                                navigation,
                                job.Active
                            );
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
async function TakeJob(
    JobID,
    ServiceProviderID,
    ClientID,
    Navigation,
    isActive
) {
    if (isActive == false) {
        ShowToast("This is now taken");
        return;
    }
    // var name = snap.Name;
    var save = await push(ref(database, `JobOrder`), {
        JobID: `${JobID}`,
        UserID: `${ServiceProviderID}`,
        ServiceProviderID: ServiceProviderID,
        ClientID: ClientID,
        Status: `Proposed`,
    });
    var saveKey = save.key;
    await update(ref(database, `JobOrder/${saveKey}`), {
        ID: saveKey,
    });
    await update(ref(database, `Jobs/${JobID}`), {
        // Active: false,
        ServiceProviderID: ServiceProviderID,
    });
    console.log(saveKey);

    await Navigation.navigate("ClientSuccessBook", {
        OrderID: saveKey,
    });
    console.log(saveKey);
}

const style = StyleSheet.create({
    Infogroup: {
        marginBottom: 28,
    },
    Answer: {
        fontSize: 18,
        fontStyle: "italic",
        textTransform: "capitalize",
    },
});
