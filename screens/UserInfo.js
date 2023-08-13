// import React, { useState, useEffect } from "react";
// import {
//     app,
//     auth,
//     onAuthStateChanged,
//     database,
//     set,
//     update,
//     ref,
//     push,
//     get,
//     child,
//     databaseRef,
// } from "../config/firebase.config.js";

// const getUser = async () => {
//     const currentUserUID = auth.currentUser.uid;

//     console.error(currentUserUID);
//     const [User, setUserInfo] = useState([]);
//     await get(child(databaseRef, `Users/${currentUserUID}/`)).then(
//         (snapshot) => {
//             setUserInfo(snapshot.val());
//             console.error(snapshot.val());
//         }
//     );

//     return User;
// };
// const User = getUser();
// console.log("User");
// console.log(User);

// export { User };
