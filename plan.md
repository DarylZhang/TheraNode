# TheraNode 后端开发计划

> 项目名称：`theranode-api`  
> 基于前端项目功能分析，设计对应的 Spring Boot RESTful 后端服务

---

## 一、项目概览

### 技术栈

| 类别 | 选型 |
|------|------|
| 语言 | Java 21 |
| 框架 | Spring Boot 3.4.x |
| 持久层 | Spring Data JPA + Hibernate |
| 数据库 | PostgreSQL（生产/开发）|
| 数据库迁移 | Flyway |
| 安全 | Spring Security 6 + JWT + OAuth2 Client |
| 构建工具 | Gradle 8.x（Kotlin DSL）|
| 工具库 | Lombok、MapStruct、Validation |
| 测试 | JUnit 5、Mockito、Spring Boot Test、RestAssured、WireMock |
| 配置文件 | YAML（application.yml）|
| AI 代理 | Google Gemini API（通过 HTTP 调用）|

### 项目结构

```
theranode-api/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/com/theranode/api/
│   │   │   ├── TheranodeApiApplication.java
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── GeminiConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   ├── ChatController.java
│   │   │   │   ├── StudioController.java
│   │   │   │   ├── CommunityController.java
│   │   │   │   ├── EmotionController.java
│   │   │   │   ├── PlayspaceController.java
│   │   │   │   ├── WhiteboardController.java
│   │   │   │   ├── ReportController.java
│   │   │   │   └── MembershipController.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── DashboardService.java
│   │   │   │   ├── ChatService.java
│   │   │   │   ├── GeminiService.java
│   │   │   │   ├── StudioService.java
│   │   │   │   ├── CommunityService.java
│   │   │   │   ├── EmotionService.java
│   │   │   │   ├── PlayspaceService.java
│   │   │   │   ├── WhiteboardService.java
│   │   │   │   ├── ReportService.java
│   │   │   │   ├── MembershipService.java
│   │   │   │   ├── EmailService.java
│   │   │   │   └── SmsService.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── RefreshTokenRepository.java
│   │   │   │   ├── VerificationCodeRepository.java
│   │   │   │   ├── ChatSessionRepository.java
│   │   │   │   ├── ChatMessageRepository.java
│   │   │   │   ├── StudioEntryRepository.java
│   │   │   │   ├── CommunityPostRepository.java
│   │   │   │   ├── PostLikeRepository.java
│   │   │   │   ├── PostBookmarkRepository.java
│   │   │   │   ├── PostCommentRepository.java
│   │   │   │   ├── EmotionRecordRepository.java
│   │   │   │   ├── PlayspaceItemRepository.java
│   │   │   │   ├── WhiteboardRepository.java
│   │   │   │   ├── MembershipPlanRepository.java
│   │   │   │   └── UserMembershipRepository.java
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── RefreshToken.java
│   │   │   │   ├── VerificationCode.java
│   │   │   │   ├── ChatSession.java
│   │   │   │   ├── ChatMessage.java
│   │   │   │   ├── StudioEntry.java
│   │   │   │   ├── CommunityPost.java
│   │   │   │   ├── PostLike.java
│   │   │   │   ├── PostBookmark.java
│   │   │   │   ├── PostComment.java
│   │   │   │   ├── EmotionRecord.java
│   │   │   │   ├── PlayspaceItem.java
│   │   │   │   ├── Whiteboard.java
│   │   │   │   ├── MembershipPlan.java
│   │   │   │   └── UserMembership.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── CustomUserDetails.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   └── OAuth2UserService.java
│   │   │   └── exception/
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       ├── BusinessException.java
│   │   │       └── ErrorCode.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
│   │           ├── V1__init_schema.sql
│   │           ├── V2__create_auth_tables.sql
│   │           ├── V3__create_chat_tables.sql
│   │           ├── V4__create_studio_tables.sql
│   │           ├── V5__create_community_tables.sql
│   │           ├── V6__create_emotion_tables.sql
│   │           ├── V7__create_playspace_tables.sql
│   │           ├── V8__create_whiteboard_tables.sql
│   │           └── V9__create_membership_tables.sql
│   └── test/
│       ├── java/com/theranode/api/
│       │   ├── unit/
│       │   │   ├── service/
│       │   │   └── security/
│       │   ├── integration/
│       │   │   └── controller/
│       │   └── blackbox/
│       └── resources/
│           ├── application-test.yml
│           └── db/migration/
│               └── （继承 main 的迁移脚本，Flyway 自动识别）
```

