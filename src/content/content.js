/* eslint-disable no-undef */
import { getDefaultOptions } from "../utils/defaultOptions";
import { getFromStorage } from "../utils/handleStorage";

let options = getDefaultOptions();

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

  const topbarMoreBtn = document.querySelector(".notion-topbar-more-button");

  const switchUpdatesAnalyticsObserver = new MutationObserver(
    (_, _observer) => {
      const tabsContainer = document.querySelector(
        ".notion-update-sidebar-tab-updates-header:has(.hide-scrollbar)",
      );
      if (!tabsContainer) {
        return;
      }
      _observer.disconnect();
      const tabWrappers = tabsContainer.querySelectorAll(
        ".hide-scrollbar > div",
      );
      if (tabWrappers.length !== 2) {
        return;
      }
      switch (rightSidebarState) {
        case "openUpdates": {
          const tabWrapper = tabWrappers[0];
          if (tabWrapper.style.position === "") {
            const tab = tabWrapper.querySelector("div[role='tab']");
            if (tab) {
              tab.click();
              console.log("Open 'updates'");
            }
          }
          break;
        }
        case "openAnalytics": {
          const tabWrapper = tabWrappers[1];
          if (tabWrapper.style.position === "") {
            const tab = tabWrapper.querySelector("div[role='tab']");
            if (tab) {
              tab.click();
              console.log("Open 'analytics'");
            }
          }
          break;
        }
      }
    },
  );

  const openUpdatesAnalyticsSidebar = () => {
    if (!["openUpdates", "openAnalytics"].includes(rightSidebarState)) {
      return;
    }

    new MutationObserver((_, _observer) => {
      const actionDialog = document.querySelector(
        "div[role='dialog']:has(.notion-scroller.vertical):has(.sticky-portal-target):has(.clock)",
      );
      if (!actionDialog) {
        return;
      }
      _observer.disconnect();
      const updatesAnalyticsOption = actionDialog.querySelector(
        "[role='option']:has(svg.clock)",
      );
      if (!updatesAnalyticsOption) {
        console.log("'Updates & analytics' option not found");
        return;
      }
      updatesAnalyticsOption.click();

      switchUpdatesAnalyticsObserver.observe(document, {
        childList: true,
        subtree: true,
      });
    }).observe(document, { childList: true, subtree: true, attributes: true });

    switch (rightSidebarState) {
      case "openUpdates":
      case "openAnalytics":
        topbarMoreBtn?.click();
        break;
    }
  };

  if (isOpen && rightSidebarState === "close") {
    toggleRightSidebar();
    console.log("Close right sidebar");
  } else if (isOpen) {
    const commentsHeader = document.querySelector(
      ".notion-update-sidebar-tab-comments-header",
    );
    if (commentsHeader) {
      if (rightSidebarState !== "openComments") {
        openUpdatesAnalyticsSidebar();
      }
    } else {
      if (rightSidebarState === "openComments") {
        const commentsBtn = document.querySelector(
          ".notion-topbar-comments-button",
        );
        if (commentsBtn) {
          commentsBtn.click();
          console.log("Open 'comments'");
        }
      } else {
        switchUpdatesAnalyticsObserver.observe(document, {
          childList: true,
          subtree: true,
        });
        const elem = document.createElement("div");
        elem.style.display = "none";
        document.body.append(elem);
        elem.remove();
      }
    }
  } else if (!isOpen && rightSidebarState !== "close") {
    if (rightSidebarState === "openComments") {
      commentsBtn?.click();
      console.log("Open 'comments'");
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
      e.target.classList.contains("notion-open-sidebar") ||
      e.target.classList.contains("arrowChevronDoubleForward") ||
      (d && e.target.closest(".arrowChevronDoubleForward"))
    ) {
      leftSidebar.style.display = "";
    }
  });

  // When the Close button is clicked
  switcher.addEventListener("click", (e) => {
    const d = e.target.getAttribute("d");
    if (
      e.target.classList.contains("notion-close-sidebar") ||
      e.target.classList.contains("arrowChevronDoubleBackward") ||
      (d && e.target.closest(".arrowChevronDoubleBackward"))
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

chrome.runtime.onMessage.addListener(async (displayInfo) => {
  options = (await getFromStorage()).options ?? options;
  const currentDisplayOptions = options.displays.find(
    (d) => displayInfo.id === d.id,
  );
  if (!currentDisplayOptions) {
    return;
  }

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
  chrome.runtime.sendMessage("");
};

main();
