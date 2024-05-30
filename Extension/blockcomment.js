// 等待页面加载完成
window.addEventListener('load', function() {
    // 使用MutationObserver监视DOM变化，因为YouTube使用动态加载内容
    const observer = new MutationObserver(hideComments);
    observer.observe(document.body, { childList: true, subtree: true });
  
    // 定义隐藏留言区块的函数
    function hideComments() {
      const commentSection = document.getElementById('comments');
      if (commentSection) {
        commentSection.style.display = 'none';
      }
    }
  
    // 初始隐藏留言区块
    hideComments();
  });
  