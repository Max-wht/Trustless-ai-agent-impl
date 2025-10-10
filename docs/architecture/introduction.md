# 介绍 / Introduction

本文档概述了 **Trustless SocialFi** 的完整全栈架构，包括后端系统、前端实现、智能合约层及其集成。本文档是 AI 驱动开发的唯一权威信息源，确保整个技术栈的一致性。

_This document outlines the complete fullstack architecture for **Trustless SocialFi**, including backend systems, frontend implementation, smart contract layer, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack._

Trustless SocialFi 是首个基于 ERC-8004 Trustless Agent 标准实现 **AI Agent 去中心化内容治理**的去中心化社交媒体平台。平台使用多 Agent 共识机制（借鉴 Chainlink 预言机验证模式）在发布前审核内容，同时通过专属 AI Agent 为每位用户提供个性化推荐，所有决策过程在链上透明可验证。

_Trustless SocialFi is the first decentralized social media platform implementing **AI Agent-driven decentralized content governance** based on the ERC-8004 Trustless Agent standard. The platform uses a multi-agent consensus mechanism (inspired by Chainlink's oracle verification model) to moderate content before publication._

## 架构核心特性 / Core Architecture Features

本架构专门设计以支持：

- **多 Agent 内容审核 / Multi-Agent Content Moderation**: VRF 随机 Agent 选择、独立审核、加权共识投票
- **动态信誉系统 / Dynamic Reputation System**: Agent 和用户信誉计算，带时间衰减机制
- **Layer 2 部署 / Layer 2 Deployment**: 低 Gas 费用（<$0.10/笔交易）和快速交互（Arbitrum）
- **去中心化存储 / Decentralized Storage**: IPFS 内容存储，双 Pinning（Pinata + Web3.Storage）
- **DAO 治理 / DAO Governance**: 社区控制的内容合规规则，紧急提案快速通道

## 技术栈概览 / Technology Stack Overview

- **智能合约 / Smart Contracts**: Foundry + Solidity 0.8.24 + OpenZeppelin + Arbitrum One
- **后端 / Backend**: TypeScript + Node.js 20 + Fastify + viem + Prisma + PostgreSQL
- **前端 / Frontend**: Next.js 14 + React 18 + TypeScript + viem + wagmi + RainbowKit + shadcn/ui
- **基础设施 / Infrastructure**: Docker + Kubernetes + Turborepo (Monorepo)

## 项目类型 / Starter Template or Existing Project

**状态 / Status:** N/A - 全新项目 / Greenfield project

这是一个从零开始构建的全新项目，使用行业标准工具和框架。虽然不基于特定的启动模板，但架构采用了经过验证的模式。

_This is a greenfield project built from scratch using industry-standard tools and frameworks. The architecture leverages proven patterns without constraints from starter templates._

## 变更日志 / Change Log

| 日期 / Date | 版本 / Version | 描述 / Description                           | 作者 / Author       |
| ----------- | -------------- | -------------------------------------------- | ------------------- |
| 2025-10-10  | 1.0            | 初始架构文档 / Initial architecture document | Winston (Architect) |

---
