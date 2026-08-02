# Local Testing Guide

This is a **managed Expo** app. There is **no Xcode project** to open — do not try to
open this folder in Xcode. You test it by running the Expo dev server and opening the app
in one of three targets: your **iPhone (Expo Go)**, the **iOS Simulator**, or a **web browser**.

Every workflow below starts the same way, from the project folder:

```bash
npx expo start
```

That prints a QR code and a menu. Press a key to open a target, or scan the QR with your phone.

---

## 1. iPhone via Expo Go — no Xcode required (recommended for real-device testing)

One-time setup:
1. Install **Expo Go** from the App Store on your iPhone.
2. Make sure your Mac and iPhone are on the **same Wi-Fi network**.

Each time:
1. Run `npm run start` (or `npx expo start`) in this folder.
2. Open the **Camera** app on your iPhone and point it at the QR code in Terminal.
3. Tap the banner — it opens the app inside Expo Go.
4. Save a file in your editor → the phone **hot-reloads** automatically.

Shake the phone to open the Expo dev menu (reload, toggle performance monitor, etc.).

**If the QR / same-Wi-Fi doesn't connect** (common on corporate, guest, or locked-down
networks that block device-to-device traffic), use a tunnel instead:

```bash
npm run start:tunnel
```

This routes through Expo's servers, so the network no longer matters. It's a bit slower.

---

## 2. iOS Simulator — requires the full Xcode app

The Simulator only exists inside the **full Xcode application**. This machine currently has
only the Command Line Tools, which is why the Simulator has never worked. To enable it:

1. Install **Xcode** from the Mac App Store (large download, several GB).
2. Open Xcode once and accept the license so it finishes installing components.
3. Point the command-line tools at the full Xcode:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```
4. Install a simulator runtime: Xcode → Settings → Components → get an iOS simulator.

After that:
```bash
npm run ios
```
or run `npx expo start` and press **`i`**. It boots the Simulator and installs the app.

---

## 3. Web browser — fastest loop for quick UI checks

```bash
npm run web
```

Opens the app in your default browser via `react-native-web`. Great for rapid iteration,
but note some native-only behavior (haptics, gestures) differs from a real device — always
confirm final changes on your iPhone or the Simulator.

---

## Troubleshooting

- **Node version:** this project is pinned to Node 22 via the `.node-version` file and
  [fnm](https://github.com/Schniz/fnm). Because `fnm env --use-on-cd` is in `~/.zshrc`,
  simply `cd`-ing into this folder auto-switches you to Node 22. Verify with `node -v`
  (should print `v22.x`). If it prints something else, run `fnm use` in this folder.
  Node versions well ahead of LTS (e.g. Homebrew's Node 25) are a common source of flakiness.
- **Stuck / weird cache errors:** start clean with `npx expo start -c` (clears the Metro cache).
- **Health check:** `npx expo-doctor` runs 18 checks and reports dependency/config problems.
- **Dependencies out of sync:** `npx expo install --fix` realigns package versions to the SDK.
