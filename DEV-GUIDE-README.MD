# NestJS Development Guide (Modular & Plug-and-Play Architecture)

## Philosophy

Arsitektur ini dirancang dengan prinsip:

* High Cohesion
* Low Coupling
* Domain Oriented
* Plug-and-Play
* SOLID
* Easy Extraction to Microservices
* Easy Package Reusability

Prinsip utama:

> Kode harus berada sedekat mungkin dengan pemiliknya (Owner).

Jangan membuat folder global yang menjadi tempat penampungan segala hal.

---

# Project Structure

```txt
src/
├── main.ts
│
├── app/
│   ├── app.module.ts
│   └── providers/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── sales/
│   └── ...
│
├── libs/
│   ├── db/
│   ├── jwt/
│   ├── redis/
│   ├── mail/
│   ├── storage/
│   ├── queue/
│   └── audit/
│
├── shared/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── exceptions/
│
└── config/
    └── env.ts
```

---

# Dependency Flow

```txt
modules
    ↓
libs
    ↓
shared
```

Rule:

```txt
modules → libs ✅
modules → shared ✅

libs → shared ✅

shared → libs ❌
shared → modules ❌

libs → modules ❌
```

---

# Module Design

Setiap domain harus dapat dipindahkan ke project lain dengan effort minimal.

Contoh:

```txt
modules/
└── auth/
```

Harus dapat dicopy menjadi:

```txt
apps/auth-service/
```

tanpa perubahan besar.

---

# Module Structure

```txt
modules/
└── auth/
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── dto/
    ├── types/
    ├── constants/
    └── auth.module.ts
```

---

# Controllers

Tanggung jawab:

* HTTP Layer
* Request Validation
* Response Mapping

Contoh:

```ts
@Post('login')
login(
  @Body() payload: LoginDTO,
) {
  return this.authService.login(payload);
}
```

Controller tidak boleh:

```ts
❌ Query database

❌ Hash password

❌ Generate JWT

❌ Business logic
```

---

# Services

Tanggung jawab:

* Business Logic
* Transaction Flow
* Domain Validation

Contoh:

```ts
async login(payload: LoginDTO) {
    const user =
        await this.repo.findByEmail(
            payload.email,
        );

    const valid =
        await this.hashService.compare(
            payload.password,
            user.password,
        );

    if (!valid)
        throw new UnauthorizedException();

    return this.jwtService.sign(user);
}
```

---

# Repositories

Tanggung jawab:

* Database Access

Contoh:

```ts
findByEmail(email: string) {
    return this.db.query.users.findFirst(...)
}
```

Repository tidak boleh:

```ts
❌ Authorization

❌ Business Validation

❌ HTTP Exception
```

---

# Libs

Libs adalah Infrastructure Layer.

Setiap library harus self-contained.

---

# Database

```txt
libs/
└── db/
    ├── schema/
    ├── db.config.ts
    ├── db.service.ts
    ├── db.module.ts
    └── index.ts
```

Contoh:

```ts
import { DbService } from '@/libs/db';
```

---

# JWT

JWT memiliki seluruh ownership sendiri.

```txt
libs/
└── jwt/
    ├── decorators/
    │   ├── current-user.decorator.ts
    │   └── public.decorator.ts
    │
    ├── guards/
    │   ├── access-token.guard.ts
    │   └── refresh-token.guard.ts
    │
    ├── strategies/
    │   ├── access-token.strategy.ts
    │   └── refresh-token.strategy.ts
    │
    ├── types/
    │   └── jwt-payload.type.ts
    │
    ├── jwt.config.ts
    ├── jwt.service.ts
    ├── jwt.module.ts
    └── index.ts
```

Rule:

Semua yang berhubungan dengan JWT berada di dalam folder JWT.

---

# Redis

```txt
libs/
└── redis/
    ├── redis.config.ts
    ├── redis.service.ts
    ├── redis.module.ts
    └── index.ts
```

