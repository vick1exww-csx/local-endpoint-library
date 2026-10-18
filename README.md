# 本地 API 地址簿 · Local Endpoint Library

给 SillyTavern 的 **Custom Endpoint (Base URL)** 添加本地地址簿，像选择 API Key 一样选择保存过的 API 地址。

## 安装

1. 打开酒馆的 **扩展 → 安装扩展**。
2. 粘贴仓库链接：`https://github.com/vick1exww-csx/local-endpoint-library`。
3. 安装完成后刷新页面。
4. 打开 **API 连接 → 聊天补全 → 自定义（兼容 OpenAI）**。

地址输入框下方会出现下拉列表、**保存当前地址**和**移除**按钮。无需 Extras 服务，无需安装 npm 依赖。

## 使用

- 填写 API 基础地址，点击 **保存当前地址**，输入便于识别的名称。
- 从下拉列表选择地址，即可填入上方的 Custom Endpoint。
- 再次保存同一地址，可以修改它的显示名称。
- 点击 **移除** 从地址簿删除；10 秒内点击提示消息可以撤销。

切换地址只改变 URL，**API Key 和模型需要手动选择匹配的选项**。选择地址不会主动发送测试聊天。

地址簿保存在酒馆当前用户的本地 `settings.json` 中，字段为 `extension_settings.local_endpoint_library`。不同用户的地址簿相互独立；刷新或重启后仍然保留。请备份酒馆用户数据以保留地址簿。

原生连接配置（Connection Profile）仍可覆盖当前地址；地址簿保存的条目不会因此删除。

## 手动安装与升级

将仓库根目录文件放到 `SillyTavern/public/scripts/extensions/third-party/local-endpoint-library/`，刷新页面。

如果之前手动安装过同名文件夹，酒馆可能提示目录已存在。原有安装可直接使用；要启用 Git 更新，应先备份并移走原来的扩展文件夹，再通过仓库链接安装。地址簿位于用户设置中，不在扩展文件夹内。

不要同时安装两份本扩展。通过酒馆界面安装的版本可使用扩展管理页面的更新功能。

## 兼容性

已在 SillyTavern 1.17.0 验证加载、保存、重命名、选择地址及刷新后的持久保存。依赖酒馆的 `custom_api_url_text` 控件、扩展设置及弹窗接口；其他版本未逐一验证。

## 隐私

扩展代码不包含任何用户的 API 地址、密钥或聊天记录。保存地址时只记录用户输入的名称和 URL。扩展不读取或管理 API Key，不向第三方上传地址簿。请不要将密钥填写在地址 URL 中。

## License

MIT
