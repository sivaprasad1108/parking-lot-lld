let counter = 0

exports.IdGenerator = {
  next: (prefix) => {
    prefix = prefix || ''
    counter += 1
    return (prefix + Date.now().toString(36) + counter).toUpperCase()
  }
}
