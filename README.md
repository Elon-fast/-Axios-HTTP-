### 项目名称
一个基于 Axios 的增强型 HTTP 网络请求库，支持请求防重、重试、请求缓存、并行和串行请求等功能。

---

### 📖 简介
本网络库是一个基于 Axios 的增强型 HTTP 网络请求库，使用TS语言进行编写，在结构设计方面将整个网络库分为了三层并且采用依赖倒置(DIP)设计原则使核心业务逻辑与 Axios 实现解耦，确保能够轻松替换或扩展底层的 HTTP 请求机制，而无需修改高层逻辑，同时便于底层实现的更改。在功能方面支持请求串行，并行。同时将请求防重，重试，缓存嵌入请求中，使得开发者只需修改配置即可轻松实现请求的防重，重试等功能，简化复杂的请求逻辑。
通过本库，开发者不仅可以通过更改配置轻松实现复杂请求，更可以通过作者细腻的源码注释学习到Axios的基本使用方法，例如拦截器，请求取消等。还可以借鉴作者的网络库设计模式，运用到自己的项目中。

---

### 🔥 主要特点

- **依赖倒置原则（DIP）**：本库遵循依赖倒置原则，核心业务逻辑与 Axios 实现解耦，确保能够轻松替换或扩展底层的 HTTP 请求机制，而无需修改高层逻辑。

- **TypeScript 规范编码**：该库完全使用 TypeScript 编写，通过强类型检查提高代码的可维护性。使用TypeScript 的类型系统实现层与层之间的解耦。

- **请求防重（Debounce Requestor）**：通过请求体内容生成唯一 hash 标识，在设定的时间窗口内自动避免重复请求，确保 API 调用的高效性。
  
- **智能重试机制（Retry Requestor）**：支持指数退避的重试机制，根据配置自动处理失败请求，避免因网络抖动或临时性错误导致的请求失败。

- **串行/并行请求管理**：提供并行和串行请求的支持，允许开发者灵活组织多个 API 调用，使得复杂的请求场景更容易实现。

- **组件化编程**：遵循ESM标准的组件化编程，相比于面向对象编程更加的灵活可扩展。

- **与 Axios 完美兼容**：基于 Axios 进行封装，保留其强大的配置能力，开发者无需学习新的 API，即可使用已有的 Axios 经验。

- **防抖 & 请求取消**：内置请求取消机制，允许你随时取消未完成的请求，特别适用于搜索和输入联想等场景。

---

### 🚀 安装与使用

#### 安装
##### 步骤：

1. **确保已安装 Node.js**：
   确保在本地已经安装了 [Node.js](https://nodejs.org/)。安装 Node.js 后，NPM（Node Package Manager）会自动安装。

2. **打开终端/命令行工具**：
   进入项目的根目录（即 `package.json` 文件所在的目录）。

3. **运行以下命令来安装依赖包**：
   如果项目使用的是 NPM：
   ```bash
   npm install
   ```

   如果项目使用的是 Yarn：
   ```bash
   yarn install
   ```

### 补充信息：

- 请自行使用nodejs进行服务器的基本配置以确保请求可以顺利的被接收
- 下面是一个基本的nodejs服务器示例：<br><br>
  <img width="299" alt="image" src="https://github.com/user-attachments/assets/00fd66c1-6370-43f2-a335-760b499faca3">

#### 快速上手

整个库结构分为三层，从下到上分别为**request-imp-axios.ts**，**request-core.ts**，**request-bus.ts**
<br>
<br>
<img width="170" alt="image" src="https://github.com/user-attachments/assets/fc9730db-ed21-4657-9698-fe7ce524d324">
<br>
<br>
其中：
  
 - 在request-core中提供一些接口方法表明需要实现的方法(但是并没有具体实现)
 - 我们在request-imp-axios中将request-core中提供一些接口方法进行实现，并且在request-bus中注入即可实现依赖倒置


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

在request-bus.ts中提供了多个详细的使用示例，帮助你快速上手该库的基本功能。你可以查看 [文档]([[https://github.com/your-repo-url](https://github.com/Elon-fast/-Axios-HTTP-/blob/main/request-bus.ts)]) 了解更多细节。

---

### 🤝 贡献指南

欢迎贡献代码和提出问题！你可以通过以下方式参与项目：
- 提交 Pull Requests 来修复问题或增加新功能。
- 提交 Issues 来反馈问题或提出建议。

---

### 📝 许可证

该项目使用 MIT 许可证，详情请查看 [LICENSE](https://github.com/your-repo-url/LICENSE)。

---

