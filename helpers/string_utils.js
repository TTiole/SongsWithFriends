const makeid = (length, charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") => {
  let result           = '';
  let charactersLength = charset.length;
  for ( let i = 0; i < length; i++ ) {
     result += charset.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  makeid
}