/**
 * @description 仮想カメラか判定する
 */
const isVirtualDevice = (video?: MediaTrackConstraints | boolean): boolean => {
  if (!video) return false;
  if (video === true) return false;
  if (!video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

/**
 * @description 画面共有を開始するためのボタンを表示する
 */
const displayStartButton = <T>(callback: () => Promise<T>): Promise<T> => {
  const startButton = document.createElement("button");

  startButton.innerText = "配信開始🎥";
  startButton.style.color = "black";
  startButton.style.right = "32px";
  startButton.style.bottom = "64px";
  startButton.style.position = "fixed";
  startButton.style.background = "white";
  startButton.style.zIndex = "99999999";
  startButton.style.padding = "8px 16px";

  document.body.appendChild(startButton);

  return new Promise<T>((resolve) => {
    startButton.addEventListener("click", () => {
      callback().then(resolve);
    });
  });
};

const init = () => {
  const _getUserMedia = navigator.mediaDevices.getUserMedia;
  const _enumerateDevices = navigator.mediaDevices.enumerateDevices;

  navigator.mediaDevices.enumerateDevices = async function () {
    const res = await _enumerateDevices.call(navigator.mediaDevices);

    const virtualCam = {
      groupId: "uh",
      deviceId: "virtual",
      kind: "videoinput",
      label: "Emoji Live Virtual Camera 🎥",
    } as const;

    res.push({ ...virtualCam, toJSON: () => ({ ...virtualCam }) });

    return res;
  };

  navigator.mediaDevices.getUserMedia = async function (
    constraints?: MediaStreamConstraints
  ) {
    if (!constraints || !isVirtualDevice(constraints.video)) {
      return _getUserMedia.call(navigator.mediaDevices, constraints);
    }

    const stream = await displayStartButton(async () => {
      const captureStream = await navigator.mediaDevices
        .getDisplayMedia({ audio: false, video: true })
        .catch((error) => {
          console.error(error);
          console.log("再生に失敗しました");
          return null;
        });

      const tracks = captureStream?.getTracks();

      if (!captureStream || !tracks) throw new Error("配信に失敗しました😥");

      tracks.forEach((track) => {
        track.onended = () => console.log("STOP: Emoji Live 🎥");
      });

      console.log("配信スタート🎥 from playEmojiLive()");

      return captureStream;
    });

    return stream;
  };

  console.log("EMOJI LIVE VIRTUAL CAMERA INSTALLED 🎥");
};

init();
