# Portfolio Backend

Express 5 API for the portfolio site. It uses Sequelize migrations, PostgreSQL by default, optional MySQL, JWT authentication, role-based admin access, and local blog-media uploads.

## Requirements

- Node.js 20.9 or newer (`.nvmrc` selects 20.18.0 when using nvm)
- PostgreSQL 14+ or MySQL 8+
- A database created by you before running migrations

## Configure and run

1. Create a database named `portfolio`, or choose another name for `DB_NAME`.
2. Copy `.env.example` to `.env` and set the database credentials and a random `JWT_SECRET` with at least 32 characters.
3. Set `ADMIN_EMAIL`, `ADMIN_NAME`, and a unique `ADMIN_PASSWORD` of at least 12 characters in `.env`.
4. Install dependencies and create the schema and admin account:

   ```sh
   nvm use
   npm install
   npm run db:migrate
   npm run admin:create
   npm run dev
   ```

The API listens on `http://localhost:4000` by default. Set `CORS_ORIGIN` to the frontend origin. PostgreSQL is the default; for MySQL set `DB_DIALECT=mysql` and `DB_PORT=3306`. To use managed TLS, set `DB_SSL=true`.

Migrations create `users`, `roles`, `user_roles`, `blog_posts`, and `projects`. The first migration inserts `admin` and `editor` roles. There is no automatic schema synchronization or public user registration.

## API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API and database health |
| `POST` | `/api/auth/login` | Public, rate-limited | Exchange email and password for a JWT |
| `GET` | `/api/auth/me` | Bearer token | Read the authenticated user and roles |
| `GET` | `/api/blog?page=1&limit=10` | Public | List published posts |
| `GET` | `/api/blog/:slug` | Public | Read one published post |
| `GET` | `/api/projects` | Public | List published projects in featured/display order |
| `GET` | `/api/projects/:slug` | Public | Read one published project |
| `POST` | `/api/chat` | Public, rate-limited | Answer a portfolio question from published projects and articles |
| `GET` | `/api/admin/blog` | Admin JWT | List drafts and published posts |
| `POST` | `/api/admin/blog` | Admin JWT | Create a post and optionally upload media |
| `PATCH` | `/api/admin/blog/:id` | Admin JWT | Update a post or its media |
| `DELETE` | `/api/admin/blog/:id` | Admin JWT | Delete a post and its uploaded media |
| `GET` | `/api/admin/projects` | Admin JWT | List all projects, including drafts |
| `POST` | `/api/admin/projects` | Admin JWT | Create a project and optionally upload its cover image |
| `PATCH` | `/api/admin/projects/:id` | Admin JWT | Update project details, publishing, and image |
| `DELETE` | `/api/admin/projects/:id` | Admin JWT | Delete a project and its uploaded image |

Login JSON:

```json
{
  "email": "admin@example.com",
  "password": "the-password-from-your-local-env"
}
```

Use the returned token on protected requests as `Authorization: Bearer <token>`.

Create/update blog posts as `multipart/form-data`. Text fields are `title`, `slug` (optional; generated from the title), `excerpt`, `content`, and `status` (`draft` or `published`). File fields are `coverImage`, `video`, `videoPoster`, and `captions` (WebVTT). Supported file types are JPG, PNG, WebP, MP4, WebM, and VTT; each file is limited by `MAX_UPLOAD_MB` (100 MB by default). The API returns media URLs under `/uploads/blog/` for the frontend to render with an HTML video player and captions.

For `PATCH`, set `removeCoverImage`, `removeVideo`, `removeVideoPoster`, or `removeCaptions` to `true` to remove existing media. Publishing sets `publishedAt`; changing the post back to a draft clears it. Public endpoints never return drafts.

Project create/update fields are `title`, `slug` (optional; generated from the title), `role`, `summary`, `description`, `techStack` (comma-separated values), `liveUrl`, `sourceUrl`, `featured`, `sortOrder`, and `status`. Send an optional cover image in the `image` file field. `PATCH` accepts `removeImage=true`. Only published projects appear on the public portfolio; featured projects sort first, followed by display order.

The chat endpoint accepts `POST /api/chat` with JSON `{ "message": "What technologies were used on the payments project?" }`. It returns a concise reply, links, and suggested follow-ups from published database content only. It does not send visitor questions to an external AI provider. Requests are limited to 30 per IP per 15 minutes.

## Environment variables

See `.env.example` for database settings, CORS origin, JWT lifetime, login rate limits, upload size, and the one-time admin bootstrap values. Keep `.env` private; it is ignored by git. Change the bootstrap password after setup and remove it from the local environment when it is no longer needed.