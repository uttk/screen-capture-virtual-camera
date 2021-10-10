class EmojiLiveClass {
  public mediaStream: MediaStream;

  private isStopped = false;
  private isCaptured = false;
  private context: CanvasRenderingContext2D;
  private video: HTMLVideoElement = document.createElement("video");
  private canvas: HTMLCanvasElement = document.createElement("canvas");

  constructor() {
    this.video = document.createElement("video");
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.mediaStream = this.canvas.captureStream(30);
  }

  async startScreenCapture(): Promise<void> {
    if (this.isCaptured) return;

    const captureStream = await navigator.mediaDevices
      .getDisplayMedia({ audio: false, video: true })
      .catch((error) => {
        console.error(error);
        console.log("再生に失敗しました");
        return null;
      });

    const tracks = captureStream?.getTracks();

    if (!tracks) return console.error("配信に失敗しました😥");

    this.isCaptured = true;
    this.isStopped = false;

    tracks.forEach((track) => {
      track.onended = () => {
        this.isStopped = true;
        this.isCaptured = false;
        this.video.srcObject = null;

        console.log("STOP: Emoji Live 🎥");
      };
    });

    this.video.muted = true;
    this.video.srcObject = captureStream;

    await this.video
      .play()
      .then(() => this.render())
      .catch(() => console.error("配信に失敗しました😥"));

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    console.log("配信スタート🎥 from playEmojiLive()");
  }

  render(): void {
    if (this.isStopped) return;

    console.log("rendering ...");

    const width = this.video.videoWidth;
    const height = this.video.videoHeight;

    this.context.drawImage(this.video, 0, 0, width, height);

    requestAnimationFrame(() => this.render());
  }
}

export const EmojiLive = new EmojiLiveClass();
