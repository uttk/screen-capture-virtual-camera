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
 * @description 初期化処理を行う関数
 */
const init = () => {
  const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  );
  const _enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
    navigator.mediaDevices
  );

  navigator.mediaDevices.enumerateDevices = async function () {
    const res = await _enumerateDevices.call(navigator.mediaDevices);

    const virtualCam = {
      groupId: "default",
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
      return _getUserMedia(constraints);
    }

    const captureStream = await navigator.mediaDevices
      .getDisplayMedia({ audio: false, video: true })
      .catch((error) => {
        console.error(error);
        console.log("Failed to play 😥");
        return null;
      });

    const tracks = captureStream?.getTracks();

    if (!captureStream || !tracks) throw new Error("Failed to play 😥");

    tracks.forEach((track) => {
      track.onended = () => console.log("STOP: Emoji Live 🎥");
    });

    console.log("START: Emoji Live 🎥");

    return captureStream;
  };

  console.log("EMOJI LIVE VIRTUAL CAMERA INSTALLED 🎥");
};

init();
