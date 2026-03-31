# TheraNode API 接口文档

> **Base URL**: `http://localhost:8080/api/v1`  
> **认证方式**: `Authorization: Bearer <accessToken>`（公开接口除外）  
> **内容类型**: `Content-Type: application/json`

---

## 一、统一响应格式

所有接口（含错误）均返回以下 JSON 包装结构：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | HTTP 状态码（200 / 201 / 400 / 401 / 403 / 404 / 409 / 500 等）|
| `message` | string | 描述信息 |
| `data` | any \| null | 业务数据，无数据时省略 |
| `timestamp` | string | ISO-8601 时间戳 |

---

## 二、全局错误响应

### 2.1 参数校验失败 — 400

```json
{
  "code": 400,
  "message": "Validation failed",
  "data": [
    { "field": "email", "message": "must not be blank" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ],
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

### 2.2 业务异常（具体 code 见下表）

```json
{
  "code": 401,
  "message": "Invalid username or password",
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

### 2.3 业务错误码速查表

| HTTP | message | 场景 |
|------|---------|------|
| 400 | `Invalid or expired verification code` | 验证码无效/过期 |
| 400 | `Verification code has expired` | 验证码过期 |
| 400 | `Old password is incorrect` | 修改密码旧密码错误 |
| 400 | `Post not liked` | 取消点赞时未点赞 |
| 400 | `Post not bookmarked` | 取消收藏时未收藏 |
| 400 | `Emotion score must be between 1 and 10` | 情绪分数范围错误 |
| 400 | `Validation failed` | Bean Validation 校验失败 |
| 401 | `Invalid username or password` | 登录失败 |
| 401 | `Invalid or expired refresh token` | RefreshToken 无效/过期 |
| 401 | `Token has been revoked` | Token 已被撤销 |
| 403 | `Account not verified` | 账号未验证 |
| 403 | `Access denied` | 无权限 |
| 404 | `User not found` | 用户不存在 |
| 404 | `Chat session not found` | 会话不存在 |
| 404 | `Studio entry not found` | 作品不存在 |
| 404 | `Community post not found` | 帖子不存在 |
| 404 | `Comment not found` | 评论不存在 |
| 404 | `Emotion record not found` | 情绪记录不存在 |
| 404 | `Playspace item not found` | 沙盘元素不存在 |
| 404 | `Whiteboard not found` | 白板不存在 |
| 404 | `Membership plan not found` | 会员计划不存在 |
| 409 | `Email already registered` | 邮箱已注册 |
| 409 | `Phone number already registered` | 手机号已注册 |
| 409 | `Already liked this post` | 已点赞 |
| 409 | `Already bookmarked this post` | 已收藏 |
| 409 | `User already has an active membership` | 已有有效会员 |
| 500 | `AI service error` | Gemini API 错误 |
| 500 | `Internal server error` | 服务器内部错误 |

### 2.4 分页响应结构

凡返回列表的接口，`data` 字段为：

```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "last": false
}
```

---

## 三、认证模块 `/auth`（无需 Token）

### POST `/auth/register` — 注册

**Request**
```json
{
  "name": "张三",
  "email": "user@example.com",
  "phone": null,
  "password": "password123",
  "verificationCode": "654321"
}
```
> `email` 和 `phone` 二选一，另一个传 `null` 或省略。`verificationCode` 为注册前发送的验证码。

**Response 201**
```json
{
  "code": 201,
  "message": "Created successfully",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "550e8400-e29b-41d4...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "name": "张三",
      "email": "user@example.com",
      "phone": null,
      "avatarUrl": null,
      "provider": "LOCAL",
      "emailVerified": true,
      "phoneVerified": false,
      "createdAt": "2026-03-30T10:00:00Z"
    }
  },
  "timestamp": "2026-03-30T10:00:00Z"
}
```

---

### POST `/auth/login` — 登录

**Request**
```json
{
  "account": "user@example.com",
  "password": "password123"
}
```
> `account` 可填邮箱或手机号。

**Response 200** — 结构同注册响应，`code` 为 `200`，`message` 为 `"success"`。

---

### POST `/auth/logout` — 登出（需 Token）

**Request** — 无 Body

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "timestamp": "2026-03-30T10:00:00Z"
}
```

---

### POST `/auth/refresh` — 刷新 Token

**Request**
```json
{
  "refreshToken": "550e8400-e29b-41d4..."
}
```

**Response 200** — 结构同登录响应，返回新的 `accessToken` + `refreshToken`（旧 RefreshToken 立即失效）。

---

### POST `/auth/send-verification-code` — 发送验证码

**Request**
```json
{
  "target": "user@example.com",
  "type": "EMAIL",
  "purpose": "REGISTER"
}
```
> `type`: `EMAIL` | `PHONE`  
> `purpose`: `REGISTER` | `RESET_PASSWORD`

**Response 200** — 无 `data`。

---

### POST `/auth/verify-code` — 验证验证码

**Request**
```json
{
  "target": "user@example.com",
  "type": "EMAIL",
  "purpose": "REGISTER",
  "code": "654321"
}
```

**Response 200** — 无 `data`。

---

### POST `/auth/forgot-password` — 忘记密码

**Request**
```json
{
  "account": "user@example.com"
}
```

**Response 200** — 无 `data`，服务端已发送重置验证码至邮箱/手机。

---

### POST `/auth/reset-password` — 重置密码

**Request**
```json
{
  "account": "user@example.com",
  "verificationCode": "654321",
  "newPassword": "newpassword123"
}
```

**Response 200** — 无 `data`。

---

### GET `/auth/oauth2/google` — Google OAuth2 登录

重定向到 Google 授权页面，无需 JSON 交互，前端直接跳转：

```
window.location.href = "http://localhost:8080/api/v1/auth/oauth2/google"
```

登录成功后 Google 回调到后端，后端重定向到前端并携带 Token：

```
/oauth2/redirect?accessToken=eyJ...&refreshToken=550e8...
```

---

## 四、用户模块 `/users`（需 Token）

### GET `/users/me` — 获取当前用户信息

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "user@example.com",
    "phone": null,
    "avatarUrl": "https://example.com/avatar.jpg",
    "provider": "LOCAL",
    "emailVerified": true,
    "phoneVerified": false,
    "createdAt": "2026-03-30T10:00:00Z"
  },
  "timestamp": "2026-03-30T10:00:00Z"
}
```

