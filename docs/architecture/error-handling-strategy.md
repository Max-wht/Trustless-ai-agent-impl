# 错误处理策略 / Error Handling Strategy

## 错误响应格式 / Error Response Format

```json
{
  "error": {
    "code": "CONTENT_TOO_LONG",
    "message": "Post content exceeds maximum length",
    "details": {
      "maxLength": 5000,
      "actualLength": 5234
    },
    "timestamp": "2024-10-10T12:34:56Z",
    "requestId": "req_abc123"
  }
}
```

## 前端错误处理 / Frontend Error Handling

- **ErrorBoundary**: 捕获 React 错误，上报到 Sentry / Catch React errors, report to Sentry
- **API 错误 / API Errors**: 将错误码映射为用户友好消息 / Map error codes to user-friendly messages
- **Toast 通知 / Toast Notifications**: 使用 `sonner` 库显示错误/成功 / Show errors/success with `sonner` library

## 后端错误处理 / Backend Error Handling

- **自定义错误类 / Custom Error Classes**: `ValidationError`, `AuthenticationError`, `NotFoundError`
- **全局错误处理器 / Global Error Handler**: 标准化响应、日志记录、Sentry 集成
- **重试逻辑 / Retry Logic**: IPFS/OpenAI 调用的指数退避
- **熔断器 / Circuit Breaker**: 防止级联故障（OpenAI 服务宕机时）

## 智能合约错误 / Smart Contract Errors

```solidity
// 自定义错误 (gas高效) / Custom errors (gas-efficient)
error InsufficientStake(uint256 required, uint256 provided);
error AgentNotActive(address agent);

// 使用 / Usage
if (amount < MIN_STAKE) {
    revert InsufficientStake(MIN_STAKE, amount);
}
```

---
