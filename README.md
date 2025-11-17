This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

<!-- ####################################### -->

1. git clone
2. npm install

to see list of installed emulators.
./emulator -list-avds

3. start emulator either from android studio or from the given command.
   cd /Users/mohdshahid/Library/Android/sdk/tools
   ./emulator -avd Pixel_2_API_26

4. Then
   cd /Users/mohdshahid/Documents/nodejs/poc/shahid/projects/avon_mobile_app
   react-native run-android

# Building APK file

react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

cd android
gradlew assembleDebug

You can find .apk file here which you can send to other on whatsapp
android/app/build/outputs/apk/debug/app-armeabi-v7a-debug.apk

# Generating the release AAB

cd android
gradlew bundleRelease

# Testing the release build of your app

cd ..
npx react-native run-android --variant=release

# Generating the release APK

cd android
gradlew assembleRelease

# You can find the release APK file here

android/app/build/outputs/apk/release/app-release.apk

# You can also find the release AAB file here

android/app/build/outputs/bundle/release/app-release.aab

# You can also find the release APK file here

android/app/build/outputs/apk/release/app-release.apk

####

common flow

- [-] forgot password
- [-] switch user type on login page (candidate/employer)

candidate flow

- [-] job listing filters

employer flow

- [-] company form completion meter
- [-] company form show image uploader
- [-] plan listing page
- [-] buy credits system
- [-] current plan meter
- [-] credit and history page
- [-] candidate search filters
- [-] candidate details view logic
- [-] complete candidate details page (currently only basic details are showing)



# 26-06-24

- [-] show opening jobs on company details page
- [-] show empty message if there is no company added on manage company page (employer)
- [-] integrate file uploader (profile resume)
- [-] job listing filters
- [-] show splash screen on app launch
- [-] if user is already logged in then navigate to the homepage on app launch
- [-] if user is not logged in and has already chosen an account type then navigate to the login page
- [-] home show `Recently viewed candidates` section instead of `recently viewed jobs` when employer is signed in
- [-] banner should be different for `candidates` and `employers` (ask to shaaban) (very low priority)
- [-] integrate confirmation modal (show on logout, buy credits alert etc)
- [-] employer can download candidates doc files from the credit history page and candidate details page
- [-] employer can buy single user candidate resume plan (`new-feature`) (we created a single user plan)
- [-] mobile number and email should be validated
- [-] integrate splash screen on app load
- [-] remove pre-defined password from login page
- [-] check read external permissions for accessing gallery
- [-] when we updating company details job listing will also update (invalidate job listing api)
- [-] after updating the job multiple times loader is rendering and wrong msg is showing "company details updated"
- [-] after updating job then we navigating to manage job on that when clicking back button it is navigating to update job page again
- [ ] create an individual pages for `recently viewed (jobs and candidate)` 
- [ ] banner should redirect to the their links
- [ ] integrate file viewer (very low priority)






- Can be used with ViewPager and Listview
- Custom Styling
- Support vertical and horizontal orientation
- Support animation between steps
- Support title like => Account ---- profile ----- dashboard
- Support icon if icon passed with data otherwise show number like => 1, 2 or 3


<!-- These changes are done on the website -->

# Issues: 26-07-24
- [Done] Make changes to checkout form according to the website 
- [Done] Qualification > When adding education year not showing more than 2023
- [Done] Add Certifications field in qualification (add a certifications field under details box in qualification modal)

# Issues: 06-08-24
- 1. [] Show error msg if user has not purchased any plan or credits are expired and want to see candidate social links

# Work: 11-08-24
- 1. [Done] Integrate email login and signup system
- 2. [Done] Email verification with OTP
- 3. [Done] Old users can't login without verifying there accounts
- 4. [Done] Integrate forgot password with email OTP and resend OTP

# Work: 27-09-24
1. [Done] Checkout form should auto fill
2. [Done] Add GST field in checkout form
3. [Done] Create a new page "Purchased Candidates" and show Credit Usage History table there
4. [Done] Change customer details public api (to view candidate details)
5. [Done] Check why candidate resume is not downloading from the details page
6. [Done] fix customer skills list overflow issue



