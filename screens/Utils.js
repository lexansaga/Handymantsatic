var DefaultProfile =
    "https://firebasestorage.googleapis.com/v0/b/handymantastic-80f66.appspot.com/o/Assets%2FProfile%2Fdefault-profile.jpg?alt=media&token=efe7ad46-1b02-464c-9a88-35a99009f263";

function PriceFormat(price) {
    return `$${price}`;
}
function IsNullOrEmpty(value) {
    return value === null || value === undefined || value === "";
}
export { DefaultProfile, PriceFormat, IsNullOrEmpty };
