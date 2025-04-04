# Donor Seeker

## Overview
**Donor Seeker** is a platform that connects donors with seekers, allowing users to list and browse items for donation. Admins can manage the approval of listings, ensuring quality control. The platform includes authentication, OTP verification, and password security features.

## Features
- **User Authentication**
  - Registration & Login
  - OTP Verification
  - Forgot Password (Reset Password)
  - Password Strength Validation

- **Donation Process**
  - Donors can list items for donation
  - Unregistered users can browse listings (Login required to view details)
  - Registered users can see item details
  - Admins can approve/unapprove donations

## Project Structure
```
src/
│── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── listings/[id]/page.tsx
│   ├── api/
│   │   ├── admin ├── listings ├── [id]/route.ts
│   │   |         ├── route.ts
│   │   ├── auth  ├── [...nextauth] 
│   │   |         ├── forgot-password-otp
│   │   |         ├── register
│   │   |         ├── reset-password
│   │   |         ├── send-otp
│   │   |         ├── verify-admin-key
│   │   |         ├── verify-otp
│   │   ├── donations  ├── [id]/route.ts
│   │   |              ├── route.ts
│   │   ├── image-upload/route.ts
│   ├── browse-donations/
│   │   ├── [id]
│   │   │   ├── page.tsx
│   │   │── page.tsx
│   ├── donate/
│   │   ├── success/page.tsx
│   │   ├── page.tsx
│   ├── home/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sign-out-button.tsx
│   ├── how-it-works/
│   │   ├── page.tsx
│   ├── loginSystem/
│   │   ├── forgot-password/page.tsx
│   │   ├── login  ├── loading.tsx
│   │   |          ├── page.ts
│   │   ├── signup ├── action.ts
│   │   |          ├── page.tsx
│   │   ├── layout.tsx
|   ├── globals.css   
|   ├── layout.tsx   
|   ├── logo.ico   
|   ├── page.tsx   
│── components
│── lib ├── jwt.ts
│       ├── mail.ts
│       ├── prisma.ts
│       ├── utils.ts
│── types ├── next-auth.d.ts
│── middleware.ts
```

## Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **Yarn** (Package Manager)

## Installation & Running the Project

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/donor-seeker.git
cd donor-seeker
```

### 2. Install Dependencies
```sh
yarn install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and configure the required environment variables.
```sh
DATABASE_URL=<your_database_url>
EMAIL_USER=<email_which_is_used_for_otp_sending>
EMAIL_PASS=<app_password_of_email>

NEXTAUTH_URL=<http://localhost:3000>
NEXTAUTH_SECRET=<your_nextauth_secret>
SECRET_KEY=<secret-key>

CLOUDINARY_CLOUD_NAME=<>
CLOUDINARY_API_KEY=<>
CLOUDINARY_API_SECRET=<>
CLOUDINARY_UPLOAD_PRESET=<>

CLOUDINARY_URL=<>

ADMIN_KEY=<>
```

### 4. Run the Development Server
```sh
yarn dev
```
Access the app at **http://localhost:3000**.

### 5. Build & Start for Production
```sh
yarn build
yarn start
```

## Contributing
Feel free to submit issues or feature requests. Contributions are welcome!

## License
This project is licensed under the **MIT License**.

---
**Developed by Vishal Solanki** 🚀