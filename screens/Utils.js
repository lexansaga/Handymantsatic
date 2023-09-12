const DefaultProfile =
    "https://firebasestorage.googleapis.com/v0/b/handymantastic-80f66.appspot.com/o/Assets%2FProfile%2Fdefault-profile.jpg?alt=media&token=efe7ad46-1b02-464c-9a88-35a99009f263";

function PriceFormat(price) {
    return `$${price}`;
}
function IsNullOrEmpty(value) {
    return value === null || value === undefined || value === "";
}
function IDFormat(value) {
    value = value ? value : "";
    return "#" + value.replace(/[^a-zA-Z]/g, "").slice(-6);
}
function NumberFormat(phoneNumber) {
    if (IsNullOrEmpty(phoneNumber)) return;
    // Remove any non-numeric characters from the input
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the numericPhoneNumber has a valid length (10 digits)
    if (numericPhoneNumber.length === 10) {
        // Format the number as +639 12 345 6789
        return `+639 ${numericPhoneNumber.substring(
            1,
            3
        )} ${numericPhoneNumber.substring(3, 6)} ${numericPhoneNumber.substring(
            6
        )}`;
    } else {
        // If the input is not a valid phone number, return an error message or handle it as needed
        return "Invalid phone number";
    }
}
const IsTextEmpty = (text) => {
    return !text || text.trim().length === 0;
};
export {
    DefaultProfile,
    PriceFormat,
    IsNullOrEmpty,
    IDFormat,
    NumberFormat,
    IsTextEmpty,
};