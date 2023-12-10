#### FIREBASE AUTH & FIRESTORE SIMPLE CRUD

#### Setup

#### How to test in postman


REGISTER
```bash
(POST) localhost:3000/api/vi/auth/register
```

```bash
npm install
```

#### setup env
```bash
  FIREBASE_API_KEY = 
  FIREBASE_AUTH_DOMAIN = 
  PROJECT_ID =
  STORAGE_BUCKET =
  MESSAGING_SENDER_ID =
  APP_ID =
  MEASUREMENT_ID =
```

#### download service-account.json
```bash
  1. go to https://console.firebase.google.com
  2. Project Overview
  3. Project Settings
  4. Service accounts
  5. Generate new private key
  6. After download .json file change to service-account.json
  7. Move service-account.json to folder db
```