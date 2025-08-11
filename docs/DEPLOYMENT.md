# Deployment Guide

## Production Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   REDIS_URL="your-production-redis-url"
   ```

2. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Static Hosting**
   - Upload `dist/` folder to your hosting provider
   - Configure environment variables for production API URLs

### Docker Deployment

1. **Create Docker Compose**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - DATABASE_URL=postgresql://user:pass@db:5432/rental
       depends_on:
         - db
         - redis
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
     
     db:
       image: postgres:15
       environment:
         POSTGRES_DB: rental
         POSTGRES_USER: user
         POSTGRES_PASSWORD: pass
       volumes:
         - postgres_data:/var/lib/postgresql/data
     
     redis:
       image: redis:7-alpine
   
   volumes:
     postgres_data:
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@localhost:5432/rental_management"
JWT_SECRET="your-super-secret-jwt-key-here"
REDIS_URL="redis://localhost:6379"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
FRONTEND_URL="https://your-frontend-domain.com"
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS for your specific domains
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: All inputs are validated using Zod schemas
5. **JWT Security**: Use strong JWT secrets and appropriate expiration times
6. **Database Security**: Use connection pooling and prepared statements
7. **Environment Variables**: Never commit sensitive data to version control

## Monitoring

1. **Health Checks**: Use `/health` endpoint for monitoring
2. **Logging**: Implement structured logging for production
3. **Error Tracking**: Use services like Sentry for error monitoring
4. **Performance**: Monitor API response times and database queries

## Backup Strategy

1. **Database Backups**: Regular PostgreSQL backups
2. **File Storage**: Backup uploaded files and images
3. **Configuration**: Backup environment configurations
4. **Disaster Recovery**: Document recovery procedures