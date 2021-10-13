/**
 * @description 画面キャプチャのStreamを返す関数
 */
const getCaptureStream = async () => {
  // 画面キャプチャのStreamを取得する
  const captureStream = await navigator.mediaDevices.getDisplayMedia({
    audio: false, // 音声はいらないので false に。
    video: true,
  });

  if (!captureStream) throw new Error("動画情報の取得に失敗しました 😥");

  // キャプチャが終了した時のコールバックを設定する
  captureStream.getTracks().forEach((track) => {
    track.onended = () => console.log("STOP: Emoji Live 🎥");
  });

  return captureStream;
};

/**
 * @description 仮想カメラか判定する
 */
const isVirtualDevice = (video?: MediaTrackConstraints | boolean): boolean => {
  if (!video || video === true || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

// 元々の`getUserMedia()`を保持しておく
const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
  navigator.mediaDevices
);

// `getUserMedia()`を上書きする
navigator.mediaDevices.getUserMedia = async function (
  constraints?: MediaStreamConstraints
) {
  // 仮想デバイスでなければ、元々のAPIを実行する
  if (!constraints || !isVirtualDevice(constraints.video)) {
    return _getUserMedia(constraints);
  }

  // 画面キャプチャのStream情報を取得する
  const stream = await getCaptureStream();

  // 仮想デバイスのStreamとして画面キャプチャのStreamを返す
  return stream;
};

// 元々の`enumerateDevices()`を保持しておく
const _enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
  navigator.mediaDevices
);

// `enumerateDevices()`を上書きする
navigator.mediaDevices.enumerateDevices = async function () {
  // 使用できるデバイス(マイク・カメラなど)を取得する
  const devices = await _enumerateDevices();

  // 仮想デバイスの情報を定義
  const virtualDevice = {
    groupId: "default",
    deviceId: "virtual",
    kind: "videoinput",
    label: "Emoji Live Virtual Camera 🎥",
  } as const;

  // 仮想デバイスを追加する
  devices.push({ ...virtualDevice, toJSON: () => ({ ...virtualDevice }) });

  return devices;
};

console.log("EMOJI LIVE VIRTUAL CAMERA がインストールされました 🎥");
