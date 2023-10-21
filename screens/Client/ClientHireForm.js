import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
} from "react-native";
import Header from "../../components/Header";
import ClientHome, { ClientServiceFeed } from "./ClientHome";
import Input from "../../components/Input";
import style from "../../styles/style";
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
} from "../../config/firebase.config";
import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
    DefaultProfile,
    IsNullOrEmpty,
    IsTextEmpty,
    NumberFormat,
    PriceFormat,
} from "../Utils";
export default function ClientHireForm({ navigation, route }) {
    // const [name, contact, date, time, location] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Contact, Password, Profile, Type, UID } = userInfo;
    const { SPI_Email, SPI_UID } = route.params.ServiceProviderInfo;
    const [serviceProviderInfo, setServiceProviderInfo] = useState([]);

    const sideNavigation = useNavigation();
    console.log(SPI_Email);
    // setName(Name)
    let getServiceProviderInfo = async () => {
        await get(child(databaseRef, `Users/${SPI_UID}/`)).then((snapshot) => {
            console.log(snapshot.val());
            setServiceProviderInfo(snapshot.val());
        });
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            onRefresh();
        } else {
            setServiceProviderInfo([]);
        }
    }, [isFocused]);

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getServiceProviderInfo();
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        console.log(Name);
        setName(Name);
        setContact(Contact);

        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={{ paddingBottom: 100 }}>
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
                <View style={styles.MainWrap}>
                    <ClientServiceFeed
                        image={null}
                        style={style.Info}
                        service={
                            IsNullOrEmpty(serviceProviderInfo.ServiceOffered)
                                ? "General Worker"
                                : serviceProviderInfo.ServiceOffered
                        }
                        name={serviceProviderInfo.Name}
                        price={PriceFormat(
                            IsNullOrEmpty(serviceProviderInfo.Rate)
                                ? 0
                                : serviceProviderInfo.Rate
                        )}
                    />

                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Job Information</Text>
                        <View style={styles.InputGroup}>
                            <Input
                                style={styles.Input}
                                placeholder={"Offer Price"}
                                value={price}
                                onChangeText={setPrice}
                                icon="tag"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"Describe your task"}
                                value={description}
                                onChangeText={setDescription}
                                icon="file-text"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>
                    </View>

                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Book Now!</Text>
                        <View style={styles.InputGroup}>
                            <Input
                                style={styles.Input}
                                placeholder={"Date of Work"}
                                value={date}
                                onChangeText={setDate}
                                icon="calendar"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />

                            <Input
                                style={styles.Input}
                                placeholder={"What Time?"}
                                value={time}
                                onChangeText={setTime}
                                icon="clock"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"Work Address"}
                                value={location}
                                onChangeText={setLocation}
                                icon="map-pin"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>
                    </View>

                    <View style={[style.Section]}>
                        <PrimaryButton
                            title={`Hire ${serviceProviderInfo.Name}`}
                            onPress={() => {
                                PostAJob();

                                function PostAJob() {
                                    if (
                                        // IsTextEmpty(serviceNeed) ||

                                        IsTextEmpty(price) ||
                                        IsTextEmpty(description) ||
                                        IsTextEmpty(date) ||
                                        IsTextEmpty(time) ||
                                        IsTextEmpty(location)
                                    ) {
                                        ShowToast(
                                            "Fill up all the information!"
                                        );
                                        return;
                                    }
                                    let service = IsNullOrEmpty(
                                        serviceProviderInfo.ServiceOffered
                                    )
                                        ? "General Work"
                                        : serviceProviderInfo.ServiceOffered;
                                    // var name = snap.Name;
                                    var save = push(ref(database, `Jobs`), {
                                        UserID: UID,
                                        Name: Name,
                                        ServiceNeed: service,
                                        Description: description,
                                        Price: price,
                                        Location: location,
                                        Time: time,
                                        Category: service,
                                        Active: false,
                                        PostedBy: Email,
                                        ClientID: UID,
                                        ServiceProviderID: `${serviceProviderInfo.UID}`,
                                    });
                                    var JobID = save.key;
                                    update(ref(database, `Jobs/${JobID}`), {
                                        ID: JobID,
                                    });

                                    // Job Order Starts Here!

                                    var saveJobOrder = push(
                                        ref(database, `JobOrder`),
                                        {
                                            JobID: `${JobID}`,
                                            ServiceProviderID: `${serviceProviderInfo.UID}`,
                                            ClientID: UID,
                                            Status: `Proposed`,
                                        }
                                    );
                                    var jobOrderKey = saveJobOrder.key;
                                    update(
                                        ref(
                                            database,
                                            `JobOrder/${jobOrderKey}`
                                        ),
                                        {
                                            ID: jobOrderKey,
                                        }
                                    );
                                    console.log(jobOrderKey);
                                    navigation.navigate("ClientSuccessBook", {
                                        OrderID: jobOrderKey,
                                    });
                                }
                                // navigation.navigate("ClientSuccessBook", {
                                //     key: "value",
                                // });
                            }}
                        />
                    </View>

                    <DatePicker
                        modal
                        open={dpOpen}
                        date={dpDate}
                        onConfirm={(dpDate) => {
                            dpSetOpen(false);
                            dpSetDate(dpDate);
                        }}
                        onCancel={() => {
                            dpSetOpen(false);
                        }}
                    />
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
    },
    MainWrap: {
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        overflow: "hidden",
        marginTop: "-10%",
        height: "110%",
        paddingBottom: 28,
        zIndex: 2,
        backgroundColor: "#fff",
    },
    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 12,
        marginLeft: -12,
    },
});
