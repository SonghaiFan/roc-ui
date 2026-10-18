# 从 Syuze / Franklin Board 提取真正值得复用的组件

2026-10-18 源码盘点。这里是**提取清单**，不是已可安装的组件列表。当前可安装项目仍见 [README](../README.md)。ROC 应保留原组件的交互机制和内容控制，而不只画一个相似外观。

## 来源与证据

- **Syuze**：`eac9e39c47c913ac389fc84b5717b678bc38f4e5`，本次读取工作区干净。
- **Franklin legacy**：基线 `d10e4908e72ad2ecfe4539f56c5c492e0193ba6f`，归档相关代码有既有未提交修改。
- **Franklin React refactor**：同一基线，`packages/board` 为正在开发的未提交实现。下面的 React 文件指向本次实际读取的工作区，不能用基线 SHA 当作这些文件已提交或已发布的证据。
- 本次是源码盘点。上一轮卡片阅读/回收的运行检查见 [单独记录](syuze-card-presentation.md)；那些结果不能替下列组件背书。

## 组件地图

以下名称是拟议的公开 API 名称，原始文件名另列。

| 组件 | 原始实现 | 值得保留的体验 | 提取边界与状态 |
| --- | --- | --- | --- |
| **Book / PageTurn** 书本与纸页 | Syuze `src/components/memoir/MemoirBook.tsx`, `paginate.ts` | 厚封面与薄纸不同重量；翻页角度、阴影和书体平移联动；拖动后释放；单双页布局 | 高辨识度。先提取纸页/封面运动和分页渲染，再提供书本组合；通过 `pages`/内容 renderer 输入，移除 story store、翻译和 memoir 业务依赖。忙碌页目前拒绝重复翻动，不能声称任意中断。已提取 PageBook 的翻页机制；自动分页、成书入口待提取。 |
| **ImagePresentation / ImageViewport** 图片预览 | Franklin React `react/ImageViewport.tsx`, `Cards.tsx`, `presentation.ts`, `core/image-view.ts`, `core/presentation.ts` | 图片中心放大，缩放以指针为锚；双指缩放、平移、Fit；说明和信息与图片保持比例关系 | 第一批。保留自然尺寸、坐标约束与真实 img；把图片内缩放和卡片到阅读态的几何分开。核心 viewport 可独立，完整 presentation 仍依赖 board。已提取 ImageViewport；完整图片 presentation 待提取。 |
| **SelectionToolbar** 文字选区工具栏 | Syuze `src/spatial/notes-toolbar.js`; Franklin `src/notes-toolbar.js` | 选中文字才出现；点击格式动作不丢选区；工具栏独立于纸面缩放；进出场运动可反向 | 第一批。输入 editor root、`onFormat`、`getFormatState`、active 状态；不绑定特定富文本编辑器。保留 Range 的捕获/恢复和清理。已提取并可安装。 |
| **VoicePlayer / VoiceCard** 语音素材 | Syuze `src/spatial/voice-item.js`, `asset-card.js`, `asset-sheet.js` | 真正的音频控件、进度与倍速；播放互斥；等待/网络/解码/权限错误；原音频与文字稿并存 | 第一批。播放器输入 URL，播放组由外部注入；卡片组合播放器。文字稿为独立数据，不替换录音。不能承诺原版 sheet 在开合时保留同一 audio，它会建立自己的播放器。已提取 VoicePlayer；VoiceCard / sheet 组合待提取。 |
| **SourceTray** 文档素材托盘 | Syuze `src/spatial/document-source-fan.js`, `asset-preview.js` | 真实图片、文本、语音卡片从文档底部展开；点开后落回同一素材；播放器不被假按钮替代 | 第一批组合。接受 sources、renderer 和预览 adapter；保留大小、弹簧、层级及取消代次。原版 `update(refs)` 会重建节点，应明确更新策略。ROC 当前 SourceStack 不是此托盘的完整移植。已提取 SourceTray 的布局和运动；原素材专属 full-view adapter 待提取。 |
| **DocumentPresentation** 文档阅读面 | Syuze `document-view.js`, `presentation-motion.js`; Franklin React `react/presentation.ts`, `core/presentation.ts`, `EditableText.tsx` | 第一页就是全文的同一排版；编辑器、光标、滚动与返回位置连续；工具不参与文字缩放 | 已有 ROC 阅读态修正，尚非完整原版移植。继续提取原比例、内容裁切与编辑 adapter；不把 sticky note 的自由缩放混成文档排版。 |
| **Folder** 上开口／侧开口文件夹 | Syuze `folder-appearance.js`, `folder-container.js`, `mount.js`; Franklin React `Containers.tsx`, `core/containers.ts` | 开口、铰链、收纳口和飞行方向一致；卡片展开为可读布局；相机共同取景；盖板与内容分别响应 | 需要保留完整 motion/layout 组合。原版不是把卡片旋转成一把扇子。ROC 当前 FolderFan 仍有差异；应替换机制，不应另造装饰版。待对齐。 |
| **Stack / RadialStack** 堆叠与来源环 | Syuze `stack-radial.js`, `model.js`, `mount.js`; Franklin React `core/containers.ts` | 普通素材堆叠展开为网格；文档保持中心，来源环绕；成员保持身份，邻居为焦点让位 | 布局算法可先提取；完整交互依赖成员关系、选择、相机和焦点。显式传 `hubId`，不把 `storyId` 作为通用 API。待提取。 |
| **FolderSpace** 文件夹空间 | Franklin React `core/store.ts`, `core/containers.ts`, `react/presentation.ts`, `Containers.tsx`; Syuze `mount.js` | “原地展开”与“进入空间”是两种动作；各自保留相机；返回按预览、堆叠、空间逐层退回 | 作为 headless 状态机 + board recipe；不能假装成一个只靠 CSS 的 folder 组件。进入空间不改成员关系。待提取。 |
| **FileIntoFolder** 拖拽归档 | Syuze `mount.js`, `motion.js`, `spring.js`; Franklin `src/app.js` | 从抓取偏移开始；先聚拢到开口，再沉入；由容器遮挡解释归属；侧开口有对应侧向路径 | 作为交互 recipe；需明确 membership commit、取消、同步与撤销。Franklin 归档源码正被修改，发布前必须再检查来源。待提取。 |
| **ObjectActions / ContextMenu** 对象操作 | Franklin React `ObjectControls.tsx`, `ActionButton.tsx`, `Containers.tsx` | 选择决定动作；原生顶层菜单不被画布裁切；方向键导航；删除文件夹区分移除壳与删除内容 | 提取 action descriptor + selection adapter；不能把业务命令固化进通用菜单，也不能用菜单 demo 代替真实操作。待提取。 |
| **CameraControls / SpatialNavigation** 空间导航 | Franklin React `CameraControls.tsx`, `controller.ts`; Syuze `phase-transition.js`, `camera-layout.js` | 缩放围绕锚点；Fit 连续取景；阶段是同一世界里的位置；保留离开场景直到移动完成 | CameraControls 可单独做 adapter；阶段平移是完整场景 recipe。Syuze 的首次生成/资料抵达属于业务 choreography，不塞进底层相机。待提取。 |
| **RevisionHistory** 文档版本 | Syuze `story-document.js` | 看某个版本不等于采用；草稿保留；保存成功但历史尚未刷新时可以继续恢复 | 作为应用 recipe；外部提供 read/write/adopt，明确 optimistic version、错误和草稿状态。它有价值，但优先级低于直接可复用的视图。待提取。 |
| **GlassPanel / ObjectChrome** 轻量面板 | Syuze `src/components/ui/Panel.tsx`, `src/app/globals.css`, `src/spatial/fabula.css` | 温暖的玻璃面板、紧凑标题和关闭按钮；内容承载颜色，工具保持克制 | 可小规模提取共享 tokens、panel/close controls。不要只迁移装饰而丢掉关闭/焦点语义；也不必扩成庞大的基础 UI 库。待提取。 |

