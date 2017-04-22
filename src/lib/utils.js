const hashcode = (input) => {
  let hash = 0, i, chr
  if (input.length === 0) return hash
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

const run = async (func, ...args) => {
  try {
    const value = await func(...args)
    return { value }
  } catch(error) {
    return { error }
  }
}

module.exports = {
  hashcode,
  run
}
