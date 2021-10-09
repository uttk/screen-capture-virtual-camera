const isVirtualDevice = (video?: MediaTrackConstraints): boolean => {
  if (!video || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

const _getUserMedia = navigator.mediaDevices.getUserMedia;
const _enumerateDevices = navigator.mediaDevices.enumerateDevices;

navigator.mediaDevices.enumerateDevices = async function () {
  const res = await _enumerateDevices
    .call(navigator.mediaDevices)
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });

  const virtualCam = {
    groupId: "uh",
    deviceId: "virtual",
    kind: "videoinput",
    label: "Emoji Live Virtual Camera 🎥",
  } as const;

  res.push({ ...virtualCam, toJSON: () => ({ ...virtualCam }) });

  return res;
};

const canvas = document.createElement("canvas") as HTMLCanvasElement;
const video = document.createElement("video") as HTMLVideoElement;
const ctx = canvas.getContext("2d");

const renderCanvas = () => {
  if (!ctx) return;

  canvas.width = 600;
  canvas.height = 400;
  ctx.fillStyle = "rgb(136, 145, 227)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

video.muted = true;
video.autoplay = true;

navigator.mediaDevices.getUserMedia = async function (
  constraints?: MediaStreamConstraints
) {
  if (!constraints || typeof constraints.video !== "object")
    return _getUserMedia.call(navigator.mediaDevices, constraints);

  const video = constraints.video;

  requestAnimationFrame(() => {
    renderCanvas();
    requestAnimationFrame(renderCanvas);
  });

  if (isVirtualDevice(video)) {
    const newStream = canvas.captureStream(10);
    return newStream;
  }

  return _getUserMedia.call(navigator.mediaDevices, constraints);
};

console.log("EMOJI LIVE VIRTUAL CAMERA INSTALLED 🎥");
