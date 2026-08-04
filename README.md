# Drumming Assist 🥁

A mobile app that helps drummers **tune their kit by ear-free measurement**, keep time, and learn good tuning habits. Built with [Expo](https://expo.dev) (React Native) and [expo-router](https://docs.expo.dev/router/introduction).

## What it does

- **Kit tuner** — pick a drum and tune each head to a target note. The app listens through the microphone, detects the struck pitch, and tells you whether the head is flat, sharp, or in tune. A lug-by-lug view guides you around the drum in a star pattern for even tension.
- **Kit customizer** — build your kit visually: add or remove pieces (drums and cymbals) and drag them around a canvas to match your real setup.
- **Metronome** — adjustable tempo, time signature, and subdivisions with a visual beat indicator.
- **Tune Guide** — reference material on drum tuning technique.
- **Profile** — sign in and choose an appearance theme (System, Dark, Light, Warm).

## Plans

The app has two tiers:

- **Free (guest):** Tune Guide, Metronome, and Profile.
- **Pro (signed in):** everything above **plus** the Kit tuner and customizer.

Signing in unlocks Pro; signing out returns to the free experience. Authentication is currently mocked (see _Mock data_ below).

## How the pitch detection works

The tuner captures audio in a hidden [`'use dom'`](https://docs.expo.dev/guides/dom-components/) WebView component ([`components/drum/pitch-sensor.tsx`](components/drum/pitch-sensor.tsx)) using the Web Audio API and an autocorrelation algorithm. Readings are smoothed and compared against the target frequency in [`hooks/use-drum-tuner.ts`](hooks/use-drum-tuner.ts).

> **The microphone does not work in the iOS Simulator** — WebView `getUserMedia` has no audio device there. Test the tuner on a **physical device**.

## Tech stack

- **Expo SDK 55** + **React Native**, TypeScript
- **expo-router** for file-based navigation
- **expo-audio** for microphone permissions
- **react-native-webview** for the DOM-based pitch sensor
- **AsyncStorage** for persisting theme, session, and kit configuration
- React Context for app state (theme, auth, kit)

## Project structure

```
app/                     File-based routes
  (tabs)/                Kit, Tune Guide, Metronome, Profile
  drum/[id].tsx          Per-drum tuner (Pro)
  kit-customize.tsx      Kit customizer (Pro)
components/              UI components (drum/, metronome/, ui/, shared)
hooks/                   use-theme, use-auth, use-kit, use-drum-tuner
constants/               Theme palette, drum + kit-piece definitions
data/                    Mock JSON data (see below)
```

## Mock data

App data is currently served from local JSON files and read through thin modules, each designed to be swapped for a web API response of the same shape later:

| Data | File |
| --- | --- |
| Drums + tuning targets | [`data/drums.json`](data/drums.json) |
| Kit pieces + canvas layout | [`data/kit-pieces.json`](data/kit-pieces.json) |
| Login / account | [`data/users.json`](data/users.json) |

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npx expo start
   ```

3. Open the app on a **physical device** via Expo Go (scan the QR code) or a development build. Use a real device if you want to test the tuner's microphone.

> Install Expo packages with `npx expo install <pkg>` (not plain `npm install`) so versions stay compatible with the Expo SDK.
