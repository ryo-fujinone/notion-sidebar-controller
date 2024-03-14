/* eslint-disable no-undef */
import { getDefaultOptions } from "../utils/defaultOptions";
import { getFromStorage } from "../utils/handleStorage";

let options = getDefaultOptions();

const updateLocalStorage = (currentDisplayOptions) => {
  // Update left sidebar flag
  (() => {
    const leftSidebarState = currentDisplayOptions.leftSidebarState;
    if (leftSidebarState === "default") {
      return;
    }
    const notionKeyValueStoreStr = localStorage.getItem(
      "LRU:KeyValueStore2:sidebar",
    );
    let notionKeyValueStore = JSON.parse(notionKeyValueStoreStr);

    let expanded = false;
    if (leftSidebarState === "open") {
      expanded = true;
    }

    if (notionKeyValueStore) {
      notionKeyValueStore.value.expanded = expanded;
    } else {
      const timestamp = new Date().getTime();
      notionKeyValueStore = {
        id: "KeyValueStore2:sidebar",
        important: true,
        timestamp,
        value: {
          expanded,
          width: 220,
        },
      };
    }
    localStorage.setItem(
      "LRU:KeyValueStore2:sidebar",
      JSON.stringify(notionKeyValueStore),
    );
  })();

  // Update right sidebar flag
  (() => {
    const rightSideBarState = currentDisplayOptions.rightSideBarState;
    if (rightSideBarState === "default") {
      return;
    }
    const notionKeyValueStoreStr = localStorage.getItem(
      "LRU:KeyValueStore2:updateSidebar",
    );
    let notionKeyValueStore = JSON.parse(notionKeyValueStoreStr);

    let expanded = false;
    let currentTab = 0;
    switch (rightSideBarState) {
      case "openComments":
        expanded = true;
        break;
      case "openUpdates":
        expanded = true;
        currentTab = 1;
        break;
      default:
        break;
    }

    let currentPageId;
    const pathname = new URLPattern(window.location.href).pathname;
    const mached = pathname.match(/[^/-]{32}$/);
    if (mached) {
      const id = mached[0];
      currentPageId = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`;
    }

    if (notionKeyValueStore) {
      notionKeyValueStore.value.expanded = expanded;
      notionKeyValueStore.value.currentTab = currentTab;
    } else {
      const timestamp = new Date().getTime();
      notionKeyValueStore = {
        id: "KeyValueStore2:updateSidebar",
        important: true,
        timestamp,
        value: {
          commentsMode: 1,
          currentSubTab: 0,
          currentTab,
          expanded,
          width: 385,
        },
      };
    }
    if (currentPageId) {
      notionKeyValueStore.value.openedOnBlockId = currentPageId;
    }

    localStorage.setItem(
      "LRU:KeyValueStore2:updateSidebar",
      JSON.stringify(notionKeyValueStore),
    );
  })();
};

const removeUpdateSidebarKey = () => {
  localStorage.removeItem("LRU:KeyValueStore2:updateSidebar");
};

const toggleLeftSidebar = () => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { ctrlKey: true, keyCode: 220 }),
  );
};

const toggleRightSidebar = () => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      ctrlKey: true,
      shiftKey: true,
      keyCode: 220,
    }),
  );
};

const controlRightSidebar = async (currentDisplayOptions) => {
  const rightSideBarState = currentDisplayOptions.rightSideBarState;
  if (rightSideBarState === "default") {
    return;
  }
  let actionBtnsContainer;
  let count = 0;
  await (() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        count++;
        actionBtnsContainer = document.querySelector(
          ".notion-topbar-action-buttons",
        );
        if (count === 25 || actionBtnsContainer) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  })();

  if (!actionBtnsContainer) {
    return;
  }

  let isOpen = actionBtnsContainer.style.width !== "";
  const commentsBtn = actionBtnsContainer.querySelector(
    ".notion-topbar-comments-button",
  );
  const updatesBtn = actionBtnsContainer.querySelector(
    ".notion-topbar-updates-button",
  );
  if (isOpen && rightSideBarState === "close") {
    toggleRightSidebar();
  } else if (isOpen) {
    // Switching sidebars
    const isCommentsSidebar = commentsBtn.style.background !== "";
    if (isCommentsSidebar && rightSideBarState === "openUpdates") {
      updatesBtn?.click();
    } else if (!isCommentsSidebar && rightSideBarState == "openComments") {
      commentsBtn?.click();
    }
  } else if (!isOpen) {
    if (rightSideBarState === "openComments") {
      commentsBtn?.click();
    } else if (rightSideBarState === "openUpdates") {
      updatesBtn?.click();
    }
  }
};

const addEventListenersForLeftSidebar = (sidebarContainer) => {
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
    }
  });
};

const controlLeftSidebar = (currentDisplayOptions, leftSidebarContainer) => {
  const sidebar = leftSidebarContainer.querySelector(".notion-sidebar");
  const leftSidebarState = currentDisplayOptions.leftSidebarState;
  const preventSidebarOnHover = currentDisplayOptions.preventSidebarOnHover;
  if (leftSidebarContainer.style.width !== "0px") {
    if (leftSidebarState === "close") {
      toggleLeftSidebar();
      setTimeout(() => {
        if (preventSidebarOnHover) {
          sidebar.style.display = "none";
          addEventListenersForLeftSidebar(leftSidebarContainer);
        }
      }, 1000);
    } else {
      if (preventSidebarOnHover) {
        addEventListenersForLeftSidebar(leftSidebarContainer);
      }
    }
  } else {
    if (leftSidebarState === "open") {
      toggleLeftSidebar();
      if (preventSidebarOnHover) {
        sidebar.style.display = "";
        addEventListenersForLeftSidebar(leftSidebarContainer);
      }
    } else {
      if (preventSidebarOnHover) {
        sidebar.style.display = "none";
        addEventListenersForLeftSidebar(leftSidebarContainer);
      }
    }
  }
};

chrome.runtime.onMessage.addListener((displayInfo) => {
  const currentDisplayOptions = options.displays.find(
    (d) => displayInfo.id === d.id,
  );
  if (!currentDisplayOptions) {
    return;
  }

  if (currentDisplayOptions.deleteRightSidebarFlag) {
    removeUpdateSidebarKey();
  }
  updateLocalStorage(currentDisplayOptions);

  new MutationObserver((_, _observer) => {
    if (!document?.body) return;
    if (!document.body.classList.contains("notion-body")) {
      _observer.disconnect();
      return;
    }

    const leftSidebarContainer = document.querySelector(
      ".notion-sidebar-container",
    );
    if (!leftSidebarContainer) return;
    _observer.disconnect();

    setTimeout(async () => {
      await controlRightSidebar(currentDisplayOptions);
      controlLeftSidebar(currentDisplayOptions, leftSidebarContainer);
    }, options.waitTimeForSidebar);
  }).observe(document, { childList: true, subtree: true });
});

const main = async () => {
  options = (await getFromStorage()).options ?? options;
  chrome.runtime.sendMessage("");
};

main();
