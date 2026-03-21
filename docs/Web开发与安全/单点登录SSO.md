---
title: 单点登录SSO
description: 单点登录（Single Sign-On，简称SSO）是一种身份认证机制，允许用户使用一组凭证（如用户名和密码）登录一次，就能访问多个相互信任的应用程序、系统或网站，而无需每次都重复登录。
sidebar_position: 8
tags: [Web]
date: 2025-12-24
---

# 单点登录SSO
## 概念
单点登录（Single Sign-On，SSO）是一种身份验证机制，允许用户使用一组凭据访问多个应用程序。用户只要登录一次，就可以访问所有相关信任应用的资源。企业里面用的会比较多，有很多内网平台，但是只要在一个系统登录就可以。是比较流行的企业业务整合的解决方案之一。

## 架构概述
SSO系统通常包含三个主要组件：
- **SSO服务器**：中央认证服务，负责用户身份认证
- **客户端应用**：需要用户登录的各个应用
- **用户浏览器**：用户交互界面

## 为什么需要单点登录
web系统早已从久远的单系统发展成为如今由多系统组成的应用群，面对如此众多的系统，用户一个一个登录、然后一个一个注销的行为不现实。

web系统由单系统发展成多系统组成的应用群，复杂性应该由系统内部承担，而不是用户。无论web系统内部多么复杂，对用户而言，都是一个统一的整体，也就是说，用户访问web系统的整个应用群与访问单个系统一样，登录/注销只要一次就够了。

## 单点登录概述
### 单系统登录流程
1. 用户进入系统
2. 未登录
3. 跳转登录界面
4. 用户名和密码发送
5. 服务器端验证后，设置一个cookie发送到浏览器，设置一个session存放在服务器
6. 用户再次请求（带上cookie）
7. 服务器验证cookie和session匹配后，就可以进行业务了。

### 多系统登录
如果一个大公司有很多系统，`a.seafile.com`，`b.seafile.com`，`c.seafile.com`。这些系统都需要登录，如果用户在不同系统间登录需要多次输入密码，用户体验很不好。所以使用SSO（single sign on）单点登录实现。

### 相同域名，不同子域名下的单点登录
在浏览器端，根据同源策略，不同子域名的cookie不能共享。所以设置SSO的域名为根域名。SSO登录验证后，子域名可以访问根域名的cookie，即可完成校验。在服务器端，可以设置多个子域名session共享（Spring-session）

### 不同域名下的单点登录
**CAS流程**：用户登录子系统时未登录，跳转到 SSO 登录界面，成功登录后，SSO 生成一个 ST （service ticket ）。用户登录不同的域名时，都会跳转到 SSO，然后 SSO 带着 ST 返回到不同的子域名，子域名中发出请求验证 ST 的正确性（防止篡改请求）。验证通过后即可完成不同的业务。

## 原理
### 登录
SSO需要一个独立的认证中心，只有认证中心能接受用户的用户名密码等安全信息，其他系统不提供登录入口，只接受认证中心的间接授权。

间接授权通过令牌实现，SSO认证中心验证用户的用户名密码没问题，创建授权令牌，在接下来的跳转过程中，授权令牌作为参数发送给各个子系统，子系统拿到令牌，即得到了授权，可以借此创建局部会话，局部会话登录方式与单系统的登录方式相同。
![SSO1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/web/SSO1.png)

用户登录成功之后，会与SSO认证中心及访问的子系统建立会话，用户与SSO认证中心建立的会话称为全局会话，用户与各个子系统建立的会话称为局部会话，局部会话建立之后，用户访问子系统受保护资源将不再通过SSO认证中心，全局会话与局部会话有如下约束关系
1. 局部会话存在，全局会话一定存在
2. 全局会话存在，局部会话不一定存在
3. 全局会话销毁，局部会话必须销毁

### 注销
在一个子系统中注销，所有子系统的会话都将被销毁。
![SSO2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/web/SSO2.png)
sso认证中心一直监听全局会话的状态，一旦全局会话销毁，监听器将通知所有注册系统执行注销操作。

## 完整流程
### 用户访问应用
- 前端应用检查本地存储中是否有有效的认证信息
- 如果没有，重定向到SSO登录页面

