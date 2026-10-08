// ==================== 交互功能 ====================

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== 导航栏效果 ====================
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  // 滚动时改变导航栏样式
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // 移动端菜单切换
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // 点击导航链接后关闭移动菜单
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
  
  // ==================== 作品筛选功能 ====================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      
      workCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // ==================== 滚动显示动画 (Intersection Observer) ====================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // 为作品卡片添加延迟动画
        if (entry.target.classList.contains('work-card')) {
          const cards = [...document.querySelectorAll('.work-card')];
          const index = cards.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  workCards.forEach(card => observer.observe(card));
  
  // 也观察其他区块标题
  document.querySelectorAll('.section-header, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
  });
  
  // 修改观察器回调以处理这些元素
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.section-header, .about-content, .contact-content').forEach(el => {
    sectionObserver.observe(el);
  });
  
  // ==================== 平滑滚动（增强版）====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==================== 表单处理 ====================
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const message = this.querySelector('textarea').value;
      
      // 简单验证
      if (!name || !email || !message) {
        showNotification('请填写所有必填字段', 'error');
        return;
      }
      
      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('请输入有效的邮箱地址', 'error');
        return;
      }
      
      // 模拟发送（实际项目中这里会发送到服务器）
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '发送中...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification('消息已成功发送！我会尽快回复您。', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
  
  // ==================== 通知提示函数 ====================
  function showNotification(message, type = 'info') {
    // 移除已有通知
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    // 样式
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '12px',
      background: type === 'success' ? 'linear-gradient(135deg, #00b894, #00cec9)' : 
                 type === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 
                 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#ffffff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      zIndex: '9999',
      transform: 'translateX(120%)',
      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      maxWidth: '400px',
      fontFamily: 'inherit'
    });
    
    // 关闭按钮样式
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      fontSize: '1.5rem',
      cursor: 'pointer',
      opacity: '0.7',
      padding: '0',
      lineHeight: '1'
    });
    
    document.body.appendChild(notification);
    
    // 动画显示
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // 关闭事件
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => notification.remove(), 400);
    });
    
    // 自动消失
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
      }
    }, 5000);
  }
  
  // ==================== 鼠标跟随光效（可选增强）====================
  let glowEffect = document.createElement('div');
  glowEffect.className = 'mouse-glow';
  Object.assign(glowEffect.style, {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease'
  });
  document.body.appendChild(glowEffect);
  
  document.addEventListener('mousemove', (e) => {
    glowEffect.style.left = e.clientX + 'px';
    glowEffect.style.top = e.clientY + 'px';
  });
  
  // ==================== 数字计数动画（统计数字等场景可用）====================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    let startTime = null;
    
    function update(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);
      
      element.textContent = current + '+';
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  console.log('🎨 Portfolio 交互式展示册加载完成！');
});
