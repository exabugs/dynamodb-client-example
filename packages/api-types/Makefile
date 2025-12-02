.PHONY: build clean test

# ソースファイル（src/scripts を含む）
SRC_FILES := $(shell find src -name '*.ts' -not -name '*.test.ts')
TSCONFIG := tsconfig.json

# 出力ファイル
DIST_INDEX := dist/index.js

# ビルドターゲット
build: $(DIST_INDEX)

# TypeScriptコンパイル
$(DIST_INDEX): $(SRC_FILES) $(TSCONFIG)
	@echo "Building @example/api-types..."
	@rm -f tsconfig.tsbuildinfo
	@pnpm exec tsc
	@touch $(DIST_INDEX)

test:
	@echo "Running @ainews/api-types tests with coverage..."
	@pnpm test --coverage

clean:
	@echo "Cleaning @ainews/api-types..."
	@rm -rf dist tsconfig.tsbuildinfo
