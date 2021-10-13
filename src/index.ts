// <script /> を作成
const script = document.createElement("script");

// 実行したいファイルを設定する
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL("main.js"));

// サイトの `<head />` を取得する
const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

// `<script />` を挿入する
head.insertBefore(script, head.lastChild);
