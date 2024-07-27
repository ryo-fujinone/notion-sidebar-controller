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
    const rightSidebarState = currentDisplayOptions.rightSidebarState;
    if (rightSidebarState === "default") {
      return;
    }
    const notionKeyValueStoreStr = localStorage.getItem(
      "LRU:KeyValueStore2:updateSidebar",
    );
    let notionKeyValueStore = JSON.parse(notionKeyValueStoreStr);

    let expanded = false;
    let currentTab = 0;
    let currentSubTab = 0;
    switch (rightSidebarState) {
      case "openComments":
        expanded = true;
        break;
      case "openUpdates":
        expanded = true;
        currentTab = 1;
        break;
      case "openAnalytics":
        expanded = true;
        currentTab = 1;
        currentSubTab = 1;
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
      notionKeyValueStore.value.currentSubTab = currentSubTab;
    } else {
      if (!expanded) {
        return;
      }
      const timestamp = new Date().getTime();
      notionKeyValueStore = {
        id: "KeyValueStore2:updateSidebar",
        important: true,
        timestamp,
        value: {
          commentsMode: 1,
          currentSubTab,
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
  const rightSidebarState = currentDisplayOptions.rightSidebarState;
  if (rightSidebarState === "default") {
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
        if (count === 30 || actionBtnsContainer) {
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

  const openUpdatesAnalyticsSidebar = () => {
    switch (rightSidebarState) {
      case "openUpdates":
      case "openAnalytics":
        updatesBtn?.click();
        break;
    }
    new MutationObserver((_, _observer) => {
      const tabBtnsInUpdates = document.querySelectorAll(
        ".notion-update-sidebar-tab-updates-header .hide-scrollbar [role='button']",
      );
      if (!tabBtnsInUpdates || tabBtnsInUpdates.length !== 2) {
        return;
      }
      _observer.disconnect();
      switch (rightSidebarState) {
        case "openUpdates": {
          const tabBtn = tabBtnsInUpdates[0];
          if (tabBtn?.parentElement?.style?.position === "") {
            tabBtn.click();
          }
          break;
        }
        case "openAnalytics": {
          const tabBtn = tabBtnsInUpdates[1];
          if (tabBtn?.parentElement?.style?.position === "") {
            tabBtn.click();
          }
          break;
        }
      }
    }).observe(document, { childList: true, subtree: true });
  };

  if (isOpen && rightSidebarState === "close") {
    toggleRightSidebar();
  } else if (isOpen) {
    // Switching sidebars
    const isUpdatesSidebar = updatesBtn.style.background !== "";
    if (isUpdatesSidebar) {
      // If the Updates/Analytics sidebar is open
      const tabBtnsInUpdates = document.querySelectorAll(
        ".notion-update-sidebar-tab-updates-header .hide-scrollbar [role='button']",
      );
      switch (rightSidebarState) {
        case "openComments":
          commentsBtn?.click();
          break;
        case "openUpdates": {
          if (tabBtnsInUpdates.length !== 2) {
            break;
          }
          const tabBtn = tabBtnsInUpdates[0];
          if (tabBtn?.parentElement?.style?.position === "") {
            tabBtn.click();
          }
          break;
        }
        case "openAnalytics": {
          if (tabBtnsInUpdates.length !== 2) {
            break;
          }
          const tabBtn = tabBtnsInUpdates[1];
          if (tabBtn?.parentElement?.style?.position === "") {
            tabBtn.click();
          }
          break;
        }
      }
    } else {
      // If the comment sidebar is open
      openUpdatesAnalyticsSidebar();
    }
  } else if (!isOpen) {
    if (rightSidebarState === "openComments") {
      commentsBtn?.click();
    } else {
      openUpdatesAnalyticsSidebar();
    }
  }
};

const addEventListenersForLeftSidebar = async (leftSidebarContainer) => {
  const leftSidebar = leftSidebarContainer.querySelector(".notion-sidebar");

  let topbar, switcher;
  let count = 0;
  await (() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        count++;
        topbar = document.querySelector(".notion-topbar > div");
        switcher = document.querySelector(
          ".notion-sidebar-switcher > div:nth-of-type(2)",
        );
        if (count === 30 || (topbar && switcher)) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  })();

  if (!topbar || !switcher) {
    return;
  }

  // When the Open button is clicked
  topbar.addEventListener("click", (e) => {
    const d = e.target.getAttribute("d");
    if (
      e.target.classList.contains("doubleChevronRight") ||
      e.target.classList.contains("notion-open-sidebar") ||
      (d && /^M2.25781/.test(d))
    ) {
      leftSidebar.style.display = "";
    }
  });

  // When the Close button is clicked
  switcher.addEventListener("click", (e) => {
    const d = e.target.getAttribute("d");
    if (
      e.target.classList.contains("notion-close-sidebar") ||
      e.target.classList.contains("doubleChevronLeft") ||
      (d && /^M7/.test(d))
    ) {
      leftSidebar.style.display = "none";
    }
  });

  // When toggling the sidebar with the keyboard
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
      return;
    }
    const mainKey = e.ctrlKey || e.metaKey;
    const subKey =
      e.code === "IntlYen" ||
      e.code === "Backslash" ||
      e.code === "IntlRo" ||
      e.code === "Period";
    if (mainKey && subKey) {
      if (leftSidebarContainer.style.width === "0px") {
        leftSidebar.style.display = "";
      } else {
        leftSidebar.style.display = "none";
      }
    }
  });
};

const controlLeftSidebar = (currentDisplayOptions, leftSidebarContainer) => {
  const leftSidebar = leftSidebarContainer.querySelector(".notion-sidebar");
  const leftSidebarState = currentDisplayOptions.leftSidebarState;
  const preventSidebarOnHover = currentDisplayOptions.preventSidebarOnHover;
  if (leftSidebarContainer.style.width !== "0px") {
    if (leftSidebarState === "close") {
      toggleLeftSidebar();
      setTimeout(() => {
        if (preventSidebarOnHover) {
          leftSidebar.style.display = "none";
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
        leftSidebar.style.display = "";
        addEventListenersForLeftSidebar(leftSidebarContainer);
      }
    } else {
      if (preventSidebarOnHover) {
        leftSidebar.style.display = "none";
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
    if (!leftSidebarContainer) {
      return;
    }
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
