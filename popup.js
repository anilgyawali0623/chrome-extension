import { getCurrentTab } from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkELement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";
  newBookmarkELement.id = "bookmark-" + bookmark.time;
  newBookmarkELement.className = "bookmark";
  newBookmarkELement.setAttribute("timestamp", bookmark.time);
  setBookmarkAttributes("play", onplay, controlsElement);
  newBookmarkELement.appendChild(bookmarkTitleElement);
   newBookmarkELement.appendChild(controlsElement)
  bookmarksElement.appendChild(newBookmarkELement);
};
const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";
  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row"> no bookmarks to show </i>';
  }
};


 const onPlay=async (e)=>{
     const bookmarkTime= e.target.parentNode.parentNode.getAttribute('timestamp');
      const activeTab= await getActiveTabUrl();
       chrome.tabs.sendMessage(activeTab.id,{
         type:"PLAY",
         value:bookmarkTime
       })
 }
const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");
  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabUrl();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideosBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title">this is not a youtube video </div>  ';
  }
});
