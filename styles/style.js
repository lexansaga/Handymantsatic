//Handle Global app styling
import { StyleSheet } from "react-native";
import { vh } from "react-native-expo-viewport-units";
const styles = StyleSheet.create({
    container: {
        display: "flex",
        backgroundColor: "#fffff",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        maxWidth: "80%",
        margin: "auto",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "column",
        gap: 10,
    },
    btnText: {
        color: "#ffffff",
        fontWeight: "500",
        textTransform: "uppercase",
        fontSize: 16,
        fontFamily: "Roboto",
        textAlign: "center",
    },
    btn: {
        borderRadius: 50,
        paddingVertical: 18,
        paddingHorizontal: 28,
        alignSelf: "center",
        // width: "fi ",
    },
    btnPrimary: {
        backgroundColor: "#7EB58D",
    },
    btnSecondary: {
        backgroundColor: "#3DB6D0",
    },

    inputContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
    },
    input: {
        width: "100%",
        backgroundColor: "#ededed",
        paddingHorizontal: 18,
        paddingLeft: 48,
        fontSize: 15,
        borderRadius: 5,
        minHeight: 50,
        fontFamily: "Roboto",
    },
    inputSearch: {
        width: "100%",
        backgroundColor: "#ededed",
        paddingHorizontal: 18,
        paddingVertical: 0,
        fontSize: 15,
        borderRadius: 50,
        minHeight: 40,
        height: 40,
        marginTop: "auto",
        marginBottom: "auto",
        fontFamily: "Roboto",
    },
    inputIcon: {
        position: "relative",
        top: 13,
        left: 30,
        zIndex: 2,
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
        marginBottom: 10,
    },
});

export default styles;