---

## 二、数据模型设计

### 2.1 User（用户）

```
id            UUID / BIGINT  PK
name          VARCHAR(100)
email         VARCHAR(255)   UNIQUE, NULLABLE
phone         VARCHAR(20)    UNIQUE, NULLABLE
password_hash VARCHAR(255)   NULLABLE（Google 登录时为空）
avatar_url    VARCHAR(500)   NULLABLE
provider      ENUM(LOCAL, GOOGLE)
google_id     VARCHAR(255)   UNIQUE, NULLABLE
email_verified BOOLEAN       DEFAULT false
phone_verified BOOLEAN       DEFAULT false
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### 2.2 RefreshToken（刷新令牌）

```
id          BIGINT  PK
token       VARCHAR(500) UNIQUE
user_id     FK -> User
expires_at  TIMESTAMP
revoked     BOOLEAN DEFAULT false
created_at  TIMESTAMP
```

### 2.3 VerificationCode（验证码）

```
id          BIGINT  PK
target      VARCHAR(255)  邮箱或手机号
type        ENUM(EMAIL, PHONE)
purpose     ENUM(REGISTER, RESET_PASSWORD)
code        VARCHAR(10)
expires_at  TIMESTAMP
used        BOOLEAN DEFAULT false
created_at  TIMESTAMP
```

### 2.4 ChatSession（AI 对话会话）

```
id          BIGINT  PK
user_id     FK -> User
title       VARCHAR(200)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### 2.5 ChatMessage（AI 对话消息）

```
id          BIGINT  PK
session_id  FK -> ChatSession
role        ENUM(USER, ASSISTANT)
content     TEXT
created_at  TIMESTAMP
```

### 2.6 StudioEntry（创作作品）

```
id          BIGINT  PK
user_id     FK -> User
type        ENUM(DIARY, POEM)
title       VARCHAR(300)
content     TEXT
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### 2.7 CommunityPost（社区帖子）

```
id             BIGINT  PK
user_id        FK -> User
tag            ENUM(REFLECTION, POEM, GRATITUDE, MILESTONE, QUESTION)
title          VARCHAR(300)
content        TEXT
likes_count    INT DEFAULT 0
comments_count INT DEFAULT 0
created_at     TIMESTAMP
updated_at     TIMESTAMP
```

### 2.8 PostLike / PostBookmark（点赞/收藏）

```
id        BIGINT  PK
post_id   FK -> CommunityPost
user_id   FK -> User
created_at TIMESTAMP
UNIQUE(post_id, user_id)
```

### 2.9 PostComment（评论）

```
id        BIGINT  PK
post_id   FK -> CommunityPost
user_id   FK -> User
content   TEXT
created_at TIMESTAMP
```

### 2.10 EmotionRecord（情绪记录）

```
id          BIGINT  PK
user_id     FK -> User
score       INT (1-10)
emotion_type ENUM(HAPPY, CALM, SAD, ANXIOUS, ANGRY, NEUTRAL)
note        TEXT NULLABLE
recorded_at TIMESTAMP
created_at  TIMESTAMP
```

### 2.11 PlayspaceItem（沙盘元素）

```
id          BIGINT  PK
user_id     FK -> User
canvas_id   VARCHAR(100)  用于区分多个画布
type        ENUM(STONE, EMOTION, ABSTRACT)
x           DOUBLE
y           DOUBLE
color       VARCHAR(20)
label       VARCHAR(100) NULLABLE
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### 2.12 Whiteboard（白板）

