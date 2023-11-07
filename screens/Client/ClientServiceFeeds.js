import React, { useState, useEffect, useLayoutEffect } from "react";
import Header from "../../components/Header";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ClientServiceFeed } from "./ClientHome";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    ref,
    child,
    get,
    onValue,
    getDataOnce,
    UserInfo,
    firebaseBaseUrl,
} from "../../config/firebase.config";
import {
    DefaultProfile,
    IsNullOrEmpty,
    IsTextEmpty,
    IsTextEmptyFallback,
} from "../Utils";
import { PriceFormat } from "../Utils";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { collection, query, where } from "firebase/firestore";
import axios from "axios";
export default function ClientServiceFeeds({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Category, SearchKey } = route.params;
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const [jobs, setJobs] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [workers, setWorkers] = useState([]);
    const [feeds, setFeeds] = useState([]);

    //   const getWorkers = async () => {
    //     await get(child(databaseRef, "Users/")).then((worker) => {
    //       let workerSnap = worker.val();
    //       setWorkers(workerSnap);
    //     });
    //   };
    const getWorkers = async () => {
        const url = `${firebaseBaseUrl}/Users.json`;
        const response = await axios.get(url);
        return response.data;
    };
    const isFocused = useIsFocused();
    useLayoutEffect(() => {
        console.log(`Focused ${isFocused}`);
        if (isFocused === true) {
            onRefresh();
            UserInfo().then((user) => {
                setUserInfo(user);
            });
        } else {
            navigation.setParams({ Category: null, SearchKey: null });
        }
    }, [isFocused]);
    const onRefresh = () => {
        setRefreshing(true);
        // getJobs();
        getWorkers().then((data) => {
            setWorkers(data);
            console.log(data);
            var feedsArr = [];
            Object.values(data).map((worker) => {
                if (worker.Type.includes("Client")) {
                    console.log("Is Client");
                    return;
                }
                if (IsNullOrEmpty(Category) === false) {
                    console.log("Category Empty");
                    if (!Category.includes(worker.ServiceOffered)) {
                        return <></>;
                    }
                }
                if (!IsNullOrEmpty(SearchKey)) {
                    if (
                        IsTextEmptyFallback(
                            worker.ServiceOffered,
                            `General Worker`
                        )
                            .toLowerCase()
                            .includes(SearchKey.toLowerCase()) ||
                        IsTextEmptyFallback(worker.Name, `Name`)
                            .toLowerCase()
                            .includes(SearchKey.toLowerCase())
                    ) {
                        console.log("Has Search Key");
                        // console.log(hasSearch);
                        feedsArr.push(
                            <Feed
                                service={
                                    IsNullOrEmpty(worker.ServiceOffered)
                                        ? "General Worker"
                                        : worker.ServiceOffered
                                }
                                image={{
                                    uri: IsNullOrEmpty(worker.Profile)
                                        ? DefaultProfile
                                        : worker.Profile,
                                }}
                                name={worker.Name}
                                price={PriceFormat(
                                    IsNullOrEmpty(worker.Rate) ? 0 : worker.Rate
                                )}
                                cover={
                                    IsNullOrEmpty(worker.JobDescription)
                                        ? `I ${worker.Name} is always happy to work with you!`
                                        : worker.JobDescription
                                }
                                onpress={() => {
                                    navigation.navigate("Client Hire Form", {
                                        ...route.params,
                                        ServiceProviderInfo: {
                                            SPI_Email: worker.Email,
                                            SPI_UID: worker.UID,
                                        },
                                    });
                                }}
                            />
                        );
                    }
                } else {
                    console.log("No Search Key");
                    feedsArr.push(
                        <Feed
                            service={
                                IsNullOrEmpty(worker.ServiceOffered)
                                    ? "General Worker"
                                    : worker.ServiceOffered
                            }
                            image={{
                                uri: IsNullOrEmpty(worker.Profile)
                                    ? DefaultProfile
                                    : worker.Profile,
                            }}
                            name={worker.Name}
                            price={PriceFormat(
                                IsNullOrEmpty(worker.Rate) ? 0 : worker.Rate
                            )}
                            cover={
                                IsNullOrEmpty(worker.JobDescription)
                                    ? `I ${worker.Name} is always happy to work with you!`
                                    : worker.JobDescription
                            }
                            onpress={() => {
                                navigation.navigate("Client Hire Form", {
                                    ...route.params,
                                    ServiceProviderInfo: {
                                        SPI_Email: worker.Email,
                                        SPI_UID: worker.UID,
                                    },
                                });
                            }}
                        />
                    );
                }

                setFeeds(feedsArr);
            });
        });
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView
                style={styles.CSFMainContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {feeds.map((feed, index) => {
                    {
                        return <>{feed}</>;
                    }
                })}
                {/* {Object.values(workers).map((worker) => {
          if (!IsNullOrEmpty(worker)) {
            if (
              IsNullOrEmpty(workers) ||
              // IsNullOrEmpty(worker.ServiceOffered) ||
              worker.Type.includes("Client")
            ) {
              console.log("Is Client");
              return;
            }
            if (IsNullOrEmpty(Category) === false) {
              console.log("Category Empty");
              if (!Category.includes(worker.ServiceOffered)) {
                return <></>;
              }
            }
            if (
              !IsNullOrEmpty(SearchKey) &&
              (worker.ServiceOffered.includes(SearchKey) ||
                worker.Name.includes(SearchKey) ||
                worker.Rate.includes(SearchKey))
            ) {
              return (
                <Feed
                  service={
                    IsNullOrEmpty(worker.ServiceOffered)
                      ? "General Worker"
                      : worker.ServiceOffered
                  }
                  image={{
                    uri: IsNullOrEmpty(worker.Profile)
                      ? DefaultProfile
                      : worker.Profile,
                  }}
                  name={worker.Name}
                  price={PriceFormat(
                    IsNullOrEmpty(worker.Rate) ? 0 : worker.Rate
                  )}
                  cover={
                    IsNullOrEmpty(worker.JobDescription)
                      ? `I ${worker.Name} is always happy to work with you!`
                      : worker.JobDescription
                  }
                  onpress={() => {
                    navigation.navigate("Client Hire Form", {
                      ...route.params,
                      ServiceProviderInfo: {
                        SPI_Email: worker.Email,
                        SPI_UID: worker.UID,
                      },
                    });
                  }}
                />
              );
            } else {
              return (
                <Feed
                  service={
                    IsNullOrEmpty(worker.ServiceOffered)
                      ? "General Worker"
                      : worker.ServiceOffered
                  }
                  image={{
                    uri: IsNullOrEmpty(worker.Profile)
                      ? DefaultProfile
                      : worker.Profile,
                  }}
                  name={worker.Name}
                  price={PriceFormat(
                    IsNullOrEmpty(worker.Rate) ? 0 : worker.Rate
                  )}
                  cover={
                    IsNullOrEmpty(worker.JobDescription)
                      ? `I ${worker.Name} is always happy to work with you!`
                      : worker.JobDescription
                  }
                  onpress={() => {
                    navigation.navigate("Client Hire Form", {
                      ...route.params,
                      ServiceProviderInfo: {
                        SPI_Email: worker.Email,
                        SPI_UID: worker.UID,
                      },
                    });
                  }}
                />
              );
            }
          }
        })} */}
            </ScrollView>
        </View>
    );
}

export function Feed({ service, image, name, price, cover, onpress }) {
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
        textAlign: "left",
        width: "100%",
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
