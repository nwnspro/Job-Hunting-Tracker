# Job Hunting Tracker

一个现代化的求职申请跟踪应用，使用 React + TypeScript + Tailwind CSS 构建。

## 项目结构

### 核心文件

#### 1. 应用入口

- `frontend/src/main.tsx` - React 应用入口点
- `frontend/src/App.tsx` - 主应用组件，包含整体布局和状态管理

#### 2. 样式和配置

- `frontend/index.html` - HTML 模板，包含 Onest 字体链接
- `frontend/src/index.css` - 全局样式，包含 Onest 字体设置和 CSS 变量
- `frontend/tailwind.config.js` - Tailwind CSS 配置，包含字体和颜色设置
- `frontend/vite.config.ts` - Vite 构建配置，包含路径别名设置
- `frontend/tsconfig.json` - TypeScript 配置，包含路径映射

#### 3. 组件结构

##### 主要组件

- `frontend/src/components/Header.tsx` - 页面头部组件

  - 用户头像图标
  - 主标题 "Hey, What new progress today?"
  - 搜索框和 Auto Fill 按钮
  - 视图切换图标（表格/统计/开关）

- `frontend/src/components/Content.tsx` - 主要内容区域

  - MainSheet 表格界面
  - 公司搜索功能
  - 表格排序和编辑功能
  - 添加工作表单

- `frontend/src/components/Controls.tsx` - 控制组件（已整合到 Content 中）
- `frontend/src/components/Loading.tsx` - 加载状态组件

##### 数据展示组件

- `frontend/src/components/JobTable.tsx` - 工作表格组件
- `frontend/src/components/JobStats.tsx` - 统计图表组件
- `frontend/src/components/AddJobForm.tsx` - 添加工作表单

##### UI 组件

- `frontend/src/components/ui/button.tsx` - 按钮组件
- `frontend/src/components/ui/input.tsx` - 输入框组件
- `frontend/src/components/ui/select.tsx` - 选择框组件

#### 4. 数据和逻辑

- `frontend/src/hooks/useJobs.ts` - 工作数据管理 Hook
  - 获取工作列表
  - 添加/更新/删除工作
  - 获取统计数据
- `frontend/src/services/jobService.ts` - API 服务层
- `frontend/src/types/job.ts` - 工作数据类型定义
- `frontend/src/utils/exportUtils.ts` - 数据导出工具

#### 5. 配置文件

- `frontend/components.json` - shadcn/ui 组件配置
- `frontend/src/lib/utils.ts` - 工具函数（cn 函数等）

## 功能分布

### 1. 用户界面

- **页面布局**: `App.tsx`
- **头部区域**: `Header.tsx`
- **主要内容**: `Content.tsx`
- **加载状态**: `Loading.tsx`

### 2. 数据管理

- **状态管理**: `useJobs.ts` Hook
- **API 调用**: `jobService.ts`
- **类型定义**: `types/job.ts`

### 3. 搜索和过滤

- **公司搜索**: `Content.tsx` 中的搜索逻辑
- **表格排序**: `Content.tsx` 中的排序功能
- **状态过滤**: 通过状态标签筛选

### 4. 表格功能

- **表格显示**: `JobTable.tsx`
- **单元格编辑**: `Content.tsx` 中的编辑逻辑
- **行操作**: 更新状态、删除记录

### 5. 统计功能

- **数据统计**: `JobStats.tsx`
- **图表展示**: 使用 Recharts 库

### 6. 导出功能

- **CSV 导出**: `exportUtils.ts`
- **Google Sheets 集成**: 预留接口

## 样式系统

### 字体设置

- **Onest 字体**: 在 `index.html` 中引入，在 `tailwind.config.js` 中配置
- **字体工具类**: 在 `index.css` 中定义各种字重的类

### 颜色系统

- **主题色彩**: 在 `tailwind.config.js` 中定义
- **CSS 变量**: 在 `index.css` 中定义亮色和暗色主题

### 组件样式

- **shadcn/ui**: 使用 shadcn/ui 组件库
- **Tailwind CSS**: 使用 Tailwind 进行样式设计

## 开发指南

### 添加新功能

1. 在相应的组件文件中添加功能
2. 更新类型定义（如需要）
3. 添加相应的样式
4. 更新文档

### 修改样式

1. 全局样式：修改 `index.css`
2. 组件样式：修改对应组件文件
3. 主题配置：修改 `tailwind.config.js`

### 添加新组件

1. 在 `components` 目录下创建新文件
2. 导出组件
3. 在需要的地方导入使用

## 技术栈

- **前端框架**: React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **状态管理**: React Query (TanStack Query)
- **图标**: Lucide React
- **字体**: Onest (Google Fonts)
- **构建工具**: Vite
- **包管理**: pnpm
