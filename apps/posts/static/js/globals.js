window.isLoadingPosts = false;
window.isLoadingComments = true;
window.postsContainer = null;
window.commentsContainer = document.querySelector('.comments-container');
window.lastQuery = '';
window.selectedFile = null;
window.postFilter = null;
window.postType = null;
window.nextPostsPageUrl = null;
window.nextCommentsPageUrl = null;
window.path = window.location.pathname;
window.moreCommentsButton = null

//if (!postsContainer.innerHTML.trim()) {
//    postsContainer.style.display = 'none'
//}