### 项目名称
一个基于 Axios 的增强型 HTTP 网络请求库，支持请求防重、重试、请求缓存、并行和串行请求等功能。

---

### 📖 简介

本库是对 Axios 的深度封装，旨在为前端开发者提供更强大且灵活的 HTTP 请求管理功能，解决常见的请求防重、自动重试、缓存控制等问题。同时支持 **并行请求** 和 **串行请求** 管理，简化复杂的请求逻辑。

通过本库，开发者可以轻松配置请求防重策略、防止重复请求带来的性能浪费，并利用指数退避策略实现智能重试机制，提升请求的健壮性。

---

### 🔥 主要特点

- **请求防重（Debounce Requestor）**：通过请求体内容生成唯一 hash 标识，在设定的时间窗口内自动避免重复请求，确保 API 调用的高效性。
  
- **智能重试机制（Retry Requestor）**：支持指数退避的重试机制，根据配置自动处理失败请求，避免因网络抖动或临时性错误导致的请求失败。

- **串行/并行请求管理**：提供并行和串行请求的支持，允许开发者灵活组织多个 API 调用，使得复杂的请求场景更容易实现。

- **缓存管理（Store Requestor）**：内置缓存机制，能够自动存储和读取请求响应，减少不必要的网络请求和数据传输。

- **与 Axios 完美兼容**：基于 Axios 进行封装，保留其强大的配置能力，开发者无需学习新的 API，即可使用已有的 Axios 经验。

- **防抖 & 请求取消**：内置请求取消机制，允许你随时取消未完成的请求，特别适用于搜索和输入联想等场景。

---

### 🚀 安装与使用

#### 安装

```bash
npm install your-library-name
```

#### 快速开始

```ts
import { requestor } from 'your-library-name';

// 发起带有防重和重试机制的 GET 请求
requestor.get('http://example.com/api', {
    DebounceRequestor: { use: true, wait: 5000 },  // 防止5秒内的重复请求
    RetryRequestor: { use: true, maxTry: 3, waitTime: 1000 }  // 重试3次，1秒指数退避
}).then(response => {
    console.log(response.data);
});
```

#### 串行请求

```ts
requestor.createSerialRequestor([
    { url: 'http://example.com/api/1', options: { /* ... */ }},
    { url: 'http://example.com/api/2', options: { /* ... */ }}
]).then(results => {
    console.log(results);
});
```

#### 并行请求

```ts
requestor.createParallelRequestor([
    { url: 'http://example.com/api/1', options: { /* ... */ }},
    { url: 'http://example.com/api/2', options: { /* ... */ }}
]).then(results => {
    console.log(results);
});
```

---

### ⚙️ 配置说明

- **DebounceRequestor**：避免重复请求。
  ```ts
  DebounceRequestor: { use: true, wait: 5000 }  // 在5秒内防止相同请求
  ```

- **RetryRequestor**：自动重试机制。
  ```ts
  RetryRequestor: { use: true, maxTry: 3, waitTime: 1000 }  // 最大重试次数3次，初始重试间隔1秒
  ```

---

### 📈 性能与优化

1. **防止重复请求**：在高并发或快速连续触发请求的场景下，自动阻止相同请求的重复提交，减轻服务器负担。
2. **指数退避的重试策略**：智能化处理失败请求，避免简单重试带来的资源浪费。
3. **缓存优化**：可选的请求缓存功能，避免重复拉取相同的数据，有效节省网络资源。

---

### 🛠 技术栈

- **Axios**：底层基于 Axios 封装，保留了其优秀的 API 接口和灵活性。
- **CryptoJS**：用于对请求体生成唯一 hash，确保请求防重的唯一性。
- **TypeScript**：提供类型安全的接口定义，减少开发中的错误并提高可维护性。

---

### 🎯 适用场景

- **表单提交防重**：确保用户快速点击按钮不会发送多次相同的请求。
- **自动重试**：处理网络不稳定的场景，通过智能重试机制，避免临时错误造成用户体验不佳。
- **批量请求**：适用于批量 API 调用的场景，提供并行和串行的处理方式，灵活控制请求流。

---

### 📚 示例

提供多个详细的使用示例，帮助你快速上手该库的强大功能。你可以查看 [文档](https://github.com/your-repo-url) 了解更多细节。

---

### 🤝 贡献指南

欢迎贡献代码和提出问题！你可以通过以下方式参与项目：
- 提交 Pull Requests 来修复问题或增加新功能。
- 提交 Issues 来反馈问题或提出建议。

---

### 📝 许可证

该项目使用 MIT 许可证，详情请查看 [LICENSE](https://github.com/your-repo-url/LICENSE)。

---

### 结语

通过这个库，你可以简化 HTTP 请求的复杂处理逻辑，提升代码的可维护性，并提供更稳定的网络请求体验。如果你正在寻找一个增强型的 Axios 库，它会是一个不错的选择。
