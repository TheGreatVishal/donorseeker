# 💖 Donor Seeker

## 🧭 Overview  
**Donor Seeker** is a full-stack web application that bridges the gap between donors and seekers. It provides a platform where donors can list items for donation and seekers can browse, request, and receive those items. Admins have tools to manage listings and monitor platform activity. The system integrates 🔐 OTP verification, secure authentication, 🤖 AI-based request scoring, and 📋 detailed activity logging.

## ✨ Features  

- 🔐 **User Authentication**  
  - 📝 Registration & Login  
  - 📲 OTP Verification  
  - 🔁 Forgot Password (Reset Password)  
  - 💪 Password Strength Validation  

- 🎁 **Donation Process**  
  - 🙋‍♂️ Donors can list items for donation  
  - 🌐 Unregistered users can browse listings (Login required to view details)  
  - 👥 Registered users can see item details  
  - 🛡️ Admins can approve/unapprove donations  

- 🤖 **AI Scoring**  
  - ✉️ Requests are scored using AI based on the urgency level in the message  
  - ⏫ More needy requests appear at the top of donor’s request list  

- 🏆 **Leaderboard**  
  - 🌟 Displays top donors based on verified transactions  

- 🧾 **Logging System**  
  - 🕵️ Tracks every significant action:  
    - userEmail, ipAddress, timestamp, section, requestType, statusCode, description, endpoint  

- ⚙️ **Tech Stack**  
  - 💻 Frontend: Next.js, TypeScript, Tailwind CSS  
  - 🧠 Backend: Next.js API routes  
  - 🗄️ Database: PostgreSQL (via Prisma)  
  - 🔐 Authentication: NextAuth.js  
  - 📷 Cloudinary: Image upload  
  - 🧠 AI Scoring: Groq integration  
  - 📊 Logging: Custom-built logging system with exportable CSV  

## 📈 Codebase Insights
- 💻 Total Lines of Code: `18,681+`
- 🚧 Actively maintained and growing!

## 🗂️ Project Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   └── listings/
│   │       └── [id]/page.tsx
|   |
│   ├── api/
│   │   ├── admin/
│   │   │   ├── route.ts
│   │   │   └── listings/
│   │   │       └── [id]/route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── forgot-password-otp/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── send-otp/route.ts
│   │   │   ├── verify-admin-key/route.ts
│   │   │   └── verify-otp/route.ts
│   │   ├── donations/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   ├── recent-donations/route.ts
│   │   │   └── request/route.ts
│   │   ├── image-upload/route.ts
│   │   ├── leaderboard/route.ts
│   │   ├── my-dashboard/
│   │   │   ├── donations/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── requirements/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── requirements/
│   │   │   ├── route.js
│   │   │   ├── [id]/route.js
│   │   │   └── categories/route.js
│   │   ├── transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── feedback/route.ts
│   │   │       └── receive/route.ts
│   │   ├── requests/
│   │   │   ├── [id]/cancel/route.ts
│   │   │   └── user/route.ts
│   │   ├── user/
│   │   │   └── profiles/route.ts
│   │   ├── stats/route.ts
│   │   └── logs/
│   │       ├── route.ts
│   │       ├── endpoints/route.ts
│   │       ├── export/route.ts
│   │       ├── sections/route.ts
│   │       └── stats/route.ts
|   |
│   ├── browse-donations/
│   │   └── [id]/page.tsx
│   │   └── page.tsx
|   |
│   ├── donate/
│   │   ├── success/page.tsx
│   │   └── page.tsx
|   |
│   ├── home/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── sign-out-button.tsx
|   |
│   ├── how-it-works/
│   │   └── page.tsx
|   |
│   ├── loginSystem/
│   │   ├── forgot-password/page.tsx
│   │   ├── login/
│   │   │   ├── loading.tsx
│   │   │   └── page.ts
│   │   ├── signup/
│   │   │   ├── action.ts
│   │   │   └── page.tsx
│   │   └── layout.tsx
|   |
│   ├── globals.css
│   ├── layout.tsx
│   ├── logo.ico
│   └── page.tsx
|   
├── components/
├── lib/
│   ├── jwt.ts
│   ├── mail.ts
│   ├── prisma.ts
│   └── utils.ts
|
├── types/
│   └── next-auth.d.ts
|
└── middleware.ts

```

## 🛠️ Prerequisites  
Ensure you have the following installed:  
- 🟢 **Node.js** (Latest LTS version recommended)  
- 🧶 **Yarn** (Package Manager)  

## 🚀 Installation & Running the Project  

### 1. 📦 Clone the Repository  
```sh
git clone https://github.com/TheGreatVishal/donor-seeker.git
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