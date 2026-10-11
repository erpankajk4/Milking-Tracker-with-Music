# **📝 Fullstack Assignment: Milking Tracker with Music 🎵🐄**

### **📌 Overview**

Dairy farmers often face challenges in ensuring a stress-free environment for cattle. Studies indicate that **playing soothing music** can **reduce stress and increase milk yield** by up to **3%**. This assignment involves building a **mobile-first web application** that helps farmers track **milking sessions** while playing **relaxing music** for the cattle.

This task will help us evaluate **your ability to develop both frontend and backend components**, integrate them seamlessly, and build a **user-friendly** experience.

---

## **🎯 Assignment Requirements**

### **🖥️ Frontend (React \+ Next.js)**

You will **design and implement a mobile-friendly UI** that allows users to **track milking sessions**, play calming music, and review past records.

✅ **Main Features**

* **Landing Page**  
  * A **simple, clutter-free UI** with a "Start Milking" button.  
  * A **link to the Milking History page**.  
* **Milking Session**  
  * When the user clicks **"Start Milking"**:

    * Music should start playing (use provided assets).  
    * A **big, ticking timer** should be displayed.  
    * The button should change to **"Pause" and "Stop"**.  
  * **Pause & Resume**

    * Pausing should **pause both the music and timer**.  
    * Resuming should **resume both**.  
  * **Stop**

    * Ends the session and **prompts the user** to enter the **quantity of milk collected**.

✅ **Milking History Page**

* Displays **past milking sessions** in a **table format**.  
* Columns: **Date | Start Time | End Time | Duration | Milk Collected**.  
* Data should be **fetched from the backend API**.

✅ **API Integration**

* All data should be stored and retrieved from the **backend** via API calls.  
* No dummy data or hardcoded values.

---

### **🖥️ Backend (Node.js \+ Express \+ MySQL/MongoDB)**

The backend will handle **data storage and retrieval**.

✅ **API Endpoints**

1. `POST /sessions` → Save milking session details.

Request Body:  
`{`  
  `"start_time": "2025-03-10T14:00:00Z",`  
  `"end_time": "2025-03-10T14:15:00Z",`  
  `"duration": 900,`  
  `"milk_quantity": 5.2`  
`}`

*   
2. `GET /sessions` → Retrieve all milking sessions.

Response Example:  
`[`  
  `{`  
    `"id": 1,`  
    `"start_time": "2025-03-10T14:00:00Z",`  
    `"end_time": "2025-03-10T14:15:00Z",`  
    `"duration": 900,`  
    `"milk_quantity": 5.2`  
  `}`  
`]`

* 

✅ **Database Schema**

* Store session data in a **MySQL or MongoDB** database.  
* Suggested **Schema/Table**: `milking_sessions`  
  * `id` (UUID or Auto-increment)  
  * `start_time` (datetime)  
  * `end_time` (datetime)  
  * `duration` (integer, in seconds)  
  * `milk_quantity` (float)  
  * `created_at` (timestamp)

---

## **🎨 UI & Backend Showcase**

This assignment is flexible.

* If **you’re stronger in UI**, make the interface clean, responsive, and interactive.  
* If **you’re stronger in backend**, focus on writing efficient APIs, proper error handling, and a scalable database design.  
* **If you're good at both, make a balanced effort\!**

---

## **🚀 Technical Expectations**

### **📌 Frontend**

 ✅ **Next.js \+ React** (Server-Side Rendering if needed)  
 ✅ **Mobile-first approach**  
 ✅ **API calls for fetching & storing data**  
 ✅ **Simple, minimal, and functional UI**  
 ✅ **Periodic commits to GitHub**

### **📌 Backend**

 ✅ **Node.js \+ Express**  
 ✅ **MySQL or MongoDB** (Use ORM like Sequelize/Mongoose if preferred)  
 ✅ **Secure, RESTful API**  
 ✅ **Proper error handling and validations**  
 ✅ **Efficient database queries**

---

## **📌 Sample Assets**

🎵 **Sample music files for playback:** [Download Here](https://drive.google.com/drive/folders/1e9rTSel3y0VxosZw4YhzecRka7hURVbM)

---

## **📩 Submission Guidelines**

1. **Host the application**

   * Frontend: Use **Netlify/Vercel** or similar  
   * Backend: Use **Render/Railway/Heroku** or similar

2. **Create a Private GitHub Repository**

   * Add these **collaborators**:  
     * `libinvbabu`  
     * `RashikAnsar`  
     * `Souravendra`  
     * `Ashwin746544`  
3. **Email Submission to:**

   * 📧 **assignments@animall.in**  
   * CC: **libin@animall.in**  
   * **Subject:** `[Milking Tracker] Your Name - Assignment Submission`  
   * Include:  
     * Hosted **application link**  
     * **GitHub repository link**

---

## 

## **⏳ Time Management**

🚨 **Don't overdo it\!**  
 This assignment is designed to be **completed in a day.**

💡 **Keep track of your time** and mention the **total time spent** in the email.

---

## 

## **💡 Final Notes**

* **Commit periodically** with clear messages so we can see your development approach.  
* **Focus on functionality over perfection** – a **simple, working** solution is better than an incomplete, over-engineered one.  
* **If you need extra time, inform us in advance**