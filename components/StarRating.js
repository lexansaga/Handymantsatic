import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StarRating = ({ rating, maxRating = 5, onRatingPress }) => {
    const [selectedRating, setSelectedRating] = useState(rating);

    const handleRatingPress = (newRating) => {
        setSelectedRating(newRating);
        if (onRatingPress) {
            onRatingPress(newRating);
        }
    };

    return (
        <View style={styles.ratingContainer}>
            {[...Array(maxRating)].map((_, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingPress(index + 1)}
                    activeOpacity={0.6}
                >
                    <Icon
                        name="star"
                        style={[
                            styles.star,
                            selectedRating >= index + 1
                                ? styles.filledStar
                                : styles.emptyStar,
                        ]}
                    />
                </TouchableOpacity>
            ))}
            {/* <Text style={styles.ratingText}>{selectedRating}</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    star: {
        fontSize: 25,
        color: "#E5C865",
    },
    filledStar: {
        color: "#E5C865",
    },
    emptyStar: {
        color: "#333",
    },
    ratingText: {
        marginLeft: 10,
        fontSize: 20,
    },
});

export default StarRating;