### SSO登录
- 用户在SSO服务器上输入凭据
- SSO服务器验证凭据并创建会话
- 根据SSO实现方式，生成Cookie或Token

### 重定向会应用
- 对于Cookie-based SSO：重定向回应用，带上会话Cookie
- 对于Token-based SSO：重定向回应用，带上token参数
- 对于OAuth流程：先获取授权码，然后用授权码换取访问令牌

### 应用验证认证
- 验证Cookie或Token的有效性
- 获取用户信息
- 建立应用内的用户会话

### 会话维护
- 定期检查SSO会话状态
- 自动刷新即将过期的Token
- 处理会话过期的情况

### 单点登录
- 用户点击登出按钮
- 应用清除本地认证信息
- 重定向到SSO登出端点，清除SSO会话
- SSO服务器通知所有应用登出（可选）

## 前端实现
无论采用哪种方式，前端实现都需要处理：
- 认证状态检查
- 登录流程
- 会话维护
- 令牌刷新
- 安全防护
- 单点登出

### 基于Cookie的SSO
依赖共享域的Cookie，简单但有跨域限制。
#### 登录流程
```js
// 前端应用入口组件
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        isAuthenticated: false,
        user: null,
        isLoading: true
        };
    }

    componentDidMount() {
        // 检查用户是否已登录
        this.checkLoginStatus();
    }

    checkLoginStatus = async () => {
        try {
        // 调用本地验证接口，检查是否有有效的会话
        const response = await fetch('https://app1.example.com/api/auth/status', {
            credentials: 'include' // 重要：包含跨域cookies
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.isAuthenticated) {
            this.setState({ 
                isAuthenticated: true, 
                user: data.user,
                isLoading: false 
            });
            return;
            }
        }
        
        // 如果未登录，重定向到SSO登录页
        this.redirectToSSOLogin();
        } catch (error) {
        console.error('验证登录状态失败:', error);
        this.setState({ isLoading: false });
        }
    };

    redirectToSSOLogin = () => {
        // 当前应用URL，用于登录后重定向回来
        const currentUrl = encodeURIComponent(window.location.href);
        
        // 重定向到SSO登录页面
        window.location.href = `https://sso.example.com/login?redirect=${currentUrl}`;
    };

    render() {
        const { isAuthenticated, user, isLoading } = this.state;

        if (isLoading) {
        return <div>加载中...</div>;
        }

        if (!isAuthenticated) {
        return <div>正在重定向到登录页面...</div>;
        }

        return (
        <div>
            <header>
            <p>欢迎, {user.name}</p>
            <button onClick={this.handleLogout}>退出登录</button>
            </header>
            <main>{/* 应用内容 */}</main>
        </div>
        );
    }

    handleLogout = async () => {
        try {
        await fetch('https://sso.example.com/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        // 登出后重定向到登录页
        window.location.href = 'https://sso.example.com/login';
        } catch (error) {
        console.error('登出失败:', error);
        }
    };
}
```

#### SSO登录页面实现
```js
// SSO服务器上的登录页面组件
class SSOLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        username: '',
        password: '',
        error: null,
        isLoading: false
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: true, error: null });

        try {
        const { username, password } = this.state;
        
        // 发送登录请求到SSO服务器
        const response = await fetch('https://sso.example.com/api/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '登录失败');
        }

        // 登录成功，获取重定向URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || 'https://app1.example.com';
        
        // 重定向回原应用
        window.location.href = redirectUrl;
        } catch (error) {
        this.setState({ 
            error: error.message, 
            isLoading: false 
        });
        }
    };

    render() {
        const { username, password, error, isLoading } = this.state;

        return (
        <div className="login-container">
            <h2>统一登录平台</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                required
                />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
            </button>
            </form>
        </div>
        );
    }
}
```

### 基于Token的SSO
使用JWT等令牌，更灵活，适合分布式系统。
#### 前端应用入口
```js
// 使用JWT实现的SSO前端应用
class TokenBasedApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        isAuthenticated: false,
        user: null,
        isLoading: true
        };
    }

    componentDidMount() {
        // 检查URL中是否有token参数（从SSO服务器重定向回来）
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
        // 保存token到localStorage
        localStorage.setItem('auth_token', token);
        
        // 清除URL中的token参数
        window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // 验证token
        this.validateToken();
    }

    validateToken = async () => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
        this.setState({ isLoading: false });
        this.redirectToSSOLogin();
        return;
        }
        
        try {
        // 验证token有效性
        const response = await fetch('https://app1.example.com/api/auth/validate', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            this.setState({
            isAuthenticated: true,
            user: userData,
            isLoading: false
            });
        } else {
            // token无效，清除并重定向到登录
            localStorage.removeItem('auth_token');
            this.setState({ isLoading: false });
            this.redirectToSSOLogin();
        }
        } catch (error) {
        console.error('Token验证失败:', error);
        this.setState({ isLoading: false });
        this.redirectToSSOLogin();
        }
    };

    redirectToSSOLogin = () => {
        // 应用ID和回调URL
        const appId = 'app1';
        const callbackUrl = encodeURIComponent(window.location.origin);
        
        // 重定向到SSO登录
        window.location.href = `https://sso.example.com/login?appId=${appId}&callback=${callbackUrl}`;
    };

    handleLogout = () => {
        // 清除本地token
        localStorage.removeItem('auth_token');
        
        // 重定向到SSO登出页面
        const callbackUrl = encodeURIComponent(window.location.origin);
        window.location.href = `https://sso.example.com/logout?callback=${callbackUrl}`;
    };

    render() {
        const { isAuthenticated, user, isLoading } = this.state;

        if (isLoading) {
        return <div>加载中...</div>;
        }

        if (!isAuthenticated) {
        return <div>正在重定向到登录页面...</div>;
        }

        return (
        <div>
            <header>
            <p>欢迎, {user.name}</p>
            <button onClick={this.handleLogout}>退出登录</button>
            </header>
            <main>{/* 应用内容 */}</main>
        </div>
        );
    }
}
```
#### JWT登录页面
```js
// SSO服务器上的JWT登录页面
class JWTLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        username: '',
        password: '',
        error: null,
        isLoading: false
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: true, error: null });

        try {
        const { username, password } = this.state;
        
        // 获取URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const appId = urlParams.get('appId');
        const callbackUrl = urlParams.get('callback');
        
        if (!appId || !callbackUrl) {
            throw new Error('缺少必要的参数');
        }

        // 发送登录请求
        const response = await fetch('https://sso.example.com/api/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
            username, 
            password,
            appId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '登录失败');
        }

        // 获取JWT token
        const { token } = await response.json();
        
        // 重定向回应用，并带上token
        window.location.href = `${decodeURIComponent(callbackUrl)}?token=${token}`;
        } catch (error) {
        this.setState({ 
            error: error.message, 
            isLoading: false 
        });
        }
    };

    render() {
        const { username, password, error, isLoading } = this.state;

        return (
        <div className="login-container">
            <h2>统一登录平台</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                required
                />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
            </button>
            </form>
        </div>
        );
    }
}
```

### OAuth 2.0/OpenID Connect
标准化的授权框架，支持第三方应用授权。
#### 前端使用OAuth流程
```js
// 使用OAuth 2.0实现的SSO前端应用
class OAuthApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        isAuthenticated: false,
        user: null,
        isLoading: true
        };
        
        // OAuth配置
        this.oauthConfig = {
        clientId: 'your-client-id',
        redirectUri: `${window.location.origin}/callback`,
        authorizationEndpoint: 'https://sso.example.com/oauth/authorize',
        tokenEndpoint: 'https://sso.example.com/oauth/token',
        scope: 'profile email'
        };
    }

    componentDidMount() {
        // 检查是否在OAuth回调页面
        if (window.location.pathname === '/callback') {
        this.handleOAuthCallback();
        } else {
        this.checkAuthentication();
        }
    }

    checkAuthentication = () => {
        const accessToken = localStorage.getItem('access_token');
        const tokenExpiry = localStorage.getItem('token_expiry');
        
        // 检查token是否存在且未过期
        if (accessToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
        this.fetchUserInfo(accessToken);
        } else {
        // 清除过期token
        if (accessToken) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('refresh_token');
        }
        
        this.setState({ isLoading: false });
        }
    };

    fetchUserInfo = async (accessToken) => {
        try {
        const response = await fetch('https://sso.example.com/api/userinfo', {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            this.setState({
            isAuthenticated: true,
            user: userData,
            isLoading: false
            });
        } else {
            // token可能无效
            this.setState({ isLoading: false });
            this.initiateOAuthFlow();
        }
        } catch (error) {
        console.error('获取用户信息失败:', error);
        this.setState({ isLoading: false });
        }
    };

    handleOAuthCallback = async () => {
        // 从URL获取授权码
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        // 验证state防止CSRF攻击
        const savedState = localStorage.getItem('oauth_state');
        localStorage.removeItem('oauth_state');
        
        if (!code || state !== savedState) {
        this.setState({ 
            isLoading: false,
            error: '无效的OAuth回调'
        });
        return;
        }
        
        try {
        // 使用授权码获取访问令牌
        const tokenResponse = await fetch(this.oauthConfig.tokenEndpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.oauthConfig.redirectUri,
            client_id: this.oauthConfig.clientId
            })
        });
        
        if (!tokenResponse.ok) {
            throw new Error('获取访问令牌失败');
        }
        
        const tokenData = await tokenResponse.json();
        
        // 保存token
        localStorage.setItem('access_token', tokenData.access_token);
        localStorage.setItem('token_expiry', (new Date().getTime() + tokenData.expires_in * 1000).toString());
        
        if (tokenData.refresh_token) {
            localStorage.setItem('refresh_token', tokenData.refresh_token);
        }
        
        // 获取用户信息
        await this.fetchUserInfo(tokenData.access_token);
        
        // 重定向到应用首页
        window.history.replaceState({}, document.title, '/');
        } catch (error) {
        console.error('处理OAuth回调失败:', error);
        this.setState({ 
            isLoading: false,
            error: error.message
        });
        }
    };

    initiateOAuthFlow = () => {
        // 生成随机state参数防止CSRF攻击
        const state = Math.random().toString(36).substring(2);
        localStorage.setItem('oauth_state', state);
        
        // 构建授权URL
        const authUrl = new URL(this.oauthConfig.authorizationEndpoint);
        authUrl.searchParams.append('client_id', this.oauthConfig.clientId);
        authUrl.searchParams.append('redirect_uri', this.oauthConfig.redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', this.oauthConfig.scope);
        authUrl.searchParams.append('state', state);
        
        // 重定向到授权页面
        window.location.href = authUrl.toString();
    };

    handleLogout = async () => {
        // 清除本地存储的token
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('refresh_token');
        
        // 重定向到SSO登出页面
        window.location.href = `https://sso.example.com/logout?redirect_uri=${encodeURIComponent(window.location.origin)}`;
    };

    render() {
        const { isAuthenticated, user, isLoading, error } = this.state;

        if (isLoading) {
        return <div>加载中...</div>;
        }

        if (error) {
        return <div className="error-message">{error}</div>;
        }

        if (!isAuthenticated) {
        return (
            <div>
            <h2>请登录以继续</h2>
            <button onClick={this.initiateOAuthFlow}>使用SSO登录</button>
            </div>
        );
        }

        return (
        <div>
            <header>
            <p>欢迎, {user.name}</p>
            <button onClick={this.handleLogout}>退出登录</button>
            </header>
            <main>{/* 应用内容 */}</main>
        </div>
        );
    }
}
```

## 参考
- [**单点登录（SSO）全流程详解**](https://juejin.cn/post/7483708438683287587?searchId=20260227144327DB8E1105290557039F76)
- [**单点登录(SSO)看这一篇就够了！❤️这次不慌了**](https://juejin.cn/post/7044328327762411534?searchId=20251224150247409D0452EFB718BEC888)
- [**前端实现单点登录（SSO）**](https://juejin.cn/post/7282692430117748755?searchId=202602271449180E2B8246FA9EA6042485)
- [**单点登录（SSO）及实现方案**](https://juejin.cn/post/7195588906809032764?searchId=20251224150247409D0452EFB718BEC888)