# Step to upgrade version name and code

1. Install the library in your project
   -- Run this command in the terminal:
   -- npm i react-native-version --save-dev
   -- (or install globally with: npm i -g react-native-version)

2. Update version in package.json
   -- Open the package.json file.
   -- Change the version manually, for example:
   -- From "version": "1.0.0" to "version": "1.0.1"

3. Run the command to apply version
   -- In the root folder of your project, run:
   -- npx react-native-version --never-amend

4. Update version manually "src\screens\Account\index.js"

  <!-- useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep(prevStep => prevStep - 1);
        return true; // Prevent default behavior (exit the app)
      } else {
        // Optionally, show an alert or confirm exit
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => BackHandler.exitApp()},
        ]);

        return true; // Block hardware back button
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Cleanup function to remove the event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [currentStep]); -->


# Release Note: 31/07/25
1. Integrated feature to login with email or mobile number number
2. Integrated feature to reset password throw email or mobile number
3. Integrated feature for verfication throw email or mobile
4. Showing active and disabled jobs in two separate tabs
5. Integrated feature where users can change their email or mobile number from profile page
6. Hides company contact details from job details and company details page



# TODO: 08/08/25
1. [x] - Remove default login credential
2. [x] - Fix crash when clicking "Add Qualification or Experience" on the profile page
3. [x] - Increase clickable area of profile page "Basic Details" edit button 
4. [x] - Add `date_of_birth`, `gender`, `marital_status`, `fathers_name`, `work_type`
5. [x] - Convert `language_known`, `skills`, `hobbies` text input to multi select input like website
6. [x] - After login, user should be redirected to profile page
7. [x] - Add "Certification" section in profile form
8. [x] - Integrate full page modal selector instead of dropdown selector
9. [x] - Home page "Recently viewed jobs" and "Recently viewed candidates" sec View All button is not working, create a new page for recently viewed jobs and candidates
10. [x] - Add "Recently viewed jobs" and "Recently viewed candidates" menu item on account page inside account box
11. [x] - Show "Expired" plan details and "Renew Plan" button on credit meter if plan is expired
12. [x] - Show "No Active Plan" card if user is not employer or if user has no plan
13. [x] - Dont show the candidates on listing page if they were not completed the required fields in profile
14. [x] - Add "Search Candidate" menu button on the account page
15. [x] - Candidate - Job applications only will be shown if user is logged in
16. [X] - Employer - If user has no company then show "Create a company" button on home page
17. [X] - Employer - Show plan meter on home page
18. [x] - Add "Rate Us" button on account page
19. [x] - Update the forgot password flow - OTP verification and set new password
20. [X] - Candidate Certifacation is not showing in candidate details page for employers
21. [X] - In the forgot password flow, OTP is sent successfully but the validity timer expires immediately for resend OTP.
22. [X] - Social icons are not showing in candidate details page for employers
23. [x] - Fix candidate active status in listing and details page accordin to website
24. [x] - Remove "Image" file type from resume uploader
25. [x] - App is crashing when we click on top profile section on account page
26. [x] - After update the profile redirect to the profile page
27. [ ] - Remove disabled jobs from Employer home page "Your Jobs Openings"
28. [ ] - change Manage company form "location" and "company type" dropdown to modal selector
29. [ ] - change Manage job form "location", "job industry", "employment type" dropdown to modal selector
30. [ ] - Integrate skeleton loader for jobs loader
31. [ ] - Replace "Application" button with "Search" button on bottom tabs
32. [ ] - Move "My Applications" to the bottom tabs
33. [ ] - Create a new page for Search, and show "Recent Searches" section on the top of the page and show "Popular Searches" section on the bottom of the page (very low priority)
34. [ ] - If user is not logged in then show "Sign In" button on account, saved jobs, and my applications page
35. [ ] - Enhance job listing page
36. [ ] - Add splash screen, use "react-native-bootsplash" or its similar (very low priority)
37. [ ] - integrate file viewer (very low priority)
38. [ ] - Integrate Resume builder (very low priority)
39. [ ] - Integrate in app download system (very low priority)
40. [ ] - remove "SingleSavedCandidateItem" if we are not using it

