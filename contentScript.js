(() => {
    let currentVideo = "";
    let youtubeLeftControls, youtubePlayer;
    let currentVideoBookMarks = [];
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, videoId } = obj;
  
      if (type === "NEW") {
        currentVideo = videoId;
        newVideoLoaded();
      }
    });
  
    const newVideoLoaded = () => {
      const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
  
      if (!bookmarkBtnExists) {
        const bookmarkBtn = document.createElement("img");
        bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
        bookmarkBtn.className = "ytp-button bookmark-btn";
        bookmarkBtn.title = "Click to bookmark";
  
        youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
        youtubePlayer = document.getElementsByClassName("video-stream")[0];
  
        if (youtubeLeftControls) {
          youtubeLeftControls.appendChild(bookmarkBtn);
          bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
      }
    };
  
    const addNewBookmarkEventHandler = () => {
        const currentTime = youtubePlayer.currentTime();

        const newBookmark = {
          time: currentTime,
          desc: "Bookmark at" + getTime(currentTime),
        };
        
    chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(
          [...currentVideoBookMarks, newBookmark].sort((a, b) => a.time - b.time)
        ),
      });
    };
  })();
  const getTime = (t) => {
    let date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11, 8);
  };
  