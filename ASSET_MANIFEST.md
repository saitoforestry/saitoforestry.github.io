# 素材管理

改修完了時点で、公開中のページから参照されている素材と未使用データを分離しています。

## 公開・使用中

- `assets/images/` — ロゴ、写真、ポスター、favicon
- `assets/images/gallery/` — ギャラリー専用画像
- `assets/video/` — 公開ページで再生する動画

## ローカル保管・未使用

未使用データは `_archive/` に退避し、Gitおよび本番公開の対象外にしています。

- `_archive/unused/images/` — 旧ロゴ、LINE二次元コード、未採用写真
- `_archive/unused/videos/` — 重複動画、未採用動画
- `_archive/documents/` — 仕様書、指示書、会社情報
- `_archive/drafts/` — 旧HTMLなどの制作途中データ

サイトへ素材を追加するときは、公開使用するファイルのみ `assets/` に移動し、HTMLまたはCSSから参照してください。
