const removeAuth = () => {
  localStorage.removeItem('userData')
  localStorage.removeItem('accessToken');
}
export { removeAuth }