# 🎂 WishCraft

A modern birthday wish website built using HTML, CSS and JavaScript.

## Features

- Dynamic Birthday Wishes
- Theme Selection
- Photo Gallery
- Surprise Gift Animation
- Responsive Design
- Premium UI

Developer:
Neeraj Baghel

## Shareable WhatsApp Links

Each completed form now creates a Firebase-backed wish with a unique link such as:

```text
https://wishcraft-b4107.web.app/wish.html?id=YOUR_WISH_ID
```

The link works on another phone because the birthday details are stored in Cloud Firestore and photo URLs are stored in Cloud Storage. Do not share `file:///...` or `localhost` links; they only work on the computer that created them.

### One-time Firebase Console setup

Open the `wishcraft-b4107` Firebase project and enable:

1. **Authentication** → **Sign-in method** → **Anonymous**.
2. **Cloud Firestore** database.
3. **Cloud Storage** bucket.
4. In **Authentication** → **Settings** → **Authorized domains**, add the deployed domain (for example `wishcraft-b4107.web.app`) if it is not already listed.

The project includes `firestore.rules` and `storage.rules`; deploy them with the site. Storage billing requirements depend on the Firebase plan and current Firebase policy.

### Deploy to Firebase Hosting

Install Node.js LTS, then run these commands in this repository's outer `WishCraft` folder:

```powershell
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage,hosting
```

After deployment, open `https://wishcraft-b4107.web.app/create.html`, create a wish, and share the generated WhatsApp link. The nested `WishCraft/` directory is an old duplicate and is intentionally excluded from deployment.
