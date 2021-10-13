# Screen Capture Virtual Camera 🎥

画面キャプチャを仮想カメラとして表示するためのブラウザ拡張です。


## ビルド方法

拡張機能を使うには、ソースコードをビルドする必要があります。

先ず初めに、このリポジトリをクローンして以下のコマンドを実行してください。

```shell
$> yarn install
```

次に、ビルドコマンドを実行してビルドします。

```shell
# 本番用
$> yarn build

# 開発用
$> yarn dev

# 開発用( ファイル監視 )
$> yarn dev --watch
```

## 拡張機能のインストール

※ 現在、Chrome拡張のみ対応しているためChromeのインストール方法のみ記載しています。

`chrome://extensions/` にアクセスして、以下の画像のようにディベロッパーモードから`パッケージ化されてない拡張機能を読み込む`をクリックして、ビルドした`manifest.json`が含まれるフォルダーを読み込んでください。

![Chrome拡張のインストール方法の解説画像](/images/chrome-extension-install.png)

読み込みが完了すると、以下の画像のようにインストールした拡張が表示されます。

![インストールされた拡張が表示されている画像](/images/chrome-extension-install-complete.png)


## 使用方法

### サンプルアプリ

以下のコマンドを実行して、サンプルアプリを実行することができます。

```shell
$> yarn start
```

### Google Meet

**※ Google Meet の挙動がおかしくなる可能性がありますので、実行する際は自己責任でお願いします。**

[Google Meet](https://apps.google.com/intl/ja/meet/) にアクセスして会議を開き、表示したい画面をポップアップから選択すると、選択した画面をカメラとして使用できます。


![Google Meetで作った拡張を使用しているGif画像](/images/chrome-extension-example.gif)

※ 遷移するたびにポップアップが表示されますので、使用する際はそれぞれ別ウィンドウで開く必要があります。