---

# Mail

```txt
libs/
└── mail/
    ├── templates/
    ├── mail.config.ts
    ├── mail.service.ts
    ├── mail.module.ts
    └── index.ts
```

---

# Storage

```txt
libs/
└── storage/
    ├── storage.config.ts
    ├── storage.service.ts
    ├── storage.module.ts
    └── index.ts
```

---

# Queue

```txt
libs/
└── queue/
    ├── decorators/
    ├── processors/
    ├── queue.service.ts
    ├── queue.module.ts
    └── index.ts
```

---

# Audit

```txt
libs/
└── audit/
    ├── decorators/
    ├── interceptors/
    ├── audit.service.ts
    ├── audit.module.ts
    └── index.ts
```

---

# Shared

Shared hanya berisi hal yang benar-benar generic.

---

## Constants

```txt
shared/constants/
```

Contoh:

```ts
export const DEFAULT_PAGE_SIZE = 10;
```

---

## Types

```txt
shared/types/
```

Contoh:

```ts
export interface Pagination {
    page: number;
    limit: number;
}
```

---

## Utils

```txt
shared/utils/
```

Contoh:

```ts
generateSlug()
formatCurrency()
groupBy()
```

Rule:

Utils harus pure function.

---

## Exceptions

```txt
shared/exceptions/
```

Contoh:

```ts
app.exception.ts
domain.exception.ts
```

---

# Config

Hanya untuk environment validation.

```txt
config/
└── env.ts
```

Contoh:

```ts
export const env = z
  .object({
      DATABASE_URL: z.string(),
      JWT_SECRET: z.string(),
      REDIS_URL: z.string(),
  })
  .parse(process.env);
```

Jangan simpan konfigurasi JWT di sini.

Jangan simpan konfigurasi Redis di sini.

Konfigurasi harus berada dekat dengan owner-nya.

---

# Providers

Global bootstrap provider.

```txt
app/
└── providers/
```

Contoh:

```txt
providers/
├── app.provider.ts
└── logger.provider.ts
```

Gunakan seminimal mungkin.

---

# Barrel Export

Setiap package wajib memiliki:

```txt
index.ts
```

Contoh:

```ts
export * from './jwt.module';
export * from './jwt.service';
```

Penggunaan:

```ts
import {
  JwtService,
} from '@/libs/jwt';
```

---

# Dependency Injection Rule

Selalu inject abstraction.

Contoh:

```ts
constructor(
    private readonly jwtService: JwtService,
) {}
```

Hindari:

```ts
new JwtService()
```

---

# Testing Structure

Testing harus berada dekat dengan source.

```txt
auth/
├── services/
│   ├── auth.service.ts
│   └── auth.service.spec.ts
```

---

# Naming Convention

Folder:

```txt
kebab-case
```

Contoh:

```txt
email-verification
reset-password
```

File:

```txt
kebab-case
```

Contoh:

```txt
auth.service.ts
auth.repository.ts
```

Class:

```ts
PascalCase
```

Contoh:

```ts
AuthService
JwtService
```

---

# Ownership Rule

Pertanyaan yang harus selalu diajukan:

> Siapa pemilik kode ini?

Jika jawabannya:

```txt
JWT
```

maka simpan di:

```txt
libs/jwt
```

Jika jawabannya:

```txt
Mail
```

maka simpan di:

```txt
libs/mail
```

Jika jawabannya:

```txt
Auth Domain
```

maka simpan di:

```txt
modules/auth
```

Jika jawabannya:

```txt
Tidak memiliki owner spesifik
```

maka simpan di:

```txt
shared
```

---

# Final Principle

```txt
Business Logic      → modules
Infrastructure      → libs
Generic Utilities   → shared
Environment         → config
Bootstrap           → app
```

Dengan aturan ini, setiap library atau domain dapat dicopy, dipisahkan menjadi package, atau diekstrak menjadi microservice dengan perubahan minimal.