---

### PUT `/users/me` — 更新基本信息

**Request**
```json
{
  "name": "李四",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```
> 字段均可选，只传要更新的字段。

**Response 200** — 返回更新后的 `UserResponse`（结构同上）。

---

### PUT `/users/me/avatar` — 更新头像

**Request** — 直接传 URL 字符串（非 JSON 对象）：
```
Content-Type: text/plain
"https://example.com/avatar.jpg"
```

**Response 200** — 返回更新后的 `UserResponse`。

---

### PUT `/users/me/password` — 修改密码

**Request**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response 200** — 无 `data`。

---

### DELETE `/users/me` — 注销账户

**Response 200** — 无 `data`，账户及所有数据被删除。

---

## 五、仪表盘模块 `/dashboard`（需 Token）

### GET `/dashboard` — 获取仪表盘汇总

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "emotionScore": 7.5,
    "emotionTrend": [
      { "date": "2026-03-24", "score": 6.0 },
      { "date": "2026-03-25", "score": 7.0 },
      { "date": "2026-03-30", "score": 8.0 }
    ],
    "recentWorks": [
      { "id": 1, "type": "DIARY", "title": "今天的日记", "updatedAt": "2026-03-30T10:00:00Z" },
      { "id": 2, "type": "POEM", "title": "春天的诗", "updatedAt": "2026-03-29T10:00:00Z" }
    ],
    "communityActivity": {
      "postsCount": 5,
      "likesReceived": 12
    },
    "membershipStatus": "FREE"
  },
  "timestamp": "2026-03-30T10:00:00Z"
}
```
> `membershipStatus`: `"FREE"` | `"ACTIVE"`

---

## 六、AI 对话模块 `/chat`（需 Token）

### GET `/chat/sessions` — 获取会话列表

**Query Params**: `page=0`, `size=20`

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      { "id": 1, "title": "今天的心情", "createdAt": "2026-03-30T10:00:00Z", "updatedAt": "2026-03-30T11:00:00Z" }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  },
  "timestamp": "2026-03-30T10:00:00Z"
}
```

