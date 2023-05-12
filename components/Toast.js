import Toast from "react-native-simple-toast";

const ShowToast = (message) => {
    Toast.showWithGravityAndOffset(message, Toast.SHORT, Toast.CENTER, 0, 100);
    console.log(message);
};

export default ShowToast;
