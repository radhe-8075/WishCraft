import { auth, db } from "./firebase.js";
import {
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const WISHES_COLLECTION = "wishes";
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_THEMES = new Set(["classic", "pink", "royal", "kids"]);

const IMAGE_EXTENSIONS = Object.freeze({
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif"
});
const CLOUDINARY_CLOUD_NAME = "c4ixcwio";
const CLOUDINARY_UPLOAD_PRESET = "wishcraft_upload";

async function uploadToCloudinary(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Cloudinary Upload Failed");
    }

    return await response.json();
}
// 👇 Fir ye line aayegi

let initialAuthStatePromise;
let anonymousSignInPromise;

function validationError(message) {
    const error = new Error(message);
    error.name = "WishValidationError";
    return error;
}

function waitForInitialAuthState() {
    if (!initialAuthStatePromise) {
        initialAuthStatePromise = new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });
        });
    }

    return initialAuthStatePromise;
}

/**
 * Returns the current Firebase user, creating a persisted anonymous account
 * when the visitor has not signed in yet.
 */
export async function ensureAnonymousUser() {
    const existingUser = auth.currentUser || await waitForInitialAuthState();

    if (existingUser) {
        return existingUser;
    }

    if (!anonymousSignInPromise) {
        anonymousSignInPromise = signInAnonymously(auth)
            .then((credential) => credential.user)
            .finally(() => {
                anonymousSignInPromise = null;
            });
    }

    return anonymousSignInPromise;
}

function normalizeRequiredText(value, label, maxLength) {
    if (typeof value !== "string") {
        throw validationError(`${label} is required.`);
    }

    const text = value.trim();

    if (!text) {
        throw validationError(`${label} is required.`);
    }

    if (text.length > maxLength) {
        throw validationError(`${label} must be ${maxLength} characters or fewer.`);
    }

    return text;
}

function normalizeOptionalText(value, label, maxLength) {
    if (value === undefined || value === null || value === "") {
        return "";
    }

    if (typeof value !== "string") {
        throw validationError(`${label} must be text.`);
    }

    const text = value.trim();

    if (text.length > maxLength) {
        throw validationError(`${label} must be ${maxLength} characters or fewer.`);
    }

    return text;
}

function normalizeBirthdayDate(value) {
    const birthdayDate = normalizeOptionalText(value, "Birthday date", 10);

    if (!birthdayDate) {
        return "";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdayDate)) {
        throw validationError("Birthday date must use the YYYY-MM-DD format.");
    }

    const parsedDate = new Date(`${birthdayDate}T00:00:00.000Z`);

    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== birthdayDate) {
        throw validationError("Birthday date is not valid.");
    }

    return birthdayDate;
}

function normalizeTheme(value) {
    const theme = normalizeOptionalText(value, "Theme", 32).toLowerCase();

    if (!theme) {
        return "pink";
    }

    if (!ALLOWED_THEMES.has(theme)) {
        throw validationError("Theme is not valid.");
    }

    return theme;
}

function normalizeFiles(files) {
    const photoFiles = Array.from(files || []);

    if (photoFiles.length > MAX_PHOTOS) {
        throw validationError(`You can upload up to ${MAX_PHOTOS} photos.`);
    }

    photoFiles.forEach((file, index) => {
        if (!file || typeof file.size !== "number" || typeof file.type !== "string") {
            throw validationError(`Photo ${index + 1} is not a valid image file.`);
        }

        const mimeType = file.type.toLowerCase();

        if (!Object.hasOwn(IMAGE_EXTENSIONS, mimeType)) {
            throw validationError(
                `Photo ${index + 1} must be a JPG, PNG, WEBP, GIF, AVIF, HEIC, or HEIF image.`
            );
        }

        if (file.size <= 0) {
            throw validationError(`Photo ${index + 1} is empty.`);
        }

        if (file.size > MAX_PHOTO_BYTES) {
            throw validationError(`Photo ${index + 1} must be 5 MB or smaller.`);
        }
    });

    return photoFiles;
}