---

### POST `/chat/sessions` — 创建新会话

**Request**
```json
{
  "title": "我的新会话"
}
```
> `title` 可省略，默认 `"New Conversation"`。

**Response 201**
```json
{
  "code": 201,
  "message": "Created successfully",
  "data": {
    "id": 1,
    "title": "我的新会话",
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:00:00Z"
  },
  "timestamp": "2026-03-30T10:00:00Z"
}
```

---

### GET `/chat/sessions/{id}` — 获取会话详情

**Response 200** — 单个 `ChatSession` 对象，结构同上。

---

### DELETE `/chat/sessions/{id}` — 删除会话

**Response 200** — 无 `data`。

---

### GET `/chat/sessions/{id}/messages` — 获取消息列表

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "role": "USER",      "content": "我最近很焦虑",     "createdAt": "2026-03-30T10:00:00Z" },
    { "id": 2, "role": "ASSISTANT", "content": "我理解你的感受...", "createdAt": "2026-03-30T10:00:01Z" }
  ],
  "timestamp": "2026-03-30T10:00:00Z"
}
```
> `role`: `"USER"` | `"ASSISTANT"`

---

### POST `/chat/sessions/{id}/messages` — 发送消息（SSE 流式）

**Request**
```json
{
  "content": "我最近很焦虑，怎么办？"
}
```

**Response** — `Content-Type: text/event-stream`

逐行推送 JSON 字符串（非标准 `data:` SSE 格式，直接是 JSON 行）：
```
{"delta":"我","done":false}
{"delta":"理解","done":false}
{"delta":"你的","done":false}
{"delta":"感受","done":false}
{"delta":"","done":true}
```
> 前端监听 `done: true` 表示流结束，流结束后 AI 完整回复已持久化到数据库。

**前端示例（EventSource/fetch SSE）**：
```js
const response = await fetch(`/api/v1/chat/sessions/${sessionId}/messages`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: '我最近很焦虑' })
})
const reader = response.body.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const lines = decoder.decode(value).split('\n').filter(Boolean)
  for (const line of lines) {
    const obj = JSON.parse(line)
    if (obj.done) break
    // 追加 obj.delta 到消息气泡
  }
}
```

---

## 七、创作工坊 `/studio`（需 Token）

### GET `/studio/entries` — 获取作品列表

**Query Params**: `type=DIARY|POEM`（可选）, `page=0`, `size=20`

**Response 200** — 分页结构，`content` 为：
```json
[
  {
    "id": 1,
    "type": "DIARY",
    "title": "今天的日记",
    "content": "今天天气很好...",
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:00:00Z"
  }
]
```

---

### POST `/studio/entries` — 创建作品

**Request**
```json
{
  "type": "DIARY",
  "title": "今天的日记",
  "content": "今天天气很好，心情不错。"
}
```
> `type`: `"DIARY"` | `"POEM"`

**Response 201** — 返回创建的作品对象。

---

### GET `/studio/entries/{id}` — 获取作品详情

**Response 200** — 单个作品对象。

---

### PUT `/studio/entries/{id}` — 更新作品

**Request** — 同创建，所有字段必传。

**Response 200** — 返回更新后的作品对象。

---

### DELETE `/studio/entries/{id}` — 删除作品

**Response 200** — 无 `data`。

---

## 八、社区模块 `/community`

### GET `/community/posts` — 获取帖子列表（公开）

**Query Params**:
- `tag=REFLECTION|POEM|GRATITUDE|MILESTONE|QUESTION`（可选）
- `sort=latest|popular`（默认 `latest`）
- `page=0`, `size=20`

**Response 200** — 分页结构，`content` 为：
```json
[
  {
    "id": 1,
    "userId": 1,
    "authorName": "张三",
    "authorAvatar": "https://example.com/avatar.jpg",
    "tag": "REFLECTION",
    "title": "今天的感悟",
    "content": "生活需要感恩...",
    "likesCount": 5,
    "commentsCount": 3,
    "likedByMe": true,
    "bookmarkedByMe": false,
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:00:00Z"
  }
]
```
> `likedByMe` / `bookmarkedByMe` 未登录时为 `false`。

---

### POST `/community/posts` — 发布帖子（需 Token）

**Request**
```json
{
  "tag": "REFLECTION",
  "title": "今天的感悟",
  "content": "生活需要感恩..."
}
```
> `tag`: `"REFLECTION"` | `"POEM"` | `"GRATITUDE"` | `"MILESTONE"` | `"QUESTION"`

**Response 201** — 返回创建的帖子对象。

---

### GET `/community/posts/{id}` — 获取帖子详情（公开）

**Response 200** — 单个帖子对象。

---

### PUT `/community/posts/{id}` — 编辑帖子（需 Token，仅作者）

**Request** — 同创建。

**Response 200** — 返回更新后的帖子对象。

---

### DELETE `/community/posts/{id}` — 删除帖子（需 Token，仅作者）

**Response 200** — 无 `data`。

---

### POST `/community/posts/{id}/like` — 点赞（需 Token）

**Response 200** — 无 `data`。重复点赞返回 409。

---

### DELETE `/community/posts/{id}/like` — 取消点赞（需 Token）

**Response 200** — 无 `data`。

---

### POST `/community/posts/{id}/bookmark` — 收藏（需 Token）

**Response 200** — 无 `data`。重复收藏返回 409。

---

### DELETE `/community/posts/{id}/bookmark` — 取消收藏（需 Token）

**Response 200** — 无 `data`。

---

### GET `/community/posts/{id}/comments` — 获取评论列表（公开）

**Query Params**: `page=0`, `size=20`

**Response 200** — 分页结构，`content` 为：
```json
[
  {
    "id": 1,
    "userId": 2,
    "authorName": "李四",
    "authorAvatar": "https://example.com/avatar2.jpg",
    "content": "说得很好！",
    "createdAt": "2026-03-30T10:00:00Z"
  }
]
```

---

### POST `/community/posts/{id}/comments` — 发表评论（需 Token）

**Request**
```json
{
  "content": "说得很好！"
}
```

**Response 201** — 返回创建的评论对象。

---

### DELETE `/community/posts/{id}/comments/{commentId}` — 删除评论（需 Token，仅作者）

**Response 200** — 无 `data`。

---

## 九、情绪记录 `/emotions`（需 Token）

### GET `/emotions` — 获取情绪记录列表

**Query Params**:
- `from=2026-03-01T00:00:00Z`（可选，ISO-8601）
- `to=2026-03-31T23:59:59Z`（可选）
- `page=0`, `size=20`

**Response 200** — 分页结构，`content` 为：
```json
[
  {
    "id": 1,
    "score": 7,
    "emotionType": "CALM",
    "note": "今天心情不错",
    "recordedAt": "2026-03-30T10:00:00Z",
    "createdAt": "2026-03-30T10:00:00Z"
  }
]
```

---

### POST `/emotions` — 创建情绪记录

**Request**
```json
{
  "score": 7,
  "emotionType": "CALM",
  "note": "今天心情不错",
  "recordedAt": "2026-03-30T10:00:00Z"
}
```
> `score`: 1–10 整数  
> `emotionType`: `"HAPPY"` | `"CALM"` | `"SAD"` | `"ANXIOUS"` | `"ANGRY"` | `"NEUTRAL"`  
> `recordedAt` 可省略，默认为当前时间。

**Response 201** — 返回创建的记录对象。

---

### GET `/emotions/{id}` — 获取单条记录

**Response 200** — 单条记录对象。

---

### PUT `/emotions/{id}` — 更新情绪记录

**Request** — 同创建。

**Response 200** — 返回更新后的记录。

---

### DELETE `/emotions/{id}` — 删除记录

**Response 200** — 无 `data`。

---

## 十、沙盘模块 `/playspace`（需 Token）

### GET `/playspace/canvases` — 获取画布列表

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": ["canvas-uuid-1", "canvas-uuid-2"],
  "timestamp": "..."
}
```

