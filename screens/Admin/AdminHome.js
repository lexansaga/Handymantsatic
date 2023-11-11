import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "../../styles/style";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import {
  database,
  databaseRef,
  ref,
  child,
  get,
  UserInfo,
  push,
  update,
  storage,
  firebaseBaseUrl,
} from "../../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { DefaultProfile, IsNullOrEmpty } from "../Utils";
import axios from "axios";

export default function AdminHome({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const {
    Email,
    Name,
    Contact,
    Rate,
    Password,
    Profile,
    Type,
    UID,
    JobDescription,
    ServiceOffered,
    Address,
  } = userInfo;

  const getUsers = async () => {
    const url = `${firebaseBaseUrl}/Users.json`;
    const response = await axios.get(url);
    console.log(url);
    return response.data;
  };

  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // UserInfo().then((user) => {
    //     setUserInfo(user);
    // });
    getUsers().then((data) => {
      setUsers(data);
    });
    console.log(users);
    console.log("Refresh");
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{ marginTop: -20 }}>
      <StatusBar style="auto" />
      <View style={style.AdminHeader}>
        <Header profile={Profile} isAdmin={true} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.Section}>
          <TextInput
            style={style.AdminSearch}
            onChangeText={setSearch}
            value={search}
            placeholder="Search User"
          />
          <Text style={styles.SectionTitle}>Users</Text>
          <View style={style.UserWrapper}>
            {Object.values(users).map((user) => {
              if (!IsNullOrEmpty(search)) {
                if (
                  user.Name.toLowerCase().includes(search.toLowerCase()) ||
                  user.ServiceOffered.toLowerCase().includes(
                    search.toLowerCase()
                  ) ||
                  user.UserType.toLowerCase().includes(search.toLowerCase())
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("AdminUsers", {
                          ID: user.UID,
                          Type: user.Type,
                        });
                      }}
                    >
                      <View style={style.UserItem}>
                        <View style={style.UserContent}>
                          <Image
                            source={{
                              uri: IsNullOrEmpty(user.Profile)
                                ? DefaultProfile
                                : user.Profile,
                            }}
                            style={style.UserImage}
                          />
                          <View style={style.UserInfo}>
                            <Text style={style.UserName}>{user.Name}</Text>
                            <Text style={style.UserType}>
                              {user.Type}{" "}
                              {!IsNullOrEmpty(user.ServiceOffered)
                                ? ` | ${user.ServiceOffered}`
                                : ""}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }
              } else {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("AdminUsers", {
                        ID: user.UID,
                        Type: user.Type,
                      });
                    }}
                  >
                    <View style={style.UserItem}>
                      <View style={style.UserContent}>
                        <Image
                          source={{
                            uri: IsNullOrEmpty(user.Profile)
                              ? DefaultProfile
                              : user.Profile,
                          }}
                          style={style.UserImage}
                        />
                        <View style={style.UserInfo}>
                          <Text style={style.UserName}>{user.Name}</Text>
                          <Text style={style.UserType}>
                            {user.Type}{" "}
                            {!IsNullOrEmpty(user.ServiceOffered)
                              ? ` | ${user.ServiceOffered}`
                              : ""}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  UserWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  AdminHeader: {
    display: "flex",
  },
  AdminSearch: {
    position: "relative",
    height: 100,
    verticalAlign: "top",
    maxHeight: 100,
    width: "100%",
    backgroundColor: "#ededed",
    paddingHorizontal: 18,
    paddingVertical: 0,
    fontSize: 15,
    borderRadius: 50,
    minHeight: 50,
    height: 50,
    marginTop: "auto",
    marginBottom: 20,
    fontFamily: "Roboto",
  },
  UserItem: {
    backgroundColor: "#7EB58D33",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  UserContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  UserImage: {
    height: 60,
    width: 60,
    borderRadius: 8,
  },
  UserName: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 4,
  },
  UserType: {
    fontWeight: 400,
    fontSize: 16,
    fontStyle: "italic",
  },
});