```
id          BIGINT  PK
user_id     FK -> User
name        VARCHAR(200)
content     TEXT (JSON, tldraw 格式)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### 2.13 MembershipPlan（会员计划）

```
id          BIGINT  PK
name        VARCHAR(100)
description TEXT
price       DECIMAL(10,2)
currency    VARCHAR(10) DEFAULT 'USD'
period      ENUM(MONTHLY, YEARLY)
features    TEXT (JSON 数组)
is_active   BOOLEAN DEFAULT true
```

### 2.14 UserMembership（用户会员）

```
id          BIGINT  PK
user_id     FK -> User
plan_id     FK -> MembershipPlan
status      ENUM(ACTIVE, EXPIRED, CANCELLED)
start_date  DATE
end_date    DATE
created_at  TIMESTAMP
```

---

## 三、API 接口设计

> 所有接口返回 JSON；Base URL：`/api/v1`  
> 认证接口（Auth）无需 Token；其余接口需在 Header 携带 `Authorization: Bearer <jwt>`

### 3.1 认证模块 `/api/v1/auth`

| 方法 | 路径 | 说明 | 是否需要认证 |
|------|------|------|:---:|
| POST | `/register` | 邮箱/手机注册 | 否 |
| POST | `/login` | 邮箱/手机登录 | 否 |
| POST | `/logout` | 注销（使 RefreshToken 失效）| 是 |
| POST | `/refresh` | 刷新 AccessToken | 否（携带 RefreshToken）|
| POST | `/send-verification-code` | 发送邮箱/手机验证码 | 否 |
| POST | `/verify-code` | 验证验证码 | 否 |
| POST | `/forgot-password` | 忘记密码（发送重置链接/验证码）| 否 |
| POST | `/reset-password` | 重置密码 | 否 |
| GET  | `/oauth2/google` | 跳转 Google OAuth2 授权页 | 否 |
| GET  | `/oauth2/google/callback` | Google OAuth2 回调，返回 JWT | 否 |

**POST /register 请求体：**
```json
{
  "name": "string",
  "email": "string（email 或 phone 二选一）",
  "phone": "string（email 或 phone 二选一）",
  "password": "string",
  "verificationCode": "string"
}
```

**POST /login 请求体：**
```json
{
  "account": "string（邮箱或手机号）",
  "password": "string"
}
```

**统一认证响应体：**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { "id": 1, "name": "string", "email": "string", "avatar": "string" }
}
```

---

### 3.2 用户模块 `/api/v1/users`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/me` | 获取当前用户信息 |
| PUT | `/me` | 更新用户基本信息 |
| PUT | `/me/avatar` | 更新头像（Base64 或文件上传）|
| PUT | `/me/password` | 修改密码 |
| DELETE | `/me` | 注销账户 |

---

### 3.3 仪表盘模块 `/api/v1/dashboard`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取仪表盘汇总数据 |

**GET /dashboard 响应体：**
```json
{
  "emotionScore": 7.5,
  "emotionTrend": [
    { "date": "2026-03-24", "score": 6 },
    ...
  ],
  "recentWorks": [
    { "id": 1, "type": "DIARY", "title": "string", "updatedAt": "..." }
  ],
  "communityActivity": {
    "postsCount": 5,
    "likesReceived": 12
  },
  "membershipStatus": "FREE | ACTIVE"
}
```

---

### 3.4 AI 对话模块 `/api/v1/chat`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/sessions` | 获取会话列表 |
| POST | `/sessions` | 创建新会话 |
| GET | `/sessions/{id}` | 获取会话详情（含消息列表）|
| DELETE | `/sessions/{id}` | 删除会话 |
| POST | `/sessions/{id}/messages` | 发送消息（支持 SSE 流式返回）|
| GET | `/sessions/{id}/messages` | 获取会话消息列表 |

**POST /sessions/{id}/messages 请求体：**
```json
{
  "content": "string"
}
```

**SSE 流式响应**（`Content-Type: text/event-stream`）：
```
data: {"delta": "Hello", "done": false}
data: {"delta": " World", "done": false}
data: {"delta": "", "done": true, "messageId": 123}
```

---

### 3.5 创作模块 `/api/v1/studio`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/entries` | 获取作品列表（支持分页、type 过滤）|
| POST | `/entries` | 创建作品 |
| GET | `/entries/{id}` | 获取作品详情 |
| PUT | `/entries/{id}` | 更新作品 |
| DELETE | `/entries/{id}` | 删除作品 |

