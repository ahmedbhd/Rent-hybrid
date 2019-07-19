// export const FIREBASE_CONFIG = {
//   apiKey: "AIzaSyDJDK8xsXzP3cSeIe_2kaaWyVZzmzhcXZ8",
//   authDomain: "rent-ffced.firebaseapp.com",
//   databaseURL: "https://rent-ffced.firebaseio.com",
//   projectId: "rent-ffced",
//   storageBucket: "",
//   messagingSenderId: "474194000861",
//   appId: "1:474194000861:web:58a5158b3fe293ef"
// };


export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDAqLU0PKWG-OhKnitMwLMl92GK8Cj2gX4",
  authDomain: "test-53006.firebaseapp.com",
  databaseURL: "https://test-53006.firebaseio.com",
  projectId: "test-53006",
  storageBucket: "test-53006.appspot.com",
  messagingSenderId: "317894044451",
  appId: "1:317894044451:web:cdcaa7ff7cabe3b9"
};

// @ts-ignore
export const snapshotToArray = snapshot => {
  let returnArray =[];
  snapshot.forEach( element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });
  return returnArray;
};

