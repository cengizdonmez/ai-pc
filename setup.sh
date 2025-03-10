#!/bin/bash

# Temel dizinleri oluştur
mkdir -p public/images/{components,brands} public/locales
mkdir -p src/app/{build,games,compare,saved-builds,api/{components,games,software,recommendations}}
mkdir -p src/components/{ui,layout,builder,game}
mkdir -p src/hooks src/lib src/types src/store src/styles
mkdir -p prisma

# Boş dosyaları oluştur
touch public/favicon.ico
touch public/images/logo.svg

# src/app dosyaları
touch src/app/page.tsx
touch src/app/layout.tsx
touch src/app/build/page.tsx
touch src/app/games/page.tsx
touch src/app/compare/page.tsx
touch src/app/saved-builds/page.tsx

# components dosyaları
touch src/components/ui/{button,card,tabs,input,select,slider,switch,sheet,progress,navigation-menu,badge,toast,toaster,use-toast}.tsx
touch src/components/layout/{header,footer,theme-provider,theme-toggle}.tsx
touch src/components/builder/{component-selector,performance-meter,compatibility-checker,price-calculator,recommendation-card}.tsx
touch src/components/game/{game-card,fps-predictor,requirement-checker}.tsx

# hooks
touch src/hooks/{use-components,use-games,use-compatibility,use-performance}.ts

# lib
touch src/lib/{api,utils,ai,db}.ts

# types
touch src/types/{component,game,build,api}.ts

# store
touch src/store/{build-store,user-store,filter-store}.ts

# styles
touch src/styles/{globals,variables}.css

# Kök dosyalar
touch .env.local package.json tsconfig.json README.md
touch prisma/schema.prisma