**GET /entries 查询参数：** `type=DIARY|POEM`, `page=0`, `size=20`

**POST /entries 请求体：**
```json
{
  "type": "DIARY | POEM",
  "title": "string",
  "content": "string"
}
```

---

### 3.6 社区模块 `/api/v1/community`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/posts` | 获取帖子列表（分页、tag 过滤、排序）|
| POST | `/posts` | 发布帖子 |
| GET | `/posts/{id}` | 获取帖子详情 |
| PUT | `/posts/{id}` | 编辑帖子（仅作者）|
| DELETE | `/posts/{id}` | 删除帖子（仅作者）|
| POST | `/posts/{id}/like` | 点赞 |
| DELETE | `/posts/{id}/like` | 取消点赞 |
| POST | `/posts/{id}/bookmark` | 收藏 |
| DELETE | `/posts/{id}/bookmark` | 取消收藏 |
| GET | `/posts/{id}/comments` | 获取评论列表 |
| POST | `/posts/{id}/comments` | 发表评论 |
| DELETE | `/posts/{id}/comments/{commentId}` | 删除评论（仅作者）|

**GET /posts 查询参数：** `tag=REFLECTION|POEM|GRATITUDE|MILESTONE|QUESTION`, `sort=latest|popular`, `page=0`, `size=20`

---

### 3.7 情绪记录模块 `/api/v1/emotions`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取情绪记录列表（支持日期范围过滤）|
| POST | `/` | 创建情绪记录 |
| GET | `/{id}` | 获取单条记录 |
| PUT | `/{id}` | 更新情绪记录 |
| DELETE | `/{id}` | 删除情绪记录 |

**POST / 请求体：**
```json
{
  "score": 7,
  "emotionType": "CALM",
  "note": "string（可选）",
  "recordedAt": "2026-03-30T10:00:00Z"
}
```

---

### 3.8 沙盘模块 `/api/v1/playspace`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/canvases` | 获取用户所有画布列表 |
| POST | `/canvases` | 创建新画布 |
| GET | `/canvases/{canvasId}/items` | 获取画布内所有元素 |
| POST | `/canvases/{canvasId}/items` | 添加元素 |
| PUT | `/canvases/{canvasId}/items/{itemId}` | 更新元素 |
| DELETE | `/canvases/{canvasId}/items/{itemId}` | 删除元素 |
| PUT | `/canvases/{canvasId}/items/batch` | 批量更新（拖拽后同步）|

---

### 3.9 白板模块 `/api/v1/whiteboards`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取白板列表 |
| POST | `/` | 创建白板 |
| GET | `/{id}` | 获取白板详情（含 tldraw JSON）|
| PUT | `/{id}` | 保存白板内容 |
| DELETE | `/{id}` | 删除白板 |

---

### 3.10 报告模块 `/api/v1/reports`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/emotions` | 情绪趋势报告（按周/月）|
| GET | `/studio` | 创作统计（字数、篇数、频率）|
| GET | `/community` | 社区活动统计 |
| GET | `/summary` | 综合健康报告摘要 |

**GET /emotions 查询参数：** `period=week|month|year`, `startDate`, `endDate`

---

### 3.11 会员模块 `/api/v1/membership`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/plans` | 获取所有会员计划（公开）|
| GET | `/my` | 获取当前用户会员状态 |
| POST | `/subscribe` | 订阅会员计划（模拟支付）|
| DELETE | `/cancel` | 取消会员订阅 |

---

## 四、安全设计

### 4.1 JWT 认证流程

1. 用户登录成功，服务端签发 **AccessToken**（有效期 1 小时）和 **RefreshToken**（有效期 30 天）
2. 客户端每次请求携带 `Authorization: Bearer <AccessToken>`
3. AccessToken 过期后，客户端使用 RefreshToken 请求 `/api/v1/auth/refresh` 换取新 Token
4. RefreshToken 使用后立即**轮换**（旧的作废，签发新的）
5. 登出时，服务端将 RefreshToken 标记为 `revoked`

### 4.2 Google OAuth2 流程

