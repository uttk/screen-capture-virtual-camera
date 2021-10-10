import { EmojiLive } from "./utils/EmojiLive";

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
const displayStartButton = (callback: () => unknown) => {
  const startButton = document.createElement("button");

  startButton.innerText = "配信開始🎥";
  startButton.style.color = "black";
  startButton.style.right = "32px";
  startButton.style.bottom = "64px";
  startButton.style.position = "fixed";
  startButton.style.background = "white";
  startButton.style.zIndex = "99999999";
  startButton.style.padding = "8px 16px";
  startButton.addEventListener("click", callback);

  document.body.appendChild(startButton);
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
    console.log("========================");
    console.log("constraints", { constraints });
    console.log("========================");

    if (!constraints || !isVirtualDevice(constraints.video)) {
      return _getUserMedia.call(navigator.mediaDevices, constraints);
    }

    displayStartButton(() => EmojiLive.startScreenCapture());

    return EmojiLive.mediaStream;
  };

  console.log("EMOJI LIVE VIRTUAL CAMERA INSTALLED 🎥");
};

init();
