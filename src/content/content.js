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

  const openUpdatesAnalyticsSidebar = async () => {
    return await (() => {
      return new Promise((resolve, reject) => {
        const moreBtn = document.querySelector(".notion-topbar-more-button");
        if (!moreBtn) {
          reject(false);
        }
        moreBtn.click();
        const moreDialogObserver = new MutationObserver((_, _observer) => {
          const listbox = document.querySelector(
            "div[role='dialog'] div[role='listbox']",
          );
          if (!listbox) {
            return;
          }
          _observer.disconnect();
          const clockSvg = listbox.querySelector("svg.clock");
          if (!clockSvg) {
            return;
          }
          const targetOption = clockSvg.closest("[role='option']");
          if (!targetOption) {
            return;
          }
          const nextOption =
            targetOption.nextElementSibling.querySelector("svg.stack");
          if (!nextOption) {
            return;
          }

          targetOption.click();
          console.log("Open right sidebar");
          resolve(true);
        });
        moreDialogObserver.observe(document, {
          childList: true,
          subtree: true,
        });
        setTimeout(() => {
          moreDialogObserver.disconnect();
          resolve(false);
        }, 5000);
      });
    })();
  };

  const openCommentsSidebar = () => {
    const tabpanelObserver = new MutationObserver((_, _observer) => {
      const tabpanel = document.querySelector(
        ".notion-update-sidebar div[role='tabpanel'][id^='UpdateSidebar-tabpanel-']",
      );
      if (!tabpanel) {
        return;
      }
      _observer.disconnect();
      if (rightSidebarState === "openComments") {
        const tablist = document.querySelectorAll(
          ".notion-update-sidebar-tab-updates-header div[role='tablist'] div[role='tab'][id^='UpdateSidebar-tab-']",
        );
        if (tablist.length) {
          commentsBtn.click();
          console.log("Open 'comments'");
        }
      } else {
        openUpdatesAnalyticsSidebar();
      }
    });

    tabpanelObserver.observe(document, { childList: true, subtree: true });
    const elem = document.createElement("div");
    elem.style.display = "none";
    document.body.append(elem);
    elem.remove();

    setTimeout(() => {
      tabpanelObserver.disconnect();
    }, 5000);
  };

  const switchUpdatesAnalyticsSidebar = () => {
    const tablistObserver = new MutationObserver((_, _observer) => {
      const tablist = document.querySelectorAll(
        ".notion-update-sidebar-tab-updates-header div[role='tablist'] div[role='tab'][id^='UpdateSidebar-tab-']",
      );
      if (tablist.length !== 2) {
        return;
      }
      _observer.disconnect();
      const updatesTab = tablist[0];
      const analyticsTab = tablist[1];
      switch (rightSidebarState) {
        case "openUpdates":
          if (updatesTab.ariaSelected === "false") {
            updatesTab.click();
            console.log("Open 'updates'");
          }
          break;
        case "openAnalytics":
          if (analyticsTab.ariaSelected === "false") {
            analyticsTab.click();
            console.log("Open 'analytics'");
          }
          break;
      }
    });

    tablistObserver.observe(document, { childList: true, subtree: true });
    const elem = document.createElement("div");
    elem.style.display = "none";
    document.body.append(elem);
    elem.remove();

    setTimeout(() => {
      tablistObserver.disconnect();
    }, 5000);
  };

  if (isOpen && rightSidebarState === "close") {
    toggleRightSidebar();
    console.log("Close right sidebar");
  } else if (isOpen) {
    const commentsHeader = document.querySelector(
      ".notion-update-sidebar-tab-comments-header",
    );
    if (commentsHeader) {
      // comments -> updates/analytics
      if (rightSidebarState !== "openComments") {
        if (await openUpdatesAnalyticsSidebar()) {
          setTimeout(() => {
            switchUpdatesAnalyticsSidebar();
          }, 1000);
        }
      }
    } else {
      if (rightSidebarState === "openComments") {
        // updates/analytics -> comments
        openCommentsSidebar();
      } else {
        switchUpdatesAnalyticsSidebar();
      }
    }
  } else if (!isOpen && rightSidebarState !== "close") {
    if (!(await openUpdatesAnalyticsSidebar())) {
      return;
    }
    if (rightSidebarState === "openComments") {
      // updates/analytics -> comments
      openCommentsSidebar();
    } else {
      switchUpdatesAnalyticsSidebar();
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

  if (document.body) {
    const elem = document.createElement("div");
    elem.style.display = "none";
    document.body.append(elem);
    elem.remove();
  }
});

const main = async () => {
  chrome.runtime.sendMessage("");
};

main();
