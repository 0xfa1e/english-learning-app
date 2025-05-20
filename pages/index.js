// 简单的Next.js入口点，重定向到主HTML页面
export default function Home() {
  // 如果在服务器端渲染，不执行重定向
  if (typeof window !== 'undefined') {
    window.location.href = '/index.html';
  }
  
  return (
    <div>
      <p>Redirecting to main application...</p>
    </div>
  );
}
