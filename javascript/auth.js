import { auth } from "./firebase.js";
import {
    GoogleAuthProvider,
    signInWithPopup,
    linkWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

/**
 * Signs the visitor in with Google.
 * If they already have an anonymous account (created silently while
 * browsing/creating a wish), we LINK it to their Google account so their
 * existing wishes stay associated with them instead of being orphaned.
 */
export async function signInWithGoogle(){

    if(auth.currentUser && auth.currentUser.isAnonymous){

        try{

            const result = await linkWithPopup(auth.currentUser, provider);
            return result.user;

        } catch(err){

            // Google account already used elsewhere -> just sign in normally instead
            if(err.code === "auth/credential-already-in-use" || err.code === "auth/email-already-in-use"){

                const result = await signInWithPopup(auth, provider);
                return result.user;

            }

            throw err;

        }

    } else {

        const result = await signInWithPopup(auth, provider);
        return result.user;

    }

}

export async function signOutUser(){

    await signOut(auth);
    window.location.href = "index.html";

}

/**
 * Updates any "Login" button on the page to reflect the real signed-in state.
 * Call this on every page that has the shared navbar.
 */
export function initNavbarAuth(){

    const loginBtn = document.getElementById("loginBtn");

    if(!loginBtn) return;

    onAuthStateChanged(auth, (user) => {

        const isRealUser = user && !user.isAnonymous;

        if(isRealUser){

            loginBtn.textContent = user.displayName ? user.displayName.split(" ")[0] : "My Account";
            loginBtn.onclick = () => {
                window.location.href = "my-wishes.html";
            };

        } else {

            loginBtn.textContent = "Login";
            loginBtn.onclick = () => {
                window.location.href = "login.html";
            };

        }

    });

}
