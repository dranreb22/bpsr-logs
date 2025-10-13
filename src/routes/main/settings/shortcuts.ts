import { commands } from "$lib/bindings";
import { settings } from "$lib/settings-store";
import { setClickthrough, toggleClickthrough } from "$lib/utils.svelte";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

export async function setupShortcuts() {
  await unregisterAll();
  for (const [cmdId, shortcutKey] of Object.entries(settings.state.shortcuts)) {
    registerShortcut(cmdId, shortcutKey);
  }
}

export async function registerShortcut(cmdId: string, shortcutKey: string) {
  if (shortcutKey) {
    switch (cmdId) {
      case "showLiveMeter":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            const liveWindow = await WebviewWindow.getByLabel("live");
            await liveWindow?.show();
          }
        });
        break;

      case "hideLiveMeter":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            const liveWindow = await WebviewWindow.getByLabel("live");
            await liveWindow?.hide();
          }
        });
        break;

      case "toggleLiveMeter":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            const liveWindow = await WebviewWindow.getByLabel("live");
            const isVisible = await liveWindow?.isVisible();
            if (isVisible) {
              await liveWindow?.hide();
            } else {
              await liveWindow?.show();
            }
          }
        });
        break;

      case "enableClickthrough":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            setClickthrough(true);
          }
        });
        break;

      case "disableClickthrough":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            setClickthrough(false);
          }
        });
        break;

      case "toggleClickthrough":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            console.log(`Triggered ${cmdId}`);
            toggleClickthrough();
          }
        });
        break;

      case "resetEncounter":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            commands.resetEncounter();
          }
        });
        break;

      case "hardReset":
        await register(shortcutKey, async (event) => {
          if (event.state === "Pressed") {
            commands.hardReset();
          }
        });
        break;

      default:
        console.log("Unknown command");
    }
  }
}
