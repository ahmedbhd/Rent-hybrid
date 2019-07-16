export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJDK8xsXzP3cSeIe_2kaaWyVZzmzhcXZ8",
  authDomain: "rent-ffced.firebaseapp.com",
  databaseURL: "https://rent-ffced.firebaseio.com",
  projectId: "rent-ffced",
  storageBucket: "",
  messagingSenderId: "474194000861",
  appId: "1:474194000861:web:58a5158b3fe293ef"
};

export const snapshotToArray = snapshot => {
  let returnArray =[];
  snapshot.forEach( element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });
  return returnArray;
};