1. 前端跳转 `GET /api/v1/auth/oauth2/google`
2. 后端通过 Spring Security OAuth2 Client 发起 Google 授权
3. Google 回调 `/api/v1/auth/oauth2/google/callback`
4. 后端根据 Google 用户信息查找或创建本地用户
5. 返回 JWT Token（重定向到前端并携带 token 参数，或直接返回 JSON）

### 4.3 白名单（无需认证）

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/send-verification-code`
- `POST /api/v1/auth/verify-code`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/oauth2/**`
- `GET /api/v1/membership/plans`
- `GET /actuator/health`

---

## 五、统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-03-30T10:00:00Z"
}
```

**错误响应：**
```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ],
  "timestamp": "2026-03-30T10:00:00Z"
}
```

**错误码规范：**

| HTTP 状态码 | 业务场景 |
|-------------|---------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 参数校验失败 |
| 401 | 未认证 / Token 无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如邮箱已注册）|
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |

---

## 六、配置文件设计

### application.yml（主配置）

```yaml
spring:
  application:
    name: theranode-api
  profiles:
    active: dev

server:
  port: 8080
  servlet:
    context-path: /

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

### application-dev.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/theranode
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
  jpa:
    hibernate:
      ddl-auto: validate          # 由 Flyway 管理 DDL，JPA 只做验证
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: email,profile
            redirect-uri: "{baseUrl}/api/v1/auth/oauth2/google/callback"
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/auth
            token-uri: https://oauth2.googleapis.com/token
            user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo

theranode:
  jwt:
    secret: ${JWT_SECRET}
    access-token-expiry: 3600      # 1 小时（秒）
    refresh-token-expiry: 2592000  # 30 天（秒）
  gemini:
    api-key: ${GOOGLE_GENERATIVE_AI_API_KEY}
    model: gemini-2.0-flash-lite
    base-url: https://generativelanguage.googleapis.com
  cors:
    allowed-origins:
      - http://localhost:3000
      - https://theranode.com
  verification-code:
    expiry-minutes: 10
    max-attempts: 3
```

### application-test.yml

```yaml
spring:
  datasource:
    # 黑盒测试使用真实 PostgreSQL（由 Testcontainers 自动启动），
    # 集成测试可复用同一容器或指定固定端口
    url: jdbc:tc:postgresql:16:///theranode?TC_REUSABLE=true
    driver-class-name: org.testcontainers.jdbc.ContainerDatabaseDriver
    username: test
    password: test
  flyway:
    enabled: true
    locations: classpath:db/migration
    clean-on-validation-error: true   # 测试环境允许重建
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: test-client-id
            client-secret: test-client-secret

theranode:
  jwt:
    secret: test-secret-key-that-is-at-least-256-bits-long-for-hs256
    access-token-expiry: 3600
    refresh-token-expiry: 2592000
  gemini:
    # 黑盒测试中 Gemini 调用指向 WireMock stub 服务器
    base-url: http://localhost:${wiremock.server.port}
    api-key: test-gemini-key
    model: gemini-2.0-flash-lite

wiremock:
  server:
    port: 0    # 随机端口，由 WireMock 自动分配
```

---

## 七、build.gradle.kts

```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.theranode"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

