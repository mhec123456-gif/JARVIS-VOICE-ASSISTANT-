# JARVIS Voice Assistant — Native Android Project for Vivo X200 FE

A complete, production-grade native Android personal voice assistant built with **Kotlin** and **Jetpack Compose**, specifically engineered for the **Vivo X200 FE**.

---

## 🚀 Key Architectural Capabilities

1. **Dual-Language Speech Intelligence**:
   - Native Malayalam (`ml-IN`) and Indian/US English (`en-IN` / `en-US`) speech recognition.
   - Intelligent fallback & partial-results streaming for real-time HUD rendering.

2. **Male Malayalam Voice Calibration**:
   - Dynamic voice scanning for dedicated male Malayalam TTS engines.
   - Custom acoustic pitch calibration (`0.82f`) ensuring an authoritative, masculine JARVIS cadence.

3. **Intelligent Cloud AI Router**:
   - Evaluates linguistic cues, complexity, and network conditions.
   - Routes Malayalam & low-latency voice queries to **Google Gemini 2.5 Flash**.
   - Routes complex code/analysis to **OpenAI ChatGPT** (or user-configured preference).
   - Instant automatic fallback if a provider is rate-limited or unavailable.

4. **Hardware-Backed Keystore Security**:
   - Zero hardcoded keys in APK or repository.
   - Encrypted with AES-256 GCM using `androidx.security.crypto.EncryptedSharedPreferences`.

5. **Human Confirmation Safety Protocol**:
   - Mandatory dialog authorization before placing phone calls or sending WhatsApp messages.

6. **On-Device Speaker Verification**:
   - 3-phrase guided enrollment computing cosine similarity against acoustic feature vectors.
   - Complete privacy: features never leave the device.
   - Explicit disclaimer: Personalization feature; not a replacement for Android lockscreen biometrics.

7. **Foreground Wake-Word Detection**:
   - Background listening for the wake phrase **"JARVIS"** using Android 14/15 `FOREGROUND_SERVICE_MICROPHONE`.

8. **Real-Time Voice Security Alert (App-Open Deterrent)**:
   - When the Vivo X200 FE is unlocked after being unattended and monitored apps (Facebook, WhatsApp, Instagram, Telegram, Gallery, Settings) are launched, JARVIS speaks an immediate Malayalam warning:
     *"Sir, ശ്രദ്ധിക്കുക! നിങ്ങളുടെ ഫോണിൽ Facebook തുറന്നിട്ടുണ്ട്. ഇത് നിങ്ങളാണോ ഉപയോഗിക്കുന്നത്?"*
   - **Supported Android Hook**: Uses event-driven `AccessibilityService` (`JarvisAppMonitorService`) for sub-100ms window state change detection without background polling battery drain.
   - **Device Lock Monitoring**: Uses `DeviceLockReceiver` (`ACTION_USER_PRESENT` and `ACTION_SCREEN_OFF`) to arm the alert on unlock.
   - **Ethical & Privacy Boundaries**:
     - Does NOT claim to know who is holding the phone; app launch detection alone cannot identify a person.
     - Never secretly records audio or video.
     - Fully customizable app checklist, volume slider, silent mode override, and repeat cooldown timers.

---

## 📱 Vivo X200 FE / FuntouchOS / OriginOS Setup

Vivo's operating system features an aggressive battery manager (iManager) that will stop background services when the screen is turned off unless you configure the following:

1. **Disable Battery Restriction**:
   - Go to `Settings -> Battery -> Background Power Consumption Management`.
   - Find **JARVIS** and select **"Don't restrict background power consumption"** (High background power usage).

2. **Enable Autostart**:
   - Open **Vivo iManager** -> `App Management -> Autostart Management`.
   - Toggle **JARVIS** to **ON**.

3. **Allow Background Pop-up Windows**:
   - Open `Settings -> Applications -> Permission Management -> Apps -> JARVIS`.
   - Grant **"Display pop-up windows while running in the background"**.
   - This allows JARVIS to launch into the foreground when you speak the wake word with the screen off.

4. **Lock Screen Notifications**:
   - Under `Settings -> Notifications -> JARVIS`, ensure **"Show on lock screen"** is enabled so the foreground service status is persistent.

---

## 🛠️ Build & APK Generation Instructions

### Prerequisites
- Android Studio Ladybug (2024.2.1+) or newer
- Android SDK 35 (Android 15) installed
- JDK 17 (Zulu, Temurin, or Android Studio bundled JDK)

### Option 1: Android Studio (GUI)
1. Open Android Studio -> Select **Open**.
2. Browse to the `android/` directory of this project.
3. Allow Gradle to sync dependencies.
4. Connect your Vivo X200 FE via USB with **USB Debugging** enabled (Developer Options).
5. Click the green **Run (Play)** button or choose `Build -> Build Bundle(s) / APK(s) -> Build APK(s)`.

### Option 2: Terminal / Command Line
Run in the `android/` directory:
```bash
# Make gradlew executable
chmod +x gradlew

# Build Debug APK
./gradlew assembleDebug

# The APK will be generated at:
# android/app/build/outputs/apk/debug/app-debug.apk

# Install directly to your connected Vivo X200 FE:
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Option 3: Building a Signed Release APK for Daily Use
```bash
# Generate release keystore if not already created:
keytool -genkey -v -keystore jarvis-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias jarvis

# Build release APK:
./gradlew assembleRelease
```

---

## ⚠️ Features That Cannot Be Executed in AI Studio Web Sandbox

Because AI Studio runs in a cloud Linux web container:
1. **Compilation of Android APK via `gradlew`**: Requires Android SDK build-tools, platform SDK 35, and aapt2 binaries which are not pre-installed in the lightweight web container. Therefore, download this project ZIP to build on your PC or Mac using Android Studio or command-line Gradle.
2. **True Native Android IPC / Package Launching**: Intents targeting `com.whatsapp` or `android.intent.action.CALL` require the physical Android OS runtime on your Vivo X200 FE. The web companion simulates these with browser APIs and safety confirmation dialogs.
3. **Low-Level DSP Chip Wake-Word (Qualcomm/MediaTek Voice Activation)**: Hardware-level always-on DSP listening requires phone firmware integration; the foreground service provides standard Android OS-level background listening.
