import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { createServer as createViteServer } from 'vite';

declare module 'express-session' {
  interface SessionData {
    username?: string;
    loginTime?: string;
    profileVisits?: number;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    secret: 'mini-shop-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: true, 
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Helper to get theme from cookie
  const getTheme = (req: express.Request) => {
    return req.cookies.theme === 'dark' ? 'dark' : 'light';
  };

  // 1. Trang chủ /
  app.get('/', (req, res) => {
    const theme = getTheme(req);
    const username = req.session.username;
    
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#1a1a1a';

    let content = `
      <div style="background-color: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 2rem; font-family: sans-serif;">
        <h1>Mini Profile App</h1>
        ${username ? `<p>Xin chào, <strong>${username}</strong></p>` : '<p>Bạn chưa đăng nhập</p>'}
        
        <div style="margin-top: 2rem;">
          <h3>Chọn Theme:</h3>
          <a href="/set-theme/light" style="padding: 0.5rem 1rem; background: #eee; color: #000; text-decoration: none; border-radius: 4px; margin-right: 10px;">Light</a>
          <a href="/set-theme/dark" style="padding: 0.5rem 1rem; background: #333; color: #fff; text-decoration: none; border-radius: 4px;">Dark</a>
        </div>

        <div style="margin-top: 2rem;">
          ${username 
            ? '<a href="/profile" style="color: blue;">Vào trang cá nhân</a> | <a href="/logout" style="color: red;">Đăng xuất</a>' 
            : '<a href="/login" style="color: blue;">Đăng nhập ngay</a>'}
        </div>
      </div>
    `;
    res.send(content);
  });

  // 2. Chức năng chọn theme /set-theme/:theme
  app.get('/set-theme/:theme', (req, res) => {
    const theme = req.params.theme;
    if (theme === 'light' || theme === 'dark') {
      res.cookie('theme', theme, { 
        maxAge: 10 * 60 * 1000, 
        httpOnly: false, // Allow client-side access if needed
        path: '/',
        sameSite: 'none',
        secure: true
      }); // 10 minutes
    }
    res.redirect('/');
  });

  // 3. Chức năng đăng nhập /login
  app.get('/login', (req, res) => {
    const theme = getTheme(req);
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#1a1a1a';

    res.send(`
      <div style="background-color: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 2rem; font-family: sans-serif;">
        <h1>Đăng nhập</h1>
        <form action="/login" method="POST">
          <label>Username: </label>
          <input type="text" name="username" required style="padding: 5px; margin-bottom: 10px;">
          <br>
          <button type="submit" style="padding: 5px 15px; cursor: pointer;">Submit</button>
        </form>
        <p><a href="/" style="color: inherit;">Quay lại trang chủ</a></p>
      </div>
    `);
  });

  app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
      req.session.username = username;
      req.session.loginTime = new Date().toLocaleString();
      req.session.profileVisits = 0;
      res.redirect('/profile');
    } else {
      res.redirect('/login');
    }
  });

  // 4. Trang cá nhân /profile
  app.get('/profile', (req, res) => {
    if (!req.session.username) {
      return res.redirect('/login');
    }

    // Increment visit counter
    req.session.profileVisits = (req.session.profileVisits || 0) + 1;

    const theme = getTheme(req);
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#1a1a1a';

    res.send(`
      <div style="background-color: ${bgColor}; color: ${textColor}; min-height: 100vh; padding: 2rem; font-family: sans-serif;">
        <h1>Trang cá nhân</h1>
        <p><strong>Username:</strong> ${req.session.username}</p>
        <p><strong>Thời điểm đăng nhập:</strong> ${req.session.loginTime}</p>
        <p><strong>Số lần đã truy cập trang này:</strong> ${req.session.profileVisits}</p>
        
        <div style="margin-top: 2rem;">
          <a href="/" style="color: blue;">Quay lại trang chủ</a> | 
          <a href="/logout" style="color: red;">Đăng xuất</a>
        </div>
      </div>
    `);
  });

  // 5. Chức năng đăng xuất /logout
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login');
    });
  });

  // Vite middleware for development (if needed, but we are doing SSR here)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Note: This app uses Express/TypeScript as FastAPI is not supported in this environment.');
  });
}

startServer();
