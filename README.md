# my-fasta-viewer

my-fasta-viewer是一个基于React的FASTA序列可视化和编辑工具，提供直观的界面来查看、编辑和分析FASTA格式的序列数据。

## 功能特点

- 序列可视化：直观地查看和编辑FASTA序列
- 序列搜索：快速查找特定序列片段
- 位置跳转：迅速定位到序列的指定位置
- 列管理：选择、删除和操作序列中的特定列
- 导出功能：将编辑后的序列导出为FASTA文件
- 自适应布局：支持各种屏幕尺寸的响应式显示

## 快速开始

### 开发环境

```bash
# 克隆代码仓库
git clone https://github.com/xuzhougeng/simple-msa-viewer.git

# 安装依赖
cd my-fasta-viewer
npm install

# 启动开发服务器
npm start
```

开发服务器启动后，访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产部署

1. 构建生产版本：

```bash
npm run build
```

2. 部署方式：

#### 方式一：使用 nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/my-fasta-viewer/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 方式二：使用 Docker

```dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建并运行Docker容器：

```bash
docker build -t my-fasta-viewer .
docker run -d -p 80:80 my-fasta-viewer
```

## 使用指南

### 1. 数据输入

- **加载示例**：点击"Load Demo"按钮加载示例数据
- **上传文件**：点击"Upload FASTA"上传本地FASTA文件
- **粘贴输入**：直接将序列粘贴到文本框中

### 2. 基本操作

- **序列导航**：
  - 使用页面底部的导航按钮在序列间移动
  - 输入位置编号快速跳转到特定位置

- **搜索功能**：
  - 在搜索框输入序列片段
  - 按Enter或点击搜索图标开始搜索
  - 搜索结果会高亮显示

- **序列编辑**：
  - 选择列：单击或按住Shift多选
  - 删除列：选中后点击"Delete Selected Columns"
  - 清除高亮：点击"Clear Highlights"

### 3. 快捷键

- `Ctrl + Z`: 撤销上一步操作
- `Enter`: 触发搜索或跳转操作
- `Delete`: 删除选中的列
- `Shift + Click`: 多选列

### 4. 注意事项

- 确保FASTA序列格式正确
- 大型序列可能需要较长加载时间
- 建议定期保存工作成果

## 技术栈

- React
- Tailwind CSS
- lucide-react (图标)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 问题反馈

如有问题或建议，请联系：xuzhougeng@163.com

## License

MIT License

