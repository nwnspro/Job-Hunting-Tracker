# 后端开发指南

## 项目结构

```
backend/
├── src/
│   ├── controllers/     # 控制器层 - 处理HTTP请求
│   │   ├── authController.ts
│   │   └── jobApplicationController.ts
│   ├── services/        # 业务逻辑层
│   │   ├── authService.ts
│   │   └── jobApplicationService.ts
│   ├── routes/          # 路由定义
│   │   ├── authRoutes.ts
│   │   └── jobApplicationRoutes.ts
│   ├── middleware/      # 中间件
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── utils/           # 工具函数
│   │   └── validation.ts
│   ├── types/           # TypeScript类型定义
│   │   └── index.ts
│   └── index.ts         # 主入口文件
├── prisma/              # 数据库相关
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 如何自己创建这些文件

### 1. 创建目录结构

```bash
cd backend
mkdir -p src/{controllers,services,routes,middleware,utils,types}
```

### 2. 安装依赖

```bash
npm install express cors helmet morgan compression express-rate-limit
npm install -D @types/express @types/cors @types/morgan @types/compression
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install prisma @prisma/client
npm install dotenv
```

### 3. 文件创建顺序

#### 第一步：类型定义 (types/index.ts)

- 定义所有接口和类型
- 包括 User、JobApplication、请求响应类型等

#### 第二步：数据库模型 (prisma/schema.prisma)

- 定义 User 和 JobApplication 模型
- 设置字段类型和关系
- 定义枚举值

#### 第三步：服务层 (services/)

- 创建业务逻辑
- 处理数据库操作
- 实现核心功能

#### 第四步：控制器层 (controllers/)

- 处理 HTTP 请求
- 调用服务层
- 返回响应

#### 第五步：中间件 (middleware/)

- 认证中间件
- 错误处理
- 404 处理

#### 第六步：路由 (routes/)

- 定义 API 端点
- 连接控制器和中间件

#### 第七步：工具函数 (utils/)

- 验证函数
- 辅助工具

#### 第八步：主入口 (index.ts)

- 配置 Express 应用
- 注册中间件和路由
- 启动服务器

### 4. 关键概念

#### 分层架构

- **控制器层**: 处理 HTTP 请求，参数验证，调用服务
- **服务层**: 业务逻辑，数据库操作
- **数据层**: Prisma ORM，数据库交互

#### 中间件顺序

1. 安全中间件 (helmet, cors)
2. 日志中间件 (morgan)
3. 解析中间件 (express.json)
4. 路由
5. 错误处理

#### 错误处理

- 使用 try-catch 包装异步操作
- 统一的错误响应格式
- 适当的 HTTP 状态码

#### 认证流程

1. 用户注册/登录
2. 生成 JWT token
3. 客户端存储 token
4. 请求时在 Authorization 头中发送 token
5. 中间件验证 token 并解析用户信息

### 5. 开发建议

#### 代码组织

- 每个文件只负责一个功能
- 使用清晰的命名约定
- 保持函数简洁，职责单一

#### 错误处理

- 始终使用 try-catch
- 记录错误日志
- 返回用户友好的错误消息

#### 安全性

- 验证所有输入
- 使用环境变量存储敏感信息
- 实现适当的权限检查

#### 性能

- 使用数据库索引
- 实现分页
- 合理使用缓存

### 6. 测试 API

使用 Postman 或 curl 测试各个端点：

```bash
# 注册
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 创建求职申请 (需要token)
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"company":"Google","position":"Software Engineer","status":"APPLIED","appliedDate":"2024-01-15"}'
```

### 7. 环境变量

创建`.env`文件：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/landed_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 8. 数据库设置

```bash
# 生成Prisma客户端
npx prisma generate

# 创建数据库迁移
npx prisma migrate dev --name init

# 查看数据库
npx prisma studio
```

## 常见问题

1. **TypeScript 错误**: 确保安装了正确的类型定义包
2. **模块找不到**: 检查 import 路径和文件是否存在
3. **数据库连接**: 验证 DATABASE_URL 和环境变量
4. **JWT 错误**: 确保 JWT_SECRET 已设置

## 下一步

- 添加单元测试
- 实现日志系统
- 添加 API 文档
- 设置 CI/CD 流程