---

### POST `/playspace/canvases` — 创建新画布

**Response 201**
```json
{
  "code": 201,
  "message": "Created successfully",
  "data": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "..."
}
```

---

### GET `/playspace/canvases/{canvasId}/items` — 获取画布内所有元素

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "canvasId": "550e8400-...",
      "type": "STONE",
      "x": 100.5,
      "y": 200.3,
      "color": "#808080",
      "label": "平静",
      "createdAt": "2026-03-30T10:00:00Z",
      "updatedAt": "2026-03-30T10:00:00Z"
    }
  ],
  "timestamp": "..."
}
```
> `type`: `"STONE"` | `"EMOTION"` | `"ABSTRACT"`

---

### POST `/playspace/canvases/{canvasId}/items` — 添加元素

**Request**
```json
{
  "type": "STONE",
  "x": 100.5,
  "y": 200.3,
  "color": "#808080",
  "label": "平静"
}
```

**Response 201** — 返回创建的元素对象。

---

### PUT `/playspace/canvases/{canvasId}/items/{itemId}` — 更新元素

**Request** — 同创建。

**Response 200** — 返回更新后的元素。

---

### DELETE `/playspace/canvases/{canvasId}/items/{itemId}` — 删除元素

**Response 200** — 无 `data`。

---

### PUT `/playspace/canvases/{canvasId}/items/batch` — 批量更新（拖拽同步）

**Request**
```json
{
  "items": [
    { "id": 1, "x": 150.0, "y": 250.0 },
    { "id": 2, "x": 300.0, "y": 100.0 }
  ]
}
```

**Response 200** — 返回更新后的元素数组。

---

## 十一、白板模块 `/whiteboards`（需 Token）

### GET `/whiteboards` — 获取白板列表

**Query Params**: `page=0`, `size=20`

**Response 200** — 分页结构，`content` 为：
```json
[
  {
    "id": 1,
    "name": "我的白板",
    "content": null,
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:00:00Z"
  }
]
```
> 列表接口 `content` 字段为 `null`（节省流量），详情接口才返回完整 tldraw JSON。

---

### POST `/whiteboards` — 创建白板

**Request**
```json
{
  "name": "我的白板",
  "content": null
}
```
> `content` 为 tldraw JSON 字符串，初始可为 `null`。

**Response 201** — 返回创建的白板对象。

---

### GET `/whiteboards/{id}` — 获取白板详情（含 tldraw JSON）

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "我的白板",
    "content": "{\"document\":{...}}",
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:00:00Z"
  },
  "timestamp": "..."
}
```