function createStorageFileName(index, mimeType) {
    const uniquePart = globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${index + 1}-${uniquePart}.${IMAGE_EXTENSIONS[mimeType]}`;
}

function normalizeWishId(wishId) {
    if (typeof wishId !== "string") {
        throw validationError("Wish ID is missing or invalid.");
    }

    const id = wishId.trim();

    if (!/^[A-Za-z0-9_-]{8,128}$/.test(id)) {
        throw validationError("Wish ID is missing or invalid.");
    }

    return id;
}

function isSafePhotoUrl(value) {
    if (typeof value !== "string") {
        return false;
    }

    try {
        return new URL(value).protocol === "https:";
    } catch {
        return false;
    }
}

async function uploadWishPhoto({ ownerUid, wishId, file, index, uploadedRefs }) {

    const data = await uploadToCloudinary(file);

    return {
        path: data.public_id,
        url: data.secure_url
    };

}
function toPublicWish(wishId, data) {
    const photoUrls = Array.isArray(data.photoUrls)
        ? data.photoUrls.filter(isSafePhotoUrl)
        : [];

    return {
        id: wishId,
        recipientName: typeof data.recipientName === "string"
            ? data.recipientName
            : "Friend",
        senderName: typeof data.senderName === "string"
            ? data.senderName
            : "",
        birthdayDate: typeof data.birthdayDate === "string"
            ? data.birthdayDate
            : "",
        message: typeof data.message === "string"
            ? data.message
            : "",
        theme: typeof data.theme === "string"
            ? data.theme
            : "pink",
        photoUrls,
        createdAt: data.createdAt?.toDate?.().toISOString?.() || null
    };
}

/**
 * Creates a published Firestore wish and uploads its photos to Storage.
 *
 * @param {object} input
 * @param {string} input.recipientName - Birthday person's name.
 * @param {string} [input.senderName]
 * @param {string} [input.birthdayDate] - YYYY-MM-DD.
 * @param {string} input.message
 * @param {string} [input.theme]
 * @param {FileList|File[]} [input.files]
 * @returns {Promise<string>} The generated Firestore wish ID.
 */
export async function createShareableWish(input = {}) {
    const recipientName = normalizeRequiredText(
        input.recipientName ?? input.birthdayName,
        "Birthday person's name",
        100
    );
    const senderName = normalizeOptionalText(input.senderName, "Your name", 100);
    const birthdayDate = normalizeBirthdayDate(input.birthdayDate);
    const message = normalizeRequiredText(input.message, "Custom message", 2000);
    const theme = normalizeTheme(input.theme);
    const files = normalizeFiles(input.files ?? input.photos);
    const user = await ensureAnonymousUser();
    const wishRef = doc(collection(db, WISHES_COLLECTION));
    const uploadedRefs = [];

    try {
        const uploadedPhotos = [];

        for (const [index, file] of files.entries()) {
            uploadedPhotos.push(
                await uploadWishPhoto({
                    ownerUid: user.uid,
                    wishId: wishRef.id,
                    file,
                    index,
                    uploadedRefs
                })
            );
        }

        const photoUrls = uploadedPhotos.map((photo) => photo.url);

        await setDoc(wishRef, {
            schemaVersion: 1,
            status: "published",
            ownerUid: user.uid,
            recipientName,
            senderName,
            birthdayDate,
            message,
            theme,
            photoUrls,
            photoPaths: uploadedPhotos.map((photo) => photo.path),
            photoCount: photoUrls.length,
            createdAt: serverTimestamp(),
            publishedAt: serverTimestamp()
        });

        return wishRef.id;
   } catch (error) {
    throw error;
}
}

/**
 * Loads the public fields needed to render a shared wish. Missing and
 * unpublished wishes deliberately return null.
 */
export async function getShareableWish(wishId) {
    const id = normalizeWishId(wishId);

    // This lets Firestore rules require an authenticated (anonymous) visitor
    // without showing the recipient a sign-in screen.
    await ensureAnonymousUser();

    const snapshot = await getDoc(doc(db, WISHES_COLLECTION, id));

    if (!snapshot.exists() || snapshot.data().status !== "published") {
        return null;
    }

    return toPublicWish(snapshot.id, snapshot.data());
}
