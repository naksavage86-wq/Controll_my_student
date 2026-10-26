# ប្រព័ន្ធគ្រប់គ្រងសិស្សានុសិស្ស - SchoolPro
> School Information & Student Management System (ប្រព័ន្ធព័ត៌មានវិទ្យាសាលារៀន)

ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យសិស្សានុសិស្ស វត្តមាន ពិន្ទុ ព្រឹត្តិបត្រពិន្ទុ និងថ្លៃសិក្សា ប្រកបដោយប្រសិទ្ធភាពខ្ពស់ បង្កើតឡើងដោយប្រើប្រាស់ **React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons**។

---

## 🚀 មុខងារសំខាន់ៗ (Features)

- **ផ្ទាំងគ្រប់គ្រង (Dashboard)**: ស្ថិតិសិស្សសរុប (ស្រី/ប្រុស), អត្រាវត្តមាន, ចំណូលថ្លៃសិក្សា, តារាងកិត្តិយស (Honor Roll) និងក្រាហ្វិកបែងចែកនិទ្ទេស (Grade Distribution)។
- **បញ្ជីសិស្ស (Student Directory)**: គ្រប់គ្រងប្រវត្តិរូបសិស្ស, ព័ត៌មានអាណាព្យាបាល, ការស្វែងរក, ការចម្រាញ់ (Filters) និងការទាញយក/នាំចូលទិន្នន័យ (Export/Import CSV)។
- **ការកត់ត្រាវត្តមាន (Daily Attendance)**: កត់ត្រាវត្តមានតាមកាលបរិច្ឆេទ និងថ្នាក់រៀន ជាមួយ ៤ ស្ថានភាព (វត្តមាន, ច្បាប់, អវត្តមាន, មកយឺត) ព្រមទាំងប្រព័ន្ធផ្តល់សញ្ញាប្រុងប្រយ័ត្ន (Alerts) សិស្សអវត្តមានច្រើន។
- **ការគ្រប់គ្រងពិន្ទុ (Gradebook & Rankings)**: បញ្ចូលពិន្ទុតាមមុខវិជ្ជា និងមេគុណក្រសួង, គណនាពិន្ទុសរុប, មធ្យមភាគ, ចំណាត់ថ្នាក់ និងនិទ្ទេសស្វ័យប្រវត្តិតាមពេលវេលាជាក់ស្តែង។
- **ព្រឹត្តិបត្រពិន្ទុផ្លូវការ (Official Printable Report Cards)**: ទម្រង់បែបបទស្តង់ដារកម្ពុជា (Royal Kingdom Emblem & Format) សម្រាប់បោះពុម្ព ឬទាញយកជា PDF លើខ្នាតក្រដាស A4។
- **ថ្លៃសិក្សា & វិក្កយបត្រ (Tuition & Invoices)**: តាមដានការបង់ថ្លៃសិក្សា ចេញវិក្កយបត្រ និងចេញបង្កាន់ដៃបង់ប្រាក់ផ្លូវការ (Official Receipt Voucher)។
- **កាលវិភាគសិក្សា (Class Timetable)**: តារាងកាលវិភាគបង្រៀនប្រចាំសប្តាហ៍។
- **Bilingual Interface**: គាំទ្រភាសាខ្មែរ (Default) និងភាសាអង់គ្លេស។

---

## 🛠️ ការដំឡើង និងដំណើរការក្នុងម៉ាស៊ីន (Local Development)

### ១. Clone កូដ
```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd <YOUR-REPO-NAME>
```

### ២. ដំឡើង Dependencies
```bash
npm install
```

### ៣. ដំណើរការ Dev Server
```bash
npm run dev
```
បើកកម្មវិធីរុករក (Browser) ទៅកាន់: `http://localhost:3000` ឬ URL ដែល Vite បង្ហាញ។

### ៤. Build សម្រាប់ Production
```bash
npm run build
```
កូដ Production នឹងត្រូវបានបង្កើតក្នុងថត `dist/`។

---

## 🌐 របៀបដាក់ចូល GitHub (Push to GitHub)

បើអ្នកទើបតែបង្កើត Repository ថ្មីនៅលើ GitHub សូមដំណើរការតាមជំហានដូចខាងក្រោម៖

```bash
# ១. បង្កើត git ក្នុងគម្រោង (បើមិនទាន់មាន)
git init

# ២. បញ្ចូលឯកសារទាំងអស់
git add .

# ៣. Commit
git commit -m "Initial commit: SchoolPro student management system"

# ៤. ប្តូរឈ្មោះ branch ទៅ main
git branch -M main

# ៥. ភ្ជាប់ទៅកាន់ GitHub repository របស់អ្នក
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# ៦. Push ឡើង GitHub
git push -u origin main
```

---

## 🚀 របៀប Deploy ឥតគិតថ្លៃ (Free Deployment)

អ្នកអាច Deploy កម្មវិធីនេះបានយ៉ាងងាយស្រួល ពីព្រោះវាជាកម្មវិធី **Client-Side Single Page Application (SPA)**៖

### ជម្រើសទី ១: Deploy លើ Vercel (ណែនាំបំផុត)
1. ចូលទៅកាន់ [Vercel](https://vercel.com) ហើយចុះឈ្មោះ/ចូលដោយប្រើគណនី GitHub។
2. ចុច **Add New Project** -> ជ្រើសរើស Repository `SchoolPro` របស់អ្នក។
3. ត្រួតពិនិត្យការកំណត់ (Vercel នឹងស្គាល់ Vite ដោយស្វ័យប្រវត្តិ):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. ចុច **Deploy**។ រយៈពេលប្រហែល ១ នាទី អ្នកនឹងទទួលបាន Live URL ផ្លូវការ!

### ជម្រើសទី ២: Deploy លើ Netlify
1. ចូលទៅកាន់ [Netlify](https://www.netlify.com) -> **Add new site** -> **Import an existing project** (GitHub)។
2. ជ្រើសរើស repo របស់អ្នក។
3. Build Settings:
   - **Base directory**: (ទទេ)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. ចុច **Deploy site**។

### ជម្រើសទី ៣: Deploy លើ Cloudflare Pages
1. ចូលទៅកាន់ [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**។
2. ជ្រើសរើស repo -> **Framework preset**: `Vite` -> **Build output**: `dist`។
3. ចុច **Save and Deploy**។

---

## 📄 អាជ្ញាបណ្ណ (License)
Apache-2.0
