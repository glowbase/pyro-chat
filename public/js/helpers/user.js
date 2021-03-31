//? ------------------------------------------------------------------------------------
//?
//?  /helpers/user.js
//?  Discord JS
//?
//?  Developed by Cooper Beltrami
//?
//?  Project built using designs, graphics and other assets developed by Discord Inc.
//?  Copyright (c) 2021 Cooper Beltrami and Discord Inc. All Rights Reserved
//?     
//? ------------------------------------------------------------------------------------


/**
 * 
 * @param {*} overrideStatus 
 */
async function setAutomaticStatus(overrideStatus) {

    // If user has manual status set, don't automatically set one
    if (window.localStorage.getItem('manual_status')) {
        return setStatus(window.localStorage.getItem('manual_status'));
    };
    
    let status = 'online';

    if (overrideStatus) {
        status = overrideStatus;
    } else {
        if (document.visibilityState === 'hidden') {
            status = 'idle';
        }
    }

    setStatus(status);
}


async function setStatus(status) {
    const { uid } = firebase.auth().currentUser;

    const userStatus = document.getElementById('userStatus');

    // Ask user what they are streaming.
    if (status === 'streaming') showStreamingStatusModal();

    userStatus.setAttribute('fill', STATUS_COLOURS[status]);
    userStatus.setAttribute('mask', `url(#svg-mask-status-${status})`);

    firebase.firestore().collection('users').doc(uid).set({
        status: status,
    }, {
        merge: true
    });
}


/**
 * 
 * @param {*} status 
 */
function manualSetStatus(status) {
    setStatus(status);

    // If user selects online status, clear existing manual status
    if (status === 'online') {
        window.localStorage.removeItem('manual_status');
    } else {
        window.localStorage.setItem('manual_status', status);
    }
}


/**
 * 
 */
async function uploadDefaultAvatar() {
    const { uid } = firebase.auth().currentUser;

    // Generate a random colour for the profile picture
    const avatars = ['blue', 'green', 'yellow', 'red'];
    const index = generateRandom(0, avatars.length - 1);
    const path = `/img/avatar_${avatars[index]}.png`;

    // Get image into blob format for upload
    const blob = await (await fetch(path)).blob();

    // Upload image to Firebase Storage
    await firebase.storage().ref(`/avatars/${uid}.gif`).put(blob);
}


/**
 * 
 * @param {*} userId
 * @returns 
 */
function getAvatar(userId) {
    const path = 'https://firebasestorage.googleapis.com/v0/b/djs-clone.appspot.com/o/avatars%2F';
    let { uid } = firebase.auth().currentUser;
    
    if (userId) uid = userId;

    return `${path}${uid}.gif?alt=media`;
}


/**
 * 
 * @param {*} discriminator 
 * @returns 
 */
async function doesDiscriminatorExist(discriminator) {
    const ref = firebase.firestore().collection('users');
    let snapshot = await ref.where('profile.discriminator', '==', discriminator).get();

    snapshot.forEach(() => {
        snapshot = true;
    });

    return snapshot === true ? true : false;
}


/**
 * 
 * @returns
 */
async function generateDiscriminator() {
    let valid = false;
    let discriminator = 0;

    do {
        discriminator = generateRandom(0, 9999);

        const query = await doesDiscriminatorExist(discriminator);
    
        if (!query) valid = true;
    } while (valid === false);

    discriminator = pad(discriminator, 4);

    return discriminator;
}


/**
 * 
 */
async function signout() {
    await firebase.auth().signOut();
}


/**
 * 
 * @param {*} username
 * @returns 
 */
async function getUserByFullUsername(fullUsername) {
    const ref = firebase.firestore().collection('users');
    let snapshot = await ref.where('profile.full_username', '==', fullUsername).get();

    snapshot.forEach(user => {
        snapshot = {
            ...user.data().profile,
            uid: user.id,
        }
    });

    return snapshot.uid ? snapshot : false;
}


/**
 * 
 * @param {*} username 
 * @returns 
 */
async function isFriend(username) {
    const { uid } = firebase.auth().currentUser;
    const user = await getUserByFullUsername(username);

    if (!user) return false;

    const friends = await (
        await firebase.firestore().collection('friends').doc(uid).get()
    ).data();

    if (friends === undefined) return false;
    return friends;
}