---

### PUT `/whiteboards/{id}` — 保存白板内容

**Request**
```json
{
  "name": "我的白板（已更新）",
  "content": "{\"document\":{...}}"
}
```
> 字段均可选，只传要更新的字段。

**Response 200** — 返回更新后的白板对象。

---

### DELETE `/whiteboards/{id}` — 删除白板

**Response 200** — 无 `data`。

---

## 十二、报告模块 `/reports`（需 Token）

### GET `/reports/emotions` — 情绪趋势报告

**Query Params**:
- `period=week|month|year`（默认 `month`）
- `startDate=2026-03-01T00:00:00Z`（可选，覆盖 period）
- `endDate=2026-03-31T23:59:59Z`（可选）

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "period": "month",
    "startDate": "2026-03-01T00:00:00Z",
    "endDate": "2026-03-30T10:00:00Z",
    "averageScore": 7.2,
    "totalRecords": 15,
    "trend": [
      { "date": "2026-03-01", "score": 6, "emotionType": "CALM" },
      { "date": "2026-03-02", "score": 8, "emotionType": "HAPPY" }
    ],
    "emotionDistribution": {
      "HAPPY": 5,
      "CALM": 6,
      "SAD": 2,
      "ANXIOUS": 1,
      "NEUTRAL": 1
    }
  },
  "timestamp": "..."
}
```

---

### GET `/reports/studio` — 创作统计

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalEntries": 12
  },
  "timestamp": "..."
}
```

