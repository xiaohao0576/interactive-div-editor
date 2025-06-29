# A4 Web Editor

一个基于Web的A4页面可视化编辑器，支持拖拽、调整大小和文字编辑功能。

## 功能特性

### 核心功能
- 🖱️ **拖拽移动** - 按住Ctrl键拖动div元素
- 📏 **调整大小** - 按住Shift键调整div尺寸
- ✏️ **文字编辑** - 双击div编辑文字内容
- 🗑️ **删除元素** - Ctrl+双击删除div（带确认提示）
- ➕ **创建元素** - 双击空白区域创建新div

### 智能特性
- 🔤 **自适应字体** - 文字大小自动适应div尺寸
- 📊 **精确定位** - 使用transform定位，支持毫米/像素单位转换
- 🎯 **边界限制** - 元素限制在A4页面范围内
- 🎨 **视觉反馈** - 不同操作模式有不同的边框和透明度提示
- 📋 **样式输出** - 实时在控制台输出元素的绝对样式信息

## 使用方法

### 基本操作
1. **默认状态**：所有div半透明显示，不可交互
2. **拖拽模式**：按住`Ctrl`键，div显示绿色边框，可拖动
3. **调整大小模式**：按住`Shift`键，div显示蓝色边框，可调整尺寸
4. **编辑文字**：双击div进入文字编辑模式
5. **删除元素**：`Ctrl + 双击`删除div（有确认提示）
6. **创建元素**：双击页面空白区域创建新div

### 键盘快捷键
| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 拖拽 | `Ctrl + 鼠标拖拽` | 移动div位置 |
| 调整大小 | `Shift + 鼠标拖拽` | 改变div尺寸 |
| 编辑文字 | `双击div` | 编辑div内容 |
| 删除 | `Ctrl + 双击div` | 删除div元素 |
| 创建 | `双击空白区域` | 创建新div |

## 技术特点

### 定位系统
- 使用`transform: translate()`进行定位
- `top`和`left`始终为0，完全依赖transform
- 支持毫米和像素单位的精确转换

### 交互实现
- 基于[Interact.js](https://interactjs.io/)库实现拖拽和调整大小
- 条件式交互：只有在按键时才启用对应功能
- 智能边界检测，防止元素移出页面范围

### 自适应文字
- 动态计算最适合的字体大小
- 确保文字始终在div范围内显示
- 支持最小字体限制（8px）和最大字体限制（100px）

## 项目结构

```
interactive-div-editor/
├── index.html          # 主页面文件
├── index.js           # 核心JavaScript逻辑
├── 0.png             # 背景图片
└── README.md         # 项目说明
```

## 快速开始

### 本地运行
1. 克隆项目到本地
```bash
git clone git@github.com:xiaohao0576/interactive-div-editor.git
cd interactive-div-editor
```

2. 使用HTTP服务器运行（推荐）
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用任何其他HTTP服务器
```

3. 访问 `http://localhost:8000`

### 直接打开
也可以直接双击`index.html`文件在浏览器中打开，但推荐使用HTTP服务器以获得最佳体验。

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 依赖库

- [Interact.js](https://interactjs.io/) - 拖拽和调整大小功能
- [Paper.css](https://github.com/papercss/papercss) - A4纸张样式
- [Normalize.css](https://necolas.github.io/normalize.css/) - CSS重置

## 开发说明

### 坐标系统
- 所有div使用transform定位，坐标系原点为A4页面左上角
- `data-x`和`data-y`属性存储元素的实际坐标
- 支持毫米到像素的精确转换（96 DPI标准）

### 样式输出
每次操作后会在浏览器控制台输出div的详细样式信息：
```javascript
{
  position: 'absolute',
  top: '10.23mm',
  left: '15.67mm', 
  width: '30.00mm',
  height: '15.00mm',
  topPx: '39.00px',
  leftPx: '59.76px',
  widthPx: '113.39px',
  heightPx: '56.69px'
}
```

## 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境设置
1. Fork本项目
2. 创建特性分支：`git checkout -b feature/新功能`
3. 提交更改：`git commit -am '添加新功能'`
4. 推送到分支：`git push origin feature/新功能`
5. 提交Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 更新日志

### v1.0.0 (2025-06-29)
- ✨ 初始版本发布
- ✨ 支持Ctrl+拖拽和Shift+调整大小
- ✨ 双击编辑文字功能
- ✨ 自适应字体大小
- ✨ 精确的毫米/像素转换
- ✨ 完整的边界限制

## 致谢

感谢以下开源项目：
- [Interact.js](https://interactjs.io/) - 提供强大的拖拽交互功能
- [Paper.css](https://github.com/papercss/papercss) - 提供标准纸张样式