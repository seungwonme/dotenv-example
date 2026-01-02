# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`dotenv-example`은 `.env` 파일을 읽어 값을 마스킹한 `.env.example` 파일을 생성하는 Node.js CLI 도구입니다.

## Commands

```bash
# 실행 (로컬 개발)
node bin/index.js

# 옵션
node bin/index.js --help          # 도움말
node bin/index.js -f .env.local   # 특정 파일 지정
node bin/index.js -o .env.sample  # 출력 파일명 변경

# npm 배포
npm publish
```

## Architecture

```
bin/index.js    # CLI 진입점 (Commander.js 사용)
```

핵심 로직:
- `findEnvFile()`: `.env -> .env.local -> .env.production` 순서로 파일 탐색
- `maskLine()`: 환경변수 값을 `your_<key>` 형식으로 마스킹
- `generateEnvExample()`: 파일 읽기/쓰기 처리

## Git Convention

Conventional Commits 형식 사용: `type(scope): subject`
- feat, fix, docs, style, refactor, test, chore
