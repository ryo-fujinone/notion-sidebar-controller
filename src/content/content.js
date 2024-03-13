import { getDefaultOptions } from "../utils/defaultOptions";
import { getFromStorage } from "../utils/handleStorage";

let options = getDefaultOptions();

const updateLocalStorage = (currentDisplayOptions) => {
  const notionKeyValueStoreStr = localStorage.getItem(
    "LRU:KeyValueStore2:sidebar",
  );
  const notionKeyValueStore = JSON.parse(notionKeyValueStoreStr);
  const sidebarState = currentDisplayOptions.sidebarState;
  if (sidebarState === "default") {
    return;
  }
  if (sidebarState === "open") {
    notionKeyValueStore.value.expanded = true;
  } else if (sidebarState === "close") {
    notionKeyValueStore.value.expanded = false;
  }
  localStorage.setItem(
    "LRU:KeyValueStore2:sidebar",
    JSON.stringify(notionKeyValueStore),
  );
};

const removeUpdateSidebarKey = () => {
  // Notion controls the sidebar with 'LRU:KeyValueStore2:sidebar' and 'LRU:KeyValueStore2:updateSidebar'.
  // The following items are registered when you switch the sidebar with ctrl+period.
  // This extension removes the following items to control the sidebar as intended.
  localStorage.removeItem("LRU:KeyValueStore2:updateSidebar");
};

const toggleSidebar = () => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { ctrlKey: true, keyCode: 220 }),
  );
};

const addEventListeners = (sidebarContainer) => {
  const sidebar = sidebarContainer.querySelector(".notion-sidebar");

  // When the Open button is clicked
  const topbar = document.querySelector(".notion-topbar > div");
  topbar.addEventListener("click", (e) => {
    const d = e.target.getAttribute("d");
    if (
      e.target.classList.contains("doubleChevronRight") ||
      e.target.classList.contains("notion-open-sidebar") ||
      (d && /^M2.25781/.test(d))
    ) {
      sidebar.style.display = "";
    }
  });

  // When the Close button is clicked
  const switcher = document.querySelector(
    ".notion-sidebar-switcher .notion-fadein",
  );
  switcher.addEventListener("click", (e) => {
    const d = e.target.getAttribute("d");
    if (
      e.target.classList.contains("notion-close-sidebar") ||
      e.target.classList.contains("doubleChevronLeft") ||
      (d && /^M7/.test(d))
    ) {
      sidebar.style.display = "none";
    }
  });

  // When toggling the sidebar with the keyboard
  document.addEventListener("keydown", (e) => {
    const mainKey = e.ctrlKey || e.metaKey;
    const subKey =
      e.code === "IntlYen" ||
      e.code === "Backslash" ||
      e.code === "IntlRo" ||
      e.code === "Period";
    if (mainKey && subKey) {
      if (sidebarContainer.style.width === "0px") {
        sidebar.style.display = "";
      } else {
        sidebar.style.display = "none";
      }
      setTimeout(() => {
        removeUpdateSidebarKey();
      }, 1000);
    }
  });
};

chrome.runtime.onMessage.addListener((displayInfo) => {
  const currentDisplayOptions = options.displays.find(
    (d) => displayInfo.id === d.id,
  );
  if (!currentDisplayOptions) {
    return;
  }

  updateLocalStorage(currentDisplayOptions);

  new MutationObserver((_, _observer) => {
    if (!document?.body) return;
    if (!document.body.classList.contains("notion-body")) {
      _observer.disconnect();
      return;
    }

    const sidebarContainer = document.querySelector(
      ".notion-sidebar-container",
    );
    if (!sidebarContainer) return;
    _observer.disconnect();

    setTimeout(() => {
      const sidebar = sidebarContainer.querySelector(".notion-sidebar");
      const sidebarState = currentDisplayOptions.sidebarState;
      const preventSidebarOnHover = currentDisplayOptions.preventSidebarOnHover;
      if (sidebarContainer.style.width !== "0px") {
        if (sidebarState === "close") {
          toggleSidebar();
          setTimeout(() => {
            if (preventSidebarOnHover) {
              sidebar.style.display = "none";
              addEventListeners(sidebarContainer);
            }
          }, 1000);
        } else {
          if (preventSidebarOnHover) {
            addEventListeners(sidebarContainer);
          }
        }
      } else {
        if (sidebarState === "open") {
          toggleSidebar();
          if (preventSidebarOnHover) {
            sidebar.style.display = "";
            addEventListeners(sidebarContainer);
          }
        } else {
          if (preventSidebarOnHover) {
            sidebar.style.display = "none";
            addEventListeners(sidebarContainer);
          }
        }
      }
    }, options.waitTimeForSidebar);
  }).observe(document, { childList: true, subtree: true });
});

const main = async () => {
  options = (await getFromStorage()).options ?? options;
  removeUpdateSidebarKey();
  chrome.runtime.sendMessage("");
};

main();