---

### GET `/reports/community` — 社区活动统计

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "postsCount": 8,
    "likesReceived": 25
  },
  "timestamp": "..."
}
```

---

### GET `/reports/summary` — 综合健康报告摘要

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "emotionAverageScore": 7.2,
    "totalStudioEntries": 12,
    "communityPostsCount": 8,
    "communityLikesReceived": 25
  },
  "timestamp": "..."
}
```

---

## 十三、会员模块 `/membership`

### GET `/membership/plans` — 获取所有会员计划（公开）

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Free",
      "description": "Basic access to TheraNode features",
      "price": 0.00,
      "currency": "USD",
      "period": "MONTHLY",
      "features": "[\"AI Chat (10 messages/day)\", \"Studio (5 entries)\", \"Community access\"]",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Premium Monthly",
      "description": "Full access to all TheraNode features",
      "price": 9.99,
      "currency": "USD",
      "period": "MONTHLY",
      "features": "[\"Unlimited AI Chat\", \"Unlimited Studio entries\"]",
      "isActive": true
    }
  ],
  "timestamp": "..."
}
```
> `period`: `"MONTHLY"` | `"YEARLY"`  
> `features` 字段为 JSON 字符串，前端需要 `JSON.parse(features)` 解析。

---

### GET `/membership/my` — 获取当前用户会员状态（需 Token）

**Response 200**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "plan": { ... },
    "status": "ACTIVE",
    "startDate": "2026-03-01",
    "endDate": "2026-04-01",
    "createdAt": "2026-03-01T10:00:00Z"
  },
  "timestamp": "..."
}
```
> 若无有效会员，`data` 为 `null`，`code` 仍为 `200`。  
> `status`: `"ACTIVE"` | `"EXPIRED"` | `"CANCELLED"`

---

### POST `/membership/subscribe` — 订阅会员（需 Token）

**Request**
```json
{
  "planId": 2
}
```

**Response 201** — 返回 `UserMembership` 对象（同 `/my` 的 `data`）。

---

### DELETE `/membership/cancel` — 取消订阅（需 Token）

**Response 200** — 无 `data`。

---

## 十四、附录：枚举值汇总

| 枚举 | 可选值 |
|------|--------|
| `provider` (用户注册方式) | `LOCAL` \| `GOOGLE` |
| `StudioEntry.type` | `DIARY` \| `POEM` |
| `CommunityPost.tag` | `REFLECTION` \| `POEM` \| `GRATITUDE` \| `MILESTONE` \| `QUESTION` |
| `ChatMessage.role` | `USER` \| `ASSISTANT` |
| `EmotionRecord.emotionType` | `HAPPY` \| `CALM` \| `SAD` \| `ANXIOUS` \| `ANGRY` \| `NEUTRAL` |
| `PlayspaceItem.type` | `STONE` \| `EMOTION` \| `ABSTRACT` |
| `MembershipPlan.period` | `MONTHLY` \| `YEARLY` |
| `UserMembership.status` | `ACTIVE` \| `EXPIRED` \| `CANCELLED` |
| `VerificationCode.type` | `EMAIL` \| `PHONE` |
| `VerificationCode.purpose` | `REGISTER` \| `RESET_PASSWORD` |

---

## 十五、认证流程速查

```
1. 发送验证码：POST /auth/send-verification-code
2. 注册：       POST /auth/register  → 获得 accessToken + refreshToken
3. 登录：       POST /auth/login     → 获得 accessToken + refreshToken
4. 请求头：     Authorization: Bearer <accessToken>
5. 刷新：       POST /auth/refresh   → 新 accessToken + 新 refreshToken（旧 refresh 立即失效）
6. 登出：       POST /auth/logout    → 所有 refreshToken 失效
```

**Token 有效期**
- `accessToken`: 3600 秒（1 小时）
- `refreshToken`: 2592000 秒（30 天）