configurations {
    compileOnly { extendsFrom(annotationProcessor.get()) }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-webflux")  // 用于 SSE 和 WebClient

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    // DB
    runtimeOnly("org.postgresql:postgresql")

    // Flyway
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // MapStruct
    implementation("org.mapstruct:mapstruct:1.6.3")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.6.3")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("io.rest-assured:rest-assured:5.5.0")
    testImplementation("io.rest-assured:spring-mock-mvc:5.5.0")

    // Testcontainers（为集成测试 & 黑盒测试提供真实 PostgreSQL）
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")

    // WireMock（黑盒测试中 stub 外部 HTTP 服务：Gemini、Email、SMS）
    testImplementation("org.wiremock.integrations:wiremock-spring-boot:3.2.0")

    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

---

## 八、测试策略

### 8.1 单元测试（Unit Tests）

**路径：** `src/test/java/com/theranode/api/unit/`

纯 Java 单元测试，不启动 Spring 上下文，使用 **Mockito** mock 依赖：

| 类 | 测试内容 |
|----|---------|
| `JwtTokenProviderTest` | Token 生成、解析、过期验证、签名篡改检测 |
| `AuthServiceTest` | 注册逻辑（邮箱/手机）、登录验证、密码加密、重复账号检测 |
| `ChatServiceTest` | 会话创建、消息管理、会话归属校验 |
| `CommunityServiceTest` | 点赞/取消点赞逻辑、计数幂等更新 |
| `EmotionServiceTest` | 情绪记录 CRUD、分数范围（1-10）校验 |
| `ReportServiceTest` | 情绪趋势聚合计算逻辑 |
| `GeminiServiceTest` | 请求体组装、SSE 流解析逻辑（Mock WebClient）|

### 8.2 集成测试（Component/Integration Tests）

**路径：** `src/test/java/com/theranode/api/integration/`

使用 `@SpringBootTest` + **Testcontainers PostgreSQL** + **Flyway**，覆盖 Controller → Service → Repository 完整链路。外部 HTTP 服务（Gemini）用 `@MockBean` 替换：

| 类 | 测试内容 |
|----|---------|
| `AuthControllerTest` | 注册、登录、Token 刷新、验证码校验完整流程 |
| `ChatControllerTest` | 创建会话、发送消息（`@MockBean GeminiService`）|
| `StudioControllerTest` | 作品 CRUD + 越权访问 403 校验 |
| `CommunityControllerTest` | 帖子发布、点赞、取消点赞、评论 |
| `EmotionControllerTest` | 情绪记录 CRUD + 日期范围查询 |
| `PlayspaceControllerTest` | 画布与元素批量更新 |
| `WhiteboardControllerTest` | 白板保存与加载 |

### 8.3 黑盒测试（Blackbox Tests）

**路径：** `src/test/java/com/theranode/api/blackbox/`

使用 **RestAssured** + **Testcontainers PostgreSQL** + **Flyway** 启动完整应用（`@SpringBootTest(webEnvironment = RANDOM_PORT)`），所有外部 HTTP 依赖均通过 **WireMock** stub 替换，不发起真实网络请求。

#### Stub 对象说明

| 外部服务 | Stub 方式 | 被 stub 的接口 |
|---------|----------|--------------|
| Google Gemini API | WireMock `stubFor` | `POST /v1beta/models/*/streamGenerateContent` |
| Google OAuth2 Token 端点 | WireMock `stubFor` | `POST /token`（Google token URI）|
| Google UserInfo 端点 | WireMock `stubFor` | `GET /oauth2/v3/userinfo` |
| 邮件发送服务（SMTP）| `@MockBean JavaMailSender` | 不发送真实邮件，仅验证调用参数 |
| 短信服务 | `@MockBean SmsService` | 不发送真实短信，验证调用 |

#### WireMock 使用方式

```java
// 测试基类（所有黑盒测试继承）
@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles("test")
@EnableWireMock({
    @ConfigureWireMock(name = "gemini-stub", property = "theranode.gemini.base-url")
})
public abstract class BlackboxTestBase {
    @InjectWireMock("gemini-stub")
    protected WireMockServer geminiWireMock;

    // 公共 stub 方法，子类复用
    protected void stubGeminiStreamResponse(String content) {
        geminiWireMock.stubFor(post(urlPathMatching("/v1beta/models/.*/streamGenerateContent"))
            .willReturn(okTextXml("data: {\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"" + content + "\"}]}}]}\n\n")));
    }
}
```

#### 黑盒测试用例

| 类 | 测试内容 |
|----|---------|
| `AuthFlowBlackboxTest` | 完整注册→验证码→登录→访问受保护接口→Token 刷新→登出流程 |
| `GoogleOAuthBlackboxTest` | Google OAuth2 回调→创建本地用户→返回 JWT 完整流程（stub Google 端点）|
| `ChatFlowBlackboxTest` | 创建会话→发送消息→SSE 流式响应→消息持久化（stub Gemini）|
| `CommunityFlowBlackboxTest` | 发帖→点赞→评论→查询排序完整流程 |
| `SecurityBlackboxTest` | 无 Token 访问 401、Token 过期 401、越权操作 403、CORS 头验证 |

---

## 九、数据库迁移管理（Flyway）

### 9.1 迁移策略

- 所有 DDL 变更通过 Flyway SQL 脚本管理，**禁止使用 JPA `ddl-auto: create/update`**
- 脚本路径：`src/main/resources/db/migration/`
- 命名规范：`V{版本}__{描述}.sql`（双下划线）
- 生产环境启用 `validate-on-migrate: true`，脚本不可回滚（需用新版本修正）
- 测试环境启用 `clean-on-validation-error: true`，每次测试自动重建库结构

### 9.2 迁移脚本列表

| 脚本文件 | 内容 |
|---------|------|
| `V1__init_schema.sql` | 创建 `users` 表（含 provider、google_id 字段）|
| `V2__create_auth_tables.sql` | 创建 `refresh_tokens`、`verification_codes` 表 |
| `V3__create_chat_tables.sql` | 创建 `chat_sessions`、`chat_messages` 表 |
| `V4__create_studio_tables.sql` | 创建 `studio_entries` 表 |
| `V5__create_community_tables.sql` | 创建 `community_posts`、`post_likes`、`post_bookmarks`、`post_comments` 表 |
| `V6__create_emotion_tables.sql` | 创建 `emotion_records` 表 |
| `V7__create_playspace_tables.sql` | 创建 `playspace_items` 表 |
| `V8__create_whiteboard_tables.sql` | 创建 `whiteboards` 表 |
| `V9__create_membership_tables.sql` | 创建 `membership_plans`、`user_memberships` 表，并插入初始计划数据 |

### 9.3 示例脚本（V1）

```sql
-- V1__init_schema.sql
CREATE TABLE users (
    id            BIGSERIAL    PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) UNIQUE,
    phone         VARCHAR(20)  UNIQUE,
    password_hash VARCHAR(255),
    avatar_url    VARCHAR(500),
    provider      VARCHAR(20)  NOT NULL DEFAULT 'LOCAL',
    google_id     VARCHAR(255) UNIQUE,
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_google_id ON users(google_id);
```

---

## 十、AI 对话集成（Gemini）

后端通过 `WebClient` 调用 Google Gemini REST API（非 SDK），实现 SSE 流式转发：

1. 接收前端请求（消息内容）
2. 将历史消息 + 新消息组装成 Gemini API 格式
3. 调用 `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent`
4. 以 SSE (`text/event-stream`) 格式将响应流式转发给前端
5. 流结束后将完整 assistant 消息持久化到数据库

---

## 十一、开发顺序建议

1. **基础框架搭建**：项目初始化、Gradle 配置、目录结构、异常处理、统一响应
2. **数据库层**：编写 Flyway 迁移脚本（V1–V9）、所有 Entity 定义、Repository 接口
3. **安全层**：JWT 工具类、Filter、SecurityConfig、白名单配置
4. **认证模块**：注册（邮箱/手机）、登录、Token 刷新、Google OAuth2
5. **用户模块**：个人信息 CRUD
6. **AI 对话模块**：会话管理 + Gemini SSE 流式代理
7. **创作模块**：Studio 日记/诗歌 CRUD
8. **社区模块**：帖子 + 点赞 + 收藏 + 评论
9. **情绪记录模块**：情绪打卡 CRUD
10. **沙盘/白板模块**：画布元素持久化
11. **报告模块**：数据聚合分析
12. **会员模块**：计划管理、订阅逻辑
13. **仪表盘模块**：聚合各模块数据
14. **测试编写**：单元测试 → 集成测试 → 黑盒测试

---

## 十二、后续前端对接改动（待确认后单独执行）

- 添加登录/注册页面（`/login`, `/register`）
- Middleware 添加认证拦截（未登录跳转 `/login`）
- 所有 MOCK 数据替换为真实 API 调用
- `/api/chat` 路由改为调用 Spring Boot 后端 SSE 接口
- 添加 Google OAuth 登录按钮（重定向到后端 `/api/v1/auth/oauth2/google`）
- 会员页 `/membership` 和报告页 `/reports` 实现对应 UI

---

*此 plan 文档待确认后，将作为 Cursor 生成完整后端项目的依据。*