## 提取顺序

1. **先形成真实可用的独立组件**：SelectionToolbar、VoicePlayer、ImageViewport。每个做一个带实际输入或媒体的例子，直接复用原有机制。
2. **做有代表性的组合**：SourceTray 和 Book/PageTurn。素材使用合成内容或可公开资产；保留原生控件、纸张运动和布局，不用示意卡片冒充。
3. **修齐现有组件**：Folder 和 Stack 的真实布局、动作弹簧、相机和遮挡。优先替换现有不准确演示，避免积累两个同名版本。
4. **发布依赖完整状态的 recipes**：FolderSpace、FileIntoFolder、SpatialNavigation、RevisionHistory。以真实状态机示例分享，不伪装为无依赖组件。

这不是按“最容易画出来”排序。Book 是重点展示方向；小型独立组件先完成，能先验证源码提取、分发和原版对照流程。

## 每个组件的交付标准

- 标明来源文件、实际 revision / 工作区状态、移植或改写的边界，以及需要保留的版权声明。
- 先记录原版的操作序列和关键帧，再提取；尺寸、内容和字体一致时对照，差异单独列出。
- 保留对象渲染器和原生输入/媒体控件；业务 store、鉴权、网络请求通过 adapter 注入。
- 对照开、关、中断、滚动后返回、resize、键盘、reduced motion 和卸载；输入选区、音频时间等按对象类型检查。
- Preview 使用 registry 实际分发文件；安装到独立消费者项目验证。未达到这一步就只列“待提取”。
- Skill 记录原则、机制与反例；ROC 展示和分发代码；完整 board 行为用 recipe 分享。三者之间相互链接。

## 0.4 提取进展

已加入可安装组件：[ImageViewport、VoicePlayer、SelectionToolbar、PageBook、SourceTray](extracted-components.md)。书本目前提取纸页/封面运动与单双页，分页和成书入口未提取；图片目前是内部手势 viewport，完整卡片 presentation 未提取。上表其余 board recipes 继续保留待提取状态。
