.PHONY: build clean test

# ソースファイル（src/scripts を含む）
SRC_FILES := $(shell find src -name '*.ts' -not -name '*.test.ts')
TSCONFIG := tsconfig.json

# 出力ファイル
DIST_INDEX := dist/index.js
DIST_SCHEMA := dist/schema.js
SHADOW_CONFIG := shadow.config.json

# ビルドターゲット
build: $(DIST_INDEX) $(SHADOW_CONFIG)

# TypeScriptコンパイル
$(DIST_INDEX): $(SRC_FILES) $(TSCONFIG)
	@echo "Building @example/api-types..."
	@rm -f tsconfig.tsbuildinfo
	@pnpm exec tsc
	@touch $(DIST_INDEX)

# shadow.config.json生成（CLI ツール使用）
$(SHADOW_CONFIG): $(DIST_SCHEMA)
	@echo "Generating shadow.config.json..."
	@pnpm exec generate-shadow-config dist/schema.js -o $(SHADOW_CONFIG)
	@touch $(SHADOW_CONFIG)

test:
	@echo "Running @ainews/api-types tests with coverage..."
	@pnpm test --coverage

clean:
	@echo "Cleaning @ainews/api-types..."
	@rm -rf dist tsconfig.tsbuildinfo
